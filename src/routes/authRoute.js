// src/api/v1/auth/routes.js
import { Router } from "express";
import { body } from "express-validator";
import authController from "../controllers/authController.js";
import {verifyToken } from "../middleware/auth.js";
const router = Router();
// *  post/users/login
// *  post/verifyken/users/logout





router.post(
  "/users/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  authController.login
);
router.post("/users/logout", authController.logout);


export default  router