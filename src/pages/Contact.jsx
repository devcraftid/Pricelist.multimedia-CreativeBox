import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Building2, Send } from 'lucide-react';

// Authentic Brand Icons
const GoogleMapsIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
    <path d="M24 4C14.06 4 6 12.06 6 22C6 34.63 21.65 44.77 23.08 45.73C23.63 46.1 24.37 46.1 24.92 45.73C26.35 44.77 42 34.63 42 22C42 12.06 33.94 4 24 4Z" fill="#EA4335"/>
    <path d="M24 4C18.82 4 14.13 6.19 10.84 9.71L20.8 21.67L24 22V4Z" fill="#4285F4"/>
    <path d="M10.84 9.71C7.84 12.98 6 17.28 6 22C6 26.7 8.45 32.74 13.02 39.47L20.8 21.67L10.84 9.71Z" fill="#34A853"/>
    <path d="M24 4V22L33.64 25.21L41.02 16.3C38.3 10.36 32.32 5.68 25.18 4.22L24 4Z" fill="#FBBC05"/>
    <circle cx="24" cy="22" r="7" fill="white"/>
  </svg>
);

const WhatsAppIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
    <circle cx="24" cy="24" r="22" fill="#25D366"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M24 10C16.27 10 10 16.27 10 24C10 26.68 10.76 29.19 12.08 31.33L10.5 37.5L16.85 35.85C18.92 37.03 21.38 37.71 24 37.71C31.73 37.71 38 31.44 38 23.71C38 15.98 31.73 10 24 10ZM32.18 29.07C31.84 30.03 30.5 30.82 29.54 31.02C28.89 31.15 28.03 31.25 25.18 30.06C21.54 28.54 19.18 24.84 19 24.6C18.82 24.36 17.5 22.61 17.5 20.8C17.5 19 18.42 18.11 18.79 17.74C19.1 17.43 19.61 17.29 20.06 17.29C20.21 17.29 20.34 17.3 20.46 17.31C20.81 17.32 20.99 17.34 21.22 17.89C21.51 18.59 22.21 20.31 22.3 20.49C22.39 20.67 22.48 20.91 22.36 21.15C22.24 21.39 22.15 21.48 21.97 21.69C21.79 21.9 21.61 22.06 21.43 22.28C21.24 22.48 21.03 22.7 21.25 23.08C21.47 23.46 22.23 24.7 23.35 25.7C24.8 26.99 26 27.41 26.43 27.59C26.86 27.77 27.11 27.73 27.36 27.45C27.61 27.17 28.44 26.2 28.72 25.8C29 25.4 29.28 25.45 29.65 25.59C30.02 25.73 32 26.71 32.4 26.91C32.8 27.11 33.06 27.21 33.16 27.38C33.26 27.55 33.26 28.11 32.18 29.07Z" fill="white"/>
  </svg>
);

const InstagramIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
    <defs>
      <linearGradient id="contactIgGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f09433"/>
        <stop offset="25%" stopColor="#e6683c"/>
        <stop offset="50%" stopColor="#dc2743"/>
        <stop offset="75%" stopColor="#cc2366"/>
        <stop offset="100%" stopColor="#bc1888"/>
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="12" fill="url(#contactIgGrad)"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M24 13C27.59 13 28.01 13.01 29.43 13.08C30.74 13.14 31.45 13.36 31.93 13.54C32.55 13.78 33 14.09 33.46 14.54C33.91 15 34.22 15.45 34.46 16.07C34.64 16.55 34.86 17.26 34.92 18.57C34.99 19.99 35 20.41 35 24C35 27.59 34.99 28.01 34.92 29.43C34.86 30.74 34.64 31.45 34.46 31.93C34.22 32.55 33.91 33 33.46 33.46C33 33.91 32.55 34.22 31.93 34.46C31.45 34.64 30.74 34.86 29.43 34.92C28.01 34.99 27.59 35 24 35C20.41 35 19.99 34.99 18.57 34.92C17.26 34.86 16.55 34.64 16.07 34.46C15.45 34.22 15 33.91 14.54 33.46C14.09 33 13.78 32.55 13.54 31.93C13.36 31.45 13.14 30.74 13.08 29.43C13.01 28.01 13 27.59 13 24C13 20.41 13.01 19.99 13.08 18.57C13.14 17.26 13.36 16.55 13.54 16.07C13.78 15.45 14.09 15 14.54 14.54C15 14.09 15.45 13.78 16.07 13.54C16.55 13.36 17.26 13.14 18.57 13.08C19.99 13.01 20.41 13 24 13ZM24 15.16C20.47 15.16 20.06 15.17 18.67 15.24C17.38 15.3 16.68 15.51 16.22 15.69C15.6 15.93 15.16 16.22 14.7 16.7C14.22 17.16 13.93 17.6 13.69 18.22C13.51 18.68 13.3 19.38 13.24 20.67C13.17 22.06 13.16 22.47 13.16 26C13.16 29.53 13.17 29.94 13.24 31.33C13.3 32.62 13.51 33.32 13.69 33.78C13.93 34.4 14.22 34.84 14.7 35.3C15.16 35.78 15.6 36.07 16.22 36.31C16.68 36.49 17.38 36.7 18.67 36.76C20.06 36.83 20.47 36.84 24 36.84C27.53 36.84 27.94 36.83 29.33 36.76C30.62 36.7 31.32 36.49 31.78 36.31C32.4 36.07 32.84 35.78 33.3 35.3C33.78 34.84 34.07 34.4 34.31 33.78C34.49 33.32 34.7 32.62 34.76 31.33C34.83 29.94 34.84 29.53 34.84 26C34.84 22.47 34.83 22.06 34.76 20.67C34.7 19.38 34.49 18.68 34.31 18.22C34.07 17.6 33.78 17.16 33.3 16.7C32.84 16.22 32.4 15.93 31.78 15.69C31.32 15.51 30.62 15.3 29.33 15.24C27.94 15.17 27.53 15.16 24 15.16ZM24 18.35C20.88 18.35 18.35 20.88 18.35 24C18.35 27.12 20.88 29.65 24 29.65C27.12 29.65 29.65 27.12 29.65 24C29.65 20.88 27.12 18.35 24 18.35ZM24 27.49C22.07 27.49 20.51 25.93 20.51 24C20.51 22.07 22.07 20.51 24 20.51C25.93 20.51 27.49 22.07 27.49 24C27.49 25.93 25.93 27.49 24 27.49ZM31.19 18.13C31.19 18.86 30.6 19.45 29.87 19.45C29.14 19.45 28.55 18.86 28.55 18.13C28.55 17.4 29.14 16.81 29.87 16.81C30.6 16.81 31.19 17.4 31.19 18.13Z" fill="white"/>
  </svg>
);

const GmailIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
    <path d="M42 12V36C42 38.21 40.21 40 38 40H10C7.79 40 6 38.21 6 36V12L24 25L42 12Z" fill="#EA4335"/>
    <path d="M42 12L24 25L6 12C6 9.79 7.79 8 10 8H38C40.21 8 42 9.79 42 12Z" fill="#C5221F"/>
    <path d="M6 12V36H16V20L6 12Z" fill="#FBBC04"/>
    <path d="M42 12V36H32V20L42 12Z" fill="#34A853"/>
    <path d="M24 25L16 20V36H32V20L24 25Z" fill="#4285F4"/>
  </svg>
);

