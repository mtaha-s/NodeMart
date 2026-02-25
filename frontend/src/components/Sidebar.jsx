// Sidebar.jsx
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  Building2,
  ShoppingCart,
  Info,
  UserCircle,
  LogOut,
} from "lucide-react";
import viteLogo from "../assets/nodeMart.svg";
import { useAuth } from "../context/AuthContext";
import { Avatar } from "./ui/Avatar";

// -------------------
// Role-based navigation
// -------------------
const adminNavItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/manageUsers", label: "Manage Users", icon: Users },
  { to: "/inventory/list", label: "Inventories", icon: Package },
  { to: "/vendor/list", label: "Vendors", icon: Building2 },
  { to: "/purchaseInvoice", label: "Purchase Invoice", icon: ShoppingCart },
  { to: "/about", label: "About", icon: Info },
  // { to: "/profile", label: "Profile", icon: Info },
];

const userNavItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/inventory/list", label: "Inventories", icon: Package },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (!user) return null; // sidebar hidden if not authenticated

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = user.role === "admin" ? adminNavItems : userNavItems;

  return (
    <div className="w-64 h-screen flex flex-col border-r bg-white font-inter border-gray-200">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <img src={viteLogo} alt="NodeMart Logo" className="w-9 h-9" />
          <h2 className="text-[28px] font-semibold tracking-tight">
            <span className="text-[#49AD5E]">Node</span>
            <span className="text-[#2B9CCF]">Mart</span>
          </h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 flex flex-col justify-between">
        {/* Main nav links */}
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 h-11 px-4 rounded-lg text-[14px] font-medium transition-colors ${
                  isActive
                    ? "text-[#2B9CCF] bg-[#2563EB]/10"
                    : "text-[#374151] hover:bg-[#dadfdb]"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </div>
        <div>
          {/* Optional: Add Profile here as main nav (optional, professional UX) */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 h-11 px-4 rounded-lg text-[14px] font-medium transition-colors ${
                isActive
                  ? "text-[#2B9CCF] bg-[#2563EB]/10"
                  : "text-[#374151] hover:bg-[#dadfdb]"
              }`
            }
          >
            <UserCircle className="w-5 h-5" />
            My Profile
          </NavLink>
        </div>
        </nav>
    </div>
  );
}