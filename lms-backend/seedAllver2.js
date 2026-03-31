require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('./src/config/db');

const seedAllV2 = async () => {
    try {
        console.log("Bắt đầu chạy Seed V2...");

        const defaultPassword = 'password123';
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        const [userMax] = await pool.query('SELECT MAX(user_id) as maxId FROM Users');
        let startUserIdx = (userMax[0].maxId || 0) + 1;

        const ho = ['Nguyễn', 'Phạm', 'Trần', 'Lê', 'Hoàng', 'Vũ', 'Đinh', 'Bùi', 'Đỗ', 'Ngô'];
        const dem = ['Văn', 'Thị', 'Đức', 'Ngọc', 'Hải', 'Minh', 'Thành', 'Thu', 'Tuấn', 'Phương'];
        const ten = ['Anh', 'Bình', 'Cường', 'Dương', 'Hà', 'Kiên', 'Linh', 'Nam', 'Oanh', 'Tâm', 'Yến'];

        let instructorCount = 0;
        let studentCount = 0;

        for (let i = 0; i < 250; i++) { 
            const h = ho[Math.floor(Math.random() * ho.length)];
            const d = dem[Math.floor(Math.random() * dem.length)];
            const t = ten[Math.floor(Math.random() * ten.length)];

            const fullName = `${h} ${d} ${t}`;
            const email = `demo_user${startUserIdx}@lms.edu.vn`;
            const phone = `098${Math.floor(1000000 + Math.random() * 9000000)}`; 
            const role = (startUserIdx % 10 === 0) ? 'Instructor' : 'Student';
            
            if (role === 'Instructor') instructorCount++;
            if (role === 'Student') studentCount++;
            
            await pool.query(
                'INSERT IGNORE INTO Users (full_name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)',
                [fullName, email, phone, hashedPassword, role]
            );
            startUserIdx++;
        }
        console.log(`Đã tạo thành công ${instructorCount} Giảng viên và ${studentCount} Học viên.`);

        const [catRows] = await pool.query('SELECT * FROM Categories');
        if (catRows.length === 0) throw new Error("Database chưa có Category nào. Hãy chạy file seed cũ trước!");

        const [instructors] = await pool.query("SELECT user_id FROM Users WHERE role = 'Instructor'");
        if (instructors.length === 0) throw new Error("Không có Giảng viên để phân công!");

        const classNamesDict = {
            'CNTT': ['Lập trình Web Fullstack với React & Nodejs', 'Cấu trúc dữ liệu và Giải thuật', 'Nhập môn Trí tuệ nhân tạo (AI)', 'Lập trình Mobile với React Native', 'Cơ sở dữ liệu nâng cao', 'Lập trình C++ cho người mới bắt đầu', 'DevOps Cơ bản', 'Bảo mật thông tin'],
            'English': ['Tiếng Anh Giao Tiếp Doanh Nghiệp', 'Luyện thi IELTS 6.5+', 'Ngữ pháp Tiếng Anh cơ bản', 'Tiếng Anh chuyên ngành IT', 'Phát âm chuẩn giọng Mỹ', 'Luyện kỹ năng Viết Essay'],
            'Kinh tế': ['Nguyên lý Kế toán', 'Marketing căn bản', 'Hành vi người tiêu dùng', 'Quản trị Tài chính doanh nghiệp', 'Kinh tế vi mô', 'Đầu tư chứng khoán cho người mới', 'Quản trị nhân sự'],
            'Toán': ['Toán Cao Cấp A1', 'Xác suất thống kê', 'Đại số tuyến tính', 'Toán rời rạc', 'Phương pháp tính'],
            'Hóa Học': ['Hóa đại cương', 'Hóa vô cơ 1', 'Hóa hữu cơ ứng dụng', 'Thực hành Hóa sinh', 'Phân tích hóa học'],
            'Vật Lý': ['Vật lý đại cương 1', 'Cơ học lượng tử', 'Quang học ứng dụng', 'Điện từ trường', 'Nhiệt động lực học'],
            'Sinh học': ['Sinh học đại cương', 'Di truyền học', 'Giải phẫu học', 'Vi sinh vật học'],
            'Triết học': ['Triết học Mác - Lênin', 'Lịch sử triết học phương Tây', 'Tư tưởng Hồ Chí Minh', 'Logic học']
        };

        const statuses = ['Draft', 'Published', 'Published', 'Published', 'Closed']; 
        let newClassIds = [];
        for (let i = 0; i < 30; i++) {
            const randomCategory = catRows[Math.floor(Math.random() * catRows.length)];
            const randomInstructorId = instructors[Math.floor(Math.random() * instructors.length)].user_id;
            const availableNames = classNamesDict[randomCategory.category_name] || ['Khóa học chuyên sâu', 'Lớp học nền tảng', 'Học phần nâng cao'];
            const finalClassName = availableNames[Math.floor(Math.random() * availableNames.length)];

            const status = statuses[Math.floor(Math.random() * statuses.length)];

            const [result] = await pool.query(
                'INSERT INTO Classes (instructor_id, class_name, description, status, category_id) VALUES (?, ?, ?, ?, ?)',
                [randomInstructorId, finalClassName, `Đây là mô tả chi tiết cho lớp ${finalClassName}. Khóa học này sẽ cung cấp kiến thức toàn diện về ${randomCategory.category_name}.`, status, randomCategory.category_id]
            );
            
            if (status !== 'Draft') {
                newClassIds.push(result.insertId);
            }
        }
        console.log(`Đã tạo thành công 30 Lớp học mới với tên gọi gọn gàng.`);

        const [students] = await pool.query("SELECT user_id FROM Users WHERE role = 'Student'");
        let enrollmentCount = 0;
        
        if (newClassIds.length > 0 && students.length > 0) {
            for (let classId of newClassIds) {
                // Đảo lộn danh sách học sinh để lấy ngẫu nhiên
                const shuffled = students.sort(() => 0.5 - Math.random());

                const numStudents = Math.floor(Math.random() * 11) + 5; 
                const selectedStudents = shuffled.slice(0, numStudents);

                for (let student of selectedStudents) {
                    await pool.query(
                        "INSERT IGNORE INTO Enrollments (student_id, class_id, status) VALUES (?, ?, 'Approved')",
                        [student.user_id, classId]
                    );
                    enrollmentCount++;
                }
            }
            console.log(`Đã xếp thành công ${enrollmentCount} lượt học viên vào các lớp.`);
        }

    } catch (error) {
        console.error("Lỗi khi chạy Seed:", error);
    } finally {
        process.exit();
    }
};

seedAllV2();