const Contact = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('site_settings').select('*').limit(1);
      if (data && data.length > 0) setSettings(data[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending...');
    try {
      const { error } = await supabase.from('contact_messages').insert([formData]);
      if (error) throw error;
      setFormStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setFormStatus(''), 3000);
    } catch (err) {
      console.error(err);
      setFormStatus('error');
    }
  };

  const handleInstagramClick = (e) => {
    if (typeof navigator === 'undefined') return;
    const ua = navigator.userAgent || '';
    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua);

    if (isAndroid) {
      e.preventDefault();
      window.location.href = 'intent://instagram.com/_u/creativebox.idn/#Intent;package=com.instagram.android;scheme=https;end';
      setTimeout(() => {
        window.location.href = 'https://www.instagram.com/creativebox.idn/';
      }, 1500);
    } else if (isIOS) {
      e.preventDefault();
      window.location.href = 'instagram://user?username=creativebox.idn';
      setTimeout(() => {
        window.location.href = 'https://www.instagram.com/creativebox.idn/';
      }, 1500);
    }
  };

  const heroBg = settings?.hero_image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 text-secondary font-bold">
        <div className="w-10 h-10 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin mr-3" />
        Memuat Kontak...
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 font-sans overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative w-full min-h-[250px] sm:min-h-[300px] pt-24 sm:pt-28 flex items-center justify-center bg-secondary overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center mix-blend-overlay"
          style={{ backgroundImage: `url('${heroBg}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/90 via-secondary/60 to-secondary z-0" />
        
        <motion.div 
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-white tracking-tight uppercase drop-shadow-lg">
            CONTACT US
          </h1>
          <div className="w-20 sm:w-24 h-1 sm:h-1.5 bg-gradient-to-r from-primary to-yellow-300 mx-auto mt-4 sm:mt-6 rounded-full" />
        </motion.div>
      </section>

      {/* CONTACT DETAILS SECTION */}
      <section className="py-12 sm:py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20 -mt-8 sm:-mt-12 md:-mt-20 overflow-hidden">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <h3 className="text-amber-600 font-extrabold text-base sm:text-lg md:text-xl tracking-wide mb-2">Kunjungi Kantor Kami</h3>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Contact Details</h2>
        </motion.div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-900/10 border border-white p-5 sm:p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-16 overflow-hidden">
          
          {/* Left Column (Info) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`w-full flex flex-col text-center ${settings?.map_embed_url ? 'lg:w-1/3 items-center lg:items-start lg:text-left' : 'max-w-xl mx-auto items-center'}`}
          >
            {(settings?.address || settings?.email || settings?.wa_number) && (
              <h3 className={`text-2xl md:text-3xl font-black text-slate-900 mb-8 flex items-center gap-3 justify-center ${settings?.map_embed_url ? 'lg:justify-start' : ''}`}>
                <Building2 className="w-8 h-8 text-amber-500 hidden lg:block" />
                Creative Box
              </h3>
            )}

            <div className="space-y-4 w-full">
              {/* Address (Click to Google Maps App / Web) */}
              {settings?.address && (
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-2xl border border-slate-200/80 bg-white hover:bg-amber-50/50 hover:border-amber-300 transition-all duration-300 shadow-xs hover:shadow-md active:scale-[0.99] text-center sm:text-left w-full cursor-pointer"
                  title="Klik untuk membuka di Google Maps"
                >
                  <div className="w-13 h-13 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform p-2">
                    <GoogleMapsIcon size={32} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-center sm:justify-between gap-2 mb-1">
                      <h4 className="font-extrabold text-slate-900 text-base">Address:</h4>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100/80 border border-amber-200/80 px-2.5 py-0.5 rounded-full group-hover:bg-amber-200 transition-colors">
                        Buka di Maps ↗
                      </span>
                    </div>
                    <p className="text-slate-600 font-medium text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                      {settings.address}
                    </p>
                  </div>
                </a>
              )}

              {/* Phone / WhatsApp (Click to WhatsApp App / Call) */}
              {settings?.wa_number && (() => {
                const cleanWa = settings.wa_number.replace(/\D/g, '');
                return (
                  <a 
                    href={`https://wa.me/${cleanWa}?text=${encodeURIComponent('Halo Creative Box, saya ingin menanyakan informasi layanan multimedia & event.')}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-2xl border border-slate-200/80 bg-white hover:bg-emerald-50/50 hover:border-emerald-300 transition-all duration-300 shadow-xs hover:shadow-md active:scale-[0.99] text-center sm:text-left w-full cursor-pointer"
                    title="Klik untuk membuka di WhatsApp"
                  >
                    <div className="w-13 h-13 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform p-2">
                      <WhatsAppIcon size={32} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-center sm:justify-between gap-2 mb-1">
                        <h4 className="font-extrabold text-slate-900 text-base">Phone:</h4>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-200/80 px-2.5 py-0.5 rounded-full group-hover:bg-emerald-200 transition-colors">
                          Buka di WhatsApp ↗
                        </span>
                      </div>
                      <p className="text-slate-800 font-bold text-sm sm:text-base tracking-wide">
                        +{cleanWa}
                      </p>
                    </div>
                  </a>
                );
              })()}

              {/* Email (Click to Mail App) */}
              {settings?.email && (
                <a 
                  href={`mailto:${settings.email}?subject=${encodeURIComponent('Konsultasi Layanan Creative Box')}`}
                  className="group flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-2xl border border-slate-200/80 bg-white hover:bg-blue-50/50 hover:border-blue-300 transition-all duration-300 shadow-xs hover:shadow-md active:scale-[0.99] text-center sm:text-left w-full cursor-pointer"
                  title="Klik untuk mengirim Email"
                >
                  <div className="w-13 h-13 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform p-2">
                    <GmailIcon size={32} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-center sm:justify-between gap-2 mb-1">
                      <h4 className="font-extrabold text-slate-900 text-base">Email:</h4>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-100/80 border border-blue-200/80 px-2.5 py-0.5 rounded-full group-hover:bg-blue-200 transition-colors">
                        Kirim Email ↗
                      </span>
                    </div>
                    <p className="text-slate-700 font-semibold text-xs sm:text-sm break-all">
                      {settings.email}
                    </p>
                  </div>
                </a>
              )}

              {/* Instagram (Click to Instagram App) */}
              <a 
                href="https://www.instagram.com/creativebox.idn/"
                target="_blank" 
                rel="noopener noreferrer"
                onClick={handleInstagramClick}
                className="group flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-2xl border border-slate-200/80 bg-white hover:bg-pink-50/50 hover:border-pink-300 transition-all duration-300 shadow-xs hover:shadow-md active:scale-[0.99] text-center sm:text-left w-full cursor-pointer"
                title="Klik untuk membuka di Aplikasi Instagram"
              >
                <div className="w-13 h-13 rounded-2xl bg-pink-50/60 border border-pink-100 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform p-2">
                  <InstagramIcon size={32} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-center sm:justify-between gap-2 mb-1">
                    <h4 className="font-extrabold text-slate-900 text-base">Instagram:</h4>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-pink-800 bg-pink-100/80 border border-pink-200/80 px-2.5 py-0.5 rounded-full group-hover:bg-pink-200 transition-colors">
                      Buka di Instagram ↗
                    </span>
                  </div>
                  <p className="text-slate-800 font-bold text-xs sm:text-sm tracking-wide break-all">
                    @creativebox.idn
                  </p>
                </div>
              </a>
            </div>

            {/* Quick Action CTA Buttons */}
            <div className={`mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3.5 justify-center w-full ${settings?.map_embed_url ? 'lg:justify-start' : ''}`}>
              {settings?.wa_number && (() => {
                const cleanWa = settings.wa_number.replace(/\D/g, '');
                return (
                  <a 
                    href={`https://wa.me/${cleanWa}?text=${encodeURIComponent('Halo Creative Box, saya ingin menanyakan informasi layanan multimedia & event.')}`}
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 hover:shadow-emerald-500/35 transition-all duration-300 text-center flex items-center justify-center gap-2.5 text-sm"
                  >
                    <WhatsAppIcon size={22} />
                    <span>CHAT WHATSAPP</span>
                  </a>
                );
              })()}
              <a 
                href="https://www.instagram.com/creativebox.idn/"
                target="_blank" 
                rel="noreferrer" 
                onClick={handleInstagramClick}
                className="w-full sm:w-auto bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg shadow-purple-500/25 hover:-translate-y-0.5 hover:shadow-purple-500/40 transition-all duration-300 text-center flex items-center justify-center gap-2.5 text-sm cursor-pointer"
              >
                <InstagramIcon size={22} />
                <span>BUKA INSTAGRAM</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column (Map) */}
          {settings?.map_embed_url && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-2/3 h-[400px] lg:h-auto rounded-2xl overflow-hidden shadow-inner border border-slate-200 relative group"
            >
              <div className="absolute inset-0 bg-secondary/5 group-hover:bg-transparent transition-colors duration-500 pointer-events-none z-10" />
              <iframe 
                src={settings.map_embed_url} 
                width="100%" 
                height="100%" 
                style={{ border: 0, minHeight: '400px' }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
            </motion.div>
          )}

        </div>
      </section>

      {/* CONTACT FORM SECTION */}
      <section className="w-full py-20 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h3 className="text-primary font-bold tracking-widest uppercase mb-2">Tinggalkan Pesan</h3>
            <h2 className="text-4xl font-extrabold text-white tracking-tight">Kirim E-mail Kepada Kami</h2>
            <p className="text-slate-300 mt-4 max-w-xl mx-auto">Kami Siap Bekerja sama dan berkelanjutan! Tinggalkan pesan Anda dan kami akan segera membalasnya.</p>
          </div>
          
          <motion.form 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleContactSubmit}
            className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Nama Lengkap" 
                className="w-full px-5 py-4 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl outline-none focus:ring-2 focus:ring-primary border border-slate-200 transition-all font-medium shadow-sm"
              />
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="Alamat Email" 
                className="w-full px-5 py-4 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl outline-none focus:ring-2 focus:ring-primary border border-slate-200 transition-all font-medium shadow-sm"
              />
            </div>
            <div className="mb-6">
              <input 
                type="text" 
                required
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
                placeholder="Subjek Pesan" 
                className="w-full px-5 py-4 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl outline-none focus:ring-2 focus:ring-primary border border-slate-200 transition-all font-medium shadow-sm"
              />
            </div>
            <div className="mb-8">
              <textarea 
                required
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                placeholder="Tulis pesan Anda disini..." 
                rows="5"
                className="w-full px-5 py-4 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl outline-none focus:ring-2 focus:ring-primary border border-slate-200 transition-all font-medium resize-none shadow-sm"
              ></textarea>
            </div>
            <button 
              type="submit" 
              disabled={formStatus === 'sending...'} 
              className="w-full bg-gradient-to-r from-primary to-amber-500 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black py-4 px-8 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {formStatus === 'sending...' ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" /> MENGIRIM...
                </div>
              ) : (
                <><Send className="w-5 h-5" /> KIRIM PESAN</>
              )}
            </button>
            {formStatus === 'success' && (
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-green-400 font-bold text-center mt-4">
                Pesan berhasil dikirim! Kami akan segera menghubungi Anda.
              </motion.p>
            )}
            {formStatus === 'error' && (
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 font-bold text-center mt-4">
                Gagal mengirim pesan. Silakan hubungi via WhatsApp.
              </motion.p>
            )}
          </motion.form>
        </div>
      </section>

    </div>
  );
};

export default Contact;
