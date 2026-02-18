import { Inventory } from "../models/inventory.model.js";
import { Vendor } from "../models/vendor.model.js";
import { asyncHandler } from "../utils/aysncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Activity } from "../models/activity.model.js";

// ===== Get Dashboard Stats
const getDashboardStats = asyncHandler(async (req, res) => {

  const totalVendors = await Vendor.countDocuments({ isDeleted: false });
  const totalInventory = await Inventory.countDocuments({ isDeleted: false });

  const lowStockItems = await Inventory.countDocuments({
    isDeleted: false,
    $expr: { $lte: ["$quantity", "$reorderLevel"] }
  });

  const recentActivity = await Activity.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("performedBy", "fullName email")
    .select("action message entityType createdAt performedBy");

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalVendors,
        totalInventory,
        lowStockItems,
        recentActivity
      },
      "Dashboard data fetched successfully"
    )
  );
});

export { getDashboardStats };
