import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/aysncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken } from "../services/jwtBcrypt.js";
import { logActivity } from "../utils/activityLogger.js";
import { imagekit } from "../services/imagekitClient.js";
import jwt from "jsonwebtoken";

// ===== Register User
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  // Basic validation
  if (!fullName || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }
  // Check if user with the same email already exists
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User with this email already exists");
  }
  // Hash the password before saving
  const hashedPassword = await hashPassword(password);
  // If user uploaded avatar, use it. Otherwise assign default.
  let avatarUrl = "https://ik.imagekit.io/nodeMart/default-avatar.png"; // default avatar
  if (req.file) {
    const uploadedImage = await imagekit.upload({
      file: req.file.buffer,
      fileName: `avatar-${Date.now()}-${req.file.originalname}`,
      folder: "/avatars", 
    }); avatarUrl = uploadedImage.url;
  }
  // Create new user
  const user = await User.create({fullName, email, password: hashedPassword, avatar: avatarUrl, role: "user", isActive: true});
  // Log activity
  await logActivity({
    action: "CREATE_USER",
    entityType: "User",
    entityId: user._id,
    message: `User registered: ${user.fullName}`,
    userId: user._id
  });
  // Fetch the created user without sensitive fields to return in response
  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  // Return success response with created user data
  return res
    .status(201)
    .json(
      new ApiResponse(201, createdUser, "User registered successfully")
    );
});

// ===== Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // Basic validation
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }
  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  // Check if password is correct
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) { throw new ApiError(401, "Invalid credentials"); }
  // Generate access and refresh tokens
  const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
  const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict"
  }
  // Update lastLogin
  user.lastLogin = new Date();
  user.isActive = true;
  await user.save({ validateBeforeSave: false });
  // Log activity
  await logActivity({
    action: "LOGIN_USER",
    entityType: "User",
    entityId: user._id,
    message: `User logged in: ${user.fullName}`,
    userId: user._id
  });
  // Set tokens in HTTP-only cookies and respond with user data
  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(
      200,
      { user: loggedInUser, accessToken, refreshToken, role: loggedInUser.role },
      "User Logged in successful"
    )
  );
});

// ===== Logout User
const logoutUser = asyncHandler(async (req, res) => {
  // Ensure user is authenticated
  if (!req.user?._id) {
    throw new ApiError(401, "Unauthorized request");
  }
  // Remove refresh token from DB and set user as inactive
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );
  // Optionally, you can also set isActive to false on logout
  if (user) {
    user.isActive = false;
    await user.save({ validateBeforeSave: false });
  }
  // Log activity
  await logActivity({
    action: "LOGOUT_USER",
    entityType: "User",
    entityId: user._id,
    message: `User logged out: ${user.fullName}`,
    userId: user._id
  });
  // Clear tokens from cookies
  const options = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" };
  // Respond with success message
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out Successfully"));
});

// ===== Helper function to generate tokens and save refresh token in DB
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found while generating tokens");
    }
    // Use the service functions you already wrote
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    // Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    // return tokens
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while generating refresh and access token"
    );
  }
};

// ===== Refresh Access Token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
  // If no refresh token provided, reject the request
  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request")
  }
  // Verify the refresh token and generate new tokens
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )
  // Find the user associated with the refresh token  
  const user = await User.findById(decodedToken?._id)
  // If user not found or refresh token doesn't match, reject the request
  if (!user) {
    throw new ApiError(401, "Invalid refresh token")
  }
  // Important: Check if the incoming refresh token matches the one stored in DB
  if (incomingRefreshToken !== user?.refreshToken) {
    throw new ApiError(401, "Refresh token is expired or used")
  }
  // Generate new tokens
  const options = {httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict"}
  // Generate new tokens using the helper function
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  // Set new tokens in cookies and respond with new access token
  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(
      200, 
      {accessToken, refreshToken: refreshToken}, "Access token refreshed"))
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
});

