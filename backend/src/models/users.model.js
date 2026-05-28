import mongoose from "mongoose";
import notes from "./notes.model.js";
import validator from 'validator'
import bcrypt from 'bcrypt';

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
        throw Error("You need all the fields");
    }
    if(age<=0){
        throw Error("Must have age greater than 0");
    }
    if(!validator.isEmail(email)){
        throw Error("You need a correct email");
    }
    if(!validator.isStrongPassword(password)){
        throw Error("You need a STRONG password");
    }
    const exists = await this.findOne( { email })
    if(exists){
        throw Error("The email already exists");
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
        throw Error("The email doesn't exist.");
    }
    const success = await bcrypt.compare(password, exists.password)

    if(!success){
    throw Error("The password ain't right.");
    }
    return exists;
}

const User = mongoose.model("User",userSchema);
export default User
