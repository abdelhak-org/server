import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import APIError from "../utils/apiError.js";
import nodemailer from 'nodemailer'
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
  logout: (_, res) => { // Replaced 'req' with '_' as it is unused
    try {
        res.clearCookie('ecobuy24_token', { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Logout failed', error: error.message });
    }
}  ,
  forgetPassword:async (req, res) => {
  try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const resetToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET, // Use a different secret for password reset
        { expiresIn: "15m" } // Token expires in 15 minutes
      );

      const transporter = nodemailer.createTransport({
          // Configure your email provider (e.g., Gmail, SendGrid)
          service: 'gmail',
          auth: {
              user: process.env.EMAIL,
              pass: process.env.EMAIL_PASS,
          },
      });

      const mailOptions = {
          to: user.email ,
          subject: 'Password Reset',
          text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
              `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
              `http://localhost:5173/reset-password?token=${resetToken}\n\n` +

              // `http://${req.headers.host}/reset-password?token=${resetToken}\n\n` +

              `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };

      transporter.sendMail(mailOptions, (error, _) => { // Replaced 'info' with '_' as it is unused
          if (error) {
              console.error(error);
              return res.status(500).json({ message: 'Error sending email' });
          }
          res.json({ message: 'Email sent' });
      });
       } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }

},
resetPassword : async (req , res )=>{

  try {
    const { token, password } = req.body;

     // Verify the JWT token
     const decoded = jwt.verify(token, process.env.JWT_SECRET);
     if (!decoded) return res.status(400).json({ message: "Invalid or expired token" });

     // Find user by decoded ID
     const user = await User.findById(decoded.id);
     if (!user) return res.status(404).json({ message: "User not found" });

     // Hash the new password and update it
     const salt = await bcrypt.genSalt(10);
     user.password = await bcrypt.hash(password, salt);
     await user.save();

     res.json({ message: "Password successfully reset" });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
}



}

}
export default authController;