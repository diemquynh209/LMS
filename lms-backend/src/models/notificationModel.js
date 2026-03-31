const pool = require('../config/db');

const NotificationModel = {
    createNotification: async (data) => {
        const { sender_id, title, message, type, target_role, target_user_id, link_url } = data;
        const [result] = await pool.query(
            `INSERT INTO Notifications 
            (sender_id, title, message, type, target_role, target_user_id, link_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [sender_id, title, message, type || 'System', target_role || 'All', target_user_id, link_url]
        );
        return result;
    },

    getNotificationsForUser: async (userId, userRole) => {
        const query = `
            SELECT n.*, 
                   u.full_name AS sender_name,
                   IF(nr.read_id IS NOT NULL, true, false) AS is_read
            FROM Notifications n
            LEFT JOIN Users u ON n.sender_id = u.user_id
            LEFT JOIN Notification_Reads nr ON n.notification_id = nr.notification_id AND nr.user_id = ?
            WHERE n.target_role = 'All' 
               OR n.target_role = ? 
               OR n.target_user_id = ?
            ORDER BY n.created_at DESC
        `;
        const [rows] = await pool.query(query, [userId, userRole, userId]);
        return rows;
    },

    markAsRead: async (notificationId, userId) => {
        const [result] = await pool.query(
            `INSERT IGNORE INTO Notification_Reads (notification_id, user_id) VALUES (?, ?)`,
            [notificationId, userId]
        );
        return result;
    },

    getAllNotifications: async () => {
        const query = `
            SELECT n.*, u.full_name AS sender_name
            FROM Notifications n
            LEFT JOIN Users u ON n.sender_id = u.user_id
            ORDER BY n.created_at DESC
        `;
        const [rows] = await pool.query(query);
        return rows;
    }
};

module.exports = NotificationModel;