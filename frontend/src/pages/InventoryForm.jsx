import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Breadcrumbs from "../services/BreadCrumbs";

export default function InventoryForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    itemCode: "",
    itemName: "",
    description: "",
    category: "",
    vendorId: "",
    quantity: 0,
    costPrice: 0,
    retailPrice: 0,
    reorderLevel: 10,
    image: null,
  });

  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customCategory, setCustomCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch Vendors
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await api.get("/vendors?limit=1000");
        setVendors(res.data.data.docs || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchVendors();
  }, []);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Inventory (Edit Mode)
  useEffect(() => {
    if (!isEditMode) return;

    const fetchInventory = async () => {
      try {
        const res = await api.get(`/inventories/${id}`);
        const item = res.data.data;

        setFormData({
          ...item,
          vendorId: item.vendorId?._id || "",
          reorderLevel: item.reorderLevel || 10,
          image: null,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch inventory");
      }
    };

    fetchInventory();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();

      const finalCategory =
        formData.category === "custom" ? customCategory : formData.category;

      for (const key in formData) {
        if (key === "category") {
          data.append("category", finalCategory);
        } else {
          data.append(key, formData[key]);
        }
      }

      const url = isEditMode ? `/inventories/${id}` : "/inventories";
      const method = isEditMode ? "put" : "post";

      await api[method](url, data);

      navigate("/inventory/list");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save inventory");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "h-10 px-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="bg-gray-100 min-h-screen">
      <Breadcrumbs />
      <div className="bg-white w-full rounded-xl shadow-lg p-10">

        <p className="text-gray-500 mb-10 text-lg">
          {isEditMode
            ? "Update existing inventory item."
            : "Add new inventory item."}
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div>
              <label className="block mb-1 text-sm font-medium">
                Item Code
              </label>
              <input
                type="text"
                name="itemCode"
                value={formData.itemCode}
                readOnly
                className={`${inputClass} bg-gray-100`}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Item Name *
              </label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div>
              <label className="block mb-1 text-sm font-medium">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
                <option value="custom">+ Add New Category</option>
              </select>

              {formData.category === "custom" && (
                <input
                  type="text"
                  placeholder="Enter new category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className={`${inputClass} mt-3`}
                />
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Vendor *
              </label>
              <select
                name="vendorId"
                value={formData.vendorId}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Select Vendor</option>
                {vendors.map((vendor) => (
                  <option key={vendor._id} value={vendor._id}>
                    {vendor.fullName}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div>
              <label className="block mb-1 text-sm font-medium">
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Cost Price *
              </label>
              <input
                type="number"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Retail Price *
              </label>
              <input
                type="number"
                name="retailPrice"
                value={formData.retailPrice}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

          </div>

          {/* Description Full Width */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="px-3 py-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Reorder Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div>
              <label className="block mb-1 text-sm font-medium">
                Reorder Level
              </label>
              <input
                type="number"
                name="reorderLevel"
                value={formData.reorderLevel}
                disabled
                className={`${inputClass} bg-gray-100 cursor-not-allowed`}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Product Image
              </label>
              <input
                type="file"
                name="image"
                onChange={handleChange}
                className="w-full"
              />
            </div>

          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate("/inventory/list")}
              className="px-6 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading
                ? "Saving..."
                : isEditMode
                ? "Update Inventory"
                : "Add Inventory"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}