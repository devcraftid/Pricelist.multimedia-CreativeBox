import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  LayoutDashboard, LogOut, Settings, LayoutList, 
  Camera, Users, HelpCircle, Inbox, Menu, X, Image, Tag, Star, Info
} from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (!session) navigate('/admin/login');
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (!session) navigate('/admin/login');
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (isAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, divider: false },
    { name: 'Pengaturan Umum', path: '/admin/settings', icon: Settings, divider: true },
    
    { name: 'Tentang Kami', path: '/admin/about', icon: Info, divider: false },
    { name: 'Keunggulan Kami', path: '/admin/advantages', icon: Star, divider: false },
    { name: 'Layanan Kami', path: '/admin/services', icon: LayoutList, divider: false },
    { name: 'Paket Harga', path: '/admin/pricelist', icon: Tag, divider: false },
    { name: 'FAQ (Tanya Jawab)', path: '/admin/faqs', icon: HelpCircle, divider: true },

    { name: 'Project Galeri', path: '/admin/projects', icon: Image, divider: false },
    { name: 'Logo Klien', path: '/admin/clients', icon: Users, divider: false },
    { name: 'Rental Equipment', path: '/admin/equipments', icon: Camera, divider: true },

    { name: 'Pesan Masuk', path: '/admin/inbox', icon: Inbox, divider: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-slate-900 text-white z-50 flex justify-between items-center px-4 py-3 shadow-md">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-8 object-contain filter invert opacity-90" />
          <h1 className="text-xl font-bold tracking-tight">Admin</h1>
        </div>
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
        <div className="p-6 hidden md:flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-10 object-contain filter invert opacity-90" />
          <h1 className="text-xl font-bold text-white tracking-tight">Admin</h1>
        </div>
        <div className="p-6 md:hidden flex justify-end">
           <button onClick={() => setIsSidebarOpen(false)}><X size={24} className="text-white"/></button>
        </div>
        
        <nav className="flex-1 px-4 mt-2 md:mt-0 overflow-y-auto pb-4">
          <div className="space-y-1">
            {navItems.map((item, idx) => {
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              const Icon = item.icon;
              return (
                <React.Fragment key={item.name}>
                  <Link 
                    to={item.path} 
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive ? 'bg-[#f5a623] text-slate-900 shadow-sm' : 'hover:bg-slate-800 hover:text-white text-slate-400'}`}
                  >
                    <Icon size={18} />
                    {item.name}
                  </Link>
                  {item.divider && <div className="h-px bg-slate-800 my-4 mx-2" />}
                </React.Fragment>
              );
            })}
          </div>
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
