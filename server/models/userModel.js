import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
  name:{
    type:String,
    required:true,
    trim:true
  },
  email:{
    type:String,
    required:true,
    unique:true,
    trim:true
  },
  password:{
    type:String,
    required:true,
    select:false  
    // Matlab password normally database query me show nahi hoga
  },
  role:{
    type:String,
    enum:["user","admin"],
    default:"user"
  },
  accountVerified:{
    type:Boolean,
    default:false
  },
  borrowedBooks:[
    {
      bookId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Book"
      },
      returned:{
        type:Boolean,
        default:false
      },
      bookTitle:String,
      borrowDate:Date,
      dueDate:Date,
      },
  ],
  avatar:{
    url:String,
    public_id:String
  },
  resetPasswordToken:String,
  resetPasswordExpire:Date,
  verificationCode:Number,
  verificationCodeExpire:Date,
},
{
  timestamps:true,
}
);
export const User=mongoose.model("User",userSchema);