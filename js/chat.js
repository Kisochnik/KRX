/* KVARON_X (KRX) — ЛОГИКА ДИАЛОГОВ, ДРУЗЕЙ И ГОЛОСОВЫХ СООБЩЕНИЙ (CHAT & FRIENDS SYSTEM) */

let activeFriendsSubtab = 'my';
let friendsSearchQuery = '';
let activeChatId = null;

// Состояние симулятора записи ГС
let voiceRecordingInterval = null;
let voiceRecordSeconds = 0.0;

// Состояние активных воспроизведений ГС (чтобы анимировать волну)
let activeVoicePlays = {}; // chatId_msgIndex -> { interval, currentSec }

/* ==========================================
   1. ИНИЦИАЛИЗАЦИЯ И РЕНДЕР ВКЛАДКИ ДРУЗЕЙ
   ========================================== */

function setFriendsSubtab(subtab) {
    activeFriendsSubtab = subtab;
    
    // Обновляем классы активности кнопок
    document.querySelectorAll('.friends-subtab').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Находим кнопку по тексту или индексу
    const buttons = document.querySelectorAll('.friends-subtab');
    if (subtab === 'my') buttons[0].classList.add('active');
    else if (subtab === 'requests') buttons[1].classList.add('active');
    else if (subtab === 'search') buttons[2].classList.add('active');
    else if (subtab === 'blocked') buttons[3].classList.add('active');

    // Скрываем/показываем панель поиска
    const searchBar = document.getElementById('friends-search-bar');
    if (searchBar) {
        if (subtab === 'search') {
            searchBar.classList.remove('hidden');
        } else {
            searchBar.classList.add('hidden');
        }
    }

    renderFriends();
}

function renderFriends() {
    const container = document.getElementById('friends-container');
    if (!container) return;
    container.innerHTML = '';

    const currentUser = getActiveUser();
    const users = getUsers();

    if (activeFriendsSubtab === 'my') {
        // Мои Друзья
        const friendsList = users.filter(u => currentUser.friends.includes(u.username));
        
        if (friendsList.length === 0) {
            container.innerHTML = `
                <div class="card" style="text-align:center; padding:30px; color:var(--text-secondary); width:100%;">
                    У вас пока нет друзей. Перейдите во вкладку "Поиск", чтобы найти новых людей! 👤
                </div>
            `;
            return;
        }

        friendsList.forEach(fr => {
            const row = createFriendRow(fr, `
                <button class="btn btn-primary btn-sm" onclick="startDirectChat('${fr.username}')">Написать</button>
                <button class="btn btn-secondary btn-sm" onclick="removeFriend('${fr.username}')">Удалить</button>
            `);
            container.appendChild(row);
        });

    } else if (activeFriendsSubtab === 'requests') {
        // Заявки в друзья (Симулированные / Входящие)
        // Будем хранить или симулировать заявки. Если заявок в LS нет, сделаем дефолтные для демонстрации.
        let requests = JSON.parse(localStorage.getItem('krx_friend_requests')) || [];
        
        // Симулируем заявку от Trinity, если у GuestUser нет друзей
        if (currentUser.username === 'GuestUser' && requests.length === 0 && !currentUser.friends.includes('Trinity')) {
            requests = [{ from: 'Trinity', timestamp: Date.now() }];
            localStorage.setItem('krx_friend_requests', JSON.stringify(requests));
        }

        if (requests.length === 0) {
            container.innerHTML = `
                <div class="card" style="text-align:center; padding:30px; color:var(--text-secondary); width:100%;">
                    Нет входящих заявок в друзья. 📪
                </div>
            `;
            return;
        }

        requests.forEach(req => {
            const sender = users.find(u => u.username === req.from) || currentUser;
            const row = createFriendRow(sender, `
                <button class="btn btn-primary btn-sm" onclick="acceptFriendRequest('${req.from}')">Принять</button>
                <button class="btn btn-secondary btn-sm" onclick="rejectFriendRequest('${req.from}')">Отклонить</button>
            `);
            container.appendChild(row);
        });

    } else if (activeFriendsSubtab === 'search') {
        // Поиск пользователей
        let filteredUsers = users.filter(u => u.username !== currentUser.username && !currentUser.friends.includes(u.username));
        
        if (friendsSearchQuery.trim() !== '') {
            filteredUsers = filteredUsers.filter(u => u.username.toLowerCase().includes(friendsSearchQuery.toLowerCase()));
        }

        if (filteredUsers.length === 0) {
            container.innerHTML = `
                <div class="card" style="text-align:center; padding:30px; color:var(--text-secondary); width:100%;">
                    Пользователи не найдены. Попробуйте другой запрос. 🔍
                </div>
            `;
            return;
        }

        filteredUsers.forEach(u => {
            const isBlocked = currentUser.blocked.includes(u.username);
            const actionBtn = isBlocked 
                ? `<span style="color:var(--text-secondary); font-size:12px;">Заблокирован</span>` 
                : `<button class="btn btn-primary btn-sm" onclick="sendFriendRequest('${u.username}')">Добавить</button>`;
            
            const row = createFriendRow(u, actionBtn);
            container.appendChild(row);
        });

    } else if (activeFriendsSubtab === 'blocked') {
        // Черный список
        const blockedList = users.filter(u => currentUser.blocked.includes(u.username));

        if (blockedList.length === 0) {
            container.innerHTML = `
                <div class="card" style="text-align:center; padding:30px; color:var(--text-secondary); width:100%;">
                    Ваш черный список пуст. ⚪
                </div>
            `;
            return;
        }

        blockedList.forEach(u => {
            const row = createFriendRow(u, `
                <button class="btn btn-secondary btn-sm" onclick="unblockUser('${u.username}')">Разблокировать</button>
            `);
            container.appendChild(row);
        });
    }
}

