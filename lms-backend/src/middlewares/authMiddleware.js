const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = {
    // Hàm xác thực Token
    verifyToken: (req, res, next) => {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Vui lòng đăng nhập để thực hiện thao tác này!" });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);         
            // Gắn thông tin người dùng 
            req.user = decoded; 
            next();
        } catch (error) {
            return res.status(403).json({ message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn!" });
        }
    }
};

module.exports = authMiddleware;