import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import {
  INVALID_EMAIL_OR_PASSWORD,
  INVALID_USER_DATA,
  USER_ALREADY_EXISTS,
  USER_NOT_FOUND
} from "../utils/errorMessage.js";

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
      createdAt: user.createdAt,
      otp_enabled: user.otp_enabled,
      otp_verified: user.otp_enabled
    });
  } else {
    res.status(401);
    throw new Error(INVALID_EMAIL_OR_PASSWORD);
  }
});

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error(USER_ALREADY_EXISTS);
  }

  const user = await User.create({
    name, email, password
  });

  if (user) {
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error(INVALID_USER_DATA);
  }
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      otp_enabled: user.otp_enabled,
      otp_verified: user.otp_enabled
    });
  } else {
    res.status(404);
    throw new Error(USER_NOT_FOUND);
  }
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
      createdAt: updatedUser.createdAt
    });
  } else {
    res.status(404);
    throw new Error(USER_NOT_FOUND);
  }
});

const getAllUser = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

export {
  login,
  register,
  getProfile,
  updateProfile,
  getAllUser
};
