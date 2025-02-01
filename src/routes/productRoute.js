// src/routes/productRoute.js
import { Router } from "express";
import { body } from "express-validator";
import productController  from "../controllers/productController.js";

const router = Router();
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = productController;
// Get all products
router.get("/products", getAllProducts);

// Get single product
router.get("/products/:id", getProductById);

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
], updateProduct);

// Delete product
router.delete("/products/:id", deleteProduct);

export default router;
