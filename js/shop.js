/* KVARON_X (KRX) — ЛОГИКА ЦИФРОВОГО МАГАЗИНА, КОШЕЛЬКА И ИНВЕНТАРЯ (SHOP, WALLET & INVENTORY ENGINE) */

let activeShopCategory = 'all';

// Инициализация истории транзакций кошелька
function getTransactions() {
    if (!localStorage.getItem('krx_transactions')) {
        const defaultTx = [
            { id: 'TX-1001', user: 'Kvarden', type: 'Стартовый капитал создателя', amount: 50000, timestamp: Date.now() - 3600000 * 24, status: 'Завершено' },
            { id: 'TX-1002', user: 'Baron_Kosyaka', type: 'Эмиссия разработчика', amount: 999999, timestamp: Date.now() - 3600000 * 12, status: 'Завершено' },
            { id: 'TX-1003', user: 'Neo', type: 'Стартовый баланс VIP', amount: 2500, timestamp: Date.now() - 3600000 * 6, status: 'Завершено' }
        ];
        localStorage.setItem('krx_transactions', JSON.stringify(defaultTx));
    }
    return JSON.parse(localStorage.getItem('krx_transactions'));
}

function saveTransactions(txs) {
    localStorage.setItem('krx_transactions', JSON.stringify(txs));
}

// Привязка кликов к категориям магазина при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.shop-cat-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.shop-cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeShopCategory = btn.getAttribute('data-cat');
            renderShop();
        });
    });
    
    // Запуск таймера для обновления кошелька (оставшегося времени ежедневного бонуса)
    setInterval(updateDailyBonusHUD, 1000);
});


/* ==========================================
   1. ДВИЖОК ЦИФРОВОГО МАГАЗИНА (SHOP GRID)
   ========================================== */