// ===== Change Current User Password
const changeUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  // Validate input
  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old password and new password are required");
  }
  // Ensure user is authenticated
  if (oldPassword === newPassword) {
    throw new ApiError(400, "New password must be different from old password");
  }
  // Fetch user from DB
  const user = await User.findById(req.user?._id);
  // If user not found, throw error
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  // Verify old password
  const isPasswordValid = await comparePassword(
    oldPassword,
    user.password
  );
  // If old password is incorrect, throw error
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid old password");
  }
  // Hash new password
  const hashedNewPassword = await hashPassword(newPassword);
  user.password = hashedNewPassword;
  // 🔐 Invalidate old refresh token (VERY IMPORTANT)
  user.refreshToken = null;
  // Save updated user
  await user.save({ validateBeforeSave: false });
  // Log activity
  await logActivity({
    action: "CHANGE_PASSWORD",
    entityType: "User",
    entityId: user._id,
    message: `User changed password: ${user.fullName}`,
    userId: req.user._id
  });
  // respond with success message and prompt user to login again
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {}, "Password changed successfully. Please login again.")
    );
});

// ===== Get Current User
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -refreshToken");
  if (!user) throw new ApiError(404, "User not found");
  // Respond with user data (excluding sensitive fields)
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {_id: user._id, fullName: user.fullName, email: user.email, avatar: user.avatar, avatarFileId: user.avatarFileId, role: user.role, isActive: user.isActive, lastLogin: user.lastLogin, createdAt: user.createdAt, updatedAt: user.updatedAt}, "User fetched successfully")
    );
});

// ===== Update User Avatar
const updateUserAvatar = asyncHandler(async (req, res) => {
  // If no file uploaded → keep old avatar
  if (!req.file) {
    return res.status(200).json(
      new ApiResponse(
        200,
        { avatar: req.user.avatar },
        "No new avatar uploaded, old avatar remains the same"
      )
    );
  }
  // find user in DB
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  // Delete old avatar from ImageKit if exists
  if (user.avatarFileId) {
    try {
      await imagekit.deleteFile(user.avatarFileId);
    } catch (error) {
      console.log("Failed to delete old avatar:", error.message);
    }
  }
  // Upload new avatar directly to ImageKit
  const uploadedImage = await imagekit.upload({
    file: req.file.buffer, // buffer from multer memoryStorage
    fileName: `avatar-${user._id}-${Date.now()}`,
    folder: "/avatars",
  });
  // If upload failed, throw error
  if (!uploadedImage?.url) {
    throw new ApiError(500, "Image upload failed");
  }
  // Save new avatar URL + fileId in DB
  user.avatar = uploadedImage.url;
  user.avatarFileId = uploadedImage.fileId; // store fileId for future deletion
  await user.save({ validateBeforeSave: false });
  // Log activity
  await logActivity({
    action: "UPDATE_USER_AVATAR",
    entityType: "User",
    entityId: user._id,
    message: `User updated avatar: ${user.fullName}`,
    userId: req.user._id
  });
  // Respond with new avatar URL
  return res.status(200).json(
    new ApiResponse(
      200,
      { avatar: user.avatar }, "Avatar updated successfully")
  );
});

// ===== Get All Users (Admin Only)
const getAllUsers = asyncHandler(async (req, res) => {
  // Fetch all users from database (excluding sensitive fields)
  const users = await User.find({}).select("-password -refreshToken");
  
  if (users.length === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, [], "No users found")
      );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, users, "All users fetched successfully")
    );
});

// ===== Update User Role (Admin Only)
const updateUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  // Validate role
  if (!role || !["user", "admin", "vendor"].includes(role)) {
    throw new ApiError(400, "Invalid role provided");
  }

  // Find and update user
  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Log activity
  await logActivity({
    action: "UPDATE_USER_ROLE",
    entityType: "User",
    entityId: user._id,
    message: `Admin updated user role to ${role}: ${user.fullName}`,
    userId: req.user._id
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "User role updated successfully")
    );
});

// ===== Delete User (Admin Only)
const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Find user
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Delete avatar from ImageKit if exists
  if (user.avatarFileId) {
    try {
      await imagekit.deleteFile(user.avatarFileId);
    } catch (error) {
      console.log("Failed to delete user avatar:", error.message);
    }
  }

  // Delete user from database
  await User.findByIdAndDelete(userId);

  // Log activity
  await logActivity({
    action: "DELETE_USER",
    entityType: "User",
    entityId: userId,
    message: `Admin deleted user: ${user.fullName}`,
    userId: req.user._id
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "User deleted successfully")
    );
});

// ===== export all controller functions
export { registerUser, loginUser, logoutUser, getCurrentUser, changeUserPassword, refreshAccessToken, updateUserAvatar, generateAccessAndRefreshTokens, getAllUsers, updateUserRole, deleteUser };
