import mongoose, {Schema} from 'mongoose';
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// Vendor Schema
const vendorSchema = new mongoose.Schema({
  fullName:         { type: String, required: true },
  contactPerson:    { type: String },
  email:            { type: String, unique: true, lowercase: true, trim: true },
  phone:            { type: String },
  address:          { type: String },
  productsSupplied: [{ type: String }],
}, { timestamps: true });

// Add pagination plugin
vendorSchema.plugin(mongooseAggregatePaginate)

// Create and export Vendor model
export const Vendor = mongoose.model('Vendor', vendorSchema);