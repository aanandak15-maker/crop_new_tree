export interface CropVariety {
  id: string;
  name: string;
  duration: string;
  yield: string;
  states: string[];
  resistance: string[];
  characteristics: string[];
  lateSowingSuitable: boolean;
  irrigationResponsive: boolean;
  certifiedSeedAvailable: boolean;
  grainQuality: string;
  zone: string;
  premiumMarket: boolean;
}

export interface CropData {
  id: string;
  name: string;
  scientificName: string;
  family: string;
  cropType: string; // cereals, pulses, vegetables, fruits, oilseeds, spices
  season: string[];
  description?: string;
  origin?: string;
  climate: {
    temperature: string;
    rainfall: string;
    humidity: string;
    zone?: string;
    optimumTemp?: string;
    tolerableTemp?: string;
    altitude?: string;
  };
  soil: {
    type: string[];
    ph: string;
    drainage: string;
    texture?: string;
    lightRequirement?: string;
  };
  morphology: {
    growthHabit?: string;
    lifeSpan?: string;
    plantType?: string;
    rootSystem?: string;
    leaf?: string;
    floweringSeason?: string;
    inflorescenceType?: string;
    fruitType?: string;
    fruitDevelopment?: string;
    uniqueMorphology?: string;
    ediblePart?: string;
  };
  genetics: {
    chromosomeNumber?: string;
    breedingMethods?: string;
    biotechAdvances?: string;
    hybridVarieties?: string;
    patents?: string;
    researchInstitutes?: string;
  };
  reproduction: {
    pollination?: string;
    propagationType?: string;
    plantingMaterial?: string;
    germinationPercent?: string;
    rootstockCompatibility?: string;
    nurseryPractices?: string;
    trainingSystem?: string;
  };
  varieties: CropVariety[];
  cultivation: {
    landPreparation: string[];
    sowing: string[];
    fertilizers: string[];
    irrigation: string[];
    harvesting: string[];
    nurseryPractices?: string;
    trainingSystem?: string;
    spacing?: string;
    plantingSeason?: string;
  };
  management: {
    npkN?: string;
    npkP?: string;
    npkK?: string;
    micronutrientNeeds?: string;
    biofertilizerUsage?: string;
    applicationScheduleMethod?: string;
    applicationScheduleStages?: string;
    applicationScheduleFrequency?: string;
    waterQuality?: string;
  };
  weeds: {
    commonWeeds?: string;
    weedSeason?: string;
    weedControlMethod?: string;
    criticalPeriodWeed?: string;
  };
  pests: string[];
  diseases: string[];
  economics: {
    averageYield: string;
    marketPrice: string;
    majorStates: string[];
    costOfCultivation: string;
  };
  sustainability: string[];
  nutritionalValue: {
    calories: string;
    protein: string;
    carbohydrates: string;
    fiber: string;
    vitamins: string[];
    minerals: string[];
  };
  innovations: string[];
  climateResilience: string[];
  market: {
    marketTrends: string;
    exportPotential: string;
    exportDestinations: string[];
    valueChainPlayers: string[];
    certifications: string[];
    subsidies: string;
    schemes: string[];
    supportAgencies: string[];
  };
  technology: {
    aiMlIot: string;
    smartFarming: string;
  };
  cultural: {
    religiousUse: string;
    traditionalUses: string;
    giStatus: string;
    funFact: string;
  };
  insights: {
    keyTakeaways: string;
    swotStrengths: string;
    swotWeaknesses: string;
    swotOpportunities: string;
    swotThreats: string;
  };
  nutrition: {
    calories: string;
    protein: string;
    carbohydrates: string;
    fat: string;
    fiber: string;
    vitamins: string[];
    minerals: string[];
    bioactiveCompounds: string;
    healthBenefits: string;
  };
  harvest: {
    harvestTime: string;
    maturityIndicators: string;
    harvestingTools: string;
    postHarvestLosses: string;
    storageConditions: string;
    shelfLife: string;
    processedProducts: string[];
    packagingTypes: string[];
    coldChain: string;
  };
  nematodes: {
    name: string;
    symptoms: string;
    lifeCycle: string;
    etl: string;
    management: string;
    biocontrol: string;
    image: string;
  };
}

