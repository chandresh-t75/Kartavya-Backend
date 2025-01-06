import express from 'express';
import User from '../models/user.model.js';
import bcrypt from "bcryptjs"
import emailValidator from "email-validator"
import jwt from 'jsonwebtoken';
import crypto from "crypto";
import nodemailer from "nodemailer";
import { uploadFileToCloudinary } from '../utils/cloudinary.js';
import Badge from '../models/badges.model.js';
import VerificationCode from '../models/verficationCode.model.js';

export const createUser = async (req, res) => {
  const { name, email, password, phone } = req.body;
  const profileImg = req?.files?.profilePic?.[0]?.path;

 
  if (!emailValidator.validate(email)) {
    return res.status(400).json({ message: 'Invalid email address.' });
  }

  // Validate name
  if (!name) {
    return res.status(400).json({ message: 'Name is required.' });
  }

  // Validate password
  if (!password) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  try {
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    // Upload profile image if provided
    let imgUrl = 'https://example.com/default-avatar.png';
    if (profileImg) {
      imgUrl = await uploadFileToCloudinary(profileImg);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      pic: imgUrl || null,
      resetPasswordToken: crypto.randomBytes(20).toString('hex'),
      resetPasswordExpires: Date.now() + 10 * 60 * 1000, // 10 minutes expiry time
    });

    const savedUser = await newUser.save();

    // Create a default badge for the new user
    const defaultBadge = new Badge({
      title: 'Welcome Badge',
      description: 'Awarded for joining the platform.',
      milestoneAmount: 0, // Default milestone for new users
      userId: savedUser._id,
      icon: 'https://img.icons8.com/?size=200&id=WHAG7xx9qQ8X&format=png', // Provide a default badge icon
    });

    await defaultBadge.save();

    // Respond with created user details
    const { password: _, ...createdUser } = savedUser.toObject();
    res.status(201).json({
      user: createdUser,
      badge: defaultBadge,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
  

  export const loginUser = async (req, res) => {
    const { email, password } = req.query;
  
    // Validate email using email-validator
    if (!emailValidator.validate(email)) {
      return res.status(400).json({ message: 'Invalid email address.' });
    }
  
    if (!password) {
      return res.status(400).json({ message: 'Password is required.' });
    }
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password.' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password.' });
      }
  
      const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
  
      res.status(200).json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
    });
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  };

  export const getUser=async(req, res) => {
       const {userId}=req.query;
       if(!userId){
        return res.status(400).json({ message: 'User id is required.' });
       }

       const user=await User.findById({_id: userId});

       

       if(!user){
        return res.status(404).json({ message: 'User not found.' });
       }
       const {password:_,...userData}=user.toObject();
       return res.status(200).json(userData);

  }

  export const updateProfilePic=async(req, res) => {
     
       const {userId}=req.body;
       const profileImg=req.files.profilePic[0].path;
     
       if(!userId){
        return res.status(400).json({ message: 'User id is required.' });
       }
       const imgUrl=await uploadFileToCloudinary(profileImg);
       const updatedUser=await User.findByIdAndUpdate({_id: userId},{pic:imgUrl},{new: true});
       if(!updatedUser){
        return res.status(404).json({ message: 'User not found.' });
       }

       const {password:_,...userData}=updatedUser.toObject();
       return res.status(200).json(userData);
  }

  export const updateProfile=async(req, res) => {
     
    const {userId,name}=req.body;
  
    if(!userId){
     return res.status(400).json({ message: 'User id is required.' });
    }
    const updatedUser=await User.findByIdAndUpdate({_id: userId},{name},{new: true});
    if(!updatedUser){
     return res.status(404).json({ message: 'User not found.' });
    }

    const {password:_,...userData}=updatedUser.toObject();
    return res.status(200).json(userData);
}


