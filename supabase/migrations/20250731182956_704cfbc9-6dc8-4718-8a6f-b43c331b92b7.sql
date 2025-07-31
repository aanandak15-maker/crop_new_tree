-- Create crops table
CREATE TABLE public.crops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  scientific_name TEXT,
  description TEXT,
  season TEXT[],
  climate_type TEXT[],
  soil_type TEXT[],
  water_requirement TEXT,
  growth_duration TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create varieties table
CREATE TABLE public.varieties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crop_id UUID NOT NULL REFERENCES public.crops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  duration TEXT,
  yield_potential TEXT,
  grain_quality TEXT,
  market_type TEXT,
  suitable_states TEXT[],
  disease_resistance TEXT[],
  special_features TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pests table
CREATE TABLE public.pests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  scientific_name TEXT,
  description TEXT,
  affected_crops TEXT[],
  symptoms TEXT[],
  prevention_methods TEXT[],
  treatment_methods TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create diseases table
CREATE TABLE public.diseases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  scientific_name TEXT,
  description TEXT,
  affected_crops TEXT[],
  symptoms TEXT[],
  prevention_methods TEXT[],
  treatment_methods TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create crop_images table
CREATE TABLE public.crop_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crop_id UUID NOT NULL REFERENCES public.crops(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create variety_images table
CREATE TABLE public.variety_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  variety_id UUID NOT NULL REFERENCES public.varieties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pest_images table
CREATE TABLE public.pest_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pest_id UUID NOT NULL REFERENCES public.pests(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create disease_images table
CREATE TABLE public.disease_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  disease_id UUID NOT NULL REFERENCES public.diseases(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (public access for admin interface)
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.varieties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variety_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pest_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_images ENABLE ROW LEVEL SECURITY;

-- Create public access policies (since you want direct access without auth)
CREATE POLICY "Public access to crops" ON public.crops FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access to varieties" ON public.varieties FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access to pests" ON public.pests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access to diseases" ON public.diseases FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access to crop_images" ON public.crop_images FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access to variety_images" ON public.variety_images FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access to pest_images" ON public.pest_images FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access to disease_images" ON public.disease_images FOR ALL USING (true) WITH CHECK (true);

-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public) VALUES ('crop-images', 'crop-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('variety-images', 'variety-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('pest-images', 'pest-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('disease-images', 'disease-images', true);

-- Create storage policies for public access
CREATE POLICY "Public access to crop images" ON storage.objects FOR ALL USING (bucket_id = 'crop-images') WITH CHECK (bucket_id = 'crop-images');
CREATE POLICY "Public access to variety images" ON storage.objects FOR ALL USING (bucket_id = 'variety-images') WITH CHECK (bucket_id = 'variety-images');
CREATE POLICY "Public access to pest images" ON storage.objects FOR ALL USING (bucket_id = 'pest-images') WITH CHECK (bucket_id = 'pest-images');
CREATE POLICY "Public access to disease images" ON storage.objects FOR ALL USING (bucket_id = 'disease-images') WITH CHECK (bucket_id = 'disease-images');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_crops_updated_at BEFORE UPDATE ON public.crops FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_varieties_updated_at BEFORE UPDATE ON public.varieties FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pests_updated_at BEFORE UPDATE ON public.pests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_diseases_updated_at BEFORE UPDATE ON public.diseases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();