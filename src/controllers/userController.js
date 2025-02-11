import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import APIError from "../utils/apiError.js";

const userController = {

  createUser: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new APIError("User already exists", 400);
      }

      // Hash password
     const hashedPassword = await bcrypt.hash(password, 12);

      // Create new user
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });


      res.status(200).json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.find();
      res.json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  },

  getUser: async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) {
        throw new APIError("User not found", 404);
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
  logout: (req, res) => {
    res.clearCookie('ecobuy24_token');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  },

};

export default userController;