function renderShop() {
    const container = document.getElementById('shop-items-container');
    if (!container) return;
    container.innerHTML = '';
    
    const items = getShopItems();
    const currentUser = getActiveUser();
    
    // Получаем поисковые параметры
    const searchName = document.getElementById('shop-search-name')?.value.toLowerCase() || '';
    const searchId = document.getElementById('shop-search-id')?.value.toLowerCase() || '';
    const searchPrice = parseFloat(document.getElementById('shop-search-price')?.value) || Infinity;
    
    // Фильтруем товары
    const filteredItems = items.filter(item => {
        // 1. Фильтр категории
        if (activeShopCategory !== 'all' && item.category !== activeShopCategory) return false;
        
        // 2. Фильтр поиска по названию
        if (searchName !== '' && !item.name.toLowerCase().includes(searchName)) return false;
        
        // 3. Фильтр по ID
        if (searchId !== '' && !item.id.toLowerCase().includes(searchId)) return false;
        
        // 4. Фильтр по цене
        const price = item.discount > 0 ? Math.round(item.price * (1 - item.discount / 100)) : item.price;
        if (price > searchPrice) return false;
        
        return true;
    });
    
    if (filteredItems.length === 0) {
        container.innerHTML = `
            <div class="card" style="grid-column: 1/-1; text-align:center; padding:50px; color:var(--text-secondary);">
                Товары не найдены. Попробуйте изменить параметры поиска 🛍️
            </div>
        `;
        return;
    }
    
    filteredItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'shop-card card';
        
        // Расчет цены со скидкой
        const hasDiscount = item.discount > 0;
        const discountPrice = hasDiscount ? Math.round(item.price * (1 - item.discount / 100)) : item.price;
        
        // Проверка куплен ли товар
        const isOwned = currentUser.inventory.includes(item.id);
        
        // Проверка уровней доступа (Администраторам доступно всё без ограничений с 1 уровня)
        const isAdmin = currentUser.role === 'supreme_admin' || currentUser.role === 'admin';
        const levelLocked = !isAdmin && (item.minLvl && currentUser.level < item.minLvl);
        
        // Генерация таймера скидки
        let timerHtml = '';
        if (hasDiscount && item.timer > 0) {
            const h = Math.floor(item.timer / 3600);
            const m = Math.floor((item.timer % 3600) / 60);
            const s = item.timer % 60;
            const timeStr = `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
            timerHtml = `<div class="shop-badge-timer">🔥 Акция! Осталось: ${timeStr}</div>`;
        } else if (item.minLvl > 1) {
            timerHtml = `<div class="shop-badge-level">🔒 Требуется УРВ: ${item.minLvl}</div>`;
        }
        
        // Картинка превью товара
        let previewHtml = '';
        if (item.category === 'wallpapers' && item.isLive) {
            previewHtml = `
                <div class="shop-item-preview flex-center" style="background:#050505; color:var(--vip-green); font-family:var(--font-mono); font-size:11px; text-align:center; border-bottom:1px solid var(--border-color); height:120px;">
                    <div>
                        <span style="font-size:24px; display:block; margin-bottom:5px;">💻</span>
                        Живые обои "${item.name}"
                    </div>
                </div>
            `;
        } else {
            previewHtml = `
                <div class="shop-item-preview" style="background-image: url('${item.url || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=150'}')"></div>
            `;
        }
        
        // Форматирование кнопок действий
        let actionBtn = '';
        if (isOwned) {
            actionBtn = `<button class="btn btn-secondary btn-block disabled" disabled>Уже Куплено</button>`;
        } else if (levelLocked) {
            actionBtn = `<button class="btn btn-secondary btn-block disabled" disabled>🔒 Недостаточный УРВ</button>`;
        } else {
            actionBtn = `<button class="btn btn-primary btn-block" onclick="buyShopItem('${item.id}')">Купить</button>`;
        }
        
        // Категория текст
        const catLabels = { avatars: 'Аватарка', frames: 'Рамка', banners: 'Баннер', wallpapers: 'Обои профиля' };
        
        card.innerHTML = `
            ${timerHtml}
            ${previewHtml}
            <div class="shop-item-details" style="padding:15px; display:flex; flex-direction:column; gap:10px;">
                <span style="font-size:10px; color:var(--text-secondary); text-transform:uppercase; font-family:var(--font-mono);">${catLabels[item.category] || item.category}</span>
                <h4 style="font-size:13px; font-weight:700; margin:0; min-height:36px; line-height:1.3;">${item.name}</h4>
                
                <div class="shop-price-block" style="display:flex; align-items:baseline; gap:8px;">
                    ${hasDiscount ? `<span style="font-size:11px; color:var(--text-secondary); text-decoration:line-through;">${item.price} KRX</span>` : ''}
                    <span style="font-size:15px; font-weight:800; color:#fff;">${discountPrice} KRX</span>
                </div>
                ${actionBtn}
            </div>
        `;
        
        container.appendChild(card);
    });
}

function filterShopItems() {
    renderShop();
}

// Запуск обратного отсчета скидок магазина
function tickShopTimers() {
    let items = getShopItems();
    let changed = false;
    
    items.forEach(item => {
        if (item.discount > 0 && item.timer > 0) {
            item.timer -= 1;
            changed = true;
            
            if (item.timer <= 0) {
                item.discount = 0; // Скидка закончилась
            }
        }
    });
    
    if (changed) {
        saveShopItems(items);
        if (activeTab === 'shop') {
            renderShop();
        }
    }
}


/* --- ПОКУПКА ТОВАРА --- */
function buyShopItem(itemId) {
    const items = getShopItems();
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    const currentUser = getActiveUser();
    let users = getUsers();
    let dbUser = users.find(u => u.username === currentUser.username);
    
    if (!dbUser) return;
    
    // Проверка повторной покупки
    if (dbUser.inventory.includes(itemId)) {
        showNotification('Магазин', 'Данный товар уже куплен!', '🛍️');
        return;
    }
    
    // Проверка уровней (Админы обходят ограничения)
    const isAdmin = dbUser.role === 'supreme_admin' || dbUser.role === 'admin';
    if (!isAdmin && item.minLvl && dbUser.level < item.minLvl) {
        showNotification('Уровень', `Для покупки нужен уровень ${item.minLvl}!`, '🔒');
        return;
    }
    
    // Расчет цены
    const price = item.discount > 0 ? Math.round(item.price * (1 - item.discount / 100)) : item.price;
    
    if (dbUser.coins < price) {
        showNotification('Баланс', 'Недостаточно KRX монет на балансе!', '🪙');
        return;
    }
    
    // Снимаем деньги и добавляем вещь в инвентарь
    dbUser.coins -= price;
    dbUser.inventory.push(itemId);
    saveUsers(users);
    
    // Записываем транзакцию
    const txs = getTransactions();
    const newTx = {
        id: 'TX-' + Math.floor(Math.random() * 9000 + 1000),
        user: dbUser.username,
        type: `Покупка товара: ${item.name}`,
        amount: -price,
        timestamp: Date.now(),
        status: 'Завершено'
    };
    txs.unshift(newTx);
    saveTransactions(txs);
    
    // Опыт за покупку
    addXP(30);
    
    showNotification('Успешная покупка!', `Вы приобрели товар "${item.name}" за ${price} KRX!`, '🛍️');
    
    // Полное обновление
    updateUserHUD();
    renderShop();
}


/* ==========================================
   2. ЛОГИКА КОШЕЛЬКА И ТРАНЗАКЦИЙ (WALLET)
   ========================================== */

function renderWallet() {
    const user = getActiveUser();
    
    // 1. Обновляем балансы в HUD кошелька
    const balanceBig = document.getElementById('wallet-balance-big');
    const roleBoost = document.getElementById('wallet-role-boost');
    
    if (balanceBig) balanceBig.textContent = `${user.coins.toLocaleString()} KRX`;
    
    if (roleBoost) {
        const mult = getRoleXPMultiplier(user.role);
        let roleText = 'Обычный';
        if (user.role === 'supreme_admin') roleText = '👑 Высшая Администрация';
        else if (user.role === 'admin') roleText = '⚡ Админ';
        else if (user.role === 'vip') roleText = '💎 VIP';
        roleBoost.textContent = `Ролевой статус: ${roleText} (Опыт: x${mult.toFixed(1)})`;
    }
    
    // 2. Рендерим транзакции кошелька
    const container = document.getElementById('wallet-history-container');
    if (container) {
        container.innerHTML = '';
        const txs = getTransactions().filter(t => t.user === user.username);
        
        if (txs.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center; color:var(--text-secondary); padding: 20px;">
                        Транзакции отсутствуют.
                    </td>
                </tr>
            `;
        } else {
            txs.forEach(t => {
                const tr = document.createElement('tr');
                const isNegative = t.amount < 0;
                const amtClass = isNegative ? 'style="color:#ff3333; font-weight:700;"' : 'style="color:#39ff14; font-weight:700;"';
                const amtText = isNegative ? `${t.amount.toLocaleString()} KRX` : `+${t.amount.toLocaleString()} KRX`;
                
                tr.innerHTML = `
                    <td style="font-family:var(--font-mono); font-size:11px;">${t.id}</td>
                    <td style="font-size:12px;">${t.type}</td>
                    <td ${amtClass}>${amtText}</td>
                    <td style="font-family:var(--font-mono); font-size:11px;">${new Date(t.timestamp).toLocaleString()}</td>
                    <td><span class="badge-tag" style="background:rgba(57,255,20,0.08); color:var(--vip-green); border:1px solid rgba(57,255,20,0.15); font-size:10px; padding:2px 6px; border-radius:3px;">${t.status}</span></td>
                `;
                container.appendChild(tr);
            });
        }
    }
    
    updateDailyBonusHUD();
}

