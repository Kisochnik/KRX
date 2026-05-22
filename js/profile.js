/* KVARON_X (KRX) — ПОЛНАЯ СТРАНИЦА ПРОФИЛЯ ПОЛЬЗОВАТЕЛЯ (PROFILE PAGE MODULE) */

let activeProfileSubtab = 'posts';

// ========================= ГЛАВНЫЙ РЕНДЕР ПРОФИЛЯ =========================

window.renderProfile = function () {
    const user = getActiveUser();
    if (!user) return;

    renderProfileHero(user);
    renderProfileSidebar(user);
    renderProfileSubtab(activeProfileSubtab);
};

// ========================= ШАПКА ПРОФИЛЯ (HERO) =========================

function renderProfileHero(user) {

    // --- Баннер ---
    const bannerEl = document.getElementById('profile-page-banner');
    if (bannerEl) {
        if (user.banner) {
            bannerEl.style.backgroundImage = `url(${user.banner})`;
            bannerEl.style.backgroundSize = 'cover';
            bannerEl.style.backgroundPosition = 'center';
        } else {
            bannerEl.style.backgroundImage = '';
        }
    }

    // --- Аватар ---
    const avatarEl = document.getElementById('profile-page-avatar');
    if (avatarEl) avatarEl.src = user.avatar || 'assets/avatar-guest.png';

    // --- Рамка ---
    const frameEl = document.getElementById('profile-page-frame');
    if (frameEl) {
        const items = getShopItems ? getShopItems() : [];
        const frameItem = items.find(i => i.id === user.avatarFrame);
        if (frameItem) {
            frameEl.style.backgroundImage = `url(${frameItem.url})`;
            frameEl.classList.remove('hidden');
        } else {
            frameEl.style.backgroundImage = '';
        }
    }

    // --- Огненный ореол 500 УРВ ---
    const avatarWrap = document.getElementById('profile-page-avatar-wrap');
    if (avatarWrap) {
        if (user.level >= 500) {
            avatarWrap.classList.add('top-500-fire-halo');
        } else {
            avatarWrap.classList.remove('top-500-fire-halo');
        }
    }

    // --- Имя + галочка + роль ---
    const nameEl = document.getElementById('profile-page-name');
    if (nameEl) {
        nameEl.textContent = user.username;
        nameEl.className = '';
        const nickClass = getUserNickClass ? getUserNickClass(user) : '';
        if (nickClass) nameEl.classList.add(nickClass);
    }

    const badgeEl = document.getElementById('profile-page-badge');
    if (badgeEl) {
        badgeEl.className = 'badge-checkmark';
        badgeEl.innerHTML = '';
        if (isSupremeAdmin && isSupremeAdmin(user)) {
            badgeEl.innerHTML = '◆';
            badgeEl.classList.add('badge-supreme-check');
        } else if (user.role === 'admin') {
            badgeEl.innerHTML = '◆';
            badgeEl.classList.add('badge-admin-check');
        } else if (user.role === 'vip') {
            badgeEl.innerHTML = '◆';
            badgeEl.classList.add(user.nickColor === 'neon-green' ? 'badge-vip-green-check' : 'badge-vip-purple-check');
        } else if (user.level >= 500) {
            badgeEl.innerHTML = '◆';
            badgeEl.classList.add('badge-top500-check');
        } else if (user.verified) {
            badgeEl.innerHTML = '◆';
            badgeEl.classList.add('badge-blue-check');
        }
    }

    const roleBadgeEl = document.getElementById('profile-page-role-badge');
    if (roleBadgeEl) {
        let roleLabel = 'Пользователь';
        let roleClass = 'badge-user';
        if (isSupremeAdmin && isSupremeAdmin(user)) { roleLabel = '👑 Высшая Администрация'; roleClass = 'badge-supreme'; }
        else if (user.role === 'admin') { roleLabel = '⚡ Администратор'; roleClass = 'badge-admin'; }
        else if (user.role === 'vip')   { roleLabel = '💎 VIP'; roleClass = 'badge-vip'; }
        roleBadgeEl.textContent = roleLabel;
        roleBadgeEl.className = `badge-role ${roleClass}`;
    }

    // --- Уровень, ранг, XP-бар ---
    const levelEl = document.getElementById('profile-page-level');
    if (levelEl) levelEl.textContent = `LVL ${user.level}`;

    const rankEl = document.getElementById('profile-page-rank');
    if (rankEl) rankEl.textContent = getRankName ? getRankName(user.level) : 'Новичок';

    const xpBarEl = document.getElementById('profile-page-xp-bar');
    const xpTextEl = document.getElementById('profile-page-xp-text');
    if (xpBarEl && xpTextEl) {
        const needed = getXPForNextLevel ? getXPForNextLevel(user.level) : 150;
        const pct = Math.min((user.xp / needed) * 100, 100);
        xpBarEl.style.width = `${pct}%`;
        xpTextEl.textContent = `${user.xp} / ${needed} XP`;
    }

    // --- О себе (краткое) ---
    const aboutEl = document.getElementById('profile-page-about');
    if (aboutEl) aboutEl.textContent = user.about || 'О себе ещё не написано...';

    // --- Статистика ---
    const allPosts = getPosts ? getPosts() : [];
    const userPosts = allPosts.filter(p => p.author === user.username);
    const allUsers = getUsers ? getUsers() : [];
    const friendsCount = (user.friends || []).length;

    setEl('profile-page-followers', Math.floor(Math.random() * 300) + userPosts.length * 5);
    setEl('profile-page-friends', friendsCount);
    setEl('profile-page-posts', userPosts.length);
    setEl('profile-page-coins', (user.coins || 0).toLocaleString() + ' KRX');
}

