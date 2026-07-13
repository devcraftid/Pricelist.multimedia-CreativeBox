import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { Settings, LayoutList, Camera, Users, HelpCircle, Inbox, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    services: 0,
    equipments: 0,
    clients: 0,
    faqs: 0,
    messages: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const getCount = async (table) => {
      const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
      return count || 0;
    };

    const [services, equipments, clients, faqs, messages] = await Promise.all([
      getCount('services'),
      getCount('rental_equipments'),
      getCount('clients'),
      getCount('faqs'),
      getCount('contact_messages')
    ]);

    setStats({ services, equipments, clients, faqs, messages });
  };

  const cards = [
    { title: 'Pengaturan Situs', value: 'Konfigurasi', icon: Settings, link: '/admin/settings', color: 'bg-blue-500' },
    { title: 'Layanan Kami', value: `${stats.services} Layanan`, icon: LayoutList, link: '/admin/services', color: 'bg-indigo-500' },
    { title: 'Rental Equipment', value: `${stats.equipments} Alat`, icon: Camera, link: '/admin/equipments', color: 'bg-purple-500' },
    { title: 'Klien Kami', value: `${stats.clients} Klien`, icon: Users, link: '/admin/clients', color: 'bg-pink-500' },
    { title: 'FAQ', value: `${stats.faqs} FAQ`, icon: HelpCircle, link: '/admin/faqs', color: 'bg-orange-500' },
    { title: 'Pesan Masuk', value: `${stats.messages} Pesan Baru`, icon: Inbox, link: '/admin/inbox', color: 'bg-emerald-500' }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground">Selamat Datang di Admin Panel!</h2>
        <p className="text-slate-500 mt-2 text-lg">Pilih menu di bawah ini untuk mulai mengelola konten website Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link key={index} to={card.link} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-4 rounded-xl text-white ${card.color} shadow-inner`}>
                  <Icon size={28} />
                </div>
                <div className="text-slate-400 group-hover:text-primary transition-colors bg-background p-2 rounded-lg">
                  <ArrowRight size={20} />
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-slate-700">{card.title}</h3>
                <p className="text-2xl font-bold text-foreground mt-1">{card.value}</p>
              </div>
              <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-full opacity-5 ${card.color} blur-2xl`}></div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
