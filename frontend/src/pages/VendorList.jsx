import React, { useState, useEffect } from "react";
import { Edit2, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function VendorList() {
  const navigate = useNavigate();

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const limit = 10;

  useEffect(() => {
    fetchVendors(page);
  }, [page]);

  const fetchVendors = async (pageNumber = 1) => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(
        `/vendors?page=${pageNumber}&limit=${limit}`
      );

      // adjust if your backend structure differs
      const result = res.data.data || {};

      setVendors(result.docs || result || []);
      setTotalPages(result.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || "Error loading vendors");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
  const pro = api.delete(`/vendors/${id}`);

  showPromise(pro, {
    loading: "Deleting vendor...",
    success: "Vendor deleted!",
    error: (err) =>
      err.response?.data?.message || "Delete failed",
  }).then(() => {
    setConfirmDeleteId(null);
    fetchVendors();
  });
};

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500">
          Manage vendor accounts and supplier information.
        </p>

        <button
          onClick={() => navigate("/vendor/add")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus size={18} /> Add Vendor
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading vendors...</p>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Vendor
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Contact Person
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Phone
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Address
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Products
                </th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {vendors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-6 text-center text-gray-500">
                    No vendors found
                  </td>
                </tr>
              ) : (
                vendors.map((vendor) => (
                  <tr key={vendor._id}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {vendor.fullName}
                    </td>

                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {vendor.contactPerson}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-600">
                      {vendor.email || "-"}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-600">
                      {vendor.phone}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-600">
                      {vendor.address}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-600">
                      {vendor.productsSupplied?.length
                        ? vendor.productsSupplied.join(", ")
                        : "-"}
                    </td>

                    <td className="px-4 py-3 flex justify-center gap-3">
                      <button
                        onClick={() =>
                          navigate(`/vendor/edit/${vendor._id}`)
                        }
                        className="text-blue-600 p-2 rounded hover:bg-gray-100"
                      >
                        <Edit2 size={18} />
                      </button>

                      <button
                        onClick={() => setConfirmDeleteId(vendor._id)}
                        className="text-red-600"
                      >
                        <Trash2 size={18}/>
                      </button>

                      {confirmDeleteId === vendor._id && (
                        <div className="absolute bg-white border rounded shadow-lg p-3 z-10">
                          <p className="text-sm mb-2">
                            Delete this vendor?
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDelete(vendor._id)}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Pagination (Same style as ManageUser) */}
      <div className="flex justify-end mt-6 gap-3">
        <button
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page === 1}
          className={`px-4 py-1 rounded border ${
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
          className={`px-4 py-1 rounded border ${
            page === totalPages
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
