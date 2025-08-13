import { CropTemplate, CropCategory, TemplateFieldGroup, ValidationRule } from '@/types/cropTemplates';

// Base template for all cereal crops (based on wheat)
export const cerealTemplate: CropTemplate = {
  id: 'cereal',
  name: 'Cereal Crops',
  description: 'Template for cereal crops like wheat, rice, maize, sorghum, and millets',
  category: 'cereal',
  icon: 'Wheat',
  color: 'yellow',
  baseFields: [
    // Basic Information (Required)
    'name', 'scientific_name', 'family', 'season', 'description', 'origin',
    
    // Morphology (Required)
    'growth_habit', 'life_span', 'plant_type', 'root_system', 'leaf', 'flowering_season',
    
    // Genetics (Required)
    'chromosome_number', 'breeding_methods',
    
    // Varieties (Required)
    'varieties',
    
    // Cultivation (Required)
    'land_preparation', 'sowing_time', 'spacing', 'planting_season',
    
    // Management (Required)
    'npk_n', 'npk_p', 'npk_k', 'water_quality',
    
    // Pests & Diseases (Required)
    'pest_name', 'disease_name',
    
    // Nutrition (Required)
    'calories', 'protein', 'carbohydrates', 'fiber',
    
    // Harvest (Required)
    'harvest_time', 'maturity_indicators', 'storage_conditions',
    
    // Market (Required)
    'average_yield', 'market_price', 'cost_of_cultivation'
  ],
  optionalFields: [
    // Advanced Morphology
    'inflorescence_type', 'fruit_type', 'fruit_development', 'unique_morphology', 'edible_part',
    
    // Advanced Genetics
    'biotech_advances', 'hybrid_varieties', 'patents', 'research_institutes',
    
    // Advanced Reproduction
    'pollination', 'propagation_type', 'planting_material', 'germination_percent',
    'rootstock_compatibility', 'nursery_practices', 'training_system',
    
    // Advanced Management
    'micronutrient_needs', 'biofertilizer_usage', 'application_schedule_method',
    'application_schedule_stages', 'application_schedule_frequency',
    
    // Climate & Soil
    'optimum_temp', 'tolerable_temp', 'altitude', 'soil_texture', 'light_requirement',
    
    // Weeds
    'common_weeds', 'weed_season', 'weed_control_method', 'critical_period_weed',
    
    // Additional Pests & Diseases
    'additional_pests', 'additional_diseases',
    
    // Disorders & Nematodes
    'disorder_name', 'nematode_name',
    
    // Advanced Nutrition
    'fat', 'vitamins', 'minerals', 'bioactive_compounds', 'health_benefits',
    
    // Advanced Harvest
    'harvesting_tools', 'post_harvest_losses', 'shelf_life', 'processed_products',
    'packaging_types', 'cold_chain', 'ripening_characteristics', 'pre_cooling',
    
    // Advanced Market
    'market_trends', 'export_potential', 'export_destinations', 'value_chain_players',
    'certifications',
    
    // Government
    'subsidies', 'schemes', 'support_agencies', 'required_certifications',
    
    // Technology
    'ai_ml_iot', 'smart_farming',
    
    // Cultural
    'religious_use', 'traditional_uses', 'gi_status', 'fun_fact',
    
    // Insights
    'key_takeaways', 'swot_strengths', 'swot_weaknesses', 'swot_opportunities', 'swot_threats',
    
    // Sustainability
    'sustainability_practices', 'innovations', 'climate_resilience'
  ],
  defaultValues: {
    family: 'Poaceae',
    plant_type: 'Annual',
    growth_habit: 'Erect',
    root_system: 'Fibrous',
    leaf: 'Linear',
    flowering_season: 'Spring/Summer',
    chromosome_number: '2n=14, 28, 42',
    breeding_methods: 'Pure line selection, Hybrid breeding',
    land_preparation: ['Deep ploughing', 'Harrowing', 'Planking', 'Leveling'],
    spacing: '20-30 cm row spacing',
    npk_n: '100-120 kg/ha',
    npk_p: '50-60 kg/ha',
    npk_k: '40-50 kg/ha',
    water_quality: 'Good quality water, avoid saline water',
    calories: '300-400 kcal',
    protein: '8-15%',
    carbohydrates: '65-75%',
    fiber: '8-12g',
    harvest_time: '120-150 days after sowing',
    maturity_indicators: 'Yellowing of leaves, Hard grains',
    storage_conditions: 'Cool, dry place, 12-14% moisture',
    average_yield: '25-45 q/ha',
    market_price: '₹2000-3000/quintal',
    cost_of_cultivation: '₹30000-50000/ha'
  }
};

