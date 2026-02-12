import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const generateAccessToken = (user) => {
  return jwt.sign(
    { _id: user._id, email: user.email, fullName: user.fullName },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { _id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export { hashPassword, comparePassword, generateAccessToken, generateRefreshToken };