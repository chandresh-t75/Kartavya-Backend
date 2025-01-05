import express from 'express';
import { createCampaign, getAllCampaigns, getParticularCampaign } from '../controllers/campaignController.js';
import { upload } from '../utils/multer.js';
import { getAllCampaignImages, getAllCampaignVideos, getCampaignImages, getCampaignVideos } from '../controllers/mediaController.js';

const router =express.Router();

router.post('/create-campaign',upload, createCampaign);
router.get('/get-all-campaigns',getAllCampaigns);
router.get('/singlecampaign',getParticularCampaign)
router.get('/get-all-images',getAllCampaignImages)
router.get('/get-all-videos',getAllCampaignVideos)
router.get('/get-campaign-images',getCampaignImages)
router.get('/get-campaign-videos',getCampaignVideos)

export default router;
