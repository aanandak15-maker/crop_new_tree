-- Add missing columns to crops table for AI-extracted data
-- Migration: 20250808000000_add_missing_crop_columns.sql

-- Add missing columns that are in ExtractedCropData interface
ALTER TABLE crops ADD COLUMN IF NOT EXISTS confidence_score DECIMAL(3,2);
ALTER TABLE crops ADD COLUMN IF NOT EXISTS source_document TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS extraction_notes TEXT;

-- Add comments for documentation
COMMENT ON COLUMN crops.confidence_score IS 'AI confidence score for extracted data (0.0 to 1.0)';
COMMENT ON COLUMN crops.source_document IS 'Source document filename for extracted data';
COMMENT ON COLUMN crops.extraction_notes IS 'Notes about the extraction process and confidence';