function createFriendRow(user, actionsHtml) {
    const card = document.createElement('div');
    card.className = 'friend-card card';
    card.style.display = 'flex';
    card.style.alignItems = 'center';
    card.style.justifyContent = 'space-between';
    card.style.padding = '15px';
    card.style.marginBottom = '10px';
    card.style.width = '100%';

    // Ранг и галочка
    let badge = '';
    if (user.level >= 500) badge = '<span style="color:#ff3333; margin-left:5px;">🔥</span>';
    else if (user.role === 'supreme_admin') badge = '<span style="color:#ff3333; margin-left:5px;">👑</span>';
    else if (user.role === 'admin') badge = '<span style="color:#ff3333; margin-left:5px;">⚡</span>';
    else if (user.role === 'vip') badge = `<span style="color:${user.nickColor === 'neon-green' ? '#39ff14' : '#bd00ff'}; margin-left:5px;">💎</span>`;

    // Определяем свечение ника
    let nameClass = 'user-name';
    if (user.role === 'supreme_admin') nameClass = 'user-name nick-admin-fire';
    else if (user.role === 'vip' && user.nickColor === 'neon-green') nameClass = 'user-name nick-neon-green';
    else if (user.role === 'vip' && user.nickColor === 'neon-purple') nameClass = 'user-name nick-neon-purple';

    const rankName = getRankName(user.level);
    
    // Симуляция статуса онлайн (Администрация и VIP всегда онлайн)
    const isOnline = user.role !== 'user' || user.username === 'Trinity';

    card.innerHTML = `
        <div style="display:flex; align-items:center; gap:15px;">
            <div class="thread-avatar-wrapper" style="width:50px; height:50px;">
                <img src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}" class="thread-avatar" style="${user.level >= 500 ? 'border: 2px solid #ff3333; box-shadow: 0 0 10px rgba(255, 51, 51, 0.5);' : ''}">
                ${isOnline ? '<div class="status-online"></div>' : ''}
            </div>
            <div>
                <div style="display:flex; align-items:center;">
                    <span class="${nameClass}" style="font-weight:700;">${user.username}</span>
                    ${badge}
                </div>
                <span style="font-size:11px; color:var(--text-secondary); display:block; margin-top:2px;">
                    ${rankName} | Уровень ${user.level}
                </span>
                <span style="font-size:10px; color:var(--text-muted); font-style:italic; display:block; margin-top:1px; max-width:250px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                    "${user.bio || 'Нет описания.'}"
                </span>
            </div>
        </div>
        <div style="display:flex; gap:10px; align-items:center;">
            ${actionsHtml}
        </div>
    `;

    return card;
}

function performUserSearch() {
    const input = document.getElementById('friends-search-input');
    if (input) {
        friendsSearchQuery = input.value;
        renderFriends();
    }
}

/* --- ОПЕРАЦИИ ДРУЗЕЙ --- */
function sendFriendRequest(username) {
    showNotification('Заявка отправлена', `Запрос в друзья для ${username} успешно отправлен!`, '📩');
    addXP(10);
}

function acceptFriendRequest(fromUser) {
    let users = getUsers();
    const currentUser = getActiveUser();
    
    let dbMe = users.find(u => u.username === currentUser.username);
    let dbFriend = users.find(u => u.username === fromUser);
    
    if (dbMe && dbFriend) {
        if (!dbMe.friends.includes(fromUser)) dbMe.friends.push(fromUser);
        if (!dbFriend.friends.includes(currentUser.username)) dbFriend.friends.push(currentUser.username);
        
        saveUsers(users);
        
        // Удаляем из заявок
        let requests = JSON.parse(localStorage.getItem('krx_friend_requests')) || [];
        requests = requests.filter(r => r.from !== fromUser);
        localStorage.setItem('krx_friend_requests', JSON.stringify(requests));
        
        // Добавим уведомление
        const notifs = getNotifications();
        notifs.unshift({
            id: 'nt_' + Date.now(),
            toUser: fromUser,
            fromUser: currentUser.username,
            type: 'friend',
            text: 'принял вашу заявку в друзья! Теперь вы друзья.',
            timestamp: Date.now(),
            read: false
        });
        saveNotifications(notifs);

        showNotification('Новый друг!', `Вы теперь друзья с ${fromUser}!`, '🤝');
        addXP(30);
        updateUserHUD();
        renderFriends();
    }
}

