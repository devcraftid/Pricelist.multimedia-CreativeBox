import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, Award, Users, Clock } from 'lucide-react';
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
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 text-secondary font-bold">
      <div className="w-10 h-10 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin mr-3" />
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
    <div className="w-full max-w-full bg-slate-50 font-sans overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative w-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] pt-24 sm:pt-28 md:pt-32 flex items-center justify-center bg-secondary overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-60 bg-cover bg-center"
          style={{ backgroundImage: `url('${heroBg}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-0" />
        
        <motion.div 
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-white tracking-tight uppercase drop-shadow-lg">
            ABOUT US
          </h1>
          <div className="w-20 sm:w-24 h-1 sm:h-1.5 bg-gradient-to-r from-primary to-yellow-300 mx-auto mt-4 sm:mt-6 rounded-full" />
        </motion.div>
      </section>

      {/* MAIN CONTENT & FEATURES */}
      <section className="py-12 sm:py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20 -mt-8 sm:-mt-12 md:-mt-20 overflow-hidden">
        <div className="bg-white rounded-3xl shadow-2xl shadow-blue-900/10 border border-slate-100 p-5 sm:p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-20 overflow-hidden">
          
          {/* Left Column (Main Text) */}
          <div className="w-full lg:w-1/2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-amber-600 font-extrabold text-base sm:text-lg md:text-xl mb-2 sm:mb-3 tracking-wide">About Us</h3>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 sm:mb-8 leading-tight tracking-tight">
                {settings?.hero_title || 'Creative Box'}
              </h2>
              
              <div className="space-y-5 sm:space-y-6 text-slate-600 leading-relaxed font-medium whitespace-pre-wrap text-sm sm:text-base">
                {aboutData?.company_history || 'Creative Box menyediakan jasa live camera production profesional...'}
                
                {aboutData?.vision && (
                  <div className="mt-6">
                    <h4 className="font-bold text-slate-900 text-base sm:text-lg mb-2">Visi Kami</h4>
                    <p className="text-sm sm:text-base text-slate-600">{aboutData.vision}</p>
                  </div>
                )}
                {aboutData?.mission && (
                  <div className="mt-6">
                    <h4 className="font-bold text-slate-900 text-base sm:text-lg mb-2">Misi Kami</h4>
                    <p className="text-sm sm:text-base text-slate-600">{aboutData.mission}</p>
                  </div>
                )}
              </div>

              {(settings?.wa_number || settings?.instagram_url) && (
                <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                  {settings?.wa_number && (
                    <a 
                      href={`https://wa.me/${settings.wa_number.replace(/\D/g, '')}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-block bg-gradient-to-r from-primary to-amber-500 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold py-3.5 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg shadow-primary/25 hover:-translate-y-1 hover:shadow-primary/40 transition-all duration-300 text-center text-sm"
                    >
                      HUBUNGI VIA WHATSAPP
                    </a>
                  )}
                  {settings?.instagram_url && (
                    <a 
                      href={settings.instagram_url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-block bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-extrabold py-3.5 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg shadow-purple-500/30 hover:-translate-y-1 hover:shadow-purple-500/40 transition-all duration-300 text-center text-sm"
                    >
                      HUBUNGI VIA INSTAGRAM
                    </a>
                  )}
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
                  <h4 className="text-xl font-bold text-slate-900 mb-2">{feat.title}</h4>
                  <p className="text-slate-600 leading-relaxed text-sm font-medium">{feat.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* STATS BANNER */}
      {(aboutData?.stat_1_title || aboutData?.stat_2_title) && (
        <section className="relative w-full py-16 bg-secondary overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x divide-white/10 text-center">
              
              {aboutData?.stat_1_title && (
                <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="flex flex-col items-center">
                  <Calendar className="w-8 h-8 text-primary mb-4" />
                  <div className="text-3xl md:text-5xl font-black text-white mb-2">{aboutData.stat_1_value}</div>
                  <div className="text-xs md:text-sm text-slate-300 uppercase tracking-widest font-medium">{aboutData.stat_1_title}</div>
                </motion.div>
              )}

              {aboutData?.stat_2_title && (
                <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="flex flex-col items-center pl-8 md:pl-12">
                  <Award className="w-8 h-8 text-primary mb-4" />
                  <div className="text-3xl md:text-5xl font-black text-white mb-2">{aboutData.stat_2_value}</div>
                  <div className="text-xs md:text-sm text-slate-300 uppercase tracking-widest font-medium">{aboutData.stat_2_title}</div>
                </motion.div>
              )}

              {aboutData?.stat_3_title && (
                <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-col items-center">
                  <Users className="w-8 h-8 text-primary mb-4" />
                  <div className="text-3xl md:text-5xl font-black text-white mb-2">{aboutData.stat_3_value}</div>
                  <div className="text-xs md:text-sm text-slate-300 uppercase tracking-widest font-medium">{aboutData.stat_3_title}</div>
                </motion.div>
              )}

              {aboutData?.stat_4_title && (
                <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="flex flex-col items-center pl-8 md:pl-12">
                  <Clock className="w-8 h-8 text-primary mb-4" />
                  <div className="text-3xl md:text-5xl font-black text-white mb-2">{aboutData.stat_4_value}</div>
                  <div className="text-xs md:text-sm text-slate-300 uppercase tracking-widest font-medium">{aboutData.stat_4_title}</div>
                </motion.div>
              )}

            </div>
          </div>
        </section>
      )}

      {/* SPLIT ADVANTAGES SECTION */}
      <section className="w-full flex flex-col md:flex-row bg-white overflow-hidden">
        <div className="w-full md:w-1/2 relative min-h-[400px] md:min-h-[600px] flex items-center p-8 sm:p-12 md:p-20 overflow-hidden">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center transform hover:scale-105 transition-transform duration-1000"
            style={{ backgroundImage: `url('${settings?.hero_image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80'}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 to-secondary/85 z-0" />
          
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative z-10 w-full max-w-lg mx-auto md:ml-auto md:mr-0"
          >
            <h3 className="text-primary font-bold text-sm mb-4 tracking-widest uppercase">Acara Sukses tanpa biaya mahal</h3>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Kualitas Terbaik,<br/>Relatif Murah di<br/>Kelasnya!
            </h2>
            <div className="w-16 h-1 bg-primary mb-8 rounded-full" />
            <p className="text-slate-300 text-base leading-relaxed mb-10 max-w-md font-medium">
              Kami memberikan layanan yang terjangkau untuk setiap kalangan dan kelas perusahaan. Kami bisa menyesuaikan dengan budget klien, sehingga dokumentasi tidak terlalu membebani biaya pengeluaran acara Anda.
            </p>
            <Link to="/price-list" className="inline-block bg-white text-secondary font-extrabold py-3.5 px-8 rounded-xl shadow-lg hover:bg-slate-100 transition-colors">
              LIHAT PRICE LIST
            </Link>
          </motion.div>
        </div>

        <div className="w-full md:w-1/2 relative min-h-[400px] md:min-h-[600px] flex items-center p-8 sm:p-12 md:p-20 bg-secondary/95 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative z-10 text-white w-full max-w-lg mx-auto md:ml-0 md:mr-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/25 text-primary text-xs font-bold uppercase tracking-wider mb-4">
              <span>Keunggulan Layanan</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight text-white drop-shadow-sm">Keunggulan Kami</h2>
            <p className="text-base font-medium mb-8 sm:mb-10 text-slate-300 leading-relaxed">
              Kami siap memberikan layanan unggulan untuk menangani acara-acara besar, menengah ataupun sederhana.
            </p>
            
            <ul className="space-y-4 sm:space-y-5">
              {displayAdvantages.slice(0, 4).map((item, idx) => (
                <motion.li 
                  key={item.id || idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + (idx * 0.1) }}
                  className="flex items-center font-bold text-base sm:text-lg bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white hover:border-primary/40 transition-colors shadow-sm"
                >
                  <CheckCircle2 className="w-6 h-6 mr-3.5 text-primary shrink-0" /> 
                  <span>{item.title}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* CLIENTS SECTION */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl z-0 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-primary font-bold tracking-widest uppercase mb-2">Trust and Worth</h3>
            <h2 className="text-4xl md:text-5xl font-extrabold text-secondary tracking-tight">Our Clients</h2>
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
                <div key={client.id} className="w-28 md:w-36 bg-white p-4 rounded-2xl shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 flex items-center justify-center aspect-[3/2] border border-slate-100">
                  <img loading="lazy" src={client.logo_url || 'https://placehold.co/200x100?text=Logo'} alt={client.name} className="max-w-full max-h-full object-contain" />
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
