import express from 'express';
import { createMember, getAllMembers, getEminentMembers, getMemberById, updateMemberPic } from '../controllers/memberController.js';
import { upload } from '../utils/multer.js';


const router=express.Router();

router.get("/get-all-members",getAllMembers)
router.post("/create-member",upload,createMember)
router.get("/single-member",getMemberById)
router.put("/update-pic",upload,updateMemberPic)
router.get('/eminent-members',getEminentMembers)

export default router;