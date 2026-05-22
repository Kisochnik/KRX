/* KVARON_X (KRX) — ЦЕНТРАЛЬНАЯ БАЗА ДАННЫХ (LOCALSTORAGE STATE ENGINE) */

const STATE_KEYS = {
    USERS: 'krx_users',
    CURRENT_USER: 'krx_active_user',
    POSTS: 'krx_posts',
    NEWS: 'krx_news',
    CHATS: 'krx_chats',
    NOTIFICATIONS: 'krx_notifications',
    SHOP_ITEMS: 'krx_shop_items',
    ACCOUNT_BANS: 'krx_account_bans',
    HARDWARE_BANS: 'krx_hw_bans',
    MUTED_USERS: 'krx_muted_users'
};

const KRX_ASSETS = {
    avatarKvarden: 'assets/avatar-kvarden.png',
    avatarBaron: 'assets/avatar-baron.png',
    avatarKvaron: 'assets/avatar-kvaron.png',
    avatarNeo: 'assets/avatar-neo.png',
    avatarTrinity: 'assets/avatar-trinity.png',
    avatarGuest: 'assets/avatar-guest.png',
    bannerRed: 'assets/banner-red.png',
    bannerGold: 'assets/banner-gold.png',
    bannerCircuit: 'assets/banner-circuit.png',
    bannerPurple: 'assets/banner-purple.png',
    bannerGreen: 'assets/banner-green.png',
    wallpaperDark: 'assets/wallpaper-dark.png',
    storyRed: 'assets/story-red.png',
    storyPurple: 'assets/story-purple.png',
    storyGreen: 'assets/story-green.png',
    realAdmin: 'assets/real-admin.png',
    realVip: 'assets/real-vip.png',
    realCircuit: 'assets/real-circuit.png'
};

// Дефолтные товары в Магазине (Предустановленные)
const DEFAULT_SHOP_ITEMS = [
    // Аватарки
    { id: 'av_1', name: 'Анимированный Киберпанк (GIF)', category: 'avatars', url: KRX_ASSETS.avatarNeo, price: 300, discount: 15, timer: 1440, minLvl: 100 },
    { id: 'av_2', name: 'Золотая Маска Анонима (GIF)', category: 'avatars', url: KRX_ASSETS.avatarBaron, price: 500, discount: 0, timer: 0, minLvl: 100 },
    { id: 'av_3', name: 'Неоновый Череп', category: 'avatars', url: KRX_ASSETS.avatarGuest, price: 80, discount: 10, timer: 30, minLvl: 1 },
    
    // Рамки
    { id: 'fr_1', name: 'Неоновая Пурпурная Рамка', category: 'frames', url: KRX_ASSETS.bannerPurple, price: 150, discount: 10, timer: 60, minLvl: 1 },
    { id: 'fr_2', name: 'Огненное Кольцо Магии', category: 'frames', url: KRX_ASSETS.bannerRed, price: 400, discount: 20, timer: 120, minLvl: 80 },
    { id: 'fr_3', name: 'Золотая Корона Власти', category: 'frames', url: KRX_ASSETS.bannerGold, price: 800, discount: 0, timer: 0, minLvl: 150 },
    
    // Баннеры
    { id: 'bn_1', name: 'Матричный Поток (GIF)', category: 'banners', url: KRX_ASSETS.bannerCircuit, price: 600, discount: 25, timer: 90, minLvl: 400 },
    { id: 'bn_2', name: 'Глубокий Космос', category: 'banners', url: KRX_ASSETS.bannerPurple, price: 200, discount: 0, timer: 0, minLvl: 300 },
    
    // Обои
    { id: 'wp_1', name: 'Цифровой Дождь Матрицы (Живые)', category: 'wallpapers', url: 'matrix', price: 1000, discount: 15, timer: 120, minLvl: 500, isLive: true },
    { id: 'wp_2', name: 'Свечение Абстракции (Живые)', category: 'wallpapers', url: 'cybermesh', price: 1500, discount: 0, timer: 0, minLvl: 500, isLive: true },
    { id: 'wp_3', name: 'Глубокий Мрак', category: 'wallpapers', url: KRX_ASSETS.wallpaperDark, price: 500, discount: 10, timer: 45, minLvl: 500 }
];