// Field groups for better organization in admin interface
export const cerealFieldGroups: TemplateFieldGroup[] = [
  {
    name: 'Basic Information',
    fields: ['name', 'scientific_name', 'family', 'season', 'description', 'origin'],
    description: 'Essential crop identification and classification',
    required: true
  },
  {
    name: 'Morphology',
    fields: ['growth_habit', 'life_span', 'plant_type', 'root_system', 'leaf', 'flowering_season', 'inflorescence_type', 'fruit_type', 'fruit_development', 'unique_morphology', 'edible_part'],
    description: 'Physical structure and characteristics',
    required: false
  },
  {
    name: 'Genetics',
    fields: ['chromosome_number', 'breeding_methods', 'biotech_advances', 'hybrid_varieties', 'patents', 'research_institutes'],
    description: 'Breeding and biotechnology information',
    required: false
  },
  {
    name: 'Varieties',
    fields: ['varieties'],
    description: 'Different crop varieties and their details',
    required: true
  },
  {
    name: 'Cultivation',
    fields: ['land_preparation', 'sowing_time', 'spacing', 'planting_season'],
    description: 'Growing practices and techniques',
    required: true
  },
  {
    name: 'Management',
    fields: ['npk_n', 'npk_p', 'npk_k', 'micronutrient_needs', 'biofertilizer_usage', 'application_schedule_method', 'application_schedule_stages', 'application_schedule_frequency', 'water_quality'],
    description: 'Fertilizer and irrigation management',
    required: false
  },
  {
    name: 'Climate & Soil',
    fields: ['optimum_temp', 'tolerable_temp', 'altitude', 'soil_texture', 'light_requirement'],
    description: 'Environmental requirements',
    required: false
  },
  {
    name: 'Pests & Diseases',
    fields: ['pest_name', 'pest_symptoms', 'pest_life_cycle', 'pest_etl', 'pest_management', 'pest_biocontrol', 'disease_name', 'disease_causal_agent', 'disease_symptoms', 'disease_life_cycle', 'disease_management', 'disease_biocontrol', 'additional_pests', 'additional_diseases'],
    description: 'Pest and disease management',
    required: false
  },
  {
    name: 'Nutrition',
    fields: ['calories', 'protein', 'carbohydrates', 'fat', 'fiber', 'vitamins', 'minerals', 'bioactive_compounds', 'health_benefits'],
    description: 'Nutritional profile and health benefits',
    required: false
  },
  {
    name: 'Harvest',
    fields: ['harvest_time', 'maturity_indicators', 'harvesting_tools', 'post_harvest_losses', 'storage_conditions', 'shelf_life', 'processed_products', 'packaging_types', 'cold_chain', 'ripening_characteristics', 'pre_cooling'],
    description: 'Harvest timing and post-harvest management',
    required: false
  },
  {
    name: 'Market',
    fields: ['average_yield', 'market_price', 'cost_of_cultivation', 'market_trends', 'export_potential', 'export_destinations', 'value_chain_players', 'certifications'],
    description: 'Economics and market information',
    required: false
  },
  {
    name: 'Government',
    fields: ['subsidies', 'schemes', 'support_agencies', 'required_certifications'],
    description: 'Government support and policy',
    required: false
  },
  {
    name: 'Technology',
    fields: ['ai_ml_iot', 'smart_farming'],
    description: 'Technology and innovation',
    required: false
  },
  {
    name: 'Cultural',
    fields: ['religious_use', 'traditional_uses', 'gi_status', 'fun_fact'],
    description: 'Cultural and traditional significance',
    required: false
  },
  {
    name: 'Insights',
    fields: ['key_takeaways', 'swot_strengths', 'swot_weaknesses', 'swot_opportunities', 'swot_threats'],
    description: 'Analysis and key takeaways',
    required: false
  }
];

// Validation rules for cereal crops
export const cerealValidationRules: ValidationRule[] = [
  {
    field: 'name',
    type: 'required',
    message: 'Crop name is required'
  },
  {
    field: 'scientific_name',
    type: 'required',
    message: 'Scientific name is required'
  },
  {
    field: 'family',
    type: 'required',
    message: 'Family is required'
  },
  {
    field: 'season',
    type: 'required',
    message: 'At least one season is required'
  },
  {
    field: 'varieties',
    type: 'required',
    message: 'At least one variety is required'
  },
  {
    field: 'land_preparation',
    type: 'required',
    message: 'Land preparation steps are required'
  },
  {
    field: 'npk_n',
    type: 'required',
    message: 'Nitrogen requirement is required'
  },
  {
    field: 'average_yield',
    type: 'required',
    message: 'Average yield is required'
  }
];

// Complete cereal template configuration
export const cerealTemplateConfig = {
  template: cerealTemplate,
  fieldGroups: cerealFieldGroups,
  validationRules: cerealValidationRules
};

