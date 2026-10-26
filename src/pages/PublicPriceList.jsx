import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = ['Live Cam'];

const COLORS = [
  { grad: 'bg-gradient-to-br from-[#c2410c] to-[#9a3412]', btn: 'bg-gradient-to-r from-[#c2410c] to-[#9a3412]', text: 'text-[#9a3412]', shadow: 'shadow-[#c2410c]/20' },
  { grad: 'bg-gradient-to-br from-[#d97706] to-[#b45309]', btn: 'bg-gradient-to-r from-[#d97706] to-[#b45309]', text: 'text-[#b45309]', shadow: 'shadow-[#d97706]/20' },
  { grad: 'bg-gradient-to-br from-[#059669] to-[#047857]', btn: 'bg-gradient-to-r from-[#059669] to-[#047857]', text: 'text-[#047857]', shadow: 'shadow-[#059669]/20' },
  { grad: 'bg-gradient-to-br from-[#7c3aed] to-[#5b21b6]', btn: 'bg-gradient-to-r from-[#7c3aed] to-[#5b21b6]', text: 'text-[#5b21b6]', shadow: 'shadow-[#7c3aed]/20' },
  { grad: 'bg-gradient-to-br from-[#9333ea] to-[#6b21a8]', btn: 'bg-gradient-to-r from-[#9333ea] to-[#6b21a8]', text: 'text-[#6b21a8]', shadow: 'shadow-[#9333ea]/20' },
  { grad: 'bg-gradient-to-br from-[#dc2626] to-[#991b1b]', btn: 'bg-gradient-to-r from-[#dc2626] to-[#991b1b]', text: 'text-[#991b1b]', shadow: 'shadow-[#dc2626]/20' }
];

