import { useAuth } from '../context/AuthContext';
import { Avatar } from './ui/Avatar';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define role styles
const roleStyles = {
  admin: { backgroundColor: "#2B9CCF", color: "#FFFFFF" },
  staff: { backgroundColor: "#2B9CCF", color: "#FFFFFF" },
  vendor: { backgroundColor: "#2B9CCF", color: "#FFFFFF" },
  user: { backgroundColor: "#2B9CCF", color: "#FFFFFF" },
};

export default function Navbar({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      className="h-16 border-b flex items-center justify-between px-6"
      style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', fontFamily: 'Inter, sans-serif' }}
    >
      <h1 className="text-[24px] font-semibold" style={{ color: '#111827' }}>
        {title}
      </h1>

      <div className="flex items-center gap-4">
        {user && (
          <>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[14px] font-medium" style={{ color: '#374151' }}>
                  {user.fullName}
                </p>
                <p className="text-[12px]" style={{ color: '#6B7280' }}>
                  {user.email}
                </p>
              </div>
              <Avatar size="lg" />
              {user.role && (
                <span
                  style={{
                    ...roleStyles[user.role.toLowerCase()],
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: "600",
                  }}
                >
                  {user.role.toUpperCase()}
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="h-10 w-10 rounded-md hover:bg-gray-100 flex items-center justify-center transition-colors"
              style={{ color: '#6B7280' }}
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
