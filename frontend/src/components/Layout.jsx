import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Navbar from './Navbar.jsx';

const pageTitles = {
  '/dashboard': 'Dashboard',
//   '/inventory/list': 'Inventory List',
//   '/inventory/add': 'Add Inventory Item',
//   '/inventory/purchase-invoice': 'Purchase Invoice',
//   '/vendors': 'Vendors',
//   '/vendors/add': 'Add Vendor',
//   '/about': 'About',
};

export default function Layout() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'NodeMart';

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#F3F4F6', fontFamily: 'Inter, sans-serif' }}>
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