function rejectFriendRequest(fromUser) {
    let requests = JSON.parse(localStorage.getItem('krx_friend_requests')) || [];
    requests = requests.filter(r => r.from !== fromUser);
    localStorage.setItem('krx_friend_requests', JSON.stringify(requests));
    
    showNotification('Заявка отклонена', `Заявка от ${fromUser} отклонена.`, '📪');
    renderFriends();
}

function removeFriend(username) {
    if (!confirm(`Вы действительно хотите удалить ${username} из списка друзей?`)) return;
    
    let users = getUsers();
    const currentUser = getActiveUser();
    
    let dbMe = users.find(u => u.username === currentUser.username);
    let dbFriend = users.find(u => u.username === username);
    
    if (dbMe && dbFriend) {
        dbMe.friends = dbMe.friends.filter(f => f !== username);
        dbFriend.friends = dbFriend.friends.filter(f => f !== currentUser.username);
        
        saveUsers(users);
        showNotification('Удален из друзей', `${username} больше не в вашем списке друзей.`, '💔');
        updateUserHUD();
        renderFriends();
    }
}

function unblockUser(username) {
    let users = getUsers();
    const currentUser = getActiveUser();
    
    let dbMe = users.find(u => u.username === currentUser.username);
    if (dbMe) {
        dbMe.blocked = dbMe.blocked.filter(b => b !== username);
        saveUsers(users);
        showNotification('Разблокирован', `Пользователь ${username} разблокирован.`, '⚪');
        renderFriends();
    }
}

function startDirectChat(username) {
    const currentUser = getActiveUser();
    const chats = getChats();
    
    // Ищем существующий директ
    let chat = chats.find(c => c.type === 'direct' && c.participants.includes(currentUser.username) && c.participants.includes(username));
    
    if (!chat) {
        // Создаем новый чат
        chat = {
            id: 'c_' + Date.now(),
            type: 'direct',
            participants: [currentUser.username, username],
            messages: []
        };
        chats.push(chat);
        saveChats(chats);
    }
    
    activeChatId = chat.id;
    switchTab('chat');
}


/* ==========================================
   2. ЛОГИКА ДИАЛОГОВ И ЧАТОВ (CHAT SYSTEM)
   ========================================== */

function renderChats() {
    renderChatThreads();
    renderActiveChat();
}

