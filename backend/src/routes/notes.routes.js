import express from "express";
import {getAllNotes,getANote,updateANote,deleteANote,createNote} from "../controllers/notes.controllers.js";
import authenticate from "../middleware/Auth.js";

const router = express.Router();

router.use(authenticate);

router.get('/',getAllNotes)
router.get('/:id',getANote)
router.post('/',createNote)
router.patch('/:id',updateANote)
router.delete('/:id',deleteANote)

export default router