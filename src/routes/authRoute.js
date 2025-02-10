// src/api/v1/auth/routes.js
import { Router } from "express";
import { body } from "express-validator";
import authController from "../controllers/authController.js";
import validateRequest from "../middleware/validateRequest.js";

const router = Router();

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  //validateRequest,
  authController.login
);
router.post("/verifyToken", authController.verifyToken);
export default router;
