import express from "express";
import asyncHandler from "express-async-handler";
import Product from "../Models/ProductModel.js";
import { protect, protectAdmin } from "../Middleware/AuthMiddleware.js";

const productRoute = express.Router();

// GET ALL PRODUCT
productRoute.get("/", asyncHandler(async (req, res) => {
  const pageSize = 6;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword ? {
    name: {
      $regex: req.query.keyword, $options: "i"
    }
  } : {};
  const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1)).sort({ _id: -1 });
  const count = await Product.countDocuments({ ...keyword });
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
}));

// GET ALL PRODUCT WITH ADMIN, WITHOUT SEARCH AND PAGINATION
productRoute.get("/all", protect, protectAdmin, asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort(({ _id: -1 }));
  res.json(products);
}));

// GET SINGLE PRODUCT
productRoute.get("/:id", asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
}));

// PRODUCT REVIEW
productRoute.post("/:id/review", protect, asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }
    const review = {
      name: req.user.name, rating: Number(rating), comment, user: req.user._id
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Reviewed added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
}));

// DELETE PRODUCT WITH ADMIN
productRoute.delete("/:id", protect, protectAdmin, asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json({ message: "Product deleted" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
}));

// CREATE PRODUCT WITH ADMIN
productRoute.post("/", protect, protectAdmin, asyncHandler(async (req, res) => {
  const { name, price, description, image, countInStock } = req.body;
  const productExist = await Product.findOne({ name });
  if (productExist) {
    res.status(400);
    throw new Error("Product name already exist");
  } else {
    const product = new Product({
      name, price, description, image, countInStock, user: req.user._id
    });
    if (product) {
      const createdProduct = await product.save();
      res.status(201).json(createdProduct);
    } else {
      res.status(400);
      throw new Error("Invalid product data");
    }
  }
}));

// UPDATE PRODUCT WITH ADMIN
productRoute.put("/:id", protect, protectAdmin, asyncHandler(async (req, res) => {
  const { name, price, description, image, countInStock } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.countInStock = countInStock || product.countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
}));

export default productRoute;
