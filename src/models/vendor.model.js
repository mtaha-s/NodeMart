import mongoose, {Schema} from 'mongoose';
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// Vendor Schema
const vendorSchema = new mongoose.Schema({
  fullName:         { type: String, required: true },
  contactPerson:    { type: String, required: true },
  email:            { type: String, unique: true, lowercase: true, trim: true },
  phone:            { type: String, required: true },
  address:          { type: String, required: true },
  productsSupplied: [{ type: String, required: true }],
}, { timestamps: true });

// Add pagination plugin
vendorSchema.plugin(mongooseAggregatePaginate)

// Create and export Vendor model
export const Vendor = mongoose.model('Vendor', vendorSchema);