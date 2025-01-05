import express from 'express';
import { createUser, forgotPassword, getUser, getUserBadges, loginUser, resetPassword, updateProfile, updateProfilePic } from '../controllers/userControllers.js';
import { upload } from '../utils/multer.js';

const router=express.Router()

router.post('/signup',upload,createUser)
router.get("/login",loginUser)
router.get("/get-user",getUser)
router.put("/update-profile-pic",upload,updateProfilePic)
router.put("/update-profile",updateProfile)
router.get("/user-badges",getUserBadges)
router.post('/forgot-password', forgotPassword); 
router.post('/reset-password/:token', resetPassword);

export default router;  