// Ранговые названия до 500 уровней
function getRankName(level) {
    if (level >= 500) return 'Абсолют';
    if (level >= 450) return 'Лорд Атмосферы';
    if (level >= 400) return 'Творец Судеб';
    if (level >= 350) return 'Разрушитель Миров';
    if (level >= 300) return 'Магистр Магазина';
    if (level >= 250) return 'Тёмный Рыцарь';
    if (level >= 200) return 'Страж Пульса';
    if (level >= 180) return 'Высший Разум';
    if (level >= 160) return 'Тень Кварона';
    if (level >= 140) return 'Избранный';
    if (level >= 120) return 'Бессмертный';
    if (level >= 100) return 'Легенда KRX';
    if (level >= 90) return 'Аристократ';
    if (level >= 80) return 'Элита';
    if (level >= 70) return 'Эксперт';
    if (level >= 60) return 'Мастер';
    if (level >= 50) return 'Ветеран';
    if (level >= 40) return 'Охотник';
    if (level >= 30) return 'Авантюрист';
    if (level >= 20) return 'Искатель';
    if (level >= 10) return 'Скиталец';
    return 'Новичок';
}

// Проверка наград за уровни
function getLevelReward(level) {
    const rewards = {
        10: { coins: 10, unlock: null },
        20: { coins: 20, unlock: null },
        30: { coins: 30, unlock: null },
        40: { coins: 40, unlock: null },
        50: { coins: 50, unlock: null },
        60: { coins: 60, unlock: null },
        70: { coins: 70, unlock: null },
        80: { coins: 100, unlock: null },
        90: { coins: 150, unlock: null },
        100: { coins: 500, unlock: 'Анимированные GIF-аватарки' },
        120: { coins: 750, unlock: null },
        140: { coins: 1000, unlock: null },
        160: { coins: 1500, unlock: null },
        180: { coins: 2000, unlock: null },
        200: { coins: 2500, unlock: null },
        250: { coins: 3000, unlock: null },
        300: { coins: 4000, unlock: 'Покупка обычных Баннеров' },
        350: { coins: 5000, unlock: null },
        400: { coins: 6000, unlock: 'Анимированные GIF-баннеры и Смена Обоев' },
        450: { coins: 7500, unlock: null },
        500: { coins: 10000, unlock: 'Обои профиля и Огненный Ореол "Топ 500 УРВ Игрок"' }
    };
    return rewards[level] || null;
}

