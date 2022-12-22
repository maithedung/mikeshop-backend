import express from "express";
import { protect, protectAdmin } from "../middlewares/auth.middleware.js";
import {
  getProfile,
  getAllUser,
  login,
  register,
  updateProfile,
  searchUser,
  getUser,
  deleteUser
} from "../controllers/user.controller.js";

const userRoute = express.Router();

// LOGIN
userRoute.post("/login", login);
// REGISTER
userRoute.post("/register", register);
// GET PROFILE
userRoute.get("/profile", protect, getProfile);
// UPDATE PROFILE
userRoute.put("/profile", protect, updateProfile);
// GET ALL USER WITH ADMIN
userRoute.get("/", protect, protectAdmin, getAllUser);
// SEARCH USER
userRoute.get("/search", protect, searchUser);
// GET USER
userRoute.get("/:id", protect, getUser);
// DELETE USER
userRoute.delete("/:id", protect, protectAdmin, deleteUser);

export default userRoute;
