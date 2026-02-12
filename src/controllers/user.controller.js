import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/aysncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken } from "../services/jwtBcrypt.js";
import { imagekit } from "../services/imagekitClient.js";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User with this email already exists");
  }

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

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    avatar: avatarUrl,
    role: "user",
    isActive: true,
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, createdUser, "User registered successfully")
    );
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) { throw new ApiError(401, "Invalid credentials"); }

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
  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(
      200,
      { user: loggedInUser },
      "User Logged in successful"
    )
  );
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "Unauthorized request");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  if (user) {
    user.isActive = false;
    await user.save({ validateBeforeSave: false });
  }

  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out Successfully"));
});

// Helper function to generate tokens and save refresh token in DB
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found while generating tokens");
    }

    // Use the service functions you already wrote
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
console.log("Generated Refresh Token:", refreshToken);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
console.log("Saved in DB:", user.refreshToken);

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while generating refresh and access token"
    );
  }
};

// Refresh Access Token
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
        }

    
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: refreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
});

// Change Current User Password
const changeUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old password and new password are required");
  }

  if (oldPassword === newPassword) {
    throw new ApiError(400, "New password must be different from old password");
  }

  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Verify old password
  const isPasswordValid = await comparePassword(
    oldPassword,
    user.password
  );

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid old password");
  }

  // Hash new password
  const hashedNewPassword = await hashPassword(newPassword);
  user.password = hashedNewPassword;

  // 🔐 Invalidate old refresh token (VERY IMPORTANT)
  user.refreshToken = null;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Password changed successfully. Please login again."
      )
    );
});


/* Get Current User
It means:
  The user whose JWT access token was sent in the request.
Not:
  Not random user
  Not last logged-in user
  Not first user in DB
  Not based on email in body */
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -refreshToken");
  if (!user) throw new ApiError(404, "User not found");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          lastLogin: user.lastLogin, 
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        "User fetched successfully"
      )
    );
});

// Update User Avatar
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

  if (!uploadedImage?.url) {
    throw new ApiError(500, "Image upload failed");
  }

  // 🔥 Save new avatar URL + fileId in DB
  user.avatar = uploadedImage.url;
  user.avatarFileId = uploadedImage.fileId; // store fileId for future deletion
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(
      200,
      { avatar: user.avatar },
      "Avatar updated successfully"
    )
  );
});

export { registerUser, loginUser, logoutUser, getCurrentUser, changeUserPassword, refreshAccessToken, updateUserAvatar, generateAccessAndRefreshTokens };
