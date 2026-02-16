import { Inventory } from "../models/inventory.model.js";
import { Vendor } from "../models/vendor.model.js";
import { asyncHandler } from "../utils/aysncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// ===== Get Dashboard Stats
// const getDashboardStats = asyncHandler(async (req, res) => {

//   // Basic Counts
//   const totalVendors = await Vendor.countDocuments();
//   const totalInventory = await Inventory.countDocuments({ isDeleted: false });

//   const lowStockItems = await Inventory.countDocuments({
//     isDeleted: false,
//     $expr: { $lte: ["$quantity", "$reorderLevel"] }
//   });

//   // 🔥 Recent Inventory Activity
//   const recentInventory = await Inventory.find({ isDeleted: false })
//     .sort({ updatedAt: -1 })
//     .limit(5)
//     .select("itemName quantity updatedAt");

//   // 🔥 Recent Vendors
//   const recentVendors = await Vendor.find()
//     .sort({ createdAt: -1 })
//     .limit(5)
//     .select("fullName createdAt");

//   // Format Activity
//   const recentActivity = [
//     ...recentInventory.map(item => ({
//       type: "inventory",
//       message: `Inventory updated: ${item.itemName} (Qty: ${item.quantity})`,
//       date: item.updatedAt
//     })),
//     ...recentVendors.map(vendor => ({
//       type: "vendor",
//       message: `New vendor added: ${vendor.fullName}`,
//       date: vendor.createdAt
//     }))
//   ]
//   .sort((a, b) => new Date(b.date) - new Date(a.date))
//   .slice(0, 10); // Keep latest 10 activities

//   // Respond with dashboard stats
//   return res.status(200).json(
//     new ApiResponse(200, {
//       totalVendors,
//       totalInventory,
//       lowStockItems,
//       recentActivity
//     }, "Dashboard data fetched successfully")
//   );
// });

import { Activity } from "../models/activity.model.js";

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
