import express from 'express';
import dotenv from "dotenv"
dotenv.config({ path: './.env' });
const app = express();

const PORT=process.env.PORT || 6000;
// console.log(`Port: ${PORT}`);
app.use(express.json());

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})


