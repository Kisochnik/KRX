from flask import Flask, render_template, request, redirect, session, jsonify, send_file
from database import (db, User, Post, Like, Comment, FriendRequest, Message,
                      Follow, BanRecord, ShopItem, Purchase, Notification,
                      Group, GroupMember, GroupMessage, LFGPost,
                      Tournament, Track, TrackLike, Playlist, PlaylistItem, LibraryTrack,
                      TgChatMember, Report, AuditLog, Transaction,
                      Chat, ChatMember, MessageReaction,
                      Poll, PollOption, PollVote)
import os, random, string, smtplib, sqlite3
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta

app = Flask(__name__)
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(BASE_DIR, 'instance', 'krx.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'connect_args': {
        'timeout': 30,
        'check_same_thread': False,
    }
}
app.config['SECRET_KEY'] = 'krx_secret_2024'
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['SHOP_FOLDER'] = 'static/shop'
app.config['MAX_CONTENT_LENGTH'] = 200 * 1024 * 1024

MAIL_FROM = 'kisparbiznes@gmail.com'
MAIL_PASSWORD = 'KisPar_1_2026'
ADMIN_TG_ID = '7929358879'
BOT_TOKEN = '8729170777:AAH2iDgyGbeB7xZHqAlvbTKgiPpzVZH0ecE'

ALLOWED_IMG = {'png', 'jpg', 'jpeg', 'webp'}
ALLOWED_GIF = {'gif'}
ALLOWED_VID = {'mp4', 'mov', 'avi', 'webm'}
ALLOWED_AUD = {'mp3', 'ogg', 'wav', 'm4a', 'flac'}
ADMIN_NAMES = {'Kvarden', 'Baron_Kosyaka'}
VERIFIED_NAMES = {'Kvarden', 'Baron_Kosyaka'}
AUDIO_FOLDER = 'static/music/audio'
COVERS_FOLDER = 'static/music/covers'

SHOP_TYPE_LABELS = {
    'avatar':     ('👤', 'Аватарки'),
    'banner':     ('🖼️', 'Баннеры'),
    'frame':      ('✨', 'Рамки'),
    'wallpaper':  ('🏞️', 'Обои профиля'),
    'effect':     ('🌟', 'Эффекты профиля'),
    'nick_color': ('🎨', 'Цвет ника'),
}


db.init_app(app)


def migrate_database_schema():
    db_path = os.path.join(BASE_DIR, 'instance', 'krx.db')
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("PRAGMA table_info(user)")
    existing_columns = {row[1] for row in cur.fetchall()}
    new_columns = {
        'hide_online': 'BOOLEAN DEFAULT 0',
        'hide_level': 'BOOLEAN DEFAULT 0',
        'hide_birthday': 'BOOLEAN DEFAULT 0',
        'password_reset_code': "VARCHAR(10) DEFAULT ''",
        'tg_login_code': "VARCHAR(10) DEFAULT ''",
        'profile_effect': "VARCHAR(100) DEFAULT ''",
        'nick_color': "VARCHAR(20) DEFAULT ''",
    }
    for column, definition in new_columns.items():
        if column not in existing_columns:
            try:
                cur.execute(f"ALTER TABLE user ADD COLUMN {column} {definition}")
            except Exception as e:
                print(f'[DB MIGRATION ERROR] {column}: {e}')
    conn.commit()
    conn.close()

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("PRAGMA table_info(track)")
    existing_track_columns = {row[1] for row in cur.fetchall()}
    track_new_columns = {
        'copyright_type': "VARCHAR(30) DEFAULT 'own'",
        'copyright_owner': "VARCHAR(200) DEFAULT ''",
        'copyright_url': "VARCHAR(300) DEFAULT ''",
    }
    for column, definition in track_new_columns.items():
        if column not in existing_track_columns:
            try:
                cur.execute(f"ALTER TABLE track ADD COLUMN {column} {definition}")
            except Exception as e:
                print(f'[DB MIGRATION ERROR] track.{column}: {e}')
    conn.commit()
    conn.close()

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("PRAGMA table_info(message)")
    existing_message_columns = {row[1] for row in cur.fetchall()}
    message_new_columns = {
        'chat_id': 'INTEGER',
        'msg_type': "VARCHAR(20) DEFAULT 'text'",
        'media_file': "VARCHAR(300) DEFAULT ''",
        'is_deleted': 'BOOLEAN DEFAULT 0',
        'is_edited': 'BOOLEAN DEFAULT 0',
        'edited_at': 'DATETIME NULL',
    }
    for column, definition in message_new_columns.items():
        if column not in existing_message_columns:
            try:
                cur.execute(f"ALTER TABLE message ADD COLUMN {column} {definition}")
            except Exception as e:
                print(f'[DB MIGRATION ERROR] message.{column}: {e}')
    conn.commit()
    conn.close()


def seed_shop_items():
    if ShopItem.query.count() > 0:
        return
    demo_items = [
        {
            'name': 'Активный аватар',
            'description': 'Анимированная аватарка для профиля',
            'item_type': 'avatar',
            'filename': 'avatar_1777215360.gif',
            'preview': 'avatar_1777215360.gif',
            'price_kp': 40,
        },
        {
            'name': 'Игровой баннер',
            'description': 'Баннер для оформления профиля',
            'item_type': 'banner',
            'filename': 'banner_1777215375.gif',
            'preview': 'banner_1777215375.gif',
            'price_kp': 60,
        },
        {
            'name': 'Неоновый ник',
            'description': 'Изменяет цвет вашего ника в интерфейсе',
            'item_type': 'nick_color',
            'filename': '#ff6ec7',
            'preview': '',
            'price_kp': 25,
        },
    ]
    for item in demo_items:
        db.session.add(ShopItem(**item))
    db.session.commit()


def seed_gaming_content(user):
    if Group.query.count() > 0 or LFGPost.query.count() > 0:
        return
    group1 = Group(name='KRX Gaming Squad', description='Здесь собираются тиммейты для ранкеда и фанов.', game_tag='Valorant', need_mic=True, owner_id=user.id)
    group2 = Group(name='Команда киберспортсменов', description='Группа для обсуждения турниров и оперативных игр.', game_tag='CS2', need_mic=False, owner_id=user.id)
    db.session.add(group1)
    db.session.add(group2)
    db.session.commit()
    db.session.add(GroupMember(group_id=group1.id, user_id=user.id))
    db.session.add(GroupMember(group_id=group2.id, user_id=user.id))
    db.session.add(LFGPost(user_id=user.id, game='Valorant', mode='Рейтинговая', rank_level='Высокий', need_mic=True, description='Ищу тиммейтов для ранкеда. Быстрая игра с голосом.'))
    db.session.add(LFGPost(user_id=user.id, game='CS2', mode='Коворк', rank_level='Средний', need_mic=False, description='Расслабленная партия 5 на 5, нужны носители стратегии.'))
    db.session.commit()


def seed_music_content(user):
    if Track.query.filter_by(is_public=True).count() > 0:
        return
    audio_folder = os.path.join(BASE_DIR, 'static', 'music', 'audio')
    os.makedirs(audio_folder, exist_ok=True)
    demo_path = os.path.join(audio_folder, 'sample_track.wav')
    if not os.path.exists(demo_path):
        import wave
        import struct
        with wave.open(demo_path, 'w') as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(22050)
            samples = [0] * 22050
            wf.writeframes(b''.join(struct.pack('<h', s) for s in samples))
    db.session.add(Track(
        user_id=user.id,
        title='KRX Demo Beat',
        artist='KRX Studio',
        genre='gaming',
        description='Пример трека для музыкального раздела сайта.',
        filename='sample_track.wav',
        cover='cover_2_1776785739.png',
        duration=10,
        is_public=True,
        copyright_type='free',
        copyright_owner='KRX',
        copyright_url='',
    ))
    db.session.commit()


def seed_poll_content(user):
    if Poll.query.count() > 0:
        return
    p1 = Poll(user_id=user.id, question='Какую музыку ты хочешь услышать в KRX сегодня?', is_public=True)
    db.session.add(p1); db.session.commit()
    for option in ['Lo-fi \u2014 спокойный бит', 'EDM \u2014 танцевальный ритм', 'Rap & Trap \u2014 энергично', 'Rock & Metal \u2014 мощно']:
        db.session.add(PollOption(poll_id=p1.id, text=option))
    p2 = Poll(user_id=user.id, question='Где ты чаще всего играешь с друзьями?', is_public=True)
    db.session.add(p2); db.session.commit()
    for option in ['В Discord', 'В голосовом чате игры', 'В Telegram', 'В личных звонках']:
        db.session.add(PollOption(poll_id=p2.id, text=option))
    db.session.commit()


os.makedirs('static/uploads', exist_ok=True)
os.makedirs('static/shop/avatars', exist_ok=True)
os.makedirs('static/shop/banners', exist_ok=True)
os.makedirs('static/shop/frames', exist_ok=True)
os.makedirs('static/music/audio', exist_ok=True)
os.makedirs('static/music/covers', exist_ok=True)
os.makedirs('static/shop/wallpapers', exist_ok=True)
os.makedirs('static/shop/effects', exist_ok=True)
os.makedirs('static/shop/nick_colors', exist_ok=True)

with app.app_context():
    db.create_all()
    migrate_database_schema()
    seed_shop_items()

GENRES = [
    ('pop','🎤 Поп'),('pop_rock','🎸 Поп-рок'),('europop','🇪🇺 Европоп'),
    ('kpop','🇰🇷 К-поп'),('synthpop','🎹 Синти-поп'),('disco','🪩 Диско'),
    ('rock','🎸 Рок'),('alternative','🔀 Альтернатива'),('metal','🤘 Метал'),
    ('punk','⚡ Панк'),('hard_rock','🔥 Хард-рок'),('indie_rock','🎵 Инди-рок'),
    ('prog_rock','🧠 Прог-рок'),('edm','🎛 EDM'),('house','🏠 Хаус'),
    ('trance','🌀 Транс'),('techno','⚙️ Техно'),('dubstep','💥 Дабстеп'),
    ('dnb','🥁 Drum & Bass'),('ambient','🌙 Ambient'),('synthwave','🌆 Synthwave'),
    ('hiphop','🎤 Хип-хоп'),('trap','🔫 Трэп'),('phonk','🔥 Phonk'),
    ('oldschool','📼 Олдскул'),('gangsta','🏙️ Гангста'),('jazz','🎷 Джаз'),
    ('swing','🎩 Свинг'),('bebop','🎺 Бибоп'),('jazz_fusion','🔀 Джаз-фьюжн'),
    ('blues','🎸 Блюз'),('rnb','🎵 R&B'),('classical','🎻 Классика'),
    ('symphony','🎼 Симфония'),('opera','🎭 Опера'),('folk','🌿 Фолк'),
    ('country','🤠 Кантри'),('celtic','☘️ Кельтская'),('ethno','🌍 Этно'),
    ('gaming','🎮 Gaming'),('lofi','☕ Lo-fi'),('reggae','🌴 Регги'),
    ('chanson','🥐 Шансон'),('other','🎵 Другое'),
]

LEVEL_TITLES = [
    (0,'Новичок KRX','Только начал путь'),
    (5,'Первый Контакт','Добавил первых друзей'),
    (10,'Активный Юзер','Уже в теме'),
    (15,'Социальный Kisper','Получена рамка'),
    (20,'Завсегдатай','Постоянно в ленте'),
    (25,'Музыкальный Энтузиаст','Добавляет треки'),
    (30,'Популярный','Растёт аудитория'),
    (35,'Опытный KRXian','Уже не новичок'),
    (40,'Король Лайков','Мастер вовлечения'),
    (45,'Локальная Легенда','Известен в своей тусовке'),
    (50,'KRX Veteran','Можно поставить баннер'),
    (55,'Коннектор','Мастер связей'),
    (60,'Трендсеттер','Задаёт тренды'),
    (65,'Элита KRX','Один из лучших'),
    (70,'Легенда Платформы','О тебе уже говорят'),
    (75,'Мастер Сообщества','Сердце KRX'),
    (80,'Grand KRXian','Можно анимация ава'),
    (85,'Immortal','Почти бессмертный'),
    (90,'KRX Overlord','Властелин платформы'),
    (95,'God Tier','Бог уровня'),
    (100,'KRX God / Абсолют','Максимальный уровень. Легенда навсегда'),
]

def calc_level(xp):
    thresholds = [
        (0,0),(20,1),(50,2),(100,3),(180,4),(300,5),(500,6),(800,7),(1200,8),(1800,9),
        (2600,10),(3700,11),(5200,12),(7200,13),(9800,14),(13000,15),(17000,16),(22000,17),
        (28000,18),(36000,19),(46000,20),(58000,21),(73000,22),(91000,23),(113000,24),
        (140000,25),(172000,26),(210000,27),(255000,28),(308000,29),(370000,30),
        (443000,31),(528000,32),(627000,33),(742000,34),(875000,35),(1028000,36),
        (1203000,37),(1403000,38),(1631000,39),(1890000,40),(2184000,41),(2517000,42),
        (2893000,43),(3316000,44),(3790000,45),(4320000,46),(4912000,47),(5572000,48),
        (6306000,49),(7120000,50),(8020000,51),(9014000,52),(10108000,53),(11310000,54),
        (12628000,55),(14070000,56),(15644000,57),(17360000,58),(19228000,59),(21258000,60),
        (23462000,61),(25852000,62),(28440000,63),(31240000,64),(34264000,65),(37528000,66),
        (41046000,67),(44834000,68),(48908000,69),(53284000,70),(57980000,71),(63012000,72),
        (68400000,73),(74162000,74),(80318000,75),(86890000,76),(93900000,77),(101372000,78),
        (109330000,79),(117800000,80),(126808000,81),(136382000,82),(146550000,83),
        (157342000,84),(168790000,85),(180928000,86),(193790000,87),(207412000,88),
        (221832000,89),(237090000,90),(253228000,91),(270290000,92),(288322000,93),
        (307372000,94),(327490000,95),(348728000,96),(371140000,97),(394782000,98),
        (419712000,99),(446000000,100),
    ]
    lvl = 0
    for xp_req, level in thresholds:
        if xp >= xp_req: lvl = level
        else: break
    title = 'Новичок KRX'
    for req_lvl, t, _ in reversed(LEVEL_TITLES):
        if lvl >= req_lvl:
            title = t
            break
    return lvl, title

