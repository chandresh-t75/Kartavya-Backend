import express from 'express';
import Campaign from "../models/campaign.model.js";
import { uploadFileToCloudinary } from '../utils/cloudinary.js';




export const createCampaign = async (req, res) => {
  
  
      try {
        
        const { title, description, endDate,startDate, createdBy } = req.body;
        console.log(req);
        const imageFile = req.files.imageFile[0].path; // Multer file data
        console.log(title, description, endDate,startDate, createdBy,imageFile);
        // Validate inputs
        if (!title || !description  || !endDate || !createdBy) {
          return res.status(400).json({ message: 'All required fields must be provided' });
        }
  
        // Upload the image to Cloudinary
        const cloudinaryResponse = await uploadFileToCloudinary(imageFile)
  
        // Create a new campaign object with image URL from Cloudinary
        const newCampaign = new Campaign({
          title,
          description,
          collectedAmount: 0, // Default value
          startDate:startDate, // Set start date to current date
          endDate,
          createdBy,
          image: cloudinaryResponse, // Store the Cloudinary URL of the uploaded image
          isActive: true, // Default value
        });
  
        // Save the new campaign to the database
        const savedCampaign = await newCampaign.save();
  
        // Respond with the created campaign data
        res.status(201).json({
         savedCampaign,
        });
      } catch (error) {
        console.error('Error creating campaign:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };
  