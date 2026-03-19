const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');
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
        console.error("Loi dang ky:", error);
        return res.status(500).json({ message: "Loi he thong!" });
    }
    };

const loginUser =async(req,res)=>{
    const{email,password} = req.body;
    if(!email||!password){
        return res.status(400).json({message: "Vui long nhap email va mat khau"})
    }
    try{
        const user= await userModel.findUserByEmail(email);
        if(!user){
            return res.status(400).json({message:"email hoac mat khau khong dung"})
        }
        const isMatch = await bcrypt.compare(password,user.password_hash);
        if(!isMatch){
            return res.status(400).json({message:"email hoac mat khau khong dung"})
        }
        const payload={
            id: user.id,
            role:user.role
        };
        const token =jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn:'1d'}
        );
        return res.status(200).json({
            message:"Dang nhap thanh cong",
            token: token,
            user:{id:user.is, full_name:user.full_name, email:user.email, role:user.role}
        });
    }catch (error){
        console.error("Loi dang nhap:", error);
        return res.status(500).json({message:"Loi may chu"});
    }
};
module.exports={registerUser,loginUser};