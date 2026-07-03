import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPriceListOpen, setIsPriceListOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [settings, setSettings] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from('site_settings').select('*').limit(1);
    if (data && data.length > 0) setSettings(data[0]);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Project Update !', path: '/projects' },
    { name: 'About', path: '/about' },
    { name: 'Contact us', path: '/contact' },
    { name: 'News & Blog', path: '/blog' },
  ];

  return (
    <header className="w-full z-50 transition-all duration-300 sticky top-0 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Row: Logo & Contact (Hidden on very small mobile, merged with nav on mobile) */}
        <div className="flex justify-between items-center py-3 md:py-4 border-b border-slate-100">
          
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              {settings?.logo_url ? (
                <img src={settings.logo_url} alt="Logo multimedia Creative Box" className="h-10 md:h-12 object-contain" />
              ) : (
                <div className="h-10 md:h-12 w-32 bg-slate-100 rounded border border-slate-200 flex items-center justify-center text-xs text-slate-400">
                  Logo Kosong
                </div>
              )}
            </Link>
            
            {/* Tagline */}
            <div className="block">
              <h1 className="font-bold text-xs sm:text-sm leading-tight text-slate-800 truncate max-w-[140px] sm:max-w-none">multimedia Creative Box</h1>
              <p className="text-[10px] sm:text-xs text-slate-500 leading-tight max-w-[140px] sm:max-w-none truncate sm:whitespace-normal">Jasa Multimedia dan Live Camera Production</p>
            </div>
          </div>
          
          {/* Top Right Social & WA (Desktop Only) */}
          <div className="hidden md:flex items-center space-x-6 text-slate-700">
            <div className="flex space-x-3 text-slate-400">
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
              )}
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
              )}
            </div>
            <div className="text-sm font-bold flex items-center text-slate-800">
              <span className="text-primary mr-1">WA.</span> {settings?.wa_number || 'Belum Diatur'}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-800 hover:text-primary focus:outline-none bg-slate-50"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Bottom Row: Navigation (Desktop Only) */}
        <div className="hidden md:flex justify-between items-center py-2">
          
          <nav className="flex items-center bg-slate-50 rounded-lg px-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.name}
                  to={link.path} 
                  className={`px-4 py-2 font-medium text-sm transition-colors rounded-md ${isActive ? 'text-primary bg-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                >
                  {link.name}
             </Link>
              );
            })}
            
            {/* Dropdown Price List */}
            <div 
              className="relative"
              onMouseEnter={() => setIsPriceListOpen(true)}
              onMouseLeave={() => setIsPriceListOpen(false)}
            >
              <button 
                className={`flex items-center px-4 py-2 font-medium text-sm transition-colors rounded-md ${location.pathname === '/price-list' ? 'text-primary bg-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                Price List <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              
              <div 
                className={`absolute left-0 mt-0 w-48 bg-white border border-slate-100 rounded-xl shadow-xl py-2 z-50 transition-all duration-200 ${isPriceListOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
              >
                <Link to="/price-list?tab=Live+Cam" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary">Live Cam</Link>
                <Link to="/price-list?tab=LED+Videotron" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary">LED Videotron</Link>
                <Link to="/price-list?tab=Stage+%26+Rigging" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary">Stage & Rigging</Link>
                <Link to="/price-list?tab=Sound+System" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary">Sound System</Link>
              </div>
            </div>
          </nav>

          <div className="hidden md:block">
            <button className="bg-primary hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors shadow-sm">
              PROMO !
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white shadow-xl transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-screen border-b border-slate-200 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              to={link.path} 
              className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-primary hover:bg-slate-50" 
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="border-t border-slate-100 pt-2 mt-2">
            <span className="block px-3 py-2 text-sm font-semibold text-slate-400 uppercase tracking-wider">Price List</span>
            <Link to="/price-list?tab=Live+Cam" className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-primary hover:bg-slate-50 pl-6" onClick={() => setIsOpen(false)}>Live Cam</Link>
            <Link to="/price-list?tab=LED+Videotron" className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-primary hover:bg-slate-50 pl-6" onClick={() => setIsOpen(false)}>LED Videotron</Link>
            <Link to="/price-list?tab=Stage+%26+Rigging" className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-primary hover:bg-slate-50 pl-6" onClick={() => setIsOpen(false)}>Stage & Rigging</Link>
            <Link to="/price-list?tab=Sound+System" className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-primary hover:bg-slate-50 pl-6" onClick={() => setIsOpen(false)}>Sound System</Link>
          </div>
          
          <div className="border-t border-slate-100 pt-4 mt-4 px-3 flex flex-col space-y-4">
             <div className="text-slate-600 text-sm flex items-center justify-center gap-2">
                WhatsApp: <span className="font-bold text-slate-800">{settings?.wa_number || 'Belum Diatur'}</span>
             </div>
             <button className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg text-sm transition-colors text-center shadow-sm">
              PROMO !
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
