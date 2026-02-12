import { ApiError } from "../utils/ApiError.js";

// Middleware to authorize user based on their role
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }
    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "Forbidden: Access denied");
    }
    // User is authorized, proceed to the next middleware or route handler
    next();
  };
};

// Export the middleware function
export { authorizeRoles };