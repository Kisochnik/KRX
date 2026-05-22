/* KVARON_X (KRX) — ЛЕНТА ПОСТОВ, ИСТОРИИ И РИЛСЫ (FEED, STORIES & REALS SYSTEM) */

let activeFeedFilter = 'popular';
let activeStories = [];
let activeStoryIndex = 0;
let storyProgressInterval = null;
let storyProgressPercent = 0;

// Дефолтные Истории
const DEFAULT_STORIES = [
    { id: 'st_1', author: 'Kvarden', text: '👑 Создаем великое обновление KVARON_X! Готовы к премиум-функциям?', bg: KRX_ASSETS.storyRed, audience: 'public', timestamp: Date.now() },
    { id: 'st_2', author: 'Neo', text: '💎 Взламываю магазин... Нашел кучу крутых анимированных аватарок!', bg: KRX_ASSETS.storyPurple, audience: 'vip', timestamp: Date.now() },
    { id: 'st_3', author: 'Trinity', text: '🏍️ Скорость — это свобода. Кто со мной в кибер-заезд?', bg: KRX_ASSETS.storyGreen, audience: 'close', timestamp: Date.now() }
];

// Дефолтные Рилсы (Reals)
const DEFAULT_REALS = [
    { id: 'rl_1', author: 'Kvarden', desc: '👑 Презентация Огненного Ореола на 500 УРВ! Это предел величия.', bg: KRX_ASSETS.realAdmin, likes: 1420, comments: 24, liked: false },
    { id: 'rl_2', author: 'Neo', desc: '💎 Загружаю Reals в Ультра HD 4K! VIP привилегии рулят.', bg: KRX_ASSETS.realVip, likes: 890, comments: 12, liked: false },
    { id: 'rl_3', author: 'KVARON_X', desc: '⚡ Очередной день модерирования постов. Нарушители, берегитесь!', bg: KRX_ASSETS.realCircuit, likes: 2100, comments: 85, liked: false }
];

// Загрузка историй
function getStories() {
    if (!localStorage.getItem('krx_stories')) {
        localStorage.setItem('krx_stories', JSON.stringify(DEFAULT_STORIES));
    }
    const stories = JSON.parse(localStorage.getItem('krx_stories'));
    let changed = false;
    const fallbackByAudience = { public: KRX_ASSETS.storyRed, vip: KRX_ASSETS.storyPurple, close: KRX_ASSETS.storyGreen };
    stories.forEach(story => {
        if (!story.bg || story.bg.includes('images.unsplash.com')) {
            story.bg = fallbackByAudience[story.audience] || KRX_ASSETS.storyRed;
            changed = true;
        }
    });
    if (changed) saveStories(stories);
    return stories;
}

function saveStories(stories) {
    localStorage.setItem('krx_stories', JSON.stringify(stories));
}

// Загрузка рилсов
function getReals() {
    if (!localStorage.getItem('krx_reals')) {
        localStorage.setItem('krx_reals', JSON.stringify(DEFAULT_REALS));
    }
    const reals = JSON.parse(localStorage.getItem('krx_reals'));
    let changed = false;
    const fallbackByAuthor = { Kvarden: KRX_ASSETS.realAdmin, Neo: KRX_ASSETS.realVip, KVARON_X: KRX_ASSETS.realCircuit };
    reals.forEach(real => {
        if (!real.bg || real.bg.includes('images.unsplash.com')) {
            real.bg = fallbackByAuthor[real.author] || KRX_ASSETS.realCircuit;
            changed = true;
        }
    });
    if (changed) saveReals(reals);
    return reals;
}

function saveReals(reals) {
    localStorage.setItem('krx_reals', JSON.stringify(reals));
}

