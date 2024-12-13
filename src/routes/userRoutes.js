import express from 'express';
import { createUser, forgotPassword, loginUser, resetPassword } from '../controllers/userControllers.js';

const router=express.Router()

router.post('/signup',createUser)
router.get("/login",loginUser)
router.post('/forgot-password', forgotPassword); 
router.post('/reset-password/:token', resetPassword);

export default router;