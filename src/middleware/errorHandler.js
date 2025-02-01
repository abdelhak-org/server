export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation Error",
        errors: Object.values(err.errors).map((error) => error.message),
      });
    }
  
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
  
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
  
    res.status(500).json({ message: "Internal server error" });
  };
  
  export const notFound = (req, res) => {
    res.status(404).json({ message: "Resource not found" });
  };