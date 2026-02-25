import { Inventory } from "../models/inventory.model.js";
import { asyncHandler } from "../utils/aysncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { imagekit } from "../services/imagekitClient.js";
import { logActivity } from "../utils/activityLogger.js";
import { v4 as uuidv4 } from "uuid";

// ===== Create Inventory Item
const createInventoryItem = asyncHandler(async (req, res) => {
  const {itemName, description, category, vendorId, quantity, costPrice, retailPrice, reorderLevel} = req.body;

  const itemCode = uuidv4();

  // Validate required fields
  if (!itemName || !vendorId || quantity == null || !costPrice || !retailPrice) {
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
  // Log activity
  await logActivity({
    action: "CREATE_INVENTORY",
    entityType: "Inventory",
    entityId: item._id,
    message: `Inventory created: ${item.itemName}`,
    userId: req.user._id
  });
  // Respond with created item
  return res.status(201).json(
    new ApiResponse(201, item, "Inventory item created successfully")
  );
});

// ===== Get Inventory Items with Pagination
const getAllInventory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  // Build search condition
  let matchStage = {};

  if (search) {
    matchStage = {
      $or: [
        { itemName: { $regex: search, $options: "i" } },
        { itemCode: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        // Allow searching by MongoDB ObjectId
        ...(search.match(/^[0-9a-fA-F]{24}$/)
          ? [{ _id: new mongoose.Types.ObjectId(search) }]
          : []),
      ],
    };
  }

  const aggregate = Inventory.aggregate([
    { $match: matchStage },

    // Join vendor
    {
      $lookup: {
        from: "vendors",
        localField: "vendorId",
        foreignField: "_id",
        as: "vendor",
      },
    },

    // IMPORTANT: preserveNullAndEmptyArrays allows vendorId = null
    {
      $unwind: {
        path: "$vendor",
        preserveNullAndEmptyArrays: true,
      },
    },

    { $sort: { createdAt: -1 } },
  ]);

  const options = {
    page: Number(page),
    limit: Number(limit),
  };

  const result = await Inventory.aggregatePaginate(aggregate, options);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        inventories: result.docs,
        page: result.page,
        totalPages: result.totalPages,
        totalDocs: result.totalDocs,
      },
      "Inventory fetched successfully"
    )
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
  await logActivity({
    action: "UPDATE_INVENTORY",
    entityType: "Inventory",
    entityId: item._id,
    message: `Inventory updated: ${item.itemName}`,
    userId: req.user._id
  });
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
  await logActivity({
    action: "DELETE_INVENTORY",
    entityType: "Inventory",
    entityId: item._id,
    message: `Inventory deleted: ${item.itemName}`,
    userId: req.user._id
  });
  // Respond with success message
  return res.status(200).json(
    new ApiResponse(200, {}, "Inventory item deleted successfully")
  );
});

// ===== Export controller functions
export { createInventoryItem, getAllInventory, getInventoryById, updateInventoryItem, deleteInventoryItem };