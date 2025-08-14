-- Add new columns to crops table for enhanced crop management
-- Migration: 20250101000000_add_crop_details_columns.sql

-- Basic Plant Identification
ALTER TABLE crops ADD COLUMN IF NOT EXISTS field_name TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS origin TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS climate_zone TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS growth_habit TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS life_span TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS plant_type TEXT;

-- Morphology & Anatomy
ALTER TABLE crops ADD COLUMN IF NOT EXISTS root_system TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS leaf TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS flowering_season TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS inflorescence_type TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS fruit_type TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS fruit_development TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS unique_morphology TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS edible_part TEXT;

-- Genetic Information
ALTER TABLE crops ADD COLUMN IF NOT EXISTS chromosome_number TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS breeding_methods TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS biotech_advances TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS hybrid_varieties TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS patents TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS research_institutes TEXT;

-- Reproductive Biology
ALTER TABLE crops ADD COLUMN IF NOT EXISTS pollination TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS propagation_type TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS planting_material TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS germination_percent TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS rootstock_compatibility TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS nursery_practices TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS training_system TEXT;

-- Cultivation Practices
ALTER TABLE crops ADD COLUMN IF NOT EXISTS spacing TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS planting_season TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS npk_n TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS npk_p TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS npk_k TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS micronutrient_needs TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS biofertilizer_usage TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS application_schedule_method TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS application_schedule_stages TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS application_schedule_frequency TEXT;

-- Climate & Soil Requirements
ALTER TABLE crops ADD COLUMN IF NOT EXISTS water_quality TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS optimum_temp TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS tolerable_temp TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS altitude TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS soil_texture TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS light_requirement TEXT;

-- Weed Management
ALTER TABLE crops ADD COLUMN IF NOT EXISTS common_weeds TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS weed_season TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS weed_control_method TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS critical_period_weed TEXT;

-- Pest Management
ALTER TABLE crops ADD COLUMN IF NOT EXISTS pest_name TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS pest_symptoms TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS pest_life_cycle TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS pest_etl TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS pest_management TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS pest_biocontrol TEXT;

-- Disease Management
ALTER TABLE crops ADD COLUMN IF NOT EXISTS disease_name TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS disease_causal_agent TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS disease_symptoms TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS disease_life_cycle TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS disease_management TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS disease_biocontrol TEXT;

-- Physiological Disorders
ALTER TABLE crops ADD COLUMN IF NOT EXISTS disorder_name TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS disorder_cause TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS disorder_symptoms TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS disorder_impact TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS disorder_control TEXT;

-- Nematode Management
ALTER TABLE crops ADD COLUMN IF NOT EXISTS nematode_name TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS nematode_symptoms TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS nematode_life_cycle TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS nematode_etl TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS nematode_management TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS nematode_biocontrol TEXT;

-- Nutritional Composition
ALTER TABLE crops ADD COLUMN IF NOT EXISTS calories TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS protein TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS carbohydrates TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS fat TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS fiber TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS vitamins TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS minerals TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS bioactive_compounds TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS health_benefits TEXT;

-- Varieties & Yield
ALTER TABLE crops ADD COLUMN IF NOT EXISTS variety_name TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS yield TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS variety_features TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS variety_suitability TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS market_demand TEXT;

-- Harvest & Post-Harvest
ALTER TABLE crops ADD COLUMN IF NOT EXISTS harvest_time TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS maturity_indicators TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS harvesting_tools TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS post_harvest_losses TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS storage_conditions TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS shelf_life TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS processed_products TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS packaging_types TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS cold_chain TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS ripening_characteristics TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS pre_cooling TEXT;

-- Market & Economics
ALTER TABLE crops ADD COLUMN IF NOT EXISTS market_trends TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS export_potential TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS export_destinations TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS value_chain_players TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS certifications TEXT;

-- Government Support & Policy
ALTER TABLE crops ADD COLUMN IF NOT EXISTS subsidies TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS schemes TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS support_agencies TEXT;

-- Technology & Innovation
ALTER TABLE crops ADD COLUMN IF NOT EXISTS ai_ml_iot TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS smart_farming TEXT;

-- Sustainability & Environment
ALTER TABLE crops ADD COLUMN IF NOT EXISTS sustainability_potential TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS waste_to_wealth TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS climate_resilience TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS carbon_footprint TEXT;

-- Cultural / Traditional Relevance
ALTER TABLE crops ADD COLUMN IF NOT EXISTS religious_use TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS traditional_uses TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS gi_status TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS fun_fact TEXT;

-- Insights & Analysis
ALTER TABLE crops ADD COLUMN IF NOT EXISTS key_takeaways TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS swot_strengths TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS swot_weaknesses TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS swot_opportunities TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS swot_threats TEXT;

