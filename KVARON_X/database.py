from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    bio = db.Column(db.String(300), default='')
    location = db.Column(db.String(100), default='')
    birthday = db.Column(db.String(20), default='')
    show_birthday = db.Column(db.Boolean, default=True)
    avatar = db.Column(db.String(200), default='default_avatar.jpg')
    banner = db.Column(db.String(200), default='default_banner.jpg')
    frame = db.Column(db.String(200), default='')
    music = db.Column(db.String(200), default='')
    music_name = db.Column(db.String(100), default='')
    status_emoji = db.Column(db.String(10), default='')
    badge = db.Column(db.String(50), default='')
    title = db.Column(db.String(80), default='Новичок KRX')
    show_title = db.Column(db.Boolean, default=True)
    xp = db.Column(db.Integer, default=0)
    kp = db.Column(db.Integer, default=100)
    level = db.Column(db.Integer, default=0)
    last_seen = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_verified = db.Column(db.Boolean, default=False)
    is_admin = db.Column(db.Boolean, default=False)
    is_banned = db.Column(db.Boolean, default=False)
    is_muted = db.Column(db.Boolean, default=False)
    theme = db.Column(db.String(20), default='dark')
    accent_color = db.Column(db.String(10), default='#7F77DD')
    profile_private = db.Column(db.Boolean, default=False)
    hide_online = db.Column(db.Boolean, default=False)
    hide_level = db.Column(db.Boolean, default=False)
    hide_birthday = db.Column(db.Boolean, default=False)
    posts_today = db.Column(db.Integer, default=0)
    last_post_date = db.Column(db.String(20), default='')
    wallpaper = db.Column(db.String(200), default='')
    phone = db.Column(db.String(20), default='')
    phone_code = db.Column(db.String(10), default='')
    phone_verified = db.Column(db.Boolean, default=False)
    email_code = db.Column(db.String(50), default='')
    last_ip = db.Column(db.String(50), default='')
    notif_sound = db.Column(db.Boolean, default=True)
    notif_popup = db.Column(db.Boolean, default=True)
    lang = db.Column(db.String(5), default='ru')
    tg_id = db.Column(db.String(50), default='')
    tg_username = db.Column(db.String(100), default='')
    tg_token = db.Column(db.String(50), default='')
    password_reset_code = db.Column(db.String(10), default='')
    tg_login_code = db.Column(db.String(10), default='')
    shop_wallpaper = db.Column(db.String(200), default='')
    profile_effect = db.Column(db.String(100), default='')
    nick_color = db.Column(db.String(20), default='')


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    content = db.Column(db.String(500), nullable=False)
    media = db.Column(db.String(200), default='')
    media_type = db.Column(db.String(10), default='')
    pinned = db.Column(db.Boolean, default=False)
    visibility = db.Column(db.String(20), default='public')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship('User', backref='posts')