// Pulse crops template
export const pulseTemplate: CropTemplate = {
  id: 'pulse',
  name: 'Pulse Crops',
  description: 'Template for pulse crops like chickpea, lentil, mung bean, and pigeon pea',
  category: 'pulse',
  icon: 'Sprout',
  color: 'green',
  baseFields: [
    // Basic Information (Required)
    'name', 'scientific_name', 'family', 'season', 'description', 'origin',
    
    // Morphology (Required)
    'growth_habit', 'life_span', 'plant_type', 'root_system', 'leaf', 'flowering_season',
    
    // Genetics (Required)
    'chromosome_number', 'breeding_methods',
    
    // Varieties (Required)
    'varieties',
    
    // Cultivation (Required)
    'land_preparation', 'sowing_time', 'spacing', 'planting_season',
    
    // Management (Required)
    'npk_n', 'npk_p', 'npk_k', 'water_quality',
    
    // Pests & Diseases (Required)
    'pest_name', 'disease_name',
    
    // Nutrition (Required)
    'calories', 'protein', 'carbohydrates', 'fiber',
    
    // Harvest (Required)
    'harvest_time', 'maturity_indicators', 'storage_conditions',
    
    // Market (Required)
    'average_yield', 'market_price', 'cost_of_cultivation'
  ],
  optionalFields: [
    // Advanced Morphology
    'inflorescence_type', 'fruit_type', 'fruit_development', 'unique_morphology', 'edible_part',
    
    // Advanced Genetics
    'biotech_advances', 'hybrid_varieties', 'patents', 'research_institutes',
    
    // Advanced Reproduction
    'pollination', 'propagation_type', 'planting_material', 'germination_percent',
    'rootstock_compatibility', 'nursery_practices', 'training_system',
    
    // Advanced Management
    'micronutrient_needs', 'biofertilizer_usage', 'application_schedule_method',
    'application_schedule_stages', 'application_schedule_frequency',
    
    // Climate & Soil
    'optimum_temp', 'tolerable_temp', 'altitude', 'soil_texture', 'light_requirement',
    
    // Weeds
    'common_weeds', 'weed_season', 'weed_control_method', 'critical_period_weed',
    
    // Additional Pests & Diseases
    'additional_pests', 'additional_diseases',
    
    // Disorders & Nematodes
    'disorder_name', 'nematode_name',
    
    // Advanced Nutrition
    'fat', 'vitamins', 'minerals', 'bioactive_compounds', 'health_benefits',
    
    // Advanced Harvest
    'harvesting_tools', 'post_harvest_losses', 'shelf_life', 'processed_products',
    'packaging_types', 'cold_chain', 'ripening_characteristics', 'pre_cooling',
    
    // Advanced Market
    'market_trends', 'export_potential', 'export_destinations', 'value_chain_players',
    'certifications',
    
    // Government
    'subsidies', 'schemes', 'support_agencies', 'required_certifications',
    
    // Technology
    'ai_ml_iot', 'smart_farming',
    
    // Cultural
    'religious_use', 'traditional_uses', 'gi_status', 'fun_fact',
    
    // Insights
    'key_takeaways', 'swot_strengths', 'swot_weaknesses', 'swot_opportunities', 'swot_threats',
    
    // Sustainability
    'sustainability_practices', 'innovations', 'climate_resilience'
  ],
  defaultValues: {
    family: 'Fabaceae',
    plant_type: 'Annual',
    growth_habit: 'Erect/Climbing',
    root_system: 'Tap root with nodules',
    leaf: 'Compound',
    flowering_season: 'Spring/Summer',
    chromosome_number: '2n=14, 16, 22',
    breeding_methods: 'Pure line selection, Hybrid breeding',
    land_preparation: ['Deep ploughing', 'Harrowing', 'Planking', 'Leveling'],
    spacing: '30-45 cm row spacing',
    npk_n: '20-30 kg/ha',
    npk_p: '40-60 kg/ha',
    npk_k: '20-30 kg/ha',
    water_quality: 'Good quality water, avoid saline water',
    calories: '350-400 kcal',
    protein: '20-25%',
    carbohydrates: '60-65%',
    fiber: '15-20g',
    harvest_time: '90-120 days after sowing',
    maturity_indicators: 'Yellowing of leaves, Hard pods',
    storage_conditions: 'Cool, dry place, 12-14% moisture',
    average_yield: '15-25 q/ha',
    market_price: '₹4000-6000/quintal',
    cost_of_cultivation: '₹25000-35000/ha'
  }
};

