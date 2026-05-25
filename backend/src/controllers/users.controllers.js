import user from "../models/users.model.js";
import jwt from "jsonwebtoken";

const signUser = async (req,res){
    const {email, password, name, age} = req.body;
    try{
        const user = await user.signIn(email, password, name, age);
        const token = create
        res.status(200).json({email,token});
    }
    catch(err){
    }
}