// Обновление состояния кнопки Ежедневного бонуса
function updateDailyBonusHUD() {
    if (activeTab !== 'wallet') return;
    
    const user = getActiveUser();
    const btn = document.getElementById('btn-claim-daily');
    const timerText = document.getElementById('daily-claim-timer');
    
    if (!btn || !timerText) return;
    
    const now = Date.now();
    const cooldown = 24 * 3600 * 1000; // 24 часа
    const nextClaim = user.lastDailyClaim + cooldown;
    
    if (now >= nextClaim) {
        btn.classList.remove('hidden');
        btn.disabled = false;
        btn.textContent = 'Забрать Бонус';
        timerText.classList.add('hidden');
    } else {
        btn.classList.add('hidden');
        btn.disabled = true;
        timerText.classList.remove('hidden');
        
        // Расчет тикера часового таймера
        const diff = nextClaim - now;
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        timerText.textContent = `Доступно через: ${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
}

// Клейм ежедневного бонуса
function claimDailyReward() {
    const user = getActiveUser();
    const now = Date.now();
    const cooldown = 24 * 3600 * 1000;
    
    if (now < user.lastDailyClaim + cooldown) {
        showNotification('Бонус', 'Время еще не пришло!', '🎁');
        return;
    }
    
    // Базовая ставка бонуса
    let baseReward = 200;
    if (user.role === 'supreme_admin') baseReward = 5000; // Админам больше для тестов
    else if (user.role === 'admin') baseReward = 2000;
    else if (user.role === 'vip') baseReward = 800;
    
    let users = getUsers();
    let dbUser = users.find(u => u.username === user.username);
    if (!dbUser) return;
    
    dbUser.coins += baseReward;
    dbUser.lastDailyClaim = now;
    saveUsers(users);
    
    // Добавим в транзакции
    const txs = getTransactions();
    txs.unshift({
        id: 'TX-' + Math.floor(Math.random() * 9000 + 1000),
        user: dbUser.username,
        type: 'Ежедневный бонус лояльности KRX',
        amount: baseReward,
        timestamp: now,
        status: 'Завершено'
    });
    saveTransactions(txs);
    
    // +30 XP за преданность платформе
    addXP(30);
    
    showNotification('Бонус зачислен!', `Получено +${baseReward} KRX монет в кошелек!`, '🎁');
    
    updateUserHUD();
    renderWallet();
}


/* ==========================================
   3. ЛОГИКА НАСТРОЕК ПРОФИЛЯ И ИНВЕНТАРЯ
   ========================================== */

function renderSettings() {
    const user = getActiveUser();
    
    // 1. Обновляем превью профиля
    const bannerView = document.getElementById('profile-banner-view');
    const avatarView = document.getElementById('profile-avatar-view');
    const frameView = document.getElementById('profile-frame-view');
    const nameView = document.getElementById('profile-name-view');
    const roleView = document.getElementById('profile-role-badge');
    const lvlView = document.getElementById('profile-level-badge');
    const rankView = document.getElementById('profile-rank-badge');
    const aboutView = document.getElementById('profile-about-view');
    
    if (bannerView) {
        bannerView.style.backgroundImage = user.banner ? `url(${user.banner})` : 'none';
        bannerView.style.backgroundSize = 'cover';
        bannerView.style.backgroundPosition = 'center';
    }
    
    if (avatarView) {
        avatarView.src = user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
        
        // Огненный ореол на 500 УРВ
        const avatarWrapper = avatarView.parentElement;
        if (avatarWrapper) {
            if (user.level >= 500) {
                avatarWrapper.className = 'profile-avatar-block top-500-fire-halo';
            } else {
                avatarWrapper.className = 'profile-avatar-block';
            }
        }
    }
    
    if (frameView) {
        if (user.avatarFrame) {
            const items = getShopItems();
            const frameItem = items.find(i => i.id === user.avatarFrame);
            if (frameItem) {
                frameView.style.backgroundImage = `url(${frameItem.url})`;
                frameView.classList.remove('hidden');
            } else {
                frameView.classList.add('hidden');
            }
        } else {
            frameView.classList.add('hidden');
        }
    }
    
    if (nameView) {
        nameView.textContent = user.username;
        nameView.className = ''; // сброс
        
        // Никнейм стили свечения
        if (user.role === 'supreme_admin') {
            nameView.classList.add('nick-admin-fire');
        } else if (user.role === 'vip' && user.nickColor === 'neon-green') {
            nameView.classList.add('nick-neon-green');
        } else if (user.role === 'vip' && user.nickColor === 'neon-purple') {
            nameView.classList.add('nick-neon-purple');
        }
    }
    
    if (roleView) {
        let roleName = 'Пользователь';
        if (user.role === 'supreme_admin') roleName = '👑 Высшая Администрация';
        else if (user.role === 'admin') roleName = '⚡ Администратор';
        else if (user.role === 'vip') roleName = '💎 VIP Игрок';
        
        roleView.textContent = roleName;
        roleView.className = `badge-role ${user.role}`;
    }
    
    if (lvlView) lvlView.textContent = `LVL ${user.level}`;
    if (rankView) rankView.textContent = getRankName(user.level);
    if (aboutView) aboutView.textContent = user.bio || 'О себе еще не написано...';
    
    // 2. Заполняем поля ввода формы редактирования
    const usernameInp = document.getElementById('settings-username');
    const aboutInp = document.getElementById('settings-about');
    
    if (usernameInp) usernameInp.value = user.username;
    if (aboutInp) {
        aboutInp.value = user.bio || '';
        updateBioLength();
    }
    
    // 3. Цвет ника для VIP и Администрации
    const vipColorSection = document.getElementById('vip-color-setting-holder');
    if (vipColorSection) {
        const canChangeColor = user.role === 'supreme_admin' || user.role === 'admin' || user.role === 'vip';
        if (canChangeColor) {
            vipColorSection.classList.remove('hidden');
            const select = document.getElementById('settings-nick-color');
            if (select) select.value = user.nickColor || 'default';
        } else {
            vipColorSection.classList.add('hidden');
        }
    }
    
    // 4. Обои Профиля кастомизация lock/unlock
    // 400 УРВ -> Доступ для обычных, Админам открыто всегда.
    const hasWpAccess = user.role === 'supreme_admin' || user.role === 'admin' || user.level >= 400;
    const wpLockBadge = document.getElementById('wallpaper-lock-badge');
    const wpSelectorContainer = document.getElementById('wallpaper-selector-container');
    
    if (wpLockBadge && wpSelectorContainer) {
        if (hasWpAccess) {
            wpLockBadge.classList.add('hidden');
            wpSelectorContainer.classList.remove('disabled');
            renderWallpaperSelector();
        } else {
            wpLockBadge.classList.remove('hidden');
            wpSelectorContainer.classList.add('disabled');
            document.getElementById('wallpaper-options-grid').innerHTML = `
                <div style="font-size:11px; color:var(--text-secondary); text-align:center; padding:15px; grid-column:1/-1;">
                    🔒 Разблокируется на 400 УРВ. Копите опыт в ленте и чатах!
                </div>
            `;
        }
    }
    
    // 5. Рендерим личный инвентарь пользователя (аватарки, рамки, баннеры)
    renderInventory();
}

function updateBioLength() {
    const text = document.getElementById('settings-about')?.value || '';
    const count = document.getElementById('settings-about-count');
    if (count) count.textContent = text.length;
}

// Рендерим Обои в селекторе кастомизации
function renderWallpaperSelector() {
    const grid = document.getElementById('wallpaper-options-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    const user = getActiveUser();
    const items = getShopItems().filter(i => i.category === 'wallpapers');
    
    // Системные Живые обои доступны Администраторам автоматически
    const isAdmin = user.role === 'supreme_admin' || user.role === 'admin';
    
    items.forEach(wp => {
        // Обычные юзеры должны сначала купить обои в магазине
        const isOwned = user.inventory.includes(wp.id) || isAdmin;
        if (!isOwned) return;
        
        const opt = document.createElement('div');
        opt.className = `wallpaper-opt-card card ${user.wallpaper === wp.url ? 'active' : ''}`;
        opt.onclick = () => applyProfileWallpaper(wp.url);
        
        // Превью
        if (wp.isLive) {
            opt.innerHTML = `
                <div style="height:40px; background:#050505; color:var(--vip-green); display:flex; align-items:center; justify-content:center; font-family:var(--font-mono); font-size:9px; border-bottom:1px solid rgba(255,255,255,0.05);">
                    📟 LIVE
                </div>
                <div style="padding:6px; font-size:10px; text-align:center;">${wp.name}</div>
            `;
        } else {
            opt.innerHTML = `
                <div style="height:40px; background-image:url('${wp.url}'); background-size:cover; background-position:center; border-bottom:1px solid rgba(255,255,255,0.05);"></div>
                <div style="padding:6px; font-size:10px; text-align:center;">${wp.name}</div>
            `;
        }
        grid.appendChild(opt);
    });
    
    if (grid.children.length === 0) {
        grid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:15px; font-size:11px; color:var(--text-secondary);">
                Купите обои в Магазине кастомизации. 🛍️
            </div>
        `;
    }
}

