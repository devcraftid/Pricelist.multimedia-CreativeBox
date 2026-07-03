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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">FAQ (Tanya Jawab)</h2>
          <p className="text-slate-500 mt-1">Kelola pertanyaan yang sering diajukan pelanggan beserta jawabannya.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={20} /> Tambah FAQ
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium text-sm">
                <th className="py-4 px-6">Pertanyaan & Jawaban</th>
                <th className="py-4 px-6 w-24">Urutan</th>
                <th className="py-4 px-6 text-right w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-800 text-base mb-1">Q: {item.question}</p>
                    <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded border border-slate-100">
                      A: {item.answer}
                    </p>
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-medium">{item.order_index}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => handleOpenModal(item)} className="text-slate-400 hover:text-primary transition-colors bg-blue-50 p-2 rounded-lg">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-red-500 transition-colors bg-red-50 p-2 rounded-lg">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan="3" className="py-12 text-center text-slate-500 font-medium">Belum ada FAQ.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl relative">
            <button onClick={handleCloseModal} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X size={24}/></button>
            <h3 className="text-xl font-bold text-slate-900 mb-6">{formData.id ? 'Edit' : 'Tambah'} FAQ</h3>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Pertanyaan (Q)</label>
                <input required type="text" value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="Cth: Apakah melayani area luar kota?" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Jawaban (A)</label>
                <textarea required rows="4" value={formData.answer} onChange={e => setFormData({...formData, answer: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="Cth: Ya, kami melayani seluruh area Indonesia..."></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Urutan Tampil</label>
                <input type="number" value={formData.order_index} onChange={e => setFormData({...formData, order_index: parseInt(e.target.value)})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 bg-primary text-white font-medium hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50 shadow">
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
