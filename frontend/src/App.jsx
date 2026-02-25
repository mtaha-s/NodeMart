import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ManageUsers from './pages/ManageUser.jsx';
import InventoryList from './pages/InventoryList.jsx';
import InventoryForm from './pages/InventoryForm.jsx';
import VendorList from './pages/VendorList.jsx';
import VendorForm from './pages/VendorForm.jsx';
import PurchaseInvoice from './pages/PurchaseInvoice.jsx';
import About from './pages/About.jsx';
import Profile from './pages/Profile.jsx';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            {/* Manage Users */}
            <Route path="manageUsers" element={<ManageUsers />} />
            {/* Inventory nested routes */}
            <Route path="inventory">
              <Route path="list" element={<InventoryList />} />
              <Route path="add" element={<InventoryForm />} />
              {/* {* <Route path="edit/:id" element={<InventoryForm />} /> */}
            </Route>
          
            {/* Vendor routes */}
            <Route path="vendor">
              <Route path="list" element={<VendorList />} />
              <Route path="add" element={<VendorForm />} />
              {/*<Route path="edit/:id" element={<VendorForm />} /> */}
            </Route>

            {/* Purchase Invoice */}
            <Route path="purchaseInvoice" element={<PurchaseInvoice />} />

            {/* About page */}
            <Route path="about" element={<About />} />
            
            {/* Profile Page */}
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