function applyProfileWallpaper(wpUrl) {
    let users = getUsers();
    const currentUser = getActiveUser();
    let dbUser = users.find(u => u.username === currentUser.username);
    
    if (dbUser) {
        dbUser.wallpaper = wpUrl;
        saveUsers(users);
        showNotification('Обои изменены', 'Вы успешно сменили обои интерфейса!', '🖼️');
        
        // Перезапускаем холст обоев
        updateUserHUD();
        renderSettings();
    }
}

function resetWallpaper() {
    applyProfileWallpaper('');
}

// Сохранить основные настройки
function saveProfileSettings() {
    const usernameInp = document.getElementById('settings-username');
    const aboutInp = document.getElementById('settings-about');
    const colorSelect = document.getElementById('settings-nick-color');
    
    if (!usernameInp || usernameInp.value.trim() === '') {
        alert('Никнейм не может быть пустым!');
        return;
    }
    
    const newName = usernameInp.value.trim();
    const newBio = aboutInp ? aboutInp.value.trim() : '';
    const newColor = colorSelect ? colorSelect.value : 'default';
    
    if (newName.length > 25) {
        alert('Слишком длинный никнейм (макс. 25 символов)!');
        return;
    }
    
    let users = getUsers();
    const currentUser = getActiveUser();
    
    // Проверка дубликатов никнейма
    const nameExists = users.some(u => u.username.toLowerCase() === newName.toLowerCase() && u.username !== currentUser.username);
    if (nameExists) {
        showNotification('Ошибка', 'Никнейм уже занят другим кибер-странником!', '🚫');
        return;
    }
    
    let dbUser = users.find(u => u.username === currentUser.username);
    if (dbUser) {
        // Меняем ник везде во всех данных (чаты, посты, истории)
        const oldName = dbUser.username;
        dbUser.username = newName;
        dbUser.bio = newBio;
        dbUser.nickColor = newColor;
        
        // Обновляем текущего юзера в сессии
        setActiveUser(newName);
        
        // Меняем ник автора в постах и комнатах
        updateDataOnUsernameChange(oldName, newName);
        
        saveUsers(users);
        showNotification('Профиль сохранен', 'Все настройки вашего профиля успешно обновлены.', '📝');
        addXP(15);
        
        updateUserHUD();
        renderSettings();
    }
}

