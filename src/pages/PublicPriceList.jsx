import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle2, ChevronRight, Phone } from 'lucide-react';

export default function PublicPriceList() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data tailored exactly to the design provided
  const mockCategories = [
    { id: '1', name: 'PRICELIST LIVE CAM', type: 'package' },
    { id: '2', name: 'Aditional Livecam Item :', type: 'additional' }
  ];
  
  const mockItems = [
    // PRICELIST LIVE CAM (Packages)
    { 
      id: '1', 
      category_id: '1', 
      name: 'Paket Hemat A', 
      subtitle: '1 Kamera Live Streaming',
      price: '2,2 JT', 
      color: 'bg-[#ba7959]', 
      features: ['Kamera 1 Unit Sony Full HD', 'Operator Streaming 1/mix', 'Recorder Video Full Acara'],
    },
    { 
      id: '2', 
      category_id: '1', 
      name: 'Paket Hemat B', 
      subtitle: '2 Kamera Live Streaming',
      price: '3,5 JT', 
      color: 'bg-[#f4c63d]', 
      features: ['Kamera 2 Unit Sony Full HD', 'Switcher Video Full HD', 'Operator Streaming 1/mix', 'Recorder Video Full Acara', 'Clearcom/HT/Talkcom'],
    },
    { 
      id: '3', 
      category_id: '1', 
      name: 'Paket Standar', 
      subtitle: '3 Kamera Live Streaming',
      price: '6 JT', 
      priceColor: 'text-[#61b865]',
      color: 'bg-[#61b865]', 
      ribbon: 'POPULER',
      features: ['Kamera 3 Unit Sony Full HD', 'Switcher Video Full HD', 'Program Director', 'Operator Streaming 1/mix', 'Recorder Video Full Acara', 'Laptop PIN', 'Clearcom/HT/Talkcom'],
    },
    { 
      id: '4', 
      category_id: '1', 
      name: 'Paket Komplit', 
      subtitle: '4 Kamera Live Streaming',
      price: '8 JT', 
      priceColor: 'text-[#5f497a]',
      color: 'bg-[#5f497a]', 
      features: ['Kamera 4 Unit Sony Full HD', 'Switcher Video Full HD', 'Program Director', 'Operator Streaming 1/mix', 'Visual Jockey (VJ) Resolume/Arena', 'Recorder Video Full Acara', 'Laptop PIN', 'Clearcom/HT/Talkcom'],
      footer: 'untuk acara multiroom dengan 1 TV background'
    },
    { 
      id: '5', 
      category_id: '1', 
      name: 'Paket Ultimate', 
      subtitle: '6 Kamera Live Streaming zoom',
      price: '12 JT', 
      priceColor: 'text-[#77299a]',
      color: 'bg-[#77299a]', 
      features: ['Kamera 6 Unit Sony Full HD', 'Switcher Video Full HD/Blackmagic', 'Program Director', 'Operator Streaming zoom/vMix', 'Mobile Wireless Camera', 'Visual Jockey (VJ) Resolume/Arena', 'Recorder Video Full Acara', 'Laptop PIN', 'Clearcom/Camcom/HT/Pro'],
      footer: 'untuk acara multiroom dengan 2 TV background'
    },
    { 
      id: '6', 
      category_id: '1', 
      name: 'Paket Super Power', 
      subtitle: '8 Kamera Live Streaming zoom',
      price: '18 JT', 
      priceColor: 'text-[#ba261a]',
      color: 'bg-[#ba261a]', 
      ribbon: 'BEST SELLER',
      features: ['Kamera 8 Unit Sony Full HD', 'Switcher Video Full HD Blackmagic', 'Program Director', 'Operator Streaming zoom/vMix', 'Mobile Wireless Camera', 'Visual Jockey (VJ) Resolume/Arena', 'Recorder Video Full Acara', 'Jimmy Jib up to 12M', 'Laptop PIN', 'Operator PIN', 'Display TV/Monitor 40 inch', 'Clearcom/Camcom/HT/Pro'],
      footer: 'untuk acara besar dengan 3 TV background'
    },
    // ADDITIONAL ITEMS
    {
      id: '7',
      category_id: '2',
      name: 'Jimmy Jib 7,5M',
      price: '1500K',
      image: 'https://placehold.co/400x300/333/FFF?text=Jimmy+Jib+7.5M'
    },
    {
      id: '8',
      category_id: '2',
      name: 'Jimmy Jib 12M',
      price: '2000K',
      image: 'https://placehold.co/400x300/333/FFF?text=Jimmy+Jib+12M'
    },
    {
      id: '9',
      category_id: '2',
      name: 'Wireless Camera',
      price: '750K',
      image: 'https://placehold.co/400x300/333/FFF?text=Wireless+Camera'
    },
    {
      id: '10',
      category_id: '2',
      name: 'Laptop PIN',
      price: '500K',
      image: 'https://placehold.co/400x300/333/FFF?text=Laptop+PIN'
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: categoriesData, error: catError } = await supabase.from('categories').select('*');
      const { data: itemsData, error: itemsError } = await supabase.from('items').select('*');
      
      // Since our mock data perfectly matches the design, and the user hasn't added these to DB yet,
      // we will merge DB data if it exists, or just use Mock data for the presentation.
      // If categories from DB is empty, use mock.
      if (!catError && categoriesData && categoriesData.length > 0) {
        setCategories(categoriesData);
        setItems(itemsData || []);
      } else {
        setCategories(mockCategories);
        setItems(mockItems);
      }
    } catch (err) {
      setCategories(mockCategories);
      setItems(mockItems);
    } finally {
      setLoading(false);
    }
  };

  const handlePesan = (itemName) => {
    const text = encodeURIComponent(`Halo Multicam Indonesia, saya tertarik untuk memesan ${itemName}. Boleh minta info lebih lanjut?`);
    window.open(`https://wa.me/6281316699665?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      {/* Top Bar (Mocking the dark top bar from image) */}
      <div className="bg-[#2c303a] text-white text-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex space-x-6 text-gray-300 font-medium">
            <a href="#" className="hover:text-white transition-colors">Home</a>
            <a href="#" className="hover:text-white transition-colors">Services</a>
            <a href="#" className="hover:text-white transition-colors">Project Update !</a>
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Contact us</a>
            <a href="#" className="hover:text-white transition-colors">News & Blog</a>
            <a href="#" className="text-white border-b-2 border-yellow-500 pb-1">Price List ▾</a>
          </div>
          <div className="hidden md:flex bg-yellow-500 text-[#2c303a] px-6 py-2 font-bold text-xs rounded-sm">
            PROMO !
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading...</div>
        ) : (
          <div className="space-y-20">
            {categories.map((category) => {
              const categoryItems = items.filter(item => item.category_id === category.id);
              if (categoryItems.length === 0) return null;
              
              // PACKAGE VIEW (Category 1)
              if (category.name.includes('PRICELIST LIVE CAM')) {
                return (
                  <section key={category.id}>
                    <h2 className="text-2xl font-bold text-[#2a3c5a] mb-8 uppercase tracking-wide">
                      {category.name}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryItems.map(item => (
                        <div key={item.id} className="bg-[#f9f9f9] flex flex-col relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
                          {/* Ribbon */}
                          {item.ribbon && (
                            <div className="absolute top-4 -right-8 w-32 bg-black text-white text-[10px] font-bold text-center py-1 transform rotate-45 z-10">
                              {item.ribbon}
                            </div>
                          )}
                          
                          {/* Header */}
                          <div className={`${item.color || 'bg-slate-700'} text-white text-center py-6 px-4`}>
                            <h3 className="text-xl font-bold">{item.name}</h3>
                            <p className="text-xs mt-1 opacity-90">{item.subtitle}</p>
                          </div>
                          
                          {/* Price */}
                          <div className="text-center py-8">
                            <div className="flex items-start justify-center">
                              <span className="text-sm font-bold mt-2 mr-1">Rp.</span>
                              <span className={`text-5xl font-bold ${item.priceColor || 'text-slate-700'}`}>{item.price}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Only</p>
                          </div>

                          {/* Features */}
                          <div className="flex-1 px-8 pb-6">
                            <ul className="space-y-4">
                              {item.features && item.features.map((feature, idx) => (
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
                              className="bg-[#6b7280] hover:bg-slate-600 text-white font-bold py-2.5 px-8 text-sm transition-colors"
                            >
                              PESAN
                            </button>
                            {item.footer && (
                              <p className="text-[10px] text-gray-400 mt-4 italic">{item.footer}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              }
              
              // ADDITIONAL ITEMS VIEW (Category 2)
              return (
                <section key={category.id} className="pt-8 border-t border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-8">
                    {category.name}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categoryItems.map(item => (
                      <div key={item.id} className="text-center group">
                        <div className="overflow-hidden bg-gray-100 mb-4 aspect-video relative">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h4 className="font-bold text-gray-800">{item.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">Rp. {item.price}</p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
