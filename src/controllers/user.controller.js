import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/aysncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken } from "../services/jwtBcrypt.js";
import { supabase } from "../services/supabaseClient.js";
import fs from "fs";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const passwordHash = await hashPassword(password);

  // Handle avatar upload via Supabase
  let avatarUrl = "";
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  if (avatarLocalPath) {
    const fileBuffer = fs.readFileSync(avatarLocalPath);
    const fileName = `avatars/${Date.now()}-${req.files.avatar[0].originalname}`;

    const { error } = await supabase.storage
      .from("avatars") // bucket name
      .upload(fileName, fileBuffer, {
        contentType: req.files.avatar[0].mimetype,
      });

    if (error) {
      throw new ApiError(500, "Error uploading avatar to Supabase");
    }

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    avatarUrl = publicUrlData.publicUrl;
  }

  const user = await User.create({
    fullName,
    email,
    passwordHash,
    avatar: avatarUrl,
    role: "user",
    isActive: true,
  });

  const createdUser = await User.findById(user._id).select("-passwordHash");
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
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

  if (!user.isActive) { throw new ApiError(403, "Account is deactivated"); }

  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) { throw new ApiError(401, "Invalid credentials"); }

  // Update lastLogin
  user.lastLogin = new Date();
  user.isActive = true;
  await user.save({ validateBeforeSave: false });

  // const accessToken = generateAccessToken(user);
  // const refreshToken = generateRefreshToken(user);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { user, accessToken, refreshToken }, "User Logged in successful")
    );
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.isActive = false; // deactivate on logout
    await user.save({ validateBeforeSave: false });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// Get Current User
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-passwordHash");
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
          avatar: user.avatar,
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

export { registerUser, loginUser, logoutUser, getCurrentUser };
