import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Upload, X, Loader2 } from 'lucide-react';

export default function AdminClients() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({ id: null, name: '', logo_url: '', order_index: 0 });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('clients').select('*').order('order_index', { ascending: true });
    if (data) setItems(data);
    setLoading(false);
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({ id: null, name: '', logo_url: '', order_index: items.length });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ id: null, name: '', logo_url: '', order_index: 0 });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `clients/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('public_assets').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('public_assets').getPublicUrl(filePath);
      setFormData(prev => ({ ...prev, logo_url: publicUrl }));
    } catch (error) {
      alert('Gagal upload gambar');
      console.error(error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (formData.id) {
        const { id, ...updateData } = formData;
        const { error } = await supabase.from('clients').update(updateData).eq('id', id);
        if (error) throw error;
      } else {
        const { id, ...insertData } = formData;
        const { error } = await supabase.from('clients').insert([insertData]);
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
    if (window.confirm('Yakin ingin menghapus klien ini?')) {
      await supabase.from('clients').delete().eq('id', id);
      fetchItems();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Klien Kami</h2>
          <p className="text-slate-500 mt-1">Kelola logo klien atau pengguna jasa Anda.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={20} /> Tambah Klien
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium text-sm">
                  <th className="py-4 px-6 w-32">Logo</th>
                  <th className="py-4 px-6">Nama Klien</th>
                  <th className="py-4 px-6 w-24">Urutan</th>
                  <th className="py-4 px-6 text-right w-32">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <img src={item.logo_url || 'https://placehold.co/100'} alt="Logo" className="w-20 h-12 object-contain bg-slate-50 border border-slate-200 p-1 rounded" />
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-slate-800">{item.name}</p>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">{item.order_index}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => handleOpenModal(item)} className="text-slate-400 hover:text-primary transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-500">Belum ada data klien.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative">
            <button onClick={handleCloseModal} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X size={24}/></button>
            <h3 className="text-xl font-bold text-slate-900 mb-6">{formData.id ? 'Edit' : 'Tambah'} Klien</h3>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Instansi / Klien</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Urutan Tampil</label>
                <input type="number" value={formData.order_index} onChange={e => setFormData({...formData, order_index: parseInt(e.target.value)})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Logo Klien</label>
                {formData.logo_url && (
                  <div className="relative inline-block mb-3 w-full">
                    <img src={formData.logo_url} alt="Preview" className="w-full h-24 object-contain rounded-lg border border-slate-200 bg-slate-50" />
                    <button 
                      type="button" 
                      onClick={() => setFormData({...formData, logo_url: ''})}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded hover:bg-red-600 shadow-sm transition-colors"
                      title="Hapus Logo"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 border border-dashed border-slate-300">
                  <Upload size={16} /> Upload Logo
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>
              
              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 bg-primary text-white font-medium hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50 shadow">
                  {saving ? 'Menyimpan...' : 'Simpan Klien'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
