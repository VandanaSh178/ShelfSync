import mongoose from "mongoose";
// Mongoose MongoDB ke saath interact karne ke liye use hota hai
import jwt from "jsonwebtoken";
import crypto from "crypto";  

// User Schema (Database structure)
const userSchema = new mongoose.Schema(
{
  name:{
    type:String,        
    required:true,      // Name mandatory hai
    trim:true           // Extra spaces automatically remove ho jayenge
  },

  email:{
    type:String,
    required:true,      // Email mandatory hai
    unique:true,        // Same email dobara store nahi ho sakta
    trim:true,
    lowercase:true      // Email automatically lowercase ho jayega
  },

  password:{
    type:String,
    required:true,
    minlength:6,        // Minimum password length
    select:false        // Password queries me return nahi hoga
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

  // Borrowed books ka record
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
      dueDate:Date
    },
  ],

  // User avatar
  avatar:{
    url:String,
    public_id:String
  },

  // Password reset fields
  resetPasswordToken:String,
  resetPasswordExpire:Date,

  // OTP verification fields
  verificationCode:Number,
  verificationCodeExpire:Date

},
{
  timestamps:true
}
);


// OTP generate method
userSchema.methods.generateVerificationCode = function(){

  function generateRandomFiveDigitCode() {

    const firstDigit = Math.floor(Math.random() * 9) + 1;

    const otherDigits = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4,'0');

    return parseInt(firstDigit + otherDigits);
  }

  const verificationCode = generateRandomFiveDigitCode();

  this.verificationCode = verificationCode;

  // 15 minutes expiry
  this.verificationCodeExpire = Date.now() + 15 * 60 * 1000;

  return verificationCode;
};

userSchema.methods.generateToken = function(){
  return jwt.sign({id:this._id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

userSchema.methods.generatePasswordResetToken = function(){
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes expiry  

  return resetToken;
};

// User Model
const User = mongoose.model("User", userSchema);

export default User;