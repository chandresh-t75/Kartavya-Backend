import express from 'express';
import DonationImage from "../models/donationimages.model.js";
import DonationVideo from "../models/donationVideos.model.js";
import { uploadFileToCloudinary } from '../utils/cloudinary.js';




export const uploadDonationMedia = async (req, res) => {
    const { caption, campaignId } = req.body; // Assuming these come from the frontend
  
    // Check if files are provided
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Please upload at least one image or video.' });
    }
  
    try {
      // Array to store the media URLs that were uploaded
      let uploadedMedia = [];
  
      // Iterate over each file in the uploaded files array
      for (let file of req.files) {
        let cloudinaryResponse;
        let mediaUrl;
        let newDonationMedia;
  
        if (file.mimetype.startsWith('image/')) {
          // Upload the image to Cloudinary
          cloudinaryResponse = await uploadFileToCloudinary(file)
  
          mediaUrl = cloudinaryResponse.secure_url; // Get the URL of the uploaded image
  
          // Create a new DonationImage object and save to DB
          newDonationMedia = new DonationImage({
            url: mediaUrl,
            caption: caption || '', // Optional caption
            campaign: campaignId, // Campaign reference
          });
  
          // Save the donation image
          await newDonationMedia.save();
  
          // Add to uploaded media list
          uploadedMedia.push({
            type: 'image',
            url: mediaUrl,
            caption: newDonationMedia.caption,
            campaign: newDonationMedia.campaign,
          });
  
        } else if (file.mimetype.startsWith('video/')) {
          // Upload the video to Cloudinary
          cloudinaryResponse = await uploadFileToCloudinary(file)
  
          mediaUrl = cloudinaryResponse.secure_url; // Get the URL of the uploaded video
  
          // Create a new DonationVideo object and save to DB
          newDonationMedia = new DonationVideo({
            url: mediaUrl,
            caption: caption || '', // Optional caption
            campaign: campaignId, // Campaign reference
          });
  
          // Save the donation video
          await newDonationMedia.save();
  
          // Add to uploaded media list
          uploadedMedia.push({
            type: 'video',
            url: mediaUrl,
            caption: newDonationMedia.caption,
            campaign: newDonationMedia.campaign,
          });
        }
       
      }
  
      // Return success response with all uploaded media details
      res.status(200).json({
        uploadedMedia
      });
    } catch (error) {
      console.error('Error uploading media:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  