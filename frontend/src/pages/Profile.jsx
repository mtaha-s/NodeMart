import React, { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Camera, Lock, Check, X } from "lucide-react";
import Breadcrumbs from "../services/BreadCrumbs";

export default function Profile() {
  const { user, loading, logout, setUser } = useAuth();
  const fileInputRef = useRef(null);

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [hover, setHover] = useState(false);
  const [processing, setProcessing] = useState(false);

  if (loading) return <CenteredMessage text="Loading Profile..." />;
  if (!user) return <CenteredMessage text="User not authenticated." error />;

  /* ================= AVATAR UPDATE ================= */
  const handleAvatarClick = () => fileInputRef.current.click();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleCancel = () => {
    setPreview(null);
    setSelectedFile(null);
  };

  const handleUpdate = async () => {
    if (!selectedFile) return;
    setProcessing(true);
    try {
        const formData = new FormData();
        formData.append("avatar", selectedFile);

        // Send file to backend, which handles ImageKit upload + DB update
        const res = await api.patch("/auth/updateAvatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data?.data?.avatar) {
        // Update user context with new avatar
        //   setUser((prev) => ({ ...prev, avatar: res.data.data.avatar }));
        setPreview(res.data.data.avatar);
        setSelectedFile(null);
        }
    } catch (err) {
        console.error("Avatar update failed:", err);
        alert(err.response?.data?.message || "Failed to update avatar.");
    } finally {
        setProcessing(false);
    }
  };

  /* ================= PASSWORD CHANGE ================= */
  const handlePasswordChange = async () => {
    try {
      setProcessing(true);
      await api.post("/auth/changeUserPassword", passwordData);
      alert("Password changed. Please login again.");
      logout();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to change password");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4">
      <Breadcrumbs />
      <div className="max-w-full bg-white shadow-xl rounded-2xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-linear-to-r from-[#49AD5E] to-[#2B9CCF] h-30 relative">
          <div className="absolute -bottom-16 left-8">
            <div
              className="relative w-32 h-32"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <img
                src={preview || user.avatar}
                alt="Avatar"
                onClick={handleAvatarClick}
                className="w-full h-full rounded-full border-4 border-white shadow-lg object-cover cursor-pointer"
              />

              {/* Overlay with Update/Cancel */}
              {preview && hover && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-4 rounded-full">
                  <button
                    onClick={handleUpdate}
                    disabled={processing}
                    className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    {processing ? "Updating..." : "Update"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-3 py-1 text-sm bg-gray-300 text-black rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Camera Button */}
              <button
                onClick={handleAvatarClick}
                className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
              >
                <Camera size={18} />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="pt-20 pb-10 px-8">
          {/* Top Section */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user.fullName}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>

            <div className="flex gap-3">
              <span className="px-3 py-1 text-sm rounded-full bg-indigo-100 text-indigo-700 font-medium">
                {user.role?.toUpperCase()}
              </span>
              <span
                className={`px-3 py-1 text-sm rounded-full font-medium ${
                  user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* DETAILS GRID */}
          <div className="grid md:grid-cols-2 gap-6">
            <InfoCard label="User ID" value={user._id} />
            <InfoCard
              label="Last Login"
              value={user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never Logged In"}
            />
            <InfoCard label="Account Created" value={new Date(user.createdAt).toLocaleString()} />
            <InfoCard label="Last Updated" value={new Date(user.updatedAt).toLocaleString()} />
          </div>

          {/* CHANGE PASSWORD */}
          <div className="mt-8">
            <button
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              <Lock size={16} />
              Change Password
            </button>
          </div>

          {showPasswordSection && (
            <div className="mt-6 bg-gray-50 p-6 rounded-xl shadow-inner max-w-md">
              <h3 className="text-lg font-semibold mb-4">Update Password</h3>

              <input
                type="password"
                placeholder="Old Password"
                className="w-full border p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
              />

              <input
                type="password"
                placeholder="New Password"
                className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowPasswordSection(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={processing}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Update
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= Reusable ================= */
function InfoCard({ label, value }) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-800 break-all">{value}</p>
    </div>
  );
}

function CenteredMessage({ text, error }) {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className={`text-lg ${error ? "text-red-500" : "text-gray-600"}`}>
        {text}
      </div>
    </div>
  );
}