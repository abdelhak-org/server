// src/api/v1/auth/routes.js
import { Router } from "express";
import { body } from "express-validator";
import userController from "../controllers/userController.js";
import { verifyToken, authenticateToken } from "../middleware/auth.js";
const router = Router();
/**
 * base url // http://localhost:3000/api/v1
 *  get /users
 *  get/users/:id
 *  get/ verifyToken/users/me

 *  update/verifyToken/users/:id
 *  delete/verifyToken/users/:id
 *
*/
// create user
router.post("/users/signup",
  [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("name").notEmpty().withMessage("Name is required"),
],
  userController.signUp
);
// get users
router.get("/users", userController.getUsers);

// get user by id
//router.get("/users/:id", userController.getUserById);


// update user
router.put("/users/:id", userController.updateUser);

// delete user
router.delete("/users/:id",verifyToken ,userController.deleteUser);

// verifyuser
router.get("/users/me",verifyToken, userController.me)



export default router;