/* --- ИСТОРИИ (STORIES) --- */
function renderStories() {
    const track = document.getElementById('stories-track');
    if (!track) return;
    
    // Оставляем только кнопку "Добавить"
    const addCard = document.getElementById('add-story-btn');
    track.innerHTML = '';
    if (addCard) track.appendChild(addCard);
    
    // Вешаем клик на добавление
    addCard.onclick = () => createStoryPrompt();

    const stories = getStories();
    const users = getUsers();
    const currentUser = getActiveUser();

    stories.forEach((st, idx) => {
        // Проверка прав просмотра аудитории историй
        if (st.audience === 'vip' && currentUser.role !== 'supreme_admin' && currentUser.role !== 'admin' && currentUser.role !== 'vip') {
            return; // Скрываем VIP истории для обычных юзеров
        }
        if (st.audience === 'close' && st.author !== currentUser.username && !isAdminUser(currentUser) && !(currentUser.friends || []).includes(st.author)) {
            return;
        }

        const authorUser = users.find(u => u.username === st.author) || currentUser;
        
        const card = document.createElement('div');
        card.className = `story-card ${st.audience}`;
        card.innerHTML = `
            <div class="story-avatar-holder">
                <img src="${authorUser.avatar || KRX_ASSETS.avatarGuest}" class="story-avatar">
            </div>
            <span class="story-name">${st.author}</span>
        `;
        
        card.onclick = () => openStoryViewer(idx);
        track.appendChild(card);
    });
}

// Конструктор создания сторис
function createStoryPrompt() {
    const currentUser = getActiveUser();
    
    const text = prompt('Введите текст для вашей Истории:');
    if (!text || text.trim() === '') return;
    
    let audience = 'public';
    if (currentUser.role === 'vip') {
        const choice = confirm('Опубликовать историю «Только для близких»? (Отмена = Для всех)');
        audience = choice ? 'close' : 'public';
    } else if (currentUser.role === 'supreme_admin' || currentUser.role === 'admin') {
        const type = prompt('Выберите аудиторию: 1 - Для всех, 2 - Для близких, 3 - Только для VIP');
        if (type === '2') audience = 'close';
        else if (type === '3') audience = 'vip';
    }
    
    const stories = getStories();
    const newStory = {
        id: 'st_' + Date.now(),
        author: currentUser.username,
        text: text,
        bg: KRX_ASSETS.storyRed,
        audience: audience,
        timestamp: Date.now()
    };
    
    stories.unshift(newStory);
    saveStories(stories);
    renderStories();
    
    // Даем опыт за активность
    addXP(20);
    showNotification('История создана', 'Вы успешно опубликовали историю!', '📸');
}

// Просмотр историй
function openStoryViewer(startIndex) {
    activeStories = getStories().filter(st => {
        const currentUser = getActiveUser();
        if (st.audience === 'vip' && currentUser.role !== 'supreme_admin' && currentUser.role !== 'admin' && currentUser.role !== 'vip') {
            return false;
        }
        if (st.audience === 'close' && st.author !== currentUser.username && !isAdminUser(currentUser) && !(currentUser.friends || []).includes(st.author)) {
            return false;
        }
        return true;
    });
    
    if (activeStories.length === 0) return;
    
    activeStoryIndex = startIndex;
    
    // Создаем модалку во весь экран
    const viewer = document.createElement('div');
    viewer.className = 'story-viewer-modal';
    viewer.id = 'story-viewer-modal';
    document.body.appendChild(viewer);
    
    renderActiveStoryInModal();
}