// Рендер боковой панели диалогов
function renderChatThreads() {
    const container = document.getElementById('chat-threads-container');
    if (!container) return;
    container.innerHTML = '';
    
    const chats = getChats();
    const currentUser = getActiveUser();
    const users = getUsers();
    
    // Фильтруем чаты с участием текущего юзера
    const myChats = chats.filter(c => c.participants.includes(currentUser.username));
    
    if (myChats.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding: 20px 10px; color:var(--text-secondary); font-size:12px;">
                Нет активных диалогов.
            </div>
        `;
        return;
    }
    
    myChats.forEach(chat => {
        let name = '';
        let avatarUrl = '';
        let isOnline = false;
        
        if (chat.type === 'direct') {
            const otherUsername = chat.participants.find(p => p !== currentUser.username);
            const otherUser = users.find(u => u.username === otherUsername) || currentUser;
            
            name = otherUsername;
            avatarUrl = otherUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
            isOnline = otherUser.role !== 'user' || otherUser.username === 'Trinity';
        } else {
            // Группа
            name = chat.groupName || 'Группа';
            avatarUrl = chat.groupAvatar || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150';
            isOnline = false; // У групп нет общего онлайна
        }
        
        // Превью последнего сообщения
        let snippet = 'Нет сообщений';
        let timeText = '';
        
        if (chat.messages.length > 0) {
            const lastMsg = chat.messages[chat.messages.length - 1];
            if (lastMsg.voiceDuration) {
                snippet = `🎙️ Голосовое сообщение (${Math.round(lastMsg.voiceDuration)}s)`;
            } else if (lastMsg.imageAttachment) {
                snippet = '🖼️ Фотография';
            } else if (lastMsg.videoAttachment) {
                snippet = '🎥 Видео';
            } else if (lastMsg.poll) {
                snippet = `📊 Опрос: "${lastMsg.poll.question}"`;
            } else {
                snippet = `${lastMsg.sender}: ${lastMsg.text}`;
            }
            timeText = new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        
        const row = document.createElement('div');
        row.className = `chat-thread-row ${chat.id === activeChatId ? 'active' : ''}`;
        row.onclick = () => selectChatThread(chat.id);
        
        row.innerHTML = `
            <div class="thread-avatar-wrapper">
                <img src="${avatarUrl}" class="thread-avatar">
                ${isOnline ? '<div class="status-online"></div>' : ''}
            </div>
            <div class="thread-info">
                <div class="thread-header-line">
                    <span class="thread-name">${name}</span>
                    <span class="thread-time">${timeText}</span>
                </div>
                <div class="thread-snippet-line">${snippet}</div>
            </div>
        `;
        
        container.appendChild(row);
    });
}

function selectChatThread(chatId) {
    activeChatId = chatId;
    
    // Закрываем меню вложений и опросов
    const menu = document.getElementById('chat-attach-menu');
    if (menu) menu.classList.add('hidden');
    toggleChatPollCreator(false);
    
    renderChats();
}

// Рендер активной рабочей области чата
function renderActiveChat() {
    const blankState = document.getElementById('chat-blank-state');
    const activeState = document.getElementById('chat-active-state');
    
    if (!blankState || !activeState) return;
    
    if (!activeChatId) {
        blankState.classList.remove('hidden');
        activeState.classList.add('hidden');
        return;
    }
    
    blankState.classList.add('hidden');
    activeState.classList.remove('hidden');
    
    const chats = getChats();
    const chat = chats.find(c => c.id === activeChatId);
    
    if (!chat) {
        activeChatId = null;
        renderActiveChat();
        return;
    }
    
    const currentUser = getActiveUser();
    const users = getUsers();
    
    // Заполняем данные хедера
    const avatarEl = document.getElementById('chat-active-avatar');
    const nameEl = document.getElementById('chat-active-name');
    const statusEl = document.getElementById('chat-active-status');
    const settingsHolder = document.getElementById('chat-group-settings-btn-holder');
    
    if (settingsHolder) settingsHolder.innerHTML = '';
    
    if (chat.type === 'direct') {
        const otherUsername = chat.participants.find(p => p !== currentUser.username);
        const otherUser = users.find(u => u.username === otherUsername) || currentUser;
        
        if (avatarEl) avatarEl.src = otherUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
        if (nameEl) nameEl.textContent = otherUsername;
        
        const isOnline = otherUser.role !== 'user' || otherUser.username === 'Trinity';
        if (statusEl) statusEl.textContent = isOnline ? 'В сети' : 'Был в сети недавно';
    } else {
        // Группа
        if (avatarEl) avatarEl.src = chat.groupAvatar || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150';
        if (nameEl) nameEl.textContent = chat.groupName || 'Группа';
        if (statusEl) statusEl.textContent = `${chat.participants.length} участников`;
        
        // Кнопка настроек группы
        if (settingsHolder) {
            settingsHolder.innerHTML = `<button class="btn btn-secondary btn-xs" onclick="openGroupSettingsModal()">Настройки Группы</button>`;
        }
    }
    
    // Рендерим сообщения
    const messagesContainer = document.getElementById('chat-messages-container');
    if (messagesContainer) {
        messagesContainer.innerHTML = '';
        
        chat.messages.forEach((msg, idx) => {
            const isOutgoing = msg.sender === currentUser.username;
            const bubble = document.createElement('div');
            bubble.className = `chat-message-bubble ${isOutgoing ? 'outgoing' : 'incoming'}`;
            
            // Заголовок отправителя для групп
            const senderHeader = (!isOutgoing && chat.type === 'group') ? `<span class="chat-msg-sender" style="color:var(--vip-purple);">${msg.sender}</span>` : '';
            
            // Медиа-вложение
            let attachmentHtml = '';
            if (msg.imageAttachment) {
                attachmentHtml = `<div class="chat-attachment"><img src="${msg.imageAttachment}"></div>`;
            } else if (msg.videoAttachment) {
                attachmentHtml = `<div class="chat-attachment"><video src="${msg.videoAttachment}" controls></video></div>`;
            }
            
            // Текст или ГС или Опрос
            let contentHtml = '';
            
            if (msg.voiceDuration) {
                // Голосовое сообщение
                contentHtml = renderVoicePlayer(chat.id, idx, msg.voiceDuration);
            } else if (msg.poll) {
                // Опрос
                contentHtml = renderChatPoll(chat.id, idx, msg.poll);
            } else {
                // Обычный текст
                contentHtml = `<div>${msg.text}</div>`;
            }
            
            const timeText = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            bubble.innerHTML = `
                ${senderHeader}
                ${attachmentHtml}
                ${contentHtml}
                <span class="chat-msg-time">${timeText}</span>
            `;
            
            messagesContainer.appendChild(bubble);
        });
        
        // Скроллим вниз
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

/* --- РЕНДЕР И ЛОГИКА ГС --- */
function renderVoicePlayer(chatId, msgIdx, duration) {
    const playKey = `${chatId}_${msgIdx}`;
    const isPlaying = activeVoicePlays[playKey] ? 'playing' : '';
    const icon = activeVoicePlays[playKey] ? '⏸️' : '▶️';
    
    // Форматируем текущую секунду воспроизведения
    let displaySec = '0:00';
    if (activeVoicePlays[playKey]) {
        const remaining = Math.max(0, duration - activeVoicePlays[playKey].currentSec);
        displaySec = formatVoiceTime(remaining);
    } else {
        displaySec = formatVoiceTime(duration);
    }

    return `
        <div class="voice-message-player">
            <button class="voice-play-btn" onclick="togglePlayVoice('${chatId}', ${msgIdx}, ${duration})">
                ${icon}
            </button>
            <div class="voice-wave-visualizer ${isPlaying}">
                <span></span><span></span><span></span><span></span><span></span><span></span>
            </div>
            <span class="voice-duration" id="voice-dur-${playKey}">${displaySec}</span>
        </div>
    `;
}

function formatVoiceTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function togglePlayVoice(chatId, msgIdx, duration) {
    const playKey = `${chatId}_${msgIdx}`;
    
    if (activeVoicePlays[playKey]) {
        // Ставим на паузу
        clearInterval(activeVoicePlays[playKey].interval);
        delete activeVoicePlays[playKey];
        renderActiveChat();
    } else {
        // Выключаем остальные плееры для чистоты
        Object.entries(activeVoicePlays).forEach(([key, val]) => {
            clearInterval(val.interval);
            delete activeVoicePlays[key];
        });
        
        // Запускаем воспроизведение
        activeVoicePlays[playKey] = {
            currentSec: 0.0,
            interval: setInterval(() => {
                activeVoicePlays[playKey].currentSec += 0.2;
                
                const remaining = Math.max(0, duration - activeVoicePlays[playKey].currentSec);
                const timeEl = document.getElementById(`voice-dur-${playKey}`);
                if (timeEl) {
                    timeEl.textContent = formatVoiceTime(remaining);
                }
                
                if (activeVoicePlays[playKey].currentSec >= duration) {
                    // Конец записи
                    clearInterval(activeVoicePlays[playKey].interval);
                    delete activeVoicePlays[playKey];
                    renderActiveChat();
                }
            }, 200)
        };
        
        renderActiveChat();
    }
}

/* --- РЕНДЕР И ЛОГИКА ОПРОСОВ В ЧАТЕ --- */
function renderChatPoll(chatId, msgIdx, poll) {
    const currentUser = getActiveUser();
    let totalVotes = 0;
    poll.options.forEach(opt => totalVotes += opt.votes.length);
    
    // Проверим, голосовал ли уже юзер
    let hasVoted = false;
    poll.options.forEach(opt => {
        if (opt.votes.includes(currentUser.username)) hasVoted = true;
    });

    let html = `<div class="chat-poll-bubble">`;
    html += `<div class="chat-poll-title">📊 ${poll.question}</div>`;
    
    poll.options.forEach((opt, idx) => {
        const percent = totalVotes > 0 ? Math.round((opt.votes.length / totalVotes) * 100) : 0;
        const activeClick = hasVoted ? '' : `onclick="voteChatPoll('${chatId}', ${msgIdx}, ${idx})"`;
        const myVoteBorder = opt.votes.includes(currentUser.username) ? 'style="border: 1px solid currentColor;"' : '';
        
        html += `
            <div class="poll-option-row" ${activeClick} ${myVoteBorder} style="position:relative; margin-bottom:6px; cursor:${hasVoted ? 'default' : 'pointer'};">
                <div class="poll-option-bg" style="width: ${percent}%; position:absolute; top:0; left:0; height:100%; opacity:0.1; border-radius:4px;"></div>
                <div style="display:flex; justify-content:space-between; width:100%; z-index:2; position:relative; padding:6px 10px; font-size:11px;">
                    <span style="font-weight:700;">${opt.text}</span>
                    <span>${percent}% (${opt.votes.length})</span>
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    return html;
}

function voteChatPoll(chatId, msgIdx, optionIdx) {
    const chats = getChats();
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;
    
    const msg = chat.messages[msgIdx];
    if (!msg || !msg.poll) return;
    
    const currentUser = getActiveUser();
    
    // Голосуем
    msg.poll.options[optionIdx].votes.push(currentUser.username);
    saveChats(chats);
    
    renderActiveChat();
    
    addXP(10);
    showNotification('Опрос в чате', 'Ваш голос принят!', '📊');
}


/* --- ОТПРАВКА СООБЩЕНИЙ --- */

function handleChatInputKey(event) {
    if (event.key === 'Enter') {
        sendTextMessage();
    }
}

function sendTextMessage() {
    const input = document.getElementById('chat-message-input');
    if (!input || input.value.trim() === '') return;
    
    const text = input.value.trim();
    
    // Проверим на мут
    const mutes = getMutedUsers();
    const currentUser = getActiveUser();
    const isMuted = mutes.some(m => m.username === currentUser.username);
    
    if (isMuted && currentUser.role !== 'supreme_admin' && currentUser.role !== 'admin') {
        showNotification('Мут', 'Вы замучены администратором и не можете писать в чат!', '🚫');
        return;
    }
    
    const chats = getChats();
    const chat = chats.find(c => c.id === activeChatId);
    
    if (!chat) return;
    
    const newMsg = {
        sender: currentUser.username,
        text: text,
        timestamp: Date.now()
    };
    
    chat.messages.push(newMsg);
    saveChats(chats);
    
    input.value = '';
    renderChats();
    
    // Опыт за общение
    addXP(5);
    
    // Эхо-ответ бота, если пишем в личку не-админу, чтобы чат казался живым
    simulateBotResponse(chat);
}

// Прикрепление файлов
function toggleChatAttachMenu() {
    const menu = document.getElementById('chat-attach-menu');
    if (menu) menu.classList.toggle('hidden');
}

function triggerChatImageUpload() {
    const loader = document.getElementById('chat-image-loader');
    if (loader) loader.click();
    toggleChatAttachMenu();
}

function triggerChatVideoUpload() {
    const loader = document.getElementById('chat-video-loader');
    if (loader) loader.click();
    toggleChatAttachMenu();
}

function sendChatImage(input) {
    if (!input.files || !input.files[0]) return;
    
    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const imgUrl = e.target.result;
        
        const chats = getChats();
        const chat = chats.find(c => c.id === activeChatId);
        if (!chat) return;
        
        chat.messages.push({
            sender: getActiveUser().username,
            text: 'Отправил изображение',
            imageAttachment: imgUrl,
            timestamp: Date.now()
        });
        
        saveChats(chats);
        renderChats();
        addXP(15);
        showNotification('Медиа отправлено', 'Вы прикрепили изображение в чат!', '🖼️');
    };
    
    reader.readAsDataURL(file);
}

