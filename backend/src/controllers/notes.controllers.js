import Notes from "../models/notes.model.js";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler"

export const getAllNotes = async(req,res)=>{
    const user_id = req.user._id;
    const notes = await Notes.find({user_id}).sort({createdAt: -1});
    res.status(200).json(notes);
}
export const getANote = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        res.status(404)
        throw new Error ("No such id");
    }
    const note = await Notes.findOne({_id: id, user_id: req.user._id});
    if(!note){
        res.status(404)
        throw new Error ("No such note");
    }
    res.status(200).json(note);
});
export const updateANote = asyncHandler(async (req,res)=>{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        res.status(404)
        throw new Error ("No such id");
    }
    const note = await Notes.findOneAndUpdate({_id: id,user_id: req.user._id},{...req.body},{ new: true });
    if(!note) {
        res.status(404)
        throw new Error ("No such note");
      }

      res.status(200).json(note)
})
export const deleteANote = asyncHandler(async (req,res)=>{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        res.status(404);
        throw new Error ("The id is invalid");
        }
        const note = await Notes.findOneAndDelete({
        _id: id,
        user_id: req.user._id
        });
        if(!note) {
            res.status(404);
            throw new Error("The note doesn't exists")
          }

          res.status(200).json(note)
});
export const createNote = asyncHandler(async(req,res)=>{
    const{title,description} = req.body;
    if(!title || !description ){
    res.status(400);
    throw new Error("you have to enter all the fields!");
    };

    const user_id = req.user._id;
    const note = await Notes.create({title,description,user_id});
    res.status(200).json(note);

});

