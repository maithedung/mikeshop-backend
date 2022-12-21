import express from "express";
import User from "../models/user.model.js";
import users from "../data/users.js";
import Product from "../models/product.model.js";
import products from "../data/products.js";
import asyncHandler from "express-async-handler";
import { protect, protectAdmin } from "../middlewares/auth.middleware.js";

const importData = express.Router();

// IMPORT USERS DATA WITH ADMIN
importData.post("/users", protect, protectAdmin, asyncHandler(
  async (req, res) => {
    await User.remove({});
    const importUser = await User.insertMany(users);
    res.send({ importUser });
  })
);

// IMPORT PRODUCTS DATA WITH ADMIN
importData.post("/products", protect, protectAdmin, asyncHandler(
  async (req, res) => {
    await Product.remove({});
    const importProduct = await Product.insertMany(products);
    res.send({ importProduct });
  })
);

export default importData;
