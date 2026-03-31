require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('./src/config/db');

const seedAll = async () => {
    try {
        //Tạo user
        const defaultPassword = 'password123';
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        const [userMax] = await pool.query('SELECT MAX(user_id) as maxId FROM Users');
        let startUserIdx = (userMax[0].maxId || 0) + 1;

        const ho = ['Nguyễn', 'Phạm', 'Trần', 'Lê', 'Hoàng', 'Vũ'];
        const dem = ['Văn', 'Thị', 'Đức', 'Ngọc', 'Hải', 'Minh'];
        const ten = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

        let instructorCount = 0;
        let studentCount = 0;

        for (let i = 0; i < 20; i++) { 
            const h = ho[Math.floor(Math.random() * ho.length)];
            const d = dem[Math.floor(Math.random() * dem.length)];
            const t = ten[Math.floor(Math.random() * ten.length)];

            const fullName = `${h} ${d} ${t}`;
            const email = `user${startUserIdx}@lms.edu.vn`;
            const phone = `0900000${startUserIdx.toString().padStart(3, '0')}`;
            const role = (startUserIdx % 5 === 0) ? 'Instructor' : 'Student';
            
            if (role === 'Instructor') instructorCount++;
            if (role === 'Student') studentCount++;
            
            await pool.query(
                'INSERT IGNORE INTO Users (full_name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)',
                [fullName, email, phone, hashedPassword, role]
            );
            startUserIdx++;
        }

        //category
        const categories = [
            { name: 'Kinh tế', desc: '' },
            { name: 'Toán', desc: '' },
            { name: 'Hóa học', desc: '' },
            { name: 'Sinh học', desc: '' },
            { name: 'English', desc: '' },
            { name: 'Vật lý', desc: '' },
            { name: 'Triết học', desc: '' },
            { name: 'CNTT', desc: '' },

        ];

        for (let cat of categories) {
            //bỏ qua nếu danh mục đã tồn tại
            await pool.query(
                'INSERT IGNORE INTO Categories (category_name, description) VALUES (?, ?)',
                [cat.name, cat.desc]
            );
        }
        const [catRows] = await pool.query('SELECT * FROM Categories');

        //class
        const [instructors] = await pool.query("SELECT user_id FROM Users WHERE role = 'Instructor'");
        if (instructors.length === 0) throw new Error("Không có Giảng viên để phân công!");

        //Tìm k max để không trùng (nếu tạo trước đó)
        const [classMax] = await pool.query('SELECT COUNT(*) as totalClasses FROM Classes');
        let startClassIdx = (classMax[0].totalClasses || 0) + 1;

        const statuses = ['Draft', 'Published', 'Closed'];
        let newClassIds = [];

        for (let i = 0; i < 15; i++) {
            const randomCategory = catRows[Math.floor(Math.random() * catRows.length)];
            const randomInstructorId = instructors[Math.floor(Math.random() * instructors.length)].user_id;
            
            const className = `${randomCategory.category_name} - Khóa K${startClassIdx}`;
            const status = statuses[Math.floor(Math.random() * statuses.length)];

            const [result] = await pool.query(
                'INSERT INTO Classes (instructor_id, class_name, description, status, category_id) VALUES (?, ?, ?, ?, ?)',
                [randomInstructorId, className, `Nội dung chi tiết cho lớp ${className}...`, status, randomCategory.category_id]
            );
            if (status !== 'Draft') {
                newClassIds.push(result.insertId);
            }
            startClassIdx++;
        }

        //Xêp hsinh
        const [students] = await pool.query("SELECT user_id FROM Users WHERE role = 'Student'");
        let enrollmentCount = 0;
        
        if (newClassIds.length > 0) {
            for (let classId of newClassIds) {
                const shuffled = students.sort(() => 0.5 - Math.random());
                const numStudents = Math.floor(Math.random() * 4) + 2; // Nhét 2-5 học viên
                const selectedStudents = shuffled.slice(0, numStudents);

                for (let student of selectedStudents) {
                    await pool.query(
                        "INSERT IGNORE INTO Enrollments (student_id, class_id, status) VALUES (?, ?, 'Approved')",
                        [student.user_id, classId]
                    );
                    enrollmentCount++;
                }
            }
        } else {
            console.log("Các lớp mới tạo đều là Draft.");
        }


    } catch (error) {
        console.error(" Lỗi nghiêm trọng:", error);
    } finally {
        process.exit();
    }
};

seedAll();