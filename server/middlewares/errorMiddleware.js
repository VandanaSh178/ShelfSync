class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  // Default values
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Duplicate Key Error (MongoDB)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];

    err = new ErrorHandler(
      `${field} already exists. Please use a different ${field}.`,
      400
    );
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");

    err = new ErrorHandler(message, 400);
  }

  // Invalid JWT
  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler(
      "Invalid token. Please login again.",
      401
    );
  }

  // Expired JWT
  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler(
      "Token has expired. Please login again.",
      401
    );
  }

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    err = new ErrorHandler(
      `Invalid ${err.path}: ${err.value}`,
      400
    );
  }

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;