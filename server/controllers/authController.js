import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import cookie_parser from "cookie-parser";
import generateToken from "../config/generateToken.js";

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({
        message: "Invalid Email Format",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already registered",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
      username,
      email,
      password,
      otp,
      otpExpiry,
    });

    try {
      await sendEmail({
        to: email,
        subject: "Your OTP for AI Cold Mail Generator",
        text: `Your OTP code is ${otp}. It is valid only for 10 minutes!`,
      });
    } catch (error) {
      console.log("Error during OTP process", error);

      return res.status(500).json({
        message: "Error in sending OTP email",
        error: error.message,
      });
    }

    return res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      userId: user._id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
     

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Email already verified", // fix: was misleading "User already Exists"
      });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        message: "OTP has expired", // fix: typo "OPT"
      });
    }

    if (user.otp !== otp) {
      // fix: added missing OTP comparison
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    user.isVerified = true;
    user.otp = null; // fix: null instead of undefined
    user.otpExpiry = null;
    const token = generateToken(user._id);

    await user.save();

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      message: "Email verified successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error in verifying OTP",
      error: error.message,
    });
  }
};

// login

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  // console.log(email,password);
  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password required",
      });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({
        message: "Invalid Email Format",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User does not exists",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: "User not Verified. Please verify your Email First",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    return res.status(200).json({
      message: "Login Successful",
      user: {
        username: user.username,
        email: user.email,
      },
        _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      message: 'Login successful!'
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error logging in",
      error: error.message,
    });
  }
};

// authController.js
export default { register: registerUser, verifyOtp, loginUser }; // rename key to `register`
