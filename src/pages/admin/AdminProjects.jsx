import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Upload, X, Loader2 } from 'lucide-react';

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({ id: null, title: '', description: '', image_url: '', video_url: '', client_name: '', date_completed: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (data) setProjects(data);
    setLoading(false);
  };

  const handleOpenModal = (project = null) => {
    if (project) {
      setFormData(project);
    } else {
      setFormData({ id: null, title: '', description: '', image_url: '', video_url: '', client_name: '', date_completed: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ id: null, title: '', description: '', image_url: '', video_url: '', client_name: '', date_completed: '' });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `projects/${fileName}`;

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
      // Remove empty optional fields so we don't send empty strings to date columns
      const payload = { ...formData };
      if (!payload.date_completed) delete payload.date_completed;

      if (formData.id) {
        // Update
        const { id, ...updateData } = payload;
        const { error } = await supabase.from('projects').update(updateData).eq('id', id);
        if (error) throw error;
      } else {
        // Insert
        const { id, ...insertData } = payload;
        const { error } = await supabase.from('projects').insert([insertData]);
        if (error) throw error;
      }
      await fetchProjects();
      handleCloseModal();
    } catch (error) {
      alert('Gagal menyimpan. Pastikan izin (Policy) Supabase sudah diperbarui.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus project ini?')) {
      await supabase.from('projects').delete().eq('id', id);
      fetchProjects();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Project Update</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Kelola daftar project yang muncul di galeri halaman Project.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto justify-center bg-primary hover:bg-amber-400 text-secondary font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm active:scale-95"
        >
          <Plus size={20} /> Tambah Project
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>
        ) : (
          <>
            {/* Mobile View: Cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {projects.map((item) => (
                <div key={item.id} className="p-4 flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <img 
                      src={item.image_url || 'https://placehold.co/100'} 
                      alt={item.title} 
                      className="w-20 h-20 object-cover rounded-xl bg-slate-100 shrink-0 border border-slate-200" 
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-900 text-base leading-snug">{item.title}</h4>
                      {item.client_name && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          <span className="font-medium text-slate-400">Klien:</span> {item.client_name}
                        </p>
                      )}
                      {item.date_completed && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(item.date_completed).toLocaleDateString('id-ID')}
                        </p>
                      )}
                      {item.description && (
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">{item.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-400">
                      {item.video_url ? '🎬 Ada Video' : '📷 Galeri Foto'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleOpenModal(item)} 
                        className="px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)} 
                        className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Trash2 size={14} /> Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-sm">Belum ada data project.</div>
              )}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium text-sm">
                    <th className="py-4 px-6 w-24">Gambar</th>
                    <th className="py-4 px-6">Nama Project & Klien</th>
                    <th className="py-4 px-6 w-32">Tanggal</th>
                    <th className="py-4 px-6 text-right w-32">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projects.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <img src={item.image_url || 'https://placehold.co/100'} alt="Project" className="w-16 h-16 object-cover rounded-xl bg-slate-100 border border-slate-200" />
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-semibold text-slate-800">{item.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5"><span className="font-medium">Klien:</span> {item.client_name || '-'}</p>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">{item.description}</p>
                      </td>
                      <td className="py-4 px-6 text-slate-600 text-sm">{item.date_completed ? new Date(item.date_completed).toLocaleDateString('id-ID') : '-'}</td>
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
                  {projects.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-slate-500 text-sm">Belum ada data project.</td>
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
          <div className="bg-white rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-xl relative overflow-y-auto max-h-[92vh]">
            <button onClick={handleCloseModal} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg"><X size={20}/></button>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-5">{formData.id ? 'Edit' : 'Tambah'} Project</h3>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Judul Project</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Singkat</label>
                <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm"></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nama Klien (Opsional)</label>
                  <input type="text" value={formData.client_name} onChange={e => setFormData({...formData, client_name: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal (Opsional)</label>
                  <input type="date" value={formData.date_completed} onChange={e => setFormData({...formData, date_completed: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Gambar / Thumbnail</label>
                {formData.image_url && (
                  <div className="relative inline-block mb-3">
                    <img src={formData.image_url} alt="Preview" className="h-28 w-28 object-cover rounded-xl border border-slate-200 shadow-sm" />
                    <button 
                      type="button" 
                      onClick={() => setFormData({...formData, image_url: ''})}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600 shadow-sm transition-colors"
                      title="Hapus Gambar"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 border border-dashed border-slate-300">
                  <Upload size={16} /> Ganti Gambar
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Link Video (Opsional)</label>
                <input type="url" placeholder="https://youtube.com/..." value={formData.video_url || ''} onChange={e => setFormData({...formData, video_url: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm" />
                <p className="text-[11px] text-slate-500 mt-1">Jika diisi, modal akan memutar video ini saat project diklik.</p>
              </div>
              
              <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={handleCloseModal} className="w-full sm:w-auto px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors text-sm">
                  Batal
                </button>
                <button type="submit" disabled={saving} className="w-full sm:w-auto px-5 py-2.5 bg-primary text-secondary font-bold hover:bg-amber-400 rounded-xl transition-all disabled:opacity-50 shadow text-sm">
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
