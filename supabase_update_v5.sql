-- Tambahkan kolom primary_color ke tabel site_settings
ALTER TABLE site_settings
ADD COLUMN primary_color TEXT DEFAULT '#f5a623';
