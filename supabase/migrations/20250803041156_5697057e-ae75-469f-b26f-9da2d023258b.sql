-- Phase 1: Create proper foreign key relationships and update schema

-- First, let's create a junction table for crop-pest relationships
CREATE TABLE public.crop_pests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crop_id UUID NOT NULL REFERENCES public.crops(id) ON DELETE CASCADE,
  pest_id UUID NOT NULL REFERENCES public.pests(id) ON DELETE CASCADE,
  severity_level TEXT DEFAULT 'medium', -- low, medium, high, critical
  occurrence_frequency TEXT DEFAULT 'occasional', -- rare, occasional, common, very_common
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(crop_id, pest_id)
);

-- Create a junction table for crop-disease relationships
CREATE TABLE public.crop_diseases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crop_id UUID NOT NULL REFERENCES public.crops(id) ON DELETE CASCADE,
  disease_id UUID NOT NULL REFERENCES public.diseases(id) ON DELETE CASCADE,
  severity_level TEXT DEFAULT 'medium', -- low, medium, high, critical
  occurrence_frequency TEXT DEFAULT 'occasional', -- rare, occasional, common, very_common
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(crop_id, disease_id)
);

-- Enable RLS on the new tables
ALTER TABLE public.crop_pests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_diseases ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (matching existing pattern)
CREATE POLICY "Public access to crop_pests" 
ON public.crop_pests 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Public access to crop_diseases" 
ON public.crop_diseases 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Add more detailed columns to varieties table
ALTER TABLE public.varieties ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.varieties ADD COLUMN IF NOT EXISTS maturity_group TEXT;
ALTER TABLE public.varieties ADD COLUMN IF NOT EXISTS plant_height TEXT;
ALTER TABLE public.varieties ADD COLUMN IF NOT EXISTS seed_color TEXT;
ALTER TABLE public.varieties ADD COLUMN IF NOT EXISTS stress_tolerance JSONB;
ALTER TABLE public.varieties ADD COLUMN IF NOT EXISTS agronomic_traits JSONB;
ALTER TABLE public.varieties ADD COLUMN IF NOT EXISTS recommended_regions TEXT[];
ALTER TABLE public.varieties ADD COLUMN IF NOT EXISTS breeder_info TEXT;
ALTER TABLE public.varieties ADD COLUMN IF NOT EXISTS release_year INTEGER;
ALTER TABLE public.varieties ADD COLUMN IF NOT EXISTS parentage TEXT;