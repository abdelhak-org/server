import bcrypt from "bcryptjs";
import User from "../models/user.js";
import APIError from "../utils/apiError.js";
import jwt from "jsonwebtoken"

/**
 *  me controller to verify logged in user
 *  getUsers controller to get all users
 *  create user controller
 *  get user by id controller
 */

const userController = {

  me: async (req, res, next) => {
    console.log("clicked from me")
    try {
      const token = req.cookies.ecobuy24_token;
      if (!token) return res.status(401).json({ message: "Access Denied" });
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id);
      if (!user) {
        console.log(user , "no user  from me endpoint")
        throw new APIError('No user found with this id', 404);
      }
     // const user = req.user;
      // if (!user) {
      //   return res.status(404).json({ message: "User not found" });
      // }
      res.status(200).json({ success: true, user });
    } catch (error) {
      next(error);
    }
  },

  getUsers: async (req, res, next) => {
    try {
      const users = await User.find().select("-password");
      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  },

  signUp: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const existingUser = await User.findOne({ email }).select("-password");
      if (existingUser) {
        return next(new APIError("User already exists", 400));
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  // getUser: async (req, res, next) => {
  //   try {
  //     const user = req.user;
  //     if (!user) {
  //       return next(new APIError("User not found", 404));
  //     }

  //     res.status(200).json({
  //       success: true,
  //       data: user,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // },

};

export default userController;
