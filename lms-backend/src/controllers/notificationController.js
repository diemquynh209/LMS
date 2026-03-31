const NotificationModel = require('../models/notificationModel');
const notificationController = {
    sendNotification: async (req, res) => {
        try {
            const { sender_id, title, message, type, target_role, target_user_id, link_url } = req.body;
            if (!title || !message) {
                return res.status(400).json({ message: "Tiêu đề và Nội dung không được để trống!" });
            }

            await NotificationModel.createNotification({
                sender_id, title, message, type, target_role, target_user_id, link_url
            });

            res.status(201).json({ message: "Gửi thông báo thành công!" });
        } catch (error) {
            console.error(" LỖI GỬI THÔNG BÁO:", error);
            res.status(500).json({ message: "Lỗi server khi gửi thông báo." });
        }
    },

    getMyNotifications: async (req, res) => {
        try {
            const userId = req.query.userId; 
            const userRole = req.query.role; 

            if (!userId || !userRole) {
                return res.status(400).json({ message: "Thiếu thông tin người dùng!" });
            }

            const notifications = await NotificationModel.getNotificationsForUser(userId, userRole);
            const unreadCount = notifications.filter(n => n.is_read === 0).length;

            res.status(200).json({
                unreadCount: unreadCount,
                notifications: notifications
            });
        } catch (error) {
            console.error("LỖI LẤY THÔNG BÁO:", error);
            res.status(500).json({ message: "Lỗi server khi lấy thông báo." });
        }
    },

    markNotificationAsRead: async (req, res) => {
        try {
            const notificationId = req.params.id;
            const { userId } = req.body; 
            await NotificationModel.markAsRead(notificationId, userId);
            res.status(200).json({ message: "Đã đánh dấu đọc." });
        } catch (error) {
            console.error(" LỖI ĐÁNH DẤU ĐỌC:", error);
            res.status(500).json({ message: "Lỗi server khi đánh dấu đọc thông báo." });
        }
    },

    getAllNotifications: async (req, res) => {
        try {
            const notifications = await NotificationModel.getAllNotifications();
            res.status(200).json(notifications);
        } catch (error) {
            console.error("LỖI LẤY LỊCH SỬ THÔNG BÁO:", error);
            res.status(500).json({ message: "Lỗi server khi lấy lịch sử thông báo." });
        }
    }
};

module.exports = notificationController;