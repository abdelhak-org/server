// src/utils/apiError.js
class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 400;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default APIError;