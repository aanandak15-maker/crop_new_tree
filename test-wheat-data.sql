-- Comprehensive Wheat Data for Testing
-- This script inserts detailed wheat information into the database for testing all dashboard features

-- Insert main wheat crop data
INSERT INTO public.crops (
  id,
  name,
  scientific_name,
  description,
  season,
  climate_type,
  soil_type,
  water_requirement,
  growth_duration,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Wheat',
  'Triticum aestivum',
  'Wheat is one of the world''s most important cereal crops, providing essential nutrition and serving as a staple food for billions of people globally. It is the second most-produced cereal after maize and the most important food grain in terms of human consumption. Wheat was first domesticated in the Fertile Crescent and has been cultivated for over 10,000 years.',
  ARRAY['Rabi', 'Winter'],
  ARRAY['Temperate', 'Subtropical', 'Mediterranean'],
  ARRAY['Well-drained loamy', 'Clay loam', 'Sandy loam', 'Alluvial soils'],
  'Medium to High (500-700mm annually)',
  '120-150 days',
  NOW(),
  NOW()
) ON CONFLICT (name) DO UPDATE SET
  scientific_name = EXCLUDED.scientific_name,
  description = EXCLUDED.description,
  season = EXCLUDED.season,
  climate_type = EXCLUDED.climate_type,
  soil_type = EXCLUDED.soil_type,
  water_requirement = EXCLUDED.water_requirement,
  growth_duration = EXCLUDED.growth_duration,
  updated_at = NOW()
RETURNING id;

-- Get the wheat crop ID for inserting varieties
DO $$
DECLARE
  wheat_crop_id UUID;
