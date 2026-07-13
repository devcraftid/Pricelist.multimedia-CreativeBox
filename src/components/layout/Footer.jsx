import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { MapPin, Phone, Mail, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from('site_settings').select('*').limit(1);
    if (data && data.length > 0) setSettings(data[0]);
  };

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Price List', path: '/price-list' },
    { name: 'Project Update !', path: '/projects' },
    { name: 'About', path: '/about' },
    { name: 'Contact Us', path: '/contact' }
  ];

  return (
    <footer className="bg-secondary text-white pt-20 pb-10 border-t border-white/5 relative overflow-hidden z-20">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-[150px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[150px] opacity-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & About */}
          <div className="lg:col-span-5">
            <Link to="/" className="inline-block mb-6">
              <img 
                src="/admin-logo.png" 
                alt="Creative Box Logo" 
                className="h-14 object-contain filter invert brightness-0" 
              />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-md">
              Creative Box menyediakan layanan multimedia profesional, live camera production, dan berbagai kebutuhan event management Anda dengan kualitas terbaik dan tim yang berpengalaman.
            </p>
            
            <div className="flex space-x-4">
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
              )}
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              )}
              <a href={`https://wa.me/${settings?.wa_number || ''}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Tautan Cepat</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="text-slate-400 hover:text-primary text-sm font-medium transition-colors flex items-center py-2 relative z-30">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mr-3 opacity-0 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-4">
            <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Hubungi Kami</h4>
            <ul className="space-y-5">
              <li className="flex items-start">
                <MapPin className="text-primary shrink-0 mr-4 mt-0.5" size={20} />
                <span className="text-slate-400 text-sm leading-relaxed">{settings?.address || 'Alamat belum diatur'}</span>
              </li>
              <li className="flex items-center">
                <Phone className="text-primary shrink-0 mr-4" size={20} />
                <span className="text-slate-400 text-sm font-medium">{settings?.wa_number || '-'}</span>
              </li>
              <li className="flex items-center">
                <Mail className="text-primary shrink-0 mr-4" size={20} />
                <span className="text-slate-400 text-sm font-medium">{settings?.email || '-'}</span>
              </li>
            </ul>
          </div>
          
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 font-medium text-sm text-center md:text-left">
            © {new Date().getFullYear()} Creative Box. All rights reserved.
          </p>
          
          <Link to="/admin/login" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-bold bg-white/5 px-4 py-2 rounded-full hover:bg-white/10">
            <LogIn size={16} />
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
