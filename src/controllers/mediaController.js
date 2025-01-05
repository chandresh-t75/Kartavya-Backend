import express from 'express';
import DonationImage from "../models/donationimages.model.js";
import DonationVideo from "../models/donationVideos.model.js";
import { uploadFileToCloudinary } from '../utils/cloudinary.js';




export const uploadDonationMedia = async (req, res) => {
    const { caption, campaignId } = req.body; // Assuming these come from the frontend
  
    // Check if files are provided
    if (!req.files || (req.files.imageFile && req.files.imageFile.length === 0 && req.files.donationVideos && req.files.donationVideos.length === 0)) {
      return res.status(400).json({ message: 'Please upload at least one image or video.' });
    }
   
  
    try {
        let uploadedMedia = [];
        
        // Handle image files
        if (req.files.imageFile) {
            for (let file of req.files.imageFile) {
                let cloudinaryResponse;
                let mediaUrl;
                let newDonationMedia;
                
                if (file.mimetype.startsWith('image/')) {
                 
                    mediaUrl = await uploadFileToCloudinary(file.path);
                   
                    // console.log(file.path, cloudinaryResponse);

                    newDonationMedia = new DonationImage({
                        url: mediaUrl,
                        caption: caption || '', // Optional caption
                        campaign: campaignId, // Campaign reference
                    });

                    await newDonationMedia.save();

                    uploadedMedia.push({
                        type: 'image',
                        url: mediaUrl,
                        caption: newDonationMedia.caption,
                        campaign: newDonationMedia.campaign,
                    });
                }
            }
        }

        // Handle video files
        if (req.files.donationVideos) {
            for (let file of req.files.donationVideos) {
                let cloudinaryResponse;
                let mediaUrl;
                let newDonationMedia;
                
                if (file.mimetype.startsWith('video/')) {
                  mediaUrl = await uploadFileToCloudinary(file.path);

                    newDonationMedia = new DonationVideo({
                        url: mediaUrl,
                        caption: caption || '', // Optional caption
                        campaign: campaignId, // Campaign reference
                    });

                    await newDonationMedia.save();

                    uploadedMedia.push({
                        type: 'video',
                        url: mediaUrl,
                        caption: newDonationMedia.caption,
                        campaign: newDonationMedia.campaign,
                    });
                }
            }
        }
      
        // Return success response with all uploaded media details
        res.status(200).json(uploadedMedia);
    } catch (error) {
        console.error('Error uploading media:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getCampaignImages = async (req, res) => {
  const { campaignId, page = 1, limit = 10 } = req.query; // Default page = 1, limit = 10
  try {
   
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;
    const images = await DonationImage.find({ campaign: campaignId })
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limitNumber);

    
    if (!images.length) {
      return res.status(404).json({ message: 'No images found for this campaign.' });
    }

    res.status(200).json(images);
  } catch (error) {
    // Handle server error
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


export const getCampaignVideos = async (req, res) => {
  const { campaignId, page = 1, limit = 10 } = req.query; // Default page = 1, limit = 10
  try {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;
    const videos = await DonationVideo.find({ campaign: campaignId })
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limitNumber);

    
    if (!videos.length) {
      return res.status(404).json({ message: 'No videos found for this campaign.' });
    }

    res.status(200).json(videos);
  } catch (error) {
    // Handle server error
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getAllCampaignImages = async (req, res) => {
  const {page = 1, limit = 10 } = req.query; // Default page = 1, limit = 10
  try {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;
    const images = await DonationImage.find({})
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limitNumber);

    
    if (!images.length) {
      return res.status(404).json({ message: 'No images found for this campaign.' });
    }

    res.status(200).json(images);
  } catch (error) {
    // Handle server error
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


export const getAllCampaignVideos = async (req, res) => {
  const { campaignId, page = 1, limit = 10 } = req.query; // Default page = 1, limit = 10
  try {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;
    const videos = await DonationVideo.find({})
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limitNumber);

    
    if (!videos.length) {
      return res.status(404).json({ message: 'No videos found for this campaign.' });
    }

    res.status(200).json(videos);
  } catch (error) {
    // Handle server error
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

