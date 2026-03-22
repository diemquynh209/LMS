require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('./src/config/db'); 

const seedUsers = async () => {
    const defaultPassword = 'password123'; 
    const saltRounds = 10;
    
    try {
        const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

        const ho = ['Nguyễn', 'Phạm', 'Trần', 'Lê'];
        const dem = ['Văn', 'Thị', 'Đức', 'Ngọc'];
        const ten = ['A', 'B', 'C', 'D', 'E', 'F'];

        let count = 0;
        let instructorCount = 0;
        let studentCount = 0;
        for (let h of ho) {
            for (let d of dem) {
                for (let t of ten) {
                    count++;
                    const fullName = `${h} ${d} ${t}`;           
                    const email = `user${count}@lms.edu.vn`;
                    const phone = `0900000${count.toString().padStart(3, '0')}`;
                    const role = (count % 5 === 0) ? 'Instructor' : 'Student';                
                    if (role === 'Instructor') instructorCount++;
                    if (role === 'Student') studentCount++;
                    await pool.query(
                        'INSERT INTO Users (full_name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)',
                        [fullName, email, phone, hashedPassword, role]
                    );
                }
            }
        }

    } catch (error) {
        console.error(" Có lỗi xảy ra trong quá trình bơm dữ liệu:", error);
    } finally {
        process.exit();
    }
};

seedUsers();