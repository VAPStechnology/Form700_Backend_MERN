import mongoose, { Schema} from "mongoose";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt"


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,

    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index: true

    },
    // avatar: {
    //     type: String,//cloudinary url
    //     required:true,
    // },
    completedFormHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Form"
        }
    ],
    password: {
        type: String,
        required:[true,"Please provide a password"]
    },
    refreshToken: {
        type: String
    }
},


{ timestamps: true}

)


userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12); 
  //bcrypt password before saving to database
  next(); 
})

userSchema.methods.isPasswordCorrect = async  function (password){
  return await bcrypt.compare(password, this.password), "Please provide a correct password"
}

userSchema.methods.generateAccessToken = function(){
   return Jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
   return Jwt.sign(
        {
            _id: this._id,
           

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}




export const User= mongoose.model("User", userSchema)