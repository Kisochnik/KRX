# ===== ДОБАВЬ ЭТИ МАРШРУТЫ В app.py =====
# Вставь перед строкой: if __name__ == '__main__':

@app.route('/post/share-track', methods=['POST'])
def share_track_as_post():
    """Поделиться треком как постом в ленте"""
    if 'user_id' not in session:
        return jsonify({'error': 'not logged in'}), 401
    user = User.query.get(session['user_id'])
    if user.is_muted:
        return jsonify({'error': 'muted'}), 403
    content = request.form.get('content', '').strip()
    if not content:
        return jsonify({'error': 'empty'}), 400
    post = Post(user_id=user.id, content=content, visibility='public')
    db.session.add(post)
    add_xp(user, 10)
    user.kp += 2
    db.session.commit()
    return jsonify({'ok': True, 'post_id': post.id})


# ===== ОБНОВИ МАРШРУТ /music ДЛЯ auto_play =====
# Добавь в конец рендера в маршруте /music:

# Внутри функции music() добавь перед return render_template:
#   auto_play_id = None
#   auto_play_title = ''
#   auto_play_artist = ''
#   auto_play_cover = ''
#   play_id = request.args.get('play', type=int)
#   if play_id:
#       pt = Track.query.get(play_id)
#       if pt:
#           auto_play_id = pt.id
#           auto_play_title = pt.title
#           auto_play_artist = pt.artist or pt.user.username
#           auto_play_cover = pt.cover or ''

# И добавь в render_template:
#   auto_play_id=auto_play_id,
#   auto_play_title=auto_play_title,
#   auto_play_artist=auto_play_artist,
#   auto_play_cover=auto_play_cover,

# ===== ОБНОВЛЁННЫЕ ЖАНРЫ (замени GENRES в app.py) =====
GENRES_NEW = [
    ('gaming', '🎮 Gaming'),
    ('phonk', '🔥 Phonk'),
    ('lofi', '☕ Lo-fi'),
    ('electronic', '🎛 Electronic'),
    ('rock', '🎸 Rock'),
    ('hiphop', '🎤 Hip-hop'),
    ('pop', '🎤 Поп'),
    ('rnb', '🎵 R&B'),
    ('jazz', '🎷 Jazz'),
    ('classical', '🎻 Classical'),
    ('metal', '🤘 Metal'),
    ('indie', '🎸 Indie'),
    ('other', '🎵 Другое'),
]
# Замени GENRES = [...] на GENRES = GENRES_NEW в app.py
