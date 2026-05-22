/* KVARON_X (KRX) — ЦЕНТРАЛЬНЫЙ ДИСПЕТЧЕР И ХОЛСТ ЖИВЫХ ОБОЕВ (APP ROUTER & LIVE WALLPAPER CANVAS) */

let activeTab = 'home';
let liveWallpaperInterval = null;
let liveCanvas, ctx;

document.addEventListener('DOMContentLoaded', () => {
    const bootOptions = getBootOptionsFromUrl();
    if (bootOptions.username) {
        setActiveUser(bootOptions.username);
    }

    // 1. Привязка переключателя вкладок
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = item.getAttribute('data-tab');
            if (tab) switchTab(tab);
        });
    });

    // 2. Инициализация тестера персонажей
    const indicator = document.getElementById('active-persona-indicator');
    const dropdown = document.getElementById('persona-dropdown');
    
    if (indicator) {
        indicator.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });
    }

    document.addEventListener('click', () => {
        if (dropdown) dropdown.classList.remove('active');
    });

    document.querySelectorAll('.persona-option').forEach(opt => {
        opt.addEventListener('click', () => {
            const personaKey = opt.getAttribute('data-persona');
            switchPersona(personaKey);
        });
    });

    // 3. Запуск живых обоев
    initLiveWallpaperEngine();

    // 4. Первичный рендер UI
    updateUserHUD();
    switchTab(bootOptions.tab || 'home');

    // 5. Запуск фоновых симуляций
    startBackgroundTimers();
});

function getBootOptionsFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const persona = params.get('persona');
    const tab = params.get('tab');
    const personaToUser = {
        kvarden: 'Kvarden',
        baron: 'Baron_Kosyaka',
        kvaron: 'KVARON_X',
        neo: 'Neo',
        guest: 'Trinity',
        novice: 'GuestUser'
    };

    return {
        username: personaToUser[persona] || '',
        tab: tab || ''
    };
}

/* --- МАРШРУТИЗАЦИЯ ВКЛАДОК --- */
function switchTab(tabId) {
    activeTab = tabId;
    
    // Проверка бана перед переходом
    if (checkHardwareBanStatus()) return;

    // Снимаем активность со всех пунктов меню и вкладок
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.tab-view').forEach(view => view.classList.remove('active'));

    // Активируем нужные элементы
    const targetMenuItem = document.querySelector(`.menu-item[data-tab="${tabId}"]`);
    if (targetMenuItem) targetMenuItem.classList.add('active');

    const targetView = document.getElementById(`view-${tabId}`);
    if (targetView) targetView.classList.add('active');

    // Обновляем заголовок шапки
    const viewTitle = document.getElementById('view-title');
    if (viewTitle) {
        const titles = {
            home: 'Главная Лента',
            news: 'Официальные Новости',
            notifications: 'Уведомления (Удивления)',
            game: 'Игровой Центр (KRX)',
            clans: 'Кланы Платформы',
            friends: 'Друзья',
            chat: 'Чат и Диалоги',
            shop: 'Цифровой Магазин',
            wallet: 'Баланс и Кошелек',
            profile: 'Мой Профиль',
            settings: 'Настройки Профиля',
            admin: 'Панель Модератора'
        };
        viewTitle.textContent = titles[tabId] || 'KVARON_X';
    }

    // Вызываем точечный рендер текущей вкладки
    triggerViewRender(tabId);
}

// Запуск рендера конкретного раздела
function triggerViewRender(tabId) {
    if (tabId === 'home' && window.renderFeed) {
        window.renderFeed();
    } else if (tabId === 'news' && window.renderNews) {
        window.renderNews();
    } else if (tabId === 'notifications' && window.renderNotifications) {
        window.renderNotifications();
    } else if (tabId === 'friends' && window.renderFriends) {
        window.renderFriends();
    } else if (tabId === 'chat' && window.renderChats) {
        window.renderChats();
    } else if (tabId === 'shop' && window.renderShop) {
        window.renderShop();
    } else if (tabId === 'wallet' && window.renderWallet) {
        window.renderWallet();
    } else if (tabId === 'profile' && window.renderProfile) {
        window.renderProfile();
    } else if (tabId === 'settings' && window.renderSettings) {
        window.renderSettings();
    } else if (tabId === 'admin' && window.renderAdmin) {
        window.renderAdmin();
    }
}

