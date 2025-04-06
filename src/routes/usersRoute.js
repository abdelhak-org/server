import { Router } from "express";
import userController from "../controllers/userController.js";
import  productController from "../controllers/productController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { RegisterSchema } from "../validationSchemas/registerSchema.js";
export const usersRouter = Router();
import {validate} from "../middleware/validation.js"
usersRouter.get("/", userController.getUsers);

usersRouter.post("/signup",validate(RegisterSchema), userController.signUp);
usersRouter.post("/logout", userController.logout);
usersRouter.post("/forgetPassword", userController.forgetPassword);
usersRouter.post("/resetPassword", userController.resetPassword);
usersRouter.get("/:userId/products",productController.getProductsByUserId);
usersRouter
  .route("/:id")
  .put(userController.updateUser)
  .delete(verifyToken, userController.deleteUser);

usersRouter.get("/me", verifyToken, userController.me);
usersRouter.post("/login", userController.login);
// validate(RegisterSchema),