function setEl(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

// ========================= БОКОВАЯ КОЛОНКА =========================

function renderProfileSidebar(user) {

    // --- О пользователе (полный текст) ---
    const aboutFull = document.getElementById('profile-about-full');
    if (aboutFull) {
        aboutFull.textContent = user.about || 'Этот пользователь ещё не рассказал о себе.';
    }

    // --- Достижения ---
    renderProfileAchievements(user);

    // --- Инвентарь (надетые предметы) ---
    renderProfileEquipped(user);
}

function renderProfileAchievements(user) {
    const container = document.getElementById('profile-achievements-list');
    if (!container) return;

    const achievements = buildAchievements(user);
    if (achievements.length === 0) {
        container.innerHTML = '<p class="profile-empty-state">Ещё нет достижений.</p>';
        return;
    }

    container.innerHTML = achievements.map(a => `
        <div class="profile-achievement-item">
            <span class="ach-icon">${a.icon}</span>
            <div class="ach-info">
                <span class="ach-title">${a.title}</span>
                <span class="ach-desc">${a.desc}</span>
            </div>
        </div>
    `).join('');
}

function buildAchievements(user) {
    const list = [];

    // Достижения по уровню
    if (user.level >= 1)   list.push({ icon: '🌱', title: 'Новичок', desc: 'Начало пути на KRX' });
    if (user.level >= 10)  list.push({ icon: '🚶', title: 'Скиталец', desc: 'Достигнут 10 уровень' });
    if (user.level >= 50)  list.push({ icon: '⚔️', title: 'Ветеран', desc: 'Достигнут 50 уровень' });
    if (user.level >= 100) list.push({ icon: '👑', title: 'Легенда KRX', desc: 'Достигнут 100 уровень — разблокирован GIF-аватар' });
    if (user.level >= 200) list.push({ icon: '🛡️', title: 'Страж Пульса', desc: 'Достигнут 200 уровень' });
    if (user.level >= 300) list.push({ icon: '🏪', title: 'Магистр Магазина', desc: '300 УРВ — разблокированы баннеры' });
    if (user.level >= 400) list.push({ icon: '🖼️', title: 'Лорд Атмосферы', desc: '400 УРВ — разблокированы GIF-баннеры и обои' });
    if (user.level >= 500) list.push({ icon: '🔥', title: 'АБСОЛЮТ', desc: 'Максимальный уровень 500 — огненная галочка!' });

    // По роли
    if (user.role === 'vip')   list.push({ icon: '💎', title: 'VIP Участник', desc: 'Премиум-статус платформы' });
    if (user.role === 'admin') list.push({ icon: '⚡', title: 'Администратор', desc: 'Страж порядка на KRX' });
    if (isSupremeAdmin && isSupremeAdmin(user)) list.push({ icon: '👑', title: 'Высшая Администрация', desc: 'Создатели платформы KVARON_X' });

    // По монетам
    if ((user.coins || 0) >= 1000)   list.push({ icon: '💰', title: 'Коллекционер KRX', desc: 'Накоплено 1 000 KRX монет' });
    if ((user.coins || 0) >= 10000)  list.push({ icon: '💎', title: 'Магнат KRX', desc: 'Накоплено 10 000 KRX монет' });

    return list;
}

function renderProfileEquipped(user) {
    const container = document.getElementById('profile-equipped-items');
    if (!container) return;

    const items = getShopItems ? getShopItems() : [];
    const equipped = [];

    if (user.avatar && user.avatar.startsWith('http'))
        equipped.push({ label: 'Аватар', url: user.avatar, type: 'avatar' });
    if (user.banner)
        equipped.push({ label: 'Баннер', url: user.banner, type: 'banner' });
    if (user.avatarFrame) {
        const frame = items.find(i => i.id === user.avatarFrame);
        if (frame) equipped.push({ label: 'Рамка', url: frame.url, type: 'frame' });
    }
    if (user.wallpaper)
        equipped.push({ label: 'Обои: ' + user.wallpaper, url: null, type: 'wallpaper' });

    if (equipped.length === 0) {
        container.innerHTML = '<p class="profile-empty-state">Нет надетых предметов.</p>';
        return;
    }

    container.innerHTML = equipped.map(item => `
        <div class="profile-equipped-row">
            ${item.url
                ? `<img src="${item.url}" class="profile-equipped-thumb" alt="${item.label}">`
                : `<div class="profile-equipped-thumb profile-wallpaper-thumb">🖼️</div>`
            }
            <span class="profile-equipped-label">${item.label}</span>
        </div>
    `).join('');
}

// ========================= ПОДВКЛАДКИ ПРОФИЛЯ =========================

function setProfileSubtab(tab) {
    activeProfileSubtab = tab;

    // Переключение кнопок
    document.querySelectorAll('.profile-subtab').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`profile-subtab-${tab}`);
    if (activeBtn) activeBtn.classList.add('active');

    // Переключение контента
    document.querySelectorAll('.profile-subtab-content').forEach(el => el.classList.add('hidden'));
    const activeContent = document.getElementById(`profile-${tab}-view`);
    if (activeContent) activeContent.classList.remove('hidden');

    renderProfileSubtab(tab);
}

