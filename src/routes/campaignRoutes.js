import express from 'express';
import { createCampaign } from '../controllers/campaignController.js';
import { upload } from '../utils/multer.js';

const router =express.Router();

router.post('/create-campaign',upload, createCampaign);

export default router;
