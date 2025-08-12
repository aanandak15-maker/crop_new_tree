// Comprehensive Wheat Data for Testing Dashboard Features
// This object contains all possible wheat data fields that the dashboard can display

export const comprehensiveWheatData = {
  // Basic Information
  id: "wheat-comprehensive",
  name: "Wheat",
  scientific_name: "Triticum aestivum",
  family: "Poaceae (Gramineae)",
  season: ["Rabi", "Winter"],
  description: "Wheat is one of the world's most important cereal crops, providing essential nutrition and serving as a staple food for billions of people globally. It is the second most-produced cereal after maize and the most important food grain in terms of human consumption.",
  origin: "Fertile Crescent (Middle East) - domesticated around 10,000 years ago",
  
  // Climate & Environment
  climate_type: ["Temperate", "Subtropical", "Mediterranean"],
  temperature: "15-25°C (optimal), 10-35°C (tolerance range)",
  rainfall: "500-700mm annually, 400-800mm acceptable",
  humidity: "50-70% during growing season",
  climate_zone: "Temperate and subtropical regions",
  optimum_temp: "20-25°C during vegetative growth, 15-20°C during grain filling",
  tolerable_temp: "5-35°C (survival range)",
  altitude: "0-3000m above sea level (varies by variety)",
  
  // Soil Requirements
  soil_type: ["Well-drained loamy", "Clay loam", "Sandy loam", "Alluvial soils"],
  soil_ph: "6.0-7.5 (optimal), 5.5-8.0 (tolerance range)",
  soil_drainage: "Good drainage essential, waterlogging harmful",
  soil_texture: "Medium to fine textured soils preferred",
  light_requirement: "Full sunlight (6-8 hours daily)",
  
  // Growth Characteristics
  growth_duration: "120-150 days",
  plant_type: "Monocotyledonous, C3 plant",
  growth_habit: "Annual, erect, tufted grass",
  life_span: "Annual (120-150 days)",
  root_system: "Fibrous root system, 1-2m deep",
  leaf_characteristics: "Linear, alternate, parallel-veined, 15-30cm long",
  flowering_season: "Spring (February-March in India)",
  inflorescence_type: "Spike (ear or head)",
  fruit_type: "Caryopsis (grain)",
  fruit_development: "Single-seeded, dry, indehiscent",
  unique_morphology: "Hollow stems (culms), ligules present, auricles variable",
  edible_part: "Grain (endosperm, germ, bran)",
  
  // Genetics & Breeding
  chromosome_number: "2n=42 (hexaploid)",
  breeding_methods: "Pedigree, bulk, single seed descent, doubled haploid",
  biotech_advances: "Marker-assisted selection, genetic transformation, genome editing",
  hybrid_varieties: "Limited due to self-pollination, cytoplasmic male sterility used",
  patents: true,
  research_institutes: "CIMMYT, ICAR, IARI, State Agricultural Universities",
  
  // Reproduction & Propagation
  pollination: "Self-pollinating (cleistogamous)",
  propagation_type: "Sexual (seed)",
  planting_material: "Certified seeds",
  germination_percent: "85-95% under optimal conditions",
  rootstock_compatibility: "Not applicable (annual crop)",
  
  // Water Requirements
  water_requirement: "Medium to High (500-700mm annually)",
  irrigation_critical_stages: [
    "Crown root initiation (20-25 DAS) - Critical",
    "Tillering (40-45 DAS) - Important",
    "Jointing (60-65 DAS) - Critical",
    "Flowering (80-85 DAS) - Critical",
    "Milk stage (100-105 DAS) - Critical",
    "Dough stage (115-120 DAS) - Important"
  ],
  total_water_requirement: "400-500mm",
  
  // Priority & Status
  priority_level: "High",
  gi_status: true,
  ai_ml_iot: true,
  
  // Economics & Market
  average_yield: "32 q/ha (National average), 45-50 q/ha (Potential)",
  yield_potential: "45-55 q/ha under optimal conditions",
  market_price: "₹2000-2500/quintal (MSP: ₹2275 for 2024-25)",
  major_states: ["Uttar Pradesh", "Punjab", "Haryana", "Madhya Pradesh", "Rajasthan", "Bihar"],
  cost_of_cultivation: "₹35,000-45,000/ha (varies by region and management)",
  
  // Nutrition & Health
  calories: "340 kcal per 100g",
  protein: "12.2% (varies 10-15%)",
  carbohydrates: "71% (mainly starch)",
  fat: "1.5% (mainly unsaturated)",
  fiber: "12.3g per 100g",
  vitamins: ["Vitamin B1 (Thiamine)", "Vitamin B3 (Niacin)", "Folate (B9)", "Vitamin E"],
  minerals: ["Iron (3.2mg)", "Zinc (2.8mg)", "Magnesium (138mg)", "Phosphorus (346mg)", "Selenium"],
  
  // Pests & Diseases
  pests: [
    "Aphids (Rhopalosiphum maidis, Sitobion avenae)",
    "Termites (Odontotermes obesus)",
    "Cutworms (Agrotis ipsilon)",
    "Armyworms (Mythimna separata)",
    "Shoot fly (Atherigona naqvii)",
    "Pink stem borer (Sesamia inferens)",
    "Grasshoppers (Hieroglyphus banian)"
  ],
  diseases: [
    "Yellow rust (Puccinia striiformis)",
    "Brown rust (Puccinia triticina)",
    "Powdery mildew (Blumeria graminis)",
    "Loose smut (Ustilago tritici)",
    "Karnal bunt (Tilletia indica)",
    "Foot rot (Fusarium graminearum)",
    "Flag smut (Urocystis tritici)",
    "Black rust (Puccinia graminis)"
  ],
  
  // Varieties (Key ones for testing)
  varieties: [
    {
      id: "hd2967",
      name: "HD 2967",
      duration: "135-140 days",
      yield: "45-50 q/ha (potential), 35-40 q/ha (average)",
      states: ["Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh", "Rajasthan"],
      resistance: ["Yellow rust", "Brown rust", "Powdery mildew", "Karnal bunt"],
      characteristics: ["High protein content (12-13%)", "Excellent chapati quality", "Semi-dwarf (85-90 cm)", "Heat tolerant"],
      grain_quality: "High Protein, Medium Bold, Amber color",
      zone: "North Zone",
      premium_market: true
    },
    {
      id: "dbw187",
      name: "DBW 187",
      duration: "140-145 days",
      yield: "40-45 q/ha (potential), 32-38 q/ha (average)",
      states: ["Punjab", "Haryana", "Delhi", "Western UP", "Uttarakhand"],
      resistance: ["Yellow rust", "Leaf rust", "Powdery mildew", "Loose smut"],
      characteristics: ["Heat tolerant", "Late sowing variety", "Good grain quality", "Lodging resistant"],
      grain_quality: "Good chapati quality, Medium grain size",
      zone: "North-West Zone",
      premium_market: false
    }
  ],
  
  // Additional Fields for AI Processing
  confidence_score: 0.95,
  source_document: "wheat_comprehensive_data.json",
  extraction_notes: "Comprehensive wheat data compiled from multiple sources including ICAR, CIMMYT, and agricultural research papers. High confidence in accuracy of technical specifications and cultivation practices."
};

export default comprehensiveWheatData;
