import Notes from "../models/notes.model.js";
import mongoose from "mongoose";

export const getAllNotes = async(req,res)=>{
    const user_id = req.user._id;
    const notes = await Notes.find({user_id}).sort({createdAt: -1});
    res.status(200).json(notes);
}
export const getANote = async(req,res)=>{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(401).json({error: "The id don't exist"});
    }
    const note = await Notes.findOne({_id: id, user_id: req.user._id});
    if(!note){
        return res.status(401).json({error: "The note doesn't exist"})
    }
    res.status(200).json(note);
}
export const updateANote = async (req,res)=>{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(401).json({error:"it ain't there"})
    }
    const note = await Notes.findOneAndUpdate({_id: id,user_id: req.user._id},{...req.body},{ new: true });
    if(!note) {
        return res.status(400).json({error: 'No such note'})
      }

      res.status(200).json(note)
}
export const deleteANote = async (req,res)=>{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(401).json({error:"it ain't there"})
        }
        const note = await Notes.findOneAndDelete({
        _id: id,
        user_id: req.user._id
        });
        if(!note) {
            return res.status(400).json({error: 'No such note'})
          }

          res.status(200).json(note)
}
export const createNote = async(req,res)=>{
    const{title,description} = req.body;
    if(!title || !description ){
    return res.status(400).json({error: "you have to enter all the fields!"});
    }
    try{
        const user_id = req.user._id;
        const note = await Notes.create({title,description,user_id});
        res.status(200).json(note);
    }catch(error){
        console.log(error);
        return res.status(400).json({error: "Couldn't create notes"});
    }
}

