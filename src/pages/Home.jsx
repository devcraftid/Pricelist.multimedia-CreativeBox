import React, { useState, useEffect } from 'react';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Home = () => {
  const [settings, setSettings] = useState(null);
  const [services, setServices] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [clients, setClients] = useState([]);
  const [faqs, setFaqs] = useState([]);
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
        { data: faqsData }
      ] = await Promise.all([
        supabase.from('site_settings').select('*').limit(1),
        supabase.from('services').select('*').order('order_index', { ascending: true }),
        supabase.from('rental_equipments').select('*').order('order_index', { ascending: true }),
        supabase.from('clients').select('*').order('order_index', { ascending: true }),
        supabase.from('faqs').select('*').order('order_index', { ascending: true })
      ]);

      if (settingsData && settingsData.length > 0) setSettings(settingsData[0]);
      if (servicesData) setServices(servicesData);
      if (equipmentsData) setEquipments(equipmentsData);
      if (clientsData) setClients(clientsData);
      if (faqsData) setFaqs(faqsData);
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
    return <div className="min-h-screen flex items-center justify-center bg-[#1a2035] text-white">Loading data...</div>;
  }

  const heroBg = settings?.hero_image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80';

  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="relative w-full min-h-[600px] md:h-[650px] flex items-center bg-[#1a2035] overflow-hidden pt-10 pb-32 md:pb-0">
        <div 
          className="absolute inset-0 z-0 opacity-30 bg-cover bg-center"
          style={{ backgroundImage: `url('${heroBg}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a2035] via-[#1a2035]/80 to-transparent z-0" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-10 md:mt-0">
          <h2 className="text-[#f5a623] font-bold text-sm md:text-lg mb-2 uppercase tracking-wider">
            {settings?.hero_title ? settings.hero_title : 'MULTICAM.ID'}
          </h2>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 max-w-4xl tracking-tight uppercase">
            {settings?.hero_subtitle ? settings.hero_subtitle : 'MULTIMEDIA & LIVE CAMERA PRODUCTION'}
          </h1>
          <p className="text-gray-300 text-sm md:text-base lg:text-lg max-w-3xl leading-relaxed">
            Multimedia Support, Live Camera , Live Streaming, Rental Kamera, Backdrop, LED Videotron, Sound System, TV Plasma, Display Video dan Matador Display, GreenScreen, Generator Set, Lighting set, Stage dan Panggung Rigging Design, Virtual Studio, Virtual Event, Greenscreen, Live Event, Zoom Meeting, Webinar, DLL.
          </p>
        </div>

        {/* Floating Action Buttons */}
        <div className="absolute bottom-0 left-0 md:left-1/2 md:-translate-x-1/2 flex flex-col sm:flex-row w-full md:w-auto z-20">
          <button className="w-full sm:w-auto bg-[#f5a623] text-gray-900 font-bold py-4 md:py-5 px-6 md:px-10 text-xs sm:text-sm hover:bg-yellow-500 transition-colors tracking-wider">
            LAYANAN KAMI
          </button>
          <a href={`https://wa.me/${settings?.wa_number || '6287772486006'}`} target="_blank" rel="noreferrer" className="w-full sm:w-auto bg-[#1a2035]/80 border-t sm:border-t-0 sm:border-r sm:border-l border-gray-500 text-white font-bold py-4 md:py-5 px-6 md:px-10 text-xs sm:text-sm hover:bg-white/10 transition-colors tracking-wider backdrop-blur-sm text-center">
            HUBUNGI VIA WHATSAPP
          </a>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION (Static content for now, or can be made dynamic later) */}
      <section className="w-full bg-[#f8f9fa] pt-12 md:pt-16 pb-16 md:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto shadow-xl bg-white relative md:-mt-8 z-30">
          <div className="w-full md:w-1/2 bg-[#f5a623] p-8 sm:p-10 md:p-14 text-gray-900 flex flex-col justify-center">
            <h3 className="font-bold text-lg mb-2">ingin acara anda sukses ?</h3>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a2035] mb-6 leading-[1.1]">
              Percayakan Acara anda kepada kami!
            </h2>
            <p className="mb-10 text-gray-800 leading-relaxed font-medium">
              kami berpengalaman dalam menangani event lokal, nasional maupun internasional, baik itu live event ataupun virtual event. dengan pengalaman yang kami miliki, kami yakin dapat memenuhi kebutuhan multimedia demi suksesnya acara anda.
            </p>
            <div>
              <button className="bg-[#1a2035] text-white font-bold py-4 px-10 text-sm hover:bg-gray-800 transition-colors tracking-wider">
                HUBUNGI SEKARANG
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/2 bg-white grid grid-cols-1 sm:grid-cols-2 text-[#1a2035]">
            <div className="p-10 border-r border-b border-gray-200">
              <h3 className="text-xl font-bold mb-3">Terpercaya</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Dipakai perusahaan Lokal, Nasional dan internasional. swasta maupun pemerintah</p>
            </div>
            <div className="p-10 border-b border-gray-200">
              <h3 className="text-xl font-bold mb-3">Pengalaman</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Lebih dari 5 Tahun dalam Menangani Live Event</p>
            </div>
            <div className="p-10 border-r border-gray-200">
              <h3 className="text-xl font-bold mb-3">Terjangkau</h3>
              <p className="text-gray-500 text-sm leading-relaxed">dengan harga bersaing, anda dapat menghemat budged acara event anda</p>
            </div>
            <div className="p-10">
              <h3 className="text-xl font-bold mb-3">Berkualitas</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Di dukung oleh Crew dan peralatan yang expert dan memadai</p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-20 bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h3 className="text-gray-500 font-medium mb-1">Bangun Mimpi di Acara Anda</h3>
            <h2 className="text-4xl font-extrabold text-[#1a2035]">Layanan Kami</h2>
          </div>
          <Link to="/services" className="text-sm font-bold text-gray-600 hover:text-primary flex items-center">
            VIEW ALL <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-gray-50 border border-dashed rounded-lg">Belum ada layanan yang ditambahkan oleh Admin.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((svc) => (
              <div key={svc.id} className="group cursor-pointer">
                <div className="overflow-hidden mb-4">
                  <img src={svc.icon_or_image_url || 'https://placehold.co/600x400?text=No+Image'} alt={svc.title} className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <h3 className="text-2xl font-bold text-[#1a2035] mb-3">{svc.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{svc.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* RENTAL EQUIPMENT SECTION */}
      <section className="py-20 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <h3 className="text-gray-500 font-medium mb-1">Layanan</h3>
          <h2 className="text-4xl font-extrabold text-[#1a2035]">Rental Equipment</h2>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {equipments.length === 0 ? (
            <div className="text-center py-10 text-gray-500 bg-white border border-dashed rounded-lg">Belum ada alat yang ditambahkan oleh Admin.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
              {equipments.map((item) => (
                <div key={item.id} className="relative h-48 sm:h-64 md:h-80 group overflow-hidden cursor-pointer">
                  <img src={item.image_url || 'https://placehold.co/500x500?text=No+Image'} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a2035]/90 via-[#1a2035]/40 to-transparent flex flex-col justify-end p-4 md:p-6">
                    <h4 className="text-white font-bold text-sm sm:text-base md:text-xl mb-1">{item.title}</h4>
                    <p className="text-gray-300 text-[10px] sm:text-xs leading-tight line-clamp-2">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-12 flex justify-center">
            <button className="bg-[#f5a623] text-gray-900 font-bold py-3 px-8 text-sm hover:bg-yellow-500 transition-colors">
              SELENGKAPNYA
            </button>
          </div>
        </div>
      </section>

      {/* CLIENTS SECTION */}
      <section className="py-20 bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-[#1a2035] mb-10">Para Pengguna Jasa</h2>
        
        {clients.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-gray-50 border border-dashed rounded-lg">Belum ada logo klien yang ditambahkan oleh Admin.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-gray-200">
            {clients.map((client) => (
              <div key={client.id} className="border-b border-r border-gray-200 p-8 flex items-center justify-center grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 cursor-pointer">
                <img src={client.logo_url || 'https://placehold.co/200x100?text=Logo'} alt={client.name} className="max-h-16 object-contain" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SPLIT ADVANTAGES SECTION */}
      <section className="w-full flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 relative min-h-[400px] md:min-h-[500px] flex items-center p-8 sm:p-12 md:p-20">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80')" }}
          />
          <div className="absolute inset-0 bg-[#1a2035]/90 z-0" />
          
          <div className="relative z-10 w-full max-w-lg mx-auto md:ml-auto md:mr-0">
            <h3 className="text-[#f5a623] font-bold text-sm mb-3">Acara Sukses tanpa biaya mahal</h3>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-tight">
              Harga Terjangkau,<br/>Relatif Murah di<br/>Kelasnya!
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-8 max-w-md">
              Kami memberikan Harga yang terjangkau untuk setiap kalangan dan kelas perusahaan, kami bisa memberikan layanan sesuai dengan budged Klien, sehingga multimedia tidak terlalu membebani Biaya Pengeluaran Acara anda.
            </p>
            <button className="bg-[#f5a623] text-gray-900 font-bold py-3 px-8 text-sm hover:bg-yellow-500 transition-colors">
              SELENGKAPNYA
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2 relative min-h-[400px] md:min-h-[500px] flex items-center p-8 sm:p-12 md:p-20">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&q=80')" }}
          />
          <div className="absolute inset-0 bg-[#f5a623]/90 z-0" />
          
          <div className="relative z-10 text-gray-900 w-full max-w-lg mx-auto md:ml-0 md:mr-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Keunggulan kami</h2>
            <p className="text-sm font-medium mb-8 max-w-md">
              Kami siap memiliki keunggulan dalam menangani acara-acara besar menengah ataupun sederhana
            </p>
            
            <ul className="space-y-6">
              <li className="flex items-center font-bold text-lg">
                <CheckCircle2 className="w-6 h-6 mr-4 text-[#1a2035]" /> Harga Terjangkau
              </li>
              <li className="flex items-center font-bold text-lg">
                <CheckCircle2 className="w-6 h-6 mr-4 text-[#1a2035]" /> Berpengalaman
              </li>
              <li className="flex items-center font-bold text-lg">
                <CheckCircle2 className="w-6 h-6 mr-4 text-[#1a2035]" /> Layanan Terlengkap
              </li>
              <li className="flex items-center font-bold text-lg">
                <CheckCircle2 className="w-6 h-6 mr-4 text-[#1a2035]" /> Kerjasama yang Flexible
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION NUMBER */}
      <section className="w-full py-16 bg-white text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#1a2035]">
          Hubungi Kami di :<br />
          {settings?.wa_number || '+62 877-7248-6006'}
        </h2>
      </section>

      {/* CONTACT FORM & FAQ SECTION */}
      <section className="w-full flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-[#222a42] p-8 sm:p-12 md:p-20 text-white">
          <div className="max-w-md mx-auto md:ml-auto md:mr-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Hubungi via E-mail</h2>
            <p className="text-sm text-gray-300 mb-8">Kami Siap Bekerja sama dan berkelanjutan!</p>
            
            <form className="space-y-4" onSubmit={handleContactSubmit}>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Enter your name" 
                className="w-full px-4 py-3 bg-white text-gray-900 border-none outline-none"
              />
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="Enter your email address" 
                className="w-full px-4 py-3 bg-white text-gray-900 border-none outline-none"
              />
              <input 
                type="text" 
                required
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
                placeholder="Subject" 
                className="w-full px-4 py-3 bg-white text-gray-900 border-none outline-none"
              />
              <textarea 
                required
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                placeholder="Message" 
                rows="5"
                className="w-full px-4 py-3 bg-white text-gray-900 border-none outline-none resize-none"
              ></textarea>
              <button 
                type="submit"
                disabled={formStatus === 'sending...'}
                className="w-full sm:w-auto bg-[#f5a623] hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 text-sm transition-colors mt-2 disabled:opacity-50"
              >
                {formStatus === 'sending...' ? 'MENGIRIM...' : 'SEND MESSAGE'}
              </button>
              {formStatus === 'success' && <p className="text-green-400 text-sm mt-2">Pesan berhasil dikirim!</p>}
              {formStatus === 'error' && <p className="text-red-400 text-sm mt-2">Gagal mengirim pesan.</p>}
            </form>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-[#f8f9fa] p-8 sm:p-12 md:p-20">
          <div className="max-w-md mx-auto md:mr-auto md:ml-10">
            <h3 className="text-[#f5a623] font-bold text-sm mb-2">Pelajari Kami</h3>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a2035] mb-8 leading-tight">
              Pertanyaan Sering<br className="hidden md:block" /> yang sering ada
            </h2>
            
            <div className="border border-gray-200 bg-white">
              {faqs.length === 0 ? (
                <div className="p-4 text-sm text-gray-500">Belum ada FAQ yang ditambahkan admin.</div>
              ) : (
                faqs.map((faq, i) => (
                  <div key={faq.id} className="border-b border-gray-200">
                    <button className="w-full flex justify-between items-center p-4 text-left font-bold text-sm text-[#1a2035]">
                      <span>{i + 1}. {faq.question}</span>
                      {/* For simplicity we just show all answers for now or you can make it togglable */}
                    </button>
                    <div className="p-4 pt-0 text-sm text-gray-500 leading-relaxed bg-[#f8f9fa]">
                      {faq.answer}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
