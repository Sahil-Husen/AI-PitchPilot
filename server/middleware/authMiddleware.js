import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

const protectedMiddleware = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Beared")
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    console.log("token is : ",token);

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized, No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Not authorized, token failed", error: error.message });
  }
};


export default protectedMiddleware;