import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Upload, X, Loader2 } from 'lucide-react';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({ id: null, title: '', description: '', icon_or_image_url: '', order_index: 0 });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('services').select('*').order('order_index', { ascending: true });
    if (data) setServices(data);
    setLoading(false);
  };

  const handleOpenModal = (service = null) => {
    if (service) {
      setFormData(service);
    } else {
      setFormData({ id: null, title: '', description: '', icon_or_image_url: '', order_index: services.length });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ id: null, title: '', description: '', icon_or_image_url: '', order_index: 0 });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `services/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('public_assets').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('public_assets').getPublicUrl(filePath);
      setFormData(prev => ({ ...prev, icon_or_image_url: publicUrl }));
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
        // Update
        const { id, ...updateData } = formData;
        const { error } = await supabase.from('services').update(updateData).eq('id', id);
        if (error) throw error;
      } else {
        // Insert
        const { id, ...insertData } = formData;
        const { error } = await supabase.from('services').insert([insertData]);
        if (error) throw error;
      }
      await fetchServices();
      handleCloseModal();
    } catch (error) {
      alert('Gagal menyimpan');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus layanan ini?')) {
      await supabase.from('services').delete().eq('id', id);
      fetchServices();
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 mb-6 sm:mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Layanan Kami</h2>
          <p className="text-slate-500 mt-1 text-xs sm:text-sm">Kelola daftar layanan yang muncul di halaman depan.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto justify-center bg-primary hover:bg-amber-400 text-secondary font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm active:scale-95 text-xs sm:text-sm min-h-[42px]"
        >
          <Plus size={18} /> Tambah Layanan
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>
        ) : (
          <>
            {/* Mobile Cards List */}
            <div className="md:hidden divide-y divide-slate-100">
              {services.map((item) => (
                <div key={item.id} className="p-4 flex gap-3.5 items-start">
                  <img src={item.icon_or_image_url || 'https://placehold.co/100'} alt="Icon" className="w-16 h-14 object-cover rounded-xl bg-slate-100 border border-slate-200 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-slate-900 text-sm truncate">{item.title}</p>
                      <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full shrink-0">Urutan: {item.order_index}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                    <div className="flex items-center gap-2.5 mt-3 pt-2.5 border-t border-slate-100">
                      <button onClick={() => handleOpenModal(item)} className="text-xs font-bold text-slate-700 hover:text-primary flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-100 active:bg-slate-200 transition-colors">
                        <Edit2 size={13} /> Edit
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-red-50 active:bg-red-100 transition-colors">
                        <Trash2 size={13} /> Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {services.length === 0 && (
                <div className="py-10 text-center text-slate-500 text-sm">Belum ada data layanan.</div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                    <th className="py-4 px-6 w-24">Gambar</th>
                    <th className="py-4 px-6">Nama Layanan</th>
                    <th className="py-4 px-6 w-24">Urutan</th>
                    <th className="py-4 px-6 text-right w-32">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {services.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <img src={item.icon_or_image_url || 'https://placehold.co/100'} alt="Icon" className="w-16 h-12 object-cover rounded-lg bg-slate-100 border border-slate-200" />
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-bold text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.description}</p>
                      </td>
                      <td className="py-4 px-6 text-slate-600 font-medium">{item.order_index}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2.5">
                          <button onClick={() => handleOpenModal(item)} className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {services.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-slate-500">Belum ada data layanan.</td>
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
          <div className="bg-white rounded-2xl w-full max-w-lg p-4 sm:p-6 shadow-2xl relative overflow-y-auto max-h-[92vh]">
            <button onClick={handleCloseModal} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"><X size={22}/></button>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-5">{formData.id ? 'Edit' : 'Tambah'} Layanan</h3>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Nama Layanan</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm text-slate-900" />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Deskripsi Singkat</label>
                <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm text-slate-900"></textarea>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Nomor Urut Tampil</label>
                <input type="number" value={formData.order_index} onChange={e => setFormData({...formData, order_index: parseInt(e.target.value) || 0})} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm text-slate-900" />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Gambar / Ikon</label>
                {formData.icon_or_image_url && (
                  <div className="relative inline-block mb-3">
                    <img src={formData.icon_or_image_url} alt="Preview" className="h-28 sm:h-32 object-cover rounded-xl border border-slate-200" />
                    <button 
                      type="button" 
                      onClick={() => setFormData({...formData, icon_or_image_url: ''})}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-sm transition-colors"
                      title="Hapus Gambar"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 border border-dashed border-slate-300">
                  <Upload size={16} /> Ganti Gambar
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>
              
              <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={handleCloseModal} className="w-full sm:w-auto px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors text-sm">
                  Batal
                </button>
                <button type="submit" disabled={saving} className="w-full sm:w-auto px-5 py-2.5 bg-primary text-secondary font-bold hover:bg-amber-400 rounded-xl transition-all disabled:opacity-50 shadow text-sm">
                  {saving ? 'Menyimpan...' : 'Simpan Layanan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