function renderProfileSubtab(tab) {
    if (tab === 'posts') renderProfilePosts();
    else if (tab === 'photos') renderProfilePhotos();
    else if (tab === 'reals') renderProfileReals();
}

function renderProfilePosts() {
    const container = document.getElementById('profile-user-posts-container');
    if (!container) return;

    const user = getActiveUser();
    const allPosts = getPosts ? getPosts() : [];
    const userPosts = allPosts.filter(p => p.author === user.username);

    if (userPosts.length === 0) {
        container.innerHTML = `
            <div class="profile-empty-block">
                <div class="profile-empty-icon">📝</div>
                <h4>Публикаций пока нет</h4>
                <p>Поделитесь чем-нибудь на Главной!</p>
                <button class="btn btn-primary" onclick="switchTab('home')">Перейти в ленту</button>
            </div>`;
        return;
    }

    container.innerHTML = userPosts.map(post => renderProfilePostCard(post, user)).join('');
}

function renderProfilePostCard(post, user) {
    const date = new Date(post.timestamp).toLocaleDateString('ru-RU');
    const mediaHTML = post.imageUrl
        ? `<div class="profile-post-media"><img src="${post.imageUrl}" alt="Медиа поста" loading="lazy"></div>`
        : '';

    return `
        <div class="profile-post-card card">
            <div class="profile-post-header">
                <img src="${user.avatar || 'assets/avatar-guest.png'}" class="avatar-small" alt="Аватар">
                <div>
                    <span class="profile-post-author">${post.author}</span>
                    <span class="profile-post-date">${date}</span>
                </div>
            </div>
            <p class="profile-post-text">${escapeHtml(post.content)}</p>
            ${mediaHTML}
            <div class="profile-post-footer">
                <span class="profile-post-stat">❤️ ${post.likes || 0}</span>
                <span class="profile-post-stat">💬 ${(post.comments || []).length}</span>
            </div>
        </div>`;
}