// Инициализация базы данных
function initDatabase() {
    // 1. Инициализация пользователей
    if (!localStorage.getItem(STATE_KEYS.USERS)) {
        const defaultUsers = [
            {
                username: 'Kvarden',
                role: 'supreme_admin', // 👑 Высшая Администрация
                level: 1,
                xp: 0,
                coins: 50000,
                ip: '192.168.1.100',
                hwid: 'HWID-999-KVAR',
                avatar: KRX_ASSETS.avatarKvarden,
                avatarFrame: '',
                banner: KRX_ASSETS.bannerRed,
                wallpaper: '',
                bio: '👑 Высший правитель платформы KRX. Создатель порядка.',
                nickColor: 'default', // Для высших админов цвет зашит кодом (Огненно-золотой)
                inventory: [],
                friends: ['Baron_Kosyaka', 'KVARON_X', 'Neo'],
                blocked: [],
                pinnedChats: [],
                lastDailyClaim: 0
            },
            {
                username: 'Baron_Kosyaka',
                role: 'supreme_admin', // 👑 Высшая Администрация
                level: 500, // Сразу топ для демонстрации огненного ореола
                xp: 0,
                coins: 999999,
                ip: '192.168.1.101',
                hwid: 'HWID-888-BARO',
                avatar: KRX_ASSETS.avatarBaron,
                avatarFrame: '',
                banner: KRX_ASSETS.bannerGold,
                wallpaper: '',
                bio: '👑 Высший разработчик и архитектор баз данных KRX.',
                nickColor: 'default',
                inventory: [],
                friends: ['Kvarden', 'KVARON_X'],
                blocked: [],
                pinnedChats: [],
                lastDailyClaim: 0
            },
            {
                username: 'KVARON_X',
                role: 'admin', // ⚡ Админ
                level: 1,
                xp: 0,
                coins: 10000,
                ip: '192.168.1.50',
                hwid: 'HWID-777-KVAX',
                avatar: KRX_ASSETS.avatarKvaron,
                avatarFrame: '',
                banner: KRX_ASSETS.bannerCircuit,
                wallpaper: '',
                bio: '⚡ Главный контент-мейкер и цензор платформы. Публикую официальные патчи.',
                nickColor: 'default', // Будет красный статичный статус
                inventory: [],
                friends: ['Kvarden', 'Neo'],
                blocked: [],
                pinnedChats: [],
                lastDailyClaim: 0
            },
            {
                username: 'Neo',
                role: 'vip', // 💎 VIP
                level: 120, // Разблокированы гиф авы
                xp: 1500,
                coins: 2500,
                ip: '192.168.1.10',
                hwid: 'HWID-111-NEOO',
                avatar: KRX_ASSETS.avatarNeo, // GIF аватар
                avatarFrame: 'fr_1', // Установлена пурпурная рамка
                banner: KRX_ASSETS.bannerPurple,
                wallpaper: '',
                bio: '💎 Избранный VIP пользователь. В поисках истины в коде.',
                nickColor: 'neon-purple',
                inventory: ['av_1', 'fr_1', 'bn_2'], // Уже имеет вещи
                friends: ['Kvarden', 'KVARON_X', 'Trinity'],
                blocked: [],
                pinnedChats: [],
                lastDailyClaim: 0
            },
            {
                username: 'Trinity',
                role: 'user', // Обычный
                level: 85,
                xp: 800,
                coins: 850,
                ip: '192.168.1.11',
                hwid: 'HWID-222-TRIN',
                avatar: KRX_ASSETS.avatarTrinity,
                avatarFrame: '',
                banner: '',
                wallpaper: '',
                bio: 'Мы в Матрице, проснись!',
                nickColor: 'default',
                inventory: [],
                friends: ['Neo'],
                blocked: [],
                pinnedChats: [],
                lastDailyClaim: 0
            },
            {
                username: 'GuestUser',
                role: 'user',
                level: 5,
                xp: 50,
                coins: 0,
                ip: '192.168.1.20',
                hwid: 'HWID-000-GUES',
                avatar: KRX_ASSETS.avatarGuest,
                avatarFrame: '',
                banner: '',
                wallpaper: '',
                bio: 'Новичок на платформе KRX. Коплю опыт.',
                nickColor: 'default',
                inventory: [],
                friends: [],
                blocked: [],
                pinnedChats: [],
                lastDailyClaim: 0
            }
        ];
        localStorage.setItem(STATE_KEYS.USERS, JSON.stringify(defaultUsers));
        localStorage.setItem(STATE_KEYS.CURRENT_USER, 'GuestUser'); // Стартуем под гостем
    }

    // 2. Инициализация товаров магазина
    if (!localStorage.getItem(STATE_KEYS.SHOP_ITEMS)) {
        localStorage.setItem(STATE_KEYS.SHOP_ITEMS, JSON.stringify(DEFAULT_SHOP_ITEMS));
    }

    // 3. Инициализация постов ленты
    if (!localStorage.getItem(STATE_KEYS.POSTS)) {
        const defaultPosts = [
            {
                id: 'p_1',
                author: 'Kvarden',
                content: 'Добро пожаловать в KVARON_X (KRX) — социальную сеть нового поколения! 👑 Мы строим совершенный кибер-приют для лучших умов.',
                likes: ['Baron_Kosyaka', 'KVARON_X', 'Neo', 'Trinity'],
                comments: [
                    { author: 'Neo', content: 'Поразительный дизайн, Высший Админ! Очень плавная работа.', reactions: { '🔥': 2 } }
                ],
                shares: 5,
                poll: null,
                timestamp: Date.now() - 3600000 * 5
            },
            {
                id: 'p_2',
                author: 'Neo',
                content: 'А вы уже заходили в Магазин? Прикупил себе классную анимированную аватарку и рамку! 💎 Выглядит бомбезно.',
                likes: ['Kvarden', 'Trinity'],
                comments: [],
                shares: 1,
                poll: null,
                timestamp: Date.now() - 3600000 * 2
            },
            {
                id: 'p_3',
                author: 'Trinity',
                content: 'Проводим опрос: Какая таблетка правильная?',
                likes: ['Neo'],
                comments: [],
                shares: 0,
                poll: {
                    question: 'Красная или синяя таблетка?',
                    options: [
                        { text: 'Красная (Свобода)', votes: ['Neo'] },
                        { text: 'Синяя (Сон)', votes: [] }
                    ]
                , id: 'poll_p_3' },
                timestamp: Date.now() - 3600000
            }
        ];
        localStorage.setItem(STATE_KEYS.POSTS, JSON.stringify(defaultPosts));
    }

    // 4. Инициализация новостей (News)
    if (!localStorage.getItem(STATE_KEYS.NEWS)) {
        const defaultNews = [
            {
                id: 'n_1',
                author: 'KVARON_X',
                title: 'ГЛОБАЛЬНОЕ ОБНОВЛЕНИЕ KRX v1.0',
                body: '⚡ Мы рады объявить о запуске платформы KVARON_X! \n\nВ этой версии добавлено:\n1. Уникальная модульная система ролей и XP;\n2. Магазин кастомизации с GIF-аватарками, рамками и обоями;\n3. Закрытые Hardware-баны и IP-баны для Высших Админов;\n4. Интерактивные групповые чаты и опросы с живым подсчетом.\n\nТестируйте и пишите репорты!',
                likes: ['Kvarden', 'Baron_Kosyaka', 'Neo'],
                reactions: { '👍': 4, '🔥': 5, '🚀': 3 },
                views: 142,
                timestamp: Date.now() - 3600000 * 10
            }
        ];
        localStorage.setItem(STATE_KEYS.NEWS, JSON.stringify(defaultNews));
    }

    // 5. Инициализация чатов
    if (!localStorage.getItem(STATE_KEYS.CHATS)) {
        const defaultChats = [
            {
                id: 'c_1',
                type: 'direct',
                participants: ['Kvarden', 'Neo'],
                messages: [
                    { sender: 'Neo', text: 'Здравствуйте, Kvarden! Платформа работает отлично. Можно ли мне выдать дополнительную валюту для тестов?', timestamp: Date.now() - 600000 },
                    { sender: 'Kvarden', text: 'Приветствую, Neo! Вы можете забирать валюту из кошелька в виде бонусов либо заработать на активности, повышая уровень. Для тестов также есть админка, если войти под моим аккаунтом.', timestamp: Date.now() - 500000 }
                ]
            },
            {
                id: 'c_2',
                type: 'group',
                groupName: 'Форум Администрации',
                groupAvatar: KRX_ASSETS.bannerCircuit,
                participants: ['Kvarden', 'Baron_Kosyaka', 'KVARON_X'],
                messages: [
                    { sender: 'Kvarden', text: 'Коллеги, обсудим модерацию. Все ли Hardware Ban скрипты работают нормально?', timestamp: Date.now() - 120000 },
                    { sender: 'Baron_Kosyaka', text: 'Да, IP и железо отсекаются моментально. Если юзер забанен, его встречает глухая терминальная блокировка.', timestamp: Date.now() - 60000 }
                ]
            }
        ];
        localStorage.setItem(STATE_KEYS.CHATS, JSON.stringify(defaultChats));
    }

    // 6. Инициализация уведомлений
    if (!localStorage.getItem(STATE_KEYS.NOTIFICATIONS)) {
        const defaultNotifs = [
            {
                id: 'nt_1',
                toUser: 'Neo',
                fromUser: 'Kvarden',
                type: 'like',
                text: 'поставил лайк вашему посту о Магазине.',
                timestamp: Date.now() - 3600000,
                read: false
            }
        ];
        localStorage.setItem(STATE_KEYS.NOTIFICATIONS, JSON.stringify(defaultNotifs));
    }

    // 7. Инициализация черного списка IP/железа
    if (!localStorage.getItem(STATE_KEYS.HARDWARE_BANS)) {
        localStorage.setItem(STATE_KEYS.HARDWARE_BANS, JSON.stringify([]));
    }

    // 8. Инициализация списка мутов
    if (!localStorage.getItem(STATE_KEYS.MUTED_USERS)) {
        localStorage.setItem(STATE_KEYS.MUTED_USERS, JSON.stringify([]));
    }

    // 9. Обычные баны аккаунтов (без IP/HWID)
    if (!localStorage.getItem(STATE_KEYS.ACCOUNT_BANS)) {
        localStorage.setItem(STATE_KEYS.ACCOUNT_BANS, JSON.stringify([]));
    }

    migrateDatabaseSchema();
}

