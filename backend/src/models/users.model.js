import mongoose from "mongoose";
import notes from "./notes.model.js";
import validator from 'validator'
import bcrypt from 'bcrypt';
import AppError from "../utils/AppError.js";

const userSchema = new mongoose.Schema({
    email: {
    type: String,
    required: true
    },
    password:{
    type: String,
    required: true
    },
    name:{
    type: String,
    required: true
    },
    age:{
    type: Number,
    required: true
    },
    notes:[{
    type:mongoose.Schema.Types.ObjectId,
    ref: "notes"
    }]
});
userSchema.statics.signUp = async function (email,password, name, age){
    if(!email || !password || !name ||!age){
        throw new AppError("You need all the fields",400);
    }
    if(age<=0){
        throw new AppError("Must have age greater than 0",400);
    }
    if(!validator.isEmail(email)){
        throw new AppError("You need a correct email",400);
    }
    if(!validator.isStrongPassword(password)){
        throw new AppError("You need a STRONG password",400);
    }
    const exists = await this.findOne( { email })
    if(exists){
        throw  new AppError("The email already exists",400);
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt);
    const user = await this.create({email,password: hash, name ,age});

    return user;
}
userSchema.statics.logIn = async function (email,password){
    if(!email || !password){
    throw Error("Can't leave the fields empty.")
    }
    const exists = await this.findOne({email});
    if(!exists){
        throw new AppError("The email doesn't exist.",400);
    }
    const success = await bcrypt.compare(password, exists.password)

    if(!success){
    throw new AppError("The password ain't right.",400);
    }
    return exists;
}

const User = mongoose.model("User",userSchema);
export default User
