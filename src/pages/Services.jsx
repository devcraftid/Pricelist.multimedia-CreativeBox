import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const Services = () => {
  const [services, setServices] = useState([]);
  const [clients, setClients] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        { data: servicesData },
        { data: clientsData },
        { data: settingsData }
      ] = await Promise.all([
        supabase.from('services').select('*').order('order_index', { ascending: true }),
        supabase.from('clients').select('*').order('order_index', { ascending: true }),
        supabase.from('site_settings').select('*').limit(1)
      ]);

      if (servicesData) setServices(servicesData);
      if (clientsData) setClients(clientsData);
      if (settingsData && settingsData.length > 0) setSettings(settingsData[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] text-[#1a2035] font-bold">Loading Services...</div>;
  }

  const heroBg = settings?.hero_image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80';

  return (
    <div className="w-full bg-white">
      {/* HERO BANNER */}
      <section className="relative w-full h-[250px] md:h-[350px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${heroBg}')` }}
        />
        <div className="absolute inset-0 bg-[#1a2035]/80 z-0" />
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-wider uppercase">
            SERVICES
          </h1>
        </div>
      </section>

      {/* OUR SERVICES SECTION */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-[#f5a623] font-bold text-sm md:text-base mb-2">Our Services</h3>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1a2035]">Layanan Kami</h2>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-gray-50 border border-dashed rounded-lg">
            Belum ada layanan yang ditambahkan oleh Admin.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {services.map((svc) => (
              <div key={svc.id} className="group">
                <div className="overflow-hidden mb-5 rounded-sm">
                  <img 
                    src={svc.icon_or_image_url || 'https://placehold.co/600x400?text=No+Image'} 
                    alt={svc.title} 
                    className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-[#1a2035] mb-3">{svc.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{svc.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* OUR CLIENTS SECTION */}
      <section className="py-16 md:py-24 bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="text-center mb-12">
          <h3 className="text-[#f5a623] font-bold text-sm md:text-base mb-2">Trust and Worth</h3>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1a2035]">Our Clients</h2>
        </div>

        {clients.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-gray-50 border border-dashed rounded-lg">
            Belum ada klien yang ditambahkan oleh Admin.
          </div>
        ) : (
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {clients.map((client) => (
              <div key={client.id} className="grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100 cursor-pointer">
                <img 
                  src={client.logo_url || 'https://placehold.co/200x100?text=Logo'} 
                  alt={client.name} 
                  className="max-h-12 md:max-h-16 object-contain" 
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Services;