export const cropDatabase: CropData[] = [
  {
    id: "wheat",
    name: "Wheat",
    scientificName: "Triticum aestivum",
    family: "Poaceae (Gramineae)",
    cropType: "cereals",
    season: ["Rabi"],
    description: "Wheat is one of the world's most important cereal crops, providing essential nutrition and serving as a staple food for billions of people globally. It is the second most-produced cereal after maize and the most important food grain in terms of human consumption.",
    origin: "Fertile Crescent (Middle East) - domesticated around 10,000 years ago",
    climate: {
      temperature: "15-25°C (optimal), 10-35°C (tolerance range)",
      rainfall: "500-700mm annually, 400-800mm acceptable",
      humidity: "50-70% during growing season",
      zone: "Temperate and subtropical regions",
      optimumTemp: "20-25°C during vegetative growth, 15-20°C during grain filling",
      tolerableTemp: "5-35°C (survival range)",
      altitude: "0-3000m above sea level (varies by variety)"
    },
    soil: {
      type: ["Well-drained loamy", "Clay loam", "Sandy loam", "Alluvial soils"],
      ph: "6.0-7.5 (optimal), 5.5-8.0 (tolerance range)",
      drainage: "Good drainage essential, waterlogging harmful",
      texture: "Medium to fine textured soils preferred",
      lightRequirement: "Full sunlight (6-8 hours daily)"
    },
    morphology: {
      growthHabit: "Annual, erect, tufted grass",
      lifeSpan: "Annual (120-150 days)",
      plantType: "Monocotyledonous, C3 plant",
      rootSystem: "Fibrous root system, 1-2m deep",
      leaf: "Linear, alternate, parallel-veined, 15-30cm long",
      floweringSeason: "Spring (February-March in India)",
      inflorescenceType: "Spike (ear or head)",
      fruitType: "Caryopsis (grain)",
      fruitDevelopment: "Single-seeded, dry, indehiscent",
      uniqueMorphology: "Hollow stems (culms), ligules present, auricles variable",
      ediblePart: "Grain (endosperm, germ, bran)"
    },
    genetics: {
      chromosomeNumber: "2n=42 (hexaploid)",
      breedingMethods: "Pedigree, bulk, single seed descent, doubled haploid",
      biotechAdvances: "Marker-assisted selection, genetic transformation, genome editing",
      hybridVarieties: "Limited due to self-pollination, cytoplasmic male sterility used",
      patents: "Multiple patents on disease resistance genes, quality traits",
      researchInstitutes: "CIMMYT, ICAR, IARI, State Agricultural Universities"
    },
    reproduction: {
      pollination: "Self-pollinating (cleistogamous)",
      propagationType: "Sexual (seed)",
      plantingMaterial: "Certified seeds",
      germinationPercent: "85-95% under optimal conditions",
      rootstockCompatibility: "Not applicable (annual crop)",
      nurseryPractices: "Direct seeding, no nursery required",
      trainingSystem: "Not applicable (annual crop)"
    },
    varieties: [
      {
        id: "hd2967",
        name: "HD 2967",
        duration: "135-140 days",
        yield: "45-50 q/ha (potential), 35-40 q/ha (average)",
        states: ["Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh", "Rajasthan"],
        resistance: ["Yellow rust", "Brown rust", "Powdery mildew", "Karnal bunt"],
        characteristics: ["High protein content (12-13%)", "Excellent chapati quality", "Semi-dwarf (85-90 cm)", "Heat tolerant"],
        lateSowingSuitable: false,
        irrigationResponsive: true,
        certifiedSeedAvailable: true,
        grainQuality: "High Protein, Medium Bold, Amber color",
        zone: "North Zone",
        premiumMarket: true
      },
      {
        id: "dbw187",
        name: "DBW 187",
        duration: "140-145 days",
        yield: "40-45 q/ha (potential), 32-38 q/ha (average)",
        states: ["Punjab", "Haryana", "Delhi", "Western UP", "Uttarakhand"],
        resistance: ["Yellow rust", "Leaf rust", "Powdery mildew", "Loose smut"],
        characteristics: ["Heat tolerant", "Late sowing variety", "Good grain quality", "Lodging resistant"],
        lateSowingSuitable: true,
        irrigationResponsive: true,
        certifiedSeedAvailable: true,
        grainQuality: "Good chapati quality, Medium grain size",
        zone: "North-West Zone",
        premiumMarket: false
      },
      {
        id: "pusa3085",
        name: "Pusa 3085",
        duration: "130-135 days",
        yield: "42-48 q/ha (potential), 35-42 q/ha (average)",
        states: ["Bihar", "Jharkhand", "Eastern UP", "West Bengal", "Odisha"],
        resistance: ["Blast", "Brown spot", "Bacterial blight", "Sheath blight"],
        characteristics: ["Early maturing", "High yielding", "Disease resistant", "Good milling quality"],
        lateSowingSuitable: false,
        irrigationResponsive: true,
        certifiedSeedAvailable: true,
        grainQuality: "Good milling quality, Medium slender grain",
        zone: "Eastern Zone",
        premiumMarket: false
      }
    ],
    cultivation: {
      landPreparation: ["Deep ploughing", "Harrowing", "Planking", "Leveling", "Bed preparation"],
      sowing: ["Seed rate: 100-125 kg/ha", "Spacing: 22.5 cm row spacing", "Depth: 4-5 cm", "Sowing time: October-November (Rabi)"],
      fertilizers: ["NPK: 120:60:40 kg/ha", "Nitrogen in 3 splits", "Full P&K at sowing", "Top dressing at tillering and flowering"],
      irrigation: ["Critical stages: Crown root, Tillering, Jointing, Flowering, Grain filling", "Light irrigation", "Avoid water logging", "Total: 4-6 irrigations"],
      harvesting: ["Harvest at physiological maturity", "Moisture: 20-25%", "Manual or mechanical harvesting", "Proper drying and storage"]
    },
    management: {
      npkN: "120 kg/ha",
      npkP: "60 kg/ha",
      npkK: "40 kg/ha",
      micronutrientNeeds: "Zinc, Boron, Iron",
      biofertilizerUsage: "Azotobacter, PSB",
      applicationScheduleMethod: "Split application",
      applicationScheduleStages: "Basal, Tillering, Flowering",
      applicationScheduleFrequency: "3 splits",
      waterQuality: "Good quality water, avoid saline water"
    },
    weeds: {
      commonWeeds: "Phalaris minor, Avena fatua, Chenopodium album, Melilotus indica",
      weedSeason: "Rabi season (October-March)",
      weedControlMethod: "Pre-emergence and post-emergence herbicides",
      criticalPeriodWeed: "First 30-45 days after sowing"
    },
    pests: ["Aphids", "Termites", "Army worm", "Pink stem borer", "Cut worms"],
    diseases: ["Yellow rust", "Brown rust", "Black rust", "Powdery mildew", "Karnal bunt", "Loose smut"],
    economics: {
      averageYield: "34 q/ha (National average)",
      marketPrice: "₹2100-2500/quintal (MSP: ₹2125)",
      majorStates: ["Uttar Pradesh", "Punjab", "Madhya Pradesh", "Haryana", "Rajasthan"],
      costOfCultivation: "₹35,000-45,000/ha"
    },
    sustainability: ["Organic farming", "Conservation agriculture", "Integrated pest management", "Water conservation", "Soil health improvement"],
    nutritionalValue: {
      calories: "327 kcal",
      protein: "12.6%",
      carbohydrates: "71.2%",
      fiber: "12.2g",
      vitamins: ["Vitamin B1", "Vitamin B2", "Vitamin B6", "Vitamin E"],
      minerals: ["Iron", "Zinc", "Magnesium", "Phosphorus"]
    },
    innovations: ["High-yielding varieties", "Disease-resistant strains", "Climate-smart agriculture", "Precision farming"],
    climateResilience: ["Drought tolerance", "Heat stress tolerance", "Water use efficiency", "Early maturity (escape terminal heat)"],
    market: {
      marketTrends: "Growing demand for quality wheat",
      exportPotential: "High potential for export",
      exportDestinations: ["Middle East", "Southeast Asia", "Africa"],
      valueChainPlayers: ["Farmers", "Traders", "Processors", "Exporters"],
      certifications: ["Organic", "Non-GMO", "Quality certification"],
      subsidies: "Available under various government schemes",
      schemes: ["PM-KISAN", "PM-Fasal Bima Yojana", "National Food Security Mission"],
      supportAgencies: ["NAFED", "State Agricultural Departments", "Wheat Research Institutes"]
    },
    technology: {
      aiMlIot: "AI-based crop monitoring, IoT sensors for irrigation, ML for yield prediction",
      smartFarming: "Drones for spraying, GPS-guided farming, Smart irrigation systems"
    },
    cultural: {
      religiousUse: "Used in religious ceremonies, bread for communion",
      traditionalUses: "Traditional bread making, medicinal uses in Ayurveda",
      giStatus: "Several GI tags for regional wheat varieties",
      funFact: "Wheat has been cultivated for over 10,000 years and is mentioned in ancient texts"
    },
    insights: {
      keyTakeaways: "High nutritional value, climate resilient, essential food security crop",
      swotStrengths: "High protein content, versatile usage, global demand",
      swotWeaknesses: "Water intensive, climate sensitive, storage challenges",
      swotOpportunities: "Growing health consciousness, organic market, export potential",
      swotThreats: "Climate change, pest resistance, market volatility"
    },
    nutrition: {
      calories: "327 kcal",
      protein: "12.6%",
      carbohydrates: "71.2%",
      fat: "0.5g",
      fiber: "12.2g",
      vitamins: ["Vitamin B1", "Vitamin B2", "Vitamin B6", "Vitamin E"],
      minerals: ["Iron", "Zinc", "Magnesium", "Phosphorus"],
      bioactiveCompounds: "Antioxidants, polyphenols, lignans",
      healthBenefits: "Reduces risk of heart diseases, improves digestion, boosts immunity"
    },
    harvest: {
      harvestTime: "Rabi season (October-March)",
      maturityIndicators: "Physiological maturity (when grain is ripe)",
      harvestingTools: "Manual or mechanical harvesting, combine harvester",
      postHarvestLosses: "10-15%",
      storageConditions: "Cool, dry, well-ventilated, pest-free",
      shelfLife: "6-12 months",
      processedProducts: ["Wheat flour", "Wheat bran", "Wheat straw", "Wheat germ"],
      packagingTypes: ["Bags", "Sacks", "Barrels", "Bulk"],
      coldChain: "Required for long-term storage"
    },
    nematodes: {
      name: "Wheat Nematode",
      symptoms: "Wilting, yellowing, stunted growth, reduced yield, root knot, galls",
      lifeCycle: "Nematode, egg, larva, nematode, egg",
      etl: "Ecological, Trophic, Local",
      management: "Use resistant varieties, rotate crops, biological control, soil fumigation",
      biocontrol: "Parasitic nematodes, predators, antagonistic bacteria",
      image: "https://example.com/wheat-nematode.jpg"
    }
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

