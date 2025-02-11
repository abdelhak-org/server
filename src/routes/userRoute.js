// src/api/v1/auth/routes.js
import { Router } from "express";
import { body } from "express-validator";
import userController from "../controllers/userController.js";
import {authenticateToken} from "../middleware/auth.js";
const router = Router();

// register user
router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("name").notEmpty().withMessage("Name is required"),
  ],
  userController.createUser
);
//get user
router.get("/users", userController.getUsers);
router.get("/users/:id",authenticateToken, userController.getUser);
router.post("api/v1/logout", userController.logout);


export default router;