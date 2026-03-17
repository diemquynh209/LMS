const bcrypt= require('bcrypt');
const userModel = require('../models/userModel');
const { json } = require('express');
const registerUser = async(req,res)=>{
    const{full_name,email,password,invite_code}= req.body;
    res.status(201),json({message:"Ban da dang ky thanh cong"});
};
module.exports={registerUser};