import express from 'express';
import { uploadFileToCloudinary } from '../utils/cloudinary.js';
import Member from '../models/member.model.js';
import { Members } from '../utils/members.js';




export const createMember=async(req, res, next) => {

    const {name,email,phone,city,state,country,userId}=req.body;
    const profileImg=req.files.profilePic[0].path;

    try {
        if(!name || !email || !city || !state || !country || !userId) {
            return res.status(400).json({message: 'All required fields must be provided'});
        }
        const user=await Member.findOne({userId:userId});
        if(user){
            return res.status(404).json({message: 'User already member'});
        }

        const pic=await uploadFileToCloudinary(profileImg);
        const newMember=new Member({name,email,userId,phone,address:{city,state,country},profilePic:pic});

        await newMember.save();
        res.status(201).json(newMember);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }

}

export const getAllMembers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided

        // Ensure page and limit are integers
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        // Calculate skip value
        const skip = (pageNumber - 1) * limitNumber;

        // Fetch members with pagination
        const members = await Member.find()
            .sort({ createdAt: -1 }) // Sort by creation date in descending order
            .skip(skip)
            .limit(limitNumber);

        if(!members.length>0){
            return res.status(404).json({ message: 'No members found' });
        }
        

        res.status(200).json(members);
    } catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const getMemberById=async(req, res) => {
    const {userId}=req.query;

    try {
        if(!userId){
            return res.status(400).json({message: 'User ID is required'});
        }
        const member = await Member.findOne({ userId: userId });
        if(!member){
            return res.status(404).json({message: 'Member not found'});
        }
        res.status(201).json(member);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const updateMemberPic = async (req, res) => {
    const { memberId } = req.body;
  
    try {
      // Validate memberId
      if (!memberId) {
        return res.status(400).json({ message: 'Member ID is required' });
      }
  
      // Validate file upload
      if (!req.files || !req.files.profilePic || req.files.profilePic.length === 0) {
        return res.status(400).json({ message: 'Profile picture is required' });
      }
  
      // Extract profile picture path
      const profileImg = req.files.profilePic[0].path;
  
      // Upload image to Cloudinary (assuming uploadFileToCloudinary is defined)
      const pic = await uploadFileToCloudinary(profileImg);
  
      // Update member's profile image
      const member = await Member.findByIdAndUpdate(
        memberId, 
        { profileImage: pic }, 
        { new: true } // Return the updated document
      );
  
      if (!member) {
        return res.status(404).json({ message: 'Member not found' });
      }
  
      // Send updated member details
      res.status(200).json(member);
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

  export const getEminentMembers=async(req,res)=>{
    try {
        const members=Members;
        res.status(200).json(members);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
        
    }
  }