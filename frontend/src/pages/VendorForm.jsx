import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Breadcrumbs from "../services/BreadCrumbs";

export default function VendorForm() {
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/vendors", {
        ...formData,
        productsSupplied: formData.productsSupplied
          .split(",")
          .map((p) => p.trim()),
      });

      alert("Vendor created successfully!");
      navigate("/vendor/list");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create vendor");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "h-10 px-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
      <div className="bg-gray-100 min-h-screen">
        <Breadcrumbs />
      <div className="bg-white w-full rounded-xl shadow p-8">
        <p className="text-gray-500 mb-6">
          Add new vendor information below.
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Row 1 */}
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

          {/* Row 2 */}
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

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                placeholder="Laptop, Mouse, Keyboard"
                value={formData.productsSupplied}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* Buttons */}
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
              disabled={loading}
              className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading ? "Saving..." : "Add Vendor"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}