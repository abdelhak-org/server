import jwt from "jsonwebtoken";
import User from "../models/user.js"
const secretKey = process.env.JWT_SECRET ;

export const authenticateToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: "Authentication error" });
  }
};


// verify authentification
export const verifyToken = async (req, res, next) => {
  const token = req.cookies.ecobuy24_token;
  console.log(token, "token from verifytoken")
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id);
      if (!user) {
        throw new APIError('No user found with this id', 404);
      }

     // req.user = user;
      next();
  } catch (error) {
      res.status(400).json({ message: "Invalid Token" });
  }
};
