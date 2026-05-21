/* KVARON_X (KRX) — ЦЕНТРАЛЬНЫЙ ОРГАН МОДЕРАЦИИ И УПРАВЛЕНИЯ (ADMIN & MODERATION SYSTEM) */

// Инициализация жалоб в локальной памяти
function getReports() {
    if (!localStorage.getItem('krx_reports')) {
        const defaultReports = [
            { id: 'rep_1', reporter: 'Neo', targetUser: 'GuestUser', reason: 'Спам глупыми комментариями в главной ленте.', targetId: 'p_2', type: 'post', timestamp: Date.now() - 3600000 },
            { id: 'rep_2', reporter: 'Trinity', targetUser: 'GuestUser', reason: 'Подозрительная активность в чатах, похож на бота.', targetId: 'GuestUser', type: 'user', timestamp: Date.now() - 1800000 }
        ];
        localStorage.setItem('krx_reports', JSON.stringify(defaultReports));
    }
    return JSON.parse(localStorage.getItem('krx_reports'));
}

function saveReports(reps) {
    localStorage.setItem('krx_reports', JSON.stringify(reps));
}


/* ==========================================
   1. ПЕРВИЧНЫЙ РЕНДЕР АДМИН-ПАНЕЛИ (ADMIN VIEW)
   ========================================== */

function renderAdmin() {
    // Убедимся, что обычные юзеры не увидят панель
    const currentUser = getActiveUser();
    if (currentUser.role !== 'supreme_admin' && currentUser.role !== 'admin') {
        switchTab('home');
        return;
    }

    renderAdminStats();
    renderAdminUsers();
    renderAdminReports();
}

// 1. Отрисовка Дашборда Статистики
function renderAdminStats() {
    const users = getUsers();
    const bans = getHardwareBans();
    
    // Подсчет метрик
    const totalUsers = users.length;
    
    // Симулируем, что все VIP и Админы сейчас онлайн
    const onlineUsers = users.filter(u => u.role !== 'user' || u.username === 'Trinity').length;
    
    const bannedUsersCount = bans.length;
    
    const totalEmission = users.reduce((acc, u) => acc + (u.coins || 0), 0);
    
    // Инъекция в HTML
    const totalUsersEl = document.getElementById('admin-total-users');
    const onlineUsersEl = document.getElementById('admin-online-users');
    const bannedUsersEl = document.getElementById('admin-banned-users');
    const totalCurrencyEl = document.getElementById('admin-total-currency');
    
    if (totalUsersEl) totalUsersEl.textContent = totalUsers;
    if (onlineUsersEl) onlineUsersEl.textContent = onlineUsers;
    if (bannedUsersEl) bannedUsersEl.textContent = bannedUsersCount;
    if (totalCurrencyEl) totalCurrencyEl.textContent = `${totalEmission.toLocaleString()} KRX`;
}


