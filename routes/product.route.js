import express from "express";
import { protect, protectAdmin } from "../middlewares/auth.middleware.js";
import {
  addProduct,
  addReview,
  deleteProduct,
  getAllProduct,
  getAllProductWithAdmin,
  getProduct, updateProduct
} from "../controllers/product.controller.js";

const productRoute = express.Router();

// GET ALL PRODUCT
productRoute.get("/", getAllProduct);
// GET ALL PRODUCT WITH ADMIN, WITHOUT SEARCH AND PAGINATION
productRoute.get("/all", protect, protectAdmin, getAllProductWithAdmin);
// GET SINGLE PRODUCT
productRoute.get("/:id", getProduct);
// PRODUCT REVIEW
productRoute.post("/:id/review", protect, addReview);
// DELETE PRODUCT WITH ADMIN
productRoute.delete("/:id", protect, protectAdmin, deleteProduct);
// CREATE PRODUCT WITH ADMIN
productRoute.post("/", protect, protectAdmin, addProduct);
// UPDATE PRODUCT WITH ADMIN
productRoute.put("/:id", protect, protectAdmin, updateProduct);

export default productRoute;
