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
       console.log(user , "user");
       
      // Create JWT token
      // const token = jwt.sign(
      //   { id: user._id, role: user.email },
      //   process.env.JWT_SECRET ,
      //   { expiresIn: '30d' }
      // );

      // // // Set cookie options
      // const cookieOptions = {
      //   expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      //     httpOnly: true,
      //     secure: process.env.NODE_ENV === 'production',
        
      // };

      // // Send token in cookie
      // res.cookie('token', token, cookieOptions);

      // res.status(201).json({
      //   success: true,
      //   token,
      //   user: {
      //     id: user.id,
      //     name: user.name,
      //     email: user.email,
      //     role: user.role,
      //   },
      // });
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  getUser: async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
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
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  },
  
};

export default userController;