function sendChatVideo(input) {
    if (!input.files || !input.files[0]) return;
    
    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const vidUrl = e.target.result;
        
        const chats = getChats();
        const chat = chats.find(c => c.id === activeChatId);
        if (!chat) return;
        
        chat.messages.push({
            sender: getActiveUser().username,
            text: 'Отправил видео',
            videoAttachment: vidUrl,
            timestamp: Date.now()
        });
        
        saveChats(chats);
        renderChats();
        addXP(20);
        showNotification('Медиа отправлено', 'Вы прикрепили видео в чат!', '🎥');
    };
    
    reader.readAsDataURL(file);
}

// Конструктор Опросов
function toggleChatPollCreator(show) {
    const overlay = document.getElementById('chat-poll-builder-overlay');
    if (overlay) {
        if (show) overlay.classList.remove('hidden');
        else overlay.classList.add('hidden');
    }
}

function triggerChatPollCreator() {
    toggleChatPollCreator(true);
    toggleChatAttachMenu();
}

function addChatPollOptionField() {
    const container = document.getElementById('chat-poll-options');
    if (!container) return;
    const num = container.querySelectorAll('input').length + 1;
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'chat-poll-option-input';
    input.placeholder = `Вариант ${num}`;
    container.appendChild(input);
}

function sendChatPoll() {
    const question = document.getElementById('chat-poll-question').value.trim();
    const optionsInputs = document.querySelectorAll('.chat-poll-option-input');
    const options = [];
    
    optionsInputs.forEach(inp => {
        const val = inp.value.trim();
        if (val !== '') {
            options.push({ text: val, votes: [] });
        }
    });
    
    if (question === '' || options.length < 2) {
        alert('Заполните вопрос и минимум 2 варианта ответа!');
        return;
    }
    
    const chats = getChats();
    const chat = chats.find(c => c.id === activeChatId);
    if (!chat) return;
    
    chat.messages.push({
        sender: getActiveUser().username,
        poll: { question: question, options: options },
        timestamp: Date.now()
    });
    
    saveChats(chats);
    
    // Сбрасываем форму
    document.getElementById('chat-poll-question').value = '';
    const container = document.getElementById('chat-poll-options');
    if (container) {
        container.innerHTML = `
            <input type="text" class="chat-poll-option-input" placeholder="Вариант 1">
            <input type="text" class="chat-poll-option-input" placeholder="Вариант 2">
        `;
    }
    
    toggleChatPollCreator(false);
    renderChats();
    addXP(25);
    showNotification('Опрос создан', 'Опрос отправлен в чат!', '📊');
}


