import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { addChat, addGroup, addMember, getChat, removeMember, rename } from "../controllers/chat.controller.js";

const chatRoute = express.Router();

chatRoute.get("/", protect, getChat);
chatRoute.post("/", protect, addChat);
chatRoute.post("/group", protect, addGroup);
chatRoute.put("/rename", protect, rename);
chatRoute.put("/removemember", protect, removeMember);
chatRoute.put("/addmember", protect, addMember);

export default chatRoute;
