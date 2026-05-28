import express from "express";
import {signUser,logUser} from "../controllers/users.controllers.js";

const router = express.Router();

router.post('/signup',signUser)
router.post('/login',logUser)


export default router