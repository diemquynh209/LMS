const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const uploadCloud = require('../middlewares/uploadCloud');
const authMiddleware = require('../middlewares/authMiddleware'); 
router.put('/profile', 
    authMiddleware.verifyToken, 
    uploadCloud.single('avatar'), 
    userController.updateProfile
);

module.exports = router;