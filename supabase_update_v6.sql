-- Tambahkan kolom warna tambahan ke tabel site_settings
ALTER TABLE site_settings
ADD COLUMN secondary_color TEXT DEFAULT '#1b253b',
ADD COLUMN bg_color TEXT DEFAULT '#f8fafc',
ADD COLUMN text_color TEXT DEFAULT '#0f172a';
