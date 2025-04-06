import { z } from "zod";


export const validate = (validationSchema) => (req, res, next) => {
  try {
    validationSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ message: "Validation error", errors: error.errors });
  }
};
