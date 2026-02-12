import mongoose, {Schema} from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName:       { type: String, required: true, trim: true, index: true },
    email:          { type: String, required: true, unique: true, lowecase: true, trim: true },
    password:       { type: String, required: [true, 'Password is required'] },
    avatar:         { type: String, default: "https://ik.imagekit.io/1tdrwneutronmdwphgvs/default-image.png" },
    avatarFileId:   { type: String },
    role:           { type: String, enum: ['admin', 'staff', 'user', 'vendor'], default: 'user' },
    isActive:       { type: Boolean, default: true },
    refreshToken:   { type: String, default: "" },
    lastLogin:      { type: Date },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);