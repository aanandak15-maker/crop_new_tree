export interface CropVariety {
  id: string;
  name: string;
  duration: string;
  yield: string;
  states: string[];
  resistance: string[];
  characteristics: string[];
}

export interface CropData {
  id: string;
  name: string;
  scientificName: string;
  family: string;
  season: string[];
  climate: {
    temperature: string;
    rainfall: string;
    humidity: string;
  };
  soil: {
    type: string[];
    ph: string;
    drainage: string;
  };
  varieties: CropVariety[];
  cultivation: {
    landPreparation: string[];
    sowing: string[];
    fertilizers: string[];
    irrigation: string[];
    harvesting: string[];
  };
  pests: string[];
  diseases: string[];
  economics: {
    averageYield: string;
    marketPrice: string;
    majorStates: string[];
  };
  sustainability: string[];
}

export const cropDatabase: CropData[] = [
  {
    id: "wheat",
    name: "Wheat",
    scientificName: "Triticum aestivum",
    family: "Poaceae (Gramineae)",
    season: ["Rabi"],
    climate: {
      temperature: "15-25°C (optimal)",
      rainfall: "500-700mm annually",
      humidity: "50-70%"
    },
    soil: {
      type: ["Well-drained loamy", "Clay loam", "Sandy loam"],
      ph: "6.0-7.5",
      drainage: "Good drainage essential"
    },
    varieties: [
      {
        id: "hd2967",
        name: "HD 2967",
        duration: "135-140 days",
        yield: "45-50 q/ha",
        states: ["Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh"],
        resistance: ["Yellow rust", "Brown rust", "Powdery mildew"],
        characteristics: ["High protein content", "Good chapati quality", "Semi-dwarf"]
      },
      {
        id: "dbw187",
        name: "DBW 187",
        duration: "140-145 days",
        yield: "40-45 q/ha",
        states: ["Punjab", "Haryana", "Delhi", "Western UP"],
        resistance: ["Yellow rust", "Leaf rust", "Powdery mildew"],
        characteristics: ["Heat tolerant", "Late sowing variety", "Good grain quality"]
      },
      {
        id: "pusa3085",
        name: "Pusa 3085",
        duration: "130-135 days",
        yield: "42-48 q/ha",
        states: ["Bihar", "Jharkhand", "Eastern UP", "West Bengal"],
        resistance: ["Blast", "Brown spot", "Bacterial blight"],
        characteristics: ["Early maturing", "High yielding", "Disease resistant"]
      }
    ],
    cultivation: {
      landPreparation: ["Deep ploughing", "Harrowing", "Leveling", "Apply FYM 8-10 t/ha"],
      sowing: ["Seed rate: 100-125 kg/ha", "Row spacing: 20-22.5 cm", "Sowing time: Nov-Dec", "Seed treatment with fungicide"],
      fertilizers: ["NPK: 120:60:40 kg/ha", "Urea in 3 splits", "DAP at sowing", "MOP at sowing"],
      irrigation: ["Crown root initiation (20-25 DAS)", "Tillering (40-45 DAS)", "Jointing (60-65 DAS)", "Flowering (80-85 DAS)", "Milk stage (100-105 DAS)", "Dough stage (115-120 DAS)"],
      harvesting: ["Harvest at physiological maturity", "Moisture content: 20-25%", "Use combine harvester", "Proper threshing and cleaning"]
    },
    pests: ["Aphids", "Termites", "Cutworms", "Armyworms", "Shoot fly"],
    diseases: ["Yellow rust", "Brown rust", "Powdery mildew", "Loose smut", "Karnal bunt", "Foot rot"],
    economics: {
      averageYield: "32 q/ha (National average)",
      marketPrice: "₹2000-2500/quintal (MSP: ₹2275)",
      majorStates: ["Uttar Pradesh", "Punjab", "Haryana", "Madhya Pradesh", "Rajasthan"]
    },
    sustainability: ["Crop rotation with legumes", "Zero tillage technology", "Integrated pest management", "Water-saving techniques", "Organic farming practices"]
  },
  {
    id: "rice",
    name: "Rice",
    scientificName: "Oryza sativa",
    family: "Poaceae (Gramineae)",
    season: ["Kharif", "Rabi (in some regions)"],
    climate: {
      temperature: "20-35°C",
      rainfall: "1000-2000mm annually",
      humidity: "80-90%"
    },
    soil: {
      type: ["Clay", "Clay loam", "Silty clay"],
      ph: "5.5-7.0",
      drainage: "Poor drainage suitable (puddled field)"
    },
    varieties: [
      {
        id: "swarna",
        name: "Swarna",
        duration: "145-150 days",
        yield: "50-55 q/ha",
        states: ["Andhra Pradesh", "Telangana", "Karnataka", "Tamil Nadu", "Odisha"],
        resistance: ["Blast", "Brown plant hopper", "Gall midge"],
        characteristics: ["Medium slender grain", "Good cooking quality", "Widely adapted"]
      },
      {
        id: "ir64",
        name: "IR 64",
        duration: "120-125 days",
        yield: "45-50 q/ha",
        states: ["Punjab", "Haryana", "Uttar Pradesh", "Bihar"],
        resistance: ["Blast", "Bacterial blight", "Brown plant hopper"],
        characteristics: ["Semi-dwarf", "High yielding", "Good milling quality"]
      },
      {
        id: "basmati1509",
        name: "Pusa Basmati 1509",
        duration: "115-120 days",
        yield: "40-45 q/ha",
        states: ["Punjab", "Haryana", "Uttar Pradesh", "Uttarakhand"],
        resistance: ["Blast", "Bacterial blight"],
        characteristics: ["Export quality", "Extra long grain", "High aroma"]
      }
    ],
    cultivation: {
      landPreparation: ["Puddling", "Leveling", "Bunding", "Apply organic matter"],
      sowing: ["Seed rate: 20-25 kg/ha (transplanting)", "Nursery raising: 21-25 days", "Transplanting: 2-3 seedlings/hill", "Spacing: 20x15 cm"],
      fertilizers: ["NPK: 120:60:40 kg/ha", "Nitrogen in 3 splits", "Phosphorus at transplanting", "Potash in 2 splits"],
      irrigation: ["Maintain 2-5 cm water level", "Drain before harvest", "Alternate wetting and drying (AWD)", "Total water requirement: 1200-1500 mm"],
      harvesting: ["Harvest at 80% grain filling", "Moisture content: 20-25%", "Use sickle or combine", "Proper drying and storage"]
    },
    pests: ["Brown plant hopper", "White backed plant hopper", "Leaf folder", "Stem borer", "Gall midge", "Thrips"],
    diseases: ["Blast", "Bacterial blight", "Sheath blight", "Brown spot", "False smut", "Tungro virus"],
    economics: {
      averageYield: "26 q/ha (National average)",
      marketPrice: "₹1800-2200/quintal (MSP: ₹2183)",
      majorStates: ["West Bengal", "Uttar Pradesh", "Punjab", "Tamil Nadu", "Andhra Pradesh"]
    },
    sustainability: ["System of Rice Intensification (SRI)", "Direct seeded rice", "Alternate wetting and drying", "Integrated nutrient management", "Biofortified varieties"]
  },
  {
    id: "maize",
    name: "Maize",
    scientificName: "Zea mays",
    family: "Poaceae (Gramineae)",
    season: ["Kharif", "Rabi", "Zaid"],
    climate: {
      temperature: "21-27°C",
      rainfall: "500-750mm annually",
      humidity: "60-80%"
    },
    soil: {
      type: ["Well-drained loamy", "Sandy loam", "Clay loam"],
      ph: "6.0-7.5",
      drainage: "Good drainage required"
    },
    varieties: [
      {
        id: "nk6240",
        name: "NK 6240",
        duration: "85-90 days",
        yield: "80-90 q/ha",
        states: ["Karnataka", "Maharashtra", "Gujarat", "Madhya Pradesh"],
        resistance: ["Turcicum leaf blight", "Common rust"],
        characteristics: ["Single cross hybrid", "High yielding", "Stress tolerant"]
      },
      {
        id: "900mgold",
        name: "900M Gold",
        duration: "88-92 days",
        yield: "75-85 q/ha",
        states: ["Punjab", "Haryana", "Uttar Pradesh", "Bihar"],
        resistance: ["Downy mildew", "Turcicum leaf blight"],
        characteristics: ["Triple stack hybrid", "Excellent standability", "Good grain quality"]
      },
      {
        id: "bioseed9544",
        name: "Bio Seed 9544",
        duration: "80-85 days",
        yield: "70-80 q/ha",
        states: ["Rajasthan", "Gujarat", "Maharashtra", "Karnataka"],
        resistance: ["Common rust", "Turcicum leaf blight"],
        characteristics: ["Drought tolerant", "Early maturing", "High shelling %"]
      }
    ],
    cultivation: {
      landPreparation: ["Deep ploughing", "Harrowing", "Planking", "Ridge and furrow method"],
      sowing: ["Seed rate: 20-25 kg/ha", "Spacing: 60x20 cm", "Depth: 4-5 cm", "Sowing time: June-July (Kharif)"],
      fertilizers: ["NPK: 120:60:40 kg/ha", "Nitrogen in 3 splits", "Full P&K at sowing", "Side dressing at knee height"],
      irrigation: ["Critical stages: Tasseling, Silking, Grain filling", "Light frequent irrigation", "Avoid water logging", "Total: 6-8 irrigations"],
      harvesting: ["Harvest at physiological maturity", "Moisture: 18-20%", "Hand picking or combine", "Proper curing and storage"]
    },
    pests: ["Fall armyworm", "Stem borer", "Shoot fly", "Pink stem borer", "Aphids", "Thrips"],
    diseases: ["Turcicum leaf blight", "Common rust", "Downy mildew", "Charcoal rot", "Post flowering stalk rot"],
    economics: {
      averageYield: "28 q/ha (National average)",
      marketPrice: "₹1700-2100/quintal (MSP: ₹2090)",
      majorStates: ["Karnataka", "Maharashtra", "Madhya Pradesh", "Bihar", "Rajasthan"]
    },
    sustainability: ["Precision agriculture", "Conservation agriculture", "Integrated pest management", "Quality protein maize", "Biofortified varieties"]
  }
];

export const getCropByName = (name: string): CropData | undefined => {
  return cropDatabase.find(crop => 
    crop.name.toLowerCase() === name.toLowerCase() || 
    crop.id.toLowerCase() === name.toLowerCase()
  );
};

export const getAllCropNames = (): string[] => {
  return cropDatabase.map(crop => crop.name);
};