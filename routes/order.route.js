import express from "express";
import { protect, protectAdmin } from "../middlewares/auth.middleware.js";
import {
  addOrder,
  deliveredOrderWithAdmin,
  getAllOrder,
  getAllOrderWithAdmin,
  getOrder,
  payOrder
} from "../controllers/order.controller.js";

const orderRoute = express.Router();

// CREATE ORDER
orderRoute.post("/", protect, addOrder);
// USER GET ALL ORDER
orderRoute.get("/", protect, getAllOrder);
// ADMIN GET ALL ORDER
orderRoute.get("/all", protect, protectAdmin, getAllOrderWithAdmin);
// GET ORDER BY ID
orderRoute.get("/:id", protect, getOrder);
// ORDER IS PAID
orderRoute.put("/:id/pay", protect, payOrder);
// ORDER IS DELIVERED WITH ADMIN
orderRoute.put("/:id/delivered", protect, protectAdmin, deliveredOrderWithAdmin);

export default orderRoute;
