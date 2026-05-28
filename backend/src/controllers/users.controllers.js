import User from "../models/users.model.js";
import jwt from "jsonwebtoken";

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

export const signUser = async (req,res)=>{
    const {email, password, name, age} = req.body;
    try{
        const user = await User.signUp(email, password, name, age);
        const token = createToken(user._id);
        res.status(200).json({email,token});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}
export const logUser = async (req,res)=>{
    const{email,password} = req.body;
    try{
        const user = await User.logIn(email,password);
        const token = createToken(user._id);
        res.status(200).json({email,token});
    }catch(error){
        res.status(400).json({error:error.message})
    }
}