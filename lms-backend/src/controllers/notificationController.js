const notificationModel = require('../models/notificationModel');
const sendNotification = async (req, res) => {
    try {
        const { sender_id, title, message, type, target_role, target_user_id, link_url } = req.body;
        if (!title || !message) {
            return res.status(400).json({ message: "Tiêu đề và Nội dung không được để trống!" });
        }

        await notificationModel.createNotification({
            sender_id, title, message, type, target_role, target_user_id, link_url
        });

        res.status(201).json({ message: "Gửi thông báo thành công!" });
    } catch (error) {
        console.error("🚨 LỖI GỬI THÔNG BÁO:", error);
        res.status(500).json({ message: "Lỗi server khi gửi thông báo." });
    }
};

const getMyNotifications = async (req, res) => {
    try {
        // Lấy userId và role từ query 
        const userId = req.query.userId; 
        const userRole = req.query.role; 

        if (!userId || !userRole) {
            return res.status(400).json({ message: "Thiếu thông tin người dùng!" });
        }

        const notifications = await notificationModel.getNotificationsForUser(userId, userRole);
        const unreadCount = notifications.filter(n => n.is_read === 0).length;

        res.status(200).json({
            unreadCount: unreadCount,
            notifications: notifications
        });
    } catch (error) {
        console.error("🚨 LỖI LẤY THÔNG BÁO:", error);
        res.status(500).json({ message: "Lỗi server khi lấy thông báo." });
    }
};

// Đánh dấu đã đọc
const markNotificationAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const { userId } = req.body; //ai là người bấm đọc
        await notificationModel.markAsRead(notificationId, userId);
        res.status(200).json({ message: "Đã đánh dấu đọc." });
    } catch (error) {
        console.error("🚨 LỖI ĐÁNH DẤU ĐỌC:", error);
        res.status(500).json({ message: "Lỗi server khi đánh dấu đọc thông báo." });
    }
};

module.exports = {
    sendNotification,
    getMyNotifications,
    markNotificationAsRead
};