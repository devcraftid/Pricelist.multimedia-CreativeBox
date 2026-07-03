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
    <header className={`w-full z-50 transition-all duration-300 ${location.pathname === '/' || location.pathname === '/services' ? 'absolute top-0' : 'sticky top-0 bg-[#273554]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Row: Logo & Contact (Hidden on very small mobile, merged with nav on mobile) */}
        <div className="flex justify-between items-center py-3 md:py-4 border-b border-gray-600/30">
          
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              {settings?.logo_url ? (
                <img src={settings.logo_url} alt="Logo multimedia Creative Box" className="h-16 md:h-20 object-contain brightness-0 invert drop-shadow-sm" />
              ) : (
                <div className="h-16 md:h-20 w-32 bg-slate-800 rounded border border-slate-600 flex items-center justify-center text-xs text-slate-400">
                  Logo Kosong
                </div>
              )}
            </Link>
            
            {/* Tagline */}
            <div className="block text-white">
              <h1 className="font-bold text-sm md:text-lg leading-tight text-[#f5a623] truncate max-w-[180px] md:max-w-none">multimedia Creative Box</h1>
              <p className="text-xs md:text-sm text-gray-300 leading-tight max-w-[180px] md:max-w-none truncate md:whitespace-normal">Jasa Multimedia dan Live Camera Production</p>
            </div>
          </div>
          
          {/* Top Right Social & WA (Desktop Only) */}
          <div className="hidden md:flex items-center space-x-6 text-white">
            <div className="flex space-x-3 text-[#f5a623]">
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
              )}
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
              )}
            </div>
            <div className="text-sm font-bold flex items-center">
              Whatapp. {settings?.wa_number || 'Belum Diatur'}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-[#f5a623] focus:outline-none"
            >
              {isOpen ? <X className="block h-8 w-8" /> : <Menu className="block h-8 w-8" />}
            </button>
          </div>
        </div>

        {/* Bottom Row: Navigation (Desktop Only) */}
        <div className="hidden md:flex justify-between items-center py-3">
          
          <nav className="flex items-center bg-gray-800/40 rounded px-2 backdrop-blur-sm">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.name}
                  to={link.path} 
                  className={`px-4 py-3 font-medium text-sm transition-colors ${isActive ? 'text-[#f5a623] bg-gray-700/50' : 'text-gray-200 hover:text-white hover:bg-gray-700/30'}`}
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
                className={`flex items-center px-4 py-3 font-medium text-sm transition-colors ${location.pathname === '/price-list' ? 'text-[#f5a623] bg-gray-700/50' : 'text-gray-200 hover:text-white hover:bg-gray-700/30'}`}
              >
                Price List <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              
              <div 
                className={`absolute left-0 mt-0 w-48 bg-[#273554] border border-gray-700 rounded-md shadow-xl py-1 z-50 transition-all duration-200 ${isPriceListOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
              >
                <Link to="/price-list?tab=Live+Cam" className="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#f5a623]">Live Cam</Link>
                <Link to="/price-list?tab=LED+Videotron" className="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#f5a623]">LED Videotron</Link>
                <Link to="/price-list?tab=Stage+%26+Rigging" className="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#f5a623]">Stage & Rigging</Link>
                <Link to="/price-list?tab=Sound+System" className="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#f5a623]">Sound System</Link>
              </div>
            </div>
          </nav>

          <div className="hidden md:block">
            <button className="bg-[#f5a623] hover:bg-yellow-500 text-gray-900 font-bold py-2 px-8 text-sm transition-colors shadow-lg">
              PROMO !
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-[#273554] shadow-2xl transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-screen border-b border-gray-700 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              to={link.path} 
              className="block px-3 py-3 rounded-md text-base font-medium text-white hover:text-[#f5a623] hover:bg-gray-800" 
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="border-t border-gray-700 pt-2 mt-2">
            <span className="block px-3 py-2 text-sm font-semibold text-[#f5a623] uppercase">Price List</span>
            <Link to="/price-list?tab=Live+Cam" className="block px-3 py-3 rounded-md text-base font-medium text-white hover:text-[#f5a623] hover:bg-gray-800 pl-6" onClick={() => setIsOpen(false)}>Live Cam</Link>
            <Link to="/price-list?tab=LED+Videotron" className="block px-3 py-3 rounded-md text-base font-medium text-white hover:text-[#f5a623] hover:bg-gray-800 pl-6" onClick={() => setIsOpen(false)}>LED Videotron</Link>
            <Link to="/price-list?tab=Stage+%26+Rigging" className="block px-3 py-3 rounded-md text-base font-medium text-white hover:text-[#f5a623] hover:bg-gray-800 pl-6" onClick={() => setIsOpen(false)}>Stage & Rigging</Link>
            <Link to="/price-list?tab=Sound+System" className="block px-3 py-3 rounded-md text-base font-medium text-white hover:text-[#f5a623] hover:bg-gray-800 pl-6" onClick={() => setIsOpen(false)}>Sound System</Link>
          </div>
          
          <div className="border-t border-gray-700 pt-4 mt-4 px-3 flex flex-col space-y-4">
             <div className="text-white text-sm">
                Whatapp: <span className="font-bold text-[#f5a623]">{settings?.wa_number || 'Belum Diatur'}</span>
             </div>
             <button className="w-full bg-[#f5a623] text-gray-900 font-bold py-3 px-4 rounded text-sm transition-colors text-center">
              PROMO !
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
