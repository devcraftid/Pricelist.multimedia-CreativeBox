import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [settings, setSettings] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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
    { name: 'Price List', path: '/price-list' },
    { name: 'Project Update !', path: '/projects' },
    { name: 'About', path: '/about' },
    { name: 'Contact Us', path: '/contact' }
  ];

  const isDarkBg = location.pathname === '/' || location.pathname === '/services';
  const navbarClass = `w-full max-w-full z-50 transition-all duration-500 fixed top-0 ${
    isScrolled 
      ? 'bg-secondary/90 backdrop-blur-xl shadow-2xl shadow-black/30 py-2.5 border-b border-white/10' 
      : (isDarkBg ? 'bg-gradient-to-b from-secondary/80 to-transparent py-4' : 'bg-secondary/95 backdrop-blur-lg py-4 border-b border-white/5')
  }`;

  return (
    <header className={navbarClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 min-w-0 pr-2">
            <Link to="/" className="flex-shrink-0 flex items-center group relative h-12 sm:h-16 md:h-20 w-20 sm:w-28 md:w-32">
              {/* Static Text (Bottom 25%) */}
              <img 
                src={settings?.logo_url || "/admin-logo.png"} 
                alt="Logo Creative Box" 
                className="absolute inset-0 w-full h-full object-contain filter invert brightness-0 drop-shadow-sm" 
                style={{ clipPath: 'polygon(0 75%, 100% 75%, 100% 100%, 0 100%)' }}
              />
              
              {/* Animated Dice Container (Top 75%) */}
              <div 
                className="absolute inset-0"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 0 75%)' }}
              >
                <motion.img 
                  src={settings?.logo_url || "/admin-logo.png"} 
                  alt="Logo Creative Box" 
                  className="w-full h-full object-contain filter invert brightness-0 drop-shadow-sm" 
                  animate={{ 
                    y: [0, -8, 0, 0, 0],
                    rotateY: [0, 0, 0, 360, 360],
                    scale: [1, 1.1, 1, 1, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    times: [0, 0.2, 0.4, 0.8, 1],
                    repeat: Infinity, 
                    ease: "easeInOut"
                  }}
                />
              </div>
            </Link>
            
            <div className="block text-white border-l border-white/20 pl-2 sm:pl-3 ml-0.5 sm:ml-1 min-w-0">
              <h1 className="font-extrabold text-[10px] sm:text-xs md:text-sm lg:text-base leading-tight text-white tracking-wide truncate max-w-[160px] sm:max-w-xs lg:max-w-none">
                MULTIMEDIA CREATIVE BOX
              </h1>
              <p className="text-[7.5px] sm:text-[9px] md:text-xs text-blue-200/80 uppercase tracking-widest font-semibold mt-0.5 truncate">
                Production Services
              </p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.name}
                  to={link.path} 
                  className={`relative px-4 py-2 font-semibold text-sm transition-colors rounded-full ${isActive ? 'text-primary' : 'text-slate-200 hover:text-white hover:bg-white/5'}`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div layoutId="navbar-indicator" className="absolute bottom-1 left-4 right-4 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="text-sm font-bold flex items-center text-white">
              <Phone size={16} className="mr-2 text-primary" />
              {settings?.wa_number || 'Belum Diatur'}
            </div>
            {settings?.promo_active && (
              <a href={settings.promo_link || '#'} className="bg-gradient-to-r from-primary to-amber-500 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold py-2 px-6 rounded-full text-sm transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 transform hover:-translate-y-0.5 tracking-wide">
                {settings.promo_text || 'PROMO !'}
              </a>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Buka Menu Navigasi"
              className="inline-flex items-center justify-center p-2 sm:p-2.5 rounded-xl text-white hover:bg-white/10 active:bg-white/20 transition-all focus:outline-none min-h-[44px] min-w-[44px] touch-manipulation"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown with HD Top-Down Transition */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -12 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden bg-secondary/95 backdrop-blur-2xl border-t border-white/10 shadow-2xl overflow-y-auto max-h-[calc(100vh-75px)] overscroll-contain"
          >
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  to={link.path} 
                  className={`block px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                    location.pathname === link.path 
                      ? 'bg-primary/15 text-primary border border-primary/20 shadow-inner' 
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`} 
                  onClick={() => {
                    setIsOpen(false);
                    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                  }}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="pt-6 mt-4 border-t border-white/10 flex flex-col space-y-4">
                 <div className="text-white text-sm px-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <Phone size={16} className="mr-2 text-primary" />
                      <span className="font-bold">{settings?.wa_number || 'Belum Diatur'}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      Fast Response
                    </span>
                 </div>
                 {settings?.promo_active && (
                   <a 
                     href={settings.promo_link || '#'} 
                     className="w-full block text-center bg-gradient-to-r from-primary to-amber-500 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl text-sm transition-all shadow-lg shadow-primary/20"
                   >
                    {settings.promo_text || 'PROMO !'}
                   </a>
                 )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
