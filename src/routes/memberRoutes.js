import express from 'express';
import { createMember, getAllMembers, getMemberById } from '../controllers/memberController.js';
import { upload } from '../utils/multer.js';


const router=express.Router();

router.get("/get-all-members",getAllMembers)
router.post("/create-member",upload,createMember)
router.get("/single-member",getMemberById)

export default router;