// ВЫЗОВ ИНИЦИАЛИЗАЦИИ
initDatabase();

/* --- ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ДОСТУПА К ДАННЫМ --- */
function migrateDatabaseSchema() {
    const users = JSON.parse(localStorage.getItem(STATE_KEYS.USERS) || '[]');
    const shopItems = JSON.parse(localStorage.getItem(STATE_KEYS.SHOP_ITEMS) || '[]');
    let changed = false;

    users.forEach(user => {
        const defaultVisuals = {
            Kvarden: { avatar: KRX_ASSETS.avatarKvarden, banner: KRX_ASSETS.bannerRed },
            Baron_Kosyaka: { avatar: KRX_ASSETS.avatarBaron, banner: KRX_ASSETS.bannerGold },
            KVARON_X: { avatar: KRX_ASSETS.avatarKvaron, banner: KRX_ASSETS.bannerCircuit },
            Neo: { avatar: KRX_ASSETS.avatarNeo, banner: KRX_ASSETS.bannerPurple },
            Trinity: { avatar: KRX_ASSETS.avatarTrinity, banner: KRX_ASSETS.bannerGreen },
            GuestUser: { avatar: KRX_ASSETS.avatarGuest, banner: '' }
        };
        const visuals = defaultVisuals[user.username];
        if (visuals && (!user.avatar || user.avatar.includes('images.unsplash.com') || user.avatar.includes('media.giphy.com'))) {
            user.avatar = visuals.avatar;
            changed = true;
        }
        if (visuals && user.banner && (user.banner.includes('images.unsplash.com') || user.banner.includes('media.giphy.com'))) {
            user.banner = visuals.banner;
            changed = true;
        }

        const defaults = {
            verified: false,
            verificationType: 'blue',
            pinnedFriends: [],
            photos: [],
            blocked: [],
            friends: [],
            inventory: [],
            lastDailyClaim: 0
        };

        Object.entries(defaults).forEach(([key, value]) => {
            if (typeof user[key] === 'undefined') {
                user[key] = Array.isArray(value) ? [...value] : value;
                changed = true;
            }
        });

        if ((user.role === 'supreme_admin' || user.role === 'admin') && shopItems.length > 0) {
            const allItemIds = shopItems.map(item => item.id);
            const fullInventory = Array.from(new Set([...(user.inventory || []), ...allItemIds]));
            if (fullInventory.length !== user.inventory.length) {
                user.inventory = fullInventory;
                changed = true;
            }
        }

        if ((user.role === 'supreme_admin' || user.role === 'admin') && !user.wallpaper) {
            user.wallpaper = user.username === 'KVARON_X' ? 'matrix' : 'cybermesh';
            changed = true;
        }

        if (!Array.isArray(user.photos) || user.photos.length === 0) {
            user.photos = [
                user.banner || KRX_ASSETS.bannerCircuit,
                user.avatar || KRX_ASSETS.avatarGuest,
                KRX_ASSETS.realCircuit
            ];
            changed = true;
        } else if (user.photos.some(photo => photo.includes('images.unsplash.com') || photo.includes('media.giphy.com'))) {
            user.photos = [
                user.banner || KRX_ASSETS.bannerCircuit,
                user.avatar || KRX_ASSETS.avatarGuest,
                KRX_ASSETS.realCircuit
            ];
            changed = true;
        }
    });

    if (changed) {
        localStorage.setItem(STATE_KEYS.USERS, JSON.stringify(users));
    }

    let shopChanged = false;
    const defaultShopUrls = Object.fromEntries(DEFAULT_SHOP_ITEMS.map(item => [item.id, item.url]));
    shopItems.forEach(item => {
        if (defaultShopUrls[item.id] && (
            !item.url ||
            item.url.includes('images.unsplash.com') ||
            item.url.includes('media.giphy.com') ||
            item.url.includes('i.ibb.co')
        )) {
            item.url = defaultShopUrls[item.id];
            shopChanged = true;
        }
    });

    if (shopChanged) {
        localStorage.setItem(STATE_KEYS.SHOP_ITEMS, JSON.stringify(shopItems));
    }

    const chats = JSON.parse(localStorage.getItem(STATE_KEYS.CHATS) || '[]');
    let chatsChanged = false;
    chats.forEach(chat => {
        if (chat.type === 'group' && !chat.owner) {
            chat.owner = chat.participants?.[0] || 'System';
            chatsChanged = true;
        }
        if (chat.type === 'group' && (!chat.groupAvatar || chat.groupAvatar.includes('images.unsplash.com'))) {
            chat.groupAvatar = KRX_ASSETS.bannerCircuit;
            chatsChanged = true;
        }
    });

    if (chatsChanged) {
        localStorage.setItem(STATE_KEYS.CHATS, JSON.stringify(chats));
    }
}

