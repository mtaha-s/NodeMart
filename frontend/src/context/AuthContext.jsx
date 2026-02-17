import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(undefined);

// Mock user data
const MOCK_USER = {
  id: '1',
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@nodemart.com',
  role: 'master',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    // Mock authentication - accept any email/password for demo
    if (email && password) {
      setUser(MOCK_USER);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