-- Add comments for documentation
COMMENT ON COLUMN crops.field_name IS 'Field name or common name in local language';
COMMENT ON COLUMN crops.origin IS 'Origin or center of origin of the crop';
COMMENT ON COLUMN crops.climate_zone IS 'Preferred climate zone for cultivation';
COMMENT ON COLUMN crops.growth_habit IS 'Growth habit (annual, perennial, etc.)';
COMMENT ON COLUMN crops.life_span IS 'Life span of the plant';
COMMENT ON COLUMN crops.plant_type IS 'Type of plant (herb, shrub, tree, etc.)';
COMMENT ON COLUMN crops.root_system IS 'Type of root system';
COMMENT ON COLUMN crops.leaf IS 'Leaf characteristics';
COMMENT ON COLUMN crops.flowering_season IS 'Flowering season';
COMMENT ON COLUMN crops.inflorescence_type IS 'Type of inflorescence';
COMMENT ON COLUMN crops.fruit_type IS 'Type of fruit';
COMMENT ON COLUMN crops.fruit_development IS 'Fruit development process';
COMMENT ON COLUMN crops.unique_morphology IS 'Unique morphological features';
COMMENT ON COLUMN crops.edible_part IS 'Edible part of the plant';
COMMENT ON COLUMN crops.chromosome_number IS 'Chromosome number';
COMMENT ON COLUMN crops.breeding_methods IS 'Breeding methods used';
COMMENT ON COLUMN crops.biotech_advances IS 'Biotechnological advances';
COMMENT ON COLUMN crops.hybrid_varieties IS 'Hybrid varieties available';
COMMENT ON COLUMN crops.patents IS 'Patents or GI tags';
COMMENT ON COLUMN crops.research_institutes IS 'Research institutes working on this crop';
COMMENT ON COLUMN crops.pollination IS 'Pollination type and agents';
COMMENT ON COLUMN crops.propagation_type IS 'Propagation type (seed/vegetative)';
COMMENT ON COLUMN crops.planting_material IS 'Planting material used';
COMMENT ON COLUMN crops.germination_percent IS 'Germination or rooting percentage';
COMMENT ON COLUMN crops.rootstock_compatibility IS 'Rootstock compatibility';
COMMENT ON COLUMN crops.nursery_practices IS 'Nursery practices';
COMMENT ON COLUMN crops.training_system IS 'Training system used';
COMMENT ON COLUMN crops.spacing IS 'Recommended spacing';
COMMENT ON COLUMN crops.planting_season IS 'Planting season';
COMMENT ON COLUMN crops.npk_n IS 'NPK recommendation - Nitrogen';
COMMENT ON COLUMN crops.npk_p IS 'NPK recommendation - Phosphorus';
COMMENT ON COLUMN crops.npk_k IS 'NPK recommendation - Potassium';
COMMENT ON COLUMN crops.micronutrient_needs IS 'Micronutrient requirements';
COMMENT ON COLUMN crops.biofertilizer_usage IS 'Biofertilizer usage';
COMMENT ON COLUMN crops.application_schedule_method IS 'Application schedule method';
COMMENT ON COLUMN crops.application_schedule_stages IS 'Application schedule critical stages';
COMMENT ON COLUMN crops.application_schedule_frequency IS 'Application schedule frequency';
COMMENT ON COLUMN crops.water_quality IS 'Water quality considerations';
COMMENT ON COLUMN crops.optimum_temp IS 'Optimum temperature range';
COMMENT ON COLUMN crops.tolerable_temp IS 'Tolerable temperature range';
COMMENT ON COLUMN crops.altitude IS 'Altitude requirements';
COMMENT ON COLUMN crops.soil_texture IS 'Soil texture requirements';
COMMENT ON COLUMN crops.light_requirement IS 'Light requirement';
COMMENT ON COLUMN crops.common_weeds IS 'Common weeds affecting this crop';
COMMENT ON COLUMN crops.weed_season IS 'Weed season';
COMMENT ON COLUMN crops.weed_control_method IS 'Weed control methods';
COMMENT ON COLUMN crops.critical_period_weed IS 'Critical period for weed competition';
COMMENT ON COLUMN crops.pest_name IS 'Major pest name';
COMMENT ON COLUMN crops.pest_symptoms IS 'Pest symptoms';
COMMENT ON COLUMN crops.pest_life_cycle IS 'Pest life cycle';
COMMENT ON COLUMN crops.pest_etl IS 'Economic threshold level for pest';
COMMENT ON COLUMN crops.pest_management IS 'Pest management strategies';
COMMENT ON COLUMN crops.pest_biocontrol IS 'Biocontrol agents for pest';
COMMENT ON COLUMN crops.disease_name IS 'Major disease name';
COMMENT ON COLUMN crops.disease_causal_agent IS 'Disease causal agent';
COMMENT ON COLUMN crops.disease_symptoms IS 'Disease symptoms';
COMMENT ON COLUMN crops.disease_life_cycle IS 'Disease life cycle';
COMMENT ON COLUMN crops.disease_management IS 'Disease management strategies';
COMMENT ON COLUMN crops.disease_biocontrol IS 'Biocontrol agents for disease';
COMMENT ON COLUMN crops.disorder_name IS 'Physiological disorder name';
COMMENT ON COLUMN crops.disorder_cause IS 'Disorder cause';
COMMENT ON COLUMN crops.disorder_symptoms IS 'Disorder symptoms';
COMMENT ON COLUMN crops.disorder_impact IS 'Impact on yield/quality';
COMMENT ON COLUMN crops.disorder_control IS 'Disorder control measures';
COMMENT ON COLUMN crops.nematode_name IS 'Nematode name';
COMMENT ON COLUMN crops.nematode_symptoms IS 'Nematode symptoms';
COMMENT ON COLUMN crops.nematode_life_cycle IS 'Nematode life cycle';
COMMENT ON COLUMN crops.nematode_etl IS 'Economic threshold level for nematode';
COMMENT ON COLUMN crops.nematode_management IS 'Nematode management strategies';
COMMENT ON COLUMN crops.nematode_biocontrol IS 'Biocontrol agents for nematode';
COMMENT ON COLUMN crops.calories IS 'Calories per 100g';
COMMENT ON COLUMN crops.protein IS 'Protein content';
COMMENT ON COLUMN crops.carbohydrates IS 'Carbohydrate content';
COMMENT ON COLUMN crops.fat IS 'Fat content';
COMMENT ON COLUMN crops.fiber IS 'Fiber content';
COMMENT ON COLUMN crops.vitamins IS 'Vitamin content';
COMMENT ON COLUMN crops.minerals IS 'Mineral content';
COMMENT ON COLUMN crops.bioactive_compounds IS 'Bioactive compounds';
COMMENT ON COLUMN crops.health_benefits IS 'Health benefits';
COMMENT ON COLUMN crops.variety_name IS 'Variety name';
COMMENT ON COLUMN crops.yield IS 'Yield per plant/acre';
COMMENT ON COLUMN crops.variety_features IS 'Variety features';
COMMENT ON COLUMN crops.variety_suitability IS 'Variety suitability';
COMMENT ON COLUMN crops.market_demand IS 'Market demand/popularity';
COMMENT ON COLUMN crops.harvest_time IS 'Harvest time';
COMMENT ON COLUMN crops.maturity_indicators IS 'Maturity indicators';
COMMENT ON COLUMN crops.harvesting_tools IS 'Harvesting tools';
COMMENT ON COLUMN crops.post_harvest_losses IS 'Post-harvest losses percentage';
COMMENT ON COLUMN crops.storage_conditions IS 'Storage conditions';
COMMENT ON COLUMN crops.shelf_life IS 'Shelf life';
COMMENT ON COLUMN crops.processed_products IS 'Processed products';
COMMENT ON COLUMN crops.packaging_types IS 'Packaging types';
COMMENT ON COLUMN crops.cold_chain IS 'Cold chain requirements';
COMMENT ON COLUMN crops.ripening_characteristics IS 'Ripening characteristics';
COMMENT ON COLUMN crops.pre_cooling IS 'Pre-cooling requirements';
COMMENT ON COLUMN crops.market_trends IS 'Current market trends';
COMMENT ON COLUMN crops.export_potential IS 'Export potential';
COMMENT ON COLUMN crops.export_destinations IS 'Export destinations';
COMMENT ON COLUMN crops.value_chain_players IS 'Value chain players';
COMMENT ON COLUMN crops.certifications IS 'Required certifications';
COMMENT ON COLUMN crops.subsidies IS 'Available subsidies';
COMMENT ON COLUMN crops.schemes IS 'Applicable schemes';
COMMENT ON COLUMN crops.support_agencies IS 'Support agencies';
COMMENT ON COLUMN crops.ai_ml_iot IS 'AI/ML/IoT use cases';
COMMENT ON COLUMN crops.smart_farming IS 'Smart farming scope';
COMMENT ON COLUMN crops.sustainability_potential IS 'Sustainability potential';
COMMENT ON COLUMN crops.waste_to_wealth IS 'Waste-to-wealth ideas';
COMMENT ON COLUMN crops.climate_resilience IS 'Climate change resilience';
COMMENT ON COLUMN crops.carbon_footprint IS 'Carbon footprint';
COMMENT ON COLUMN crops.religious_use IS 'Religious/cultural use';
COMMENT ON COLUMN crops.traditional_uses IS 'Traditional uses';
COMMENT ON COLUMN crops.gi_status IS 'GI status';
COMMENT ON COLUMN crops.fun_fact IS 'Fun fact/trivia';
COMMENT ON COLUMN crops.key_takeaways IS 'Key takeaways';
COMMENT ON COLUMN crops.swot_strengths IS 'SWOT analysis - Strengths';
COMMENT ON COLUMN crops.swot_weaknesses IS 'SWOT analysis - Weaknesses';
COMMENT ON COLUMN crops.swot_opportunities IS 'SWOT analysis - Opportunities';
COMMENT ON COLUMN crops.swot_threats IS 'SWOT analysis - Threats'; 