function getUsers() {
    return JSON.parse(localStorage.getItem(STATE_KEYS.USERS));
}

function saveUsers(users) {
    localStorage.setItem(STATE_KEYS.USERS, JSON.stringify(users));
}

function getActiveUser() {
    const activeName = localStorage.getItem(STATE_KEYS.CURRENT_USER);
    const users = getUsers();
    return users.find(u => u.username === activeName) || users[users.length - 1];
}

function setActiveUser(username) {
    localStorage.setItem(STATE_KEYS.CURRENT_USER, username);
}

function getPosts() {
    return JSON.parse(localStorage.getItem(STATE_KEYS.POSTS));
}

function savePosts(posts) {
    localStorage.setItem(STATE_KEYS.POSTS, JSON.stringify(posts));
}

function getNews() {
    return JSON.parse(localStorage.getItem(STATE_KEYS.NEWS));
}

function saveNews(news) {
    localStorage.setItem(STATE_KEYS.NEWS, JSON.stringify(news));
}

function getChats() {
    return JSON.parse(localStorage.getItem(STATE_KEYS.CHATS));
}

function saveChats(chats) {
    localStorage.setItem(STATE_KEYS.CHATS, JSON.stringify(chats));
}

function getNotifications() {
    return JSON.parse(localStorage.getItem(STATE_KEYS.NOTIFICATIONS));
}

