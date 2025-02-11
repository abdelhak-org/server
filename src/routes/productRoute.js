// src/routes/productRoute.js
import { Router } from "express";
import { body } from "express-validator";
import productController  from "../controllers/productController.js";
import {authenticateToken} from "../middleware/auth.js";
const router = Router();
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct , getProductsByUserId } = productController;
// Get all products
router.get("/products", getAllProducts);

// Get single product
router.get("/products/:id", getProductsByUserId);
// Get products by user id
router.get("/products/user/:userId",  getProductsByUserId);
// Create product
router.post("/products", [
  body("title").notEmpty().withMessage("post title is required"),
  body("price").isNumeric().withMessage("Valid price is required"),
  body("description").notEmpty().withMessage("Description is required"),
], createProduct);

// Update product
router.put("/products/:id", [
  body("name").optional().notEmpty(),
  body("price").optional().isNumeric(),
  body("description").optional().notEmpty(),
], authenticateToken, updateProduct);

// Delete product
router.delete("/products/:id", deleteProduct);

export default router;
