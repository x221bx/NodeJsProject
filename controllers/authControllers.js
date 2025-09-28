import bcrypt from "bcrypt";
import userCollection from "../models/userModel.js";
import jwt from "jsonwebtoken";
// create New User
export const createNewUser =async (req,res)=> {
    const {name , password , email , age , role ='user'} = req.body;
    const hashedpassword = await bcrypt.hash(password ,10)
    const isExist = await userCollection.where("email", "==", email).get()
    if (!name || !password || !email) {
        res.status(400).json({message: "Name, email, and password are required"})
    }
    if (!isExist.empty) {
        res.status(401).json({massesge:'this email is Already Exist'})
    }else {
        const newUser = await userCollection.add({name, email , password : hashedpassword , age , role})
        res.status(201).json({message:'ctreated' , id :newUser.id , email , name})
    }
}

export const login = ( async(req,res) => {
    const { password , email } = req.body;
    const snapShoot = await userCollection.where("email", "==", email).get()
    if (snapShoot.empty) {
        return res.status(401).json("Pls sign up ")
    }
    const userData = snapShoot.docs[0].data()
    const isMatch =await bcrypt.compare(password , userData.password)
    if (!isMatch) {
        res.status(401).json({message:'password not correct'})        
    }
    const token =  jwt.sign({email: userData.email , id : snapShoot.docs[0].id , role : userData.role},'emad') 
    res.status(200).json({message:'approve',userData , token})        
})

