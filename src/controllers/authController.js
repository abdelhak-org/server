// src/api/v1/auth/controller.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import APIError from "../utils/apiError.js";
/**
 *  login controller
 *  logout controller

*/
const authController = {

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
        { id: user._id, email: user.email ,name: user.name},
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
  logout: (req, res) => {
    res.clearCookie('ecobuy24_token');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  }




};

export default authController;