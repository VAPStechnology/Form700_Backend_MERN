import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";


const registrUser = asyncHandler( async (req, res) => { 
 // get user details from frontend
 // validation- not empty
 // chwck if user already exists: userrname, email
 // check for image check for avatar
 // upload them to cloudinary, avatar
 // create user object - create entry in db
 // remove password and refresh token field from response
 // check for user creation
 // return res

  const { username, email,fullname, password } = req.body
  //console.log(email);
  if (
    [fullname, email, username, password].some((item)=> item?.trim() === "")
  ){
    throw new ApiError(400, "All fields are required")
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (existedUser){
     throw new  ApiError(409, "This user with email or username already exists")
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;

  if(!avatarLocalPath){
    throw new ApiError(400, "Avatar is required")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)

  if (!avatar){
     throw new Error(400, "Avatar was not uploaded to cloudinary")
  }

   const user = await User.create({
     username: username.toLowerCase(),
      email, 
      fullname,
      password,
    avatar: avatar.url })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500, " Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser, "User registered successfully" )
    )




})


export {registrUser}