def get_next_xp(xp):
    thresholds = [
        20,50,100,180,300,500,800,1200,1800,2600,3700,5200,7200,9800,13000,
        17000,22000,28000,36000,46000,58000,73000,91000,113000,140000,172000,
        210000,255000,308000,370000,443000,528000,627000,742000,875000,1028000,
        1203000,1403000,1631000,1890000,2184000,2517000,2893000,3316000,3790000,
        4320000,4912000,5572000,6306000,7120000,446000000
    ]
    for t in thresholds:
        if xp < t: return t
    return 446000000

def can_use_banner(user): return user.level >= 50 or user.is_verified or user.is_admin
def can_use_gif_avatar(user): return user.level >= 80 or user.is_verified or user.is_admin

def send_email(to, subject, html_body):
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = f'KRX <{MAIL_FROM}>'
        msg['To'] = to
        msg.attach(MIMEText(html_body, 'html'))
        with smtplib.SMTP('smtp.gmail.com', 587) as s:
            s.starttls(); s.login(MAIL_FROM, MAIL_PASSWORD); s.send_message(msg)
        return True
    except Exception as e:
        print(f'[EMAIL ERROR] {e}')
        return False

def email_welcome(user):
    send_email(user.email, 'Добро пожаловать в KRX!', f'''
<div style="background:#0a0a0a;color:#fff;padding:30px;font-family:sans-serif;max-width:500px;margin:0 auto;border-radius:16px;">
  <h1 style="color:#e0245e;">KRX</h1><h2>Привет, {user.username}! 👋</h2>
  <p style="color:#aaa;">Ты успешно зарегистрировался.</p>
  <div style="background:#111;border-radius:12px;padding:16px;margin-top:16px;">
    <p>👤 Ник: <b style="color:#e0245e;">{user.username}</b></p>
    <p>📧 Email: <b>{user.email}</b></p>
  </div>
  <a href="http://127.0.0.1:5000" style="display:inline-block;margin-top:16px;background:#e0245e;color:#fff;padding:12px 28px;border-radius:999px;text-decoration:none;font-weight:700;">Войти в KRX</a>
</div>''')

def email_code_send(user, code, subject, reason):
    send_email(user.email, f'KRX — {subject}', f'''
<div style="background:#0a0a0a;color:#fff;padding:30px;font-family:sans-serif;max-width:500px;margin:0 auto;border-radius:16px;">
  <h1 style="color:#e0245e;">KRX</h1><h2>Привет, {user.username}!</h2>
  <p style="color:#aaa;">{reason}</p>
  <div style="background:#0f0f1a;border:2px solid #e0245e;border-radius:12px;padding:24px;margin-top:16px;text-align:center;">
    <h1 style="color:#e0245e;font-size:48px;letter-spacing:14px;margin:0;">{code}</h1>
  </div>
</div>''')

def email_password_changed(user, new_pw):
    send_email(user.email, 'KRX — Пароль изменён', f'''
<div style="background:#0a0a0a;color:#fff;padding:30px;font-family:sans-serif;max-width:500px;margin:0 auto;border-radius:16px;">
  <h1 style="color:#e0245e;">KRX</h1><h2>Пароль изменён</h2>
  <p>Новый пароль: <b style="color:#e0245e;">{new_pw}</b></p>
</div>''')

def gen_code(n=6): return ''.join(random.choices(string.digits, k=n))
def gen_tg_token(): return 'TG_' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=12))

def allowed_file(filename):
    ext = filename.rsplit('.', 1)[-1].lower() if '.' in filename else ''
    return ext, ext in ALLOWED_IMG | ALLOWED_GIF | ALLOWED_VID | ALLOWED_AUD

def get_media_type(ext):
    if ext in ALLOWED_IMG | ALLOWED_GIF: return 'image'
    if ext in ALLOWED_VID: return 'video'
    return ''

def get_friends(user_id):
    sent = FriendRequest.query.filter_by(from_user_id=user_id, status='accepted').all()
    received = FriendRequest.query.filter_by(to_user_id=user_id, status='accepted').all()
    friends, ids = [], set()
    for r in sent:
        u = User.query.get(r.to_user_id)
        if u and u.id not in ids: friends.append(u); ids.add(u.id)
    for r in received:
        u = User.query.get(r.from_user_id)
        if u and u.id not in ids: friends.append(u); ids.add(u.id)
    return friends

def is_online(user):
    if not user.last_seen: return False
    return datetime.utcnow() - user.last_seen < timedelta(minutes=5)

def can_post_xp(user):
    today = datetime.utcnow().strftime('%Y-%m-%d')
    if user.last_post_date != today:
        user.posts_today = 0; user.last_post_date = today
    return user.posts_today < 5

def add_xp(user, amount):
    user.xp += amount
    lvl, title = calc_level(user.xp)
    user.level = lvl; user.title = title
    db.session.commit()

def add_notification(user_id, from_user_id, notif_type, text):
    db.session.add(Notification(user_id=user_id, from_user_id=from_user_id,
                                notif_type=notif_type, text=text))
    db.session.commit()

def audit(admin_id, action, target=''):
    db.session.add(AuditLog(admin_id=admin_id, action=action, target=str(target)))
    db.session.commit()

def send_tg_report_alert(report, post, reporter):
    try:
        import requests
        BOT_TOKEN = '8729170777:AAH2iDgyGbeB7xZHqAlvbTKgiPpzVZH0ecE'
        chat_id = ADMIN_TG_ID
        text = (
            f'⚠️ Новая жалоба #{report.id}\n'
            f'Пост: {post.content[:80]}...\n'
            f'Автор: {post.user.username}\n'
            f'Жалоба от: {reporter.username}\n'
            f'Причина: {report.reason}'
        )
        kb = {'inline_keyboard': [[
            {'text': '🗑 Удалить пост', 'callback_data': f'del_post_{post.id}'},
            {'text': '✓ Проигнорировать', 'callback_data': f'ignore_report_{report.id}'}
        ]]}
        import json
        requests.post(
            f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage',
            json={'chat_id': chat_id, 'text': text, 'reply_markup': kb},
            timeout=5
        )
    except Exception as e:
        print(f'[TG ALERT ERROR] {e}')

def send_tg_user_report_alert(target, reporter, reason):
    try:
        import requests
        BOT_TOKEN = '8729170777:AAH2iDgyGbeB7xZHqAlvbTKgiPpzVZH0ecE'
        chat_id = ADMIN_TG_ID
        text = (
            f'⚠️ Новая жалоба на профиль\n'
            f'Профиль: @{target.username}\n'
            f'От: @{reporter.username}\n'
            f'Причина: {reason}'
        )
        requests.post(
            f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage',
            json={'chat_id': chat_id, 'text': text},
            timeout=5
        )
    except Exception as e:
        print(f'[TG ALERT ERROR] {e}')

def setup_special_user(user):
    if user.username in ADMIN_NAMES:
        user.is_admin = True; user.badge = 'founder'
    if user.username in VERIFIED_NAMES:
        user.is_verified = True

def get_client_ip():
    return request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr)

def get_avatar_url(user):
    if not user.avatar or user.avatar == 'default_avatar.jpg': return '/static/default_avatar.jpg'
    if user.avatar.startswith('__shop__/'): return f'/static/shop/avatars/{user.avatar[9:]}'
    return f'/static/uploads/{user.avatar}'

def get_banner_url(user):
    if not user.banner or user.banner == 'default_banner.jpg': return '/static/default_banner.jpg'
    if user.banner.startswith('__shop__/'): return f'/static/shop/banners/{user.banner[9:]}'
    if user.banner.startswith('__color__'): return user.banner  # CSS color value
    return f'/static/uploads/{user.banner}'

def get_banner_color(user):
    if user.banner and user.banner.startswith('__color__'):
        return user.banner[9:]
    return None

def user_has_item(user_id, item_id):
    return Purchase.query.filter_by(user_id=user_id, item_id=item_id).first() is not None

def get_inventory(user_id): return Purchase.query.filter_by(user_id=user_id).all()
def get_unread_notifs(user_id): return Notification.query.filter_by(user_id=user_id, is_read=False).count()

def get_audio_duration(filepath):
    try:
        import mutagen
        f = mutagen.File(filepath)
        if f and hasattr(f, 'info'): return int(f.info.length)
    except: pass
    return 0


@app.before_request
def track_activity():
    if 'user_id' in session:
        u = User.query.get(session['user_id'])
        if u:
            if u.is_banned: session.clear(); return redirect('/login')
            u.last_seen = datetime.utcnow()
            u.last_ip = get_client_ip()
            db.session.commit()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    lang = request.args.get('lang', 'ru')
    error = None
    if request.method == 'POST':
        username = request.form['username'].strip()
        email = request.form['email'].strip()
        password = request.form['password']
        birthday = request.form.get('birthday', '')
        lang = request.form.get('lang', 'ru')
        if len(password) < 8: error = 'Пароль минимум 8 символов!'
        elif User.query.filter_by(username=username).first(): error = 'Ник уже занят!'
        elif User.query.filter_by(email=email).first(): error = 'Email уже зарегистрирован!'
        else:
            user = User(username=username, email=email, password=password, birthday=birthday, kp=100, lang=lang)
            db.session.add(user); db.session.commit()
            setup_special_user(user); db.session.commit()
            session['user_id'] = user.id
            email_welcome(user)
            return redirect('/feed')
    return render_template('register.html', error=error, lang=lang)


@app.route('/login', methods=['GET', 'POST'])
def login():
    lang = request.args.get('lang', 'ru')
    error = success = None
    require_2fa = False
    user_pending = None
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '')
        code_input = request.form.get('code', '').strip()
        lang = request.form.get('lang', 'ru')

        if code_input:
            login_user_id = session.get('login_2fa_user')
            user = User.query.get(login_user_id) if login_user_id else None
            if user and code_input == user.tg_login_code:
                user.tg_login_code = ''
                db.session.commit()
                session['user_id'] = user.id
                session.pop('login_2fa_user', None)
                return redirect('/feed')
            error = 'Неверный код!'
        else:
            user = User.query.filter_by(username=username, password=password).first()
            if user:
                if user.is_banned:
                    error = 'Аккаунт заблокирован!'
                elif user.tg_id:
                    # 2FA через ТГ
                    code = gen_code(6)
                    user.tg_login_code = code
                    db.session.commit()
                    try:
                        import requests as rlib
                        rlib.post(f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage',
                                  json={'chat_id': user.tg_id, 'text': f'KRX — Вход в аккаунт\n\nКод подтверждения: {code}\n\nВведи этот код на сайте для входа.'})
                        session['login_2fa_user'] = user.id
                        require_2fa = True
                        success = 'Код отправлен в Telegram!'
                    except Exception as e:
                        print(f'[LOGIN TG ERROR] {e}')
                        error = 'Ошибка отправки кода в Telegram!'
                else:
                    session['user_id'] = user.id
                    return redirect('/feed')
            else:
                error = 'Неверный логин или пароль'
    return render_template('login.html', error=error, success=success, lang=lang, require_2fa=require_2fa)


@app.route('/logout')
def logout(): session.clear(); return redirect('/login')


@app.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    error = success = None
    if request.method == 'POST':
        username_or_email = request.form.get('username_or_email', '').strip()
        user = User.query.filter((User.username == username_or_email) | (User.email == username_or_email)).first()
        if not user:
            error = 'Пользователь не найден!'
        else:
            code = gen_code(6)
            if user.tg_id:
                # Отправить в ТГ
                try:
                    import requests as rlib
                    rlib.post(f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage',
                              json={'chat_id': user.tg_id, 'text': f'KRX — Восстановление пароля\n\nКод: {code}\n\nИспользуй этот код для сброса пароля.'})
                    user.password_reset_code = code
                    db.session.commit()
                    success = 'Код отправлен в Telegram!'
                except:
                    error = 'Ошибка отправки в Telegram!'
            else:
                # Отправить на email
                if email_code_send(user, code, 'Восстановление пароля', 'Используй этот код для сброса пароля.'):
                    user.password_reset_code = code
                    db.session.commit()
                    success = 'Код отправлен на email!'
                else:
                    error = 'Не удалось отправить код на почту.'
    return render_template('forgot_password.html', error=error, success=success)


@app.route('/reset-password', methods=['GET', 'POST'])
def reset_password():
    error = success = None
    if request.method == 'POST':
        username_or_email = request.form.get('username_or_email', '').strip()
        code = request.form.get('code', '').strip()
        new_pw = request.form.get('new_password', '')
        user = User.query.filter((User.username == username_or_email) | (User.email == username_or_email)).first()
        if not user or user.password_reset_code != code:
            error = 'Неверный код или пользователь!'
        elif len(new_pw) < 8:
            error = 'Пароль минимум 8 символов!'
        else:
            user.password = new_pw
            user.password_reset_code = ''
            db.session.commit()
            email_password_changed(user, new_pw)
            success = 'Пароль изменён! <a href="/login">Войти</a>'
    return render_template('reset_password.html', error=error, success=success)


