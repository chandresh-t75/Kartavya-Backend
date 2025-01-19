import express from 'express';
import { createPayment, verifyPayment } from '../controllers/paymentController.js';


const router=express.Router()


router.post("/initiate-payment",createPayment);
router.post('/verify-payment',verifyPayment);

export default router;
