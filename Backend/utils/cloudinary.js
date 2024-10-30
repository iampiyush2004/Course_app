// uploadOnCloudinary.js
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" });
        fs.unlinkSync(localFilePath); 
        return response.url; // Return the Cloudinary URL
    } catch (error) {
        fs.unlinkSync(localFilePath); // Clean  local file on failure
        throw error;
    }
};
const destroy = async (publicId) => {
    return cloudinary.uploader.destroy(publicId);
};

module.exports = { uploadOnCloudinary, destroy };
