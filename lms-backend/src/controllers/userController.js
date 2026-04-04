const UserModel = require('../models/userModel');
const pool = require('../config/db');

const userController = {
    updateProfile: async (req, res) => {
        try {
            // Lấy ID từ token (middleware xác thực) hoặc từ params
            const userId = req.user.id; 
            const { full_name, date_of_birth, email, phone } = req.body; 
            
            let avatarUrl = req.file ? req.file.path : null; // Link từ Cloudinary

            // Check trùng lặp Email hoặc SĐT
            const duplicates = await UserModel.checkDuplicateInfo(email, phone, userId);
            if (duplicates.length > 0) {
                const isEmailDup = duplicates.some(u => u.email === email);
                return res.status(400).json({ 
                    message: isEmailDup ? "Email này đã được sử dụng!" : "Số điện thoại này đã được đăng ký!" 
                });
            }
            //Xóa avt cũ khi cập nhật avt mới
            if (avatarUrl) {
                // Lấy thông tin user hiện tại để tìm link avatar cũ
                const [currentUser] = await pool.query('SELECT avatar_url FROM Users WHERE user_id = ?', [userId]);
                
                if (currentUser.length > 0 && currentUser[0].avatar_url && currentUser[0].avatar_url.includes('cloudinary')) {
                    try {
                        const cloudinary = require('cloudinary').v2; // Gọi thư viện Cloudinary
                        const oldUrl = currentUser[0].avatar_url;
                        
                        // Cắt chuỗi để lấy public_id của ảnh cũ
                        const parts = oldUrl.split('/upload/');
                        if (parts.length > 1) {
                            const pathString = parts[1].split('/').slice(1).join('/'); 
                            const publicId = pathString.substring(0, pathString.lastIndexOf('.'));
                            
                            // Gọi lệnh xóa của Cloudinary
                            await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
                            console.log("Đã dọn dẹp avatar cũ trên mây:", publicId);
                        }
                    } catch (err) {
                        console.error("Lỗi khi xóa avatar cũ (Bỏ qua để không sập server):", err);
                    }
                }
            }

            // Cập nhật Database
           await UserModel.updateProfile(userId, full_name, date_of_birth, email, phone, avatarUrl);

            const [rows] = await pool.query(
                `SELECT 
                    user_id as id, 
                    full_name, 
                    DATE_FORMAT(date_of_birth, '%Y-%m-%d') AS date_of_birth, 
                    email, 
                    phone, 
                    role, 
                    avatar_url 
                FROM Users WHERE user_id = ?`, 
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