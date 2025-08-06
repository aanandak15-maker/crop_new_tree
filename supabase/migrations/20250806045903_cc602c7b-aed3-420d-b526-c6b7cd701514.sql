-- Performance optimization: Add indexes for better query performance

-- Index for crops table - frequently queried fields
CREATE INDEX IF NOT EXISTS idx_crops_name ON crops(name);
CREATE INDEX IF NOT EXISTS idx_crops_season ON crops USING GIN(season);
CREATE INDEX IF NOT EXISTS idx_crops_climate_type ON crops USING GIN(climate_type);
CREATE INDEX IF NOT EXISTS idx_crops_soil_type ON crops USING GIN(soil_type);
CREATE INDEX IF NOT EXISTS idx_crops_created_at ON crops(created_at);

-- Index for varieties table
CREATE INDEX IF NOT EXISTS idx_varieties_crop_id ON varieties(crop_id);
CREATE INDEX IF NOT EXISTS idx_varieties_name ON varieties(name);
CREATE INDEX IF NOT EXISTS idx_varieties_release_year ON varieties(release_year);
CREATE INDEX IF NOT EXISTS idx_varieties_suitable_states ON varieties USING GIN(suitable_states);

-- Index for pests table
CREATE INDEX IF NOT EXISTS idx_pests_name ON pests(name);
CREATE INDEX IF NOT EXISTS idx_pests_affected_crops ON pests USING GIN(affected_crops);
CREATE INDEX IF NOT EXISTS idx_pests_created_at ON pests(created_at);

-- Index for diseases table
CREATE INDEX IF NOT EXISTS idx_diseases_name ON diseases(name);
CREATE INDEX IF NOT EXISTS idx_diseases_affected_crops ON diseases USING GIN(affected_crops);
CREATE INDEX IF NOT EXISTS idx_diseases_created_at ON diseases(created_at);

-- Index for crop_pests junction table
CREATE INDEX IF NOT EXISTS idx_crop_pests_crop_id ON crop_pests(crop_id);
CREATE INDEX IF NOT EXISTS idx_crop_pests_pest_id ON crop_pests(pest_id);
CREATE INDEX IF NOT EXISTS idx_crop_pests_severity ON crop_pests(severity_level);

-- Index for crop_diseases junction table
CREATE INDEX IF NOT EXISTS idx_crop_diseases_crop_id ON crop_diseases(crop_id);
CREATE INDEX IF NOT EXISTS idx_crop_diseases_disease_id ON crop_diseases(disease_id);
CREATE INDEX IF NOT EXISTS idx_crop_diseases_severity ON crop_diseases(severity_level);

-- Index for image tables
CREATE INDEX IF NOT EXISTS idx_crop_images_crop_id ON crop_images(crop_id);
CREATE INDEX IF NOT EXISTS idx_crop_images_is_primary ON crop_images(is_primary);
CREATE INDEX IF NOT EXISTS idx_variety_images_variety_id ON variety_images(variety_id);
CREATE INDEX IF NOT EXISTS idx_variety_images_is_primary ON variety_images(is_primary);
CREATE INDEX IF NOT EXISTS idx_pest_images_pest_id ON pest_images(pest_id);
CREATE INDEX IF NOT EXISTS idx_pest_images_is_primary ON pest_images(is_primary);
CREATE INDEX IF NOT EXISTS idx_disease_images_disease_id ON disease_images(disease_id);
CREATE INDEX IF NOT EXISTS idx_disease_images_is_primary ON disease_images(is_primary);

-- Create composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_crops_season_climate ON crops USING GIN(season, climate_type);
CREATE INDEX IF NOT EXISTS idx_varieties_crop_release ON varieties(crop_id, release_year);

-- Performance improvement: Update statistics
ANALYZE crops;
ANALYZE varieties;
ANALYZE pests;
ANALYZE diseases;
ANALYZE crop_pests;
ANALYZE crop_diseases;