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
    try {
      const token = req.cookies.ecobuy24_token;
      const user = req.user;
      res.status(200).json({ success: true, user , token});
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

  getUserById: async (req, res, next) => {
    try {
      const userId = req.params.id;
      const user = await  User.findById(userId);

      if (!user) {
        return next(new APIError("User not found", 404));
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const userId = req.params.id;
      const {  name } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        return next(new APIError("User not found", 404));
      }
      user.name = name;
      await user.save();

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const userId = req.user._id;

      const user = await User.findById(userId);
      if (!user) {
        return next(new APIError("User not found", 404));
      }

      await User.deleteOne({ _id: userId });

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

};

export default userController;