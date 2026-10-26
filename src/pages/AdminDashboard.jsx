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
    { title: 'Pengaturan Situs', value: 'Konfigurasi', icon: Settings, link: '/admin/settings', iconBg: 'bg-blue-50 text-blue-600 border border-blue-200/80', dot: 'bg-blue-500' },
    { title: 'Layanan Kami', value: `${stats.services} Layanan`, icon: LayoutList, link: '/admin/services', iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-200/80', dot: 'bg-indigo-500' },
    { title: 'Rental Equipment', value: `${stats.equipments} Alat`, icon: Camera, link: '/admin/equipments', iconBg: 'bg-purple-50 text-purple-600 border border-purple-200/80', dot: 'bg-purple-500' },
    { title: 'Klien Kami', value: `${stats.clients} Klien`, icon: Users, link: '/admin/clients', iconBg: 'bg-pink-50 text-pink-600 border border-pink-200/80', dot: 'bg-pink-500' },
    { title: 'FAQ', value: `${stats.faqs} FAQ`, icon: HelpCircle, link: '/admin/faqs', iconBg: 'bg-amber-50 text-amber-600 border border-amber-200/80', dot: 'bg-amber-500' },
    { title: 'Pesan Masuk', value: `${stats.messages} Pesan Baru`, icon: Inbox, link: '/admin/inbox', iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200/80', dot: 'bg-emerald-500' }
  ];

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Selamat Datang di Admin Panel!</h2>
        <p className="text-slate-500 mt-1 sm:mt-2 text-xs sm:text-base">Pilih menu di bawah ini untuk mulai mengelola konten website Anda.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link key={index} to={card.link} className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-4 sm:p-6 hover:shadow-md hover:border-slate-300 transition-all group relative overflow-hidden active:scale-[0.99]">
              <div className="flex justify-between items-start mb-3 sm:mb-4 relative z-10">
                <div className={`p-3 sm:p-3.5 rounded-xl ${card.iconBg} shadow-xs`}>
                  <Icon size={22} className="sm:w-6 sm:h-6" />
                </div>
                <div className="text-slate-400 group-hover:text-amber-600 group-hover:bg-amber-50 transition-colors bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <ArrowRight size={16} />
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="text-xs sm:text-sm font-semibold text-slate-500">{card.title}</h3>
                <p className="text-lg sm:text-2xl font-black text-slate-900 mt-1">{card.value}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