class Like(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'))


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'))
    content = db.Column(db.String(300), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship('User', backref='comments')


class FriendRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    from_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    to_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    status = db.Column(db.String(20), default='pending')
    from_user = db.relationship('User', foreign_keys=[from_user_id])
    to_user = db.relationship('User', foreign_keys=[to_user_id])


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    from_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    to_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    chat_id = db.Column(db.Integer, db.ForeignKey('chat.id'), nullable=True)  # group chat
    content = db.Column(db.String(2000), default='')
    msg_type = db.Column(db.String(20), default='text')  # text|voice|image|video
    media_file = db.Column(db.String(300), default='')
    is_read = db.Column(db.Boolean, default=False)
    is_deleted = db.Column(db.Boolean, default=False)
    is_edited = db.Column(db.Boolean, default=False)
    edited_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    from_user = db.relationship('User', foreign_keys=[from_user_id])
    to_user = db.relationship('User', foreign_keys=[to_user_id])
    reactions = db.relationship('MessageReaction', backref='message', lazy='dynamic')


class Chat(db.Model):
    """Group chat"""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    creator = db.relationship('User', foreign_keys=[creator_id])
    members = db.relationship('ChatMember', backref='chat', lazy='dynamic')
    messages = db.relationship('Message', backref='chat', lazy='dynamic',
                               foreign_keys=[Message.chat_id])


class ChatMember(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    chat_id = db.Column(db.Integer, db.ForeignKey('chat.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    role = db.Column(db.String(20), default='member')  # admin|member
    is_muted = db.Column(db.Boolean, default=False)
    is_hidden = db.Column(db.Boolean, default=False)  # hide dialog
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship('User')


class MessageReaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    message_id = db.Column(db.Integer, db.ForeignKey('message.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    emoji = db.Column(db.String(10), nullable=False)
    user = db.relationship('User')


class Follow(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    follower_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    following_id = db.Column(db.Integer, db.ForeignKey('user.id'))


class BanRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    ip = db.Column(db.String(50), default='')
    reason = db.Column(db.String(200), default='')
    banned_at = db.Column(db.DateTime, default=datetime.utcnow)
    banned_by = db.Column(db.Integer, db.ForeignKey('user.id'))


class ShopItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(300), default='')
    item_type = db.Column(db.String(20), nullable=False)
    filename = db.Column(db.String(200), nullable=False)
    price_kp = db.Column(db.Integer, default=100)
    preview = db.Column(db.String(200), default='')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Purchase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    item_id = db.Column(db.Integer, db.ForeignKey('shop_item.id'))
    purchased_at = db.Column(db.DateTime, default=datetime.utcnow)
    item = db.relationship('ShopItem')


class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    from_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    notif_type = db.Column(db.String(30), default='')
    text = db.Column(db.String(300), default='')
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    from_user = db.relationship('User', foreign_keys=[from_user_id])


class Group(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(300), default='')
    game_tag = db.Column(db.String(50), default='')
    need_mic = db.Column(db.Boolean, default=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    owner = db.relationship('User', foreign_keys=[owner_id])


class GroupMember(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey('group.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship('User')


class GroupMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey('group.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    content = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship('User')


class LFGPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    game = db.Column(db.String(50), default='')
    mode = db.Column(db.String(30), default='Обычка')
    rank_level = db.Column(db.String(30), default='Средний')
    need_mic = db.Column(db.Boolean, default=False)
    description = db.Column(db.String(300), default='')
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship('User')


class Track(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    title = db.Column(db.String(200), nullable=False)
    artist = db.Column(db.String(200), default='')
    genre = db.Column(db.String(50), default='other')
    description = db.Column(db.String(500), default='')
    filename = db.Column(db.String(300), nullable=False)
    cover = db.Column(db.String(300), default='')
    duration = db.Column(db.Integer, default=0)
    plays = db.Column(db.Integer, default=0)
    is_public = db.Column(db.Boolean, default=True)
    # Copyright info
    copyright_type = db.Column(db.String(30), default='own')  # own|licensed|creative_commons|free
    copyright_owner = db.Column(db.String(200), default='')
    copyright_url = db.Column(db.String(300), default='')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship('User', backref='tracks')
    likes = db.relationship('TrackLike', backref='track', lazy='dynamic')


class TrackLike(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    track_id = db.Column(db.Integer, db.ForeignKey('track.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Playlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    name = db.Column(db.String(200), nullable=False)
    cover = db.Column(db.String(300), default='')
    is_public = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship('User', backref='playlists')
    items = db.relationship('PlaylistItem', backref='playlist', lazy='dynamic',
                            order_by='PlaylistItem.position')


class PlaylistItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    playlist_id = db.Column(db.Integer, db.ForeignKey('playlist.id'))
    track_id = db.Column(db.Integer, db.ForeignKey('track.id'))
    position = db.Column(db.Integer, default=0)
    added_at = db.Column(db.DateTime, default=datetime.utcnow)
    track = db.relationship('Track')


class LibraryTrack(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    track_id = db.Column(db.Integer, db.ForeignKey('track.id'))
    saved_at = db.Column(db.DateTime, default=datetime.utcnow)
    track = db.relationship('Track')


class TgChatMember(db.Model):
    __tablename__ = 'tg_chat_member'
    id = db.Column(db.Integer, primary_key=True)
    tg_id = db.Column(db.String(50), nullable=False)
    chat_id = db.Column(db.String(50), nullable=False)
    role = db.Column(db.String(20), default='player')
    __table_args__ = (db.UniqueConstraint('tg_id', 'chat_id'),)


class Report(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    reporter_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    reason = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    post = db.relationship('Post', backref='reports')
    reporter = db.relationship('User', foreign_keys=[reporter_id])


class AuditLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    admin_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    action = db.Column(db.String(200), nullable=False)
    target = db.Column(db.String(200), default='')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    admin = db.relationship('User', foreign_keys=[admin_id])


class Transaction(db.Model):
    """История операций KRXWallet"""
    id = db.Column(db.Integer, primary_key=True)
    from_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    to_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    amount = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.String(300), default='')
    # tx_type: transfer | purchase | reward | stake
    tx_type = db.Column(db.String(20), default='transfer')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    from_user = db.relationship('User', foreign_keys=[from_user_id])
    to_user   = db.relationship('User', foreign_keys=[to_user_id])


class Poll(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    question = db.Column(db.String(300), nullable=False)
    is_public = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship('User', foreign_keys=[user_id])
    options = db.relationship('PollOption', backref='poll', lazy='dynamic')
    votes = db.relationship('PollVote', backref='poll', lazy='dynamic')


class PollOption(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    poll_id = db.Column(db.Integer, db.ForeignKey('poll.id'), nullable=False)
    text = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    votes = db.relationship('PollVote', backref='option', lazy='dynamic')


class PollVote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    poll_id = db.Column(db.Integer, db.ForeignKey('poll.id'), nullable=False)
    option_id = db.Column(db.Integer, db.ForeignKey('poll_option.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship('User', foreign_keys=[user_id])
    __table_args__ = (db.UniqueConstraint('poll_id', 'user_id'),)
