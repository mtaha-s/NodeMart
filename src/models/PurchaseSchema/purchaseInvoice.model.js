import mongoose, {Schema} from 'mongoose';

const purchaseInvoiceItem = new mongoose.Schema({
  invoiceId:   { type: mongoose.Schema.Types.ObjectId, ref: "PurchaseInvoice", required: true, index: true },
  vendorProductId: {type: mongoose.Schema.Types.ObjectId, ref: "VendorProduct", required: true,},
  quantity:    { type: Number, required: true, min: 1 },
  costPrice:   { type: Number, required: true, min: 0 },
  total:       { type: Number, required: true, min: 0 },
}, { timestamps: true });

const purchaseInvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true, index: true },
  vendorId:      { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true, index: true },
  invoiceDate:   { type: Date, default: Date.now },
  items:         [purchaseInvoiceItem],
  subtotal:      { type: Number, required: true, min: 0 },
  taxAmount:     { type: Number, default: 0 },
  discount:      { type: Number, default: 0 },
  grandTotal:    { type: Number, required: true, min: 0 },
  status:        { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
  adminNote:     { type: String },
  reviewedBy:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reviewedAt:    { type: Date },
}, { timestamps: true });

export const PurchaseInvoice = mongoose.model("PurchaseInvoice", purchaseInvoiceSchema);