/* --- СИМУЛЯЦИЯ ЗАПИСИ ГОЛОСОВЫХ СООБЩЕНИЙ --- */

// Мы переопределим кнопки зажатия на простые клики для удобства тестов в вебе
document.addEventListener('DOMContentLoaded', () => {
    const voiceBtn = document.getElementById('chat-voice-btn');
    if (voiceBtn) {
        voiceBtn.onclick = () => {
            startVoiceRecordSim();
        };
    }
});

function startVoiceRecordSim() {
    const mutes = getMutedUsers();
    const currentUser = getActiveUser();
    const isMuted = mutes.some(m => m.username === currentUser.username);
    
    if (isMuted && currentUser.role !== 'supreme_admin' && currentUser.role !== 'admin') {
        showNotification('Мут', 'Вы замучены администратором и не можете записывать ГС!', '🚫');
        return;
    }

    const overlay = document.getElementById('voice-recording-overlay');
    if (!overlay) return;
    
    overlay.classList.remove('hidden');
    
    voiceRecordSeconds = 0.0;
    const secEl = document.getElementById('voice-timer-sec');
    if (secEl) secEl.textContent = '0.0';
    
    if (voiceRecordingInterval) clearInterval(voiceRecordingInterval);
    
    voiceRecordingInterval = setInterval(() => {
        voiceRecordSeconds += 0.1;
        if (secEl) secEl.textContent = voiceRecordSeconds.toFixed(1);
        
        // Лимит 60 секунд
        if (voiceRecordSeconds >= 60.0) {
            stopAndSendVoiceRecord();
        }
    }, 100);
}