export const getUserBadges = async (req, res) => {
  const { userId } = req.query;  // Extract userId from the request params

  try {
    // Find badges where the userId matches the provided userId, and sort by createdAt (descending)
    const badges = await Badge.find({ userId }).sort({ createdAt: -1 });

    if (badges.length === 0) {
      return res.status(404).json({ message: 'No badges found for this user.' });
    }

    // Respond with the list of badges
    return res.status(200).json(badges);
  } catch (error) {
    console.error('Error fetching badges:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};


  export const forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User with this email does not exist.' });
      }
  
      // Generate reset token and expiry
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
  
      // Save token and expiry in user document
      user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      user.resetPasswordExpires = resetTokenExpiry;
      await user.save();
  
      // Create deep link for resetting the password
      const resetLink = `https://kartavya.com/reset-password/${resetToken}`;

  
      // Configure the email transporter
      const transporter = nodemailer.createTransport({
        service: 'Gmail', // Use Gmail as the email service
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      // Define the email content with improved UI
      const mailOptions = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: 'Kartavya Password Reset',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="text-align: center; color: #4CAF50;">Kartavya Password Reset</h2>
            <p>Hi <strong>${user.name}</strong>,</p>
            <p>We received a request to reset the password for your Kartavya account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${resetLink}" 
                style="
                  display: inline-block;
                  padding: 10px 20px;
                  font-size: 16px;
                  color: #fff;
                  background-color: #4CAF50;
                  text-decoration: none;
                  border-radius: 5px;
                  font-weight: bold;
                ">
                Reset Password
              </a>
            </div>
            <p>If you are unable to click the button, copy and paste the following link into your browser:</p>
            <p><a href="${resetLink}" style="word-break: break-word; color: #4CAF50;">${resetLink}</a></p>
            <p>If you did not request this, please ignore this email.</p>
            <p>Best regards,<br>Kartavya Team</p>
          </div>
        `,
      };
      
  
      // Send the email
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({
        message: 'Password reset email sent successfully.',
      });
    } catch (error) {
      console.error('Error in forgotPassword:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  };


  export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
  
    if (!newPassword) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }
  
    try {
      // Find user by token and check if token has expired
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token.' });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update user's password and clear the token fields
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
  
      await user.save();
  
      res.status(200).json({
        message: 'Password reset successfully. You can now log in with your new password.',
      });
    } catch (error) {
      console.error('Error in resetPassword:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  };



  export const sendVerificationEmail = async (req, res) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
      }
  
      // Generate a random 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000);
  
      // Save the verification code to the database
      await VerificationCode.create({ email, code: verificationCode });
  
      // Configure Nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email service
        auth: {
          user: process.env.EMAIL, // Your email from environment variable
          pass: process.env.EMAIL_PASS // Your email password from environment variable
        }
      });
  
      // Define the HTML email content
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="text-align: center; color: #4CAF50;">Verify Your Email Address</h2>
          <p style="font-size: 16px; color: #555;">
            Hello,
          </p>
          <p style="font-size: 16px; color: #555;">
            Thank you for signing up. To complete your email verification, please use the following code:
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="display: inline-block; padding: 10px 20px; font-size: 20px; font-weight: bold; color: #4CAF50; background-color: #f9f9f9; border: 1px solid #4CAF50; border-radius: 5px;">
              ${verificationCode}
            </span>
          </div>
          <p style="font-size: 16px; color: #555;">
            This code is valid for the next <strong>5 minutes</strong>. If you didn’t request this email, please ignore it.
          </p>
          <p style="font-size: 16px; color: #555;">
            Best regards,<br>
            Team Kartavya
          </p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; text-align: center; color: #aaa;">
            If you have any questions, please contact us at <a href="mailto:support@kartvya.com" style="color: #4CAF50;">support@kartavya.com</a>.
          </p>
        </div>
      `;
  
      // Send the email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Email Address',
        html: htmlContent
      });
  
      return res.status(200).json({ success: true, message: 'Verification email sent successfully.' });
    } catch (error) {
      console.error('Error sending verification email:', error);
      return res.status(500).json({ success: false, message: 'Failed to send verification email.' });
    }
  };
  


export const verifyEmailCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ success: false, message: 'Email and verification code are required.' });
    }

    // Find the verification code in the database
    const record = await VerificationCode.findOne({ email, code });

    if (!record) {
      return res.status(400).json({ success: false, message: 'Invalid verification code.' });
    }

    // Optionally, delete the verification record after successful verification
    await VerificationCode.deleteOne({ email, code });

    return res.status(200).json({ success: true, message: 'Email verified successfully.' });
  } catch (error) {
    console.error('Error verifying email:', error);
    return res.status(500).json({ success: false, message: 'Failed to verify email.' });
  }
};

