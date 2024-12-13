
import express from 'express';
import { uploadDonationMedia } from '../controllers/mediaController.js';
import { upload } from '../utils/multer.js';


const router=express.Router();


router.post('/upload-media', upload, uploadDonationMedia);

export default router;