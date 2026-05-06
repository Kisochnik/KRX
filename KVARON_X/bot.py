import telebot
from telebot import apihelper
from telebot.types import (ReplyKeyboardMarkup, KeyboardButton,
                            InlineKeyboardMarkup, InlineKeyboardButton)
import sqlite3
from datetime import datetime, timedelta

# ===== НАСТРОЙКИ =====
BOT_TOKEN   = '8729170777:AAH2iDgyGbeB7xZHqAlvbTKgiPpzVZH0ecE'
BOT_NAME    = 'KVARON_X_bot'
SITE_NAME   = 'KRX - KVARON_X'
SITE_URL    = 'http://127.0.0.1:5000'

# Убедись, что этот путь ведет к тому же файлу БД, который использует Flask-сайт!
DB_PATH     = r'C:\Users\HP\Desktop\KVARON_X\instance\krx.db'

CHANNEL_URL = 'https://t.me/kvaron_x'
CHAT_URL    = 'https://t.me/kvaron_x_chat'

# Telegram ID администраторов для получения жалоб
ADMIN_TG_IDS = [7929358879]

bot = telebot.TeleBot(BOT_TOKEN, parse_mode='HTML')

# ===== СИСТЕМА УРОВНЕЙ =====
LEVEL_TITLES = [
    (0,   'Новичок KVARON_X',        'Только начал путь'),
    (5,   'Первый Контакт',          'Добавил первых друзей'),
    (10,  'Активный Юзер',           'Уже в теме'),
    (15,  'Социальный KRXer',        'Рамка разблокирована'),
    (20,  'Завсегдатай',             'Постоянно в ленте'),
    (25,  'Музыкальный Энтузиаст',   'Добавляет треки'),
    (30,  'Популярный',              'Растёт аудитория'),
    (35,  'Опытный KVARON_X',        'Уже не новичок'),
    (40,  'Король Лайков',           'Мастер вовлечения'),
    (45,  'Локальная Легенда',       'Известен в своей тусовке'),
    (50,  'KVARON_X Veteran',        'Баннер разблокирована'),
    (55,  'Коннектор',               'Мастер связей'),
    (60,  'Трендсеттер',             'Задаёт тренды'),
    (65,  'Элита KVARON_X',          'Один из лучших'),
    (70,  'Легенда Платформы',       'О тебе уже говорят'),
    (75,  'Мастер Сообщества',       'Сердце KVARON_X'),
    (80,  'Grand KRXian',            'Анимация ава'),
    (85,  'Immortal',                'Почти бессмертный'),
    (90,  'KVARON_X Overlord',       'Властелин платформы'),
    (95,  'God Tier',                'Бог уровня'),
    (100, 'KVARON_X God / Абсолют',  'Максимальный уровень'),
]

ROLE_POWER = {'player': 0, 'vip': 1, 'admin': 2, 'moder': 3}

# ===== ФУНКЦИИ РАБОТЫ С БД САЙТА =====
def get_db():
    conn = sqlite3.connect(DB_PATH, timeout=30)
    conn.row_factory = sqlite3.Row
    return conn

def row_value(row, key, default=None):
    try:
        return row[key]
    except (IndexError, KeyError, TypeError):
        return default


def get_user_by_tg(tg_id):
    db = get_db()
    u = db.execute('SELECT * FROM user WHERE tg_id=?', (str(tg_id),)).fetchone()
    db.close()
    return u

def get_user_by_token(token):
    db = get_db()
    u = db.execute('SELECT * FROM user WHERE tg_token=?', (token,)).fetchone()
    db.close()
    return u

def link_tg_to_user(token, tg_id, tg_username):
    db = get_db()
    # Привязываем ТГ к записи на сайте и очищаем временный токен
    db.execute('UPDATE user SET tg_id=?, tg_username=?, tg_token=NULL WHERE tg_token=?',
               (str(tg_id), tg_username or '', token))
    db.commit()
    db.close()

def get_user_title(level):
    title = 'Новичок KVARON_X'
    for req_lvl, t, _ in LEVEL_TITLES:
        if level >= req_lvl:
            title = t
    return title

def get_next_milestone(level):
    for req_lvl, t, desc in LEVEL_TITLES:
        if req_lvl > level:
            return req_lvl, t, desc
    return 100, 'KVARON_X God / Абсолют', 'Максимальный уровень'

def make_progress_bar(current_level, next_level, width=10):
    if next_level <= current_level:
        return '█' * width + ' 100%'
    pct = min(current_level / next_level, 1.0)
    filled = int(pct * width)
    bar = '█' * filled + '░' * (width - filled)
    return f'[{bar}] {int(pct * 100)}%'