// Синхронизация старых постов/чатов при смене ника
function updateDataOnUsernameChange(oldName, newName) {
    // 1. Посты
    let posts = getPosts();
    posts.forEach(p => {
        if (p.author === oldName) p.author = newName;
        
        // Комменты
        p.comments.forEach(c => {
            if (c.author === oldName) c.author = newName;
        });
        
        // Лайки
        const lIdx = p.likes.indexOf(oldName);
        if (lIdx > -1) p.likes[lIdx] = newName;
        
        // Опросы
        if (p.poll) {
            p.poll.options.forEach(opt => {
                const vIdx = opt.votes.indexOf(oldName);
                if (vIdx > -1) opt.votes[vIdx] = newName;
            });
        }
    });
    savePosts(posts);
    
    // 2. Новости
    let news = getNews();
    news.forEach(n => {
        if (n.author === oldName) n.author = newName;
        const lIdx = n.likes.indexOf(oldName);
        if (lIdx > -1) n.likes[lIdx] = newName;
    });
    saveNews(news);
    
    // 3. Чаты
    let chats = getChats();
    chats.forEach(c => {
        // Участники
        const pIdx = c.participants.indexOf(oldName);
        if (pIdx > -1) c.participants[pIdx] = newName;
        
        // Сообщения
        c.messages.forEach(m => {
            if (m.sender === oldName) m.sender = newName;
            if (m.poll) {
                m.poll.options.forEach(opt => {
                    const vIdx = opt.votes.indexOf(oldName);
                    if (vIdx > -1) opt.votes[vIdx] = newName;
                });
            }
        });
    });
    saveChats(chats);
    
    // 4. Уведомления
    let notifs = getNotifications();
    notifs.forEach(nt => {
        if (nt.toUser === oldName) nt.toUser = newName;
        if (nt.fromUser === oldName) nt.fromUser = newName;
    });
    saveNotifications(notifs);
}


