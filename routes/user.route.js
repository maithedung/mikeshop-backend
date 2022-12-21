import express from "express";
import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import { protect, protectAdmin } from "../middlewares/auth.middleware.js";
import {
  INVALID_EMAIL_OR_PASSWORD,
  INVALID_USER_DATA,
  USER_ALREADY_EXISTS,
  USER_NOT_FOUND
} from "../utils/errorMessage.js";
import { getProfile, getAllUser, login, register, updateProfile } from "../controllers/user.controller.js";

const userRouter = express.Router();

// LOGIN
userRouter.post("/login", login);
// REGISTER
userRouter.post("/register", register);
// GET PROFILE
userRouter.get("/profile", protect, getProfile);
// UPDATE PROFILE
userRouter.put("/profile", protect, updateProfile);
// GET ALL USER WITH ADMIN
userRouter.get("/", protect, protectAdmin, getAllUser);

export default userRouter;
