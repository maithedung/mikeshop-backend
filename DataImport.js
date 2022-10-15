import express from "express";
import User from "./Models/UserModel.js";
import users from "./data/User.js";
import Product from "./Models/ProductModel.js";
import products from "./data/Products.js";
import asyncHandler from "express-async-handler";
import {protect, protectAdmin} from "./Middleware/AuthMiddleware.js";

const ImportData = express.Router()

// IMPORT USERS DATA WITH ADMIN
ImportData.post("/users", protect, protectAdmin, asyncHandler(
    async (req, res) => {
        await User.remove({})
        const importUser = await User.insertMany(users)
        res.send({importUser})
    })
)

// IMPORT PRODUCTS DATA WITH ADMIN
ImportData.post("/products", protect, protectAdmin, asyncHandler(
    async (req, res) => {
        await Product.remove({})
        const importProduct = await Product.insertMany(products)
        res.send({importProduct})
    })
)

export default ImportData;
