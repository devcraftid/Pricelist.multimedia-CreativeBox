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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (!session) navigate('/admin/login');
    });

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
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div></div>;
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
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans w-full max-w-full overflow-x-hidden" style={{ '--color-background': '#f8fafc', '--color-foreground': '#0f172a' }}>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 w-full bg-white/95 backdrop-blur-md text-slate-800 z-40 flex justify-between items-center px-4 py-3 shadow-sm border-b border-slate-200/80">
        <div className="flex items-center gap-2.5 min-w-0">
          <img src="/admin-logo.png" alt="Logo" className="h-7 object-contain shrink-0" />
          <div className="border-l border-slate-200 pl-2.5 min-w-0">
            <span className="font-black text-xs text-slate-800 tracking-wider block truncate">CREATIVE BOX</span>
            <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block">Panel Admin</span>
          </div>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          aria-label="Toggle Menu"
          className="p-2 bg-slate-100 active:bg-slate-200 rounded-xl hover:bg-slate-200 text-slate-700 min-h-[40px] min-w-[40px] flex items-center justify-center border border-slate-200/60 transition-colors"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-72 max-w-[85vw] md:w-64 bg-white text-slate-700 flex flex-col fixed inset-y-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} shadow-xl md:shadow-none border-r border-slate-200/80`}>
        {/* Desktop Header */}
        <div className="p-5 hidden md:flex items-center gap-3 border-b border-slate-100 bg-slate-50/50">
          <img src="/admin-logo.png" alt="Logo" className="h-8 object-contain shrink-0" />
          <div className="border-l border-slate-200 pl-3 min-w-0">
            <h1 className="font-black text-xs text-slate-900 leading-tight truncate">CREATIVE BOX</h1>
            <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Control Panel</p>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="p-4 md:hidden flex justify-between items-center border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <img src="/admin-logo.png" alt="Logo" className="h-7 object-contain" />
            <span className="text-xs font-black text-slate-900 tracking-wide">MENU KONTEN</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="bg-slate-100 p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200 active:scale-95 transition-all min-h-[36px] min-w-[36px] flex items-center justify-center border border-slate-200/60"
          >
            <X size={18} />
          </button>
        </div>
        
        <nav className="flex-1 px-3 sm:px-4 mt-3 overflow-y-auto pb-4 custom-scrollbar">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              const Icon = item.icon;
              return (
                <React.Fragment key={item.name}>
                  <Link 
                    to={item.path} 
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all duration-200 group ${isActive ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200/90 shadow-xs' : 'hover:bg-slate-100/80 text-slate-600 hover:text-slate-900 font-medium'}`}
                  >
                    <Icon size={18} className={`${isActive ? 'text-amber-600' : 'text-slate-400 group-hover:text-slate-600'} transition-colors shrink-0`} />
                    <span className="truncate">{item.name}</span>
                  </Link>
                  {item.divider && <div className="h-px bg-slate-100 my-2.5 mx-2" />}
                </React.Fragment>
              );
            })}
          </div>
        </nav>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3.5 py-2.5 w-full hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl text-xs sm:text-sm font-bold transition-all text-left border border-transparent hover:border-rose-100"
          >
            <LogOut size={18} className="shrink-0 text-slate-400 group-hover:text-rose-500" />
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-3.5 sm:p-6 md:p-8 pt-18 md:pt-8 min-w-0 w-full max-w-full overflow-x-hidden bg-slate-50">
        <Outlet />
      </main>
    </div>
  );
}
