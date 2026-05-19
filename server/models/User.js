import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,  
  },
  username: {
    type: String,
    required: true,
  },
  isVerified: {  
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
  },
  otpExpiry: { // Fix 3: moved out of `otp`, now a sibling field
    type: Date,
  },
});

userSchema.pre("save", async function () {  // ← remove `next` parameter
  if (!this.isModified("password")) {
    return;  // ← just return, no next()
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // ← nothing needed here either
});
userSchema.methods.comparePassword = async function (candidatePassword) { // Fix 5 & 6: removed `()` from assignment, changed arrow fn to regular fn
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);