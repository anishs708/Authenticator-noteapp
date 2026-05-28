import jwt from "jsonwebtoken";
import User from "../models/users.model.js";

const authenticate = async (req, res,next)=>{
    const {authorization} = req.headers;
    if(!authorization){
    res.status(400).json({error:"Authorization is required"});
    }
    const token = authorization.split(" ") [1];
    try{
        const {_id} = jwt.verify(token,process.env.SECRET);
        req.user = await User.findOne({_id}).select('_id');
        next();
    }catch(error){
        console.log(error)
        res.status(401).json({error: "Cannot verify"});
    }
}
export default authenticate;