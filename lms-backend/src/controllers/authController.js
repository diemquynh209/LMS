const bcrypt= require('bcrypt');
const userModel = require('../models/userModel');
const { json } = require('express');
const registerUser = async(req,res)=>{
    const{full_name,email,password,invite_code}= req.body;
    if (!full_name||!email||!password){
        return res.status(400).json({message:"Vui long khong de trong"})
    }
    try{
        const existingUser = await userModel.findUserByEmail(email);
        if (existingUser){
            return res.status(400).json({message:"email ton tai"});
        }
        let role ='Student';

        if (invite_code) {
            const validInvite = await userModel.checkInviteCode(email, invite_code);
            if (!validInvite) {
                return res.status(400).json({ message: "ma moi khong hop le" });
            }
            role = 'Instructor';
        }
        //hash pass
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await userModel.createUser(full_name, email, hashedPassword, role);
        
        //xoa ma moi da dung
        if (role === 'Instructor') {
            await userModel.burnInviteCode(email, invite_code);
        }

        return res.status(201).json({ 
            message: "Dang ky thanh cong!",
            role: role
        });

    } catch (error) {
        console.error("Lỗi đăng ký:", error);
        return res.status(500).json({ message: "Lỗi máy chủ!" });
    }
    };
module.exports={registerUser};