import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, Award, Users, Clock, ShieldCheck, Handshake, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const [settings, setSettings] = useState(null);
  const [aboutData, setAboutData] = useState(null);
  const [advantages, setAdvantages] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        { data: settingsData },
        { data: clientsData },
        { data: aboutRes },
        { data: advantagesRes }
      ] = await Promise.all([
        supabase.from('site_settings').select('*').limit(1),
        supabase.from('clients').select('*').order('order_index', { ascending: true }),
        supabase.from('about_page').select('*').limit(1),
        supabase.from('advantages').select('*').order('order_index', { ascending: true })
      ]);

      if (settingsData && settingsData.length > 0) setSettings(settingsData[0]);
      if (clientsData) setClients(clientsData);
      if (aboutRes && aboutRes.length > 0) setAboutData(aboutRes[0]);
      if (advantagesRes) setAdvantages(advantagesRes);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const heroBg = aboutData?.team_image_url || settings?.hero_image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80';

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 text-[#273554] font-bold">
      <div className="w-10 h-10 border-4 border-[#273554]/20 border-t-[#273554] rounded-full animate-spin mr-3" />
      Memuat Profil...
    </div>;
  }

  // Use a default set of features if advantages table is empty so the layout doesn't break horribly before admin adds them
  const displayAdvantages = advantages.length > 0 ? advantages : [
    { title: "Lengkap dan Berpengalaman", description: "Telah berpengalaman menangani berbagai event besar." },
    { title: "Kerjasama Flexible", description: "Bisa melalui badan hukum CV/PT maupun perorangan." },
    { title: "Harga Terjangkau", description: "Buktikan! Harga kami termurah di kelasnya dengan kualitas terbaik." }
  ];

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
            ABOUT US
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#f5a623] to-yellow-300 mx-auto mt-6 rounded-full" />
        </motion.div>
      </section>

      {/* MAIN CONTENT & FEATURES */}
      <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20 -mt-10 md:-mt-20">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-900/10 border border-white p-8 md:p-16 flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left Column (Main Text) */}
          <div className="w-full lg:w-1/2">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-[#f5a623] font-bold text-lg md:text-xl mb-3 tracking-wide">About Us</h3>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#273554] mb-8 leading-tight tracking-tight">
                {settings?.hero_title || 'Creative Box'}
              </h2>
              
              <div className="space-y-6 text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                {aboutData?.company_history || 'Creative Box menyediakan jasa live camera production profesional...'}
                
                {aboutData?.vision && (
                  <div className="mt-6">
                    <h4 className="font-bold text-slate-800 text-lg mb-2">Visi Kami</h4>
                    <p>{aboutData.vision}</p>
                  </div>
                )}
                {aboutData?.mission && (
                  <div className="mt-6">
                    <h4 className="font-bold text-slate-800 text-lg mb-2">Misi Kami</h4>
                    <p>{aboutData.mission}</p>
                  </div>
                )}
              </div>

              {settings?.wa_number && (
                <div className="mt-10">
                  <a 
                    href={`https://wa.me/${settings.wa_number}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-block bg-gradient-to-r from-[#f5a623] to-[#e09212] text-white font-extrabold py-4 px-8 rounded-xl shadow-lg shadow-orange-500/30 hover:-translate-y-1 hover:shadow-orange-500/40 transition-all duration-300"
                  >
                    HUBUNGI VIA WHATSAPP
                  </a>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column (Key Features from Advantages) */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-10">
            {displayAdvantages.slice(0, 3).map((feat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group"
              >
                <div>
                  <h4 className="text-xl font-bold text-[#273554] mb-2">{feat.title}</h4>
                  <p className="text-slate-500 leading-relaxed text-sm">{feat.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* STATS BANNER */}
      {(aboutData?.stat_1_title || aboutData?.stat_2_title) && (
        <section className="relative w-full py-16 bg-[#273554] overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x divide-white/10 text-center">
              
              {aboutData?.stat_1_title && (
                <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="flex flex-col items-center">
                  <Calendar className="w-8 h-8 text-[#f5a623] mb-4" />
                  <div className="text-3xl md:text-5xl font-black text-white mb-2">{aboutData.stat_1_value}</div>
                  <div className="text-xs md:text-sm text-slate-300 uppercase tracking-widest font-medium">{aboutData.stat_1_title}</div>
                </motion.div>
              )}

              {aboutData?.stat_2_title && (
                <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="flex flex-col items-center pl-8 md:pl-12">
                  <Award className="w-8 h-8 text-[#f5a623] mb-4" />
                  <div className="text-3xl md:text-5xl font-black text-white mb-2">{aboutData.stat_2_value}</div>
                  <div className="text-xs md:text-sm text-slate-300 uppercase tracking-widest font-medium">{aboutData.stat_2_title}</div>
                </motion.div>
              )}

              {aboutData?.stat_3_title && (
                <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-col items-center">
                  <Users className="w-8 h-8 text-[#f5a623] mb-4" />
                  <div className="text-3xl md:text-5xl font-black text-white mb-2">{aboutData.stat_3_value}</div>
                  <div className="text-xs md:text-sm text-slate-300 uppercase tracking-widest font-medium">{aboutData.stat_3_title}</div>
                </motion.div>
              )}

              {aboutData?.stat_4_title && (
                <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="flex flex-col items-center pl-8 md:pl-12">
                  <Clock className="w-8 h-8 text-[#f5a623] mb-4" />
                  <div className="text-3xl md:text-5xl font-black text-white mb-2">{aboutData.stat_4_value}</div>
                  <div className="text-xs md:text-sm text-slate-300 uppercase tracking-widest font-medium">{aboutData.stat_4_title}</div>
                </motion.div>
              )}

            </div>
          </div>
        </section>
      )}

      {/* SPLIT ADVANTAGES SECTION */}
      <section className="w-full flex flex-col md:flex-row bg-white">
        <div className="w-full md:w-1/2 relative min-h-[400px] md:min-h-[600px] flex items-center p-8 sm:p-12 md:p-20 overflow-hidden">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center transform hover:scale-105 transition-transform duration-1000"
            style={{ backgroundImage: `url('${settings?.hero_image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80'}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#273554]/95 to-[#273554]/80 z-0" />
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative z-10 w-full max-w-lg mx-auto md:ml-auto md:mr-0"
          >
            <h3 className="text-[#f5a623] font-bold text-sm mb-4 tracking-widest uppercase">Acara Sukses tanpa biaya mahal</h3>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Kualitas Terbaik,<br/>Relatif Murah di<br/>Kelasnya!
            </h2>
            <div className="w-16 h-1 bg-[#f5a623] mb-8" />
            <p className="text-slate-300 text-base leading-relaxed mb-10 max-w-md font-medium">
              Kami memberikan layanan yang terjangkau untuk setiap kalangan dan kelas perusahaan. Kami bisa menyesuaikan dengan budget klien, sehingga dokumentasi tidak terlalu membebani biaya pengeluaran acara Anda.
            </p>
            <Link to="/price-list" className="inline-block bg-white text-[#273554] font-extrabold py-3.5 px-8 rounded-lg shadow-lg hover:bg-slate-100 transition-colors">
              LIHAT PRICE LIST
            </Link>
          </motion.div>
        </div>

        <div className="w-full md:w-1/2 relative min-h-[400px] md:min-h-[600px] flex items-center p-8 sm:p-12 md:p-20 bg-gradient-to-br from-[#f5a623] to-[#e09212]">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative z-10 text-white w-full max-w-lg mx-auto md:ml-0 md:mr-auto"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight text-white drop-shadow-sm">Keunggulan kami</h2>
            <p className="text-base font-medium mb-10 text-white/90 leading-relaxed">
              Kami siap memberikan layanan unggulan untuk menangani acara-acara besar, menengah ataupun sederhana.
            </p>
            
            <ul className="space-y-6">
              {displayAdvantages.slice(0, 4).map((item, idx) => (
                <motion.li 
                  key={item.id || idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + (idx * 0.1) }}
                  className="flex items-center font-bold text-lg md:text-xl bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20"
                >
                  <CheckCircle2 className="w-7 h-7 mr-4 text-white shrink-0" /> 
                  <span>{item.title}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* CLIENTS SECTION */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl z-0 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-[#f5a623] font-bold tracking-widest uppercase mb-2">Trust and Worth</h3>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#273554] tracking-tight">Our Clients</h2>
          </motion.div>
          
          {clients.length === 0 ? (
            <div className="text-center py-10 text-slate-400 bg-white border border-dashed rounded-xl max-w-2xl mx-auto">
              Belum ada logo klien yang ditambahkan oleh Admin.
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-wrap justify-center items-center gap-8 md:gap-16"
            >
              {clients.map((client) => (
                <div key={client.id} className="p-4 group cursor-pointer">
                  <img 
                    src={client.logo_url || 'https://placehold.co/200x100?text=Logo'} 
                    alt={client.name} 
                    className="h-12 md:h-16 lg:h-20 object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110" 
                  />
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

    </div>
  );
};

export default About;
