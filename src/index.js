import express from 'express';
import dotenv from "dotenv";
import colors from "colors"
import connectDB from './db/db.js';
import UserRoutes from './routes/userRoutes.js';
import UploadMediaRoutes from "./routes/uploadMediaRoutes.js"
import MemberRoutes from "./routes/memberRoutes.js"
import CampaignRoutes from './routes/campaignRoutes.js'
import PaymentRoutes from './routes/paymentRoutes.js'
import bodyParser from 'body-parser';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';



dotenv.config({ path: './.env' });
const app = express();

const PORT=process.env.PORT || 6000;
// console.log(`Port: ${PORT}`);
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors({
    origin: '*', // Replace with your frontend's origin
    methods: ['GET', 'POST','PUT'],
  }));

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
app.use("/member",MemberRoutes)
app.use("/donate",PaymentRoutes)