// Export all templates
// Vegetable crops template
export const vegetableTemplate: CropTemplate = {
  id: 'vegetable',
  name: 'Vegetable Crops',
  description: 'Template for vegetable crops like tomato, potato, onion, and cabbage',
  category: 'vegetable',
  icon: 'Apple',
  color: 'emerald',
  baseFields: [
    // Basic Information (Required)
    'name', 'scientific_name', 'family', 'season', 'description', 'origin',
    
    // Morphology (Required)
    'growth_habit', 'life_span', 'plant_type', 'root_system', 'leaf', 'flowering_season',
    
    // Genetics (Required)
    'chromosome_number', 'breeding_methods',
    
    // Varieties (Required)
    'varieties',
    
    // Cultivation (Required)
    'land_preparation', 'sowing_time', 'spacing', 'planting_season',
    
    // Management (Required)
    'npk_n', 'npk_p', 'npk_k', 'water_quality',
    
    // Pests & Diseases (Required)
    'pest_name', 'disease_name',
    
    // Nutrition (Required)
    'calories', 'protein', 'carbohydrates', 'fiber',
    
    // Harvest (Required)
    'harvest_time', 'maturity_indicators', 'storage_conditions',
    
    // Market (Required)
    'average_yield', 'market_price', 'cost_of_cultivation'
  ],
  optionalFields: [
    // Advanced Morphology
    'inflorescence_type', 'fruit_type', 'fruit_development', 'unique_morphology', 'edible_part',
    
    // Advanced Genetics
    'biotech_advances', 'hybrid_varieties', 'patents', 'research_institutes',
    
    // Advanced Reproduction
    'pollination', 'propagation_type', 'planting_material', 'germination_percent',
    'rootstock_compatibility', 'nursery_practices', 'training_system',
    
    // Advanced Management
    'micronutrient_needs', 'biofertilizer_usage', 'application_schedule_method',
    'application_schedule_stages', 'application_schedule_frequency',
    
    // Climate & Soil
    'optimum_temp', 'tolerable_temp', 'altitude', 'soil_texture', 'light_requirement',
    
    // Weeds
    'common_weeds', 'weed_season', 'weed_control_method', 'critical_period_weed',
    
    // Additional Pests & Diseases
    'additional_pests', 'additional_diseases',
    
    // Disorders & Nematodes
    'disorder_name', 'nematode_name',
    
    // Advanced Nutrition
    'fat', 'vitamins', 'minerals', 'bioactive_compounds', 'health_benefits',
    
    // Advanced Harvest
    'harvesting_tools', 'post_harvest_losses', 'shelf_life', 'processed_products',
    'packaging_types', 'cold_chain', 'ripening_characteristics', 'pre_cooling',
    
    // Advanced Market
    'market_trends', 'export_potential', 'export_destinations', 'value_chain_players',
    'certifications',
    
    // Government
    'subsidies', 'schemes', 'support_agencies', 'required_certifications',
    
    // Technology
    'ai_ml_iot', 'smart_farming',
    
    // Cultural
    'religious_use', 'traditional_uses', 'gi_status', 'fun_fact',
    
    // Insights
    'key_takeaways', 'swot_strengths', 'swot_weaknesses', 'swot_opportunities', 'swot_threats',
    
    // Sustainability
    'sustainability_practices', 'innovations', 'climate_resilience'
  ],
  defaultValues: {
    family: 'Solanaceae/Brassicaceae/Amaryllidaceae',
    plant_type: 'Annual/Biennial',
    growth_habit: 'Erect/Spreading',
    root_system: 'Fibrous/Tap root',
    leaf: 'Simple/Compound',
    flowering_season: 'Spring/Summer',
    chromosome_number: '2n=14, 16, 18, 24',
    breeding_methods: 'Hybrid breeding, Pure line selection',
    land_preparation: ['Deep ploughing', 'Harrowing', 'Planking', 'Leveling', 'Bed preparation'],
    spacing: '45-60 cm row spacing',
    npk_n: '120-150 kg/ha',
    npk_p: '60-80 kg/ha',
    npk_k: '60-80 kg/ha',
    water_quality: 'Good quality water, regular irrigation',
    calories: '20-100 kcal',
    protein: '1-5%',
    carbohydrates: '3-20%',
    fiber: '2-8g',
    harvest_time: '60-120 days after sowing',
    maturity_indicators: 'Color change, Size, Firmness',
    storage_conditions: 'Cool storage, Controlled atmosphere',
    average_yield: '200-400 q/ha',
    market_price: '₹1000-5000/quintal',
    cost_of_cultivation: '₹80000-150000/ha'
  }
};

