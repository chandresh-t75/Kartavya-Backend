import express from 'express';
import { uploadFileToCloudinary } from '../utils/cloudinary.js';
import Member from '../models/member.model.js';




export const createMember=async(req, res, next) => {

    const {name,email,phone,city,state,country}=req.body;
    const profileImg=req.files.profilePic[0].path;

    try {
        if(!name || !email || !city || !state || !country){
            return res.status(400).json({message: 'All required fields must be provided'});
        }

        const pic=await uploadFileToCloudinary(profileImg);
        const newMember=new Member({name,email,phone,address:{city,state,country},profilePic:pic});

        await newMember.save();
        res.status(201).json(newMember);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }

}

export const getAllMembers=async(req, res) => {
    try {
        const members=await Member.find().sort({createdAt:-1});
        res.status(201).json(members);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }

}

export const getMemberById=async(req, res) => {
    const {memberId}=req.query;
    try {
        const member=await Member.findById({_id:memberId});
        if(!member){
            return res.status(404).json({message: 'Member not found'});
        }
        res.status(201).json(member);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}