import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Define role styles
const roleStyles = {
  admin: { backgroundColor: "#2B9CCF", color: "#FFFFFF" },
  staff: { backgroundColor: "#2B9CCF", color: "#FFFFFF" },
  vendor: { backgroundColor: "#2B9CCF", color: "#FFFFFF" },
  user: { backgroundColor: "#2B9CCF", color: "#FFFFFF" },
};

export default function Navbar({ title }) {
  const { user } = useAuth();
  const navigate = useNavigate();

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
          </>
        )}
      </div>
    </div>
  );
}
