import React, { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Camera, Lock } from "lucide-react";
import Breadcrumbs from "../services/BreadCrumbs";
import toast, { Toaster } from "react-hot-toast";
import AvatarCropModal from "../components/AvatarCropModel";
import getCroppedImg from "../services/cropImage";

export default function Profile() {
  const { user, setUser, loading, logout } = useAuth();
  const fileInputRef = useRef(null);

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "" });
  const [processing, setProcessing] = useState(false);
  const [cropImage, setCropImage] = useState(null);

  if (loading) return <CenteredMessage text="Loading Profile..." />;
  if (!user) return <CenteredMessage text="User not authenticated." error />;

  /* ================= AVATAR SELECT ================= */
  const handleAvatarClick = () => fileInputRef.current.click();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setCropImage(imageUrl); // open crop modal
  };

  /* ================= CROP COMPLETE ================= */
  const handleCropComplete = async (croppedAreaPixels) => {
    const croppedBlob = await getCroppedImg(cropImage, croppedAreaPixels);

    const formData = new FormData();
    formData.append("avatar", croppedBlob);

    const toastId = toast.loading("Avatar updating...");
    setProcessing(true);

    try {
      const res = await api.patch("/auth/updateAvatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.data?.avatar) {
        setUser((prev) => ({
          ...prev,
          avatar: res.data.data.avatar,
        }));

        toast.success("Avatar successfully updated", { id: toastId });
      } else {
        toast.error("Failed to update avatar", { id: toastId });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update avatar", {
        id: toastId,
      });
    } finally {
      setProcessing(false);
      setCropImage(null); // close modal
    }
  };

  /* ================= PASSWORD CHANGE ================= */
  const handlePasswordChange = async () => {
    try {
      setProcessing(true);

      await api.post("/auth/changeUserPassword", passwordData);

      toast.success("Password changed. Please login again.");
      setTimeout(logout, 2000);


    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to change password"
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4">
      <Breadcrumbs />
      <div className="max-w-full bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* HEADER */}
        <div className="bg-linear-to-r from-[#49AD5E] to-[#2B9CCF] h-32 relative">
          <div className="absolute -bottom-16 left-8">
            <div className="relative w-32 h-32">
              <img
                src={user.avatar}
                alt="Avatar"
                onClick={handleAvatarClick}
                className="w-full h-full rounded-full border-4 border-white shadow-lg object-cover cursor-pointer"
              />

              <button
                onClick={handleAvatarClick}
                className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
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

      {/* 🔥 Crop Modal OUTSIDE header (Correct Placement) */}
      {cropImage && (
        <AvatarCropModal
          image={cropImage}
          onCancel={() => setCropImage(null)}
          onCropComplete={handleCropComplete}
        />
      )}
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