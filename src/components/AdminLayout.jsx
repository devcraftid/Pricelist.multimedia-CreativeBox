import React, { useState } from 'react';
import { Outlet, Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  LayoutDashboard, LogOut, Settings, LayoutList, 
  Camera, Users, HelpCircle, Inbox, Menu, X 
} from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Basic authentication using localStorage
  const isAuthenticated = localStorage.getItem('isAdminLoggedIn') === 'true'; 

  const handleLogout = async () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/admin/login');
  };

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Pengaturan Situs', path: '/admin/settings', icon: Settings },
    { name: 'Layanan Kami', path: '/admin/services', icon: LayoutList },
    { name: 'Rental Equipment', path: '/admin/equipments', icon: Camera },
    { name: 'Klien', path: '/admin/clients', icon: Users },
    { name: 'FAQ', path: '/admin/faqs', icon: HelpCircle },
    { name: 'Pesan Masuk', path: '/admin/inbox', icon: Inbox },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-slate-900 text-white z-50 flex justify-between items-center px-4 py-3 shadow-md">
        <h1 className="text-xl font-bold tracking-tight">Multicam<span className="text-primary">.Admin</span></h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-slate-800 rounded">
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-50 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 hidden md:block">
          <h1 className="text-xl font-bold text-white tracking-tight">Multicam<span className="text-primary">.Admin</span></h1>
        </div>
        <div className="p-6 md:hidden flex justify-end">
           <button onClick={() => setIsSidebarOpen(false)}><X size={24} className="text-white"/></button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4 md:mt-0 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link 
                key={item.name}
                to={item.path} 
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive ? 'bg-[#f5a623] text-slate-900' : 'hover:bg-slate-800 hover:text-white'}`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full hover:bg-slate-800 hover:text-white rounded-xl font-medium transition-colors text-left"
          >
            <LogOut size={20} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 sm:p-8 pt-20 md:pt-8 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