// Oilseed crops template
export const oilseedTemplate: CropTemplate = {
  id: 'oilseed',
  name: 'Oilseed Crops',
  description: 'Template for oilseed crops like groundnut, soybean, sunflower, and mustard',
  category: 'oilseed',
  icon: 'Leaf',
  color: 'blue',
  baseFields: [
    // Basic Information (Required)
    'name', 'scientific_name', 'family', 'season', 'description', 'origin',
    
    // Morphology (Required)
    'growth_habit', 'life_span', 'plant_type', 'root_system', 'leaf', 'flowering_season',
    
    // Genetics (Required)
    'chromosome_number', 'breeding_methods',
    
    // Varieties (Required)
    'varieties',
    
    // Cultivation (Required)
    'land_preparation', 'sowing_time', 'spacing', 'planting_season',
    
    // Management (Required)
    'npk_n', 'npk_p', 'npk_k', 'water_quality',
    
    // Pests & Diseases (Required)
    'pest_name', 'disease_name',
    
    // Nutrition (Required)
    'calories', 'protein', 'carbohydrates', 'fiber',
    
    // Harvest (Required)
    'harvest_time', 'maturity_indicators', 'storage_conditions',
    
    // Market (Required)
    'average_yield', 'market_price', 'cost_of_cultivation'
  ],
  optionalFields: [
    // Advanced Morphology
    'inflorescence_type', 'fruit_type', 'fruit_development', 'unique_morphology', 'edible_part',
    
    // Advanced Genetics
    'biotech_advances', 'hybrid_varieties', 'patents', 'research_institutes',
    
    // Advanced Reproduction
    'pollination', 'propagation_type', 'planting_material', 'germination_percent',
    'rootstock_compatibility', 'nursery_practices', 'training_system',
    
    // Advanced Management
    'micronutrient_needs', 'biofertilizer_usage', 'application_schedule_method',
    'application_schedule_stages', 'application_schedule_frequency',
    
    // Climate & Soil
    'optimum_temp', 'tolerable_temp', 'altitude', 'soil_texture', 'light_requirement',
    
    // Weeds
    'common_weeds', 'weed_season', 'weed_control_method', 'critical_period_weed',
    
    // Additional Pests & Diseases
    'additional_pests', 'additional_diseases',
    
    // Disorders & Nematodes
    'disorder_name', 'nematode_name',
    
    // Advanced Nutrition
    'fat', 'vitamins', 'minerals', 'bioactive_compounds', 'health_benefits',
    
    // Advanced Harvest
    'harvesting_tools', 'post_harvest_losses', 'shelf_life', 'processed_products',
    'packaging_types', 'cold_chain', 'ripening_characteristics', 'pre_cooling',
    
    // Advanced Market
    'market_trends', 'export_potential', 'export_destinations', 'value_chain_players',
    'certifications',
    
    // Government
    'subsidies', 'schemes', 'support_agencies', 'required_certifications',
    
    // Technology
    'ai_ml_iot', 'smart_farming',
    
    // Cultural
    'religious_use', 'traditional_uses', 'gi_status', 'fun_fact',
    
    // Insights
    'key_takeaways', 'swot_strengths', 'swot_weaknesses', 'swot_opportunities', 'swot_threats',
    
    // Sustainability
    'sustainability_practices', 'innovations', 'climate_resilience'
  ],
  defaultValues: {
    family: 'Fabaceae/Brassicaceae/Asteraceae',
    plant_type: 'Annual',
    growth_habit: 'Erect/Spreading',
    root_system: 'Tap root',
    leaf: 'Simple/Compound',
    flowering_season: 'Spring/Summer',
    chromosome_number: '2n=18, 20, 34, 38',
    breeding_methods: 'Hybrid breeding, Pure line selection',
    land_preparation: ['Deep ploughing', 'Harrowing', 'Planking', 'Leveling', 'Bed preparation'],
    spacing: '30-45 cm row spacing',
    npk_n: '80-120 kg/ha',
    npk_p: '60-80 kg/ha',
    npk_k: '40-60 kg/ha',
    water_quality: 'Good quality water, avoid saline water',
    calories: '500-600 kcal',
    protein: '18-25%',
    carbohydrates: '15-25%',
    fiber: '8-12g',
    harvest_time: '90-120 days after sowing',
    maturity_indicators: 'Yellowing of leaves, Hard seeds',
    storage_conditions: 'Cool, dry place, 8-10% moisture',
    average_yield: '20-35 q/ha',
    market_price: '₹5000-8000/quintal',
    cost_of_cultivation: '₹40000-60000/ha'
  }
};

