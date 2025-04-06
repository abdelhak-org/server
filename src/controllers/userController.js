import bcrypt from "bcryptjs";
import User from "../models/user.js";
import APIError from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import {getConfig} from "../config.js";
const userController = {
  me: async (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        return ;
      }
      res.status(200).json({ success: true, user, token });
    } catch (error) {
      next(error);
    }
  },

  getUsers: async (_, res, next) => {
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

      res.status(200).json({
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
      const user = await User.findById(userId);
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
      const { name } = req.body;
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
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        throw new APIError("Invalid credentials", 401);
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new APIError("Invalid credentials", 401);
      }
      const token = jwt.sign(
        { id: user._id, email: user.email, name: user.name },
        getConfig().JWT_SECRET,
        { expiresIn: "30d" }
      );
      const cookieOptions = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      };
      res.cookie("ecobuy24_token", token, cookieOptions);
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
  logout: (_, res) => {
    try {
      res.clearCookie("ecobuy24_token", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      });
      res
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Logout failed",
        error: error.message,
      });
    }
  },
  forgetPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "15m",
      });

      const transporter = nodemailer.createTransport({
        service: getConfig().EMAIL_SERVICE,
        auth: {
          user: getConfig().EMAIL,
          pass: getConfig().EMAIL_PASS,
        },
      });

      const mailOptions = {
        to: user.email,
        subject: "Password Reset",
        text:
          `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
          `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
          `${EMAIL_SERVICE().FRONTEND_URL}/reset-password?token=${resetToken}\n\n` +
          // `http://${req.headers.host}/reset-password?token=${resetToken}\n\n` +

          `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };

      transporter.sendMail(mailOptions, (error, _) => {
        if (error) {
          return res.status(500).json({ message: "Error sending email" });
        }
        res.json({ message: "Email sent" });
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { token, password } = req.body;

      const decoded = jwt.verify(token, getConfig().JWT_SECRET);
      if (!decoded)
        return res.status(400).json({ message: "Invalid or expired token" });

      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      res.json({ message: "Password successfully reset" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
};

export default userController;