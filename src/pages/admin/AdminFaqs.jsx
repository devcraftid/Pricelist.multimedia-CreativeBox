import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, X, Loader2 } from 'lucide-react';

export default function AdminFaqs() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({ id: null, question: '', answer: '', order_index: 0 });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('faqs').select('*').order('order_index', { ascending: true });
    if (data) setItems(data);
    setLoading(false);
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({ id: null, question: '', answer: '', order_index: items.length });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ id: null, question: '', answer: '', order_index: 0 });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (formData.id) {
        const { id, ...updateData } = formData;
        const { error } = await supabase.from('faqs').update(updateData).eq('id', id);
        if (error) throw error;
      } else {
        const { id, ...insertData } = formData;
        const { error } = await supabase.from('faqs').insert([insertData]);
        if (error) throw error;
      }
      await fetchItems();
      handleCloseModal();
    } catch (error) {
      alert('Gagal menyimpan');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus FAQ ini?')) {
      await supabase.from('faqs').delete().eq('id', id);
      fetchItems();
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">FAQ (Tanya Jawab)</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Kelola pertanyaan yang sering diajukan pelanggan beserta jawabannya.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto justify-center bg-primary hover:bg-amber-400 text-secondary font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm active:scale-95"
        >
          <Plus size={20} /> Tambah FAQ
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>
        ) : (
          <>
            {/* Mobile View: Cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {items.map((item) => (
                <div key={item.id} className="p-4 flex flex-col gap-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full shrink-0">
                      Urutan: {item.order_index}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button 
                        onClick={() => handleOpenModal(item)} 
                        className="p-1.5 text-slate-400 hover:text-primary hover:bg-amber-50 rounded-lg transition-colors"
                        title="Edit FAQ"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)} 
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus FAQ"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{item.question}</p>
                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-3 leading-relaxed">{item.answer}</p>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-sm">Belum ada FAQ.</div>
              )}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium text-sm">
                    <th className="py-4 px-6 w-24">Urutan</th>
                    <th className="py-4 px-6">Pertanyaan & Jawaban</th>
                    <th className="py-4 px-6 text-right w-32">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 text-slate-600 font-medium">{item.order_index}</td>
                      <td className="py-4 px-6">
                        <p className="font-semibold text-slate-800">{item.question}</p>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{item.answer}</p>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => handleOpenModal(item)} className="text-slate-400 hover:text-primary transition-colors p-1 rounded-lg" title="Edit">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-lg" title="Hapus">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan="3" className="py-8 text-center text-slate-500 text-sm">Belum ada FAQ.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-xl relative max-h-[92vh] overflow-y-auto">
            <button onClick={handleCloseModal} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg"><X size={20}/></button>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-5">{formData.id ? 'Edit' : 'Tambah'} FAQ</h3>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Pertanyaan (Q)</label>
                <input required type="text" value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="Cth: Apakah melayani area luar kota?" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Jawaban (A)</label>
                <textarea required rows="4" value={formData.answer} onChange={e => setFormData({...formData, answer: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="Cth: Ya, kami melayani seluruh area Indonesia..."></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Urutan Tampil</label>
                <input type="number" value={formData.order_index} onChange={e => setFormData({...formData, order_index: parseInt(e.target.value)})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm" />
              </div>

              <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={handleCloseModal} className="w-full sm:w-auto px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors text-sm">
                  Batal
                </button>
                <button type="submit" disabled={saving} className="w-full sm:w-auto px-5 py-2.5 bg-primary text-secondary font-bold hover:bg-amber-400 rounded-xl transition-all disabled:opacity-50 shadow text-sm">
                  {saving ? 'Menyimpan...' : 'Simpan FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