# ===== КЛАВИАТУРЫ =====
def main_menu():
    kb = ReplyKeyboardMarkup(resize_keyboard=True, row_width=2)
    kb.add(
        KeyboardButton('👤 Профиль'),
        KeyboardButton('🏆 Уровни'),
        KeyboardButton('🌐 Сообщество'),
        KeyboardButton('📊 Топ игроков'),
        KeyboardButton('🔔 Уведомления'),
        KeyboardButton('🚩 Пожаловаться'),
    )
    return kb

def unlinked_menu():
    kb = ReplyKeyboardMarkup(resize_keyboard=True)
    kb.add(KeyboardButton('🔗 Привязать аккаунт'))
    kb.add(KeyboardButton('❓ Помощь'))
    return kb

def admin_menu():
    kb = ReplyKeyboardMarkup(resize_keyboard=True, row_width=2)
    kb.add(
        KeyboardButton('👤 Профиль'),
        KeyboardButton('🏆 Уровни'),
        KeyboardButton('🌐 Сообщество'),
        KeyboardButton('📊 Топ игроков'),
        KeyboardButton('🔔 Уведомления'),
        KeyboardButton('🚩 Пожаловаться'),
        KeyboardButton('🛡️ Жалобы (Адм)'),
        KeyboardButton('⚠️ Предупредить юзера'),
    )
    return kb

def is_admin_tg(tg_id):
    return int(tg_id) in ADMIN_TG_IDS

# ===== ОБРАБОТЧИКИ КОМАНД =====

@bot.message_handler(commands=['start'])
def cmd_start(message):
    args = message.text.split()
    tg_id = message.from_user.id
    tg_username = message.from_user.username or ''

    # Если перешли по ссылке вида /start <токен>
    if len(args) > 1:
        token = args[1]
        user = get_user_by_token(token)
        if user:
            link_tg_to_user(token, tg_id, tg_username)
            menu = admin_menu() if is_admin_tg(tg_id) else main_menu()
            bot.send_message(
                message.chat.id,
                f'✅ <b>Аккаунт успешно привязан к сайту!</b>\n\n'
                f'Добро пожаловать, <b>{user["username"]}</b>!\n'
                f'Ваш уровень: {get_user_title(user["level"])} (Ур. {user["level"]})\n'
                f'⚡ XP: {user["xp"]:,} | 💎 KRX: {row_value(user, "kp", 0):,}',
                reply_markup=menu
            )
            return
        else:
            bot.send_message(message.chat.id, '❌ Неверный или просроченный токен привязки.', reply_markup=unlinked_menu())
            return

    user = get_user_by_tg(tg_id)
    if user:
        menu = admin_menu() if is_admin_tg(tg_id) else main_menu()
        bot.send_message(
            message.chat.id,
            f'👋 С возвращением на {SITE_NAME}, <b>{user["username"]}</b>!\n'
            f'Уровень: <b>{get_user_title(user["level"])}</b> (Ур. {user["level"]})\n'
            f'💎 Баланс KRX: {row_value(user, "kp", 0):,}',
            reply_markup=menu
        )
    else:
        bot.send_message(
            message.chat.id,
            f'🎮 <b>Добро пожаловать в {SITE_NAME} Bot!</b>\n\n'
            f'Твой Telegram-аккаунт пока не привязан к сайту.\n'
            f'Для привязки:\n'
            f'1. Войди на сайт {SITE_URL}\n'
            f'2. Перейди в ⚙️ Настройки\n'
            f'3. Нажми кнопку «Привязать Telegram»',
            reply_markup=unlinked_menu()
        )

@bot.message_handler(func=lambda m: m.text == '👤 Профиль' and m.chat.type == 'private')
@bot.message_handler(commands=['profile'])
def cmd_profile(message):
    tg_id = message.from_user.id
    user = get_user_by_tg(tg_id)
    if not user:
        bot.send_message(message.chat.id, '❌ Сначала привяжи аккаунт. Используй /start', reply_markup=unlinked_menu())
        return

    level = user['level']
    xp = user['xp']
    kp = row_value(user, 'kp', 0)
    title = get_user_title(level)
    next_lvl, next_title, _ = get_next_milestone(level)
    bar = make_progress_bar(level, next_lvl)

    text = (
        f'👤 <b>Профиль на {SITE_NAME}</b>\n'
        f'{"─" * 28}\n'
        f'Пользователь: <b>{user["username"]}</b>' + (' ✓' if row_value(user, 'is_verified') else '') + '\n'
        f'🏆 Ур.{level} — {title}\n'
        f'⚡ Опыт (XP): {xp:,}\n'
        f'💎 Валюта KRX: {kp:,}\n'
        f'{"─" * 28}\n'
        f'📈 До Ур.{next_lvl} ({next_title}):\n{bar}\n'
    )

    if row_value(user, 'bio'):
        text += f'\n📝 О себе: {user["bio"]}'
    if row_value(user, 'location'):
        text += f'\n📍 Город: {user["location"]}'

    kb = InlineKeyboardMarkup()
    kb.add(InlineKeyboardButton('🌐 Открыть на сайте', url=f'{SITE_URL}/user/{user["id"]}'))

    avatar = row_value(user, 'avatar', '')
    if avatar and avatar != 'default_avatar.jpg' and not avatar.startswith('__'):
        try:
            bot.send_photo(message.chat.id, f'{SITE_URL}/static/uploads/{avatar}', caption=text, reply_markup=kb)
            return
        except:
            pass

    bot.send_message(message.chat.id, text, reply_markup=kb)
