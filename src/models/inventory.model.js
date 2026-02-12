import mongoose, {Schema} from 'mongoose';
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// Inventory Schema
const inventorySchema = new mongoose.Schema({
  itemCode:     { type: String, required: true, unique: true, index: true },
  itemName:     { type: String, required: true },
  description:  { type: String },
  category:     { type: String },
  vendorId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  quantity:     { type: Number, required: true },
  costPrice:    { type: Number, required: true },
  retailPrice:  { type: Number, required: true },
  reorderLevel: { type: Number, default: 10 },
  imageUrl:     { type: String }, // store URL pointing to image in storage
}, { timestamps: true });

// Add pagination plugin
inventorySchema.plugin(mongooseAggregatePaginate)

// Create and export Inventory model
export const Inventory = mongoose.model('Inventory', inventorySchema);