import express from 'express';
import { createCampaign, getAllCampaigns, getParticularCampaign } from '../controllers/campaignController.js';
import { upload } from '../utils/multer.js';

const router =express.Router();

router.post('/create-campaign',upload, createCampaign);
router.get('/get-all-campaigns',getAllCampaigns);
router.get('/singlecampaign',getParticularCampaign)

export default router;
