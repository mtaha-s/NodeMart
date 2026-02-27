export const errorHandler = (err, req, res, next) => {
  console.error(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // If the error is an instance of ApiError, we already have statusCode & message
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map(e => e.message).join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
};