BEGIN
  SELECT id INTO wheat_crop_id FROM public.crops WHERE name = 'Wheat';
  
  -- Insert wheat varieties
  INSERT INTO public.varieties (
    crop_id,
    name,
    duration,
    yield_potential,
    grain_quality,
    market_type,
    suitable_states,
    disease_resistance,
    special_features
  ) VALUES
    (wheat_crop_id, 'HD 2967', '135-140 days', '45-50 q/ha (potential)', 'High Protein, Medium Bold, Amber color', 'Premium', ARRAY['Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan'], ARRAY['Yellow rust', 'Brown rust', 'Powdery mildew', 'Karnal bunt'], ARRAY['High protein content (12-13%)', 'Excellent chapati quality', 'Semi-dwarf (85-90 cm)', 'Heat tolerant']),
    
    (wheat_crop_id, 'DBW 187', '140-145 days', '40-45 q/ha (potential)', 'Good chapati quality, Medium grain size', 'Standard', ARRAY['Punjab', 'Haryana', 'Delhi', 'Western UP', 'Uttarakhand'], ARRAY['Yellow rust', 'Leaf rust', 'Powdery mildew', 'Loose smut'], ARRAY['Heat tolerant', 'Late sowing variety', 'Good grain quality', 'Lodging resistant']),
    
    (wheat_crop_id, 'Pusa 3085', '130-135 days', '42-48 q/ha (potential)', 'Good milling quality, Medium slender grain', 'Standard', ARRAY['Bihar', 'Jharkhand', 'Eastern UP', 'West Bengal', 'Odisha'], ARRAY['Blast', 'Brown spot', 'Bacterial blight', 'Sheath blight'], ARRAY['Early maturing', 'High yielding', 'Disease resistant', 'Good milling quality']),
    
    (wheat_crop_id, 'HD 3086', '145-150 days', '50-55 q/ha (potential)', 'High protein, Good bread making quality', 'Premium', ARRAY['Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh'], ARRAY['Yellow rust', 'Brown rust', 'Powdery mildew', 'Karnal bunt'], ARRAY['High yielding', 'Good protein content', 'Excellent bread quality', 'Disease resistant']),
    
    (wheat_crop_id, 'WH 1105', '135-140 days', '45-50 q/ha (potential)', 'Good chapati quality, Medium bold grain', 'Premium', ARRAY['Punjab', 'Haryana', 'Western UP', 'Rajasthan'], ARRAY['Yellow rust', 'Brown rust', 'Powdery mildew'], ARRAY['High yielding', 'Good grain quality', 'Heat tolerant', 'Lodging resistant']),
    
    (wheat_crop_id, 'DBW 303', '140-145 days', '42-47 q/ha (potential)', 'Good chapati quality, Medium grain size', 'Standard', ARRAY['Punjab', 'Haryana', 'Western UP', 'Uttarakhand'], ARRAY['Yellow rust', 'Brown rust', 'Powdery mildew', 'Loose smut'], ARRAY['High yielding', 'Good grain quality', 'Disease resistant', 'Heat tolerant']),
    
    (wheat_crop_id, 'Pusa Basmati 1509', '115-120 days', '40-45 q/ha (potential)', 'Export quality, Extra long grain', 'Premium', ARRAY['Punjab', 'Haryana', 'Uttar Pradesh', 'Uttarakhand'], ARRAY['Blast', 'Bacterial blight'], ARRAY['Export quality', 'Extra long grain', 'High aroma', 'Late sowing suitable']),
    
    (wheat_crop_id, 'Karnal Local', '140-150 days', '35-40 q/ha (potential)', 'Traditional quality, Bold grain', 'Traditional', ARRAY['Haryana', 'Uttar Pradesh', 'Delhi'], ARRAY['Yellow rust', 'Brown rust'], ARRAY['Traditional variety', 'Good chapati quality', 'Adapted to local conditions', 'Organic farming suitable']);

  -- Insert wheat pests
  INSERT INTO public.pests (
    name,
    scientific_name,
    description,
    affected_crops,
    symptoms,
    prevention_methods,
    treatment_methods
  ) VALUES
    ('Aphids', 'Rhopalosiphum maidis, Sitobion avenae', 'Small sap-sucking insects that feed on wheat plants, causing yellowing and stunting', ARRAY['Wheat'], ARRAY['Yellowing leaves', 'Stunted growth', 'Honeydew secretion', 'Sooty mold'], ARRAY['Early sowing', 'Balanced fertilization', 'Crop rotation', 'Resistant varieties'], ARRAY['Neem oil spray', 'Insecticidal soap', 'Chemical insecticides', 'Biological control']),
    
    ('Termites', 'Odontotermes obesus', 'Soil-dwelling insects that damage roots and stems of wheat plants', ARRAY['Wheat'], ARRAY['Wilting plants', 'Hollow stems', 'Root damage', 'Plant death'], ARRAY['Deep ploughing', 'Soil treatment', 'Crop rotation', 'Proper irrigation'], ARRAY['Soil insecticides', 'Termite baits', 'Biological control', 'Cultural practices']),
    
    ('Cutworms', 'Agrotis ipsilon', 'Nocturnal caterpillars that cut young wheat plants at the base', ARRAY['Wheat'], ARRAY['Cut stems', 'Missing plants', 'Irregular damage', 'Night feeding'], ARRAY['Early sowing', 'Clean cultivation', 'Crop rotation', 'Trap crops'], ARRAY['Chemical insecticides', 'Biological control', 'Hand picking', 'Cultural practices']),
    
    ('Armyworms', 'Mythimna separata', 'Caterpillars that feed on wheat leaves and can cause severe defoliation', ARRAY['Wheat'], ARRAY['Skeletonized leaves', 'Defoliation', 'Fecal pellets', 'Mass movement'], ARRAY['Early detection', 'Crop rotation', 'Resistant varieties', 'Natural enemies'], ARRAY['Chemical control', 'Biological control', 'Cultural practices', 'Integrated management']),
    
    ('Shoot Fly', 'Atherigona naqvii', 'Flies whose larvae damage wheat shoots, causing dead hearts', ARRAY['Wheat'], ARRAY['Dead hearts', 'Stunted growth', 'Tillers affected', 'Yield reduction'], ARRAY['Early sowing', 'Resistant varieties', 'Crop rotation', 'Proper spacing'], ARRAY['Chemical insecticides', 'Cultural practices', 'Biological control', 'Integrated management']),
    
    ('Pink Stem Borer', 'Sesamia inferens', 'Borer that damages wheat stems, causing lodging and yield loss', ARRAY['Wheat'], ARRAY['Lodging', 'Hollow stems', 'Dead hearts', 'Yield reduction'], ARRAY['Early sowing', 'Resistant varieties', 'Crop rotation', 'Proper fertilization'], ARRAY['Chemical control', 'Biological control', 'Cultural practices', 'Integrated management']),
    
    ('Grasshoppers', 'Hieroglyphus banian', 'Large insects that feed on wheat leaves and can cause severe defoliation', ARRAY['Wheat'], ARRAY['Defoliation', 'Irregular damage', 'Jumping insects', 'Mass feeding'], ARRAY['Early sowing', 'Crop rotation', 'Natural enemies', 'Resistant varieties'], ARRAY['Chemical control', 'Biological control', 'Cultural practices', 'Integrated management']);

  -- Insert wheat diseases
  INSERT INTO public.diseases (
    name,
    scientific_name,
    description,
    affected_crops,
    symptoms,
    prevention_methods,
    treatment_methods
  ) VALUES
    ('Yellow Rust', 'Puccinia striiformis', 'Fungal disease causing yellow-orange pustules on wheat leaves, reducing photosynthesis and yield', ARRAY['Wheat'], ARRAY['Yellow-orange pustules', 'Stripe pattern', 'Reduced photosynthesis', 'Yield loss'], ARRAY['Resistant varieties', 'Early sowing', 'Balanced fertilization', 'Crop rotation'], ARRAY['Fungicides', 'Cultural practices', 'Resistant varieties', 'Integrated management']),
    
    ('Brown Rust', 'Puccinia triticina', 'Fungal disease causing brown pustules on wheat leaves, affecting grain quality and yield', ARRAY['Wheat'], ARRAY['Brown pustules', 'Circular lesions', 'Leaf damage', 'Yield reduction'], ARRAY['Resistant varieties', 'Early sowing', 'Proper spacing', 'Crop rotation'], ARRAY['Fungicides', 'Cultural practices', 'Resistant varieties', 'Integrated management']),
    
    ('Powdery Mildew', 'Blumeria graminis', 'Fungal disease causing white powdery growth on wheat leaves and stems', ARRAY['Wheat'], ARRAY['White powdery growth', 'Leaf distortion', 'Reduced photosynthesis', 'Yield loss'], ARRAY['Resistant varieties', 'Proper spacing', 'Balanced fertilization', 'Crop rotation'], ARRAY['Fungicides', 'Cultural practices', 'Resistant varieties', 'Integrated management']),
    
    ('Loose Smut', 'Ustilago tritici', 'Fungal disease affecting wheat flowers, replacing grains with black spore masses', ARRAY['Wheat'], ARRAY['Black spore masses', 'Deformed heads', 'No grain formation', 'Complete yield loss'], ARRAY['Seed treatment', 'Certified seeds', 'Crop rotation', 'Resistant varieties'], ARRAY['Seed treatment', 'Cultural practices', 'Resistant varieties', 'Integrated management']),
    
    ('Karnal Bunt', 'Tilletia indica', 'Fungal disease affecting wheat grains, causing partial bunt and quality deterioration', ARRAY['Wheat'], ARRAY['Partial bunt', 'Fishy odor', 'Quality deterioration', 'Export restrictions'], ARRAY['Seed treatment', 'Crop rotation', 'Resistant varieties', 'Proper irrigation'], ARRAY['Seed treatment', 'Cultural practices', 'Resistant varieties', 'Integrated management']),
    
    ('Foot Rot', 'Fusarium graminearum', 'Fungal disease causing root and stem rot in wheat plants', ARRAY['Wheat'], ARRAY['Root rot', 'Stem rot', 'Wilting', 'Plant death'], ARRAY['Crop rotation', 'Proper drainage', 'Resistant varieties', 'Balanced fertilization'], ARRAY['Fungicides', 'Cultural practices', 'Resistant varieties', 'Integrated management']),
    
    ('Flag Smut', 'Urocystis tritici', 'Fungal disease affecting wheat leaves and stems, causing black streaks', ARRAY['Wheat'], ARRAY['Black streaks', 'Leaf distortion', 'Stunted growth', 'Yield reduction'], ARRAY['Seed treatment', 'Crop rotation', 'Resistant varieties', 'Proper spacing'], ARRAY['Seed treatment', 'Cultural practices', 'Resistant varieties', 'Integrated management']),
    
    ('Black Rust', 'Puccinia graminis', 'Fungal disease causing black pustules on wheat stems and leaves', ARRAY['Wheat'], ARRAY['Black pustules', 'Stem damage', 'Lodging', 'Severe yield loss'], ARRAY['Resistant varieties', 'Early sowing', 'Crop rotation', 'Proper spacing'], ARRAY['Fungicides', 'Cultural practices', 'Resistant varieties', 'Integrated management']);

  -- Insert wheat images
  INSERT INTO public.crop_images (
    crop_id,
    image_url,
    alt_text,
    caption,
    is_primary
  ) VALUES
    (wheat_crop_id, 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop', 'Wheat field at sunset', 'Golden wheat field ready for harvest', true),
    (wheat_crop_id, 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop', 'Wheat grains close-up', 'Healthy wheat grains showing good quality', false),
    (wheat_crop_id, 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop', 'Wheat plant structure', 'Wheat plant showing leaves, stem, and head', false);

END $$;

-- Display the inserted data for verification
SELECT 'Wheat crop data inserted successfully!' as status;

-- Show wheat crop details
SELECT 
  c.name,
  c.scientific_name,
  c.season,
  c.climate_type,
  c.water_requirement,
  c.growth_duration
FROM public.crops c 
WHERE c.name = 'Wheat';

-- Show wheat varieties
SELECT 
  v.name,
  v.duration,
  v.yield_potential,
  v.grain_quality,
  v.market_type,
  v.suitable_states
FROM public.varieties v
JOIN public.crops c ON v.crop_id = c.id
WHERE c.name = 'Wheat';

-- Show wheat pests
SELECT 
  p.name,
  p.scientific_name,
  p.affected_crops
FROM public.pests p
WHERE 'Wheat' = ANY(p.affected_crops);

-- Show wheat diseases
SELECT 
  d.name,
  d.scientific_name,
  d.affected_crops
FROM public.diseases d
WHERE 'Wheat' = ANY(d.affected_crops);
