import express from 'express';
import Campaign from "../models/campaign.model.js";
import { uploadFileToCloudinary } from '../utils/cloudinary.js';




export const createCampaign = async (req, res) => {
  
  
      try {
        
        const { title, description, endDate, startDate,targetAmount,location, createdBy } = req.body;
        const imageFile = req.files.imageFile[0].path; // Multer file data
        // console.log(title, description, endDate,startDate,targetAmount,location, createdBy,imageFile);
        // Validate inputs
        if (!title || !description  || !endDate || !startDate ) {
          return res.status(400).json({ message: 'All required fields must be provided' });
        }
        const parsedTarget = Number(targetAmount);
  
        // Upload the image to Cloudinary
        const cloudinaryResponse = await uploadFileToCloudinary(imageFile)
  
        // Create a new campaign object with image URL from Cloudinary
        const newCampaign = new Campaign({
          title,
          description,
          collectedAmount: 0, // Default value
          startDate:startDate, // Set start date to current date
          endDate,
          targetAmount:parsedTarget,
          location,
          createdBy,
          image: cloudinaryResponse, // Store the Cloudinary URL of the uploaded image
          
        });
  
        // Save the new campaign to the database
        const savedCampaign = await newCampaign.save();
  
        // Respond with the created campaign data
        res.status(201).json(
         savedCampaign,
        );
      } catch (error) {
        console.error('Error creating campaign:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };

   

    export const getAllCampaigns = async (req, res) => {
      try {
        const { status } = req.query;
    
        // Build the filter dynamically based on the `status` query
        let filter = {};
        if (status && status !== 'All') {
          filter.status = status; // Filter based on the provided status
        }
    
        // Fetch campaigns using the filter, sorted by creation date in descending order
        const campaigns = await Campaign.find(filter)
          .populate('createdBy', 'name email') // Populate createdBy field with user details
          .sort({ createdAt: -1 });
    
        res.status(200).json(campaigns);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };
    
  

export const getParticularCampaign = async(req,res)=>{
  const {campaignId} = req.query;
  try{

    if(!campaignId){
      return res.status(400).json({message: 'Campaign ID is required'});
    }
    const campaign = await Campaign.findById({_id:campaignId})
    res.status(200).json(campaign);

  }catch(error){
    console.error('Error fetching campaign:', error);
    res.status(500).json({message: 'Internal server error'});
  }
}