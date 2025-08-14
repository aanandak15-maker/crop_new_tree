export interface CropTemplate {
  id: string;
  name: string;
  description: string;
  category: CropCategory;
  baseFields: string[]; // Required fields for this crop type
  optionalFields: string[]; // Optional fields
  defaultValues: Partial<CropData>; // Pre-filled common values
  icon: string; // Icon name for the template
  color: string; // Primary color for the template
}

export type CropCategory = 
  | 'cereal' 
  | 'pulse' 
  | 'oilseed' 
  | 'vegetable' 
  | 'fruit' 
  | 'spice' 
  | 'fiber' 
  | 'medicinal'
  | 'ornamental';

export interface CropData {
  // Basic Information
  id: string;
  name: string;
  scientific_name: string;
  family: string;
  season: string[];
  description?: string;
  origin?: string;
  
  // Morphology
  field_name?: string;
  climate_zone?: string;
  growth_habit?: string;
  life_span?: string;
  plant_type?: string;
  root_system?: string;
  leaf?: string;
  flowering_season?: string;
  inflorescence_type?: string;
  fruit_type?: string;
  fruit_development?: string;
  unique_morphology?: string;
  edible_part?: string;
  
  // Genetics
  chromosome_number?: string;
  breeding_methods?: string;
  biotech_advances?: string;
  hybrid_varieties?: string;
  patents?: string;
  research_institutes?: string;
  
  // Reproduction
  pollination?: string;
  propagation_type?: string;
  planting_material?: string;
  germination_percent?: string;
  rootstock_compatibility?: string;
  nursery_practices?: string;
  training_system?: string;
  
  // Varieties
  varieties?: CropVariety[];
  
  // Cultivation
  land_preparation?: string[];
  sowing_time?: string;
  spacing?: string;
  planting_season?: string;
  
  // Management
  npk_n?: string;
  npk_p?: string;
  npk_k?: string;
  micronutrient_needs?: string;
  biofertilizer_usage?: string;
  application_schedule_method?: string;
  application_schedule_stages?: string;
  application_schedule_frequency?: string;
  water_quality?: string;
  
  // Climate & Soil
  optimum_temp?: string;
  tolerable_temp?: string;
  altitude?: string;
  soil_texture?: string;
  light_requirement?: string;
  
  // Weeds
  common_weeds?: string;
  weed_season?: string;
  weed_control_method?: string;
  critical_period_weed?: string;
  
  // Pests & Diseases
  pest_name?: string;
  pest_symptoms?: string;
  pest_life_cycle?: string;
  pest_etl?: string;
  pest_management?: string;
  pest_biocontrol?: string;
  pest_image?: string;
  
  disease_name?: string;
  disease_causal_agent?: string;
  disease_symptoms?: string;
  disease_life_cycle?: string;
  disease_management?: string;
  disease_biocontrol?: string;
  disease_image?: string;
  
  // Additional Pests & Diseases
  additional_pests?: Array<{
    name: string;
    symptoms: string;
    lifeCycle: string;
    etl: string;
    management: string;
    biocontrol: string;
    image: string;
  }>;
  
  additional_diseases?: Array<{
    causalAgent: string;
    symptoms: string;
    lifeCycle: string;
    management: string;
    biocontrol: string;
    image: string;
  }>;
  
  // Disorders & Nematodes
  disorder_name?: string;
  disorder_cause?: string;
  disorder_symptoms?: string;
  disorder_impact?: string;
  disorder_control?: string;
  disorder_image?: string;
  
  nematode_name?: string;
  nematode_symptoms?: string;
  nematode_life_cycle?: string;
  nematode_etl?: string;
  nematode_management?: string;
  nematode_biocontrol?: string;
  nematode_image?: string;
  
  // Nutrition
  nutritional_info?: string;
  calories?: string;
  protein?: string;
  carbohydrates?: string;
  fat?: string;
  fiber?: string;
  vitamins?: string[];
  minerals?: string[];
  bioactive_compounds?: string;
  health_benefits?: string;
  
  // Harvest
  harvest_time?: string;
  maturity_indicators?: string;
  harvesting_tools?: string;
  post_harvest_losses?: string;
  storage_conditions?: string;
  shelf_life?: string;
  processed_products?: string;
  packaging_types?: string;
  cold_chain?: string;
  ripening_characteristics?: string;
  pre_cooling?: string;
  
  // Market
  average_yield?: string;
  market_price?: string;
  cost_of_cultivation?: string;
  market_trends?: string;
  export_potential?: string;
  export_destinations?: string;
  value_chain_players?: string;
  certifications?: string;
  
  // Government
  subsidies?: string;
  schemes?: string;
  support_agencies?: string;
  required_certifications?: string;
  
  // Technology
  ai_ml_iot?: string;
  smart_farming?: string;
  
  // Cultural
  religious_use?: string;
  traditional_uses?: string;
  gi_status?: string;
  fun_fact?: string;
  
  // Insights
  key_takeaways?: string;
  swot_strengths?: string;
  swot_weaknesses?: string;
  swot_opportunities?: string;
  swot_threats?: string;
  
  // Sustainability
  sustainability_practices?: string[];
  innovations?: string[];
  climate_resilience?: string[];
}

export interface CropVariety {
  id: string;
  name: string;
  duration: string;
  yield: string;
  states: string[];
  resistance: string[];
  characteristics: string[];
  late_sowing_suitable: boolean;
  irrigation_responsive: boolean;
  certified_seed_available: boolean;
  grain_quality: string;
  zone: string;
  premium_market: boolean;
  variety_name?: string;
  variety_features?: string;
  variety_suitability?: string;
  market_demand?: string;
}

// Template field categories for better organization
export interface TemplateFieldGroup {
  name: string;
  fields: string[];
  description: string;
  required: boolean;
}

export interface CropTemplateConfig {
  template: CropTemplate;
  fieldGroups: TemplateFieldGroup[];
  validationRules: ValidationRule[];
}

export interface ValidationRule {
  field: string;
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
}
