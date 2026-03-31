const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const InviteModel = require('../models/inviteModel');

const authController = {
    registerUser: async (req, res) => {
        const { full_name, email, phone, password, invite_code } = req.body;
        
        if (!full_name || !email || !phone || !password) {
            return res.status(400).json({ message: "Vui lòng không để trống" });
        }
        
        try {
            const existingUser = await UserModel.findUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: "Email đã tồn tại" });
            }
            
            let role = 'Student';

            if (invite_code) {
                const validInvite = await InviteModel.checkInviteCode(email, invite_code);
                if (!validInvite) {
                    return res.status(400).json({ message: "Mã mời không hợp lệ" });
                }
                role = 'Instructor';
            }
            
            // Hash password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            await UserModel.createUser(full_name, email, phone, hashedPassword, role);
            
            // Xóa mã mời đã dùng
            if (role === 'Instructor') {
                await InviteModel.burnInviteCode(email, invite_code);
            }

            return res.status(201).json({ 
                message: "Đăng ký thành công!",
                role: role
            });

        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            return res.status(500).json({ message: "Lỗi hệ thống!" });
        }
    },

    loginUser: async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu" });
        }
        try {
            const user = await UserModel.findUserByEmail(email);
            if (!user) {
                return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
            }
            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
            }
            const payload = {
                id: user.user_id, // Lưu ý: id trong db của bạn là user_id
                role: user.role
            };
            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );
            return res.status(200).json({
                message: "Đăng nhập thành công",
                token: token,
                user: { id: user.user_id, full_name: user.full_name, email: user.email, role: user.role }
            });
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            return res.status(500).json({ message: "Lỗi máy chủ" });
        }
    }
};

module.exports = authController;