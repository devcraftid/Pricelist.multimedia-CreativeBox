-- Menambahkan data paket Price List untuk kategori "Live Cam"
-- Pastikan Anda sudah menjalankan script pembuatan tabel pricelist_items sebelumnya

DELETE FROM public.pricelist_items WHERE category = 'Live Cam';

INSERT INTO public.pricelist_items (category, name, subtitle, price, ribbon, features)
VALUES 
(
  'Live Cam', 
  'PAKET HEMAT', 
  'Video Liputan', 
  '2,2 JT', 
  'TERMURAH', 
  '["Kamera 1 Unit Sony Full HD", "Operator", "Tripod", "Kabel System", "Output Data MP4"]'::jsonb
),
(
  'Live Cam', 
  'LIVE STREAMING 2 KAMERA', 
  'Standar Promo', 
  '4,5 JT', 
  'BEST SELLER', 
  '["Kamera 2 Unit Sony Full HD", "Operator", "Streaming 1 / Mix", "Recorder Video", "Lighting Standar", "Output Data MP4"]'::jsonb
),
(
  'Live Cam', 
  'LIVE STREAMING 3 KAMERA', 
  'Standar', 
  '6 JT', 
  'RECOMMENDED', 
  '["Kamera 3 Unit Sony Full HD", "Operator", "Streaming 1 / Mix", "Recorder Video", "Lighting Standar", "Output Data MP4", "Intercom System"]'::jsonb
),
(
  'Live Cam', 
  'LIVE STREAMING 4 KAMERA', 
  'Professional', 
  '8 JT', 
  '', 
  '["Kamera 4 Unit Sony Full HD", "Operator", "Streaming 1 / Mix", "Recorder Video", "Lighting Standar", "Output Data MP4", "Intercom System", "Jimmy Jib 8m"]'::jsonb
);