function saveNotifications(notifs) {
    localStorage.setItem(STATE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
}

function getShopItems() {
    return JSON.parse(localStorage.getItem(STATE_KEYS.SHOP_ITEMS));
}

function saveShopItems(items) {
    localStorage.setItem(STATE_KEYS.SHOP_ITEMS, JSON.stringify(items));
}

function getAccountBans() {
    return JSON.parse(localStorage.getItem(STATE_KEYS.ACCOUNT_BANS) || '[]');
}

function saveAccountBans(bans) {
    localStorage.setItem(STATE_KEYS.ACCOUNT_BANS, JSON.stringify(bans));
}

function getHardwareBans() {
    return JSON.parse(localStorage.getItem(STATE_KEYS.HARDWARE_BANS));
}

function saveHardwareBans(bans) {
    localStorage.setItem(STATE_KEYS.HARDWARE_BANS, JSON.stringify(bans));
}

function getMutedUsers() {
    return JSON.parse(localStorage.getItem(STATE_KEYS.MUTED_USERS));
}

function saveMutedUsers(mutes) {
    localStorage.setItem(STATE_KEYS.MUTED_USERS, JSON.stringify(mutes));
}

function isSupremeAdmin(user) {
    return Boolean(user && (user.role === 'supreme_admin' || user.username === 'Kvarden' || user.username === 'Baron_Kosyaka'));
}

function isAdminUser(user) {
    return Boolean(user && (isSupremeAdmin(user) || user.role === 'admin' || user.username === 'KVARON_X'));
}

function canManageEconomy(user) {
    return isSupremeAdmin(user);
}

function canUseLiveWallpapers(user) {
    return isAdminUser(user);
}

function getUserFollowersCount(username) {
    return getUsers().filter(user => (user.friends || []).includes(username)).length;
}

function getUserRoleLabel(user) {
    if (!user) return 'Пользователь';
    if (isSupremeAdmin(user)) return '👑 Высшая Администрация';
    if (user.role === 'admin') return '⚡ Администратор';
    if (user.role === 'vip') return '💎 VIP Игрок';
    return 'Пользователь';
}

function getUserBadgeMarkup(user) {
    if (!user) return '';

    if (isSupremeAdmin(user)) {
        return '<span class="badge-checkmark badge-supreme-check" title="Высшая Администрация">◆</span>';
    }

    if (user.role === 'admin') {
        return '<span class="badge-checkmark badge-admin-check" title="Администратор">◆</span>';
    }

    if (user.role === 'vip') {
        const vipClass = user.nickColor === 'neon-green' ? 'badge-vip-green-check' : 'badge-vip-purple-check';
        return `<span class="badge-checkmark ${vipClass}" title="VIP">◆</span>`;
    }

    if (user.level >= 500) {
        return '<span class="badge-checkmark badge-top500-check" title="Топ 500 УРВ Игрок">◆</span>';
    }

    if (user.verified) {
        return '<span class="badge-checkmark badge-blue-check" title="Подтвержденный пользователь">◆</span>';
    }

    return '';
}

function getUserNickClass(user) {
    if (!user) return '';
    if (isSupremeAdmin(user)) return 'nick-admin-fire';
    if (user.role === 'vip' && user.nickColor === 'neon-green') return 'nick-neon-green';
    if (user.role === 'vip' && user.nickColor === 'neon-purple') return 'nick-neon-purple';
    return '';
}

/* --- ДВИЖОК ОПЫТА И УРОВНЕЙ (XP ENGINE) --- */
function getXPForNextLevel(level) {
    return Math.floor((level * 100) * 1.5);
}

// Ролевой множитель опыта
function getRoleXPMultiplier(role) {
    if (role === 'supreme_admin') return 5.0; // 5x
    if (role === 'admin') return 3.0;         // 3x
    if (role === 'vip') return 2.0;           // 2x
    return 1.0;                               // 1x
}

// Начисление XP
function addXP(amount) {
    const user = getActiveUser();
    const multiplier = getRoleXPMultiplier(user.role);
    const xpGained = Math.round(amount * multiplier);
    
    let users = getUsers();
    let dbUser = users.find(u => u.username === user.username);
    
    if (!dbUser) return;
    
    // Администраторам изначально и без ограничений доступны все настройки, 
    // но уровень они могут крутить для развлечения или тестов.
    dbUser.xp += xpGained;
    
    let currentLvl = dbUser.level;
    let xpNeeded = getXPForNextLevel(currentLvl);
    let leveledUp = false;
    let oldLvl = currentLvl;
    let earnedCoins = 0;
    let unlockedItems = [];

    // Цикл повышения уровней (на случай если XP прилетело много)
    while (dbUser.xp >= xpNeeded && dbUser.level < 500) {
        dbUser.xp -= xpNeeded;
        dbUser.level += 1;
        currentLvl = dbUser.level;
        xpNeeded = getXPForNextLevel(currentLvl);
        leveledUp = true;
        
        // Награда за уровень
        const reward = getLevelReward(dbUser.level);
        if (reward) {
            dbUser.coins += reward.coins;
            earnedCoins += reward.coins;
            if (reward.unlock) {
                unlockedItems.push(reward.unlock);
            }
        }
    }
    
    saveUsers(users);
    
    // Вызов уведомления на экране о получении XP
    showNotification('⭐ Опыт', `+${xpGained} XP (Множитель: ${multiplier}x)`);
    
    // Если уровень повышен — запускаем красивую модалку ЛВЛ-апа
    if (leveledUp) {
        triggerLevelUpModal(oldLvl, dbUser.level, earnedCoins, unlockedItems);
    }
    
    // Обновляем HUDы на страницах
    if (window.updateUserHUD) {
        window.updateUserHUD();
    }
}

// Отображение модалки ЛВЛ-Апа
function triggerLevelUpModal(oldLvl, newLvl, coinsReward, unlocks) {
    const modal = document.getElementById('level-up-modal');
    if (!modal) return;
    
    modal.querySelector('.old-level').textContent = oldLvl;
    modal.querySelector('.new-level').textContent = newLvl;
    modal.querySelector('.rank-name-alert').textContent = getRankName(newLvl);
    
    const rewardEl = modal.querySelector('.reward-amount');
    if (coinsReward > 0) {
        rewardEl.textContent = `+${coinsReward} KRX монет начислено!`;
        rewardEl.classList.remove('hidden');
    } else {
        rewardEl.classList.add('hidden');
    }
    
    const unlockEl = modal.querySelector('.unlock-item-alert');
    if (unlocks && unlocks.length > 0) {
        unlockEl.querySelector('.unlock-text').textContent = `РАЗБЛОКИРОВАНО: ${unlocks.join(', ')}`;
        unlockEl.classList.remove('hidden');
    } else {
        unlockEl.classList.add('hidden');
    }
    
    modal.classList.remove('hidden');
    
    // Высыпаем искры (Sparkles)
    createSparkles();
}

function closeLevelUpModal() {
    const modal = document.getElementById('level-up-modal');
    if (modal) modal.classList.add('hidden');
}

// Эффект фейерверка/искр для модалки уровня
function createSparkles() {
    const container = document.querySelector('.sparkles-container');
    if (!container) return;
    container.innerHTML = '';
    
    for (let i = 0; i < 30; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'absolute';
        sparkle.style.width = Math.random() * 6 + 4 + 'px';
        sparkle.style.height = sparkle.style.width;
        sparkle.style.borderRadius = '50%';
        sparkle.style.background = `hsl(${Math.random() * 360}, 100%, 75%)`;
        sparkle.style.top = '50%';
        sparkle.style.left = '50%';
        sparkle.style.boxShadow = '0 0 10px currentColor';
        
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 120 + 30;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        container.appendChild(sparkle);
        
        sparkle.animate([
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: `translate(calc(-50% + ${vx}px), calc(-50% + ${vy}px)) scale(0)`, opacity: 0 }
        ], {
            duration: Math.random() * 800 + 600,
            easing: 'ease-out',
            fill: 'forwards'
        });
    }
}

// Создание системных всплывашек Alerts
function showNotification(title, message, icon = '🔔') {
    const center = document.getElementById('notification-center');
    if (!center) return;
    
    const toast = document.createElement('div');
    toast.className = 'alert-toast';
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-msg">${message}</div>
        </div>
    `;
    
    center.appendChild(toast);
    
    // Удаляем тост через 4 секунды с анимацией
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 3800);
}
