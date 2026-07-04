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
    { name: 'Project Update !', path: '/projects' },
    { name: 'About', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'News & Blog', path: '/blog' },
  ];

  const isDarkBg = location.pathname === '/' || location.pathname === '/services';
  const navbarClass = `w-full z-50 transition-all duration-500 fixed top-0 ${
    isScrolled 
      ? 'bg-[#1b253b]/95 backdrop-blur-md shadow-lg py-2 border-b border-white/5' 
      : (isDarkBg ? 'bg-transparent py-4' : 'bg-[#273554] py-4')
  }`;

  return (
    <header className={navbarClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <img 
                src="/admin-logo.png" 
                alt="Logo Creative Box" 
                className="h-14 sm:h-16 md:h-20 object-contain filter invert brightness-0 drop-shadow-sm transition-transform duration-300 group-hover:scale-105" 
              />
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
                  className={`relative px-4 py-2 font-semibold text-sm transition-colors rounded-full ${isActive ? 'text-[#f5a623]' : 'text-slate-200 hover:text-white hover:bg-white/5'}`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div layoutId="navbar-indicator" className="absolute bottom-1 left-4 right-4 h-0.5 bg-[#f5a623] rounded-full" />
                  )}
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
                className={`flex items-center px-4 py-2 font-semibold text-sm transition-colors rounded-full ${location.pathname.includes('/price-list') ? 'text-[#f5a623]' : 'text-slate-200 hover:text-white hover:bg-white/5'}`}
              >
                Price List <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-300 ${isPriceListOpen ? 'rotate-180 text-[#f5a623]' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isPriceListOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-2 w-56 bg-[#1b253b]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden"
                  >
                    {['Live Cam', 'LED Videotron', 'Stage & Rigging', 'Sound System'].map((item) => (
                      <Link 
                        key={item}
                        to={`/price-list?tab=${encodeURIComponent(item)}`} 
                        className="block px-5 py-3 text-sm font-medium text-slate-300 hover:bg-[#f5a623]/10 hover:text-[#f5a623] hover:pl-6 transition-all"
                      >
                        {item}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="text-sm font-bold flex items-center text-white">
              <Phone size={16} className="mr-2 text-[#f5a623]" />
              {settings?.wa_number || 'Belum Diatur'}
            </div>
            <button className="bg-gradient-to-r from-[#f5a623] to-[#e09212] hover:from-yellow-400 hover:to-orange-500 text-white font-extrabold py-2 px-6 rounded-full text-sm transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transform hover:-translate-y-0.5 tracking-wide">
              PROMO !
            </button>
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
            className="lg:hidden bg-[#1b253b] border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  to={link.path} 
                  className={`block px-4 py-3 rounded-xl text-sm font-bold transition-colors ${location.pathname === link.path ? 'bg-[#f5a623]/10 text-[#f5a623]' : 'text-slate-300 hover:text-white hover:bg-white/5'}`} 
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="pt-4 mt-4 border-t border-white/10">
                <span className="block px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-widest">Price List</span>
                {['Live Cam', 'LED Videotron', 'Stage & Rigging', 'Sound System'].map((item) => (
                  <Link 
                    key={item}
                    to={`/price-list?tab=${encodeURIComponent(item)}`} 
                    className="block px-4 py-3 rounded-xl text-sm font-bold text-slate-300 hover:bg-[#f5a623]/10 hover:text-[#f5a623] transition-colors" 
                    onClick={() => setIsOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
              </div>
              
              <div className="pt-6 mt-4 flex flex-col space-y-4">
                 <div className="text-white text-sm px-4 flex items-center">
                    <Phone size={16} className="mr-2 text-[#f5a623]" />
                    <span className="font-bold">{settings?.wa_number || 'Belum Diatur'}</span>
                 </div>
                 <button className="w-full bg-gradient-to-r from-[#f5a623] to-[#e09212] text-white font-extrabold py-3.5 px-4 rounded-xl text-sm transition-shadow shadow-lg shadow-orange-500/20">
                  PROMO !
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