@bot.message_handler(commands=['help'])
def cmd_help(message):
    bot.send_message(
        message.chat.id,
        f'📖 <b>Команды {SITE_NAME} Bot</b>\n\n'
        '/start — Начать / привязать аккаунт\n'
        '/profile — Полный профиль\n'
        '/me — Мини-профиль\n'
        '/top — Топ игроков\n'
        '/report @user причина — Пожаловаться\n\n'
        '<b>Кнопки:</b> 👤 Профиль, 🏆 Уровни, 🌐 Сообщество, 📊 Топ игроков, 🔔 Уведомления, 🚩 Пожаловаться\n'
        '🔗 Привязать аккаунт, ❓ Помощь'
    )

@bot.message_handler(commands=['me'])
def cmd_me(message):
    user = get_user_by_tg(message.from_user.id)
    if not user:
        bot.reply_to(message, '❌ Сначала привяжи аккаунт через /start')
        return
    role = 'Игрок'
    bot.reply_to(message,
        f'👤 <b>{user["username"]}</b> — Ур.{user["level"]} \n'
        f'⚡ {user["xp"]:,} XP | 💎 {row_value(user, "kp",0):,} KRX\n'
        f'🌐 Профиль на сайте: {SITE_URL}/user/{user["id"]}'
    )

@bot.message_handler(func=lambda m: m.text == '❓ Помощь' and m.chat.type == 'private')
def menu_help(message):
    cmd_help(message)
# ===== ПРОСМОТР ЖАЛОБ И УВЕДОМЛЕНИЙ С САЙТА =====

@bot.message_handler(func=lambda m: m.text == '🔔 Уведомления' and m.chat.type == 'private')
def menu_notifications(message):
    user = get_user_by_tg(message.from_user.id)
    if not user:
        bot.send_message(message.chat.id, '❌ Аккаунт не привязан.'); return

    db = get_db()
    notifs = db.execute(
        'SELECT * FROM notification WHERE user_id=? AND is_read=0 ORDER BY created_at DESC LIMIT 5',
        (user['id'],)
    ).fetchall()
    
    if not notifs:
        db.close()
        bot.send_message(message.chat.id, '🔔 Новых уведомлений с сайта нет!')
        return

    icons = {
        'like': '♥', 'follow': '👤', 'comment': '💬', 
        'friend_request': '➕', 'friend_accept': '✓',
        'xp': '⚡', 'wallet': '💸', 'admin_warning': '⚠️'
    }

    text = f'🔔 <b>Уведомления с сайта ({len(notifs)})</b>\n\n'
    for n in notifs:
        icon = icons.get(n['notif_type'], '🔔')
        text += f'{icon} {n["text"]}\n'

    # Помечаем прочитанными
    db.execute('UPDATE notification SET is_read=1 WHERE user_id=?', (user['id'],))
    db.commit()
    db.close()

    bot.send_message(message.chat.id, text)

@bot.message_handler(func=lambda m: m.text == '🛡️ Жалобы (Адм)' and m.chat.type == 'private')
def menu_admin_reports(message):
    if not is_admin_tg(message.from_user.id):
        bot.send_message(message.chat.id, '❌ Нет доступа к админ-панели.')
        return

    try:
        db = get_db()
        reports = db.execute(
            '''SELECT r.*, u1.username as reporter_name, u2.username as target_name, p.content as post_content
               FROM report r
               LEFT JOIN user u1 ON r.reporter_id=u1.id
               LEFT JOIN post p ON r.post_id=p.id
               LEFT JOIN user u2 ON p.user_id=u2.id
               WHERE r.status="pending"
               ORDER BY r.created_at DESC LIMIT 5'''
        ).fetchall()
        db.close()
    except Exception as e:
        bot.send_message(message.chat.id, f'❌ Ошибка БД: {e}')
        return

    if not reports:
        bot.send_message(message.chat.id, '✅ Активных жалоб нет. Всё проверено!')
        return

    text = f'🚩 <b>Активные жалобы с сайта ({len(reports)})</b>\n\n'
    for r in reports:
        text += (
            f'🔴 <b>Жалоба #{r["id"]}</b>\n'
            f'👤 От кого: @{r["reporter_name"] or "?"}\n'
            f'🎯 На кого: @{r["target_name"] or "?"}\n'
            f'📋 Причина: {r["reason"]}\n'
        )
        if r['post_content']:
            text += f'📝 Пост: <i>"{str(r["post_content"])[:50]}..."</i>\n'
        text += '\n'

    bot.send_message(message.chat.id, text[:4000])

