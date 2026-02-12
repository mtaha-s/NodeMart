import mongoose, {Schema} from 'mongoose';
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const inventorySchema = new mongoose.Schema({
  itemCode:         { type: String, required: true, unique: true, index: true },
  itemName:         { type: String, required: true },
  itemdescription:  { type: String },
  itemcategory:     { type: String },
  vendorId:         { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  quantity:         { type: Number, required: true },
  itemCostPrice:    { type: Number, required: true },
  itemRetailPrice:  { type: Number, required: true },
  itemreorderLevel: { type: Number, default: 10 },
  imageUrl:         { type: String }, // store URL pointing to image in storage
}, { timestamps: true });

inventorySchema.plugin(mongooseAggregatePaginate)

export const Inventory = mongoose.model('Inventory', inventorySchema);