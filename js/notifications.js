/* KVARON_X (KRX) — УВЕДОМЛЕНИЯ (NOTIFICATIONS RENDER) */

window.renderNotifications = function () {
    const container = document.getElementById('notifications-container');
    if (!container) return;
    container.innerHTML = '';

    const currentUser = getActiveUser();
    const allNotifs = getNotifications();

    // Только уведомления текущего пользователя
    const myNotifs = allNotifs.filter(n => n.toUser === currentUser.username);

    // Сброс бейджа в сайдбаре
    const badge = document.getElementById('nav-notif-count');
    if (badge) badge.classList.add('hidden');

    // Отметим все как прочитанные
    let changed = false;
    allNotifs.forEach(n => {
        if (n.toUser === currentUser.username && !n.read) {
            n.read = true;
            changed = true;
        }
    });
    if (changed) saveNotifications(allNotifs);

    if (myNotifs.length === 0) {
        container.innerHTML = `
            <div class="card" style="text-align:center; padding:50px; color:var(--text-secondary);">
                <div style="font-size:48px; margin-bottom:16px;">🔔</div>
                <p>У вас пока нет уведомлений.<br>Будьте активнее на платформе!</p>
            </div>
        `;
        return;
    }

    // Сортируем по времени — новые сверху
    const sorted = [...myNotifs].sort((a, b) => b.timestamp - a.timestamp);

    sorted.forEach(notif => {
        const typeIconMap = {
            like: '❤️',
            comment: '💬',
            friend_request: '👤',
            system: '⚡',
        };

        const typeClassMap = {
            like: 'type-like',
            comment: 'type-comment',
            friend_request: 'type-friend',
            system: 'type-system',
        };

        const icon = typeIconMap[notif.type] || '🔔';
        const typeClass = typeClassMap[notif.type] || '';

        const timeStr = formatRelativeTime(notif.timestamp);

        const el = document.createElement('div');
        el.className = `notification-item ${!notif.read ? 'unread' : ''} ${typeClass}`;
        el.innerHTML = `
            <div class="notif-icon">${icon}</div>
            <div class="notif-body">
                <div class="notif-text">
                    <strong>${notif.fromUser}</strong> ${notif.text}
                </div>
                <div class="notif-meta">${timeStr}</div>
            </div>
            ${!notif.read ? '<div class="unread-dot"></div>' : ''}
        `;
        container.appendChild(el);
    });
};

function formatRelativeTime(ts) {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return 'только что';
    if (diff < 3600) return `${Math.floor(diff / 60)} мин назад`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ч назад`;
    return new Date(ts).toLocaleDateString('ru');
}

function clearAllNotifications() {
    const currentUser = getActiveUser();
    let notifs = getNotifications();
    notifs = notifs.filter(n => n.toUser !== currentUser.username);
    saveNotifications(notifs);
    renderNotifications();
    showNotification('Уведомления очищены', 'Все уведомления удалены.', '🗑️');
}
