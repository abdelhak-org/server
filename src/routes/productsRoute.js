import { Router } from "express";
import productController from "../controllers/productController.js";
import {uploadMiddleware} from "../middleware/imageUploader.js";
import { validate } from "../middleware/validation.js";
import {ProductSchema} from "../validationSchemas/productSchema.js";
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByUserId,
  deactivateProduct,
  uploadImage,
  deleteImage
} = productController;


export const productsRouter = Router();
productsRouter.get("/",  getAllProducts);
productsRouter.post("/" , validate(ProductSchema) , createProduct);
productsRouter.get("/:id", getProductById);
productsRouter.put("/:id", updateProduct);
productsRouter.delete("/:id", deleteProduct);
productsRouter.patch("/status/:id", deactivateProduct);
productsRouter.get("/users/:userId", getProductsByUserId);
productsRouter.post('/upload', uploadMiddleware , uploadImage);
productsRouter.delete('/upload', deleteImage)