// 2. Отрисовка Таблицы Пользователей с Модерацией
function renderAdminUsers() {
    const container = document.getElementById('admin-users-rows');
    if (!container) return;
    container.innerHTML = '';
    
    const users = getUsers();
    const bans = getHardwareBans();
    const mutes = getMutedUsers();
    const currentUser = getActiveUser();
    
    const searchVal = document.getElementById('admin-user-search')?.value.toLowerCase() || '';
    
    // Фильтруем юзеров по поиску
    const filteredUsers = users.filter(u => {
        return u.username.toLowerCase().includes(searchVal) || u.ip.includes(searchVal);
    });
    
    filteredUsers.forEach(u => {
        const tr = document.createElement('tr');
        
        const isBanned = bans.some(b => b.username === u.username || b.ip === u.ip || b.hwid === u.hwid);
        const isMuted = mutes.some(m => m.username === u.username);
        
        // Ролевые значки в таблице
        let roleBadge = '';
        if (u.role === 'supreme_admin') roleBadge = '👑 <span style="color:#ff3333; font-weight:800;">Гл. Админ</span>';
        else if (u.role === 'admin') roleBadge = '⚡ <span style="color:#ff5555;">Админ</span>';
        else if (u.role === 'vip') roleBadge = '💎 <span style="color:var(--vip-purple);">VIP</span>';
        else roleBadge = '👤 Юзер';
        
        // Кнопки управления (Высший админ может все, Админ не может модерировать Высшего Админа)
        const isTargetImmune = u.role === 'supreme_admin';
        const isSelf = u.username === currentUser.username;
        
        let banBtn = '';
        let muteBtn = '';
        let spinCoinsBtn = '';
        let spinLvlBtn = '';
        
        if (isSelf || (currentUser.role === 'admin' && isTargetImmune)) {
            banBtn = `<button class="btn btn-xs btn-secondary disabled" disabled>Иммунитет</button>`;
            muteBtn = '';
            spinCoinsBtn = '';
            spinLvlBtn = '';
        } else {
            // Бан по IP и железу (HWID)
            banBtn = isBanned 
                ? `<button class="btn btn-xs btn-primary" onclick="unbanUser('${u.username}')">Разбанить</button>` 
                : `<button class="btn btn-xs btn-secondary" style="border-color:#ff3333; color:#ff3333;" onclick="banUserIPHWID('${u.username}')">🔒 HWID Бан</button>`;
            
            // Мут пользователя
            muteBtn = isMuted 
                ? `<button class="btn btn-xs btn-secondary" onclick="unmuteUser('${u.username}')">Размутить</button>` 
                : `<button class="btn btn-xs btn-secondary" onclick="muteUser('${u.username}')">🤐 Мут</button>`;
                
            // Накрутка/Спин монет
            spinCoinsBtn = `<button class="btn btn-xs btn-secondary" title="Накрутить монеты" onclick="spinUserCoins('${u.username}')">🪙 Спин</button>`;
            
            // Накрутка уровней
            spinLvlBtn = `<button class="btn btn-xs btn-secondary" title="Накрутить уровень" onclick="spinUserLevel('${u.username}')">⭐ УРВ</button>`;
        }
        
        tr.innerHTML = `
            <td>
                <div style="display:flex; align-items:center; gap:8px;">
                    <img src="${u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}" class="avatar-small" style="width:24px; height:24px; border-radius:50%;">
                    <span style="font-weight:700; ${isBanned ? 'text-decoration:line-through; color:var(--text-secondary);' : ''}">${u.username}</span>
                </div>
            </td>
            <td style="font-family:var(--font-mono); font-size:11px;">${u.ip}</td>
            <td style="font-size:11px;">${roleBadge}</td>
            <td style="font-family:var(--font-mono); font-size:11px;">LVL ${u.level} <span style="color:var(--text-secondary);">(${u.xp} XP)</span></td>
            <td style="font-weight:700;">${u.coins.toLocaleString()} KRX</td>
            <td>
                <div style="display:flex; gap:6px; flex-wrap:wrap;">
                    ${banBtn}
                    ${muteBtn}
                    ${spinCoinsBtn}
                    ${spinLvlBtn}
                </div>
            </td>
        `;
        
        container.appendChild(tr);
    });
}


/* ==========================================
   2. ЖАЛОБЫ И РЕПОРТЫ (REPORTS QUEUE)
   ========================================== */

