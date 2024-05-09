import { Admin } from "../models/admin.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
// import bcrypt from "bcrypt"





const generateAccessAndRefreshToken = async (adminId) => {
    try {
        const admin = await Admin.findById(adminId)
        const accessToken = admin.generateAccessToken()
        const refreshToken = admin.generateRefreshToken()
        admin.refreshToken = refreshToken
        await admin.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")

    }
}

///////////////////////////////////////////////////////////////////
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


// Admin login starts here////////////////////////////////////////


const loginAdmin = asyncHandler(async(req, res) => {

    const {email, username, password} = req.body

    if(!(email || username)){
        throw new  ApiError(400, "Email or username are required field for login" )
    }

    const admin = await Admin.findOne({
        $or: [{ email }, { username }]
    })

    console.log(admin._id)

    if (!admin){
        throw new ApiError(404,"No admin found with this email or username")
    }
    // console.log(password, username, email)


    const isPasswordValid = await admin.isPasswordCorrect(password)
    // const isPasswordValid = await bcrypt.compare(password, admin.password);
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid password provided")
    }

    console.log(admin.password)

    

    const { accessToken, refreshToken} = await generateAccessAndRefreshToken(admin._id)
    

    const loggedInAdmin = await Admin.findById(admin._id)
    .select("-password -refreshToken")
    

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, 
        {admin: loggedInAdmin, accessToken, refreshToken}, 
        "Admin logged in successfully")
    )

})

// AdminLogOut section starts here///////////////////////////////////////////////////////////////

const logOutAdmin = asyncHandler(async (req, res) => {
    await Admin.findByIdAndUpdate(
         req.admin._id,
         {
             $set: {
                 refreshToken: undefined
             }
         },
         {
             new: true
         }
     )
 
     const options = {
         httpOnly: true,
         secure: true
     }
 
     return res
         .status(200)
         .clearCookie("accessToken", options)
         .clearCookie("refreshToken", options)
         .json(new ApiResponse(200, {}, "Admin Logged out successfully"))
 
 })

export{
    registerAdmin,
    loginAdmin,
    logOutAdmin
}
