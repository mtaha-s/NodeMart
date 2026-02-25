import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { Trash2, Plus, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // ✅ import axios instance

export default function InventoryList() {
  const navigate = useNavigate();
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  const fetchInventories = async (pageNumber = 1) => {
    try {
      setLoading(true);
      setError("");

      // ✅ axios GET
      const res = await api.get(
        `/inventories?page=${pageNumber}&limit=${limit}`
      );

      const result = res.data?.data || {};

      setInventories(result.inventories || []);
      setPage(result.page || 1);
      setTotalPages(result.totalPages || 1);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch inventories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventories(page);
  }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inventory?"))
      return;

    try {
      // ✅ axios DELETE
      await api.delete(`/inventories/${id}`);

      alert("Inventory deleted successfully");

      if (inventories.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        fetchInventories(page);
      }

    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
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
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Image
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Item Code
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Vendor
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Quantity
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Cost Price
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Retail Price
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {inventories.map((item) => (
                  <tr key={item._id}>
                    <td className="px-4 py-2">
                      <img
                        src={item.imageUrl || "/default-product.png"}
                        alt={item.itemName}
                        className="w-10 h-10 object-cover rounded"
                      />
                    </td>

                    <td className="px-4 py-2 text-sm">{item.itemCode}</td>
                    <td className="px-4 py-2 text-sm">{item.itemName}</td>
                    <td className="px-4 py-2 text-sm">
                      {item.vendor?.fullName || "No Vendor"}
                    </td>
                    <td className="px-4 py-2 text-sm">{item.quantity}</td>
                    <td className="px-4 py-2 text-sm">₹ {item.costPrice}</td>
                    <td className="px-4 py-2 text-sm">₹ {item.retailPrice}</td>

                    <td className="px-4 py-2 text-sm flex gap-3">
                      <button
                        onClick={() => alert(JSON.stringify(item, null, 2))}
                        className="p-2 rounded hover:bg-gray-100"
                      >
                        <Eye className="w-5 h-5 text-blue-600" />
                      </button>

                      <button
                        onClick={() =>
                          navigate(`/inventory/edit/${item._id}`)
                        }
                        className="p-2 rounded hover:bg-gray-100"
                      >
                        <FaEdit className="w-5 h-5 text-green-600" />
                      </button>

                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 rounded hover:bg-gray-100"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-end mt-4 gap-2">
            <button
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page === 1}
              className={`px-3 py-1 rounded border ${
                page === 1
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Prev
            </button>

            <span className="px-3 py-1 text-gray-700">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded border ${
                page === totalPages
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
