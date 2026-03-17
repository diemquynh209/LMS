const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');
const app = express();
app.use(cors()); 
app.use(express.json()); 
//test api
app.get('/api/test', (req, res) => {
    res.json({ message: "test thanh cong" });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});