import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Forms } from "../models/form.model.js";
import { User } from "../models/user.model.js";



// form input srctions starts here////////////////////////////////

const createForm = asyncHandler(async (req, res) => {


    const { firstName, 
        lastName, 
        emailId, 
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
        ipAddress } = req.body;


    const user = req.user;

    // console.log(Loginuser)


    if (!firstName 
        || !lastName 
        || !emailId 
        || !phone 
        || !acNo 
        || !address 
        || !state 
        || !dateOfBirth 
        || !licenseState 
        || !ssn 
        || !bankName 
        || !loanAmount 
        || !city 
        || !zip 
        || !licenseNumber 
        || !ipAddress
        || !user) {

        throw new ApiError('Please provide all the required data');

    };

    // const existedForm = await Forms.findOne(Loginuser._ObjectId)
    // console.log(existedForm)

    // if (existedForm) {
    //     throw new ApiError(409, "form already submitted")
    // }


    const form = await Forms.create({
        firstName,
        lastName,
        emailId,
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
        ipAddress,
        user: user._id
    });



    const createdForm = await Forms.findById(form._id)

    if (!createdForm) {
        throw new ApiError(500, " Something went wrong while creating forms")
    }



    return res
        .status(200)
        .json(new ApiResponse(
            "Form created successfully",
             200, 
             createdForm));

})


////////////////////////////////////////////////////////////////////////////////////////////

// form count section starts here////////////////////////////////////

const formCount = asyncHandler(async (req, res) => {

    try {
        const username = req.params.userId;

        const user = await User.findOne({ username }).exec()

        // console.log(req)

        // MongoDB aggregation query to count form submissions by user
        const count = await Forms.aggregate([
            { $match: { user: user._id } },
            { $count: 'total' }
        ]);

        // console.log(count)

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                { count: count.length > 0 ? count[0].total : 0 },
                 "Forms count fetched successfully"))



    } catch (error) {
        // console.error(error);
        throw new ApiError(500, 'Form Counting Failed..')
    }

})


export {
    createForm,
    formCount
}