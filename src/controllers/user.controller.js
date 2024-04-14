import asyncHandler from "../utils/asyncHandler.js";


const registrUser = asyncHandler( async (req, res) => { 
    res.status(200).json({ message: 'You have successfully registered!' })
})


export {registrUser}