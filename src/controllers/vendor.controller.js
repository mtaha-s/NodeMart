import { Vendor } from "../models/vendor.model.js";
import { Inventory } from "../models/inventory.model.js";
import { asyncHandler } from "../utils/aysncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { logActivity } from "../utils/activityLogger.js";

// ===== Create Vendor
const createVendor = asyncHandler(async (req, res) => {
  const {fullName, contactPerson, email, phone, address, productsSupplied} = req.body;
  // Basic validation
  if (!fullName) {
    throw new ApiError(400, "Vendor full name is required");
  }
  // Check for duplicate email
  if (email) {
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      throw new ApiError(409, "Vendor with this email already exists");
    }
  }
  // Create vendor
  const vendor = await Vendor.create({fullName, contactPerson, email, phone, address, productsSupplied});
  // Log activity
  await logActivity({
    action: "CREATE_VENDOR",
    entityType: "Vendor",
    entityId: vendor._id,
    message: `Vendor created: ${vendor.fullName}`,
    userId: req.user._id
  });
  // Return response
  return res
    .status(201)
    .json(new ApiResponse(201, vendor, "Vendor created successfully"));
});

// ===== Get All Vendors
const getAllVendors = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  // Build aggregation pipeline
  const aggregate = Vendor.aggregate([
    {
      $match: {
        fullName: { $regex: search, $options: "i" },
      },
    },
    { $sort: { createdAt: -1 } },
  ]);
  // Pagination options
  const options = {
    page: Number(page),
    limit: Number(limit),
  };
  // Execute aggregation with pagination
  const result = await Vendor.aggregatePaginate(aggregate, options);
  // Return response
  return res
    .status(200)
    .json(new ApiResponse(200, result, "Vendors fetched successfully"));
});

// ===== Get Single Vendor
const getVendorById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  //vendor existence check
  const vendor = await Vendor.findById(id);
  // If vendor not found, return 404
  if (!vendor) {
    throw new ApiError(404, "Vendor not found");
  }
  // Return response
  return res
    .status(200)
    .json(new ApiResponse(200, vendor, "Vendor fetched successfully"));
});

// ===== Update Vendor
const updateVendor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  //vendor existence check
  const vendor = await Vendor.findById(id);
  if (!vendor) {
    throw new ApiError(404, "Vendor not found");
  }
  // Prevent duplicate email update
  if (req.body.email && req.body.email !== vendor.email) {
    const existingVendor = await Vendor.findOne({ email: req.body.email });
    if (existingVendor) {
      throw new ApiError(409, "Email already in use by another vendor");
    }
  }
  // Update vendor fields
  Object.assign(vendor, req.body);
  // Save updated vendor
  await vendor.save();
  // Log activity
  await logActivity({
    action: "UPDATE_VENDOR",
    entityType: "Vendor",
    entityId: vendor._id,
    message: `Vendor updated: ${vendor.fullName}`,
    userId: req.user._id
  });

  // Return response
  return res
    .status(200)
    .json(new ApiResponse(200, vendor, "Vendor updated successfully"));
});

// ===== Delete Vendor
const deleteVendor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  //vendor existence check
  const vendor = await Vendor.findById(id);
  if (!vendor) {
    throw new ApiError(404, "Vendor not found");
  }
  // Check for linked inventory items
  const linkedInventory = await Inventory.findOne({ vendorId: id });
  // If linked inventory items exist, prevent deletion
  if (linkedInventory) {
    throw new ApiError(
      400,
      "Cannot delete vendor. It is linked to inventory items."
    );
  }
  // Delete vendor
  await vendor.deleteOne();
  // Log activity
  await logActivity({
    action: "DELETE_VENDOR",
    entityType: "Vendor",
    entityId: vendor._id,
    message: `Vendor deleted: ${vendor.fullName}`,
    userId: req.user._id
  });

  // Return response
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Vendor deleted successfully"));
});

// ===== Export controller functions
export {createVendor, getAllVendors, getVendorById, updateVendor, deleteVendor};