@bot.message_handler(func=lambda m: m.text == '📊 Топ игроков' and m.chat.type == 'private')
@bot.message_handler(commands=['top'])
def cmd_top(message):
    db = get_db()
    users = db.execute(
        'SELECT username, level, xp, is_verified FROM user WHERE is_banned=0 ORDER BY xp DESC LIMIT 10'
    ).fetchall()
    db.close()

    medals = ['🥇','🥈','🥉','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟']
    text = f'🏆 <b>Топ-10 игроков на {SITE_NAME}</b>\n\n'
    for i, u in enumerate(users):
        v = ' ✓' if u['is_verified'] else ''
        text += f'{medals[i]} <b>{u["username"]}</b>{v} — Ур. {u["level"]} | {u["xp"]:,} XP\n'
    bot.send_message(message.chat.id, text)

# ===== ДРУГИЕ КНОПКИ МЕНЮ =====

@bot.message_handler(func=lambda m: m.text == '🌐 Сообщество' and m.chat.type == 'private')
def menu_community(message):
    kb = InlineKeyboardMarkup(row_width=1)
    kb.add(
        InlineKeyboardButton(f'📢 Канал {SITE_NAME}', url=CHANNEL_URL),
        InlineKeyboardButton(f'💬 Чат {SITE_NAME}', url=CHAT_URL),
        InlineKeyboardButton(f'🌐 Наш сайт', url=SITE_URL),
    )
    bot.send_message(message.chat.id, f'🌐 <b>Сообщество {SITE_NAME}</b>', reply_markup=kb)

@bot.message_handler(func=lambda m: m.text == '🏆 Уровни' and m.chat.type == 'private')
def menu_levels(message):
    user = get_user_by_tg(message.from_user.id)
    current = user['level'] if user else 0
    text = f'🏆 <b>Система уровней {SITE_NAME}</b>\n\n'
    for req, title, desc in LEVEL_TITLES:
        s = '✅' if current >= req else '🔒'
        text += f'{s} <b>Ур. {req}</b> — {title}\n   └ <i>{desc}</i>\n'
    bot.send_message(message.chat.id, text[:4000])

@bot.message_handler(func=lambda m: m.text == '🚩 Пожаловаться' and m.chat.type == 'private')
def menu_report_info(message):
    bot.send_message(
        message.chat.id,
        '🚩 <b>Как отправить жалобу:</b>\n\n'
        'Используй команду:\n'
        '<code>/report @username причина</code>\n\n'
        'Например:\n'
        '<code>/report @spammer Спам в комментариях</code>'
    )

@bot.message_handler(commands=['report'])
def cmd_report(message):
    user = get_user_by_tg(message.from_user.id)
    if not user:
        bot.reply_to(message, '❌ Зарегистрируйтесь/привяжите аккаунт через /start'); return
    
    args = message.text.split(maxsplit=2)
    if len(args) < 3:
        bot.reply_to(message, '❌ Формат: /report @username причина')
        return

    target_username = args[1].lstrip('@')
    reason = args[2]

    db = get_db()
    target = db.execute('SELECT * FROM user WHERE username=?', (target_username,)).fetchone()
    if not target:
        db.close()
        bot.reply_to(message, f'❌ Пользователь @{target_username} не найден на сайте.')
        return

    # Записываем жалобу в БД сайта
    db.execute(
        'INSERT INTO report (reporter_id, reason, status, created_at) VALUES (?, ?, ?, ?)',
        (user['id'], f'На @{target_username}: {reason}', 'pending', datetime.utcnow())
    )
    db.commit()
    db.close()

    bot.reply_to(message, f'✅ Ваша жалоба на @{target_username} отправлена модераторам сайта.')

@bot.message_handler(func=lambda m: m.text == '🔗 Привязать аккаунт' and m.chat.type == 'private')
def menu_link(message):
    bot.send_message(
        message.chat.id,
        f'🔗 <b>Инструкция:</b>\n\n'
        f'1. Зайди на сайт: {SITE_URL}\n'
        f'2. Перейди в ⚙️ Настройки профиля\n'
        f'3. Нажми «Привязать Telegram»\n'
        f'4. Перейди по ссылке, которую выдаст сайт.'
    )

# ===== ЗАПУСК =====
if __name__ == '__main__':
    print(f"Бот @{BOT_NAME} успешно запущен!")
    try:
        bot.infinity_polling(skip_pending=True)
    except apihelper.ApiTelegramException as e:
        print(f'Ошибка Telegram API при запуске: {e}')