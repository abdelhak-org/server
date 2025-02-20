// src/routes/productRoute.js
import { Router } from "express";
import { body } from "express-validator";
import productController  from "../controllers/productController.js";
import {verifyToken , authenticateToken} from "../middleware/auth.js";
const router = Router();
const { getAllProducts, getProductById, createProduct,
   updateProduct, deleteProduct , getProductsByUserId  , deactivateProduct} = productController;

/**
 *  get /products
 *  get/products/:id
 *  get/verifytoken/products/user/:userId
 *  post/verifyToken/products
 *  update/verifyToken/products/:id
 *  delete/verifyToken/products/:id
 *

 * [
  body("title").notEmpty().withMessage("post title is required"),
  body("price").isNumeric().withMessage("Valid price is required"),
  body("description").notEmpty().withMessage("Description is required"),
],
 */
  // Get all products
  router.get("/products", getAllProducts);

  // Get single product
  router.get("/products/:id", getProductById);
  // Get products by user id
  router.get("/products/user/:userId",  getProductsByUserId);
  // Create product
  router.post("/products",  createProduct);
  // Update product
  router.put("/products/:id", [
  body("title").optional().notEmpty(),
  body("price").optional().isNumeric(),
  body("description").optional().notEmpty(),
  ] , updateProduct);
  // deactivate product
  router.patch("/products/status/:id", deactivateProduct)
// Delete product
  router.delete("/products/:id", deleteProduct);

export default router;