// Fruit crops template
export const fruitTemplate: CropTemplate = {
  id: 'fruit',
  name: 'Fruit Crops',
  description: 'Template for fruit crops like mango, banana, apple, and orange',
  category: 'fruit',
  icon: 'Apple',
  color: 'red',
  baseFields: [
    // Basic Information (Required)
    'name', 'scientific_name', 'family', 'season', 'description', 'origin',
    
    // Morphology (Required)
    'growth_habit', 'life_span', 'plant_type', 'root_system', 'leaf', 'flowering_season',
    
    // Genetics (Required)
    'chromosome_number', 'breeding_methods',
    
    // Varieties (Required)
    'varieties',
    
    // Cultivation (Required)
    'land_preparation', 'sowing_time', 'spacing', 'planting_season',
    
    // Management (Required)
    'npk_n', 'npk_p', 'npk_k', 'water_quality',
    
    // Pests & Diseases (Required)
    'pest_name', 'disease_name',
    
    // Nutrition (Required)
    'calories', 'protein', 'carbohydrates', 'fiber',
    
    // Harvest (Required)
    'harvest_time', 'maturity_indicators', 'storage_conditions',
    
    // Market (Required)
    'average_yield', 'market_price', 'cost_of_cultivation'
  ],
  optionalFields: [
    // Advanced Morphology
    'inflorescence_type', 'fruit_type', 'fruit_development', 'unique_morphology', 'edible_part',
    
    // Advanced Genetics
    'biotech_advances', 'hybrid_varieties', 'patents', 'research_institutes',
    
    // Advanced Reproduction
    'pollination', 'propagation_type', 'planting_material', 'germination_percent',
    'rootstock_compatibility', 'nursery_practices', 'training_system',
    
    // Advanced Management
    'micronutrient_needs', 'biofertilizer_usage', 'application_schedule_method',
    'application_schedule_stages', 'application_schedule_frequency',
    
    // Climate & Soil
    'optimum_temp', 'tolerable_temp', 'altitude', 'soil_texture', 'light_requirement',
    
    // Weeds
    'common_weeds', 'weed_season', 'weed_control_method', 'critical_period_weed',
    
    // Additional Pests & Diseases
    'additional_pests', 'additional_diseases',
    
    // Disorders & Nematodes
    'disorder_name', 'nematode_name',
    
    // Advanced Nutrition
    'fat', 'vitamins', 'minerals', 'bioactive_compounds', 'health_benefits',
    
    // Advanced Harvest
    'harvesting_tools', 'post_harvest_losses', 'shelf_life', 'processed_products',
    'packaging_types', 'cold_chain', 'ripening_characteristics', 'pre_cooling',
    
    // Advanced Market
    'market_trends', 'export_potential', 'export_destinations', 'value_chain_players',
    'certifications',
    
    // Government
    'subsidies', 'schemes', 'support_agencies', 'required_certifications',
    
    // Technology
    'ai_ml_iot', 'smart_farming',
    
    // Cultural
    'religious_use', 'traditional_uses', 'gi_status', 'fun_fact',
    
    // Insights
    'key_takeaways', 'swot_strengths', 'swot_weaknesses', 'swot_opportunities', 'swot_threats',
    
    // Sustainability
    'sustainability_practices', 'innovations', 'climate_resilience'
  ],
  defaultValues: {
    family: 'Anacardiaceae/Musaceae/Rosaceae/Rutaceae',
    plant_type: 'Perennial',
    growth_habit: 'Tree/Shrub',
    root_system: 'Tap root',
    leaf: 'Simple/Compound',
    flowering_season: 'Spring/Summer',
    chromosome_number: '2n=14, 16, 18, 24, 34',
    breeding_methods: 'Hybrid breeding, Grafting, Tissue culture',
    land_preparation: ['Deep ploughing', 'Harrowing', 'Planking', 'Leveling', 'Pit preparation'],
    spacing: '6-12 m spacing',
    npk_n: '200-300 kg/ha',
    npk_p: '100-150 kg/ha',
    npk_k: '150-200 kg/ha',
    water_quality: 'Good quality water, regular irrigation',
    calories: '50-150 kcal',
    protein: '0.5-2%',
    carbohydrates: '10-25%',
    fiber: '2-8g',
    harvest_time: '3-8 years after planting',
    maturity_indicators: 'Color change, Size, Firmness, Aroma',
    storage_conditions: 'Cool storage, Controlled atmosphere, Cold chain',
    average_yield: '150-300 q/ha',
    market_price: '₹2000-8000/quintal',
    cost_of_cultivation: '₹150000-300000/ha'
  }
};