/* --- ОТРИСОВКА И ПРИМЕНЕНИЕ ИНВЕНТАРЯ --- */

function renderInventory() {
    const container = document.getElementById('inventory-container');
    if (!container) return;
    container.innerHTML = '';
    
    const user = getActiveUser();
    const shopItems = getShopItems();
    
    // Фильтруем предметы из инвентаря, которые куплены (имеют ID в user.inventory)
    // Важно: wallpapers исключаем, т.к. для них есть своя отдельная секция выше.
    const myItems = shopItems.filter(item => user.inventory.includes(item.id) && item.category !== 'wallpapers');
    
    if (myItems.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; color:var(--text-secondary); padding: 30px; font-size:12px;">
                Ваш инвентарь пуст. Зайдите в "Магазин", чтобы приобрести товары кастомизации! 🎒
            </div>
        `;
        return;
    }
    
    const catLabels = { avatars: 'Аватарка', frames: 'Рамка', banners: 'Баннер' };
    
    myItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'inventory-item-card card';
        card.style.padding = '12px';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.gap = '8px';
        card.style.alignItems = 'center';
        card.style.border = '1px solid var(--border-color)';
        card.style.borderRadius = '6px';
        
        // Проверяем надета ли вещь
        let isEquipped = false;
        if (item.category === 'avatars' && user.avatar === item.url) isEquipped = true;
        else if (item.category === 'frames' && user.avatarFrame === item.id) isEquipped = true;
        else if (item.category === 'banners' && user.banner === item.url) isEquipped = true;
        
        const actionBtn = isEquipped 
            ? `<button class="btn btn-secondary btn-xs btn-block disabled" disabled>Надето</button>` 
            : `<button class="btn btn-primary btn-xs btn-block" onclick="equipInventoryItem('${item.id}')">Надеть</button>`;
            
        card.innerHTML = `
            <span style="font-size:9px; color:var(--text-secondary); font-family:var(--font-mono); text-transform:uppercase;">${catLabels[item.category]}</span>
            <div style="width:50px; height:50px; border-radius:50%; background-image:url('${item.url}'); background-size:cover; background-position:center; border: 1px solid rgba(255,255,255,0.1);"></div>
            <span style="font-size:11px; font-weight:700; text-align:center; min-height:24px; overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">${item.name}</span>
            ${actionBtn}
        `;
        
        container.appendChild(card);
    });
}

function equipInventoryItem(itemId) {
    const shopItems = getShopItems();
    const item = shopItems.find(i => i.id === itemId);
    if (!item) return;
    
    let users = getUsers();
    const currentUser = getActiveUser();
    let dbUser = users.find(u => u.username === currentUser.username);
    if (!dbUser) return;
    
    // Проверяем уровни кастомизации по ролям/уровням
    // 100 УРВ -> GIF авы; 300 УРВ -> кастомные баннеры;
    // 400 УРВ -> GIF баннеры; 500 УРВ -> уникальные светящиеся рамки.
    // Админы обходят ограничения
    const isAdmin = dbUser.role === 'supreme_admin' || dbUser.role === 'admin';
    const isGif = item.url.includes('.gif') || item.name.includes('GIF');
    
    if (!isAdmin) {
        if (item.category === 'avatars' && isGif && dbUser.level < 100) {
            showNotification('Доступ закрыт', 'Анимированные GIF аватарки открываются со 100 уровня!', '🔒');
            return;
        }
        if (item.category === 'banners' && !isGif && dbUser.level < 300) {
            showNotification('Доступ закрыт', 'Установка кастомных баннеров открывается с 300 уровня!', '🔒');
            return;
        }
        if (item.category === 'banners' && isGif && dbUser.level < 400) {
            showNotification('Доступ закрыт', 'Анимированные GIF баннеры открываются с 400 уровня!', '🔒');
            return;
        }
    }
    
    // Экипируем
    if (item.category === 'avatars') {
        dbUser.avatar = item.url;
    } else if (item.category === 'frames') {
        dbUser.avatarFrame = item.id;
    } else if (item.category === 'banners') {
        dbUser.banner = item.url;
    }
    
    saveUsers(users);
    showNotification('Экипировано', `Вы успешно одели предмет "${item.name}"!`, '🎒');
    
    // Перерисовываем
    updateUserHUD();
    renderSettings();
}