function renderActiveStoryInModal() {
    const viewer = document.getElementById('story-viewer-modal');
    if (!viewer) return;
    
    const st = activeStories[activeStoryIndex];
    const users = getUsers();
    const authorUser = users.find(u => u.username === st.author) || getActiveUser();
    
    // Заполняем разметку
    viewer.innerHTML = `
        <div class="story-viewer-content">
            <!-- Шапка -->
            <div class="story-viewer-header">
                <div class="story-progress-bar-container" id="story-progress-bars">
                    <!-- Заполнятся динамически -->
                </div>
                <div class="story-user-info">
                    <div class="story-viewer-user">
                        <img src="${authorUser.avatar || KRX_ASSETS.avatarGuest}" class="avatar-small">
                        <span style="font-weight:700;">${st.author}</span>
                        ${st.audience !== 'public' ? `<span class="story-badge-type ${st.audience}">${st.audience === 'vip' ? 'VIP ONLY' : 'БЛИЗКИЕ'}</span>` : ''}
                    </div>
                    <button class="story-close-btn" onclick="closeStoryViewer()">✖</button>
                </div>
            </div>
            
            <!-- Тело -->
            <div class="story-viewer-body" style="background-image: url('${st.bg}')">
                <div class="story-viewer-text-overlay">${st.text}</div>
            </div>
            
            <!-- Кнопки навигации -->
            <button class="story-nav-btn prev" onclick="navigateStory(-1)">◀</button>
            <button class="story-nav-btn next" onclick="navigateStory(1)">▶</button>
        </div>
    `;
    
    // Создаем полоски прогресса
    const progressContainer = document.getElementById('story-progress-bars');
    progressContainer.innerHTML = '';
    
    for (let i = 0; i < activeStories.length; i++) {
        const bar = document.createElement('div');
        bar.className = 'story-progress-bar';
        const fill = document.createElement('div');
        fill.className = 'story-progress-bar-fill';
        
        if (i < activeStoryIndex) {
            fill.style.width = '100%';
        } else if (i === activeStoryIndex) {
            fill.id = 'story-active-progress-fill';
            fill.style.width = '0%';
        } else {
            fill.style.width = '0%';
        }
        
        bar.appendChild(fill);
        progressContainer.appendChild(bar);
    }
    
    // Запускаем тикер таймера (5 секунд = 5000мс, шагами по 100мс)
    if (storyProgressInterval) clearInterval(storyProgressInterval);
    storyProgressPercent = 0;
    
    storyProgressInterval = setInterval(() => {
        storyProgressPercent += 2; // +100мс от 5000мс = 2%
        const activeFill = document.getElementById('story-active-progress-fill');
        if (activeFill) {
            activeFill.style.width = `${storyProgressPercent}%`;
        }
        
        if (storyProgressPercent >= 100) {
            navigateStory(1); // К следующей
        }
    }, 100);
}

function navigateStory(direction) {
    activeStoryIndex += direction;
    
    if (activeStoryIndex >= activeStories.length || activeStoryIndex < 0) {
        closeStoryViewer();
    } else {
        renderActiveStoryInModal();
    }
}

function closeStoryViewer() {
    if (storyProgressInterval) {
        clearInterval(storyProgressInterval);
        storyProgressInterval = null;
    }
    const viewer = document.getElementById('story-viewer-modal');
    if (viewer) viewer.remove();
}


