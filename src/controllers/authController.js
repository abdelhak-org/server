// src/api/v1/auth/controller.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import APIError from "../utils/apiError.js";

const authController = {
  verifyToken: async (req, res, next) => {

    try {
      // 1. Get token from cookie
        const token = req.cookies.ecobuy24_token;
         console.log(token , "token from verifytoken ")
        // 2. Check if token exists
        if (!token) {
          throw new APIError('Not authorized to access this route', 401);
        }

        // 3. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
          throw new APIError('No user found with this id', 404);
        }

        req.user = user;

     next();
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // 1. Check if user exists
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        throw new APIError('Invalid credentials', 401);
      }

      // 2. Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new APIError('Invalid credentials', 401);
      }

       // Create JWT token
       const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      // Set cookie options
      const cookieOptions = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', // Protect against CSRF
      };

      // Send token in cookie
      res.cookie('ecobuy24_token', token, cookieOptions);
      res.status(201).json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

export default authController;