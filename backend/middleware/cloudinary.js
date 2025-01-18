import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,    // Your cloud name
    api_key: process.env.CLOUD_API_KEY,    // Your API key
    api_secret: process.env.CLOUD_API_SECRET,  // Your API secret
});
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return;
        //upload file on cloudinary
        const uploadResult = await cloudinary.uploader
            .upload(localFilePath, {
                resource_type: "auto"
            })
        fs.unlinkSync(localFilePath)//remove the locally saved file after uploading cloudinary...
        return uploadResult.url;
    }
    catch (error) {
        fs.unlinkSync(localFilePath)//remove the locally saved file as upload opration failed...
        console.log(error);
    }
};

export default uploadOnCloudinary;