import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { addMessage, getMessage } from "../controllers/message.controller.js";

const messageRoute = express.Router();

messageRoute.get("/:chatId", protect, getMessage);
messageRoute.post("/", protect, addMessage);

export default messageRoute;
