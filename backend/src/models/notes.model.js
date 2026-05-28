import mongoose from "mongoose";
import User from "./users.model.js"

const notesSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    user_id:{
        type: String,
        required: true
    }
},{timestamps : true});
const Note = mongoose.model("Note",notesSchema);
export default Note