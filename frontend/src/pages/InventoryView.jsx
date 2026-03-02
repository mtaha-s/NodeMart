import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import Breadcrumbs from "../services/BreadCrumbs";

export default function InventoryView() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/inventories/${id}`);
        setItem(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch inventory");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!item) return <p>No inventory found.</p>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Breadcrumbs
        paths={[
            { name: "Inventory", path: "/inventory/list" },
            { name: "View" },
            { name: `(${item.itemName})` }
        ]}
      />

      {/* Back Button */}
      <div className=" bg-white w-full rounded-xl shadow-lg p-10">
        <Link
          to="/inventory/list"
          className="flex items-center text-gray-600 hover:text-gray-800 font-medium transition"
        >
          <span className="mr-2 text-xl">←</span> Back
        </Link>
      
      {/* Header */}
      <h1 className="mt-4 text-2xl font-semibold text-gray-800">Inventory Details</h1>

      {/* Content */}
      <div className=" mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Image */}
        <div className="md:col-span-1 flex justify-center items-start">
          <img
            src={item.imageUrl || "/placeholder.png"}
            alt={item.itemName}
            className="rounded-lg border shadow-sm max-h-64 object-cover"
          />
        </div>

        {/* Details */}
        <div className="md:col-span-2 space-y-3 text-gray-700 text-sm">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Item Code:</span> <span>{item.itemCode}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Name:</span> <span>{item.itemName}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Category:</span> <span>{item.category}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Cost Price:</span> <span>{item.costPrice}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Retail Price:</span> <span>{item.retailPrice}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Stock:</span> <span>{item.quantity}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Description:</span> <span>{item.description || "—"}</span>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
