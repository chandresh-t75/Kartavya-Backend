import fs from 'fs';

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadFileToCloudinary = async (localFilePath) => {
    console.log(process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_API_SECRET)
    try {
        if (!localFilePath) return null;

        console.log('localfilepath', localFilePath);

        const res = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
            secure_url: true,
        });

        console.log('file uploaded successfully', res.secure_url);
        fs.unlinkSync(localFilePath);
        return res.secure_url;

    } catch (error) {
        console.log('Error occured while uploading file on cloudinary', error.message);
        fs.unlinkSync(localFilePath);
        return null;
    }
}