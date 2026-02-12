import { Inventory } from "../models/inventory.model.js";
import { asyncHandler } from "../utils/aysncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { imagekit } from "../services/imagekitClient.js";

// ===== Create Inventory Item
const createInventoryItem = asyncHandler(async (req, res) => {
  const {itemCode, itemName, description, category, vendorId, quantity, costPrice, retailPrice, reorderLevel} = req.body;
  // Validate required fields
  if (!itemCode || !itemName || !vendorId || quantity == null || !costPrice || !retailPrice) {
    throw new ApiError(400, "Required fields are missing");
  }
  // Check for duplicate item code
  const existingItem = await Inventory.findOne({ itemCode });
  if (existingItem) {
    throw new ApiError(409, "Item with this code already exists");
  }
  // Image URL placeholder
  let imageUrl = "";
  // Upload image to ImageKit if provided
  if (req.file) {
    const uploadedImage = await imagekit.upload({
      file: req.file.buffer,
      fileName: `inventory-${Date.now()}`,
      folder: "/inventory",
    });
    imageUrl = uploadedImage.url;
  }
  // Create inventory item
  const item = await Inventory.create({itemCode, itemName, description, category, vendorId, quantity, costPrice, retailPrice, reorderLevel, imageUrl});
  // Respond with created item
  return res.status(201).json(
    new ApiResponse(201, item, "Inventory item created successfully")
  );
});

// ===== Get Inventory Items with Pagination
const getAllInventory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  // Build aggregation pipeline
    const aggregate = Inventory.aggregate([
    {
      $match: {
        itemName: { $regex: search, $options: "i" },
      },
    },
    {
      $lookup: {
        from: "vendors",
        localField: "vendorId",
        foreignField: "_id",
        as: "vendor",
      },
    },
    { $unwind: "$vendor" },
    { $sort: { createdAt: -1 } },
  ]);
  // Pagination options
  const options = {
    page: Number(page),
    limit: Number(limit),
  };
  // Execute aggregation with pagination
  const result = await Inventory.aggregatePaginate(aggregate, options);
  // Respond with paginated results
  return res.status(200).json(
    new ApiResponse(200, result, "Inventory fetched successfully")
  );
});

// ===== Get Single Inventory Item
const getInventoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // Fetch inventory item by ID and populate vendor details
  const item = await Inventory.findById(id).populate("vendorId");
  if (!item) {
    throw new ApiError(404, "Inventory item not found");
  }
  // Respond with the found item
  return res.status(200).json(
    new ApiResponse(200, item, "Inventory item fetched successfully")
  );
});

// ===== Update Inventory Item
const updateInventoryItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // Fetch inventory item by ID
  const item = await Inventory.findById(id);
  if (!item) {
    throw new ApiError(404, "Inventory item not found");
  }
  // Update image if new file uploaded
  if (req.file) {
    const uploadedImage = await imagekit.upload({
      file: req.file.buffer,
      fileName: `inventory-${Date.now()}`,
      folder: "/inventory",
    });
    item.imageUrl = uploadedImage.url;
  }
  // Update fields
  Object.assign(item, req.body);
  // Save updated item
  await item.save();
  // Respond with updated item
  return res.status(200).json(
    new ApiResponse(200, item, "Inventory updated successfully")
  );
});

// ===== Delete Inventory Item
const deleteInventoryItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // Fetch inventory item by ID
  const item = await Inventory.findById(id);
  if (!item) {
    throw new ApiError(404, "Inventory item not found");
  }
  // Delete item
  await item.deleteOne();
  // Respond with success message
  return res.status(200).json(
    new ApiResponse(200, {}, "Inventory item deleted successfully")
  );
});

// ===== Export controller functions
export { createInventoryItem, getAllInventory, getInventoryById, updateInventoryItem, deleteInventoryItem };