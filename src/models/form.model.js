import mongoose, { Schema} from "mongoose";
// import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";



const formSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    acNo: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    licenseState: {
        type: String,
        required: true
    },
    ssn: {
        type: String,
        required: true
    },
    bankName: {
        type: String,
        required: true
    },
    loanAmount: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    licenseNumber: {
        type: String,
        required: true
    },
    ipAddress: {
        type: String,
        required: true
    }
},


{ timestamps: true})

// formSchema.plugin(mongooseAggregatePaginate)


export const Forms = mongoose.model("Forms", formSchema);