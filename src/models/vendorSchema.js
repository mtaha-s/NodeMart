import mongoose, {Schema} from 'mongoose';
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const vendorSchema = new mongoose.Schema({
  fullName:         { type: String, required: true },
  contactPerson:    { type: String },
  email:            { type: String, unique: true, lowercase: true, trim: true },
  phone:            { type: String },
  address:          { type: String },
  productsSupplied: [{ type: String }],
}, { timestamps: true });

vendorSchema.plugin(mongooseAggregatePaginate)

export const Vendor = mongoose.model('Vendor', vendorSchema);