function renderProfilePhotos() {
    const container = document.getElementById('profile-photos-mosaic');
    if (!container) return;

    const user = getActiveUser();
    const allPosts = getPosts ? getPosts() : [];
    const photoItems = allPosts.filter(p => p.author === user.username && p.imageUrl);

    if (photoItems.length === 0) {
        container.innerHTML = `
            <div class="profile-empty-block">
                <div class="profile-empty-icon">🖼️</div>
                <h4>Фотографий пока нет</h4>
                <p>Публикуйте фото в ленте, они появятся здесь!</p>
            </div>`;
        return;
    }

    container.innerHTML = photoItems.map(post => `
        <div class="profile-photo-tile" onclick="openPhotoModal('${post.id}')">
            <img src="${post.imageUrl}" alt="Фото" loading="lazy">
            <div class="profile-photo-tile-overlay">
                <span>❤️ ${post.likes || 0}</span>
            </div>
        </div>
    `).join('');
}

function renderProfileReals() {
    const container = document.getElementById('profile-reals-grid');
    if (!container) return;

    const user = getActiveUser();
    const allPosts = getPosts ? getPosts() : [];
    const videoItems = allPosts.filter(p => p.author === user.username && p.videoUrl);

    if (videoItems.length === 0) {
        container.innerHTML = `
            <div class="profile-empty-block">
                <div class="profile-empty-icon">⚡</div>
                <h4>Reals ещё нет</h4>
                <p>Снимите короткое видео и опубликуйте его!</p>
            </div>`;
        return;
    }

    container.innerHTML = videoItems.map(post => `
        <div class="profile-real-tile">
            <video src="${post.videoUrl}" muted loop preload="none" class="profile-real-video"></video>
            <div class="profile-real-overlay">
                <span>▶</span>
            </div>
        </div>
    `).join('');
}

