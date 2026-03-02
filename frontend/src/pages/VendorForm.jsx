import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Breadcrumbs from "../services/BreadCrumbs";
import { showPromise, showError } from "../services/toast";

export default function VendorForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const hasFetched = useRef(false);

  const [formData, setFormData] = useState({
    fullName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    productsSupplied: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch Vendor (Edit Mode)
  useEffect(() => {
    if (!isEditMode || hasFetched.current) return;

    hasFetched.current = true;

    const fetchVendor = async () => {
      try {
        const res = await api.get(`/vendors/${id}`);
        const vendor = res.data.data;

        setFormData({
          fullName: vendor.fullName || "",
          contactPerson: vendor.contactPerson || "",
          email: vendor.email || "",
          phone: vendor.phone || "",
          address: vendor.address || "",
          productsSupplied: vendor.productsSupplied?.join(", ") || "",
        });
      } catch (err) {
        showError(
          err.response?.data?.message || "Failed to load vendor"
        );
        navigate("/vendor/list");
      }
    };

    fetchVendor();
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      productsSupplied: formData.productsSupplied
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
    };

    const url = isEditMode ? `/vendors/${id}` : "/vendors";
    const method = isEditMode ? "put" : "post";

    const pro = api[method](url, payload);

    showPromise(pro, {
      loading: isEditMode
        ? "Updating vendor..."
        : "Creating vendor...",
      success: isEditMode
        ? "Vendor updated successfully!"
        : "Vendor created successfully!",
      error: (err) =>
        err.response?.data?.message || "Failed to save vendor",
    }).then(() => {
      navigate("/vendor/list");
    });
  };

  const inputClass =
    "h-10 px-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="bg-gray-100 min-h-screen">
      <Breadcrumbs
        paths={[
          { name: "Vendors", path: "/vendor/list" },
          { name: isEditMode ? "Edit" : "Add" },
        ]}
      />

      <div className="bg-white w-full rounded-xl shadow p-8">
        <p className="text-gray-500 mb-6">
          {isEditMode
            ? "Update vendor information below."
            : "Add new vendor information below."}
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Contact Person *
              </label>
              <input
                type="text"
                name="contactPerson"
                required
                value={formData.contactPerson}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium">
                Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Phone *
              </label>
              <input
                type="text"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Address *
            </label>
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Products Supplied (comma separated) *
            </label>
            <input
              type="text"
              name="productsSupplied"
              required
              value={formData.productsSupplied}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/vendor/list")}
              className="px-5 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {isEditMode ? "Update Vendor" : "Add Vendor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}