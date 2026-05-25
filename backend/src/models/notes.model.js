import mongoose from "mongoose";
import User from "./users.model.js"

const notesSchema = new mongoose.Schema({
    title:{
        type: String,
        required = true;
    },
    description:{
        type: String,
        required: true;
    }
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User";
    }
})
export default notes = mongoose.model("notes", notesSchema);