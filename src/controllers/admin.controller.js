import { Admin } from "../models/admin.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";




const registerAdmin = asyncHandler(async(req, res) => {

    const {username,password,email } = req.body;

    if(!username || !password || !email) {
        throw new ApiError(400,"Please provide all the required fields for registration")
    }

    const existedAdmin = await Admin.findOne({
        $or:[{username},{email}]
    })

    if(existedAdmin){
        throw new ApiError(409,"This admin is already registered")
    }

    const admin = await Admin.create({ 
        username: username.toLowerCase(), 
        password, 
        email } )

    const createdAdmin = await Admin.findById(admin._id).select(
        "-password -refreshToken")

        if (!createdAdmin){
            throw new ApiError(500, "Something went wrong while registering the Admin")
        }

        return res
        .status(200)
        .json(new ApiResponse(201, createdAdmin, "Admin register Successfully"))


   




})

export{
    registerAdmin,
}