function cancelVoiceRecord() {
    if (voiceRecordingInterval) {
        clearInterval(voiceRecordingInterval);
        voiceRecordingInterval = null;
    }
    const overlay = document.getElementById('voice-recording-overlay');
    if (overlay) overlay.classList.add('hidden');
    showNotification('Запись отменена', 'Голосовое сообщение сброшено.', '🎙️');
}

function stopAndSendVoiceRecord() {
    if (voiceRecordingInterval) {
        clearInterval(voiceRecordingInterval);
        voiceRecordingInterval = null;
    }
    
    const overlay = document.getElementById('voice-recording-overlay');
    if (overlay) overlay.classList.add('hidden');
    
    if (voiceRecordSeconds < 1.0) {
        showNotification('Ошибка записи', 'Слишком короткое голосовое сообщение!', '🎙️');
        return;
    }
    
    const chats = getChats();
    const chat = chats.find(c => c.id === activeChatId);
    if (!chat) return;
    
    chat.messages.push({
        sender: getActiveUser().username,
        voiceDuration: voiceRecordSeconds,
        timestamp: Date.now()
    });
    
    saveChats(chats);
    renderChats();
    addXP(15);
    showNotification('ГС отправлено', `Записано голосовое сообщение на ${voiceRecordSeconds.toFixed(1)}s!`, '🎙️');
    
    simulateBotResponse(chat);
}


/* --- ГРУППОВЫЕ ЧАТЫ (GROUP CHATS CREATOR & SETTINGS) --- */

function openGroupChatCreator() {
    const modal = document.getElementById('group-creator-modal');
    if (!modal) return;
    
    modal.classList.remove('hidden');
    
    // Рендерим список друзей с чекбоксами
    const list = document.getElementById('group-friends-invite-list');
    if (list) {
        list.innerHTML = '';
        const currentUser = getActiveUser();
        const users = getUsers();
        const friendsList = users.filter(u => currentUser.friends.includes(u.username));
        
        if (friendsList.length === 0) {
            list.innerHTML = `<span style="font-size:11px; color:var(--text-secondary);">У вас нет друзей для приглашения.</span>`;
            return;
        }
        
        friendsList.forEach(fr => {
            const div = document.createElement('div');
            div.className = 'group-friend-select-item';
            div.innerHTML = `
                <label class="friend-checkbox-label" for="invite-${fr.username}">
                    <img src="${fr.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}" class="avatar-small" style="width:20px; height:20px; border-radius:50%;">
                    <span>${fr.username}</span>
                </label>
                <input type="checkbox" id="invite-${fr.username}" value="${fr.username}" class="invite-checkbox">
            `;
            list.appendChild(div);
        });
    }
}

function closeGroupChatCreator() {
    const modal = document.getElementById('group-creator-modal');
    if (modal) modal.classList.add('hidden');
}

function createGroupChat() {
    const nameInp = document.getElementById('group-name-input');
    const avaInp = document.getElementById('group-avatar-input');
    
    if (!nameInp || nameInp.value.trim() === '') {
        alert('Введите название группы!');
        return;
    }
    
    const name = nameInp.value.trim();
    const avatar = avaInp.value.trim() || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150';
    
    const selectedFriends = [];
    document.querySelectorAll('.invite-checkbox:checked').forEach(cb => {
        selectedFriends.push(cb.value);
    });
    
    const currentUser = getActiveUser();
    const participants = [currentUser.username, ...selectedFriends];
    
    const chats = getChats();
    const newGroup = {
        id: 'c_grp_' + Date.now(),
        type: 'group',
        groupName: name,
        groupAvatar: avatar,
        participants: participants,
        messages: [
            { sender: 'System', text: `Группа "${name}" успешно создана создателем ${currentUser.username}. Приветствуем всех участников!`, timestamp: Date.now() }
        ]
    };
    
    chats.unshift(newGroup);
    saveChats(chats);
    
    // Чистим поля
    nameInp.value = '';
    avaInp.value = '';
    
    closeGroupChatCreator();
    activeChatId = newGroup.id;
    renderChats();
    
    addXP(40);
    showNotification('Групповой чат', `Создана группа "${name}"!`, '👥');
}

