import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { Trash2, Plus, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { showPromise } from "../services/toast";

export default function InventoryList() {
  const navigate = useNavigate();
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const limit = 10;

  const fetchInventories = async (pageNumber = 1) => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(
        `/inventories?page=${pageNumber}&limit=${limit}`
      );

      const result = res.data?.data || {};

      setInventories(result.inventories || []);
      setPage(result.page || 1);
      setTotalPages(result.totalPages || 1);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch inventories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventories(page);
  }, [page]);

  // ✅ FIXED EDIT
  const handleEdit = (id) => {
    const pro = api.get(`/inventories/${id}`);

    showPromise(pro, {
      loading: "Fetching Inventory Item...",
      success: "Item loaded!",
      error: (err) =>
        err.response?.data?.message || "Failed to GET Item",
    }).then(() => {
      navigate(`/inventory/edit/${id}`);
    });
  };

  // ✅ IMPROVED DELETE
  const handleDelete = (id) => {
    const pro = api.delete(`/inventories/${id}`);

    showPromise(pro, {
      loading: "Deleting inventory...",
      success: "Inventory deleted!",
      error: (err) =>
        err.response?.data?.message || "Delete failed",
    }).then(() => {
      setConfirmDeleteId(null);
      fetchInventories(page);
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500 mt-1">
          View and manage all inventories.
        </p>

        <button
          onClick={() => navigate("/inventory/add")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus size={18} /> Add Inventory
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading inventories...</p>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      ) : inventories.length === 0 ? (
        <p className="text-gray-500">No inventory found.</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium">Image</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Item Code</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Category</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Vendor</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Quantity</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Cost</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Retail</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {inventories.map((item) => (
                  <tr key={item._id}>
                    <td className="px-4 py-2">
                      <img
                        src={item.imageUrl || "/default-product.png"}
                        alt={item.itemName}
                        className="w-10 h-10 object-cover rounded"
                      />
                    </td>

                    <td className="px-4 py-2">{item.itemCode}</td>
                    <td className="px-4 py-2">{item.itemName}</td>
                    <td className="px-4 py-2">{item.category}</td>
                    <td className="px-4 py-2">
                      {item.vendor?.fullName || "No Vendor"}
                    </td>
                    <td className="px-4 py-2">{item.quantity}</td>
                    <td className="px-4 py-2">₹ {item.costPrice}</td>
                    <td className="px-4 py-2">₹ {item.retailPrice}</td>

                    <td className="px-4 py-2 flex gap-3">
                      <button
                        onClick={() => navigate(`/inventory/view/${item._id}`)}
                      >
                        <Eye className="w-5 h-5 text-blue-600" />
                      </button>

                      <button
                        onClick={() => handleEdit(item._id)}
                      >
                        <FaEdit className="w-5 h-5 text-green-600" />
                      </button>

                      <button
                        onClick={() => setConfirmDeleteId(item._id)}
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>

                      {confirmDeleteId === item._id && (
                        <div className="absolute bg-white border rounded shadow-lg p-3 z-10">
                          <p className="text-sm mb-2">Delete this inventory?</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-3 py-1 bg-gray-300 rounded text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}