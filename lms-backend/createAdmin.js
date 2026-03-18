require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('./src/config/db');
const createSuperAdmin = async () => {
    const fullName = 'Quản Trị Viên Tối Cao';
    const email = process.env.ADMIN_EMAIL;       
    const password = process.env.ADMIN_PASSWORD;
    const role = 'Admin';
    try {
        console.log("Đang kiểm tra cơ sở dữ liệu...");
        const [existingUsers] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);     
        if (existingUsers.length > 0) {
            console.log(`Tài khoản ${email} đã tồn tại trong hệ thống!`);
            process.exit();
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await pool.query(
            'INSERT INTO Users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [fullName, email, hashedPassword, role]
        );

        console.log("TẠO TÀI KHOẢN ADMIN THÀNH CÔNG!");
        console.log(`Email: ${email}`);
        console.log(` Mật khẩu: ${password}`);
        console.log(` Vai trò: ${role}`);

    } catch (error) {
        console.error(" Có lỗi xảy ra:", error);
    } finally {

        process.exit();
    }
};

createSuperAdmin();