@app.route('/feed', methods=['GET', 'POST'])
def feed():
    if 'user_id' not in session: return redirect('/login')
    user = User.query.get(session['user_id'])
    if user.is_banned: session.clear(); return redirect('/login')
    tab = request.args.get('tab', 'global')
    search_query = request.args.get('q', '')
    search_results = []
    if search_query:
        search_results = User.query.filter(User.username.ilike(f'%{search_query}%'), User.id != user.id).all()
    xp_gained = kp_gained = 0
    if request.method == 'POST':
        if user.is_muted: return redirect('/feed')
        content = request.form.get('content', '').strip()
        visibility = request.form.get('visibility', 'public')
        media_file = request.files.get('media')
        media_filename = media_type = ''
        if media_file and media_file.filename:
            ext, ok = allowed_file(media_file.filename)
            if ok:
                fn = secure_filename(f"post_{user.id}_{int(datetime.utcnow().timestamp())}.{ext}")
                media_file.save(os.path.join(app.config['UPLOAD_FOLDER'], fn))
                media_filename = fn; media_type = get_media_type(ext)
        if content or media_filename:
            db.session.add(Post(user_id=user.id, content=content, media=media_filename,
                               media_type=media_type, visibility=visibility))
            db.session.commit()
            if can_post_xp(user):
                add_xp(user, 20); user.kp += 5; user.posts_today += 1
                db.session.commit(); xp_gained = 20; kp_gained = 5
        return redirect(f'/feed?xp={xp_gained}&kp={kp_gained}&tab={tab}')
    xp_gained = request.args.get('xp', 0, type=int)
    kp_gained = request.args.get('kp', 0, type=int)
    friend_ids = [f.id for f in get_friends(user.id)]
    polls = []
    poll_vote_counts = {}
    poll_total_votes = {}
    user_votes = {}
    if tab == 'friends':
        posts = Post.query.filter(Post.user_id.in_(friend_ids + [user.id])).order_by(Post.created_at.desc()).limit(50).all()
    elif tab == 'top':
        from sqlalchemy import func
        top_q = db.session.query(Post.id, func.count(Like.id).label('lc'))\
            .outerjoin(Like, Like.post_id==Post.id).group_by(Post.id)\
            .order_by(func.count(Like.id).desc()).limit(20).all()
        top_ids = [p.id for p in top_q]
        posts = Post.query.filter(Post.id.in_(top_ids)).all() if top_ids else []
        if posts: posts.sort(key=lambda p: top_ids.index(p.id))
    elif tab == 'news':
        if Poll.query.count() == 0:
            seed_poll_content(user)
        polls = Poll.query.filter_by(is_public=True).order_by(Poll.created_at.desc()).limit(12).all()
        posts = Post.query.filter(
            (Post.visibility=='public')|(Post.user_id==user.id)|
            ((Post.visibility=='friends')&(Post.user_id.in_(friend_ids)))
        ).order_by(Post.created_at.desc()).limit(30).all()
        user_votes = {pv.poll_id: pv.option_id for pv in PollVote.query.filter_by(user_id=user.id).all()}
        for poll in polls:
            total = 0
            for option in poll.options:
                count = PollVote.query.filter_by(option_id=option.id).count()
                poll_vote_counts[option.id] = count
                total += count
            poll_total_votes[poll.id] = total
    else:
        posts = Post.query.filter(
            (Post.visibility=='public')|(Post.user_id==user.id)|
            ((Post.visibility=='friends')&(Post.user_id.in_(friend_ids)))
        ).order_by(Post.created_at.desc()).limit(50).all()
    likes = {l.post_id for l in Like.query.filter_by(user_id=user.id).all()}
    like_counts = {p.id: Like.query.filter_by(post_id=p.id).count() for p in posts}
    comment_counts = {p.id: Comment.query.filter_by(post_id=p.id).count() for p in posts}
    comments_by_post = {p.id: Comment.query.filter_by(post_id=p.id).order_by(Comment.created_at).all() for p in posts}
    incoming = FriendRequest.query.filter_by(to_user_id=user.id, status='pending').all()
    friends_list = get_friends(user.id)
    suggested = [u for u in User.query.filter(User.id!=user.id, User.is_banned==False).order_by(User.xp.desc()).limit(8).all() if u.id not in friend_ids][:3]
    stories = friends_list[:8]
    notifs_unread = get_unread_notifs(user.id)
    next_xp = get_next_xp(user.xp)
    xp_pct = min(100, int(user.xp/max(next_xp,1)*100))
    return render_template('feed.html', user=user, posts=posts, likes=likes,
                           like_counts=like_counts, comment_counts=comment_counts,
                           comments_by_post=comments_by_post,
                           search_results=search_results, search_query=search_query,
                           incoming=incoming, friends=friends_list, suggested=suggested,
                           stories=stories, tab=tab, xp_gained=xp_gained, kp_gained=kp_gained,
                           xp_pct=xp_pct, next_xp=next_xp, notifs_unread=notifs_unread,
                           is_online=is_online, get_avatar_url=get_avatar_url,
                           get_banner_url=get_banner_url,
                           polls=polls, poll_vote_counts=poll_vote_counts,
                           poll_total_votes=poll_total_votes, user_votes=user_votes)


@app.route('/news')
def news():
    return redirect('/feed?tab=news')


@app.route('/polls')
def polls():
    if 'user_id' not in session: return redirect('/login')
    user = User.query.get(session['user_id'])
    if user.is_banned: session.clear(); return redirect('/login')
    if Poll.query.count() == 0:
        seed_poll_content(user)
    polls = Poll.query.filter_by(is_public=True).order_by(Poll.created_at.desc()).limit(25).all()
    poll_vote_counts = {}
    poll_total_votes = {}
    user_votes = {pv.poll_id: pv.option_id for pv in PollVote.query.filter_by(user_id=user.id).all()}
    for poll in polls:
        total = 0
        for option in poll.options:
            count = PollVote.query.filter_by(option_id=option.id).count()
            poll_vote_counts[option.id] = count
            total += count
        poll_total_votes[poll.id] = total
    notifs_unread = get_unread_notifs(user.id)
    return render_template('polls.html', user=user, polls=polls,
                           poll_vote_counts=poll_vote_counts,
                           poll_total_votes=poll_total_votes,
                           user_votes=user_votes,
                           notifs_unread=notifs_unread,
                           get_avatar_url=get_avatar_url)


@app.route('/polls/create', methods=['POST'])
def poll_create():
    if 'user_id' not in session: return redirect('/login')
    user = User.query.get(session['user_id'])
    if user.is_muted: return redirect('/feed?tab=news')
    question = request.form.get('question', '').strip()
    options = [request.form.get(f'option{i}', '').strip() for i in range(1, 5)]
    options = [opt for opt in options if opt]
    if len(question) < 6 or len(options) < 2:
        return redirect('/feed?tab=news&error=bad_poll')
    poll = Poll(user_id=user.id, question=question, is_public=True)
    db.session.add(poll); db.session.commit()
    for option_text in options:
        db.session.add(PollOption(poll_id=poll.id, text=option_text))
    db.session.commit()
    return redirect('/feed?tab=news&success=poll_created')


@app.route('/polls/<int:poll_id>/vote', methods=['POST'])
def poll_vote(poll_id):
    if 'user_id' not in session: return jsonify({'error': 'not logged in'}), 401
    user = User.query.get(session['user_id'])
    poll = Poll.query.get_or_404(poll_id)
    option_id = request.form.get('option_id', type=int)
    option = PollOption.query.filter_by(id=option_id, poll_id=poll.id).first()
    if not option:
        return jsonify({'error': 'invalid option'}), 400
    vote = PollVote.query.filter_by(poll_id=poll.id, user_id=user.id).first()
    if vote:
        vote.option_id = option.id
    else:
        db.session.add(PollVote(poll_id=poll.id, option_id=option.id, user_id=user.id))
    db.session.commit()
    counts = {opt.id: PollVote.query.filter_by(option_id=opt.id).count() for opt in poll.options}
    total = sum(counts.values())
    return jsonify({'ok': True, 'counts': counts, 'total': total, 'selected': option.id})


@app.route('/post/delete/<int:post_id>', methods=['POST'])
def delete_post(post_id):
    if 'user_id' not in session: return redirect('/login')
    user = User.query.get(session['user_id'])
    post = Post.query.get_or_404(post_id)
    if post.user_id == user.id or user.is_admin:
        Like.query.filter_by(post_id=post_id).delete()
        Comment.query.filter_by(post_id=post_id).delete()
        db.session.delete(post); db.session.commit()
    return redirect(request.referrer or '/feed')


@app.route('/post/share-track', methods=['POST'])
def share_track_as_post():
    if 'user_id' not in session: return jsonify({'error': 'not logged in'}), 401
    user = User.query.get(session['user_id'])
    if user.is_muted: return jsonify({'error': 'muted'}), 403
    content = request.form.get('content', '').strip()
    if not content: return jsonify({'error': 'empty'}), 400
    db.session.add(Post(user_id=user.id, content=content, visibility='public'))
    add_xp(user, 10); user.kp += 2; db.session.commit()
    return jsonify({'ok': True})


@app.route('/like/<int:post_id>', methods=['POST'])
def like(post_id):
    if 'user_id' not in session: return jsonify({'error': 'not logged in'}), 401
    user_id = session['user_id']
    existing = Like.query.filter_by(user_id=user_id, post_id=post_id).first()
    if existing:
        db.session.delete(existing); db.session.commit(); liked = False
    else:
        db.session.add(Like(user_id=user_id, post_id=post_id))
        post = Post.query.get(post_id)
        if post and post.user_id != user_id:
            owner = User.query.get(post.user_id)
            add_xp(owner, 5); owner.kp += 1
            me = User.query.get(user_id)
            add_notification(post.user_id, user_id, 'like', f'{me.username} лайкнул твой пост')
        db.session.commit(); liked = True
    return jsonify({'liked': liked, 'count': Like.query.filter_by(post_id=post_id).count()})


@app.route('/comment/<int:post_id>', methods=['POST'])
def comment(post_id):
    if 'user_id' not in session: return jsonify({'error': 'not logged in'}), 401
    user = User.query.get(session['user_id'])
    if user.is_muted: return jsonify({'error': 'muted'}), 403
    content = request.form.get('content', '').strip()
    if content:
        c = Comment(user_id=user.id, post_id=post_id, content=content)
        db.session.add(c); db.session.commit()
        post = Post.query.get(post_id)
        if post and post.user_id != user.id:
            add_notification(post.user_id, user.id, 'comment', f'{user.username} прокомментировал твой пост')
        return jsonify({'ok': True, 'username': c.user.username, 'content': c.content, 'avatar': get_avatar_url(c.user)})
    return jsonify({'error': 'empty'}), 400


@app.route('/comments/<int:post_id>')
def get_comments(post_id):
    if 'user_id' not in session: return jsonify([])
    comments = Comment.query.filter_by(post_id=post_id).order_by(Comment.created_at).all()
    return jsonify([{'username': c.user.username, 'content': c.content, 'avatar': get_avatar_url(c.user)} for c in comments])


@app.route('/follow/<int:uid>', methods=['POST'])
def follow(uid):
    if 'user_id' not in session: return jsonify({'error': 'not logged in'}), 401
    me_id = session['user_id']
    if me_id == uid: return jsonify({'error': 'self'}), 400
    existing = Follow.query.filter_by(follower_id=me_id, following_id=uid).first()
    if existing:
        db.session.delete(existing); db.session.commit()
        return jsonify({'following': False, 'count': Follow.query.filter_by(following_id=uid).count()})
    db.session.add(Follow(follower_id=me_id, following_id=uid)); db.session.commit()
    me = User.query.get(me_id)
    add_notification(uid, me_id, 'follow', f'{me.username} подписался на тебя')
    return jsonify({'following': True, 'count': Follow.query.filter_by(following_id=uid).count()})


@app.route('/notifications')
def notifications():
    if 'user_id' not in session: return redirect('/login')
    user = User.query.get(session['user_id'])
    notifs = Notification.query.filter_by(user_id=user.id).order_by(Notification.created_at.desc()).limit(50).all()
    Notification.query.filter_by(user_id=user.id, is_read=False).update({'is_read': True})
    db.session.commit()
    return render_template('notifications.html', user=user, notifs=notifs, notifs_unread=0, get_avatar_url=get_avatar_url)


@app.route('/notifications/mark-all')
def notifications_mark_all():
    if 'user_id' not in session: return redirect('/login')
    Notification.query.filter_by(user_id=session['user_id'], is_read=False).update({'is_read': True})
    db.session.commit(); return redirect('/notifications')


@app.route('/notifications/poll')
def notifications_poll():
    if 'user_id' not in session: return jsonify([])
    user_id = session['user_id']
    after = request.args.get('after', 0, type=int)
    notifs = Notification.query.filter(
        Notification.user_id==user_id, Notification.id>after, Notification.is_read==False
    ).order_by(Notification.created_at.desc()).limit(5).all()
    return jsonify([{'id': n.id, 'text': n.text, 'type': n.notif_type,
                    'avatar': get_avatar_url(n.from_user) if n.from_user else '/static/default_avatar.jpg'}
                   for n in notifs])


@app.route('/notifications/settings', methods=['POST'])
def notifications_settings():
    if 'user_id' not in session: return redirect('/login')
    user = User.query.get(session['user_id'])
    user.notif_sound = 'notif_sound' in request.form
    user.notif_popup = 'notif_popup' in request.form
    db.session.commit(); return redirect('/notifications')


@app.route('/profile')
def profile():
    if 'user_id' not in session: return redirect('/login')
    user = User.query.get(session['user_id'])
    posts = Post.query.filter_by(user_id=user.id).order_by(Post.created_at.desc()).all()
    next_xp = get_next_xp(user.xp)
    xp_pct = min(100, int(user.xp/max(next_xp,1)*100))
    friends = get_friends(user.id)
    me_likes = {l.post_id for l in Like.query.filter_by(user_id=user.id).all()}
    likes_by_post = {p.id: Like.query.filter_by(post_id=p.id).count() for p in posts}
    comment_counts = {p.id: Comment.query.filter_by(post_id=p.id).count() for p in posts}
    comments_by_post = {p.id: Comment.query.filter_by(post_id=p.id).order_by(Comment.created_at).all() for p in posts}
    followers_count = Follow.query.filter_by(following_id=user.id).count()
    inventory = get_inventory(user.id)
    notifs_unread = get_unread_notifs(user.id)
    # Liked posts tab
    liked_post_ids = [l.post_id for l in Like.query.filter_by(user_id=user.id).order_by(Like.id.desc()).limit(40).all()]
    liked_posts = Post.query.filter(Post.id.in_(liked_post_ids)).all() if liked_post_ids else []
    liked_counts = {p.id: Like.query.filter_by(post_id=p.id).count() for p in liked_posts}
    return render_template('profile.html', user=user, posts=posts, xp_pct=xp_pct, next_xp=next_xp,
                           friends=friends, likes_by_post=likes_by_post, me_likes=me_likes,
                           comment_counts=comment_counts, comments_by_post=comments_by_post,
                           followers_count=followers_count, inventory=inventory,
                           notifs_unread=notifs_unread, level_titles=LEVEL_TITLES,
                           liked_posts=liked_posts, liked_counts=liked_counts,
                           get_avatar_url=get_avatar_url, get_banner_url=get_banner_url, is_online=is_online)


