import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { MapPin, Phone, Mail, LogIn, ArrowUp, ArrowRight, MessageCircle, Film, Video, Radio, Camera } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const [settings, setSettings] = useState(null);
  const location = useLocation();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await supabase.from('site_settings').select('*').limit(1);
      if (data && data.length > 0) setSettings(data[0]);
    } catch (e) {
      console.error('Error fetching settings for footer:', e);
    }
  };

  // Memastikan saat navigasi dari Footer, layar seketika berada di atas
  // dan transisi halaman baru turun dengan indah dari ATAS.
  const handleNavClick = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  };

  const scrollToTopSmooth = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Price List', path: '/price-list' },
    { name: 'Project Update !', path: '/projects' },
    { name: 'About', path: '/about' },
    { name: 'Contact Us', path: '/contact' }
  ];

  const featuredServices = [
    { name: 'Live Cam Multi-Camera', path: '/price-list?tab=Live+Cam', icon: Video },
    { name: 'Event Live Streaming', path: '/services', icon: Radio },
    { name: 'Dokumentasi & Video Cinematic', path: '/services', icon: Film },
    { name: 'Rental Alat Multimedia', path: '/services', icon: Camera }
  ];

  const waNumber = settings?.wa_number || '6287772486006';
  const cleanWaNumber = waNumber.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent('Halo Admin Creative Box, saya ingin berkonsultasi mengenai layanan multimedia/live event.')}`;

  return (
    <footer className="bg-secondary text-white relative overflow-hidden z-20 border-t border-white/10 selection:bg-primary/20 selection:text-primary w-full max-w-full">
      {/* HD Gradient Glow Line on Top Border */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />

      {/* Ambient Lighting Orbs */}
      <div className="absolute top-10 right-0 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-primary/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 sm:w-[450px] h-72 sm:h-[450px] bg-blue-600/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[300px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-12 sm:pt-16 pb-8 sm:pb-12">
        
        {/* TOP CTA CONSULTATION BANNER (HD Glassmorphism) */}
        <div className="mb-12 sm:mb-16 p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-white/[0.07] via-white/[0.04] to-white/[0.02] border border-white/15 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-primary/15 rounded-full blur-3xl pointer-events-none transition-transform group-hover:scale-125 duration-700" />
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 relative z-10">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Online • Siap Konsultasi Event</span>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight mb-2.5 sm:mb-3">
                Siap Mewujudkan Event Spektakuler Bersama Creative Box?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm sm:leading-relaxed">
                Dari live broadcast multi-kamera hingga dokumentasi sinematik, kami siap mengabadikan momen berharga Anda dengan standar industri terbaik.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto shrink-0">
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-primary to-amber-500 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-0.5 text-center min-h-[44px]"
              >
                <MessageCircle size={18} className="fill-current shrink-0" />
                <span>Konsultasi WhatsApp</span>
              </a>
              <Link
                to="/price-list"
                onClick={handleNavClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/15 backdrop-blur-md transition-all duration-300 hover:border-white/30 text-center min-h-[44px]"
              >
                <span>Lihat Pricelist</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* MAIN FOOTER GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8 mb-12 sm:mb-16">
          
          {/* Column 1: Brand & Identity (Col 4) */}
          <div className="lg:col-span-4 space-y-6">
            <Link 
              to="/" 
              onClick={handleNavClick}
              className="inline-flex items-center gap-3 group"
            >
              <img 
                src={settings?.logo_url || "/admin-logo.png"} 
                alt="Creative Box Logo" 
                className="h-12 w-auto object-contain filter invert brightness-0 transition-transform group-hover:scale-105" 
              />
              <div className="border-l border-white/20 pl-3">
                <span className="block font-black text-sm tracking-wider text-white">MULTIMEDIA</span>
                <span className="block text-[10px] tracking-widest text-primary font-bold uppercase">Creative Box</span>
              </div>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Solusi multimedia visual profesional, multi-camera live broadcast, dan dokumentasi event dengan teknologi terdepan untuk menghadirkan kualitas visual tanpa kompromi.
            </p>

            {/* Social Media Links with HD Hover Ring */}
            <div className="flex items-center space-x-3 pt-2">
              {settings?.facebook_url && (
                <a 
                  href={settings.facebook_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  aria-label="Facebook Creative Box"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-primary/20 hover:border-primary/40 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
              )}
              {settings?.instagram_url && (
                <a 
                  href={settings.instagram_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  aria-label="Instagram Creative Box"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-primary/20 hover:border-primary/40 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              )}
              <a 
                href={waUrl} 
                target="_blank" 
                rel="noreferrer" 
                aria-label="WhatsApp Creative Box"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/20"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (Col 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-extrabold mb-5 tracking-wider uppercase text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Menu Navigasi</span>
            </h4>
            <ul className="space-y-1.5">
              {quickLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <li key={link.name}>
                    <Link 
                      to={link.path} 
                      onClick={handleNavClick}
                      className={`group flex items-center gap-2 py-1.5 text-sm font-semibold transition-all duration-200 ${
                        isActive 
                          ? 'text-primary translate-x-1' 
                          : 'text-slate-400 hover:text-white hover:translate-x-1.5'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                        isActive 
                          ? 'bg-primary scale-125' 
                          : 'bg-white/20 group-hover:bg-primary group-hover:scale-110'
                      }`} />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 3: Featured Services (Col 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-extrabold mb-5 tracking-wider uppercase text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Layanan Utama</span>
            </h4>
            <ul className="space-y-2.5">
              {featuredServices.map((service, idx) => {
                const IconComponent = service.icon;
                return (
                  <li key={idx}>
                    <Link
                      to={service.path}
                      onClick={handleNavClick}
                      className="group flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all duration-200 text-slate-300 hover:text-white"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-primary/20 flex items-center justify-center text-primary shrink-0 transition-colors">
                        <IconComponent size={15} />
                      </div>
                      <span className="text-xs font-semibold leading-snug group-hover:translate-x-0.5 transition-transform">
                        {service.name}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 4: Contact & Studio Info (Col 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-extrabold mb-5 tracking-wider uppercase text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Hubungi Kami</span>
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-300 text-xs leading-relaxed group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <MapPin size={15} />
                </div>
                <div>
                  <span className="block font-bold text-white mb-0.5">Alamat Studio:</span>
                  <span className="text-slate-400">{settings?.address || 'Alamat studio belum diatur'}</span>
                </div>
              </li>

              <li className="flex items-center gap-3 text-slate-300 text-xs group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary shrink-0">
                  <Phone size={15} />
                </div>
                <div>
                  <span className="block font-bold text-white mb-0.5">WhatsApp / Call:</span>
                  <a href={waUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary transition-colors">
                    {settings?.wa_number || '-'}
                  </a>
                </div>
              </li>

              <li className="flex items-center gap-3 text-slate-300 text-xs group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary shrink-0">
                  <Mail size={15} />
                </div>
                <div>
                  <span className="block font-bold text-white mb-0.5">Email Resmi:</span>
                  <a href={`mailto:${settings?.email || ''}`} className="text-slate-400 hover:text-primary transition-colors">
                    {settings?.email || '-'}
                  </a>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM BAR WITH SMOOTH SCROLL TO TOP & ADMIN LINK */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 font-medium text-xs text-center md:text-left">
            © {new Date().getFullYear()} <span className="text-white font-bold">Multimedia Creative Box</span>. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            {/* Scroll to Top Trigger in Footer */}
            <button
              onClick={scrollToTopSmooth}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
            >
              <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform text-primary" />
              <span>Kembali ke Atas</span>
            </button>

            {/* Admin Portal Link */}
            <Link 
              to="/admin/login" 
              onClick={handleNavClick}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-all text-xs font-bold bg-white/5 hover:bg-primary/20 px-4 py-2 rounded-full border border-white/10 hover:border-primary/40 group"
            >
              <LogIn size={14} className="group-hover:text-primary transition-colors" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
