import express from "express";
import {signUser,logUser,logoutUser } from "../controllers/users.controllers.js";

const router = express.Router();

router.post('/signup',signUser)
router.post('/login',logUser)
router.post('/logout',logoutUser)

export default router