import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Building2, Send } from 'lucide-react';

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

  const heroBg = settings?.hero_image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 text-[#273554] font-bold">
        <div className="w-10 h-10 border-4 border-[#273554]/20 border-t-[#273554] rounded-full animate-spin mr-3" />
        Memuat Kontak...
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 font-sans overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative w-full h-[250px] md:h-[300px] flex items-center justify-center bg-[#273554] overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center mix-blend-overlay"
          style={{ backgroundImage: `url('${heroBg}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#273554]/90 via-[#273554]/60 to-[#273554] z-0" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight uppercase drop-shadow-lg">
            CONTACT US
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#f5a623] to-yellow-300 mx-auto mt-6 rounded-full" />
        </motion.div>
      </section>

      {/* CONTACT DETAILS SECTION */}
      <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20 -mt-10 md:-mt-20">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="text-[#f5a623] font-bold text-lg md:text-xl tracking-wide mb-2">Kunjungi Kantor Kami</h3>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#273554] tracking-tight">Contact Details</h2>
        </motion.div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-900/10 border border-white p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left Column (Info) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`w-full flex flex-col text-center ${settings?.map_embed_url ? 'lg:w-1/3 items-center lg:items-start lg:text-left' : 'max-w-xl mx-auto items-center'}`}
          >
            {(settings?.address || settings?.email || settings?.wa_number) && (
              <h3 className={`text-2xl md:text-3xl font-extrabold text-[#273554] mb-10 flex items-center gap-3 justify-center ${settings?.map_embed_url ? 'lg:justify-start' : ''}`}>
                <Building2 className="w-8 h-8 text-[#f5a623] hidden lg:block" />
                Creative Box
              </h3>
            )}

            <div className="space-y-8 w-full">
              {settings?.address && (
                <div className={`flex flex-col lg:flex-row items-center gap-4 ${settings?.map_embed_url ? 'lg:items-start' : ''}`}>
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-[#273554]" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-lg mb-2">Address:</h4>
                    <p className="text-slate-600 font-medium leading-relaxed max-w-xs whitespace-pre-wrap">
                      {settings.address}
                    </p>
                  </div>
                </div>
              )}

              {settings?.wa_number && (
                <div className={`flex flex-col lg:flex-row items-center gap-4 ${settings?.map_embed_url ? 'lg:items-start' : ''}`}>
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-[#273554]" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-lg mb-2">Phone:</h4>
                    <p className="text-slate-600 font-medium leading-relaxed max-w-xs">
                      +{settings.wa_number}
                    </p>
                  </div>
                </div>
              )}

              {settings?.email && (
                <div className={`flex flex-col lg:flex-row items-center gap-4 ${settings?.map_embed_url ? 'lg:items-start' : ''}`}>
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-[#273554]" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-lg mb-2">Email:</h4>
                    <p className="text-slate-600 font-medium leading-relaxed max-w-xs whitespace-pre-wrap">
                      {settings.email}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {settings?.wa_number && (
              <div className={`mt-12 w-full flex justify-center ${settings?.map_embed_url ? 'lg:justify-start' : ''}`}>
                <a 
                  href={`https://wa.me/${settings.wa_number}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-full sm:w-auto bg-gradient-to-r from-[#f5a623] to-[#e09212] text-white font-extrabold py-4 px-8 rounded-xl shadow-lg shadow-orange-500/30 hover:-translate-y-1 hover:shadow-orange-500/40 transition-all duration-300 text-center"
                >
                  HUBUNGI VIA WHATSAPP
                </a>
              </div>
            )}
          </motion.div>

          {/* Right Column (Map) */}
          {settings?.map_embed_url && (
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-2/3 h-[400px] lg:h-auto rounded-2xl overflow-hidden shadow-inner border border-slate-200 relative group"
            >
              <div className="absolute inset-0 bg-[#273554]/5 group-hover:bg-transparent transition-colors duration-500 pointer-events-none z-10" />
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
      <section className="w-full py-20 bg-[#273554] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h3 className="text-[#f5a623] font-bold tracking-widest uppercase mb-2">Tinggalkan Pesan</h3>
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
                className="w-full px-5 py-4 bg-white/90 text-gray-900 rounded-xl outline-none focus:ring-2 focus:ring-[#f5a623] transition-all font-medium"
              />
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="Alamat Email" 
                className="w-full px-5 py-4 bg-white/90 text-gray-900 rounded-xl outline-none focus:ring-2 focus:ring-[#f5a623] transition-all font-medium"
              />
            </div>
            <div className="mb-6">
              <input 
                type="text" 
                required
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
                placeholder="Subjek Pesan" 
                className="w-full px-5 py-4 bg-white/90 text-gray-900 rounded-xl outline-none focus:ring-2 focus:ring-[#f5a623] transition-all font-medium"
              />
            </div>
            <div className="mb-8">
              <textarea 
                required
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                placeholder="Tulis pesan Anda disini..." 
                rows="5"
                className="w-full px-5 py-4 bg-white/90 text-gray-900 rounded-xl outline-none focus:ring-2 focus:ring-[#f5a623] transition-all font-medium resize-none"
              ></textarea>
            </div>
            <button 
              type="submit"
              disabled={formStatus === 'sending...'}
              className="w-full bg-gradient-to-r from-[#f5a623] to-[#e09212] hover:from-yellow-400 hover:to-orange-500 text-white font-extrabold py-4 px-8 rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {formStatus === 'sending...' ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> MENGIRIM...
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