// Spice crops template
export const spiceTemplate: CropTemplate = {
  id: 'spice',
  name: 'Spice Crops',
  description: 'Template for spice crops like turmeric, ginger, black pepper, and cardamom',
  category: 'spice',
  icon: 'Zap',
  color: 'orange',
  baseFields: [
    // Basic Information (Required)
    'name', 'scientific_name', 'family', 'season', 'description', 'origin',
    
    // Morphology (Required)
    'growth_habit', 'life_span', 'plant_type', 'root_system', 'leaf', 'flowering_season',
    
    // Genetics (Required)
    'chromosome_number', 'breeding_methods',
    
    // Varieties (Required)
    'varieties',
    
    // Cultivation (Required)
    'land_preparation', 'sowing_time', 'spacing', 'planting_season',
    
    // Management (Required)
    'npk_n', 'npk_p', 'npk_k', 'water_quality',
    
    // Pests & Diseases (Required)
    'pest_name', 'disease_name',
    
    // Nutrition (Required)
    'calories', 'protein', 'carbohydrates', 'fiber',
    
    // Harvest (Required)
    'harvest_time', 'maturity_indicators', 'storage_conditions',
    
    // Market (Required)
    'average_yield', 'market_price', 'cost_of_cultivation'
  ],
  optionalFields: [
    // Advanced Morphology
    'inflorescence_type', 'fruit_type', 'fruit_development', 'unique_morphology', 'edible_part',
    
    // Advanced Genetics
    'biotech_advances', 'hybrid_varieties', 'patents', 'research_institutes',
    
    // Advanced Reproduction
    'pollination', 'propagation_type', 'planting_material', 'germination_percent',
    'rootstock_compatibility', 'nursery_practices', 'training_system',
    
    // Advanced Management
    'micronutrient_needs', 'biofertilizer_usage', 'application_schedule_method',
    'application_schedule_stages', 'application_schedule_frequency',
    
    // Climate & Soil
    'optimum_temp', 'tolerable_temp', 'altitude', 'soil_texture', 'light_requirement',
    
    // Weeds
    'common_weeds', 'weed_season', 'weed_control_method', 'critical_period_weed',
    
    // Additional Pests & Diseases
    'additional_pests', 'additional_diseases',
    
    // Disorders & Nematodes
    'disorder_name', 'nematode_name',
    
    // Advanced Nutrition
    'fat', 'vitamins', 'minerals', 'bioactive_compounds', 'health_benefits',
    
    // Advanced Harvest
    'harvesting_tools', 'post_harvest_losses', 'shelf_life', 'processed_products',
    'packaging_types', 'cold_chain', 'ripening_characteristics', 'pre_cooling',
    
    // Advanced Market
    'market_trends', 'export_potential', 'export_destinations', 'value_chain_players',
    'certifications',
    
    // Government
    'subsidies', 'schemes', 'support_agencies', 'required_certifications',
    
    // Technology
    'ai_ml_iot', 'smart_farming',
    
    // Cultural
    'religious_use', 'traditional_uses', 'gi_status', 'fun_fact',
    
    // Insights
    'key_takeaways', 'swot_strengths', 'swot_weaknesses', 'swot_opportunities', 'swot_threats',
    
    // Sustainability
    'sustainability_practices', 'innovations', 'climate_resilience'
  ],
  defaultValues: {
    family: 'Zingiberaceae/Piperaceae/Zingiberaceae',
    plant_type: 'Perennial',
    growth_habit: 'Herbaceous/Climbing',
    root_system: 'Rhizome/Tap root',
    leaf: 'Simple',
    flowering_season: 'Monsoon/Post-monsoon',
    chromosome_number: '2n=22, 24, 26, 52',
    breeding_methods: 'Clonal propagation, Tissue culture, Hybrid breeding',
    land_preparation: ['Deep ploughing', 'Harrowing', 'Planking', 'Leveling', 'Bed preparation'],
    spacing: '30-60 cm spacing',
    npk_n: '150-200 kg/ha',
    npk_p: '80-120 kg/ha',
    npk_k: '100-150 kg/ha',
    water_quality: 'Good quality water, regular irrigation',
    calories: '300-400 kcal',
    protein: '8-12%',
    carbohydrates: '60-70%',
    fiber: '15-20g',
    harvest_time: '8-10 months after planting',
    maturity_indicators: 'Yellowing of leaves, Rhizome size, Aroma',
    storage_conditions: 'Cool, dry place, 10-12% moisture',
    average_yield: '80-150 q/ha',
    market_price: '₹8000-15000/quintal',
    cost_of_cultivation: '₹80000-120000/ha'
  }
};

