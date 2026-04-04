DROP DATABASE IF EXISTS lms_database;
CREATE DATABASE lms_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lms_database;
CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL, 
    role ENUM('Admin', 'Instructor', 'Student') NOT NULL DEFAULT 'Student',
    status ENUM('Active', 'Locked') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE Users 
ADD COLUMN avatar_url VARCHAR(500) DEFAULT NULL;

CREATE TABLE IF NOT EXISTS Classes (
    class_id INT AUTO_INCREMENT PRIMARY KEY,
    instructor_id INT NOT NULL,
    class_name VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('Draft', 'Published', 'Closed','Deleted') DEFAULT 'Draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

ALTER TABLE Classes ADD COLUMN image_url VARCHAR(500) DEFAULT NULL;

CREATE TABLE IF NOT EXISTS Enrollments (
    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    class_id INT NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES Classes(class_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Chapters (
    chapter_id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    chapter_name VARCHAR(255) NOT NULL,
    order_index INT DEFAULT 0,
    FOREIGN KEY (class_id) REFERENCES Classes(class_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Lessons (
    lesson_id INT AUTO_INCREMENT PRIMARY KEY,
    chapter_id INT NOT NULL,
    lesson_name VARCHAR(255) NOT NULL,
    content TEXT,
    video_url VARCHAR(500),
    document_url VARCHAR(500),
    order_index INT DEFAULT 0,
    FOREIGN KEY (chapter_id) REFERENCES Chapters(chapter_id) ON DELETE CASCADE
);

ALTER TABLE Lessons 
ADD COLUMN ai_summary TEXT DEFAULT NULL,
ADD COLUMN ai_status ENUM('none', 'processing', 'pending_review', 'published') DEFAULT 'none';

CREATE TABLE Instructor_Invites (
    invite_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    invite_code VARCHAR(50) NOT NULL UNIQUE,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL 7 DAY)
);
CREATE TABLE IF NOT EXISTS Lesson_Reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    lesson_id INT NOT NULL,
    student_id INT NOT NULL,
    reason VARCHAR(255) NOT NULL,
    status ENUM('Pending', 'Resolved', 'Dismissed') DEFAULT 'Pending', 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES Lessons(lesson_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    UNIQUE(lesson_id, student_id) 
);
CREATE TABLE IF NOT EXISTS Categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE Classes ADD COLUMN category_id INT;
ALTER TABLE Classes 
ADD CONSTRAINT fk_class_category 
FOREIGN KEY (category_id) REFERENCES Categories(category_id) 
ON DELETE SET NULL;

CREATE TABLE Notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('System', 'Course', 'Assignment') DEFAULT 'System', 
    target_role ENUM('All', 'Instructor', 'Student', 'SpecificUser') DEFAULT 'All', 
    target_user_id INT NULL, 
    link_url VARCHAR(255) NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES Users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (target_user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Notification_Reads (
    read_id INT AUTO_INCREMENT PRIMARY KEY,
    notification_id INT NOT NULL,
    user_id INT NOT NULL,
    read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (notification_id) REFERENCES Notifications(notification_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    UNIQUE(notification_id, user_id) 
);

CREATE TABLE IF NOT EXISTS Questions (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    lesson_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('MultipleChoice', 'TrueFalse') DEFAULT 'MultipleChoice',
    options JSON, 
    correct_answer VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES Lessons(lesson_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Student_Wrong_Answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    question_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES Questions(question_id) ON DELETE CASCADE,
    UNIQUE(student_id, question_id)
);

CREATE TABLE IF NOT EXISTS Assignments (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    lesson_id INT NOT NULL, 
    title VARCHAR(255) NOT NULL,
    description TEXT, 
    due_date DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES Lessons(lesson_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Assignment_Submissions (
    submission_id INT AUTO_INCREMENT PRIMARY KEY,
    assignment_id INT NOT NULL,
    student_id INT NOT NULL,
    file_url VARCHAR(500) NOT NULL, 
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    grade DECIMAL(5,2) NULL, 
    feedback TEXT NULL, 
    status ENUM('Submitted', 'Late', 'Graded') DEFAULT 'Submitted', 
    FOREIGN KEY (assignment_id) REFERENCES Assignments(assignment_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    UNIQUE(assignment_id, student_id)
);