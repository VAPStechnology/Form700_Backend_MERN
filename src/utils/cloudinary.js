import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';

cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});


const uploadOnCloudinary = async (localFilePath) =>{
    try {
        if (!localFilePath) return null;
        //upload the file on cloudinary
       const response = await cloudinary.uploader.upload(localFilePath, { resource_type: 'auto' });
       // file has been uploaded successfully
       console.log("file is uploaded on cloudinary", response.url);
       return response;

        
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the temp file if operation got faild.
        return null;
    }
}

export default uploadOnCloudinary


