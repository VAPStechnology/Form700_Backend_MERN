import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
// import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import Jwt from "jsonwebtoken"


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")

    }
}

////////////////////////////////////////////


const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation- not empty
    // chwck if user already exists: userrname, email
    // check for image check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const { username, email, fullname, password } = req.body
    //console.log(email);
    if (
        [fullname, email, username, password].some((item) => item?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const containsAtSymbol = email.includes("@")
    if(!containsAtSymbol){
        throw new ApiError(400,"Email must have to contains @")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "This user with email or username already exists")
    }

    // const avatarLocalPath = req.files?.avatar[0]?.path;

    // if (!avatarLocalPath) {
    //     throw new ApiError(400, "Avatar is required")
    // }

    // const avatar = await uploadOnCloudinary(avatarLocalPath)

    // if (!avatar) {
    //     throw new Error(400, "Avatar was not uploaded to cloudinary")
    // }

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullname,
        password,
        // avatar: avatar.url
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, " Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )




})


// Login section starts here/////////


const loginUser = asyncHandler(async (req, res) => {
    const { email, password, username } = req.body;

    if (!(email || username)) {
        throw new ApiError(400, "Email or Username  are required fields")
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
    })
    if (!user) {
        throw new ApiError(404, "No user found with this email or username")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password provided")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).
        select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: loggedInUser, accessToken: accessToken, refreshToken: refreshToken
            },
                "Logged in successfully"
            )
        )



})

// log-Out section starts/////////

const logOutUser = asyncHandler(async (req, res) => {
   await User.findByIdAndUpdate(
        req.user._id,
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
        .json(new ApiResponse(200, {}, "Logged out successfully"))

})


//refresh AccessToken section starts here////////////

const refreshAccessToken = asyncHandler(async(req,res) =>{
  const incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request")
    }
   try {
    const decodedToken = Jwt.verify(
         incomingRefreshToken,
         process.env.ACCESS_TOKEN_SECRET
     )
     const user = await User.findById(decodedToken?._id)
 
     if (!user){
         throw new ApiError(401, "Invalid refresh token")
     }
 
     if(incomingRefreshToken !==user?.refreshToken){
         throw new ApiError(401,"Refresh token is expired or used")
     }
 
     const options = {
         httpOnly: true,
         secure: true
     }
 
    const { accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)
 
 
     return res
     .status(200).
     cookie("accessToken", accessToken, options).
     cookie("refreshToken", newRefreshToken, options).
     json(
         new ApiResponse(
             200,
             {accessToken, newRefreshToken},
             "Access token refreshed successfully"
         )
     )
   } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token")
   }
   


})

//////////////////Update controller starts here////////////////////

///password update section starts here////

const changeCurrentPassword = asyncHandler(async(req,res) => {
    const {oldPassword, newPassword, confPassword} = req.body

    if(!(newPassword === confPassword)){
        throw new ApiError(400, "Confirm Password doesn't match")
    }

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password change successfully"))
})

/// Current User fetching section starts here///

const getCurrentUser = asyncHandler(async(req,res)=>{
    return res 
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fetched successfully"))
})


/// Update accounts details starts here///////

const updateAccountDetails = asyncHandler(async(req,res)=>{
    const {fullname, email} = req.body
    if (!fullname || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{fullname, email}
        },
        {new: true}
    ).select("-password")
    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
})

/// Update Avatar section starts here///

// const updateUserAvatar = asyncHandler(async(req, res) => {
//     const avatarLocalPath = req.file?.path

//     if(!avatarLocalPath){
//         throw new ApiError(400, "Avatar file is Missing")
//     }

//     const avatar = await uploadOnCloudinary(avatarLocalPath)

//     if (!avatar.url){
//         throw new ApiError(400, "Error while uploading on avatar")

//     }
//     const user =  await User.findByIdAndUpdate(
//         req.user?._id,
//         {
//             $set:{avatar: avatar.url}
//         },
//         {new: true}
//     ).select("-password")

//     return res 
//     .status(200)
//     .json(
//         new ApiResponse(200, user, "Avatar updated successfully")
//     )

// })



///////////////////////////////////////////////////////////////////////////////////////////////////



export {
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    // updateUserAvatar

}