function renderAdminReports() {
    const queue = document.getElementById('admin-reports-queue');
    if (!queue) return;
    queue.innerHTML = '';
    
    const reports = getReports();
    
    if (reports.length === 0) {
        queue.innerHTML = `
            <div style="text-align:center; padding:15px; color:var(--text-secondary); font-size:11px;">
                В очереди нет жалоб. Чистота! 🧼
            </div>
        `;
        return;
    }
    
    reports.forEach(rep => {
        const item = document.createElement('div');
        item.className = 'report-item card';
        item.style.padding = '12px';
        item.style.marginBottom = '10px';
        item.style.border = '1px solid rgba(255, 51, 51, 0.15)';
        item.style.background = '#0a0a0a';
        
        let typeText = rep.type === 'post' ? 'Пост' : 'Пользователь';
        
        item.innerHTML = `
            <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--text-secondary); margin-bottom:6px;">
                <span>ID жалобы: ${rep.id}</span>
                <span>Отправитель: @${rep.reporter}</span>
            </div>
            <p style="font-size:12px; margin:4px 0;"><span style="color:#ff5555; font-weight:700;">Нарушитель:</span> @${rep.targetUser}</p>
            <p style="font-size:11px; color:var(--text-secondary); margin:4px 0; font-style:italic;">"${rep.reason}"</p>
            
            <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:10px;">
                <button class="btn btn-secondary btn-xs" onclick="resolveReport('${rep.id}', 'ignore')">Игнорировать</button>
                ${rep.type === 'post' ? `<button class="btn btn-secondary btn-xs" style="border-color:#ff3333; color:#ff3333;" onclick="resolveReport('${rep.id}', 'delete_post')">Удалить пост</button>` : ''}
                <button class="btn btn-primary btn-xs" onclick="resolveReport('${rep.id}', 'ban_user')">Забанить</button>
            </div>
        `;
        queue.appendChild(item);
    });
}

function resolveReport(reportId, action) {
    let reports = getReports();
    const rep = reports.find(r => r.id === reportId);
    if (!rep) return;
    
    if (action === 'ignore') {
        reports = reports.filter(r => r.id !== reportId);
        saveReports(reports);
        showNotification('Репорт решен', 'Жалоба проигнорирована.', '🧼');
    } else if (action === 'delete_post') {
        // Удаляем пост
        let posts = getPosts();
        posts = posts.filter(p => p.id !== rep.targetId);
        savePosts(posts);
        
        // Закрываем репорт
        reports = reports.filter(r => r.id !== reportId);
        saveReports(reports);
        
        showNotification('Пост удален', 'Нарушающий пост стерт из ленты.', '🗑️');
        if (window.renderFeed) window.renderFeed();
    } else if (action === 'ban_user') {
        // Баним
        banUserIPHWID(rep.targetUser);
        
        // Закрываем репорт
        reports = reports.filter(r => r.id !== reportId);
        saveReports(reports);
    }
    
    renderAdmin();
}


/* ==========================================
   3. ОПЕРАЦИИ УПРАВЛЕНИЯ И МОДЕРАЦИИ
   ========================================== */

// 1. IP & Hardware (HWID) бан
function banUserIPHWID(username) {
    if (!confirm(`Вы действительно хотите выдать абсолютный HWID/IP бан пользователю ${username}? Его вход будет полностью заблокирован!`)) return;
    
    const users = getUsers();
    const u = users.find(usr => usr.username === username);
    if (!u) return;
    
    let bans = getHardwareBans();
    
    // Добавляем бан
    const newBan = {
        username: u.username,
        ip: u.ip,
        hwid: u.hwid,
        bannedBy: getActiveUser().username,
        timestamp: Date.now()
    };
    
    bans.push(newBan);
    saveHardwareBans(bans);
    
    showNotification('Железо-Бан выдан!', `Пользователь ${username} заблокирован по HWID/IP!`, '🔒');
    addXP(40);
    
    // Обновляем админку
    renderAdmin();
}

function unbanUser(username) {
    let bans = getHardwareBans();
    bans = bans.filter(b => b.username !== username);
    saveHardwareBans(bans);
    
    showNotification('Разбанен', `Пользователь ${username} разблокирован.`, '🔓');
    renderAdmin();
}

// 2. Мут в чатах
function muteUser(username) {
    let mutes = getMutedUsers();
    if (mutes.some(m => m.username === username)) return;
    
    mutes.push({
        username: username,
        mutedBy: getActiveUser().username,
        timestamp: Date.now()
    });
    saveMutedUsers(mutes);
    
    showNotification('Выдан Мут', `Пользователь ${username} теперь не может писать сообщения.`, '🚫');
    renderAdmin();
}

