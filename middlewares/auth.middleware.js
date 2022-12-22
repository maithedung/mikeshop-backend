import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import speakeasy from "speakeasy";

const protect = asyncHandler(async (req, res, next) => {
  let token;
  const header = req.headers.authorization;

  if (header && header.startsWith("Bearer")) {
    try {
      token = header.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized. Token failed!");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized. No token!");
  }
});

const auth2FA = asyncHandler(async (req, res, next) => {
  const { otp_enabled, otp_verified, base32 } = req.user;
  // if (otp_enabled && otp_verified) {
  //   try {
  //     const validToken = speakeasy.totp.verify({
  //       secret: base32,
  //       encoding: "base32",
  //       token,
  //       window: 1
  //     });
  //     if (validToken) {
  //       res.status(200).json({
  //         otp_valid: true
  //       });
  //     } else {
  //       res.status(401).json({
  //         status: "fail",
  //         message: "Token is invalid!"
  //       });
  //     }
  //   } catch (e) {
  //     console.error(e);
  //     res.status(500).json({ message: "Error retrieving user" });
  //   }
  // } else {
  //   next();
  // }
});

const protectAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an Admin");
  }
};

export {
  protect,
  auth2FA,
  protectAdmin
};
