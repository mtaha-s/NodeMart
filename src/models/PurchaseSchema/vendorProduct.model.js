import mongoose, {Schema} from 'mongoose';

const vendorProductSchema = new mongoose.Schema({
    vendorId:    { type: mongoose.Schema.Types.ObjectId, ref:"Vendor", required: true, index: true, },
    itemName:    { type: String, required:true, trim: true, },
    description: { type: String },
    category:    { type: String },
    quantity:    { type: Number, required: true },
    costPrice:   { type: Number, required: true, min: 0, },
    RetailPrice: { type: Number, required: true, min: 0, },
    imageUrl:    { type: String },
    status:      { type: String, enum:["pending", "approved", "rejected"], default: "pending", index: true, },
    adminNote:   { type: String },
    approvedBy:  { type: mongoose.Schema.Types.ObjectId, ref:"User", },
    approvedAt: Date,
}, { timestamps: true } );

export const VendorProduct = mongoose.model( "VendorProduct", vendorProductSchema );