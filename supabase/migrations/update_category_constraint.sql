-- Update listings.category check constraint to new category taxonomy
-- Run this in the Supabase dashboard → SQL editor

ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_category_check;

ALTER TABLE listings ADD CONSTRAINT listings_category_check CHECK (
  category IN (
    -- Service listing categories
    'home_yard',
    'tech_creative',
    'lessons',
    'wellness',
    'care_errands',
    -- Rental listing categories
    'tools_equipment',
    'outdoor_adventure',
    'party_events',
    'garden_yard',
    'vehicles'
  )
);
