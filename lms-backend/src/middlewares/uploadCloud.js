const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const fixedOriginalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    if (file.fieldname === 'avatar') {
      const userId = req.user ? req.user.id : 'unknown';
      return {
        folder: 'lms_avatars',        
        resource_type: 'image',       
        public_id: `user_${userId}_${Date.now()}` // Đổi tên file tránh trùng
      };
    }

    if (file.fieldname === 'image') {
      const instructorId = req.body.instructorId || 'unknown';
      return {
        folder: 'lms_course_images',  
        resource_type: 'image',       
        public_id: `course_${instructorId}_${Date.now()}` 
      };
    }

    const lessonId = req.params.id || 'unknown';
    return {
      folder: 'lms_documents',
      resource_type: 'raw',
      public_id: `lesson_${lessonId}_${fixedOriginalName}`
    };
  }
});

const uploadCloud = multer({ storage });
module.exports = uploadCloud;