import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
// import { InventoryList } from './pages/InventoryList.jsx';
// import { InventoryForm } from './pages/InventoryForm.jsx';
// import { VendorList } from './pages/VendorList.jsx';
// import { VendorForm } from './pages/VendorForm.jsx';
import PurchaseInvoice from './pages/PurchaseInvoice.jsx';
import About from './pages/About.jsx';
// zCjqYQqVwTuo38l4pd2vwP4u8L5fYN8FjzXYC556tbYR6U9QXA
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
            
            {/* Inventory nested routes */}
            {/* <Route path="inventory">
              <Route path="list" element={<InventoryList />} />
              <Route path="add" element={<InventoryForm />} />
              <Route path="purchaseInvoice" element={<PurchaseInvoice />} />
            </Route> */}
            
            {/* Vendor routes */}
            {/* <Route path="vendors" element={<VendorList />} />
            <Route path="vendors/add" element={<VendorForm />} />
             */}
            {/* Purchase Invoice */}
            <Route path="purchaseInvoice" element={<PurchaseInvoice />} />
            {/* About page */}
            <Route path="about" element={<About />} />
          </Route>

          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