/* --- ГОРЯЧАЯ СМЕНА ПЕРСОНАЖЕЙ (PERSONA HOT-SWAP) --- */
function switchPersona(personaKey) {
    const mapping = {
        kvarden: 'Kvarden',
        baron: 'Baron_Kosyaka',
        kvaron: 'KVARON_X',
        neo: 'Neo',
        guest: 'Trinity',
        novice: 'GuestUser'
    };
    
    const targetUser = mapping[personaKey];
    if (targetUser) {
        setActiveUser(targetUser);
        
        // Сбрасываем закрытые меню
        closeGroupSettingsModal();
        closeGroupChatCreator();
        
        // Полное обновление интерфейса
        updateUserHUD();
        
        // Проверка бана после смены аккаунта
        if (checkHardwareBanStatus()) return;

        showNotification('Аккаунт изменен', `Вход осуществлен под именем ${targetUser}!`, '👤');
        
        // Перерисовываем текущую вкладку
        switchTab(activeTab);
    }
}

/* --- ОБНОВЛЕНИЕ HUD ПОЛЬЗОВАТЕЛЯ --- */
function updateUserHUD() {
    const user = getActiveUser();
    
    // 1. Обновление кнопки переключения тестера
    const indicator = document.getElementById('active-persona-indicator');
    if (indicator) {
        let roleText = '👤 Юзер';
        if (isSupremeAdmin(user)) roleText = '👑 Высший Админ';
        else if (user.role === 'admin') roleText = '⚡ Админ';
        else if (user.role === 'vip') roleText = '💎 VIP';
        indicator.textContent = `Тест-Аккаунт: ${roleText} (${user.username})`;
    }

    // 2. Скрытие/показ кнопки админа в меню
    const adminBtn = document.getElementById('nav-admin-btn');
    if (adminBtn) {
        if (isAdminUser(user)) {
            adminBtn.classList.remove('hidden');
        } else {
            adminBtn.classList.add('hidden');
            if (activeTab === 'admin') switchTab('home'); // Кикаем обычных из вкладки админа
        }
    }

    // 3. Обновление HUD в шапке (Баланс, LVL, Опыт)
    const hudLevel = document.getElementById('hud-level');
    const hudXpBar = document.getElementById('hud-xp-bar');
    const hudXpText = document.getElementById('hud-xp-text');
    const hudBalance = document.getElementById('hud-balance');
    const walletHUD = document.getElementById('header-wallet-hud');

    if (hudLevel) hudLevel.textContent = `LVL ${user.level}`;
    if (hudBalance) hudBalance.textContent = `${user.coins.toLocaleString()} KRX`;
    
    const xpNeeded = getXPForNextLevel(user.level);
    const xpPercent = Math.min((user.xp / xpNeeded) * 100, 100);
    
    if (hudXpBar) hudXpBar.style.width = `${xpPercent}%`;
    if (hudXpText) hudXpText.textContent = `${user.xp} / ${xpNeeded} XP`;

    // 4. Сайдбар мини-карточка пользователя
    const sideName = document.getElementById('sidebar-user-name');
    const sideRank = document.getElementById('sidebar-user-rank');
    const sideAvatar = document.getElementById('sidebar-user-avatar');
    const sideFrame = document.getElementById('sidebar-user-frame');
    const sideBadge = document.getElementById('sidebar-user-badge');

    if (sideName) {
        sideName.textContent = user.username;
        sideName.className = 'user-name'; // Сброс
        
        // Кастомное свечение ников
        const nickClass = getUserNickClass(user);
        if (nickClass) sideName.classList.add(nickClass);
    }

    if (sideRank) {
        const rank = getRankName(user.level);
        sideRank.textContent = `${rank} (${user.level} УРВ)`;
    }

    if (sideAvatar) {
        sideAvatar.src = user.avatar || KRX_ASSETS.avatarGuest;
        
        // Применяем Огненный Ореол на аватарку если 500 УРВ
        const avatarWrapper = sideAvatar.parentElement;
        if (avatarWrapper) {
            if (user.level >= 500) {
                avatarWrapper.classList.add('top-500-fire-halo');
            } else {
                avatarWrapper.classList.remove('top-500-fire-halo');
            }
        }
    }

    if (sideFrame) {
        if (user.avatarFrame) {
            const items = getShopItems();
            const frameItem = items.find(i => i.id === user.avatarFrame);
            if (frameItem) {
                sideFrame.style.backgroundImage = `url(${frameItem.url})`;
                sideFrame.classList.remove('hidden');
            } else {
                sideFrame.classList.add('hidden');
            }
        } else {
            sideFrame.classList.add('hidden');
        }
    }

    // Системные галочки
    if (sideBadge) {
        sideBadge.className = 'badge-checkmark';
        sideBadge.style.animation = '';
        sideBadge.style.color = '';

        if (isSupremeAdmin(user)) {
            sideBadge.innerHTML = '◆'; // Мигающая красная галочка
            sideBadge.classList.add('badge-supreme-check');
        } else if (user.role === 'admin') {
            sideBadge.innerHTML = '◆'; // Статичная красная галочка
            sideBadge.classList.add('badge-admin-check');
        } else if (user.role === 'vip') {
            sideBadge.innerHTML = '◆'; // Золотая/Фиолетовая галочка
            sideBadge.classList.add(user.nickColor === 'neon-green' ? 'badge-vip-green-check' : 'badge-vip-purple-check');
        } else if (user.level >= 500) {
            sideBadge.innerHTML = '◆'; // Топ 500 УРВ огненная галочка
            sideBadge.classList.add('badge-top500-check');
        } else if (user.verified) {
            sideBadge.innerHTML = '◆';
            sideBadge.classList.add('badge-blue-check');
        } else {
            sideBadge.innerHTML = '';
        }
    }

    // 5. Перезапуск обоев при смене пользователя
    initLiveWallpaperEngine();

    // 6. Обновление счетчика удинлений в меню
    const notifs = getNotifications();
    const unread = notifs.filter(n => n.toUser === user.username && !n.read).length;
    const notifBadge = document.getElementById('nav-notif-count');
    if (notifBadge) {
        if (unread > 0) {
            notifBadge.textContent = unread;
            notifBadge.classList.remove('hidden');
        } else {
            notifBadge.classList.add('hidden');
        }
    }
}

