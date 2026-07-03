import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const Footer = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from('site_settings').select('*').limit(1);
    if (data && data.length > 0) setSettings(data[0]);
  };

  return (
    <footer className="bg-[#1a2035] text-white pt-16 pb-8 border-t border-[#2a3045]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between mb-16">
          
          {/* Alamat Kantor */}
          <div className="mb-10 md:mb-0 md:w-1/2 md:pr-10">
            <h4 className="text-xl font-bold mb-6 text-white tracking-wide">Alamat Kantor</h4>
            <div className="text-sm text-gray-300 leading-relaxed space-y-6">
              <p className="max-w-xs">
                {settings?.address || 'Alamat belum diatur'}
              </p>
              
              <div className="space-y-1">
                <p className="flex">
                  <span className="w-16 inline-block font-semibold">Telp</span>
                  <span>: {settings?.wa_number || '-'}</span>
                </p>
                <p className="flex">
                  <span className="w-16 inline-block font-semibold">E-mail</span>
                  <span>: {settings?.email || '-'}</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Media Sosial */}
          <div className="md:w-1/2 md:pl-20">
            <h4 className="text-xl font-bold mb-6 text-white tracking-wide">Media Sosial</h4>
            <ul className="text-sm text-gray-300 space-y-2">
              <li><a href={settings?.facebook_url || '#'} className="hover:text-[#f5a623] transition-colors">Facebook</a></li>
              <li><a href={settings?.instagram_url || '#'} className="hover:text-[#f5a623] transition-colors">Instagram</a></li>
              <li><a href={`https://wa.me/${settings?.wa_number || ''}`} className="hover:text-[#f5a623] transition-colors">Whatsapp</a></li>
            </ul>
          </div>
          
        </div>
        
        {/* Bottom Bar: Copyright & Icons */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <p className="text-white font-medium text-xs">
              Copyright &copy; {new Date().getFullYear()} Multicam Indonesia
            </p>
            <span className="text-gray-600 text-xs">|</span>
            <a href="/admin/login" className="text-gray-500 hover:text-white transition-colors text-xs flex items-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Admin Login
            </a>
          </div>
          
          {/* Yellow Social Icons */}
          <div className="flex space-x-4 text-[#f5a623]">
            {/* Facebook */}
            <a href={settings?.facebook_url || '#'} className="hover:text-white transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            {/* Instagram */}
            <a href={settings?.instagram_url || '#'} className="hover:text-white transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            {/* Whatsapp */}
            <a href={`https://wa.me/${settings?.wa_number || ''}`} className="hover:text-white transition-colors">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
