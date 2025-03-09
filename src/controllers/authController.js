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
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  logout: (req, res) => {
    try {
        res.clearCookie('ecobuy24_token', { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Logout failed', error: error.message });
    }
}  ,
restPassword: async (req, res, next) => {
const { email } = req.body;
try{
  const user = await User.findOne({ email });
  if (!user) {
    throw new APIError('User not found', 404);
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '10m',
  });

  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${token}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}.\nIf you didn't forget your password, please ignore this email!`;

  await sendEmail({
    email: user.email,
    subject: 'Your password reset token (valid for 10 min)',
    message,
  });

  res.status(200).json({
    success: true,
    message: 'Token sent to email!',
  });

}
catch (error) {
  next(error);
}

}


};

export default authController;