/* --- IP И HARDWARE БАН ДЕТЕКТОР --- */
function checkHardwareBanStatus() {
    const user = getActiveUser();
    const bans = getHardwareBans();
    const accountBans = getAccountBans();
    const banScreen = document.getElementById('ban-screen');
    
    // Ищем обычный бан аккаунта или супер-бан по IP/железу.
    const accountBan = accountBans.some(b => b.username === user.username);
    const hardwareBan = bans.some(b => b.username === user.username || b.ip === user.ip || b.hwid === user.hwid);
    const isBanned = accountBan || hardwareBan;
    
    if (isBanned) {
        const title = document.querySelector('#ban-screen .terminal-title');
        const reason = document.querySelector('#ban-screen .terminal-body p:nth-of-type(2)');
        if (title) title.textContent = hardwareBan ? 'KRX SECURE SYSTEM v3.09' : 'KRX MODERATION LOCK';
        if (reason) reason.textContent = hardwareBan
            ? '>>> ОБНАРУЖЕНА АППАРАТНАЯ БЛОКИРОВКА (BAN BY IP / HARDWARE)'
            : '>>> АККАУНТ ЗАБЛОКИРОВАН МОДЕРАЦИЕЙ KRX';
        if (banScreen) banScreen.classList.remove('hidden');
        return true;
    } else {
        if (banScreen) banScreen.classList.add('hidden');
        return false;
    }
}

/* --- ДВИЖОК ЖИВЫХ ОБОЕВ (LIVE WALLPAPER ENGINE) --- */
function initLiveWallpaperEngine() {
    // Останавливаем старые обои
    if (liveWallpaperInterval) {
        clearInterval(liveWallpaperInterval);
        liveWallpaperInterval = null;
    }

    liveCanvas = document.getElementById('live-canvas');
    if (!liveCanvas) return;
    ctx = liveCanvas.getContext('2d');

    const user = getActiveUser();
    
    // Проверка доступа к Живым Обоям:
    // Администраторам (Kvarden, Baron_Kosyaka, KVARON_X) доступно ВСЕГДА и везде (на Главной, в Чатах, Настройках).
    // Обычным пользователям живые обои НЕДОСТУПНЫ вообще (только на 500 УРВ обычные статические).
    const hasAccess = canUseLiveWallpapers(user);
    
    if (!hasAccess || !user.wallpaper) {
        ctx.clearRect(0, 0, liveCanvas.width, liveCanvas.height);
        liveCanvas.style.opacity = '0';
        return;
    }

    liveCanvas.style.opacity = '0.12';
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Выбор обоев
    if (user.wallpaper === 'matrix') {
        runMatrixRain();
    } else if (user.wallpaper === 'cybermesh') {
        runCyberMesh();
    }
}

