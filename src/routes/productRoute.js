import { Router  } from "express";
import { body } from "express-validator";
import productController from "../controllers/productController.js";
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, getProductsByUserId, deactivateProduct } = productController;

/**
 *  get /products
 *  get/products/:id
 *  get/verifytoken/products/user/:userId
 *  post/verifyToken/products
 *  update/verifyToken/products/:id
 *  delete/verifyToken/products/:id
 */
const router = Router();
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.get("/products/user/:userId", getProductsByUserId);

// Create product with validation
router.post("/products",  [
  body("title").notEmpty().withMessage("Title is required"),
  body("price").isNumeric().withMessage("Valid price is required"),
  body("desc").notEmpty().withMessage("Description is required"),
  body("category").notEmpty().withMessage("Category is required"),
], createProduct);

// Update product with validation
router.put("/products/:id", [
  body("title").optional().notEmpty().withMessage("Title is required"),
  body("price").optional().isNumeric().withMessage("Valid price is required"),
  body("desc").optional().notEmpty().withMessage("Description is required"),
  body("category").optional().notEmpty().withMessage("Category is required"),
], updateProduct);

router.patch("/products/status/:id", deactivateProduct);
router.delete("/products/:id", deleteProduct);

export default router;