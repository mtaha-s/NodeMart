import mongoose from "mongoose";

const inventoryUpdateRequestSchema = new mongoose.Schema({
  vendorProductId:      {type: mongoose.Schema.Types.ObjectId, ref: "VendorProduct", required: true,},
  vendorId:             { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  requestedRetailPrice: { type: Number, min: 0 },
  requestedQuantity:    { type: Number, min: 0 },
  reason:               { type: String, required: true },
  status:               { type: String, enum: ["pending","approved","rejected"], default: "pending", index: true },
  adminNote:            { type: String },
  reviewedBy:           { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reviewedAt:           { type: Date },
}, { timestamps: true });

export const InventoryUpdateRequest = mongoose.model("InventoryUpdateRequest", inventoryUpdateRequestSchema);
