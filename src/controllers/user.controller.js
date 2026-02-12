import { asyncHandler } from '../utils/aysncHandler.js';
// import { User } from '../models/userSchema.js';
// import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken } from '../utils/auth.js';

const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "OK" });
  })

// const registerUser = asyncHandler(async (req, res) => {
//   try {
//     const { fullName, email, password } = req.body;
//     const passwordHash = await hashPassword(password);

//     const user = new User({ fullName, email, passwordHash });
//     await user.save();

//     res.status(201).json({ message: 'User registered successfully', user });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });

//     if (!user || !(await comparePassword(password, user.passwordHash))) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const accessToken = generateAccessToken(user);
//     const refreshToken = generateRefreshToken(user);

//     res.json({ accessToken, refreshToken });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export { registerUser };