import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2, Mail, Calendar, Loader2, Inbox } from 'lucide-react';

export default function AdminInbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    if (data) setMessages(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus pesan ini?')) {
      await supabase.from('contact_messages').delete().eq('id', id);
      fetchMessages();
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Pesan Masuk</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Daftar pesan dari form kontak website.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>
        ) : (
          <div className="divide-y divide-slate-100">
            {messages.map((msg) => (
              <div key={msg.id} className="p-4 sm:p-6 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row gap-4 sm:gap-6">
                
                {/* Sender Info */}
                <div className="md:w-1/3 lg:w-1/4 shrink-0">
                  <div className="flex items-center justify-between md:block">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 text-amber-900 rounded-xl flex items-center justify-center font-black text-base shrink-0">
                        {msg.name ? msg.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 text-sm leading-tight truncate">{msg.name}</h4>
                        <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 truncate">
                          <Mail size={12} className="shrink-0 text-slate-400" /> {msg.email}
                        </p>
                      </div>
                    </div>
                    {/* Delete button on mobile */}
                    <div className="md:hidden shrink-0">
                      <button 
                        onClick={() => handleDelete(msg.id)} 
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl border border-slate-200 transition-colors"
                        title="Hapus Pesan"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2.5">
                    <Calendar size={12} className="shrink-0" /> {formatDate(msg.created_at)}
                  </div>
                </div>

                {/* Message Content */}
                <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  <h4 className="font-bold text-slate-900 text-sm mb-1.5">{msg.subject || 'Tidak ada subjek'}</h4>
                  <p className="text-slate-600 whitespace-pre-wrap text-xs sm:text-sm leading-relaxed">{msg.message}</p>
                </div>

                {/* Actions (Desktop) */}
                <div className="hidden md:flex shrink-0 items-start">
                  <button 
                    onClick={() => handleDelete(msg.id)} 
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors bg-white border border-slate-200 hover:border-red-200 p-2.5 rounded-xl flex items-center gap-2 text-xs font-semibold"
                    title="Hapus Pesan"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

              </div>
            ))}
            {messages.length === 0 && (
              <div className="py-16 text-center text-slate-500 flex flex-col items-center">
                <Inbox size={48} className="text-slate-300 mb-4" />
                <p className="font-medium text-lg">Belum ada pesan masuk.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
