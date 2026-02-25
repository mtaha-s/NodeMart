// Layout.jsx
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import { useAuth } from "../context/AuthContext";

// 🔹 Titles for pages
const pageTitles = {
  "/dashboard": "Dashboard",
  "/manageUsers": "Manage Users",
  "/inventory/list": "Inventories",
  "/inventory/add": "Add Inventory",
  "/purchaseInvoice": "Purchase Invoice",
  "/vendor/list": "Vendors",
  "/vendor/add": "Add Vendors",
  "/about": "About",
};

export default function Layout() {
  const location = useLocation();
  const { user } = useAuth();
  const title = pageTitles[location.pathname] || "NodeMart";

  // 🔹 Admin Layout
  if (user?.role === "admin") {
    return (
      <div
        className="flex h-screen"
        style={{ backgroundColor: "#F3F4F6", fontFamily: "Inter, sans-serif" }}
      >
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar title={title} />
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }

  // 🔹 User Layout (simpler, no Manage Users/Vendors in sidebar)
  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: "#F3F4F6", fontFamily: "Inter, sans-serif" }}
    >
      {/* You can choose to hide sidebar for users or show a simplified one */}
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title={title} />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