function resizeCanvas() {
    if (liveCanvas) {
        liveCanvas.width = window.innerWidth;
        liveCanvas.height = window.innerHeight;
    }
}

// 1. Анимация Дождя Матрицы
function runMatrixRain() {
    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const alphabet = katakana.split('');

    const fontSize = 14;
    const columns = Math.ceil(liveCanvas.width / fontSize);

    const rainDrops = [];
    for (let x = 0; x < columns; x++) {
        rainDrops[x] = Math.random() * -100;
    }

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.fillRect(0, 0, liveCanvas.width, liveCanvas.height);

        ctx.fillStyle = '#39ff14'; // Неоново-зеленый шрифт
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet[Math.floor(Math.random() * alphabet.length)];
            ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

            if (rainDrops[i] * fontSize > liveCanvas.height && Math.random() > 0.975) {
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }
    }

    liveWallpaperInterval = setInterval(draw, 33);
}

// 2. Анимация Сети Cyber Mesh
function runCyberMesh() {
    const dots = [];
    const dotsCount = 65;
    const maxDist = 120;

    for (let i = 0; i < dotsCount; i++) {
        dots.push({
            x: Math.random() * liveCanvas.width,
            y: Math.random() * liveCanvas.height,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2
        });
    }

    function draw() {
        ctx.clearRect(0, 0, liveCanvas.width, liveCanvas.height);
        
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';

        // Двигаем точки
        for (let i = 0; i < dotsCount; i++) {
            const d = dots[i];
            d.x += d.vx;
            d.y += d.vy;

            // Отскок от границ
            if (d.x < 0 || d.x > liveCanvas.width) d.vx *= -1;
            if (d.y < 0 || d.y > liveCanvas.height) d.vy *= -1;

            ctx.beginPath();
            ctx.arc(d.x, d.y, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Рисуем линии
        for (let i = 0; i < dotsCount; i++) {
            for (let j = i + 1; j < dotsCount; j++) {
                const d1 = dots[i];
                const d2 = dots[j];
                const dist = Math.hypot(d1.x - d2.x, d1.y - d2.y);

                if (dist < maxDist) {
                    const alpha = (1 - dist / maxDist) * 0.15;
                    ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
                    ctx.beginPath();
                    ctx.moveTo(d1.x, d1.y);
                    ctx.lineTo(d2.x, d2.y);
                    ctx.stroke();
                }
            }
        }
    }

    liveWallpaperInterval = setInterval(draw, 1000 / 40);
}

/* --- ЗАПУСК ФОНОВЫХ ТАЙМЕРОВ --- */
function startBackgroundTimers() {
    // 1. Таймер скидок в магазине (раз в секунду)
    setInterval(() => {
        if (window.tickShopTimers) {
            window.tickShopTimers();
        }
    }, 1000);

    // 2. Симуляция прихода новых уведомлений и лайков раз в 2 минуты
    setInterval(() => {
        const active = getActiveUser();
        if (active.username === 'Trinity' || active.username === 'Neo') {
            // Симулируем лайк от админа
            const notifs = getNotifications();
            const newNotif = {
                id: 'nt_sim_' + Date.now(),
                toUser: active.username,
                fromUser: 'KVARON_X',
                type: 'like',
                text: 'выразил удивление вашему контенту в ленте.',
                timestamp: Date.now(),
                read: false
            };
            notifs.unshift(newNotif);
            saveNotifications(notifs);
            
            showNotification('⚡ Удивление (Уведомление)', 'KVARON_X выразил удивление вашему контенту!', '😮');
            updateUserHUD();
        }
    }, 120000);
}
