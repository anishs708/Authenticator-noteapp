import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import noteRoutes from "./src/routes/notes.routes.js";
import userRoutes from "./src/routes/users.routes.js"

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/user",userRoutes);
app.use("/api/notes",noteRoutes);


mongoose.connect(process.env.MONGODB_URL)
.then(()=> console.log("connected"))
.catch((err)=> console.log(err));

const port = process.env.PORT;


app.listen(port, ()=>{
    console.log(`Server at http:localhost:${port}`);
})
