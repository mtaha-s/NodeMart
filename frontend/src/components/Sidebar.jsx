import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Package, Building2, ShoppingCart, Info, } from "lucide-react";
import viteLogo from '../assets/nodeMart.svg';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/users', label: 'Manage Users', icon: Users },
  { to: '/inventory/list', label: 'Inventory', icon: Package },
  { to: '/vendors', label: 'Vendors', icon: Building2 },
  { to: '/inventory/purchase-invoice', label: 'Purchase Invoice', icon: ShoppingCart },
  { to: '/about', label: 'About', icon: Info },
];

export default function Sidebar() {
  return (
    <div
      className="w-65 h-screen flex flex-col border-r"
      style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', fontFamily: 'Inter, sans-serif' }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b" style={{ borderColor: '#E5E7EB' }}>
        <div className="flex items-center gap-4">
          <img src={viteLogo} alt="NodeMart Logo" className="w-10 h-10" />
          <h2 className="text-[22px] font-semibold tracking-tight">
          <span style={{ color: "#49AD5E" }}>Node</span>
           <span style={{ color: "#2B9CCF" }}>Mart</span>
          </h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 h-11 px-4 rounded-lg text-[14px] font-medium transition-colors ${
                isActive
                  ? 'text-[#2563EB] bg-[#2563EB]/10'
                  : 'text-[#374151] hover:bg-[#F3F4F6]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className="w-5 h-5" style={{ color: isActive ? '#2563EB' : '#6B7280' }} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
{/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 h-11 px-4 rounded-lg text-[14px] font-medium transition-colors ${
                isActive
                  ? 'text-[#2563EB] bg-[#2563EB]/10'
                  : 'text-[#374151] hover:bg-[#F3F4F6]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className="w-5 h-5" style={{ color: isActive ? '#2563EB' : '#6B7280' }} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>