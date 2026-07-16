import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPriceListOpen, setIsPriceListOpen] = useState(false);
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
  const navbarClass = `w-full z-50 transition-all duration-500 fixed top-0 ${
    isScrolled 
      ? 'bg-secondary/95 backdrop-blur-md shadow-lg py-2 border-b border-white/5' 
      : (isDarkBg ? 'bg-transparent py-4' : 'bg-secondary py-4')
  }`;

  return (
    <header className={navbarClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link to="/" className="flex-shrink-0 flex items-center group relative h-14 sm:h-16 md:h-20 w-24 sm:w-28 md:w-32">
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
            
            <div className="block text-white border-l border-white/20 pl-2 sm:pl-4 ml-1 sm:ml-2">
              <h1 className="font-extrabold text-[11px] sm:text-sm md:text-base leading-tight text-white tracking-wide">MULTIMEDIA CREATIVE BOX</h1>
              <p className="text-[8px] sm:text-[10px] md:text-xs text-blue-200/80 uppercase tracking-widest font-semibold mt-0.5">Production Services</p>
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
              <a href={settings.promo_link || '#'} className="bg-gradient-to-r from-primary to-primary hover:from-yellow-400 hover:to-orange-500 text-white font-extrabold py-2 px-6 rounded-full text-sm transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transform hover:-translate-y-0.5 tracking-wide">
                {settings.promo_text || 'PROMO !'}
              </a>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-white hover:bg-white/10 transition-colors focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-secondary border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  to={link.path} 
                  className={`block px-4 py-3 rounded-xl text-sm font-bold transition-colors ${location.pathname === link.path ? 'bg-primary/10 text-primary' : 'text-slate-300 hover:text-white hover:bg-white/5'}`} 
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              

              
              <div className="pt-6 mt-4 flex flex-col space-y-4">
                 <div className="text-white text-sm px-4 flex items-center">
                    <Phone size={16} className="mr-2 text-primary" />
                    <span className="font-bold">{settings?.wa_number || 'Belum Diatur'}</span>
                 </div>
                 {settings?.promo_active && (
                   <a href={settings.promo_link || '#'} className="w-full block text-center bg-gradient-to-r from-primary to-primary text-white font-extrabold py-3.5 px-4 rounded-xl text-sm transition-shadow shadow-lg shadow-orange-500/20">
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
