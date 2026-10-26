-- Buat tabel pricelist_items
CREATE TABLE IF NOT EXISTS public.pricelist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL, -- 'Live Cam', 'LED Videotron', 'Stage & Rigging', 'Sound System'
    name TEXT NOT NULL,
    subtitle TEXT,
    price TEXT,
    price_color TEXT,
    bg_color TEXT,
    ribbon TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    footer TEXT,
    image_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aktifkan RLS (Row Level Security)
ALTER TABLE public.pricelist_items ENABLE ROW LEVEL SECURITY;

-- Kebijakan untuk Publik (Hanya bisa melihat/Select)
DROP POLICY IF EXISTS "Public can view pricelist_items" ON public.pricelist_items;
CREATE POLICY "Public can view pricelist_items" ON public.pricelist_items 
FOR SELECT USING (true);

-- Kebijakan untuk Admin (Bisa Insert)
DROP POLICY IF EXISTS "Admin can insert pricelist_items" ON public.pricelist_items;
CREATE POLICY "Admin can insert pricelist_items" ON public.pricelist_items 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Kebijakan untuk Admin (Bisa Update)
DROP POLICY IF EXISTS "Admin can update pricelist_items" ON public.pricelist_items;
CREATE POLICY "Admin can update pricelist_items" ON public.pricelist_items 
FOR UPDATE USING (auth.role() = 'authenticated');

-- Kebijakan untuk Admin (Bisa Delete)
DROP POLICY IF EXISTS "Admin can delete pricelist_items" ON public.pricelist_items;
CREATE POLICY "Admin can delete pricelist_items" ON public.pricelist_items 
FOR DELETE USING (auth.role() = 'authenticated');
