import express from 'express';
import { createCampaign, getAllCampaigns, getParticularCampaign, isLikedByUser, likeCampaign, unlikeCampaign, updateCampaign } from '../controllers/campaignController.js';
import { upload } from '../utils/multer.js';
import { getAllCampaignImages, getAllCampaignVideos, getCampaignImages, getCampaignVideos } from '../controllers/mediaController.js';

const router =express.Router();

router.post('/create-campaign',upload, createCampaign);
router.put('/update-campaign',upload, updateCampaign);
router.get('/get-all-campaigns',getAllCampaigns);
router.get('/singlecampaign',getParticularCampaign)
router.get('/get-all-images',getAllCampaignImages)
router.get('/get-all-videos',getAllCampaignVideos)
router.get('/get-campaign-images',getCampaignImages)
router.get('/get-campaign-videos',getCampaignVideos)
router.post('/like-campaign', likeCampaign);
router.post('/unlike-campaign', unlikeCampaign);
router.post('/is-liked',isLikedByUser)



export default router;
