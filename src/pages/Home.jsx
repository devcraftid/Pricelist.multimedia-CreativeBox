import React, { useState, useEffect } from 'react';
import { CheckCircle2, ChevronRight, ShieldCheck, ArrowRight, PlayCircle, Zap, Trophy, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

const Home = () => {
  const [settings, setSettings] = useState(null);
  const [services, setServices] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [clients, setClients] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [advantages, setAdvantages] = useState([]);
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
      const [
        { data: settingsData },
        { data: servicesData },
        { data: equipmentsData },
        { data: clientsData },
        { data: faqsData },
        { data: advData }
      ] = await Promise.all([
        supabase.from('site_settings').select('*').limit(1),
        supabase.from('services').select('*').order('order_index', { ascending: true }),
        supabase.from('rental_equipments').select('*').order('order_index', { ascending: true }),
        supabase.from('clients').select('*').order('order_index', { ascending: true }),
        supabase.from('faqs').select('*').order('order_index', { ascending: true }),
        supabase.from('advantages').select('*').order('order_index', { ascending: true })
      ]);

      if (settingsData && settingsData.length > 0) setSettings(settingsData[0]);
      if (servicesData) setServices(servicesData);
      if (equipmentsData) setEquipments(equipmentsData);
      if (clientsData) setClients(clientsData);
      if (faqsData) setFaqs(faqsData);
      if (advData) setAdvantages(advData);
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#1b253b] text-white">
        <div className="w-12 h-12 border-4 border-[#f5a623]/30 border-t-[#f5a623] rounded-full animate-spin mb-4" />
        <p className="font-semibold tracking-wider text-sm animate-pulse">Memuat Data...</p>
      </div>
    );
  }

  const heroBg = settings?.hero_image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80';

  const displayAdvantages = advantages.length > 0 ? advantages : [
    { title: "Terpercaya", description: "Dipakai perusahaan Lokal, Nasional dan internasional, swasta maupun pemerintah." },
    { title: "Pengalaman", description: "Lebih dari 5 Tahun dalam Menangani Live Event." },
    { title: "Terjangkau", description: "Dengan harga bersaing, Anda dapat menghemat budget acara event Anda." },
    { title: "Berkualitas", description: "Didukung oleh Crew dan peralatan yang expert dan memadai." }
  ];

  return (
    <div className="w-full bg-slate-50 font-sans">

      {/* PREMIUM HERO SECTION */}
      <section className="relative w-full min-h-[100vh] flex items-center bg-[#1b253b] overflow-hidden">
        {/* Background Image with Parallax effect */}
        <div
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center transform scale-105"
          style={{ backgroundImage: `url('${heroBg}')` }}
        />
        {/* Elegant Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1b253b] via-[#1b253b]/80 to-transparent z-0" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32 pb-20"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-1 bg-[#f5a623] rounded-full" />
            <h2 className="text-[#f5a623] font-bold text-sm md:text-base uppercase tracking-[0.2em]">
              {settings?.hero_title || 'MULTIMEDIA CREATIVE BOX'}
            </h2>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] mb-8 max-w-5xl tracking-tighter uppercase drop-shadow-xl">
            {settings?.hero_subtitle || 'MULTIMEDIA PRODUCTION'}
          </h1>

          <p className="text-blue-100/90 text-base md:text-xl max-w-3xl leading-relaxed font-medium mb-12 drop-shadow-md">
            Solusi lengkap untuk Multimedia Support, Live Camera, LED Videotron, Sound System, dan Virtual Event. Kami hadirkan kualitas siaran standar industri untuk kesuksesan setiap momen berharga Anda.
          </p>

          <div className="flex flex-col sm:flex-row gap-5">
            <Link
              to="/services"
              className="group inline-flex items-center justify-center bg-gradient-to-r from-[#f5a623] to-[#e09212] text-white font-extrabold py-4 px-8 rounded-full text-sm hover:shadow-[0_0_30px_rgba(245,166,35,0.4)] transition-all transform hover:-translate-y-1 tracking-wider"
            >
              LIHAT LAYANAN
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={`https://wa.me/${settings?.wa_number || '6287772486006'}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold py-4 px-8 rounded-full text-sm hover:bg-white/20 transition-all transform hover:-translate-y-1 tracking-wider"
            >
              KONSULTASI GRATIS
            </a>
          </div>
        </motion.div>
      </section>

      {/* WHY CHOOSE US - MODERN CARDS */}
      <section className="w-full relative z-20 -mt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-3xl shadow-2xl shadow-blue-900/5 overflow-hidden flex flex-col lg:flex-row border border-slate-100"
        >
          <div className="w-full lg:w-2/5 bg-gradient-to-br from-[#1b253b] to-[#273554] p-10 md:p-16 text-white flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#f5a623] rounded-full mix-blend-overlay filter blur-[80px] opacity-20" />

            <h3 className="font-bold text-[#f5a623] tracking-widest text-sm mb-4 uppercase">Keunggulan Utama</h3>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
              Mitra Terpercaya Event Anda
            </h2>
            <p className="mb-10 text-blue-100/80 leading-relaxed font-medium">
              Kami memadukan teknologi terkini dengan kru profesional yang berpengalaman menangani berbagai event lokal, nasional, hingga internasional.
            </p>
            <Link to="/about" className="inline-flex items-center text-sm font-bold text-[#f5a623] hover:text-white transition-colors group">
              TENTANG KAMI <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="w-full lg:w-3/5 p-10 md:p-16 grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-14 bg-white">
            {displayAdvantages.slice(0, 4).map((adv, idx) => (
              <div key={idx} className="flex flex-col items-start">
                <h3 className="text-lg md:text-xl font-extrabold text-[#1b253b] mb-2.5 leading-tight">{adv.title}</h3>
                <p className="text-slate-500/90 text-sm md:text-base leading-relaxed">{adv.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-20 bg-slate-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h3 className="text-[#f5a623] font-bold tracking-widest text-sm mb-3 uppercase">Layanan Kami</h3>
            <h2 className="text-4xl md:text-5xl font-black text-[#1b253b] tracking-tight">Karya Terbaik untuk Momen Terbaik</h2>
          </div>
          <Link to="/services" className="inline-flex items-center text-sm font-bold text-slate-600 hover:text-[#f5a623] transition-colors group">
            LIHAT SEMUA LAYANAN <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
            <p className="text-slate-500 font-medium">Belum ada layanan yang ditambahkan oleh Admin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((svc, index) => (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 border border-slate-100"
              >
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img src={svc.icon_or_image_url || 'https://placehold.co/600x400?text=No+Image'} alt={svc.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1b253b]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                    <PlayCircle className="text-white w-10 h-10 mb-2" />
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-extrabold text-[#1b253b] mb-4 group-hover:text-[#f5a623] transition-colors">{svc.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium line-clamp-3">{svc.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* RENTAL EQUIPMENT - MASONRY/GRID STYLE */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h3 className="text-[#f5a623] font-bold tracking-widest text-sm mb-3 uppercase">Rental Equipment</h3>
          <h2 className="text-4xl md:text-5xl font-black text-[#1b253b]">Peralatan Standar Broadcast</h2>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {equipments.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200 border-dashed">
              <p className="text-slate-500 font-medium">Belum ada alat yang ditambahkan oleh Admin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {equipments.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.4, delay: (index % 4) * 0.1 }}
                  className="relative rounded-2xl overflow-hidden group aspect-[4/5] md:aspect-square bg-slate-100"
                >
                  <img src={item.image_url || 'https://placehold.co/500x500?text=No+Image'} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1b253b] via-[#1b253b]/40 to-transparent flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-white font-extrabold text-lg md:text-xl mb-2">{item.title}</h4>
                    <p className="text-blue-100/70 text-xs md:text-sm font-medium line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-16 flex justify-center">
            <Link to="/price-list" className="inline-flex justify-center items-center bg-[#1b253b] text-white font-extrabold py-4 px-10 rounded-full text-sm hover:bg-[#273554] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 tracking-wider">
              LIHAT PRICE LIST LENGKAP
            </Link>
          </div>
        </div>
      </section>

      {/* CLIENTS MARQUEE / GRID */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-12">Telah Dipercaya Oleh Berbagai Perusahaan & Instansi</h3>

          {clients.length === 0 ? (
            <p className="text-slate-400">Belum ada logo klien.</p>
          ) : (
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
              {clients.map((client) => (
                <div key={client.id} className="w-24 md:w-32 hover:opacity-100 hover:scale-110 transition-all duration-300 filter grayscale hover:grayscale-0">
                  <img src={client.logo_url || 'https://placehold.co/200x100?text=Logo'} alt={client.name} className="w-full h-auto object-contain" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MODERN SPLIT CONTACT & FAQ */}
      <section className="w-full bg-white relative z-10">
        <div className="flex flex-col lg:flex-row min-h-[700px]">

          {/* Contact Form Half */}
          <div className="w-full lg:w-1/2 bg-[#1b253b] p-10 sm:p-16 lg:p-24 text-white relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#f5a623] rounded-full mix-blend-overlay filter blur-[120px] opacity-20 pointer-events-none" />

            <div className="max-w-md w-full mx-auto lg:ml-auto lg:mr-12 relative z-10">
              <h3 className="text-[#f5a623] font-bold tracking-widest text-sm mb-3 uppercase">Mari Berdiskusi</h3>
              <h2 className="text-4xl md:text-5xl font-black mb-10 tracking-tight">Kirim Pesan<br />Untuk Kami.</h2>

              <form className="space-y-5" onSubmit={handleContactSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nama Anda"
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623] transition-all font-medium"
                  />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Alamat Email"
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623] transition-all font-medium"
                  />
                </div>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Subjek Pesan"
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623] transition-all font-medium"
                />
                <textarea
                  required
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tulis pesan Anda secara detail..."
                  rows="4"
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623] transition-all font-medium resize-none"
                ></textarea>
                <button
                  type="submit"
                  disabled={formStatus === 'sending...'}
                  className="w-full bg-[#f5a623] hover:bg-yellow-400 text-[#1b253b] font-extrabold py-4 px-8 rounded-xl text-sm transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transform hover:-translate-y-0.5 tracking-wider disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {formStatus === 'sending...' ? 'MENGIRIM PESAN...' : 'KIRIM PESAN SEKARANG'}
                </button>
                {formStatus === 'success' && <p className="text-green-400 text-sm font-bold bg-green-400/10 p-3 rounded-lg text-center">Pesan berhasil dikirim!</p>}
                {formStatus === 'error' && <p className="text-red-400 text-sm font-bold bg-red-400/10 p-3 rounded-lg text-center">Gagal mengirim pesan.</p>}
              </form>
            </div>
          </div>

          {/* FAQ Half */}
          <div className="w-full lg:w-1/2 bg-slate-50 p-10 sm:p-16 lg:p-24 flex flex-col justify-center">
            <div className="max-w-md w-full mx-auto lg:mr-auto lg:ml-12">
              <h3 className="text-slate-400 font-bold tracking-widest text-sm mb-3 uppercase">Pusat Informasi</h3>
              <h2 className="text-4xl md:text-5xl font-black text-[#1b253b] mb-12 tracking-tight">Tanya Jawab<br />Seputar Layanan</h2>

              <div className="space-y-4">
                {faqs.length === 0 ? (
                  <p className="text-slate-500 font-medium">Belum ada FAQ yang ditambahkan.</p>
                ) : (
                  faqs.map((faq, i) => (
                    <div key={faq.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group cursor-pointer">
                      <h4 className="font-extrabold text-lg text-[#1b253b] mb-3 group-hover:text-[#f5a623] transition-colors">{faq.question}</h4>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
