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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Pesan Masuk</h2>
          <p className="text-slate-500 mt-1">Daftar pesan dari form kontak website.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>
        ) : (
          <div className="divide-y divide-slate-100">
            {messages.map((msg) => (
              <div key={msg.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row gap-6">
                
                {/* Sender Info */}
                <div className="md:w-1/4 shrink-0">
                  <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
                    <div className="w-10 h-10 bg-blue-100 text-primary rounded-full flex items-center justify-center font-bold text-lg">
                      {msg.name.charAt(0).toUpperCase()}
                    </div>
                    {msg.name}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                    <Mail size={14} /> {msg.email}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar size={14} /> {formatDate(msg.created_at)}
                  </div>
                </div>

                {/* Message Content */}
                <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-2">{msg.subject || 'Tidak ada subjek'}</h4>
                  <p className="text-slate-600 whitespace-pre-wrap text-sm leading-relaxed">{msg.message}</p>
                </div>

                {/* Actions */}
                <div className="shrink-0 flex md:flex-col justify-end items-end">
                  <button 
                    onClick={() => handleDelete(msg.id)} 
                    className="text-slate-400 hover:text-red-500 transition-colors bg-white border border-slate-200 hover:border-red-200 p-2 rounded-lg flex items-center gap-2 text-sm font-medium"
                  >
                    <Trash2 size={16} /> <span className="md:hidden">Hapus</span>
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