// Fiber crops template
export const fiberTemplate: CropTemplate = {
  id: 'fiber',
  name: 'Fiber Crops',
  description: 'Template for fiber crops like cotton, jute, hemp, and flax',
  category: 'fiber',
  icon: 'Scissors',
  color: 'purple',
  baseFields: [
    // Basic Information (Required)
    'name', 'scientific_name', 'family', 'season', 'description', 'origin',
    
    // Morphology (Required)
    'growth_habit', 'life_span', 'plant_type', 'root_system', 'leaf', 'flowering_season',
    
    // Genetics (Required)
    'chromosome_number', 'breeding_methods',
    
    // Varieties (Required)
    'varieties',
    
    // Cultivation (Required)
    'land_preparation', 'sowing_time', 'spacing', 'planting_season',
    
    // Management (Required)
    'npk_n', 'npk_p', 'npk_k', 'water_quality',
    
    // Pests & Diseases (Required)
    'pest_name', 'disease_name',
    
    // Nutrition (Required)
    'calories', 'protein', 'carbohydrates', 'fiber',
    
    // Harvest (Required)
    'harvest_time', 'maturity_indicators', 'storage_conditions',
    
    // Market (Required)
    'average_yield', 'market_price', 'cost_of_cultivation'
  ],
  optionalFields: [
    // Advanced Morphology
    'inflorescence_type', 'fruit_type', 'fruit_development', 'unique_morphology', 'edible_part',
    
    // Advanced Genetics
    'biotech_advances', 'hybrid_varieties', 'patents', 'research_institutes',
    
    // Advanced Reproduction
    'pollination', 'propagation_type', 'planting_material', 'germination_percent',
    'rootstock_compatibility', 'nursery_practices', 'training_system',
    
    // Advanced Management
    'micronutrient_needs', 'biofertilizer_usage', 'application_schedule_method',
    'application_schedule_stages', 'application_schedule_frequency',
    
    // Climate & Soil
    'optimum_temp', 'tolerable_temp', 'altitude', 'soil_texture', 'light_requirement',
    
    // Weeds
    'common_weeds', 'weed_season', 'weed_control_method', 'critical_period_weed',
    
    // Additional Pests & Diseases
    'additional_pests', 'additional_diseases',
    
    // Disorders & Nematodes
    'disorder_name', 'nematode_name',
    
    // Advanced Nutrition
    'fat', 'vitamins', 'minerals', 'bioactive_compounds', 'health_benefits',
    
    // Advanced Harvest
    'harvesting_tools', 'post_harvest_losses', 'shelf_life', 'processed_products',
    'packaging_types', 'cold_chain', 'ripening_characteristics', 'pre_cooling',
    
    // Advanced Market
    'market_trends', 'export_potential', 'export_destinations', 'value_chain_players',
    'certifications',
    
    // Government
    'subsidies', 'schemes', 'support_agencies', 'required_certifications',
    
    // Technology
    'ai_ml_iot', 'smart_farming',
    
    // Cultural
    'religious_use', 'traditional_uses', 'gi_status', 'fun_fact',
    
    // Insights
    'key_takeaways', 'swot_strengths', 'swot_weaknesses', 'swot_opportunities', 'swot_threats',
    
    // Sustainability
    'sustainability_practices', 'innovations', 'climate_resilience'
  ],
  defaultValues: {
    family: 'Malvaceae/Tiliaceae/Cannabaceae/Linaceae',
    plant_type: 'Annual',
    growth_habit: 'Erect/Climbing',
    root_system: 'Tap root',
    leaf: 'Simple/Palmate',
    flowering_season: 'Summer/Monsoon',
    chromosome_number: '2n=26, 28, 38, 30',
    breeding_methods: 'Hybrid breeding, Pure line selection, GMO',
    land_preparation: ['Deep ploughing', 'Harrowing', 'Planking', 'Leveling', 'Bed preparation'],
    spacing: '45-90 cm row spacing',
    npk_n: '120-180 kg/ha',
    npk_p: '60-90 kg/ha',
    npk_k: '60-90 kg/ha',
    water_quality: 'Good quality water, regular irrigation',
    calories: '200-300 kcal',
    protein: '5-10%',
    carbohydrates: '40-60%',
    fiber: '25-35g',
    harvest_time: '120-180 days after sowing',
    maturity_indicators: 'Boll opening, Fiber maturity, Color change',
    storage_conditions: 'Cool, dry place, 8-10% moisture',
    average_yield: '25-40 q/ha',
    market_price: '₹3000-6000/quintal',
    cost_of_cultivation: '₹50000-80000/ha'
  }
};

export const cropTemplates: CropTemplate[] = [
  cerealTemplate,
  pulseTemplate,
  vegetableTemplate,
  oilseedTemplate,
  fruitTemplate,
  spiceTemplate,
  fiberTemplate
];

// Helper function to get template by category
export const getTemplateByCategory = (category: CropCategory): CropTemplate | undefined => {
  return cropTemplates.find(template => template.category === category);
};

// Helper function to get template by ID
export const getTemplateById = (id: string): CropTemplate | undefined => {
  return cropTemplates.find(template => template.id === id);
};
