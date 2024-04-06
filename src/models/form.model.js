import mongoose, { Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";



const formSchema = new Schema({
    formFile:{
        type: String, //cloudinary url
        required: true
    },
    title:{
        type: String,
        required:true
    },

    views:{
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default:true
    },
    ownwer: {
        type: Schema.Types.ObjectId,
        ref:"Admin"
    }
})

formSchema.plugin(mongooseAggregatePaginate)


export const Forms = mongoose.model("Forms", formSchema);