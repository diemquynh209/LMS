require('dotenv').config();
const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const express = require('express');
const cors = require('cors');
const db = require('./src/config/db');
const app = express();
app.use(cors()); 
app.use(express.json()); 
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});