// ========================= ВСПОМОГАТЕЛЬНЫЕ =========================

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function openPhotoModal(postId) {
    const allPosts = getPosts ? getPosts() : [];
    const post = allPosts.find(p => p.id === postId);
    if (!post || !post.imageUrl) return;

    // Открываем фото в простом лайтбокс-оверлее
    let overlay = document.getElementById('photo-lightbox-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'photo-lightbox-overlay';
        overlay.style.cssText = `
            position:fixed; inset:0; z-index:9999;
            background:rgba(0,0,0,0.92);
            display:flex; align-items:center; justify-content:center;
            cursor:zoom-out; backdrop-filter:blur(4px);
        `;
        overlay.addEventListener('click', () => overlay.remove());
        document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
        <div style="position:relative; max-width:90vw; max-height:90vh;">
            <img src="${post.imageUrl}" style="max-width:90vw; max-height:90vh; border-radius:8px; border:1px solid rgba(255,255,255,0.15); display:block;" alt="Фото">
            <div style="position:absolute;top:-40px;right:0;color:#fff;font-size:12px;opacity:0.5;">Нажмите чтобы закрыть</div>
        </div>`;
    overlay.classList.remove('hidden');
}

// ========================= МОДАЛКИ АВАТАР / БАННЕР =========================

function openEditAvatarModal() {
    const user = getActiveUser();
    const urlInput = document.getElementById('modal-avatar-url-input');
    const preview = document.getElementById('modal-avatar-preview');
    const fileInput = document.getElementById('modal-avatar-file-input');

    if (urlInput) urlInput.value = '';
    if (fileInput) fileInput.value = '';
    if (preview) {
        preview.src = user.avatar || '';
        preview.style.display = user.avatar ? 'block' : 'none';
    }

    // Привязка превью по URL
    if (urlInput) {
        urlInput.oninput = function() {
            if (preview) {
                preview.src = this.value;
                preview.style.display = this.value ? 'block' : 'none';
            }
        };
    }

    // Привязка превью по файлу
    if (fileInput) {
        fileInput.onchange = function() {
            const file = this.files[0];
            if (file && preview) {
                const reader = new FileReader();
                reader.onload = e => {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        };
    }

    const modal = document.getElementById('edit-avatar-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeEditAvatarModal() {
    const modal = document.getElementById('edit-avatar-modal');
    if (modal) modal.classList.add('hidden');
}

function applyNewAvatar() {
    const user = getActiveUser();
    const urlInput = document.getElementById('modal-avatar-url-input');
    const fileInput = document.getElementById('modal-avatar-file-input');
    const preview = document.getElementById('modal-avatar-preview');

    // Проверяем ограничение по уровню: GIF доступен с 100 УРВ (кроме Админов)
    const canGif = user.level >= 100 || (isAdminUser && isAdminUser(user));

    let newAvatar = '';

    if (fileInput && fileInput.files[0]) {
        if (!canGif && fileInput.files[0].type === 'image/gif') {
            if (window.showNotification) showNotification('Заблокировано', 'GIF-аватарки доступны с 100 УРВ!', '🔒');
            return;
        }
        newAvatar = preview ? preview.src : '';
    } else if (urlInput && urlInput.value.trim()) {
        const url = urlInput.value.trim();
        if (!canGif && url.toLowerCase().endsWith('.gif')) {
            if (window.showNotification) showNotification('Заблокировано', 'GIF-аватарки доступны с 100 УРВ!', '🔒');
            return;
        }
        newAvatar = url;
    }

    if (!newAvatar) {
        if (window.showNotification) showNotification('Ошибка', 'Укажите URL или загрузите файл.', '❌');
        return;
    }

    // Применяем
    const users = getUsers ? getUsers() : [];
    const idx = users.findIndex(u => u.username === user.username);
    if (idx !== -1) {
        users[idx].avatar = newAvatar;
        saveUsers(users);
        setActiveUser(user.username);
    }

    closeEditAvatarModal();
    if (window.showNotification) showNotification('Готово', 'Аватарка обновлена!', '✅');
    if (window.updateUserHUD) updateUserHUD();
    window.renderProfile();
}

function openEditBannerModal() {
    const user = getActiveUser();

    // Проверяем доступ к баннерам
    const canBanner = user.level >= 300 || (isAdminUser && isAdminUser(user));
    if (!canBanner) {
        if (window.showNotification) showNotification('Заблокировано', 'Баннеры доступны с 300 УРВ!', '🔒');
        return;
    }

    const urlInput = document.getElementById('modal-banner-url-input');
    const preview = document.getElementById('modal-banner-preview');
    const fileInput = document.getElementById('modal-banner-file-input');

    if (urlInput) urlInput.value = user.banner || '';
    if (preview) {
        preview.style.backgroundImage = user.banner ? `url(${user.banner})` : '';
    }
    if (fileInput) fileInput.value = '';

    if (urlInput) {
        urlInput.oninput = function() {
            if (preview) preview.style.backgroundImage = this.value ? `url(${this.value})` : '';
        };
    }

    if (fileInput) {
        fileInput.onchange = function() {
            const file = this.files[0];
            if (file && preview) {
                const reader = new FileReader();
                reader.onload = e => {
                    preview.style.backgroundImage = `url(${e.target.result})`;
                };
                reader.readAsDataURL(file);
            }
        };
    }

    const modal = document.getElementById('edit-banner-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeEditBannerModal() {
    const modal = document.getElementById('edit-banner-modal');
    if (modal) modal.classList.add('hidden');
}

function applyNewBanner() {
    const user = getActiveUser();
    const urlInput = document.getElementById('modal-banner-url-input');
    const fileInput = document.getElementById('modal-banner-file-input');
    const preview = document.getElementById('modal-banner-preview');

    const canGifBanner = user.level >= 400 || (isAdminUser && isAdminUser(user));

    let newBanner = '';

    if (fileInput && fileInput.files[0]) {
        const bg = preview ? preview.style.backgroundImage : '';
        const urlMatch = bg.match(/url\(["']?(.+?)["']?\)/);
        newBanner = urlMatch ? urlMatch[1] : '';
        if (!canGifBanner && fileInput.files[0].type === 'image/gif') {
            if (window.showNotification) showNotification('Заблокировано', 'GIF-баннеры доступны с 400 УРВ!', '🔒');
            return;
        }
    } else if (urlInput && urlInput.value.trim()) {
        const url = urlInput.value.trim();
        if (!canGifBanner && url.toLowerCase().endsWith('.gif')) {
            if (window.showNotification) showNotification('Заблокировано', 'GIF-баннеры доступны с 400 УРВ!', '🔒');
            return;
        }
        newBanner = url;
    }

    if (!newBanner) {
        if (window.showNotification) showNotification('Ошибка', 'Укажите URL или загрузите файл.', '❌');
        return;
    }

    const users = getUsers ? getUsers() : [];
    const idx = users.findIndex(u => u.username === user.username);
    if (idx !== -1) {
        users[idx].banner = newBanner;
        saveUsers(users);
        setActiveUser(user.username);
    }

    closeEditBannerModal();
    if (window.showNotification) showNotification('Готово', 'Баннер профиля обновлён!', '✅');
    if (window.updateUserHUD) updateUserHUD();
    window.renderProfile();
    if (window.renderSettings) window.renderSettings();
}
