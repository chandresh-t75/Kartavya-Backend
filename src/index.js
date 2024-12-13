import express from 'express';
import dotenv from "dotenv";
import colors from "colors"
import connectDB from './db/db.js';

import UserRoutes from './routes/userRoutes.js';
import UploadMediaRoutes from "./routes/uploadMediaRoutes.js"

import CampaignRoutes from './routes/campaignRoutes.js'
import bodyParser from 'body-parser';
dotenv.config({ path: './.env' });
const app = express();

const PORT=process.env.PORT || 6000;
// console.log(`Port: ${PORT}`);
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


connectDB().
then(()=>{
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`.yellow.bold);
})
})


app.get("/",(req,res)=>{
    res.send("Welcome to Kartavya")
})

app.use("/user",UserRoutes)
app.use("/upload",UploadMediaRoutes)
app.use("/campaign",CampaignRoutes)

