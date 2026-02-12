import { Vendor } from "../models/vendor.model.js";
import { Inventory } from "../models/inventory.model.js";
import { asyncHandler } from "../utils/aysncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create Vendor
const createVendor = asyncHandler(async (req, res) => {
  const {
    fullName,
    contactPerson,
    email,
    phone,
    address,
    productsSupplied,
  } = req.body;

  if (!fullName) {
    throw new ApiError(400, "Vendor full name is required");
  }

  if (email) {
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      throw new ApiError(409, "Vendor with this email already exists");
    }
  }

  const vendor = await Vendor.create({
    fullName,
    contactPerson,
    email,
    phone,
    address,
    productsSupplied,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, vendor, "Vendor created successfully"));
});

// Get All Vendors
const getAllVendors = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  const aggregate = Vendor.aggregate([
    {
      $match: {
        fullName: { $regex: search, $options: "i" },
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  const options = {
    page: Number(page),
    limit: Number(limit),
  };

  const result = await Vendor.aggregatePaginate(aggregate, options);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Vendors fetched successfully"));
});

// Get Single Vendor
const getVendorById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const vendor = await Vendor.findById(id);

  if (!vendor) {
    throw new ApiError(404, "Vendor not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, vendor, "Vendor fetched successfully"));
});

// Update Vendor
const updateVendor = asyncHandler(async (req, res) => {
  const { id } = req.params;

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

  Object.assign(vendor, req.body);

  await vendor.save();

  return res
    .status(200)
    .json(new ApiResponse(200, vendor, "Vendor updated successfully"));
});

// Delete Vendor
const deleteVendor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const vendor = await Vendor.findById(id);
  if (!vendor) {
    throw new ApiError(404, "Vendor not found");
  }

  const linkedInventory = await Inventory.findOne({ vendorId: id });

  if (linkedInventory) {
    throw new ApiError(
      400,
      "Cannot delete vendor. It is linked to inventory items."
    );
  }

  await vendor.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Vendor deleted successfully"));
});

export {createVendor, getAllVendors, getVendorById, updateVendor, deleteVendor};