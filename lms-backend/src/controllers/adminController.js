const nodemailer = require('nodemailer');
const crypto = require('crypto');
const userModel = require('../models/userModel');

const sendInstructorInvite = async (req, res) => {
    const { instructorEmail } = req.body;

    if (!instructorEmail) {
        return res.status(400).json({ message: "Vui lòng cung cấp email của giảng viên." });
    }
    try {
        const inviteCode = crypto.randomBytes(3).toString('hex').toUpperCase(); //Sinh ma moi ngau nhien
        await userModel.createInviteCode(instructorEmail, inviteCode);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"Hệ thống LMS" <${process.env.EMAIL_USER}>`,
            to: instructorEmail,
            subject: 'Thư mời tham gia giảng dạy Hệ thống LMS',
            html: `
                <h3>Chào bạn,</h3>
                <p>Bạn đã được Quản trị viên mời tham gia giảng dạy tại Hệ thống LMS.</p>
                <p>Mã mời đăng ký tài khoản Giảng viên của bạn là: <b>${inviteCode}</b></p>
                <p>Vui lòng truy cập trang web của chúng tôi, chọn mục Đăng ký và điền mã này vào ô "Mã mời".</p>
                <p>Trân trọng,</p>
                <p>Ban Quản Trị LMS</p>
            `
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).json({ 
            message: "Đã tạo mã và gửi email thành công!",
            code_generated: inviteCode // Tạm thời in ra đây để bạn dễ kiểm tra khi test
        });

    } catch (error) {
        console.error("Lỗi khi gửi email mời:", error);
        return res.status(500).json({ message: "Lỗi máy chủ khi tạo mã mời." });
    }
};

module.exports = { sendInstructorInvite };