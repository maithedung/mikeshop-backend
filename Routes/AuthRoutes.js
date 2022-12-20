import express from "express";
import speakeasy from "speakeasy";
import User from "../Models/UserModel.js";
import asyncHandler from "express-async-handler";
import { protect } from "../Middleware/AuthMiddleware.js";
import { USER_NOT_FOUND } from "../error_messages.js";

const authRoute = express.Router();

authRoute.post("/generate", protect, asyncHandler(async (req, res) => {
  const { userId, email } = req.body;
  const user = await User.findById(userId);

  if (user) {
    try {
      const { ascii, hex, base32, otpauth_url } = speakeasy.generateSecret({
        issuer: "MikeShop",
        name: `MikeShop (${email})`,
        length: 15
      });
      user.ascii = ascii;
      user.hex = hex;
      user.base32 = base32;
      user.otpauth_url = otpauth_url;
      const updatedUser = await user.save();
      res.status(200).json({
        _id: updatedUser._id,
        base32: updatedUser.base32,
        otpauth_url: updatedUser.otpauth_url
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Error generating secret key" });
    }
  } else {
    res.status(404);
    throw new Error(USER_NOT_FOUND);
  }
}));

authRoute.post("/verify", asyncHandler(async (req, res) => {
  const { userId, token } = req.body;
  const user = await User.findById(userId);

  if (user) {
    try {
      const { base32 } = user;
      const verified = speakeasy.totp.verify({
        secret: base32,
        encoding: "base32",
        token
      });
      if (verified) {
        user.otp_enabled = true;
        user.otp_verified = true;
        const updatedUser = await user.save();
        res.status(200).json({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          otp_enabled: updatedUser.otp_enabled,
          otp_verified: updatedUser.otp_verified
        });
      } else {
        res.status(401).json({
          status: "fail",
          message: "Token is invalid!"
        });
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Error retrieving user" });
    }
  } else {
    res.status(404);
    throw new Error(USER_NOT_FOUND);
  }
}));

authRoute.post("/validate", asyncHandler(async (req, res) => {
  const { userId, token } = req.body;
  const user = await User.findById(userId);

  if (user) {
    try {
      const { base32 } = user;
      const validToken = speakeasy.totp.verify({
        secret: base32,
        encoding: "base32",
        token,
        window: 1
      });
      if (validToken) {
        res.status(200).json({
          otp_valid: true,
        });
      } else {
        res.status(401).json({
          status: "fail",
          message: "Token is invalid!"
        });
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Error retrieving user" });
    }
  } else {
    res.status(404);
    throw new Error(USER_NOT_FOUND);
  }
}));

authRoute.post("/disable", asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);

  if (user) {
    try {
      user.otp_enabled = false;
      user.otp_verified = false;
      const updatedUser = await user.save();
      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        otp_enabled: updatedUser.otp_enabled,
        otp_verified: updatedUser.otp_verified
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Error retrieving user" });
    }
  } else {
    res.status(404);
    throw new Error(USER_NOT_FOUND);
  }
}));


export default authRoute;
