import React, { useEffect, useState } from "react";
import { FaUsers, FaBoxes, FaExclamationTriangle } from "react-icons/fa";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalVendors: 0,
    totalInventory: 0,
    lowStockItems: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("http://localhost:5000/api/v1/dashboard", {
          credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch dashboard data");
        }
        setStats(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      <h1 className="text-3xl font-semibold text-gray-900 mb-4">Overview</h1>
      <p className="text-gray-600 mb-6">Quick stats about your inventory and vendors</p>

      {loading ? (
        <p className="text-gray-500">Loading dashboard data...</p>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
              <FaUsers className="text-blue-600 w-8 h-8" />
              <div>
                <p className="text-gray-500 text-sm">Total Vendors</p>
                <p className="text-2xl font-semibold">{stats.totalVendors}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
              <FaBoxes className="text-green-600 w-8 h-8" />
              <div>
                <p className="text-gray-500 text-sm">Total Inventory</p>
                <p className="text-2xl font-semibold">{stats.totalInventory}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
              <FaExclamationTriangle className="text-red-600 w-8 h-8" />
              <div>
                <p className="text-gray-500 text-sm">Low Stock Items</p>
                <p className="text-2xl font-semibold">{stats.lowStockItems}</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Recent Activity
            </h2>

            {stats.recentActivity.length === 0 ? (
              <p className="text-gray-500">No recent activity.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {stats.recentActivity.map((activity) => (
                  <li key={activity._id} className="py-3 flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <span className="font-medium text-gray-700">{activity.performedBy?.fullName}</span>{" "}
                      <span className="text-gray-500 text-sm">({activity.performedBy?.email})</span>
                      <p className="text-gray-600 text-sm mt-1">{activity.message}</p>
                    </div>
                    <div className="text-gray-400 text-xs mt-2 md:mt-0">
                      {new Date(activity.createdAt).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
