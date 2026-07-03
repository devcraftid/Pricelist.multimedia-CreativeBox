import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle2, Phone } from 'lucide-react';

const CATEGORIES = ['Live Cam', 'LED Videotron', 'Stage & Rigging', 'Sound System'];

const COLORS = [
  { bg: 'bg-[#ba7959]', text: 'text-[#ba7959]' },
  { bg: 'bg-[#f4c63d]', text: 'text-[#f4c63d]' },
  { bg: 'bg-[#61b865]', text: 'text-[#61b865]' },
  { bg: 'bg-[#5f497a]', text: 'text-[#5f497a]' },
  { bg: 'bg-[#77299a]', text: 'text-[#77299a]' },
  { bg: 'bg-[#ba261a]', text: 'text-[#ba261a]' }
];

export default function PublicPriceList() {
  const [activeTab, setActiveTab] = useState('Live Cam');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('pricelist_items').select('*').order('created_at', { ascending: true });
      if (!error && data) {
        setItems(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePesan = (itemName) => {
    const text = encodeURIComponent(`Halo Multicam Indonesia, saya tertarik untuk memesan ${itemName}. Boleh minta info lebih lanjut?`);
    window.open(`https://wa.me/6281316699665?text=${text}`, '_blank');
  };

  const activeItems = items.filter(item => item.category === activeTab);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans pt-12 md:pt-16">

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-6 py-3 font-bold rounded-full transition-all duration-300 ${
                activeTab === cat 
                  ? 'bg-[#f5a623] text-gray-900 shadow-md transform scale-105' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500 font-medium">Loading paket harga...</div>
        ) : activeItems.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 border border-dashed border-gray-300 rounded-2xl text-gray-500">
            Belum ada paket/item untuk kategori <span className="font-bold">{activeTab}</span> yang ditambahkan oleh Admin.
          </div>
        ) : (
          <div className="space-y-20">
            <section>
              <h2 className="text-2xl font-bold text-[#2a3c5a] mb-8 uppercase tracking-wide border-b-2 border-[#f5a623] inline-block pb-2">
                PRICELIST {activeTab}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeItems.map((item, index) => {
                  const colorTheme = COLORS[index % COLORS.length];
                  
                  // Use specific view based on whether it has an image (Additional items) or features (Packages)
                  if (item.image_url) {
                    // Item with image (like Additional Equipments)
                    return (
                      <div key={item.id} className="text-center group border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="overflow-hidden bg-gray-100 mb-4 aspect-video relative rounded-lg">
                          <img 
                            src={item.image_url} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {item.ribbon && (
                            <div className="absolute top-2 left-2 bg-[#f5a623] text-xs font-bold px-2 py-1 rounded">
                              {item.ribbon}
                            </div>
                          )}
                        </div>
                        <h4 className="font-bold text-gray-800 text-lg">{item.name}</h4>
                        {item.subtitle && <p className="text-xs text-gray-500 mt-1">{item.subtitle}</p>}
                        <p className={`text-lg font-bold mt-2 ${colorTheme.text}`}>Rp. {item.price}</p>
                        <button 
                          onClick={() => handlePesan(item.name)}
                          className="mt-4 w-full bg-[#2a3c5a] hover:bg-[#1a2538] text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                          PESAN SEKARANG
                        </button>
                      </div>
                    );
                  }

                  // Standard Package View (like Paket Hemat)
                  return (
                    <div key={item.id} className="bg-[#f9f9f9] flex flex-col relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow rounded-t-xl">
                      {/* Ribbon */}
                      {item.ribbon && (
                        <div className="absolute top-4 -right-8 w-32 bg-black text-white text-[10px] font-bold text-center py-1 transform rotate-45 z-10">
                          {item.ribbon}
                        </div>
                      )}
                      
                      {/* Header */}
                      <div className={`${colorTheme.bg} text-white text-center py-6 px-4`}>
                        <h3 className="text-xl font-bold">{item.name}</h3>
                        <p className="text-xs mt-1 opacity-90">{item.subtitle}</p>
                      </div>
                      
                      {/* Price */}
                      <div className="text-center py-8">
                        <div className="flex items-start justify-center">
                          <span className="text-sm font-bold mt-2 mr-1">Rp.</span>
                          <span className={`text-5xl font-bold ${colorTheme.text}`}>{item.price}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Only</p>
                      </div>

                      {/* Features */}
                      <div className="flex-1 px-8 pb-6">
                        <ul className="space-y-4">
                          {Array.isArray(item.features) && item.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 border-b border-gray-200 pb-3 last:border-0">
                              <CheckCircle2 className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Button & Footer */}
                      <div className="p-6 pt-0 text-center mt-auto">
                        <button 
                          onClick={() => handlePesan(item.name)}
                          className="bg-[#6b7280] hover:bg-slate-600 text-white font-bold py-2.5 px-8 text-sm transition-colors rounded-sm w-full"
                        >
                          PESAN
                        </button>
                        {item.footer && (
                          <p className="text-[10px] text-gray-400 mt-4 italic">{item.footer}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
