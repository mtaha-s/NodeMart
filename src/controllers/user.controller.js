import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/aysncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken } from "../services/jwtBcrypt.js";

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

  let avatarUrl = "";

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    avatar: avatarUrl,
    role: "user",
    isActive: true,
  });

  const createdUser = await User.findById(user._id).select("-passwordHash -refreshToken");
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

  // if (!user.isActive) { throw new ApiError(403, "Account is deactivated"); }

  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) { throw new ApiError(401, "Invalid credentials"); }

  const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
  const options = {
        httpOnly: true,
        secure: true
    }

  // Update lastLogin
  user.lastLogin = new Date();
  user.isActive = true;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(200, {
        user: loggedInUser, accessToken, refreshToken
      }, "User Logged in successful")
    );
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id,
  { $unset: { refreshToken: 1 }, }, // refreshToken will be removed from the user document
  { new: true });

  if (user) {
    user.isActive = false; // deactivate on logout
    await user.save({ validateBeforeSave: false });
  }

  const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out Successfully"))
});

// Helper function to generate tokens and save refresh token in DB
const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

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
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
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

  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await comparePassword(
    oldPassword,
    user.password
  );

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid old password");
  }

  const hashedNewPassword = await hashPassword(newPassword);
  user.password = hashedNewPassword;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

// Get Current User
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

// Update User Avatar
const updateUserAvatar = asyncHandler(async (req, res) => {
  if (!req.file?.path) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Delete old avatar from Supabase (if exists)
  if (user.avatar) {
    try {
      const oldFilePath = user.avatar.split("/avatars/")[1]; 
      // Extract path after bucket name

      if (oldFilePath) {
        await supabase.storage
          .from("avatars")
          .remove([`avatars/${oldFilePath}`]);
      }
    } catch (error) {
      console.log("Old avatar deletion failed:", error.message);
    }
  }


  // Upload new avatar
  const fileBuffer = fs.readFileSync(req.file.path);
  const fileName = `avatars/${Date.now()}-${req.file.originalname}`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(fileName, fileBuffer, {
      contentType: req.file.mimetype,
    });

  if (error) {
    throw new ApiError(500, "Error uploading avatar to Supabase");
  }

  const { data: publicUrlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(fileName);


  // Update database
  user.avatar = publicUrlData.publicUrl;
  await user.save({ validateBeforeSave: false });

  // Delete temp file
  fs.unlinkSync(req.file.path);

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
        },
        "Avatar updated successfully"
      )
    );
});

export { registerUser, loginUser, logoutUser, getCurrentUser, changeUserPassword, refreshAccessToken, updateUserAvatar, generateAccessAndRefereshTokens };