/* Настройки Группы */
function openGroupSettingsModal() {
    const modal = document.getElementById('group-settings-modal');
    const chat = getChats().find(c => c.id === activeChatId);
    
    if (!modal || !chat || chat.type !== 'group') return;
    
    modal.classList.remove('hidden');
    
    const titleEl = document.getElementById('group-settings-title');
    if (titleEl) titleEl.textContent = `Управление: ${chat.groupName}`;
    
    const renameInp = document.getElementById('group-rename-input');
    if (renameInp) renameInp.value = chat.groupName;
    
    // 1. Текущие участники с кнопкой "Удалить"
    const membersList = document.getElementById('group-members-manage-list');
    if (membersList) {
        membersList.innerHTML = '';
        
        chat.participants.forEach(username => {
            const isMe = username === getActiveUser().username;
            const kickBtn = isMe ? '' : `<button class="btn btn-xs btn-secondary" onclick="kickGroupMember('${username}')">Исключить</button>`;
            
            const div = document.createElement('div');
            div.className = 'group-member-manage-item';
            div.innerHTML = `
                <span>${username} ${isMe ? '(Вы)' : ''}</span>
                ${kickBtn}
            `;
            membersList.appendChild(div);
        });
    }
    
    // 2. Добавление новых участников из числа друзей, которых еще нет в группе
    const addList = document.getElementById('group-add-members-list');
    if (addList) {
        addList.innerHTML = '';
        const currentUser = getActiveUser();
        const users = getUsers();
        const friendsList = users.filter(u => currentUser.friends.includes(u.username) && !chat.participants.includes(u.username));
        
        if (friendsList.length === 0) {
            addList.innerHTML = `<span style="font-size:11px; color:var(--text-secondary);">Все ваши друзья уже состоят в группе.</span>`;
            return;
        }
        
        friendsList.forEach(fr => {
            const div = document.createElement('div');
            div.className = 'group-member-manage-item';
            div.innerHTML = `
                <span>${fr.username}</span>
                <button class="btn btn-xs btn-primary" onclick="inviteToGroupChat('${fr.username}')">+</button>
            `;
            addList.appendChild(div);
        });
    }
}

function closeGroupSettingsModal() {
    const modal = document.getElementById('group-settings-modal');
    if (modal) modal.classList.add('hidden');
}

function renameActiveGroup() {
    const inp = document.getElementById('group-rename-input');
    if (!inp || inp.value.trim() === '') return;
    
    const chats = getChats();
    const chat = chats.find(c => c.id === activeChatId);
    if (!chat) return;
    
    const oldName = chat.groupName;
    const newName = inp.value.trim();
    chat.groupName = newName;
    
    chat.messages.push({
        sender: 'System',
        text: `Пользователь ${getActiveUser().username} переименовал группу из "${oldName}" в "${newName}"`,
        timestamp: Date.now()
    });
    
    saveChats(chats);
    renderChats();
    openGroupSettingsModal(); // Перерисовываем модалку настроек
    showNotification('Переименовано', 'Название группы успешно обновлено.', '👥');
}

function kickGroupMember(username) {
    const chats = getChats();
    const chat = chats.find(c => c.id === activeChatId);
    if (!chat) return;
    
    chat.participants = chat.participants.filter(p => p !== username);
    
    chat.messages.push({
        sender: 'System',
        text: `Пользователь ${username} был исключен из группы администратором ${getActiveUser().username}.`,
        timestamp: Date.now()
    });
    
    saveChats(chats);
    renderChats();
    openGroupSettingsModal();
    showNotification('Исключен', `${username} удален из чата.`, '👤');
}

function inviteToGroupChat(username) {
    const chats = getChats();
    const chat = chats.find(c => c.id === activeChatId);
    if (!chat) return;
    
    chat.participants.push(username);
    
    chat.messages.push({
        sender: 'System',
        text: `Пользователь ${username} присоединился к группе по приглашению ${getActiveUser().username}.`,
        timestamp: Date.now()
    });
    
    saveChats(chats);
    renderChats();
    openGroupSettingsModal();
    showNotification('Добавлен', `${username} успешно добавлен в группу.`, '👥');
}

/* Симулированный Эхо-Ответ в личных чатах для живости */
function simulateBotResponse(chat) {
    if (chat.type !== 'direct') return;
    
    const currentUser = getActiveUser();
    const botUser = chat.participants.find(p => p !== currentUser.username);
    
    // Отвечаем только через 2 секунды
    setTimeout(() => {
        // Убеждаемся, что мы все еще сидим в этом же чате
        const chats = getChats();
        const dbChat = chats.find(c => c.id === chat.id);
        if (!dbChat) return;
        
        const responses = [
            "Интересная мысль, надо будет подумать над этим в коде. ⚡",
            "Хм, KVARON_X работает идеально! Заценил новые живые обои у админов?",
            "Я сейчас немного занят прокачкой своего уровня (коплю на огненный ореол), отвечу чуть позже! 🔥",
            "Поразительная скорость работы интерфейса на KRX! Ни единого фриза.",
            "Привет! Да, согласен, отличная кибер-площадка получилась. 😎",
            "Давай обсудим это в общем чате Администрации!"
        ];
        
        const randomText = responses[Math.floor(Math.random() * responses.length)];
        
        dbChat.messages.push({
            sender: botUser,
            text: randomText,
            timestamp: Date.now()
        });
        
        saveChats(chats);
        
        // Перерисовываем если чат все еще открыт
        if (activeChatId === chat.id) {
            renderActiveChat();
        }
        
        // Делаем уведомление всплывашкой
        showNotification(botUser, randomText, '💬');
        
        // Синкаем боковую панель чтобы последнее сообщение обновилось
        renderChatThreads();
    }, 2000);
}
