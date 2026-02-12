import mongoose, {Schema} from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName:       { type: String, required: true, trim: true, index: true },
    email:          { type: String, required: true, unique: true, lowecase: true, trim: true },
    passwordHash:   { type: String, required: [true, 'Password is required'] },
    avatar:         { type: String },
    role:           { type: String, enum: ['admin', 'staff', 'user', 'vendor'], default: 'user' },
    isActive:       { type: Boolean, default: true },
    REFRESH_TOKEN:  { type: String },
    lastLogin:      { type: Date },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);