-- Add promo settings to site_settings table
ALTER TABLE site_settings
ADD COLUMN promo_active BOOLEAN DEFAULT false,
ADD COLUMN promo_text TEXT DEFAULT 'PROMO !',
ADD COLUMN promo_link TEXT DEFAULT '#';