@app.route('/user/<int:uid>')
def user_profile(uid):
    if 'user_id' not in session: return redirect('/login')
    me = User.query.get(session['user_id'])
    target = User.query.get_or_404(uid)
    posts = Post.query.filter_by(user_id=uid).order_by(Post.created_at.desc()).all()
    req = FriendRequest.query.filter_by(from_user_id=me.id, to_user_id=uid).first()
    req2 = FriendRequest.query.filter_by(from_user_id=uid, to_user_id=me.id).first()
    me_likes = {l.post_id for l in Like.query.filter_by(user_id=me.id).all()}
    likes_by_post = {p.id: Like.query.filter_by(post_id=p.id).count() for p in posts}
    comment_counts = {p.id: Comment.query.filter_by(post_id=p.id).count() for p in posts}
    comments_by_post = {p.id: Comment.query.filter_by(post_id=p.id).order_by(Comment.created_at).all() for p in posts}
    is_following = Follow.query.filter_by(follower_id=me.id, following_id=uid).first() is not None
    followers_count = Follow.query.filter_by(following_id=uid).count()
    notifs_unread = get_unread_notifs(me.id)
    report_status = request.args.get('report')
    return render_template('user_profile.html', me=me, target=target, posts=posts,
                           req=req, req2=req2, target_friends=get_friends(uid),
                           online=is_online(target), me_likes=me_likes,
                           likes_by_post=likes_by_post, comment_counts=comment_counts,
                           comments_by_post=comments_by_post, is_following=is_following,
                           followers_count=followers_count, notifs_unread=notifs_unread,
                           report_status=report_status,
                           get_avatar_url=get_avatar_url, get_banner_url=get_banner_url, is_online=is_online)


@app.route('/report/user/<int:uid>', methods=['POST'])
def report_user(uid):
    if 'user_id' not in session: return jsonify({'error': 'not logged in'}), 401
    me = User.query.get(session['user_id'])
    target = User.query.get_or_404(uid)
    if me.id == uid: return jsonify({'error': 'Нельзя жаловаться на себя'}), 400
    reason = request.form.get('reason', '').strip()
    if not reason: return jsonify({'error': 'Укажи причину'}), 400
    # Save report to DB via any post by target (or create synthetic)
    post = Post.query.filter_by(user_id=uid).first()
    if post:
        existing = Report.query.filter_by(post_id=post.id, reporter_id=me.id, status='pending').first()
        if not existing:
            db.session.add(Report(post_id=post.id, reporter_id=me.id,
                                  reason=f'[На пользователя] {reason}'))
    # Notify ALL admins on site (shows in admin panel)
    admins = User.query.filter_by(is_admin=True).all()
    for admin in admins:
        add_notification(admin.id, me.id, 'report',
                         f'🚩 Жалоба на @{target.username} от @{me.username}: {reason}')
    db.session.commit()
    # Also send to Telegram
    try:
        send_tg_user_report_alert(target, me, reason)
    except: pass
    return jsonify({'ok': True})


@app.route('/friend/send/<int:uid>', methods=['POST'])
def friend_send(uid):
    if 'user_id' not in session: return redirect('/login')
    me_id = session['user_id']
    if not FriendRequest.query.filter_by(from_user_id=me_id, to_user_id=uid).first():
        db.session.add(FriendRequest(from_user_id=me_id, to_user_id=uid))
        me = User.query.get(me_id); add_xp(me, 10)
        add_notification(uid, me_id, 'friend_request', f'{me.username} хочет добавить тебя в друзья')
    return redirect(f'/user/{uid}')


@app.route('/friend/accept/<int:rid>', methods=['POST'])
def friend_accept(rid):
    if 'user_id' not in session: return redirect('/login')
    req = FriendRequest.query.get_or_404(rid)
    req.status = 'accepted'
    me = User.query.get(session['user_id']); add_xp(me, 20)
    add_notification(req.from_user_id, me.id, 'friend_accept', f'{me.username} принял заявку в друзья')
    db.session.commit(); return redirect('/friends')


@app.route('/friend/decline/<int:rid>', methods=['POST'])
def friend_decline(rid):
    if 'user_id' not in session: return redirect('/login')
    req = FriendRequest.query.get_or_404(rid)
    db.session.delete(req); db.session.commit(); return redirect('/friends')


@app.route('/friends')
def friends():
    if 'user_id' not in session: return redirect('/login')
    user = User.query.get(session['user_id'])
    notifs_unread = get_unread_notifs(user.id)
    friends_list = get_friends(user.id)
    friend_ids = {f.id for f in friends_list}
    online_ids = {f.id for f in friends_list if is_online(f)}
    online_count = len(online_ids)
    incoming = FriendRequest.query.filter_by(to_user_id=user.id, status='pending').all()
    sent_requests = FriendRequest.query.filter_by(from_user_id=user.id, status='pending').all()
    suggested = [u for u in User.query.filter(
        User.id != user.id, User.is_banned == False
    ).order_by(User.last_seen.desc()).limit(20).all()
    if u.id not in friend_ids and not FriendRequest.query.filter_by(
        from_user_id=user.id, to_user_id=u.id).first()][:5]
    top_users = [u for u in User.query.filter(
        User.id != user.id, User.is_banned == False
    ).order_by(User.xp.desc()).limit(10).all() if u.id not in friend_ids][:4]
    return render_template('friends.html', user=user, friends=friends_list,
                           incoming=incoming, sent_requests=sent_requests,
                           online_ids=online_ids, online_count=online_count,
                           suggested=suggested, top_users=top_users,
                           is_online=is_online, notifs_unread=notifs_unread,
                           get_avatar_url=get_avatar_url)


@app.route('/messages')
def messages():
    if 'user_id' not in session: return redirect('/login')
    user = User.query.get(session['user_id'])
    friends_list = get_friends(user.id)
    selected_id = request.args.get('with', type=int)
    selected_chat_id = request.args.get('chat', type=int)
    selected_user = None
    selected_group = None
    chat_messages = []
    if selected_id:
        selected_user = User.query.get(selected_id)
        if selected_user:
            chat_messages = Message.query.filter(
                Message.chat_id == None,
                ((Message.from_user_id==user.id)&(Message.to_user_id==selected_id))|
                ((Message.from_user_id==selected_id)&(Message.to_user_id==user.id))
            ).order_by(Message.created_at).all()
            Message.query.filter_by(from_user_id=selected_id, to_user_id=user.id, is_read=False).update({'is_read': True})
            db.session.commit()
        else:
            selected_id = None
    elif selected_chat_id:
        cm = ChatMember.query.filter_by(chat_id=selected_chat_id, user_id=user.id).first()
        if cm:
            selected_group = Chat.query.get(selected_chat_id)
            chat_messages = Message.query.filter_by(chat_id=selected_chat_id).order_by(Message.created_at).all()
    notifs_unread = get_unread_notifs(user.id)
    last_messages = {}
    unread_counts = {}
    for f in friends_list:
        lm = Message.query.filter(
            Message.chat_id == None,
            ((Message.from_user_id==user.id)&(Message.to_user_id==f.id))|
            ((Message.from_user_id==f.id)&(Message.to_user_id==user.id))
        ).order_by(Message.created_at.desc()).first()
        if lm: last_messages[f.id] = lm
        unread_counts[f.id] = Message.query.filter_by(
            from_user_id=f.id, to_user_id=user.id, is_read=False).count()
    # Group chats for this user
    my_chat_members = ChatMember.query.filter_by(user_id=user.id).all()
    my_chats = []
    for cm in my_chat_members:
        if not cm.is_hidden:
            my_chats.append(cm.chat)
    return render_template('messages.html', user=user, friends=friends_list,
                           selected_user=selected_user, chat_messages=chat_messages,
                           selected_group=selected_group, my_chats=my_chats,
                           is_online=is_online, notifs_unread=notifs_unread,
                           last_messages=last_messages, unread_counts=unread_counts,
                           get_avatar_url=get_avatar_url, get_banner_url=get_banner_url)


@app.route('/messages/mark-read', methods=['POST'])
def messages_mark_read():
    if 'user_id' not in session: return jsonify({'ok': False})
    user_id = session['user_id']
    with_id = request.args.get('with', type=int)
    if with_id:
        Message.query.filter_by(from_user_id=with_id, to_user_id=user_id, is_read=False).update({'is_read': True})
        db.session.commit()
    return jsonify({'ok': True})


@app.route('/messages/send', methods=['POST'])
def messages_send():
    if 'user_id' not in session: return jsonify({'error': 'not logged in'}), 401
    user = User.query.get(session['user_id'])
    if user.is_muted: return jsonify({'error': 'muted'}), 403
    to_id = request.form.get('to_id', type=int)
    chat_id = request.form.get('chat_id', type=int)
    content = request.form.get('content', '').strip()
    if (to_id or chat_id) and content:
        msg = Message(from_user_id=user.id, to_user_id=to_id, chat_id=chat_id,
                      content=content, msg_type='text')
        db.session.add(msg); db.session.commit()
        return jsonify({'ok': True, 'msg': _msg_to_dict(msg, user.id)})
    return jsonify({'error': 'empty'}), 400


@app.route('/messages/poll')
def messages_poll():
    if 'user_id' not in session: return jsonify([])
    user_id = session['user_id']
    with_id = request.args.get('with', type=int)
    chat_id = request.args.get('chat_id', type=int)
    after = request.args.get('after', type=int, default=0)
    if chat_id:
        if not ChatMember.query.filter_by(chat_id=chat_id, user_id=user_id).first():
            return jsonify([])
        msgs = Message.query.filter(
            Message.chat_id == chat_id,
            Message.id > after
        ).order_by(Message.created_at).all()
        return jsonify([_msg_to_dict(m, user_id) for m in msgs])
    if not with_id: return jsonify([])
    msgs = Message.query.filter(
        Message.id > after,
        Message.chat_id == None,
        (Message.from_user_id==with_id)&(Message.to_user_id==user_id)
    ).order_by(Message.created_at).all()
    return jsonify([_msg_to_dict(m, user_id) for m in msgs])


