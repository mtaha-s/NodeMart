import React, { useState, useEffect } from "react";
import { Edit2, Trash2, Check, X } from "lucide-react";
import api from "../services/api";

export default function ManageUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editRole, setEditRole] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  // ✅ Fetch whenever page changes
  useEffect(() => {
    fetchAllUsers(page);
  }, [page]);

  const fetchAllUsers = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await api.get(
        `/users/all?page=${pageNumber}&limit=${limit}`
      );
      setUsers(res.data.data || []);
      setTotalPages(res.data.data.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || "Error loading users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });

      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );

      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/users/${userId}`);

      // If last item on page deleted → go back one page
      if (users.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        fetchAllUsers(page);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {/* ✅ Updated Heading */}
      <div className="mb-6">
        {/* <h1 className="text-3xl font-bold text-gray-900">
          User Administration Panel
        </h1> */}
        <p className="text-gray-500 mt-1">
          Manage user accounts, roles, and activity.
        </p>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">User</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Role</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Last Login</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-6 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img
                        src={user.avatar || "/default-avatar.png"}
                        alt={user.fullName}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {user.fullName}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-600">
                      {user.email}
                    </td>

                    <td className="px-4 py-3">
                      {editingId === user._id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value)}
                            className="text-sm px-2 py-1 border rounded"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="vendor">Vendor</option>
                          </select>

                          <button
                            onClick={() =>
                              handleRoleChange(user._id, editRole)
                            }
                            className="text-green-600 p-2 rounded hover:bg-gray-100"
                          >
                            <Check size={16} />
                          </button>

                          <button
                            onClick={() => setEditingId(null)}
                            className="text-red-600 p-2 rounded hover:bg-gray-100"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                          {user.role}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {user.isActive ? (
                        <span className="text-green-600 font-medium">Active</span>
                      ) : (
                        <span className="text-red-600 font-medium">Inactive</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-600">
                      {user.lastLogin ? formatDate(user.lastLogin) : "Never"}
                    </td>

                    <td className="px-4 py-3 flex justify-center gap-3">
                      <button
                        onClick={() => {
                          setEditingId(user._id);
                          setEditRole(user.role);
                        }}
                        className="text-blue-600 p-2 rounded hover:bg-gray-100"
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-600 p-2 rounded hover:bg-gray-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Pagination */}
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
