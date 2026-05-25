import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/user",);
app.use("/api/notes",);


mongoose.connect(process.env.MONGODB_URL)
.then(()=> console.log("connected"))
.catch(()=> console.log(err));

const port = process.env.PORT;

app.get('/', (req,res)=>{
    res.send("We're doing good! ")
})
app.listen(port, ()=>{
    console.log(`Server at http:localhost:${port}`);
})
