import express from 'express';
import Campaign from "../models/campaign.model.js";
import { uploadFileToCloudinary } from '../utils/cloudinary.js';
import Like from '../models/like.model.js';




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


    export const updateCampaign = async (req, res) => {
      try {
        const { campaignId } = req.body; // Extract campaign ID from the request body
    
        // Validate campaignId existence
        if (!campaignId) {
          return res.status(400).json({ message: 'Campaign ID is required.' });
        }
    
        // Find the existing campaign
        const existingCampaign = await Campaign.findById(campaignId);
        if (!existingCampaign) {
          return res.status(404).json({ message: 'Campaign not found.' });
        }
    
        const updatedFields = {};
        const allowedFields = [
          'title',
          'description',
          'targetAmount',
          'collectedAmount',
          'location',
          'startDate',
          'endDate',
          'status'
        ];
    
        // Update fields dynamically based on the incoming request
        allowedFields.forEach((field) => {
          if (req.body[field] !== undefined && req.body[field] !== existingCampaign[field]?.toString()) {
            updatedFields[field] = req.body[field];
          }
        });
    
        // Handle the image field if a new file is uploaded
        if (req.files?.imageFile?.[0]?.path) {
          const cloudinaryResponse = await uploadFileToCloudinary(req.files.imageFile[0].path);
          updatedFields.image = cloudinaryResponse;
        }
    
        // Check if there are fields to update
        if (Object.keys(updatedFields).length === 0) {
          return res.status(400).json({ message: 'No updates provided.' });
        }
    
        // Apply updates to the existing campaign
        Object.keys(updatedFields).forEach((key) => {
          existingCampaign[key] = updatedFields[key];
        });
    
        // Save the updated campaign
        const updatedCampaign = await existingCampaign.save();
    
        res.status(200).json(updatedCampaign);
      } catch (error) {
        console.error('Error updating campaign:', error);
        res.status(500).json({ message: 'Internal server error.' });
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



export const likeCampaign = async (req, res) => {
  try {
    const { userId, campaignId } = req.body;

    // Validate input
    if (!userId || !campaignId) {
      return res.status(400).json({ message: 'User ID and Campaign ID are required' });
    }

    // Check if the campaign exists
    const campaignExists = await Campaign.findById(campaignId);
    if (!campaignExists) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Create a like record
    const newLike = new Like({ userId, campaignId });
    await newLike.save();

  
    campaignExists.likes += 1;
    await campaignExists.save();

    res.status(201).json(campaignExists);
  } catch (error) {
    if (error.code === 11000) { // Handle duplicate key error (unique index violation)
      return res.status(400).json({ message: 'You have already liked this campaign' });
    }
    console.error('Error liking campaign:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller to unlike a campaign
export const unlikeCampaign = async (req, res) => {
  try {
    const { userId, campaignId } = req.body;

    // Validate input
    if (!userId || !campaignId) {
      return res.status(400).json({ message: 'User ID and Campaign ID are required' });
    }

    // Check if the campaign exists
    const campaignExists = await Campaign.findById(campaignId);
    if (!campaignExists) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Find and delete the like record
    const deletedLike = await Like.findOneAndDelete({ userId, campaignId });

    if (!deletedLike) {
      return res.status(404).json({ message: 'Like not found' });
    }

    // Decrement likes count in the campaign
    campaignExists.likes -= 1;
    await campaignExists.save();

    res.status(200).json(campaignExists);
  } catch (error) {
    console.error('Error unliking campaign:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const isLikedByUser = async (req, res) => {
  const { userId, campaignId } = req.body;

  try {
    // Find the like record in the Like collection
    const like = await Like.findOne({ userId, campaignId });

    if (like) {
      return res.status(200).json({ isLiked: true });
    } else {
      return res.status(200).json({ isLiked: false });
    }
  } catch (error) {
    console.error('Error checking like status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};