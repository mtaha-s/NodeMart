import { Activity } from "../models/activity.model.js";
import { Inventory } from "../models/inventory.model.js";
import { Vendor } from "../models/vendor.model.js";
import { asyncHandler } from "../utils/aysncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// GET /api/v1/dashboard
const getDashboardStats = asyncHandler(async (req, res) => {
  const activityPage = Math.max(parseInt(req.query.activityPage || "1", 10), 1);
  const activityLimit = Math.max(parseInt(req.query.activityLimit || "6", 10), 1);

  // basic stats (adjust queries to your schema)
  const totalVendors = await Vendor.countDocuments();
  const totalInventory = await Inventory.countDocuments();
  const lowStockItems = await Inventory.countDocuments({ quantity: { $lt: 5 } });

  // paginated recent activity
  const totalActivities = await Activity.countDocuments();
  const totalPages = Math.max(Math.ceil(totalActivities / activityLimit), 1);
  const activities = await Activity.find()
    .sort({ createdAt: -1 })
    .skip((activityPage - 1) * activityLimit)
    .limit(activityLimit)
    .populate("performedBy", "fullName email");

  return res.status(200).json(
    new ApiResponse(200, {
      totalVendors,
      totalInventory,
      lowStockItems,
      recentActivity: activities,
      activityPage,
      activityTotalPages: totalPages,
      activityTotal: totalActivities,
    }, "Dashboard fetched")
  );
});

export { getDashboardStats };