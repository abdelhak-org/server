import jwt from "jsonwebtoken";
import User from "../models/user.js";
const secretKey = process.env.JWT_SECRET;

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.ecobuy24_token;

    if (!token) return res.status(401).json({ message: "Access Denied" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new APIError("No user found with this id", 404);
    }
    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};
