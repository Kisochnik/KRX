import os
from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
)
from werkzeug.utils import secure_filename
from datetime import datetime, timezone

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__, static_folder="static", template_folder="templates")

# Config
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///krx.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev-change-me")

UPLOAD_FOLDER = os.path.join(app.static_folder, "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024  # 10MB

db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

ALLOWED_IMAGE_EXTENSIONS = {"png", "jpg", "jpeg", "webp", "gif"}


def _json_error(message: str, status: int = 400):
    return jsonify({"ok": False, "error": message}), status


def allowed_file(filename: str) -> bool:
    if "." not in filename:
        return False
    ext = filename.rsplit(".", 1)[1].lower()
    return ext in ALLOWED_IMAGE_EXTENSIONS


def parse_birth_date(value: str) -> datetime | None:
    # Accept ISO: YYYY-MM-DD
    try:
        dt = datetime.strptime(value, "%Y-%m-%d").replace(tzinfo=timezone.utc)
        return dt
    except Exception:
        return None


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)

    avatar_path = db.Column(db.String(255), nullable=True)

    birth_date = db.Column(db.DateTime(timezone=True), nullable=True)

    is_admin = db.Column(db.Boolean, default=False, nullable=False)

    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    def verify_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)


def validate_registration_payload(data: dict, files) -> tuple[dict, str | None]:
    # Strict validation to prevent server crashes on empty fields
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    birth_date_raw = (data.get("birth_date") or "").strip()

    if not name:
        return {}, "Имя обязательно"
    if len(name) < 2 or len(name) > 64:
        return {}, "Имя должно быть от 2 до 64 символов"
    if not email:
        return {}, "Почта обязательна"
    if "@" not in email or "." not in email:
        return {}, "Некорректная почта"
    if not password:
        return {}, "Пароль обязателен"
    if len(password) < 6:
        return {}, "Пароль должен быть минимум 6 символов"
    if not birth_date_raw:
        return {}, "Дата рождения обязательна"

    birth_dt = parse_birth_date(birth_date_raw)
    if birth_dt is None:
        return {}, "Дата рождения должна быть в формате YYYY-MM-DD"

    avatar_file = files.get("avatar") if files else None
    avatar_path = None
    if avatar_file and getattr(avatar_file, "filename", ""):
        filename = avatar_file.filename
        if not allowed_file(filename):
            return {}, "Неверный формат аватара"
        safe = secure_filename(filename)
        avatar_path = f"uploads/{datetime.now().strftime('%Y%m%d_%H%M%S')}_{safe}"
    return {"name": name, "email": email, "password": password, "birth_dt": birth_dt, "avatar_path": avatar_path}, None


@app.get("/")
def index():
    # Minimal landing while UI builds later
    return """
    <html><head><meta charset="utf-8"><title>KVARON_X</title></head>
    <body style="font-family:Arial;background:#000;color:#fff;padding:40px">
      <h1 style="color:#fff">KVARON_X (KRX)</h1>
      <p>Сервер запущен. Проверяйте /api/auth/register и /api/auth/login.</p>
      <p>Аватары загружаются в /static/uploads</p>
    </body></html>
    """


@app.route("/api/auth/register", methods=["POST"])
def register():
    # Works with multipart/form-data for avatar
    try:
        data = request.form.to_dict() if request.form else {}
        payload, err = validate_registration_payload(data, request.files)
        if err:
            return _json_error(err, 400)

        existing = User.query.filter((User.name == payload["name"]) | (User.email == payload["email"])).first()
        if existing:
            return _json_error("Пользователь с таким именем или почтой уже существует", 409)

        avatar_path = payload["avatar_path"]
        if avatar_path:
            avatar_file = request.files.get("avatar")
            os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
            avatar_file.save(os.path.join(app.static_folder, avatar_path))
        user = User(
            name=payload["name"],
            email=payload["email"],
            password_hash=generate_password_hash(payload["password"]),
            avatar_path=avatar_path,
            birth_date=payload["birth_dt"],
        )
        db.session.add(user)
        db.session.commit()

        return jsonify({"ok": True, "user": {"id": user.id, "name": user.name, "email": user.email}})
    except Exception as e:
        # Never expose internals; log could be added
        return _json_error("Ошибка регистрации", 500)


@app.route("/api/auth/login", methods=["POST"])
def login():
    try:
        data = request.get_json(silent=True) or {}
        name = (data.get("name") or "").strip()
        password = data.get("password") or ""

        if not name:
            return _json_error("Имя обязательно", 400)
        if not password:
            return _json_error("Пароль обязателен", 400)

        user = User.query.filter_by(name=name).first()
        if not user or not user.verify_password(password):
            return _json_error("Неверное имя или пароль", 401)

        token = create_access_token(identity=str(user.id))
        return jsonify({"ok": True, "access_token": token, "user": {"id": user.id, "name": user.name, "avatar_path": user.avatar_path}})
    except Exception:
        return _json_error("Ошибка входа", 500)


@app.route("/api/auth/forgot-password", methods=["POST"])
def forgot_password():
    # Placeholder: should integrate email sending later
    try:
        data = request.get_json(silent=True) or {}
        email = (data.get("email") or "").strip().lower()
        if not email:
            return _json_error("Почта обязательна", 400)
        # Do not reveal if email exists
        return jsonify({"ok": True, "message": "Если почта существует, мы отправим инструкции."})
    except Exception:
        return _json_error("Ошибка запроса", 500)


@app.route("/api/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        return _json_error("Пользователь не найден", 404)
    return jsonify({"ok": True, "user": {"id": user.id, "name": user.name, "email": user.email, "avatar_path": user.avatar_path}})


@app.errorhandler(413)
def file_too_large(e):
    return _json_error("Файл слишком большой (макс 10MB)", 413)


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5000")), debug=True)