@app.route('/gaming')
def gaming():
    if 'user_id' not in session: return redirect('/login')
    user = User.query.get(session['user_id'])
    if Group.query.count() == 0 and LFGPost.query.count() == 0:
        seed_gaming_content(user)
    groups = Group.query.order_by(Group.created_at.desc()).all()
    my_groups = [gm.group_id for gm in GroupMember.query.filter_by(user_id=user.id).all()]
    notifs_unread = get_unread_notifs(user.id)
    total_online = User.query.filter(User.last_seen >= datetime.utcnow() - timedelta(minutes=5)).count()
    lfg_posts = LFGPost.query.filter_by(is_active=True).order_by(LFGPost.created_at.desc()).limit(20).all()
    lfg_count = LFGPost.query.filter_by(is_active=True).count()
    live_groups_count = max(0, len(groups) // 3)
    member_counts = {g.id: GroupMember.query.filter_by(group_id=g.id).count() for g in groups}
    tournaments = Tournament.query.order_by(Tournament.created_at.desc()).all() if user.is_admin else []
    return render_template('gaming.html', user=user, groups=groups, my_groups=my_groups,
                           notifs_unread=notifs_unread, total_online=total_online,
                           lfg_count=lfg_count, live_groups_count=live_groups_count,
                           lfg_posts=lfg_posts, member_counts=member_counts,
                           tournaments=tournaments, get_avatar_url=get_avatar_url)


@app.route('/gaming/tournament/create', methods=['POST'])
def gaming_tournament_create():
    if 'user_id' not in session: return redirect('/login')
    user = User.query.get(session['user_id'])
    if not user.is_admin: return redirect('/gaming')
    title = request.form.get('title', '').strip()
    game = request.form.get('game', '').strip()
    reward = request.form.get('reward', '').strip()
    date = request.form.get('date', '').strip()
    description = request.form.get('description', '').strip()
    if title and game:
        t = Tournament(title=title, game=game, reward=reward, date=date,
                       description=description, author_id=user.id,
                       status='open')
        db.session.add(t); db.session.commit()
    return redirect('/gaming')


@app.route('/gaming/create', methods=['POST'])
def gaming_create():
    if 'user_id' not in session: return redirect('/login')
    user = User.query.get(session['user_id'])
    name = request.form.get('name', '').strip()
    desc = request.form.get('description', '').strip()
    game_tag = request.form.get('game_tag', '').strip()
    need_mic = 'need_mic' in request.form
    if name:
        g = Group(name=name, description=desc, game_tag=game_tag, need_mic=need_mic, owner_id=user.id)
        db.session.add(g); db.session.commit()
        db.session.add(GroupMember(group_id=g.id, user_id=user.id)); db.session.commit()
        return redirect(f'/gaming/{g.id}')
    return redirect('/gaming')


@app.route('/gaming/lfg/post', methods=['POST'])
def gaming_lfg_post():
    if 'user_id' not in session: return redirect('/login')
    user = User.query.get(session['user_id'])
    game = request.form.get('game', '').strip()
    if game:
        LFGPost.query.filter_by(user_id=user.id, is_active=True).update({'is_active': False})
        db.session.add(LFGPost(
            user_id=user.id, game=game,
            mode=request.form.get('mode', 'Обычка'),
            rank_level=request.form.get('rank_level', 'Средний'),
            need_mic='need_mic' in request.form,
            description=request.form.get('description', '').strip()
        ))
        db.session.commit()
    return redirect('/gaming?tab=lfg')


@app.route('/gaming/<int:gid>')
def gaming_room(gid):
    if 'user_id' not in session: return redirect('/login')
    user = User.query.get(session['user_id'])
    group = Group.query.get_or_404(gid)
    members = GroupMember.query.filter_by(group_id=gid).all()
    member_ids = [m.user_id for m in members]
    messages = GroupMessage.query.filter_by(group_id=gid).order_by(GroupMessage.created_at).limit(100).all()
    is_member = user.id in member_ids
    notifs_unread = get_unread_notifs(user.id)
    return render_template('gaming_room.html', user=user, group=group, members=members,
                           messages=messages, is_member=is_member, notifs_unread=notifs_unread,
                           get_avatar_url=get_avatar_url, is_online=is_online)


@app.route('/gaming/<int:gid>/join', methods=['POST'])
def gaming_join(gid):
    if 'user_id' not in session: return redirect('/login')
    user_id = session['user_id']
    if not GroupMember.query.filter_by(group_id=gid, user_id=user_id).first():
        db.session.add(GroupMember(group_id=gid, user_id=user_id)); db.session.commit()
    return redirect(f'/gaming/{gid}')


@app.route('/gaming/<int:gid>/send', methods=['POST'])
def gaming_send(gid):
    if 'user_id' not in session: return jsonify({'error': 'not logged in'}), 401
    user = User.query.get(session['user_id'])
    if user.is_muted: return jsonify({'error': 'muted'}), 403
    content = request.form.get('content', '').strip()
    if content:
        msg = GroupMessage(group_id=gid, user_id=user.id, content=content)
        db.session.add(msg); db.session.commit()
        return jsonify({'ok': True, 'content': content, 'username': user.username,
                       'avatar': get_avatar_url(user), 'time': msg.created_at.strftime('%H:%M'),
                       'id': msg.id, 'user_id': user.id})
    return jsonify({'error': 'empty'}), 400


@app.route('/gaming/<int:gid>/poll')
def gaming_poll(gid):
    if 'user_id' not in session: return jsonify([])
    after = request.args.get('after', 0, type=int)
    msgs = GroupMessage.query.filter(GroupMessage.group_id==gid, GroupMessage.id>after).order_by(GroupMessage.created_at).all()
    return jsonify([{'id': m.id, 'content': m.content, 'username': m.user.username,
                    'avatar': get_avatar_url(m.user), 'time': m.created_at.strftime('%H:%M'),
                    'mine': m.user_id==session['user_id'], 'user_id': m.user_id} for m in msgs])


@app.route('/music')
def music():
    if 'user_id' not in session: return redirect('/login')
    user = User.query.get(session['user_id'])
    seed_music_content(user)
    notifs_unread = get_unread_notifs(user.id)
    active_tab = request.args.get('tab', 'discover')
    active_genre = request.args.get('genre', '')
    search_q = request.args.get('q', '')
    query = Track.query.filter_by(is_public=True)
    if active_genre: query = query.filter_by(genre=active_genre)
    if search_q:
        query = query.filter(db.or_(Track.title.ilike(f'%{search_q}%'),
                                    Track.artist.ilike(f'%{search_q}%'),
                                    Track.genre.ilike(f'%{search_q}%')))
    tracks = query.order_by(Track.created_at.desc()).limit(40).all()
    trending_tracks = Track.query.filter_by(is_public=True).order_by(Track.plays.desc()).limit(20).all()
    my_tracks = Track.query.filter_by(user_id=user.id).order_by(Track.created_at.desc()).all()
    library_items = LibraryTrack.query.filter_by(user_id=user.id).order_by(LibraryTrack.saved_at.desc()).all()
    saved_tracks = {lt.track_id for lt in library_items}
    liked_set = {tl.track_id for tl in TrackLike.query.filter_by(user_id=user.id).all()}
    playlists = Playlist.query.filter_by(user_id=user.id).order_by(Playlist.created_at.desc()).all()
    auto_play_id = auto_play_title = auto_play_artist = auto_play_cover = None
    play_id = request.args.get('play', type=int)
    if play_id:
        pt = Track.query.get(play_id)
        if pt:
            auto_play_id = pt.id; auto_play_title = pt.title
            auto_play_artist = pt.artist or pt.user.username; auto_play_cover = pt.cover or ''
    current_track = Track.query.get(session['current_track_id']) if session.get('current_track_id') else None
    return render_template('music.html', user=user, notifs_unread=notifs_unread,
                           tracks=tracks, trending_tracks=trending_tracks,
                           my_tracks=my_tracks, library_tracks=library_items,
                           playlists=playlists, saved_tracks=saved_tracks,
                           liked_tracks=liked_set, active_tab=active_tab,
                           active_genre=active_genre, search_q=search_q,
                           genres=GENRES, current_track=current_track,
                           auto_play_id=auto_play_id, auto_play_title=auto_play_title,
                           auto_play_artist=auto_play_artist, auto_play_cover=auto_play_cover,
                           get_avatar_url=get_avatar_url)


@app.route('/music/upload', methods=['POST'])
def music_upload():
    if 'user_id' not in session: return jsonify({'error': 'not logged in'}), 401
    user = User.query.get(session['user_id'])
    title = request.form.get('title', '').strip()
    audio_file = request.files.get('audio')
    cover_file = request.files.get('cover')
    if not title or not audio_file or not audio_file.filename:
        return jsonify({'error': 'required fields missing'}), 400
    ext = audio_file.filename.rsplit('.', 1)[-1].lower()
    if ext not in ALLOWED_AUD: return jsonify({'error': 'invalid format'}), 400
    audio_fn = secure_filename(f"track_{user.id}_{int(datetime.utcnow().timestamp())}.{ext}")
    audio_path = os.path.join(AUDIO_FOLDER, audio_fn)
    audio_file.save(audio_path)
    duration = get_audio_duration(audio_path)
    cover_fn = ''
    if cover_file and cover_file.filename:
        cext = cover_file.filename.rsplit('.', 1)[-1].lower()
        if cext in ALLOWED_IMG:
            cover_fn = secure_filename(f"cover_{user.id}_{int(datetime.utcnow().timestamp())}.{cext}")
            cover_file.save(os.path.join(COVERS_FOLDER, cover_fn))
    track = Track(user_id=user.id, title=title,
                  artist=request.form.get('artist', '').strip(),
                  genre=request.form.get('genre', 'other'),
                  description=request.form.get('description', '').strip(),
                  filename=audio_fn, cover=cover_fn, duration=duration,
                  copyright_type=request.form.get('copyright_type', 'own'),
                  copyright_owner=request.form.get('copyright_owner', '').strip(),
                  copyright_url=request.form.get('copyright_url', '').strip())
    db.session.add(track); add_xp(user, 50); user.kp += 10; db.session.commit()
    return jsonify({'ok': True, 'id': track.id})


@app.route('/music/stream/<int:track_id>')
def music_stream(track_id):
    track = Track.query.get_or_404(track_id)
    audio_path = os.path.join(AUDIO_FOLDER, track.filename)
    if not os.path.exists(audio_path): return 'File not found', 404
    file_size = os.path.getsize(audio_path)
    ext = track.filename.rsplit('.', 1)[-1].lower()
    mime = {'mp3':'audio/mpeg','wav':'audio/wav','ogg':'audio/ogg','m4a':'audio/mp4','flac':'audio/flac'}.get(ext,'audio/mpeg')
    range_header = request.headers.get('Range')
    if range_header:
        byte_start = 0; byte_end = file_size - 1
        match = range_header.replace('bytes=', '').split('-')
        if match[0]: byte_start = int(match[0])
        if len(match) > 1 and match[1]: byte_end = int(match[1])
        length = byte_end - byte_start + 1
        with open(audio_path, 'rb') as f:
            f.seek(byte_start); data = f.read(length)
        rv = app.response_class(data, 206, mimetype=mime, direct_passthrough=True)
        rv.headers.add('Content-Range', f'bytes {byte_start}-{byte_end}/{file_size}')
        rv.headers.add('Accept-Ranges', 'bytes'); rv.headers.add('Content-Length', length)
        return rv
    return send_file(audio_path, mimetype=mime)


@app.route('/music/play/<int:track_id>', methods=['POST'])
def music_play(track_id):
    if 'user_id' not in session: return jsonify({'ok': False})
    track = Track.query.get(track_id)
    if track: track.plays += 1; db.session.commit(); session['current_track_id'] = track_id
    return jsonify({'ok': True, 'plays': track.plays if track else 0})


@app.route('/music/like/<int:track_id>', methods=['POST'])
def music_like(track_id):
    if 'user_id' not in session: return jsonify({'error': 'not logged in'}), 401
    user_id = session['user_id']
    track = Track.query.get_or_404(track_id)
    existing = TrackLike.query.filter_by(user_id=user_id, track_id=track_id).first()
    if existing:
        db.session.delete(existing); db.session.commit(); liked = False
    else:
        db.session.add(TrackLike(user_id=user_id, track_id=track_id))
        if track.user_id != user_id:
            owner = User.query.get(track.user_id)
            if owner: add_xp(owner, 10); owner.kp += 2
        db.session.commit(); liked = True
    return jsonify({'liked': liked, 'count': track.likes.count()})


@app.route('/music/save/<int:track_id>', methods=['POST'])
def music_save(track_id):
    if 'user_id' not in session: return jsonify({'error': 'not logged in'}), 401
    user_id = session['user_id']
    existing = LibraryTrack.query.filter_by(user_id=user_id, track_id=track_id).first()
    if existing:
        db.session.delete(existing); db.session.commit(); return jsonify({'saved': False})
    db.session.add(LibraryTrack(user_id=user_id, track_id=track_id)); db.session.commit()
    return jsonify({'saved': True})


@app.route('/music/delete/<int:track_id>', methods=['POST'])
def music_delete(track_id):
    if 'user_id' not in session: return jsonify({'error': 'not logged in'}), 401
    user = User.query.get(session['user_id'])
    track = Track.query.get_or_404(track_id)
    if track.user_id != user.id and not user.is_admin: return jsonify({'error': 'forbidden'}), 403
    try:
        ap = os.path.join(AUDIO_FOLDER, track.filename)
        if os.path.exists(ap): os.remove(ap)
        if track.cover:
            cp = os.path.join(COVERS_FOLDER, track.cover)
            if os.path.exists(cp): os.remove(cp)
    except: pass
    TrackLike.query.filter_by(track_id=track_id).delete()
    LibraryTrack.query.filter_by(track_id=track_id).delete()
    PlaylistItem.query.filter_by(track_id=track_id).delete()
    db.session.delete(track); db.session.commit()
    return jsonify({'ok': True})


@app.route('/music/playlist/create', methods=['POST'])
def music_playlist_create():
    if 'user_id' not in session: return jsonify({'error': 'not logged in'}), 401
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    if not name: return jsonify({'error': 'name required'}), 400
    pl = Playlist(user_id=session['user_id'], name=name)
    db.session.add(pl); db.session.commit()
    return jsonify({'ok': True, 'id': pl.id})


@app.route('/music/playlist/<int:playlist_id>')
def music_playlist(playlist_id):
    if 'user_id' not in session: return redirect('/login')
    user = User.query.get(session['user_id'])
    pl = Playlist.query.get_or_404(playlist_id)
    if not pl.is_public and pl.user_id != user.id: return redirect('/music')
    notifs_unread = get_unread_notifs(user.id)
    liked_set = {tl.track_id for tl in TrackLike.query.filter_by(user_id=user.id).all()}
    saved_set = {lt.track_id for lt in LibraryTrack.query.filter_by(user_id=user.id).all()}
    return render_template('music_playlist.html', user=user, pl=pl, notifs_unread=notifs_unread,
                           liked_tracks=liked_set, saved_tracks=saved_set,
                           genres=GENRES, get_avatar_url=get_avatar_url)


@app.route('/music/playlist/add', methods=['POST'])
def music_playlist_add():
    if 'user_id' not in session: return jsonify({'error': 'not logged in'}), 401
    data = request.get_json() or {}
    track_id = data.get('track_id'); playlist_name = data.get('playlist_name', '').strip()
    user_id = session['user_id']
    if not track_id: return jsonify({'error': 'track_id required'}), 400
    pl = Playlist.query.filter_by(user_id=user_id, name=playlist_name).first()
    if not pl:
        pl = Playlist(user_id=user_id, name=playlist_name); db.session.add(pl); db.session.flush()
    if PlaylistItem.query.filter_by(playlist_id=pl.id, track_id=track_id).first():
        return jsonify({'error': 'already in playlist'}), 400
    db.session.add(PlaylistItem(playlist_id=pl.id, track_id=track_id, position=pl.items.count()))
    db.session.commit(); return jsonify({'ok': True})


@app.route('/music/playlist/<int:playlist_id>/remove/<int:track_id>', methods=['POST'])
def music_playlist_remove(playlist_id, track_id):
    if 'user_id' not in session: return jsonify({'error': 'not logged in'}), 401
    pl = Playlist.query.get_or_404(playlist_id)
    if pl.user_id != session['user_id']: return jsonify({'error': 'forbidden'}), 403
    PlaylistItem.query.filter_by(playlist_id=playlist_id, track_id=track_id).delete()
    db.session.commit(); return jsonify({'ok': True})


@app.route('/music/playlist/<int:playlist_id>/delete', methods=['POST'])
def music_playlist_delete(playlist_id):
    if 'user_id' not in session: return jsonify({'error': 'not logged in'}), 401
    user = User.query.get(session['user_id'])
    pl = Playlist.query.get_or_404(playlist_id)
    if pl.user_id != user.id and not user.is_admin: return jsonify({'error': 'forbidden'}), 403
    PlaylistItem.query.filter_by(playlist_id=playlist_id).delete()
    db.session.delete(pl); db.session.commit(); return jsonify({'ok': True})


@app.route('/music/search')
def music_search():
    if 'user_id' not in session: return jsonify([])
    q = request.args.get('q', '')
    if len(q) < 2: return jsonify([])
    tracks = Track.query.filter(Track.is_public==True,
        db.or_(Track.title.ilike(f'%{q}%'), Track.artist.ilike(f'%{q}%'))).limit(10).all()
    return jsonify([{'id': t.id, 'title': t.title, 'artist': t.artist or t.user.username,
                    'cover': t.cover, 'duration': t.duration} for t in tracks])


@app.route('/admin/music/delete/<int:track_id>', methods=['POST'])
def admin_music_delete(track_id):
    if 'user_id' not in session: return jsonify({'error': 'not logged in'}), 401
    me = User.query.get(session['user_id'])
    if not me.is_admin: return jsonify({'error': 'forbidden'}), 403
    track = Track.query.get_or_404(track_id)
    author_name = track.user.username if track.user else 'Unknown'
    try:
        ap = os.path.join(AUDIO_FOLDER, track.filename)
        if os.path.exists(ap): os.remove(ap)
        if track.cover:
            cp = os.path.join(COVERS_FOLDER, track.cover)
            if os.path.exists(cp): os.remove(cp)
    except: pass
    TrackLike.query.filter_by(track_id=track_id).delete()
    LibraryTrack.query.filter_by(track_id=track_id).delete()
    PlaylistItem.query.filter_by(track_id=track_id).delete()
    db.session.delete(track)
    audit(me.id, f'Удалён трек #{track_id} «{track.title}» (@{author_name})', author_name)
    db.session.commit()
    return jsonify({'ok': True})


# ============================================================
#  Мессенджер — групповые чаты, голосовые, реакции, медиа
# ============================================================

VOICE_FOLDER = 'static/uploads/voice'
CHAT_MEDIA_FOLDER = 'static/uploads/chat_media'
os.makedirs(VOICE_FOLDER, exist_ok=True)
os.makedirs(CHAT_MEDIA_FOLDER, exist_ok=True)


def _msg_to_dict(m, me_id):
    reactions_raw = {}
    for r in m.reactions.all():
        reactions_raw[r.emoji] = reactions_raw.get(r.emoji, 0) + 1
    my_reaction = None
    for r in m.reactions.filter_by(user_id=me_id).first() and [m.reactions.filter_by(user_id=me_id).first()] or []:
        my_reaction = r.emoji
    return {
        'id': m.id,
        'from_id': m.from_user_id,
        'mine': m.from_user_id == me_id,
        'username': m.from_user.username if m.from_user else '',
        'avatar': get_avatar_url(m.from_user) if m.from_user else '/static/default_avatar.jpg',
        'content': '' if m.is_deleted else m.content,
        'msg_type': m.msg_type,
        'media_file': '' if m.is_deleted else m.media_file,
        'is_deleted': m.is_deleted,
        'is_edited': m.is_edited,
        'reactions': reactions_raw,
        'my_reaction': my_reaction,
        'time': m.created_at.strftime('%H:%M'),
        'ts': int(m.created_at.timestamp()),
    }


@app.route('/chat/create', methods=['POST'])
def chat_create():
    if 'user_id' not in session: return jsonify({'error': 'not logged in'}), 401
    me = User.query.get(session['user_id'])
    name = request.form.get('name', '').strip()
    member_ids_raw = request.form.getlist('members')
    if not name: return jsonify({'error': 'Укажи название'}), 400
    chat = Chat(name=name, creator_id=me.id)
    db.session.add(chat); db.session.flush()
    db.session.add(ChatMember(chat_id=chat.id, user_id=me.id, role='admin'))
    friend_ids = {f.id for f in get_friends(me.id)}
    for uid_str in member_ids_raw:
        try:
            uid = int(uid_str)
        except: continue
        if uid == me.id: continue
        if uid not in friend_ids: continue
        db.session.add(ChatMember(chat_id=chat.id, user_id=uid, role='member'))
    db.session.commit()
    return jsonify({'ok': True, 'chat_id': chat.id})


@app.route('/chat/<int:chat_id>/invite', methods=['POST'])
def chat_invite(chat_id):
    if 'user_id' not in session: return jsonify({'error': 'not logged in'}), 401
    me = User.query.get(session['user_id'])
    chat = Chat.query.get_or_404(chat_id)
    my_member = ChatMember.query.filter_by(chat_id=chat_id, user_id=me.id).first()
    if not my_member: return jsonify({'error': 'not a member'}), 403
    uid = request.form.get('user_id', type=int)
    if not uid: return jsonify({'error': 'user_id required'}), 400
    if ChatMember.query.filter_by(chat_id=chat_id, user_id=uid).first():
        return jsonify({'error': 'already in chat'}), 400
    db.session.add(ChatMember(chat_id=chat_id, user_id=uid, role='member'))
    db.session.commit()
    return jsonify({'ok': True})


@app.route('/chat/<int:chat_id>/settings', methods=['POST'])
def chat_settings(chat_id):
    """Mute/hide chat for current user"""
    if 'user_id' not in session: return jsonify({'error': 'not logged in'}), 401
    me_id = session['user_id']
    member = ChatMember.query.filter_by(chat_id=chat_id, user_id=me_id).first()
    if not member: return jsonify({'error': 'not a member'}), 403
    action = request.form.get('action')
    if action == 'mute': member.is_muted = not member.is_muted
    elif action == 'hide': member.is_hidden = not member.is_hidden
    db.session.commit()
    return jsonify({'ok': True, 'is_muted': member.is_muted, 'is_hidden': member.is_hidden})


@app.route('/chat/<int:chat_id>/kick', methods=['POST'])
def chat_kick(chat_id):
    if 'user_id' not in session: return jsonify({'error': 'not logged in'}), 401
    me = User.query.get(session['user_id'])
    my_member = ChatMember.query.filter_by(chat_id=chat_id, user_id=me.id).first()
    if not my_member or my_member.role != 'admin': return jsonify({'error': 'forbidden'}), 403
    uid = request.form.get('user_id', type=int)
    target_member = ChatMember.query.filter_by(chat_id=chat_id, user_id=uid).first()
    if not target_member: return jsonify({'error': 'not found'}), 404
    action = request.form.get('action', 'kick')
    if action == 'ban':
        target = User.query.get(uid)
        if target and not target.is_admin:
            target.is_banned = True
            db.session.add(BanRecord(user_id=uid, reason=f'Бан из чата #{chat_id}', banned_by=me.id))
    db.session.delete(target_member)
    db.session.commit()
    return jsonify({'ok': True})


@app.route('/chat/<int:chat_id>/leave', methods=['POST'])
def chat_leave(chat_id):
    if 'user_id' not in session: return jsonify({'error': 'not logged in'}), 401
    me_id = session['user_id']
    member = ChatMember.query.filter_by(chat_id=chat_id, user_id=me_id).first()
    if member: db.session.delete(member); db.session.commit()
    return jsonify({'ok': True})


@app.route('/chat/<int:chat_id>/messages')
def chat_messages_get(chat_id):
    if 'user_id' not in session: return jsonify({'error': 'not logged in'}), 401
    me_id = session['user_id']
    if not ChatMember.query.filter_by(chat_id=chat_id, user_id=me_id).first():
        return jsonify({'error': 'not a member'}), 403
    after = request.args.get('after', 0, type=int)
    msgs = Message.query.filter(
        Message.chat_id == chat_id,
        Message.id > after
    ).order_by(Message.created_at).limit(50).all()
    return jsonify([_msg_to_dict(m, me_id) for m in msgs])


@app.route('/messages/send-media', methods=['POST'])
def messages_send_media():
    """Send image/video/voice to a direct message or group chat"""
    if 'user_id' not in session: return jsonify({'error': 'not logged in'}), 401
    user = User.query.get(session['user_id'])
    if user.is_muted: return jsonify({'error': 'muted'}), 403
    to_id = request.form.get('to_id', type=int)
    chat_id = request.form.get('chat_id', type=int)
    msg_type = request.form.get('msg_type', 'image')  # image|video|voice
    content = request.form.get('content', '').strip()
    media_file = request.files.get('file')
    media_fn = ''
    if media_file and media_file.filename:
        ext = media_file.filename.rsplit('.', 1)[-1].lower() if '.' in media_file.filename else ''
        if msg_type == 'voice':
            folder = VOICE_FOLDER
            allowed = {'ogg', 'webm', 'mp3', 'wav', 'm4a'}
        else:
            folder = CHAT_MEDIA_FOLDER
            allowed = ALLOWED_IMG | ALLOWED_GIF | ALLOWED_VID
        if ext in allowed:
            media_fn = secure_filename(f"chatmedia_{user.id}_{int(datetime.utcnow().timestamp())}.{ext}")
            media_file.save(os.path.join(folder, media_fn))
    if not media_fn and not content: return jsonify({'error': 'empty'}), 400
    msg = Message(from_user_id=user.id, to_user_id=to_id, chat_id=chat_id,
                  content=content, msg_type=msg_type if media_fn else 'text',
                  media_file=media_fn)
    db.session.add(msg); db.session.commit()
    return jsonify({'ok': True, 'msg': _msg_to_dict(msg, user.id)})


@app.route('/messages/send-voice', methods=['POST'])
def messages_send_voice():
    if 'user_id' not in session: return jsonify({'error': 'not logged in'}), 401
    user = User.query.get(session['user_id'])
    if user.is_muted: return jsonify({'error': 'muted'}), 403
    to_id = request.form.get('to_id', type=int)
    chat_id = request.form.get('chat_id', type=int)
    voice_file = request.files.get('voice')
    if not voice_file or not voice_file.filename: return jsonify({'error': 'no file'}), 400
    ext = 'ogg'
    fn = secure_filename(f"voice_{user.id}_{int(datetime.utcnow().timestamp())}.{ext}")
    voice_file.save(os.path.join(VOICE_FOLDER, fn))
    msg = Message(from_user_id=user.id, to_user_id=to_id, chat_id=chat_id,
                  content='', msg_type='voice', media_file=fn)
    db.session.add(msg); db.session.commit()
    return jsonify({'ok': True, 'msg': _msg_to_dict(msg, user.id)})


@app.route('/messages/edit/<int:msg_id>', methods=['POST'])
def messages_edit(msg_id):
    if 'user_id' not in session: return jsonify({'error': 'not logged in'}), 401
    me_id = session['user_id']
    msg = Message.query.get_or_404(msg_id)
    if msg.from_user_id != me_id: return jsonify({'error': 'forbidden'}), 403
    new_content = request.form.get('content', '').strip()
    if not new_content: return jsonify({'error': 'empty'}), 400
    msg.content = new_content; msg.is_edited = True; msg.edited_at = datetime.utcnow()
    db.session.commit()
    return jsonify({'ok': True, 'content': msg.content})


@app.route('/messages/delete/<int:msg_id>', methods=['POST'])
def messages_delete(msg_id):
    if 'user_id' not in session: return jsonify({'error': 'not logged in'}), 401
    me = User.query.get(session['user_id'])
    msg = Message.query.get_or_404(msg_id)
    # Admin can delete any; user can delete own
    if msg.from_user_id != me.id and not me.is_admin: return jsonify({'error': 'forbidden'}), 403
    msg.is_deleted = True; msg.content = ''; msg.media_file = ''
    db.session.commit()
    return jsonify({'ok': True})


@app.route('/messages/react/<int:msg_id>', methods=['POST'])
def messages_react(msg_id):
    if 'user_id' not in session: return jsonify({'error': 'not logged in'}), 401
    me_id = session['user_id']
    emoji = request.form.get('emoji', '')
    if not emoji: return jsonify({'error': 'emoji required'}), 400
    msg = Message.query.get_or_404(msg_id)
    existing = MessageReaction.query.filter_by(message_id=msg_id, user_id=me_id).first()
    if existing:
        if existing.emoji == emoji:
            db.session.delete(existing); db.session.commit()
            return jsonify({'removed': True, 'emoji': emoji})
        else:
            existing.emoji = emoji; db.session.commit()
    else:
        db.session.add(MessageReaction(message_id=msg_id, user_id=me_id, emoji=emoji))
        db.session.commit()
    reactions = {}
    for r in MessageReaction.query.filter_by(message_id=msg_id).all():
        reactions[r.emoji] = reactions.get(r.emoji, 0) + 1
    return jsonify({'ok': True, 'reactions': reactions})


@app.route('/messages/typing', methods=['POST'])
def messages_typing():
    """Store typing status in session (lightweight, no DB)"""
    if 'user_id' not in session: return jsonify({'ok': False})
    me_id = session['user_id']
    to_id = request.form.get('to_id', type=int)
    chat_id = request.form.get('chat_id', type=int)
    import time
    key = f'typing_{me_id}_to_{to_id or "g" + str(chat_id)}'
    # Store in a simple in-memory dict (good enough for single-process)
    app.config.setdefault('TYPING_STATUS', {})[key] = time.time()
    return jsonify({'ok': True})


@app.route('/messages/typing/poll')
def messages_typing_poll():
    if 'user_id' not in session: return jsonify({'typing': False})
    import time
    me_id = session['user_id']
    with_id = request.args.get('with', type=int)
    chat_id = request.args.get('chat_id', type=int)
    typing_dict = app.config.get('TYPING_STATUS', {})
    now = time.time()
    # Clean stale entries
    stale = [k for k, v in typing_dict.items() if now - v > 4]
    for k in stale: del typing_dict[k]
    if with_id:
        key = f'typing_{with_id}_to_{me_id}'
        is_typing = key in typing_dict and (now - typing_dict[key]) < 4
    elif chat_id:
        # Any member of the group chat typing
        is_typing = any(
            k.startswith(f'typing_') and f'_to_g{chat_id}' in k and (now - v) < 4
            for k, v in typing_dict.items()
            if not k.startswith(f'typing_{me_id}_')
        )
    else:
        is_typing = False
    return jsonify({'typing': is_typing})


@app.route('/shop')
def shop():
    if 'user_id' not in session: return redirect('/login')
    user = User.query.get(session['user_id'])
    tab = request.args.get('tab', 'avatar')
    if tab not in {'avatar', 'banner', 'frame', 'wallpaper', 'effect', 'nick_color', 'leaderboard', 'quests'}:
        tab = 'avatar'
    search_q = request.args.get('q', '').strip()
    item_id = request.args.get('item_id', type=int)

    filters = []
    if item_id:
        filters.append(ShopItem.id == item_id)
    if search_q:
        filters.append(db.or_(ShopItem.name.ilike(f'%{search_q}%'),
                              ShopItem.description.ilike(f'%{search_q}%')))

    avatars = ShopItem.query.filter(ShopItem.item_type == 'avatar', *filters).all()
    banners = ShopItem.query.filter(ShopItem.item_type == 'banner', *filters).all()
    frames = ShopItem.query.filter(ShopItem.item_type == 'frame', *filters).all()
    wallpapers = ShopItem.query.filter(ShopItem.item_type == 'wallpaper', *filters).all()
    effects = ShopItem.query.filter(ShopItem.item_type == 'effect', *filters).all()
    nick_colors = ShopItem.query.filter(ShopItem.item_type == 'nick_color', *filters).all()
    owned = {p.item_id for p in Purchase.query.filter_by(user_id=user.id).all()}
    notifs_unread = get_unread_notifs(user.id)
    return render_template('shop.html', user=user, avatars=avatars, banners=banners,
                           frames=frames, wallpapers=wallpapers, effects=effects,
                           nick_colors=nick_colors, owned=owned,
                           inventory=get_inventory(user.id), notifs_unread=notifs_unread,
                           get_avatar_url=get_avatar_url, can_use_banner=can_use_banner,
                           can_use_gif_avatar=can_use_gif_avatar, tab=tab,
                           search_q=search_q)


@app.route('/shop/buy/<int:item_id>', methods=['POST'])
def shop_buy(item_id):
    if 'user_id' not in session: return redirect('/login')
    user = User.query.get(session['user_id'])
    item = ShopItem.query.get_or_404(item_id)
    tab = request.form.get('tab', 'avatar')
    if user_has_item(user.id, item_id): return redirect(f'/shop?error=already_owned&tab={tab}')
    if not user.is_admin and user.kp < item.price_kp: return redirect(f'/shop?error=not_enough_kp&tab={tab}')
    if not user.is_admin: user.kp -= item.price_kp
    db.session.add(Purchase(user_id=user.id, item_id=item_id))
    if item.item_type == 'avatar': user.avatar = f'__shop__/{item.filename}'
    elif item.item_type == 'banner': user.banner = f'__shop__/{item.filename}'
    elif item.item_type == 'frame': user.frame = item.filename
    add_xp(user, 10); db.session.commit()
    return redirect(f'/shop?success=1&tab={tab}')


@app.route('/shop/equip/<int:item_id>', methods=['POST'])
def shop_equip(item_id):
    if 'user_id' not in session: return redirect('/login')
    user = User.query.get(session['user_id'])
    if not user_has_item(user.id, item_id): return redirect('/shop')
    item = ShopItem.query.get_or_404(item_id)
    if item.item_type == 'avatar': user.avatar = f'__shop__/{item.filename}'
    elif item.item_type == 'banner': user.banner = f'__shop__/{item.filename}'
    elif item.item_type == 'frame': user.frame = item.filename
    db.session.commit(); return redirect('/profile')


@app.route('/shop/unequip/<slot>', methods=['POST'])
def shop_unequip(slot):
    if 'user_id' not in session: return redirect('/login')
    user = User.query.get(session['user_id'])
    if slot == 'avatar': user.avatar = 'default_avatar.jpg'
    elif slot == 'banner': user.banner = 'default_banner.jpg'
    elif slot == 'frame': user.frame = ''
    db.session.commit(); return redirect('/profile')


@app.route('/edit-profile', methods=['GET', 'POST'])
def edit_profile():
    if 'user_id' not in session: return redirect('/login')
    user = User.query.get(session['user_id'])
    error = None
    if request.method == 'POST':
        new_username = request.form['username'].strip()
        existing = User.query.filter_by(username=new_username).first()
        if existing and existing.id != user.id:
            error = 'Ник занят!'
        else:
            first_bio = not user.bio and request.form.get('bio', '').strip()
            user.username = new_username
            user.bio = request.form.get('bio', '')
            user.location = request.form.get('location', '')
            user.status_emoji = request.form.get('status_emoji', '')
            user.birthday = request.form.get('birthday', '')
            user.show_birthday = 'show_birthday' in request.form
            if user.is_admin: user.badge = request.form.get('badge', '')
            chosen_title = request.form.get('chosen_title', '')
            if chosen_title:
                for req_lvl, t, _ in LEVEL_TITLES:
                    if t == chosen_title and user.level >= req_lvl:
                        user.title = chosen_title; break
            if first_bio: add_xp(user, 100)
            db.session.commit(); return redirect('/profile')
    notifs_unread = get_unread_notifs(user.id)
    return render_template('edit_profile.html', user=user, error=error,
                           level_titles=LEVEL_TITLES, notifs_unread=notifs_unread,
                           get_avatar_url=get_avatar_url, get_banner_url=get_banner_url)


@app.route('/edit-avatar', methods=['GET', 'POST'])
def edit_avatar():
    if 'user_id' not in session: return redirect('/login')
    user = User.query.get(session['user_id'])
    error = success = None
    if request.method == 'POST':
        avatar_file = request.files.get('avatar')
        banner_file = request.files.get('banner')
        music_file = request.files.get('music')
        if avatar_file and avatar_file.filename:
            ext, ok = allowed_file(avatar_file.filename)
            if ok:
                if ext in ALLOWED_GIF | ALLOWED_VID and not can_use_gif_avatar(user):
                    error = 'GIF аватарка — Ур.80+'
                else:
                    fn = secure_filename(f"avatar_{user.id}_{int(datetime.utcnow().timestamp())}.{ext}")
                    avatar_file.save(os.path.join(app.config['UPLOAD_FOLDER'], fn))
                    user.avatar = fn; success = 'Аватарка сохранена!'
        if banner_file and banner_file.filename:
            ext, ok = allowed_file(banner_file.filename)
            if ok:
                if not can_use_banner(user): error = 'Баннер — с Ур.50!'
                else:
                    fn = secure_filename(f"banner_{user.id}_{int(datetime.utcnow().timestamp())}.{ext}")
                    banner_file.save(os.path.join(app.config['UPLOAD_FOLDER'], fn))
                    user.banner = fn; success = 'Баннер сохранён!'
        if music_file and music_file.filename:
            ext, ok = allowed_file(music_file.filename)
            if ok and ext in ALLOWED_AUD:
                fn = secure_filename(f"music_{user.id}_{int(datetime.utcnow().timestamp())}.{ext}")
                music_file.save(os.path.join(app.config['UPLOAD_FOLDER'], fn))
                user.music = fn; user.music_name = request.form.get('music_name', music_file.filename)
                success = 'Музыка сохранена!'
        # Цвет баннера — доступен ВСЕМ
        banner_color = request.form.get('banner_color', '').strip()
        if banner_color and banner_color.startswith('#'):
            user.banner = f'__color__{banner_color}'
            success = 'Цвет баннера сохранён!'

        if not success and not error: error = 'Выбери файл или цвет'
        db.session.commit()
    return render_template('edit_avatar.html', user=user, error=error, success=success,
                           get_avatar_url=get_avatar_url, get_banner_url=get_banner_url,
                           can_use_banner=can_use_banner, can_use_gif_avatar=can_use_gif_avatar)


@app.route('/settings', methods=['GET', 'POST'])
def settings():
    if 'user_id' not in session: return redirect('/login')
    user = User.query.get(session['user_id'])
    success = error = None
    if request.method == 'POST':
        action = request.form.get('action')
        if action == 'password':
            old_pw = request.form.get('old_password', ''); new_pw = request.form.get('new_password', '')
            if user.password != old_pw: error = 'Неверный пароль!'
            elif len(new_pw) < 8: error = 'Минимум 8 символов!'
            else:
                user.password = new_pw; db.session.commit()
                email_password_changed(user, new_pw); success = 'Пароль изменён!'
        elif action == 'email_send_code':
            new_email = request.form.get('new_email', '').strip(); pw = request.form.get('email_password', '')
            if user.password != pw: error = 'Неверный пароль!'
            elif not new_email or '@' not in new_email: error = 'Некорректный email!'
            elif User.query.filter_by(email=new_email).first(): error = 'Email занят!'
            else:
                code = gen_code(6); user.email_code = f'{code}|{new_email}'; db.session.commit()
                email_code_send(user, code, 'Подтверждение смены email', f'Ты меняешь email на <b>{new_email}</b>.')
                success = 'Код отправлен!'
        elif action == 'email_confirm_code':
            inp = request.form.get('email_code_input', '').strip()
            if user.email_code and '|' in user.email_code:
                stored, new_email = user.email_code.split('|', 1)
                if inp == stored: user.email = new_email; user.email_code = ''; db.session.commit(); success = 'Email изменён!'
                else: error = 'Неверный код!'
            else: error = 'Сначала запроси код!'
        elif action == 'phone_send':
            phone = request.form.get('phone', '').strip()
            if phone:
                code = gen_code(6); user.phone = phone; user.phone_code = code; db.session.commit()
                email_code_send(user, code, 'Подтверждение номера', f'Добавляешь номер <b>{phone}</b>.')
                success = f'Код отправлен на {user.email}!'
            else: error = 'Введи номер!'
        elif action == 'phone_verify':
            inp = request.form.get('phone_code', '').strip()
            if inp == user.phone_code and user.phone_code:
                user.phone_verified = True; user.phone_code = ''; db.session.commit(); success = 'Номер подтверждён!'
            else: error = 'Неверный код!'
        elif action == 'theme':
            user.theme = request.form.get('theme', 'dark')
            user.accent_color = request.form.get('accent_color', '#7F77DD')
            db.session.commit(); success = 'Тема сохранена!'
        elif action == 'notif':
            user.notif_sound = 'notif_sound' in request.form
            user.notif_popup = 'notif_popup' in request.form
            db.session.commit(); success = 'Уведомления сохранены!'
        elif action == 'privacy':
            user.profile_private = 'profile_private' in request.form
            user.hide_online = 'hide_online' in request.form
            user.hide_level = 'hide_level' in request.form
            user.hide_birthday = 'hide_birthday' in request.form
            db.session.commit(); success = 'Сохранено!'
        elif action == 'language':
            user.lang = request.form.get('lang', 'ru')
            db.session.commit(); success = 'Язык сохранён!'
        elif action == 'wallpaper':
            if user.is_admin or user.is_verified:
                wf = request.files.get('wallpaper_file')
                if wf and wf.filename:
                    ext, ok = allowed_file(wf.filename)
                    if ok and ext in ALLOWED_IMG | ALLOWED_GIF:
                        fn = secure_filename(f"wp_{user.id}_{int(datetime.utcnow().timestamp())}.{ext}")
                        wf.save(os.path.join(app.config['UPLOAD_FOLDER'], fn))
                        user.wallpaper = fn; db.session.commit(); success = 'Обои сохранены!'
    next_xp = get_next_xp(user.xp)
    xp_pct = min(100, int(user.xp/max(next_xp,1)*100))
    notifs_unread = get_unread_notifs(user.id)
    return render_template('settings.html', user=user, success=success, error=error,
                           xp_pct=xp_pct, next_xp=next_xp, notifs_unread=notifs_unread,
                           get_avatar_url=get_avatar_url)


@app.route('/settings/tg-link', methods=['POST'])
def tg_link():
    if 'user_id' not in session: return redirect('/login')
    user = User.query.get(session['user_id'])
    token = gen_tg_token(); user.tg_token = token; db.session.commit()
    return jsonify({'url': f'https://t.me/KVARON_X_bot?start={token}', 'token': token})


@app.route('/settings/tg-unlink', methods=['POST'])
def tg_unlink():
    if 'user_id' not in session: return redirect('/login')
    user = User.query.get(session['user_id'])
    user.tg_id = ''; user.tg_username = ''; user.tg_token = ''; db.session.commit()
    return jsonify({'ok': True})


@app.route('/authors')
def authors():
    if 'user_id' not in session: return redirect('/login')
    user = User.query.get(session['user_id'])
    notifs_unread = get_unread_notifs(user.id)
    visited_key = f'authors_visited_{user.id}'
    if not session.get(visited_key):
        add_xp(user, 50); user.kp += 5; db.session.commit(); session[visited_key] = True
    return render_template('authors.html', user=user, notifs_unread=notifs_unread, get_avatar_url=get_avatar_url)


@app.route('/admin')
def admin_panel():
    if 'user_id' not in session: return redirect('/login')
    me = User.query.get(session['user_id'])
    if not me.is_admin: return redirect('/feed')
    users = User.query.order_by(User.id).all()
    bans = BanRecord.query.order_by(BanRecord.banned_at.desc()).limit(30).all()
    notifs_unread = get_unread_notifs(me.id)

    today = datetime.utcnow().date()
    week_ago = datetime.utcnow() - timedelta(days=7)
    online_threshold = datetime.utcnow() - timedelta(minutes=5)

    # Dashboard metrics
    regs_today = User.query.filter(db.func.date(User.created_at) == today).count()
    regs_week  = User.query.filter(User.created_at >= week_ago).count()
    posts_today = Post.query.filter(db.func.date(Post.created_at) == today).count()
    online_now  = User.query.filter(User.last_seen >= online_threshold).count()

    # Top shop items by purchase count
    from sqlalchemy import func
    top_items = db.session.query(
        ShopItem, func.count(Purchase.id).label('cnt')
    ).join(Purchase, Purchase.item_id == ShopItem.id, isouter=True)     .group_by(ShopItem.id).order_by(func.count(Purchase.id).desc()).limit(5).all()

    # Reports
    reports = Report.query.filter_by(status='pending')        .order_by(Report.created_at.desc()).all()
    reports_count = len(reports)

    # Audit log
    audit_logs = AuditLog.query.order_by(AuditLog.created_at.desc()).limit(50).all()
    # Notification-based reports (user complaints without posts)
    admin_user = User.query.get(session['user_id'])
    report_notifs = Notification.query.filter_by(
        user_id=admin_user.id, notif_type='report'
    ).order_by(Notification.created_at.desc()).limit(30).all()

    items = ShopItem.query.order_by(ShopItem.created_at.desc()).all()
    return render_template('admin.html', me=me, users=users, bans=bans,
                           notifs_unread=notifs_unread, get_avatar_url=get_avatar_url,
                           regs_today=regs_today, regs_week=regs_week,
                           posts_today=posts_today, online_now=online_now,
                           top_items=top_items, reports=reports,
                           reports_count=reports_count, audit_logs=audit_logs,
                           items=items, SHOP_TYPE_LABELS=SHOP_TYPE_LABELS,
                           success=None, error=None,
                           report_notifs=report_notifs)


@app.route('/admin/ban', methods=['POST'])
def admin_ban():
    if 'user_id' not in session: return redirect('/login')
    me = User.query.get(session['user_id'])
    if not me.is_admin: return redirect('/feed')
    target_name = request.form.get('username', '').strip()
    target_ip = request.form.get('ip', '').strip()
    reason = request.form.get('reason', 'Нарушение правил')
    if target_name:
        t = User.query.filter_by(username=target_name).first()
        if t and not t.is_admin:
            t.is_banned = True
            db.session.add(BanRecord(user_id=t.id, ip=t.last_ip, reason=reason, banned_by=me.id))
            audit(me.id, f'Выдан бан пользователю {t.username}', reason)
            db.session.commit()
    elif target_ip:
        db.session.add(BanRecord(ip=target_ip, reason=reason, banned_by=me.id))
        u = User.query.filter_by(last_ip=target_ip).first()
        if u and not u.is_admin: u.is_banned = True
        db.session.commit()
    return redirect('/admin')


@app.route('/admin/report/delete/<int:report_id>', methods=['POST'])
def admin_report_delete_post(report_id):
    if 'user_id' not in session: return redirect('/login')
    me = User.query.get(session['user_id'])
    if not me.is_admin: return redirect('/feed')
    rep = Report.query.get_or_404(report_id)
    post = rep.post
    rep.status = 'resolved'
    Like.query.filter_by(post_id=post.id).delete()
    Comment.query.filter_by(post_id=post.id).delete()
    Report.query.filter_by(post_id=post.id).update({'status': 'resolved'})
    db.session.delete(post)
    audit(me.id, f'Удалён пост #{post.id} по жалобе #{report_id}', post.user.username if post.user else '')
    db.session.commit()
    return redirect('/admin?tab=reports')


@app.route('/admin/report/ignore/<int:report_id>', methods=['POST'])
def admin_report_ignore(report_id):
    if 'user_id' not in session: return redirect('/login')
    me = User.query.get(session['user_id'])
    if not me.is_admin: return redirect('/feed')
    rep = Report.query.get_or_404(report_id)
    rep.status = 'ignored'
    audit(me.id, f'Игнорирована жалоба #{report_id}', '')
    db.session.commit()
    return redirect('/admin?tab=reports')


@app.route('/admin/post/delete/<int:post_id>', methods=['POST'])
def admin_post_delete(post_id):
    if 'user_id' not in session: return redirect('/login')
    me = User.query.get(session['user_id'])
    if not me.is_admin: return redirect('/feed')
    post = Post.query.get_or_404(post_id)
    author = post.user.username if post.user else 'Unknown'
    Like.query.filter_by(post_id=post_id).delete()
    Comment.query.filter_by(post_id=post_id).delete()
    Report.query.filter_by(post_id=post_id).update({'status': 'resolved'})
    db.session.delete(post)
    audit(me.id, f'Удалён пост #{post_id} напрямую из админки', author)
    db.session.commit()
    return redirect('/admin')


@app.route('/report/post/<int:post_id>', methods=['POST'])
def report_post(post_id):
    if 'user_id' not in session: return jsonify({'error': 'not logged in'}), 401
    user = User.query.get(session['user_id'])
    post = Post.query.get_or_404(post_id)
    reason = request.form.get('reason', '').strip()
    if not reason: return jsonify({'error': 'no reason'}), 400
    if Report.query.filter_by(post_id=post_id, reporter_id=user.id, status='pending').first():
        return jsonify({'ok': True, 'msg': 'already_reported'})
    rep = Report(post_id=post_id, reporter_id=user.id, reason=reason)
    db.session.add(rep); db.session.commit()
    send_tg_report_alert(rep, post, user)
    return jsonify({'ok': True})


@app.route('/admin/unban/<int:uid>', methods=['POST'])
def admin_unban(uid):
    if 'user_id' not in session or not User.query.get(session['user_id']).is_admin: return redirect('/feed')
    t = User.query.get_or_404(uid); t.is_banned = False; db.session.commit(); return redirect('/admin')


@app.route('/admin/mute/<int:uid>', methods=['POST'])
def admin_mute(uid):
    if 'user_id' not in session or not User.query.get(session['user_id']).is_admin: return redirect('/feed')
    t = User.query.get_or_404(uid)
    if not t.is_admin: t.is_muted = not t.is_muted; db.session.commit()
    return redirect('/admin')


@app.route('/admin/verify/<int:uid>', methods=['POST'])
def admin_verify(uid):
    if 'user_id' not in session or not User.query.get(session['user_id']).is_admin: return redirect('/feed')
    t = User.query.get_or_404(uid); t.is_verified = not t.is_verified; db.session.commit()
    return redirect('/admin')


@app.route('/admin/make-admin/<int:uid>', methods=['POST'])
def admin_make_admin(uid):
    if 'user_id' not in session: return redirect('/login')
    me = User.query.get(session['user_id'])
    if not me.is_admin: return redirect('/feed')
    t = User.query.get_or_404(uid)
    if t.id != me.id:
        t.is_admin = not t.is_admin
        if t.is_admin:
            t.kp = 2026; t.xp = 50000; t.level = 100
            t.title = 'KRX God / Абсолют'
            if not t.badge: t.badge = 'admin'
        db.session.commit()
    return redirect('/admin')


@app.route('/admin/give-kp/<int:uid>', methods=['POST'])
def admin_give_kp(uid):
    if 'user_id' not in session or not User.query.get(session['user_id']).is_admin: return redirect('/feed')
    t = User.query.get_or_404(uid)
    amount = request.form.get('amount', 0, type=int)
    t.kp += amount
    audit(t.id if not User.query.get(session['user_id']).is_admin else session['user_id'],
          f'Выдано {amount} KP пользователю {t.username}', str(amount))
    db.session.commit()
    return redirect('/admin')


@app.route('/admin/shop/add', methods=['GET', 'POST'])
def admin_shop_add():
    if 'user_id' not in session: return redirect('/login')
    me = User.query.get(session['user_id'])
    if not me.is_admin: return redirect('/feed')
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        item_type = request.form.get('item_type', '')
        price_kp = request.form.get('price_kp', 100, type=int)
        desc = request.form.get('description', '').strip()
        if item_type == 'nick_color':
            hex_color = request.form.get('hex_color', '').strip()
            if name and hex_color:
                db.session.add(ShopItem(name=name, description=desc,
                               item_type='nick_color', filename=hex_color,
                               price_kp=price_kp, preview=hex_color))
                db.session.commit()
                audit(me.id, f'Добавлен товар: {name}', 'nick_color')
            return redirect('/admin?tab=shop&success=1')
        file = request.files.get('file')
        if name and item_type and file and file.filename:
            ext, ok = allowed_file(file.filename)
            if ok:
                folder = {
                    'avatar':'avatars','banner':'banners','frame':'frames',
                    'wallpaper':'wallpapers','effect':'effects','nick_color':'nick_colors'
                }.get(item_type, 'avatars')
                fn = secure_filename(f"{item_type}_{int(datetime.utcnow().timestamp())}.{ext}")
                save_path = os.path.join(app.config['SHOP_FOLDER'], folder, fn)
                os.makedirs(os.path.dirname(save_path), exist_ok=True)
                file.save(save_path)
                db.session.add(ShopItem(name=name, description=desc,
                               item_type=item_type, filename=fn,
                               price_kp=price_kp, preview=fn))
                db.session.commit()
                audit(me.id, f'Добавлен товар: {name}', item_type)
        return redirect('/admin?tab=shop&success=1')
    return redirect('/admin?tab=shop')


@app.route('/admin/shop/edit/<int:item_id>', methods=['POST'])
def admin_shop_edit(item_id):
    if 'user_id' not in session or not User.query.get(session['user_id']).is_admin: return redirect('/feed')
    item = ShopItem.query.get_or_404(item_id)
    me = User.query.get(session['user_id'])
    item.name = request.form.get('name', item.name).strip()
    item.description = request.form.get('description', item.description).strip()
    item.price_kp = request.form.get('price_kp', item.price_kp, type=int)
    audit(me.id, f'Изменён товар: {item.name} (ID:{item.id})', f'Цена:{item.price_kp}')
    db.session.commit()
    return redirect('/admin?tab=shop')


@app.route('/admin/shop/delete/<int:item_id>', methods=['POST'])
def admin_shop_delete(item_id):
    if 'user_id' not in session or not User.query.get(session['user_id']).is_admin: return redirect('/feed')
    item = ShopItem.query.get_or_404(item_id)
    audit(session['user_id'], f'Удалён товар из магазина: {item.name} (ID:{item.id})', item.item_type)
    Purchase.query.filter_by(item_id=item_id).delete()
    db.session.delete(item); db.session.commit()
    return redirect('/admin?tab=shop')


@app.route('/delete-account', methods=['POST'])
def delete_account():
    if 'user_id' not in session: return redirect('/login')
    user = User.query.get(session['user_id'])
    if user.password != request.form.get('password'): return redirect('/settings')
    uid = user.id
    for M, f in [(Post,'user_id'),(Like,'user_id'),(Comment,'user_id'),
                 (Purchase,'user_id'),(Notification,'user_id'),(TrackLike,'user_id'),
                 (LibraryTrack,'user_id'),(GroupMember,'user_id'),(GroupMessage,'user_id'),
                 (LFGPost,'user_id')]:
        M.query.filter_by(**{f: uid}).delete()
    FriendRequest.query.filter((FriendRequest.from_user_id==uid)|(FriendRequest.to_user_id==uid)).delete()
    Message.query.filter((Message.from_user_id==uid)|(Message.to_user_id==uid)).delete()
    Follow.query.filter((Follow.follower_id==uid)|(Follow.following_id==uid)).delete()
    db.session.delete(user); db.session.commit(); session.clear()
    return redirect('/register')


# ============================================================
#  KRXWallet
# ============================================================

@app.route('/wallet')
def wallet():
    if 'user_id' not in session: return redirect('/login')
    user = User.query.get(session['user_id'])
    tab = request.args.get('tab', 'all')
    notifs_unread = get_unread_notifs(user.id)

    q = Transaction.query.filter(
        (Transaction.from_user_id == user.id) | (Transaction.to_user_id == user.id)
    )
    if tab == 'received':
        q = Transaction.query.filter_by(to_user_id=user.id)
    elif tab == 'sent':
        q = Transaction.query.filter_by(from_user_id=user.id, tx_type='transfer')
    elif tab == 'purchases':
        q = Transaction.query.filter_by(from_user_id=user.id, tx_type='purchase')

    transactions = q.order_by(Transaction.created_at.desc()).limit(60).all()

    # Курсы (фиктивные, для красоты)
    rates = {'USD': 0.0024, 'UAH': 0.10, 'RUB': 0.22}
    currency = request.args.get('currency', 'USD')
    rate = rates.get(currency, rates['USD'])
    converted = round(user.kp * rate, 2)

    return render_template('wallet.html', user=user, transactions=transactions,
                           notifs_unread=notifs_unread, get_avatar_url=get_avatar_url,
                           tab=tab, currency=currency, converted=converted,
                           rates=rates, rate=rate)


@app.route('/wallet/transfer', methods=['POST'])
def wallet_transfer():
    if 'user_id' not in session: return jsonify({'error': 'not logged in'}), 401
    me = User.query.get(session['user_id'])
    target_username = request.form.get('to', '').strip().lstrip('@')
    amount = request.form.get('amount', 0, type=int)
    comment = request.form.get('comment', '').strip()

    if not target_username:
        return jsonify({'error': 'Укажи получателя'}), 400
    if amount <= 0:
        return jsonify({'error': 'Сумма должна быть > 0'}), 400
    if amount > me.kp and not me.is_admin:
        return jsonify({'error': 'Недостаточно KP'}), 400
    if len(comment) < 2:
        return jsonify({'error': 'Напиши комментарий (мин. 2 символа)'}), 400

    target = User.query.filter_by(username=target_username).first()
    if not target:
        target = User.query.get(target_username) if target_username.isdigit() else None
    if not target:
        return jsonify({'error': 'Пользователь не найден'}), 404
    if target.id == me.id:
        return jsonify({'error': 'Нельзя переводить самому себе'}), 400

    if not me.is_admin:
        me.kp -= amount
    target.kp += amount

    tx = Transaction(from_user_id=me.id, to_user_id=target.id,
                     amount=amount, comment=comment, tx_type='transfer')
    db.session.add(tx)
    add_notification(target.id, me.id, 'wallet',
                     f'💸 Получено {amount} KP от @{me.username}. Комментарий: {comment}')
    # Telegram уведомление получателю
    if target.tg_id:
        try:
            import requests as req_lib
            req_lib.post(
                f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage',
                json={'chat_id': target.tg_id,
                      'text': f'💸 Вам поступило {amount} KP от @{me.username}\nКомментарий: {comment}\nБаланс: {target.kp} KP'},
                timeout=5
            )
        except: pass

    db.session.commit()
    return jsonify({'ok': True, 'new_balance': me.kp})


@app.route('/wallet/search-user')
def wallet_search_user():
    if 'user_id' not in session: return jsonify([])
    q = request.args.get('q', '').strip()
    if len(q) < 2: return jsonify([])
    me_id = session['user_id']
    users = User.query.filter(
        User.username.ilike(f'%{q}%'), User.id != me_id, User.is_banned == False
    ).limit(8).all()
    return jsonify([{'id': u.id, 'username': u.username,
                     'avatar': get_avatar_url(u)} for u in users])




@app.route('/admin/warn/user/<int:uid>', methods=['POST'])
def admin_warn_user(uid):
    if 'user_id' not in session: return jsonify({'error': 'not logged in'}), 401
    me = User.query.get(session['user_id'])
    if not me.is_admin: return jsonify({'error': 'forbidden'}), 403
    target = User.query.get_or_404(uid)
    reason = request.form.get('reason', '').strip()
    if not reason: return jsonify({'error': 'Укажи причину'}), 400
    # Add warning notification to target
    add_notification(target.id, me.id, 'admin_warning',
                     f'⚠️ Предупреждение от Администратора @{me.username}: {reason}')
    from database import AuditLog
    db.session.add(AuditLog(admin_id=me.id,
                            action=f'Предупреждение пользователю @{target.username}: {reason}',
                            target=target.username))
    db.session.commit()
    # Telegram to target if linked
    if target.tg_id:
        try:
            import requests as rlib
            rlib.post(f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage',
                json={'chat_id': target.tg_id,
                      'text': f'⚠️ <b>Предупреждение от Администратора @{me.username}</b>\n{reason}',
                      'parse_mode': 'HTML'}, timeout=5)
        except: pass
    return jsonify({'ok': True})


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
