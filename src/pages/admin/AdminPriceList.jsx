import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Upload, X, Loader2 } from 'lucide-react';

const CATEGORIES = ['Live Cam'];

export default function AdminPriceList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Live Cam');
  
  const [formData, setFormData] = useState({ 
    id: null, category: 'Live Cam', name: '', subtitle: '', 
    price: '', featuresText: '', ribbon: '', image_url: '', order_index: 0
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('pricelist_items').select('*').order('order_index', { ascending: true });
    if (data) setItems(data);
    setLoading(false);
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      // Convert JSON array to newline separated string for textarea
      const featuresArr = item.features || [];
      const featuresText = Array.isArray(featuresArr) ? featuresArr.join('\n') : '';
      setFormData({ ...item, featuresText });
    } else {
      setFormData({ 
        id: null, category: activeCategory, name: '', subtitle: '', 
        price: '', featuresText: '', ribbon: '', image_url: '', order_index: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ id: null, category: 'Live Cam', name: '', subtitle: '', price: '', featuresText: '', ribbon: '', image_url: '', order_index: 0 });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `pricelist/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('public_assets').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('public_assets').getPublicUrl(filePath);
      setFormData(prev => ({ ...prev, image_url: publicUrl }));
    } catch (error) {
      alert('Gagal upload gambar');
      console.error(error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Convert newline separated string back to JSON array
      const featuresArr = formData.featuresText
        .split('\n')
        .map(s => s.trim())
        .filter(s => s !== '');
      
      const payload = { 
        category: formData.category,
        name: formData.name,
        subtitle: formData.subtitle,
        price: formData.price,
        ribbon: formData.ribbon,
        image_url: formData.image_url,
        order_index: formData.order_index,
        features: featuresArr
      };

      if (formData.id) {
        // Update
        const { error } = await supabase.from('pricelist_items').update(payload).eq('id', formData.id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase.from('pricelist_items').insert([payload]);
        if (error) throw error;
      }
      await fetchItems();
      handleCloseModal();
    } catch (error) {
      alert('Gagal menyimpan. Pastikan SQL Setup sudah di-run.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus item ini?')) {
      await supabase.from('pricelist_items').delete().eq('id', id);
      fetchItems();
    }
  };

  const filteredItems = items.filter(item => item.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Paket Harga / Price List</h2>
          <p className="text-slate-500 mt-1 text-xs sm:text-sm">Kelola daftar harga dan paket yang muncul di halaman Price List.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto justify-center bg-primary hover:bg-amber-400 text-secondary font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm active:scale-95 text-xs sm:text-sm min-h-[42px]"
        >
          <Plus size={18} /> Tambah Paket
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 border-b border-slate-200 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 font-bold text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap ${
              activeCategory === cat 
                ? 'border-primary text-slate-900 bg-amber-50/50 rounded-t-lg' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>
        ) : (
          <>
            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <div key={item.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-block bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-slate-200">
                          {item.category}
                        </span>
                        {item.ribbon && (
                          <span className="inline-block bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase">
                            {item.ribbon}
                          </span>
                        )}
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-base mt-1.5">{item.name}</h4>
                      {item.subtitle && <p className="text-xs text-slate-500 mt-0.5">{item.subtitle}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-semibold text-slate-500 block">Harga</span>
                      <span className="text-base font-black text-amber-600">{item.price}</span>
                    </div>
                  </div>

                  {item.image_url && (
                    <img src={item.image_url} alt="Item" className="w-full h-32 object-cover rounded-xl bg-slate-100 border border-slate-200" />
                  )}

                  {Array.isArray(item.features) && item.features.length > 0 && (
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                      {item.features.slice(0, 3).map((f, i) => (
                        <div key={i} className="line-clamp-1">• {f}</div>
                      ))}
                      {item.features.length > 3 && (
                        <div className="text-[10px] text-slate-400 font-medium italic">+ {item.features.length - 3} fitur lainnya</div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-400 font-medium">Urutan: {item.order_index}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleOpenModal(item)} className="font-bold text-slate-700 hover:text-primary flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-100 active:bg-slate-200 transition-colors">
                        <Edit2 size={13} /> Edit
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="font-bold text-red-600 hover:text-red-700 flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-red-50 active:bg-red-100 transition-colors">
                        <Trash2 size={13} /> Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredItems.length === 0 && (
                <div className="py-10 text-center text-slate-500 text-sm">Belum ada data paket harga.</div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                    <th className="py-4 px-6 w-32">Kategori</th>
                    <th className="py-4 px-6">Nama Paket / Item</th>
                    <th className="py-4 px-6 w-24">Urutan</th>
                    <th className="py-4 px-6">Harga</th>
                    <th className="py-4 px-6">Features</th>
                    <th className="py-4 px-6 text-right w-32">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold border border-slate-200">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-bold text-slate-900">{item.name}</p>
                        {item.subtitle && <p className="text-xs text-slate-500 mt-0.5">{item.subtitle}</p>}
                        {item.image_url ? (
                          <img src={item.image_url} alt="Item" className="w-16 h-12 object-cover rounded-lg bg-slate-100 mt-2 border border-slate-200" />
                        ) : null}
                      </td>
                      <td className="py-4 px-6 text-slate-600 font-medium">{item.order_index}</td>
                      <td className="py-4 px-6">
                        <p className="font-black text-amber-600">{item.price}</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-xs text-slate-600 max-h-16 overflow-y-auto pr-2 space-y-0.5">
                          {Array.isArray(item.features) ? item.features.map((f, i) => <div key={i} className="line-clamp-1">• {f}</div>) : '-'}
                        </div>
                      </td>
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
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-500">Belum ada data paket harga.</td>
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
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-5">{formData.id ? 'Edit' : 'Tambah'} Paket/Item</h3>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Kategori</label>
                <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm text-slate-900">
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Nama Paket / Item</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm text-slate-900" />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Urutan Tampil</label>
                <input required type="number" value={formData.order_index} onChange={e => setFormData({...formData, order_index: parseInt(e.target.value) || 0})} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm text-slate-900" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Subtitle (Opsional)</label>
                  <input type="text" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Harga (Cth: 2,2 JT / 500K)</label>
                  <input required type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm text-slate-900" />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Daftar Fitur (Pisahkan dengan Enter)</label>
                <textarea rows="4" placeholder="Kamera 1 Unit Sony Full HD&#10;Operator Streaming 1/mix&#10;Recorder Video" value={formData.featuresText} onChange={e => setFormData({...formData, featuresText: e.target.value})} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none leading-relaxed text-sm text-slate-900"></textarea>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Pita Label (Opsional, cth: BEST SELLER)</label>
                <input type="text" value={formData.ribbon} onChange={e => setFormData({...formData, ribbon: e.target.value})} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm text-slate-900" />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Gambar (Hanya untuk Item Satuan)</label>
                {formData.image_url && (
                  <div className="relative inline-block mb-3">
                    <img src={formData.image_url} alt="Preview" className="h-20 object-cover rounded-xl border border-slate-200" />
                    <button 
                      type="button" 
                      onClick={() => setFormData({...formData, image_url: ''})}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-sm transition-colors"
                      title="Hapus Gambar"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
                <div>
                  <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors inline-flex items-center gap-2 border border-dashed border-slate-300">
                    <Upload size={16} /> Pilih Gambar
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={handleCloseModal} className="w-full sm:w-auto px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors text-sm">
                  Batal
                </button>
                <button type="submit" disabled={saving} className="w-full sm:w-auto px-5 py-2.5 bg-primary text-secondary font-bold hover:bg-amber-400 rounded-xl transition-all disabled:opacity-50 shadow text-sm">
                  {saving ? 'Menyimpan...' : 'Simpan Paket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
