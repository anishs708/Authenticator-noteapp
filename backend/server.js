import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import noteRoutes from "./src/routes/notes.routes.js";
import userRoutes from "./src/routes/users.routes.js"
import cookieParser from "cookie-parser";
import {errorHandler} from "./src/middleware/errorhandler.js"

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use("/api/user",userRoutes);
app.use("/api/notes",noteRoutes);

app.use(errorHandler);


mongoose.connect(process.env.MONGODB_URL)
.then(()=> console.log("connected"))
.catch((err)=> console.log(err));

const port = process.env.PORT;


app.listen(port, ()=>{
    console.log(`Server at http:localhost:${port}`);
})
