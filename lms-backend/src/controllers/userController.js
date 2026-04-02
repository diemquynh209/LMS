const UserModel = require('../models/userModel');
const pool = require('../config/db');

const userController = {
    updateProfile: async (req, res) => {
        try {
            // Lấy ID từ token (middleware xác thực) hoặc từ params
            const userId = req.user.id; 
            const { full_name, email, phone } = req.body;
            let avatarUrl = req.file ? req.file.path : null; // Link từ Cloudinary

            //Check trùng lặp Email hoặc SĐT
            const duplicates = await UserModel.checkDuplicateInfo(email, phone, userId);
            if (duplicates.length > 0) {
                const isEmailDup = duplicates.some(u => u.email === email);
                return res.status(400).json({ 
                    message: isEmailDup ? "Email này đã được sử dụng!" : "Số điện thoại này đã được đăng ký!" 
                });
            }

            //  Cập nhật Database
            await UserModel.updateProfile(userId, full_name, email, phone, avatarUrl);

            const [rows] = await pool.query(
                'SELECT user_id as id, full_name, email, phone, role, avatar_url FROM Users WHERE user_id = ?', 
                [userId]
            );

            res.status(200).json({ 
                message: "Cập nhật hồ sơ thành công!",
                user: rows[0]
            });

        } catch (error) {
            console.error("Lỗi update profile:", error);
            res.status(500).json({ message: "Lỗi máy chủ!" });
        }
    }
};

module.exports = userController;