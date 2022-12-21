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

const orderRouter = express.Router();

// CREATE ORDER
orderRouter.post("/", protect, addOrder);
// USER GET ALL ORDER
orderRouter.get("/", protect, getAllOrder);
// ADMIN GET ALL ORDER
orderRouter.get("/all", protect, protectAdmin, getAllOrderWithAdmin);
// GET ORDER BY ID
orderRouter.get("/:id", protect, getOrder);
// ORDER IS PAID
orderRouter.put("/:id/pay", protect, payOrder);
// ORDER IS DELIVERED WITH ADMIN
orderRouter.put("/:id/delivered", protect, protectAdmin, deliveredOrderWithAdmin);

export default orderRouter;