/* --- ЛЕНТА ПОСТОВ (POSTS FEED) --- */
function renderFeed() {
    const container = document.getElementById('posts-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Обновим аватарку в поле создания
    const activeAvatar = document.getElementById('post-creator-avatar');
    if (activeAvatar) {
        activeAvatar.src = getActiveUser().avatar || KRX_ASSETS.avatarGuest;
    }
    
    let posts = getPosts();
    const currentUser = getActiveUser();
    
    // Сортировка/Фильтрация
    if (activeFeedFilter === 'popular') {
        // Сортируем по популярности (лайки + коменты + репосты)
        posts.sort((a, b) => (b.likes.length + b.comments.length) - (a.likes.length + a.comments.length));
    } else {
        // Подписки: только друзья
        posts = posts.filter(p => currentUser.friends.includes(p.author) || p.author === currentUser.username);
        // Свежие сверху
        posts.sort((a, b) => b.timestamp - a.timestamp);
    }
    
    if (posts.length === 0) {
        container.innerHTML = `
            <div class="card" style="text-align:center; padding: 40px; color: var(--text-secondary);">
                Пока нет публикаций в этой категории. Подпишитесь на друзей!
            </div>
        `;
        return;
    }

    const users = getUsers();
    
    posts.forEach(post => {
        const authorUser = users.find(u => u.username === post.author) || currentUser;
        const isLiked = post.likes.includes(currentUser.username);
        
        const card = document.createElement('div');
        card.className = 'post-card card';
        card.id = `post-${post.id}`;
        
        // Кнопка удаления поста для автора
        const showDelete = post.author === currentUser.username || currentUser.role === 'supreme_admin';
        const deleteBtn = showDelete ? `<button class="btn-icon" onclick="deletePost('${post.id}')" title="Удалить пост">🗑️</button>` : '';

        // Отрендерим опрос, если есть
        let pollHtml = '';
        if (post.poll) {
            pollHtml = renderPostPoll(post);
        }

        const authorBadge = getUserBadgeMarkup(authorUser);
        const authorNickClass = getUserNickClass(authorUser);

        card.innerHTML = `
            <div class="post-header">
                <div class="post-author-info">
                    <img src="${authorUser.avatar || KRX_ASSETS.avatarGuest}" class="avatar-small">
                    <div class="post-author-details">
                        <div class="post-author-name-wrapper">
                            <span class="post-author-name ${authorNickClass}">${post.author}</span>
                            ${authorBadge}
                            <span class="post-author-level">LVL ${authorUser.level}</span>
                        </div>
                        <span class="post-time">${new Date(post.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                </div>
                ${deleteBtn}
            </div>
            
            <div class="post-content">${post.content}</div>
            
            ${pollHtml}
            
            <div class="post-footer">
                <button class="post-action-btn ${isLiked ? 'liked' : ''}" onclick="toggleLikePost('${post.id}')">
                    <span>${isLiked ? '❤️' : '🤍'}</span>
                    <span>${post.likes.length} Удивлений</span>
                </button>
                <button class="post-action-btn" onclick="toggleCommentsSection('${post.id}')">
                    <span>💬</span>
                    <span>${post.comments.length} Ответов</span>
                </button>
                <button class="post-action-btn" onclick="sharePost('${post.id}')">
                    <span>↗</span>
                    <span>${post.shares || 0} Поделиться</span>
                </button>
            </div>
            
            <!-- Секция комментариев (скрыта по умолчанию) -->
            <div class="post-comments-section hidden" id="comments-${post.id}">
                <div class="comments-list" id="comments-list-${post.id}">
                    <!-- Комменты -->
                </div>
                <div class="comment-input-bar">
                    <input type="text" id="comment-input-${post.id}" placeholder="Написать ответ...">
                    <button class="btn btn-secondary btn-sm" onclick="addCommentToPost('${post.id}')">Ответить</button>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });

    // Рендерим Reals в боковой панели
    renderReals();
    // Рендерим Истории
    renderStories();
}

// Отрендерить Опрос
function renderPostPoll(post) {
    const currentUser = getActiveUser();
    let totalVotes = 0;
    post.poll.options.forEach(opt => totalVotes += opt.votes.length);
    
    // Проверим, голосовал ли уже юзер
    let hasVoted = false;
    post.poll.options.forEach(opt => {
        if (opt.votes.includes(currentUser.username)) hasVoted = true;
    });

    let html = `<div class="post-poll-card">`;
    html += `<div class="poll-question">📊 ${post.poll.question}</div>`;
    
    post.poll.options.forEach((opt, idx) => {
        const percent = totalVotes > 0 ? Math.round((opt.votes.length / totalVotes) * 100) : 0;
        const activeClick = hasVoted ? '' : `onclick="votePostPoll('${post.id}', ${idx})"`;
        const myVoteClass = opt.votes.includes(currentUser.username) ? 'style="border-color:#fff"' : '';
        
        html += `
            <div class="poll-option-row" ${activeClick} ${myVoteClass}>
                <div class="poll-option-bg" style="width: ${percent}%;"></div>
                <span class="poll-option-text">${opt.text}</span>
                <span class="poll-option-percent">${percent}% (${opt.votes.length})</span>
            </div>
        `;
    });
    
    html += `</div>`;
    return html;
}

// Голосование в опросе
function votePostPoll(postId, optionIdx) {
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post || !post.poll) return;
    
    const currentUser = getActiveUser();
    
    // Голосуем
    post.poll.options[optionIdx].votes.push(currentUser.username);
    savePosts(posts);
    
    // Перерисовываем ленту
    renderFeed();
    
    // Даем опыт
    addXP(15);
    showNotification('Опрос', 'Ваш голос учтен!', '📊');
}

// Управление фильтром популярное/подписки
function setFeedFilter(filter) {
    activeFeedFilter = filter;
    document.getElementById('feed-filter-popular').classList.remove('active');
    document.getElementById('feed-filter-subs').classList.remove('active');
    
    document.getElementById(`feed-filter-${filter}`).classList.add('active');
    renderFeed();
}

// Показ/скрытие секции комментариев
function toggleCommentsSection(postId) {
    const section = document.getElementById(`comments-${postId}`);
    if (!section) return;
    
    const isHidden = section.classList.toggle('hidden');
    
    if (!isHidden) {
        renderCommentsList(postId);
    }
}

function renderCommentsList(postId) {
    const list = document.getElementById(`comments-list-${postId}`);
    if (!list) return;
    list.innerHTML = '';
    
    const post = getPosts().find(p => p.id === postId);
    if (!post) return;
    
    post.comments.forEach((comm, commIdx) => {
        const card = document.createElement('div');
        card.className = 'comment-card';
        
        let reactionsHtml = '';
        if (comm.reactions) {
            Object.entries(comm.reactions).forEach(([emoji, count]) => {
                reactionsHtml += `<button class="comment-react-btn" onclick="reactComment('${postId}', ${commIdx}, '${emoji}')">${emoji} ${count}</button>`;
            });
        }
        
        // Быстрые кнопки реакций
        const addReactBtn = `
            <button class="comment-react-btn" onclick="reactComment('${postId}', ${commIdx}, '🔥')">🔥</button>
            <button class="comment-react-btn" onclick="reactComment('${postId}', ${commIdx}, '👍')">👍</button>
            <button class="comment-react-btn" onclick="reactComment('${postId}', ${commIdx}, '😮')">😮</button>
        `;

        card.innerHTML = `
            <div class="comment-body" style="width:100%;">
                <span class="comment-author-name">${comm.author}</span>
                <p class="comment-content">${comm.content}</p>
                <div class="comment-actions">
                    ${reactionsHtml}
                    ${addReactBtn}
                </div>
            </div>
        `;
        list.appendChild(card);
    });
}

function addCommentToPost(postId) {
    const input = document.getElementById(`comment-input-${postId}`);
    if (!input || input.value.trim() === '') return;
    
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const currentUser = getActiveUser();
    
    const newComment = {
        author: currentUser.username,
        content: input.value.trim(),
        reactions: {}
    };
    
    post.comments.push(newComment);
    savePosts(posts);
    
    // Создаем уведомление автору
    if (post.author !== currentUser.username) {
        const notifs = getNotifications();
        notifs.unshift({
            id: 'nt_' + Date.now(),
            toUser: post.author,
            fromUser: currentUser.username,
            type: 'comment',
            text: `ответил на ваш пост: "${input.value.trim().substring(0, 20)}..."`,
            timestamp: Date.now(),
            read: false
        });
        saveNotifications(notifs);
    }

    input.value = '';
    renderCommentsList(postId);
    
    // Запускаем перерендер футтера карточки (кол-во комментов)
    renderFeed();
    
    // +10 XP
    addXP(10);
}

// Реакция на коммент
function reactComment(postId, commIdx, emoji) {
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const comm = post.comments[commIdx];
    if (!comm.reactions) comm.reactions = {};
    
    if (comm.reactions[emoji]) {
        comm.reactions[emoji] += 1;
    } else {
        comm.reactions[emoji] = 1;
    }
    
    savePosts(posts);
    renderCommentsList(postId);
    addXP(5);
}

// Лайк поста
function toggleLikePost(postId) {
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const currentUser = getActiveUser();
    const idx = post.likes.indexOf(currentUser.username);
    
    let liked = false;
    if (idx > -1) {
        post.likes.splice(idx, 1);
    } else {
        post.likes.push(currentUser.username);
        liked = true;
        
        // Уведомление автору
        if (post.author !== currentUser.username) {
            const notifs = getNotifications();
            notifs.unshift({
                id: 'nt_' + Date.now(),
                toUser: post.author,
                fromUser: currentUser.username,
                type: 'like',
                text: 'выразил удивление вашему посту.',
                timestamp: Date.now(),
                read: false
            });
            saveNotifications(notifs);
        }
        
        addXP(10); // За лайк
    }
    
    savePosts(posts);
    renderFeed();
}

function sharePost(postId) {
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    post.shares = (post.shares || 0) + 1;
    savePosts(posts);
    addXP(12);
    showNotification('Публикация', 'Ссылка на пост условно скопирована и отправлена друзьям.', '↗');
    renderFeed();
}

// Конструктор опроса в ленте
function togglePollBuilder(show) {
    const builder = document.getElementById('post-poll-builder');
    if (builder) {
        if (show) builder.classList.remove('hidden');
        else builder.classList.add('hidden');
    }
}

function addPollOptionField() {
    const container = document.getElementById('poll-options-container');
    if (!container) return;
    const num = container.querySelectorAll('input').length + 1;
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'poll-option-input';
    input.placeholder = `Вариант ${num}`;
    container.appendChild(input);
}

// Публикация нового поста
function createPost() {
    const textEl = document.getElementById('post-input');
    if (!textEl) return;
    const text = textEl.value.trim();
    
    // Проверим наличие опроса
    const pollBuilder = document.getElementById('post-poll-builder');
    let poll = null;
    
    if (pollBuilder && !pollBuilder.classList.contains('hidden')) {
        const question = document.getElementById('poll-question-input').value.trim();
        const optionsEls = pollBuilder.querySelectorAll('.poll-option-input');
        const options = [];
        
        optionsEls.forEach(el => {
            const val = el.value.trim();
            if (val !== '') {
                options.push({ text: val, votes: [] });
            }
        });
        
        if (question !== '' && options.length >= 2) {
            poll = { question: question, options: options, id: 'poll_' + Date.now() };
        }
    }

    if (text === '' && !poll) return;

    const posts = getPosts();
    const currentUser = getActiveUser();
    
    const newPost = {
        id: 'p_' + Date.now(),
        author: currentUser.username,
        content: text,
        likes: [],
        comments: [],
        shares: 0,
        poll: poll,
        timestamp: Date.now()
    };
    
    posts.unshift(newPost);
    savePosts(posts);
    
    // Сбрасываем форму
    textEl.value = '';
    document.getElementById('poll-question-input').value = '';
    const optionsContainer = document.getElementById('poll-options-container');
    if (optionsContainer) {
        optionsContainer.innerHTML = `
            <input type="text" class="poll-option-input" placeholder="Вариант 1">
            <input type="text" class="poll-option-input" placeholder="Вариант 2">
        `;
    }
    togglePollBuilder(false);
    
    renderFeed();
    
    addXP(30);
    showNotification('Пост опубликован', 'Пост добавлен в общую ленту!', '📝');
}

function deletePost(postId) {
    if (!confirm('Вы действительно хотите удалить эту публикацию?')) return;
    let posts = getPosts();
    posts = posts.filter(p => p.id !== postId);
    savePosts(posts);
    renderFeed();
    showNotification('Удалено', 'Ваш пост успешно удален.', '🗑️');
}


/* --- КОЛОНКА REALS (TIKTOK STYLE) --- */
function renderReals() {
    const container = document.getElementById('reals-container');
    if (!container) return;
    
    container.innerHTML = '';
    const reals = getReals();
    const currentUser = getActiveUser();
    const users = getUsers();

    reals.forEach(rl => {
        const author = users.find(user => user.username === rl.author) || currentUser;
        const canUploadUltra = author.role === 'vip' || isAdminUser(author);
        const card = document.createElement('div');
        card.className = 'real-video-card';
        card.innerHTML = `
            <!-- VIP HD Indicator -->
            ${canUploadUltra ? '<div class="real-badge-vip">Ultra HD 4K</div>' : ''}
            
            <div class="real-visual-placeholder" style="background-image: url('${rl.bg}')">
                <span class="real-play-icon">▶</span>
            </div>
            
            <!-- Описание оверлей -->
            <div class="real-overlay-details">
                <div class="real-author">
                    <img src="${author.avatar || KRX_ASSETS.avatarGuest}" class="avatar-small" style="width:24px; height:24px;">
                    <span class="${getUserNickClass(author)}">@${rl.author}</span>
                    ${getUserBadgeMarkup(author)}
                </div>
                <p class="real-desc">${rl.desc}</p>
            </div>
            
            <!-- Кнопки действий -->
            <div class="real-actions-bar">
                <div style="display:flex; flex-direction:column; align-items:center;">
                    <button class="real-act-btn ${rl.liked ? 'liked' : ''}" onclick="event.stopPropagation(); toggleLikeReal('${rl.id}')">❤️</button>
                    <span class="real-act-label">${rl.likes}</span>
                </div>
                <div style="display:flex; flex-direction:column; align-items:center;">
                    <button class="real-act-btn" onclick="event.stopPropagation(); alert('Комментарии к Reals в разработке!')">💬</button>
                    <span class="real-act-label">${rl.comments}</span>
                </div>
            </div>
        `;
        
        // Обработчик Двойного Клика для сердечек
        card.addEventListener('dblclick', (e) => {
            spawnRealHeart(card, e);
            likeRealByDblClick(rl.id);
        });

        container.appendChild(card);
    });
}

function likeRealByDblClick(realId) {
    const reals = getReals();
    const rl = reals.find(r => r.id === realId);
    if (rl && !rl.liked) {
        rl.liked = true;
        rl.likes += 1;
        saveReals(reals);
        renderReals();
        addXP(10);
    }
}

function toggleLikeReal(realId) {
    const reals = getReals();
    const rl = reals.find(r => r.id === realId);
    if (!rl) return;
    
    if (rl.liked) {
        rl.liked = false;
        rl.likes -= 1;
    } else {
        rl.liked = true;
        rl.likes += 1;
        addXP(10);
    }
    
    saveReals(reals);
    renderReals();
}

// Эффект вылетающих сердечек при двойном тапе
function spawnRealHeart(card, event) {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const heart = document.createElement('span');
    heart.className = 'love-heart-fly';
    heart.innerHTML = '❤️';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    
    card.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 700);
}


/* --- ЛЕНТА НОВОСТЕЙ ОБНОВЛЕНИЯ (NEWS) --- */
function renderNews() {
    const container = document.getElementById('news-container');
    const creator = document.getElementById('admin-news-creator');
    
    if (!container) return;
    container.innerHTML = '';
    
    const currentUser = getActiveUser();
    const isNewsPoster = isAdminUser(currentUser);
    
    // Форма видна только админу KVARON_X или Высшей Администрации
    if (creator) {
        if (isNewsPoster) creator.classList.remove('hidden');
        else creator.classList.add('hidden');
    }

    const news = getNews();
    
    news.forEach(ns => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.borderColor = 'rgba(255, 51, 51, 0.15)'; // Легкая красная рамка новостей
        
        const countHtml = isNewsPoster ? `<span class="post-author-level" style="background:rgba(255,51,51,0.1); color:#ff5555; border-color:rgba(255,51,51,0.2);">Просмотры: ${ns.views}</span>` : '';
        const reactionHtml = ['👍', '🔥', '🚀'].map(emoji => {
            const count = ns.reactions?.[emoji] || 0;
            return `<button class="post-action-btn" onclick="reactNews('${ns.id}', '${emoji}')">${emoji} ${count}</button>`;
        }).join('');

        card.innerHTML = `
            <div class="post-header">
                <div class="post-author-info">
                    <span style="font-size: 20px;">📢</span>
                    <div class="post-author-details">
                        <div class="post-author-name-wrapper">
                            <span class="post-author-name" style="color:#ff3333; font-weight:800;">${ns.title}</span>
                            ${countHtml}
                        </div>
                        <span class="post-time">Опубликовал: ${ns.author} | ${new Date(ns.timestamp).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
            <div class="post-content" style="white-space: pre-line; line-height: 1.7; font-size:13.5px;">${ns.body}</div>
            <div class="post-footer" style="border-color: rgba(255,51,51,0.1);">
                ${reactionHtml}
            </div>
        `;
        container.appendChild(card);
        
        // Симулируем просмотр при открытии
        if (!isNewsPoster && Math.random() > 0.5) {
            ns.views += 1;
        }
    });
    
    saveNews(news);
}

function reactNews(newsId, emoji) {
    const news = getNews();
    const item = news.find(ns => ns.id === newsId);
    if (!item) return;

    if (!item.reactions) item.reactions = {};
    item.reactions[emoji] = (item.reactions[emoji] || 0) + 1;
    saveNews(news);
    addXP(5);
    renderNews();
}

// Публикация новости админами
function publishNews() {
    const titleEl = document.getElementById('news-title-input');
    const bodyEl = document.getElementById('news-body-input');
    
    if (!titleEl || !bodyEl) return;
    
    const title = titleEl.value.trim();
    const body = bodyEl.value.trim();
    
    if (title === '' || body === '') return;
    
    const news = getNews();
    const currentUser = getActiveUser();
    
    const newUpdate = {
        id: 'n_' + Date.now(),
        author: currentUser.username,
        title: title.toUpperCase(),
        body: body,
        likes: [],
        reactions: {},
        views: 1,
        timestamp: Date.now()
    };
    
    news.unshift(newUpdate);
    saveNews(news);
    
    titleEl.value = '';
    bodyEl.value = '';
    
    renderNews();
    addXP(100); // 100 XP за официальное обновление
    showNotification('Обновление опубликовано', 'Официальный патч-ноут добавлен в Ленту!', '📢');
}