function unmuteUser(username) {
    let mutes = getMutedUsers();
    mutes = mutes.filter(m => m.username !== username);
    saveMutedUsers(mutes);
    
    showNotification('Снят Мут', `Пользователь ${username} снова может общаться в чатах.`, '🔊');
    renderAdmin();
}

// 3. Накрутка валюты
function spinUserCoins(username) {
    const amountStr = prompt(`Введите сумму KRX для зачисления/вычитания у ${username} (например, 5000 или -2000):`);
    const amount = parseInt(amountStr);
    if (isNaN(amount) || amount === 0) return;
    
    let users = getUsers();
    let u = users.find(usr => usr.username === username);
    if (!u) return;
    
    u.coins = Math.max(0, u.coins + amount);
    saveUsers(users);
    
    // Добавим в историю транзакций
    const txs = getTransactions();
    txs.unshift({
        id: 'TX-SPIN-' + Math.floor(Math.random() * 9000 + 1000),
        user: u.username,
        type: `Корректировка баланса Администрацией`,
        amount: amount,
        timestamp: Date.now(),
        status: 'Завершено'
    });
    saveTransactions(txs);
    
    showNotification('Эмиссия KRX', `Баланс пользователя ${username} изменен на ${amount} KRX!`, '🪙');
    renderAdmin();
}

// 4. Накрутка уровней
function spinUserLevel(username) {
    const lvlStr = prompt(`Введите количество уровней для добавления/вычитания у ${username} (например, 50 или -10):`);
    const levels = parseInt(lvlStr);
    if (isNaN(levels) || levels === 0) return;
    
    let users = getUsers();
    let u = users.find(usr => usr.username === username);
    if (!u) return;
    
    u.level = Math.max(1, Math.min(500, u.level + levels));
    u.xp = 0; // Сброс XP на новом уровне
    saveUsers(users);
    
    showNotification('Уровень Спин', `Уровень пользователя ${username} изменен на ${u.level}!`, '⭐');
    renderAdmin();
}


/* ==========================================
   4. ДОБАВЛЕНИЕ НОВЫХ ТОВАРОВ В МАГАЗИН
   ========================================== */

function createNewShopItem() {
    const catSelect = document.getElementById('admin-item-cat');
    const nameInp = document.getElementById('admin-item-name');
    const urlInp = document.getElementById('admin-item-url');
    const priceInp = document.getElementById('admin-item-price');
    const discountInp = document.getElementById('admin-item-discount');
    const timerInp = document.getElementById('admin-item-timer');
    
    if (!nameInp || !priceInp || nameInp.value.trim() === '' || priceInp.value.trim() === '') {
        alert('Заполните обязательные поля: Название и Цена!');
        return;
    }
    
    const name = nameInp.value.trim();
    const category = catSelect.value;
    const url = urlInp.value.trim() || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=150';
    const price = parseInt(priceInp.value);
    const discount = parseInt(discountInp.value) || 0;
    const timerMinutes = parseInt(timerInp.value) || 0;
    
    if (price <= 0) {
        alert('Цена должна быть положительным числом!');
        return;
    }
    
    const items = getShopItems();
    
    // Создаем товар
    const newItem = {
        id: category.substring(0, 2) + '_custom_' + Date.now(),
        name: name,
        category: category,
        url: url,
        price: price,
        discount: Math.min(100, Math.max(0, discount)),
        timer: timerMinutes * 60, // переводим минуты в секунды для тикера
        minLvl: 1
    };
    
    items.unshift(newItem);
    saveShopItems(items);
    
    // Чистим поля ввода
    nameInp.value = '';
    urlInp.value = '';
    priceInp.value = '';
    discountInp.value = '';
    timerInp.value = '';
    
    showNotification('Товар добавлен!', `Новый товар "${name}" успешно загружен в Магазин!`, '🛍️');
    
    // Даем опыт админу за труд
    addXP(50);
    
    // Обновляем виды
    if (activeTab === 'shop' && window.renderShop) window.renderShop();
    renderAdmin();
}
