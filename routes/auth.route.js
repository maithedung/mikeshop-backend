import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { disable, generate, validate, verify } from "../controllers/auth.controller.js";

const authRoute = express.Router();

authRoute.post("/generate", protect, generate);
authRoute.post("/verify", protect, verify);
authRoute.post("/validate", protect, validate);
authRoute.post("/disable", protect, disable);

export default authRoute;