export default function PublicPriceList() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Live Cam');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam && CATEGORIES.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('pricelist_items').select('*').order('order_index', { ascending: true });
      if (!error && data) {
        setItems(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePesan = (item) => {
    const text = encodeURIComponent(`Halo Admin Multimedia Creative Box, saya melihat penawaran di website dan tertarik untuk memesan:\n\n*Kategori:* ${item.category}\n*Paket/Item:* ${item.name}\n*Harga:* Rp. ${item.price}\n\nApakah saya bisa mendapatkan informasi lebih detail mengenai ketersediaan dan prosedur pemesanannya? Terima kasih.`);
    window.open(`https://wa.me/6287772486006?text=${text}`, '_blank');
  };

  const activeItems = items.filter(item => item.category === activeTab);

  return (
    <div className="min-h-screen w-full max-w-full bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800 font-sans pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-24 relative overflow-hidden">

      {/* Decorative Background Elements for HD feel */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-secondary/5 to-transparent z-0 pointer-events-none" />
      <div className="absolute top-20 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl z-0 pointer-events-none" />
      <div className="absolute top-40 -left-40 w-96 h-96 bg-secondary/5 rounded-full blur-3xl z-0 pointer-events-none" />

      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-10 relative z-10">
        {loading ? (
          <div className="text-center py-20 text-slate-500 font-medium flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin mb-4" />
            Loading paket harga...
          </div>
        ) : activeItems.length === 0 ? (
          <div className="text-center py-20 bg-white/50 backdrop-blur-md border border-white/60 shadow-xl rounded-2xl text-gray-500">
            Belum ada paket/item untuk kategori <span className="font-bold">{activeTab}</span> yang ditambahkan oleh Admin.
          </div>
        ) : (
          <div className="space-y-16 sm:space-y-24">
            <section>
              <div className="text-center mb-10 sm:mb-16">
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 sm:mb-4 uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary"
                >
                  PRICELIST {activeTab}
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="h-1 w-20 sm:w-24 bg-gradient-to-r from-secondary to-primary mx-auto rounded-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 xl:gap-10">
                {activeItems.map((item, index) => {
                  const colorTheme = COLORS[index % COLORS.length];

                  if (item.image_url) {
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 100 }}
                        className="bg-white/80 backdrop-blur-lg border border-white shadow-xl shadow-slate-200/50 rounded-2xl p-4 sm:p-5 hover:-translate-y-2 transition-transform duration-300 group flex flex-col"
                      >
                        <div className="overflow-hidden bg-slate-100 mb-4 sm:mb-5 aspect-video relative rounded-xl shadow-inner">
                          <img
                            loading="lazy"
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {item.ribbon && (
                            <div className="absolute top-3 left-3 bg-gradient-to-r from-primary to-amber-500 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> {item.ribbon}
                            </div>
                          )}
                        </div>
                        <h4 className="font-extrabold text-slate-800 text-lg sm:text-xl tracking-tight mb-1">{item.name}</h4>
                        {item.subtitle && <p className="text-xs sm:text-sm text-slate-500 font-medium mb-3">{item.subtitle}</p>}

                        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
                          <p className={`text-lg sm:text-xl font-extrabold ${colorTheme.text}`}>Rp {item.price}</p>
                          <button
                            onClick={() => handlePesan(item)}
                            className="bg-secondary hover:bg-[#1d2740] text-white font-bold py-2.5 px-5 rounded-lg transition-all shadow-md hover:shadow-lg text-xs sm:text-sm min-h-[40px]"
                          >
                            PESAN
                          </button>
                        </div>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 100 }}
                      className={`bg-white rounded-2xl flex flex-col relative overflow-hidden group shadow-2xl ${colorTheme.shadow} hover:-translate-y-2 sm:hover:-translate-y-3 transition-all duration-300 border border-slate-100/50`}
                    >
                      {item.ribbon && (
                        <div className="absolute top-5 -right-12 w-40 bg-gradient-to-r from-slate-900 to-slate-800 text-white text-[10px] uppercase tracking-widest font-extrabold text-center py-1.5 transform rotate-45 z-10 shadow-lg">
                          {item.ribbon}
                        </div>
                      )}

                      {/* Premium Header */}
                      <div className={`${colorTheme.grad} text-white text-center py-6 sm:py-8 px-4 sm:px-6 relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight relative z-10 drop-shadow-md">{item.name}</h3>
                        <p className="text-xs sm:text-sm mt-1 font-medium opacity-90 relative z-10">{item.subtitle}</p>
                      </div>

                      <div className="text-center py-6 sm:py-8 bg-gradient-to-b from-slate-50 to-white relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-inner">
                          <div className={`w-2 h-2 rounded-full ${colorTheme.grad}`} />
                        </div>
                        <div className="flex items-start justify-center px-4">
                          <span className="text-xs sm:text-sm font-bold mt-2 mr-1 text-slate-500">Rp</span>
                          <span className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter ${colorTheme.text} drop-shadow-sm break-all sm:break-normal`}>{item.price}</span>
                        </div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">Only</p>
                      </div>

                      <div className="flex-1 px-5 sm:px-8 pb-6 sm:pb-8 bg-white">
                        <ul className="space-y-3 sm:space-y-4">
                          {Array.isArray(item.features) && item.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-slate-700 font-semibold">
                              <CheckCircle2 className={`w-4 h-4 sm:w-5 sm:h-5 mt-0.5 shrink-0 ${colorTheme.text}`} />
                              <span className="leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-5 sm:p-8 pt-0 text-center mt-auto bg-white">
                        <button
                          onClick={() => handlePesan(item)}
                          className={`${colorTheme.btn} text-white font-extrabold py-3.5 px-6 sm:px-8 text-xs sm:text-sm transition-all rounded-xl w-full shadow-lg ${colorTheme.shadow} hover:opacity-90 hover:scale-[1.02] active:scale-95 tracking-wider min-h-[44px]`}
                        >
                          PESAN SEKARANG
                        </button>
                        {item.footer && (
                          <p className="text-[10.5px] sm:text-[11px] text-slate-400 mt-4 sm:mt-5 italic font-medium">{item.footer}</p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mt-20 bg-white/60 backdrop-blur-lg border border-slate-200/50 shadow-xl shadow-slate-200/40 rounded-2xl p-8 md:p-10 max-w-4xl mx-auto relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <h3 className="font-extrabold text-secondary text-xl mb-5 flex items-center gap-2 tracking-tight">
                <CheckCircle2 className="w-6 h-6 text-primary" /> Keterangan Penting
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <li className="flex items-start gap-3 text-sm text-slate-600 font-medium bg-white p-3 rounded-lg shadow-sm border border-slate-50">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5" /> Harga paket di atas hanya untuk dalam kota
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600 font-medium bg-white p-3 rounded-lg shadow-sm border border-slate-50">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5" /> Tidak termasuk koneksi internet
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600 font-medium bg-white p-3 rounded-lg shadow-sm border border-slate-50">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5" /> Harga tidak termasuk rehearsal H-1
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600 font-medium bg-white p-3 rounded-lg shadow-sm border border-slate-50">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5" /> Upgrade kamera & system by request
                </li>
              </ul>
            </motion.section>
          </div>
        )}
      </main>
    </div>
  );
}
