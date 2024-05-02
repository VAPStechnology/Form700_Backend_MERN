import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Forms } from "../models/form.model.js";



// form input srctions starts here////////////////////////////////

const createForm = asyncHandler(async (req, res) => {


    const { firstName, lastName, email, phone, acNo, address, state, dateOfBirth, licenseState, ssn, bankName, loanAmount, city, zip, licenseNumber, ipAddress } = req.body;

    // console.log(data)


    if (!firstName || !lastName || !email || !phone || !acNo || !address || !state || !dateOfBirth || !licenseState || !ssn || !bankName || !loanAmount || !city || !zip || !licenseNumber || !ipAddress) {

        throw new ApiError('Please provide all the required data');

    };

    const existedUser = await Forms.findOne({
        $or: [{ phone }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "form already submitted")
    }


    const form = await Forms.create({  firstName,
        lastName,
        email,
        phone,
        acNo,
        address,
        state,
        dateOfBirth,
        licenseState,
        ssn,
        bankName,
        loanAmount,
        city,
        zip,
        licenseNumber,
        ipAddress});



    const createdForm = await Forms.findById(form._id)

    if (!createdForm) {
        throw new ApiError(500, " Something went wrong while creating forms")
    }



    return res
        .status(200)
        .json(new ApiResponse("Form created successfully", 200, createdForm));

})



export {
    createForm
}