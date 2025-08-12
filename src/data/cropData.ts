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
  pestDetails?: {
    name?: string;
    symptoms?: string;
    lifeCycle?: string;
    etl?: string;
    management?: string;
    biocontrol?: string;
    image?: string;
  };
  additionalPests?: Array<{
    name: string;
    symptoms: string;
    lifeCycle: string;
    etl: string;
    management: string;
    biocontrol: string;
    image: string;
  }>;
  diseases: string[];
  diseaseDetails?: {
    name?: string;
    causalAgent?: string;
    symptoms?: string;
    lifeCycle?: string;
    management?: string;
    biocontrol?: string;
    image?: string;
  };
  additionalDiseases?: Array<{
    name: string;
    causalAgent: string;
    symptoms: string;
    lifeCycle: string;
    management: string;
    biocontrol: string;
    image: string;
  }>;
  disorders?: {
    name?: string;
    cause?: string;
    symptoms?: string;
    impact?: string;
    control?: string;
    image?: string;
  };
  nematodes?: {
    name?: string;
    symptoms?: string;
    lifeCycle?: string;
    etl?: string;
    management?: string;
    biocontrol?: string;
    image?: string;
  };
  economics: {
    averageYield: string;
    marketPrice: string;
    majorStates: string[];
    costOfCultivation: string;
    potentialYield?: string;
    msp?: string;
    marketDemand?: string;
  };
  nutrition: {
    calories: string;
    protein: string;
    carbohydrates: string;
    fat?: string;
    fiber: string;
    vitamins: string[];
    minerals: string[];
    bioactiveCompounds?: string;
    healthBenefits?: string;
  };
  harvest: {
    harvestTime?: string;
    maturityIndicators?: string;
    harvestingTools?: string;
    postHarvestLosses?: string;
    storageConditions?: string;
    shelfLife?: string;
    processedProducts?: string;
    packagingTypes?: string;
    coldChain?: string;
    ripeningCharacteristics?: string;
    preCooling?: string;
  };
  market: {
    marketTrends?: string;
    exportPotential?: string;
    exportDestinations?: string;
    valueChainPlayers?: string;
    certifications?: string;
    subsidies?: string;
    schemes?: string;
    supportAgencies?: string;
  };
  technology: {
    aiMlIot?: string;
    smartFarming?: string;
  };
  sustainability: string[];
  sustainabilityDetails?: {
    potential?: string;
    wasteToWealth?: string;
    carbonFootprint?: string;
  };
  innovations: string[];
  climateResilience: string[];
  cultural: {
    religiousUse?: string;
    traditionalUses?: string;
    giStatus?: string;
    funFact?: string;
  };
  insights: {
    keyTakeaways?: string;
    swotStrengths?: string;
    swotWeaknesses?: string;
    swotOpportunities?: string;
    swotThreats?: string;
  };
}

export const cropDatabase: CropData[] = [
  {
    id: "wheat",
    name: "Wheat",
    scientificName: "Triticum aestivum",
    family: "Poaceae (Gramineae)",
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
      },
      {
        id: "hd3086",
        name: "HD 3086",
        duration: "145-150 days",
        yield: "50-55 q/ha (potential), 40-45 q/ha (average)",
        states: ["Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh"],
        resistance: ["Yellow rust", "Brown rust", "Powdery mildew", "Karnal bunt"],
        characteristics: ["High yielding", "Good protein content", "Excellent bread quality", "Disease resistant"],
        lateSowingSuitable: false,
        irrigationResponsive: true,
        certifiedSeedAvailable: true,
        grainQuality: "High protein, Good bread making quality",
        zone: "North Zone",
        premiumMarket: true
      },
      {
        id: "wh1105",
        name: "WH 1105",
        duration: "135-140 days",
        yield: "45-50 q/ha (potential), 38-42 q/ha (average)",
        states: ["Punjab", "Haryana", "Western UP", "Rajasthan"],
        resistance: ["Yellow rust", "Brown rust", "Powdery mildew"],
        characteristics: ["High yielding", "Good grain quality", "Heat tolerant", "Lodging resistant"],
        lateSowingSuitable: false,
        irrigationResponsive: true,
        certifiedSeedAvailable: true,
        grainQuality: "Good chapati quality, Medium bold grain",
        zone: "North-West Zone",
        premiumMarket: true
      },
      {
        id: "dbw303",
        name: "DBW 303",
        duration: "140-145 days",
        yield: "42-47 q/ha (potential), 35-40 q/ha (average)",
        states: ["Punjab", "Haryana", "Western UP", "Uttarakhand"],
        resistance: ["Yellow rust", "Brown rust", "Powdery mildew", "Loose smut"],
        characteristics: ["High yielding", "Good grain quality", "Disease resistant", "Heat tolerant"],
        lateSowingSuitable: false,
        irrigationResponsive: true,
        certifiedSeedAvailable: true,
        grainQuality: "Good chapati quality, Medium grain size",
        zone: "North-West Zone",
        premiumMarket: false
      }
    ],
    cultivation: {
      landPreparation: [
        "Deep ploughing (20-25 cm depth)",
        "Harrowing 2-3 times for fine tilth",
        "Leveling for uniform irrigation",
        "Apply FYM 8-10 t/ha or compost 5-6 t/ha",
        "Zero tillage possible with proper equipment"
      ],
      sowing: [
        "Seed rate: 100-125 kg/ha (normal), 125-150 kg/ha (late sowing)",
        "Row spacing: 20-22.5 cm",
        "Sowing depth: 4-5 cm",
        "Sowing time: Nov 1-15 (timely), Nov 15-30 (late)",
        "Seed treatment with fungicide (Carbendazim 2g/kg)",
        "Biofertilizer treatment (Azotobacter/Azospirillum)"
      ],
      fertilizers: [
        "NPK: 120:60:40 kg/ha (recommended)",
        "Nitrogen: 120 kg/ha in 3 splits (1/3 at sowing, 1/3 at CRI, 1/3 at jointing)",
        "Phosphorus: 60 kg/ha as DAP at sowing",
        "Potash: 40 kg/ha as MOP at sowing",
        "Zinc: 25 kg/ha ZnSO4 if deficient",
        "Sulphur: 20 kg/ha if deficient"
      ],
      irrigation: [
        "Crown root initiation (20-25 DAS) - Critical",
        "Tillering (40-45 DAS) - Important",
        "Jointing (60-65 DAS) - Critical",
        "Flowering (80-85 DAS) - Critical",
        "Milk stage (100-105 DAS) - Critical",
        "Dough stage (115-120 DAS) - Important",
        "Total water requirement: 400-500mm"
      ],
      harvesting: [
        "Harvest at physiological maturity (moisture 20-25%)",
        "Use combine harvester for large areas",
        "Manual harvesting with sickle for small areas",
        "Proper threshing and cleaning",
        "Sun drying to 12-14% moisture",
        "Storage in clean, dry conditions"
      ],
      nurseryPractices: "Direct seeding (no nursery required)",
      trainingSystem: "Not applicable (annual crop)",
      spacing: "20-25cm row spacing, 5-8cm plant spacing",
      plantingSeason: "October-November (North India), November-December (Central India)"
    },
    management: {
      npkN: "120-150 kg/ha (split application)",
      npkP: "60-80 kg/ha (basal application)",
      npkK: "40-60 kg/ha (basal application)",
      micronutrientNeeds: "Zinc (5-10 kg/ha), Boron (1-2 kg/ha), Iron (10-15 kg/ha)",
      biofertilizerUsage: "Azotobacter, Azospirillum, PSB (Phosphate Solubilizing Bacteria)",
      applicationScheduleMethod: "Broadcasting, band placement, foliar spray",
      applicationScheduleStages: "Basal (sowing), tillering (25-30 DAS), jointing (45-50 DAS), flowering (70-75 DAS)",
      applicationScheduleFrequency: "2-3 split applications for nitrogen",
      waterQuality: "pH 6.5-8.5, EC < 2.0 dS/m, SAR < 10"
    },
    weeds: {
      commonWeeds: "Phalaris minor, Avena fatua, Chenopodium album, Melilotus alba",
      weedSeason: "October-March (coincides with crop season)",
      weedControlMethod: "Pre-emergence herbicides, post-emergence herbicides, manual weeding",
      criticalPeriodWeed: "15-45 days after sowing (critical weed-free period)"
    },
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
    economics: {
      averageYield: "32 q/ha (National average), 45-50 q/ha (Potential)",
      marketPrice: "₹2000-2500/quintal (MSP: ₹2275 for 2024-25)",
      majorStates: ["Uttar Pradesh", "Punjab", "Haryana", "Madhya Pradesh", "Rajasthan", "Bihar"],
      costOfCultivation: "₹35,000-45,000/ha (varies by region and management)"
    },
    sustainability: [
      "Crop rotation with legumes (chickpea, lentil, pea)",
      "Zero tillage technology (conservation agriculture)",
      "Integrated pest management (IPM)",
      "Water-saving techniques (drip irrigation, laser leveling)",
      "Organic farming practices",
      "Biofertilizer application",
      "Residue management and mulching"
    ],
    nutrition: {
      calories: "340 kcal per 100g",
      protein: "12.2% (varies 10-15%)",
      carbohydrates: "71% (mainly starch)",
      fat: "1.5% (mainly unsaturated)",
      fiber: "12.3g per 100g",
      vitamins: ["Vitamin B1 (Thiamine)", "Vitamin B3 (Niacin)", "Folate (B9)", "Vitamin E"],
      minerals: ["Iron (3.2mg)", "Zinc (2.8mg)", "Magnesium (138mg)", "Phosphorus (346mg)", "Selenium"],
      bioactiveCompounds: "Phenolic acids, flavonoids, lignans, phytosterols",
      healthBenefits: "Heart health, digestive health, blood sugar control, weight management, reduced cancer risk"
    },
    harvest: {
      harvestTime: "March-April (120-150 days after sowing)",
      maturityIndicators: "Yellowing of leaves, hard grains, moisture content 20-25%",
      harvestingTools: "Combine harvester, sickle, thresher",
      postHarvestLosses: "5-10% due to improper storage, pests, and handling",
      storageConditions: "Cool (15-20°C), dry (12-14% moisture), well-ventilated",
      shelfLife: "2-3 years under proper storage conditions",
      processedProducts: "Flour, semolina, bread, pasta, noodles, biscuits, breakfast cereals",
      packagingTypes: "Jute bags, polypropylene bags, bulk containers",
      coldChain: "Not required for dry grains",
      ripeningCharacteristics: "Gradual ripening, uniform maturity",
      preCooling: "Not applicable (dry grain)"
    },
    market: {
      marketTrends: "Increasing demand for quality wheat, organic wheat gaining popularity",
      exportPotential: "High potential for export to Middle East, Africa, Southeast Asia",
      exportDestinations: "Bangladesh, Sri Lanka, UAE, Saudi Arabia, Yemen",
      valueChainPlayers: "Farmers, traders, millers, bakers, retailers, consumers",
      certifications: "Organic certification, food safety certification, quality certification",
      subsidies: "MSP support, input subsidies, crop insurance",
      schemes: "PM-KISAN, PM-Fasal Bima Yojana, Soil Health Card Scheme",
      supportAgencies: "FCI, NAFED, State Agricultural Marketing Boards"
    },
    technology: {
      aiMlIot: "Precision agriculture, crop monitoring, yield prediction, pest detection",
      smartFarming: "IoT sensors, drones, automated irrigation, GPS-guided machinery"
    },
    innovations: [
      "Drought tolerant varieties (HD 3086, DBW 187)",
      "Precision sowing techniques (Happy Seeder)",
      "Biofortified wheat (Zinc-enriched varieties)",
      "Climate-smart varieties (heat and drought tolerant)",
      "GM wheat research (disease resistance)",
      "Smart farming technologies (IoT, sensors)",
      "Quality protein wheat varieties"
    ],
    climateResilience: [
      "Heat tolerance (terminal heat stress resistance)",
      "Water use efficiency (drought tolerant varieties)",
      "Lodging resistance (strong stems)",
      "Disease resistance (multiple disease resistant varieties)",
      "Salinity tolerance (some varieties)",
      "Early maturity (escape terminal heat)"
    ],
    cultural: {
      religiousUse: "Used in religious ceremonies, bread as communion in Christianity",
      traditionalUses: "Traditional bread making, medicinal uses in Ayurveda",
      giStatus: "Several wheat varieties have GI protection in India",
      funFact: "Wheat was first domesticated in the Fertile Crescent and has been cultivated for over 10,000 years"
    },
    insights: {
      keyTakeaways: "Wheat is essential for food security, requires proper management for optimal yield, climate-resilient varieties are crucial for future sustainability",
      swotStrengths: "High nutritional value, versatile usage, established market, government support",
      swotWeaknesses: "Water intensive, climate sensitive, storage challenges, pest susceptibility",
      swotOpportunities: "Growing demand, export potential, value addition, organic farming",
      swotThreats: "Climate change, water scarcity, price volatility, pest resistance"
    },
    pestDetails: {
      name: "Aphids (Rhopalosiphum maidis)",
      symptoms: "Yellowing of leaves, stunted growth, honeydew secretion, sooty mold development",
      lifeCycle: "Egg → Nymph → Adult (10-14 days), multiple generations per season",
      etl: "5-10 aphids per tiller during vegetative stage",
      management: "Imidacloprid 17.8 SL @ 0.3 ml/l, Thiamethoxam 25 WG @ 0.2 g/l",
      biocontrol: "Ladybird beetles, lacewings, parasitic wasps, fungal pathogens",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
    },
    additionalPests: [
      {
        name: "Termites (Odontotermes obesus)",
        symptoms: "Hollow stems, wilting plants, soil tunnels, plant collapse",
        lifeCycle: "Egg → Nymph → Worker/Soldier/Reproductive (2-3 months)",
        etl: "2-3 termite mounds per hectare",
        management: "Chlorpyriphos 20 EC @ 2.5 l/ha, Fipronil 0.3 GR @ 12.5 kg/ha",
        biocontrol: "Nematodes (Steinernema carpocapsae), fungi (Metarhizium anisopliae)",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
      },
      {
        name: "Cutworms (Agrotis ipsilon)",
        symptoms: "Cut seedlings at ground level, irregular holes in leaves, wilting plants",
        lifeCycle: "Egg → Larva → Pupa → Adult (35-45 days), 2-3 generations/year",
        etl: "2-3 larvae per square meter",
        management: "Chlorpyriphos 20 EC @ 2.5 l/ha, Quinalphos 25 EC @ 2 l/ha",
        biocontrol: "Bacillus thuringiensis, parasitic wasps, ground beetles",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
      },
      {
        name: "Armyworms (Mythimna separata)",
        symptoms: "Skeletonized leaves, defoliation, grain damage, webbing",
        lifeCycle: "Egg → Larva → Pupa → Adult (25-35 days), multiple generations",
        etl: "5-10 larvae per square meter",
        management: "Spinosad 45 SC @ 0.3 ml/l, Emamectin benzoate 5 SG @ 0.2 g/l",
        biocontrol: "Nuclear polyhedrosis virus, parasitic wasps, predatory bugs",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
      },
      {
        name: "Shoot Fly (Atherigona naqvii)",
        symptoms: "Dead hearts, stunted growth, tiller damage, reduced yield",
        lifeCycle: "Egg → Larva → Pupa → Adult (15-20 days), 3-4 generations",
        etl: "10-15% dead hearts",
        management: "Carbofuran 3G @ 25 kg/ha, Phorate 10G @ 10 kg/ha",
        biocontrol: "Parasitic wasps, predatory bugs, fungal pathogens",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
      }
    ],
    diseaseDetails: {
      name: "Yellow Rust (Puccinia striiformis)",
      causalAgent: "Fungus - Puccinia striiformis f. sp. tritici",
      symptoms: "Yellow-orange pustules on leaves, parallel to veins, powdery spores",
      lifeCycle: "Uredospores → Germination → Infection → New pustules (7-10 days)",
      management: "Triadimefon 25 WP @ 0.1%, Propiconazole 25 EC @ 0.1%",
      biocontrol: "Bacillus subtilis, Pseudomonas fluorescens, Trichoderma spp.",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
    },
    additionalDiseases: [
      {
        name: "Brown Rust (Puccinia triticina)",
        causalAgent: "Fungus - Puccinia triticina",
        symptoms: "Brown to dark brown pustules on leaves, circular spots, powdery spores",
        lifeCycle: "Uredospores → Germination → Infection → New pustules (8-12 days)",
        management: "Tebuconazole 25 EC @ 0.1%, Hexaconazole 5 EC @ 0.1%",
        biocontrol: "Bacillus subtilis, Pseudomonas fluorescens, Trichoderma harzianum",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
      },
      {
        name: "Powdery Mildew (Blumeria graminis)",
        causalAgent: "Fungus - Blumeria graminis f. sp. tritici",
        symptoms: "White powdery patches on leaves, stems, and heads, reduced photosynthesis",
        lifeCycle: "Conidia → Germination → Infection → New conidia (5-7 days)",
        management: "Sulphur 80 WP @ 0.3%, Dinocap 48 EC @ 0.1%",
        biocontrol: "Ampelomyces quisqualis, Bacillus subtilis, Trichoderma spp.",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
      },
      {
        name: "Loose Smut (Ustilago tritici)",
        causalAgent: "Fungus - Ustilago tritici",
        symptoms: "Black powdery masses replacing grains, infected heads appear earlier",
        lifeCycle: "Teliospores → Germination → Infection → Systemic growth",
        management: "Seed treatment with Carbendazim 2g/kg, Vitavax 2g/kg",
        biocontrol: "Pseudomonas fluorescens, Trichoderma viride, Bacillus subtilis",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
      },
      {
        name: "Karnal Bunt (Tilletia indica)",
        causalAgent: "Fungus - Tilletia indica",
        symptoms: "Partial grain infection, fishy odor, black powdery spores in grains",
        lifeCycle: "Teliospores → Germination → Infection → Grain colonization",
        management: "Seed treatment with Carbendazim 2g/kg, Propiconazole 25 EC @ 0.1%",
        biocontrol: "Pseudomonas fluorescens, Trichoderma harzianum, Bacillus subtilis",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
      }
    ],
    disorders: {
      name: "Lodging (Stem Breakage)",
      cause: "Heavy rainfall, strong winds, excessive nitrogen, weak stems",
      symptoms: "Bent or broken stems, reduced grain filling, difficult harvesting",
      impact: "20-40% yield loss, poor grain quality, increased harvesting cost",
      control: "Balanced fertilization, growth regulators, resistant varieties, proper spacing",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
    },
    nematodes: {
      name: "Cereal Cyst Nematode (Heterodera avenae)",
      symptoms: "Stunted growth, yellowing, reduced tillering, poor root development",
      lifeCycle: "Egg → Juvenile → Adult (30-45 days), survives in soil for years",
      etl: "2-5 cysts per 100g soil",
      management: "Crop rotation, nematicides, resistant varieties, soil solarization",
      biocontrol: "Paecilomyces lilacinus, Pasteuria penetrans, organic amendments",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
    }
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
          characteristics: ["Medium slender grain", "Good cooking quality", "Widely adapted"],
          lateSowingSuitable: false,
          irrigationResponsive: true,
          certifiedSeedAvailable: true,
          grainQuality: "Medium slender, good cooking",
          zone: "South Zone",
          premiumMarket: true
        },
        {
          id: "ir64",
          name: "IR 64",
          duration: "120-125 days",
          yield: "45-50 q/ha",
          states: ["Punjab", "Haryana", "Uttar Pradesh", "Bihar"],
          resistance: ["Blast", "Bacterial blight", "Brown plant hopper"],
          characteristics: ["Semi-dwarf", "High yielding", "Good milling quality"],
          lateSowingSuitable: false,
          irrigationResponsive: true,
          certifiedSeedAvailable: true,
          grainQuality: "Good milling, medium grain",
          zone: "North Zone",
          premiumMarket: false
        },
        {
          id: "basmati1509",
          name: "Pusa Basmati 1509",
          duration: "115-120 days",
          yield: "40-45 q/ha",
          states: ["Punjab", "Haryana", "Uttar Pradesh", "Uttarakhand"],
          resistance: ["Blast", "Bacterial blight"],
          characteristics: ["Export quality", "Extra long grain", "High aroma"],
          lateSowingSuitable: true,
          irrigationResponsive: true,
          certifiedSeedAvailable: true,
          grainQuality: "Export quality, extra long",
          zone: "North-West Zone",
          premiumMarket: true
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
      majorStates: ["West Bengal", "Uttar Pradesh", "Punjab", "Tamil Nadu", "Andhra Pradesh"],
      costOfCultivation: "₹40,000-55,000/ha"
    },
    sustainability: ["System of Rice Intensification (SRI)", "Direct seeded rice", "Alternate wetting and drying", "Integrated nutrient management", "Biofortified varieties"],
    nutritionalValue: {
      calories: "345 kcal",
      protein: "6.8%",
      carbohydrates: "78%",
      fiber: "1.3g",
      vitamins: ["Vitamin B1", "Vitamin B3", "Vitamin B6"],
      minerals: ["Manganese", "Iron", "Zinc", "Phosphorus"]
    },
    innovations: ["Direct seeded rice technology", "Aerobic rice cultivation", "Golden rice (Vitamin A enriched)", "Climate-smart varieties"],
    climateResilience: ["Submergence tolerance", "Salinity tolerance", "Drought tolerance", "Heat stress resistance"]
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
          characteristics: ["Single cross hybrid", "High yielding", "Stress tolerant"],
          lateSowingSuitable: true,
          irrigationResponsive: true,
          certifiedSeedAvailable: true,
          grainQuality: "Good grain, high test weight",
          zone: "Central Zone",
          premiumMarket: true
        },
        {
          id: "900mgold",
          name: "900M Gold",
          duration: "88-92 days",
          yield: "75-85 q/ha",
          states: ["Punjab", "Haryana", "Uttar Pradesh", "Bihar"],
          resistance: ["Downy mildew", "Turcicum leaf blight"],
          characteristics: ["Triple stack hybrid", "Excellent standability", "Good grain quality"],
          lateSowingSuitable: false,
          irrigationResponsive: true,
          certifiedSeedAvailable: true,
          grainQuality: "Excellent grain quality",
          zone: "North Zone",
          premiumMarket: true
        },
        {
          id: "bioseed9544",
          name: "Bio Seed 9544",
          duration: "80-85 days",
          yield: "70-80 q/ha",
          states: ["Rajasthan", "Gujarat", "Maharashtra", "Karnataka"],
          resistance: ["Common rust", "Turcicum leaf blight"],
          characteristics: ["Drought tolerant", "Early maturing", "High shelling %"],
          lateSowingSuitable: true,
          irrigationResponsive: false,
          certifiedSeedAvailable: true,
          grainQuality: "High shelling percentage",
          zone: "Western Zone",
          premiumMarket: false
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
      majorStates: ["Karnataka", "Maharashtra", "Madhya Pradesh", "Bihar", "Rajasthan"],
      costOfCultivation: "₹30,000-40,000/ha"
    },
    sustainability: ["Precision agriculture", "Conservation agriculture", "Integrated pest management", "Quality protein maize", "Biofortified varieties"],
    nutritionalValue: {
      calories: "365 kcal",
      protein: "9.4%",
      carbohydrates: "74%",
      fiber: "7.3g",
      vitamins: ["Vitamin A", "Vitamin C", "Vitamin B6"],
      minerals: ["Magnesium", "Phosphorus", "Iron", "Zinc"]
    },
    innovations: ["Quality Protein Maize (QPM)", "Biofortified varieties", "Hybrid technology", "Precision agriculture"],
    climateResilience: ["Drought tolerance", "Heat stress tolerance", "Lodging resistance", "Early maturity"]
  },
  {
    id: "anand",
    name: "Anand",
    scientificName: "Anandus maximus",
    family: "Anandaceae",
    season: ["Kharif", "Rabi"],
    description: "Anand is a unique crop variety developed through innovative agricultural practices, known for its high yield potential and adaptability to various climatic conditions across India.",
    origin: "Developed in India through modern breeding techniques",
    climate: {
      temperature: "20-30°C (optimal), 15-35°C (tolerance range)",
      rainfall: "600-800mm annually",
      humidity: "60-75% during growing season",
      zone: "Tropical and subtropical regions",
      optimumTemp: "25-28°C during vegetative growth",
      tolerableTemp: "10-40°C (survival range)",
      altitude: "0-2000m above sea level"
    },
    soil: {
      type: ["Well-drained loamy", "Clay loam", "Sandy loam", "Red soil"],
      ph: "6.5-7.5 (optimal), 6.0-8.0 (tolerance range)",
      drainage: "Good drainage essential",
      texture: "Medium to fine textured soils preferred",
      lightRequirement: "Full sunlight (6-8 hours daily)"
    },
    morphology: {
      growthHabit: "Annual, erect, branching plant",
      lifeSpan: "Annual (120-140 days)",
      plantType: "Dicotyledonous, C3 plant",
      rootSystem: "Tap root system, 1.5-2m deep",
      leaf: "Broad, alternate, net-veined, 10-20cm long",
      floweringSeason: "Monsoon and winter seasons",
      inflorescenceType: "Raceme",
      fruitType: "Capsule",
      fruitDevelopment: "Multi-seeded, dry, dehiscent",
      uniqueMorphology: "Strong stem, deep green leaves, high branching",
      ediblePart: "Seeds and young leaves"
    },
    genetics: {
      chromosomeNumber: "2n=24 (diploid)",
      breedingMethods: "Pedigree, bulk, single seed descent",
      biotechAdvances: "Marker-assisted selection, genetic transformation",
      hybridVarieties: "Available through cross-pollination",
      patents: "Multiple patents on yield and quality traits",
      researchInstitutes: "ICAR, IARI, State Agricultural Universities"
    },
    reproduction: {
      pollination: "Cross-pollinating (entomophilous)",
      propagationType: "Sexual (seed)",
      plantingMaterial: "Certified seeds",
      germinationPercent: "90-95% under optimal conditions",
      rootstockCompatibility: "Not applicable (annual crop)"
    },
    varieties: [
      {
        id: "anand1",
        name: "Anand 1",
        duration: "125-130 days",
        yield: "35-40 q/ha (potential), 28-35 q/ha (average)",
        states: ["Gujarat", "Maharashtra", "Karnataka", "Tamil Nadu"],
        resistance: ["Drought", "Heat stress", "Major pests"],
        characteristics: ["High protein content", "Excellent quality", "Semi-dwarf (90-100 cm)", "Heat tolerant"],
        lateSowingSuitable: true,
        irrigationResponsive: true,
        certifiedSeedAvailable: true,
        grainQuality: "High Protein, Bold grain, Golden color",
        zone: "Western Zone",
        premiumMarket: true
      },
      {
        id: "anand2",
        name: "Anand 2",
        duration: "130-135 days",
        yield: "38-45 q/ha (potential), 30-38 q/ha (average)",
        states: ["Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh"],
        resistance: ["Disease resistant", "Pest tolerant", "Lodging resistant"],
        characteristics: ["High yielding", "Good grain quality", "Stress tolerant", "Early maturing"],
        lateSowingSuitable: false,
        irrigationResponsive: true,
        certifiedSeedAvailable: true,
        grainQuality: "Good quality, Medium grain size",
        zone: "North Zone",
        premiumMarket: false
      },
      {
        id: "anand3",
        name: "Anand 3",
        duration: "120-125 days",
        yield: "32-38 q/ha (potential), 25-32 q/ha (average)",
        states: ["Bihar", "Jharkhand", "West Bengal", "Odisha"],
        resistance: ["Blast", "Bacterial blight", "Sheath blight"],
        characteristics: ["Early maturing", "Disease resistant", "Good milling quality"],
        lateSowingSuitable: true,
        irrigationResponsive: true,
        certifiedSeedAvailable: true,
        grainQuality: "Good milling quality, Medium slender grain",
        zone: "Eastern Zone",
        premiumMarket: false
      }
    ],
    cultivation: {
      landPreparation: ["Deep ploughing", "Harrowing", "Planking", "Leveling"],
      sowing: ["Seed rate: 15-20 kg/ha", "Spacing: 30x15 cm", "Depth: 3-4 cm", "Sowing time: June-July (Kharif), October-November (Rabi)"],
      fertilizers: ["NPK: 100:50:50 kg/ha", "Nitrogen in 3 splits", "Full P&K at sowing", "Top dressing at flowering"],
      irrigation: ["Critical stages: Flowering, Grain filling", "Light frequent irrigation", "Avoid water logging", "Total: 8-10 irrigations"],
      harvesting: ["Harvest at physiological maturity", "Moisture: 15-18%", "Manual or mechanical harvesting", "Proper drying and storage"]
    },
    management: {
      npkN: "100 kg/ha",
      npkP: "50 kg/ha",
      npkK: "50 kg/ha",
      micronutrientNeeds: "Zinc, Boron, Iron",
      biofertilizerUsage: "Azotobacter, PSB",
      applicationScheduleMethod: "Split application",
      applicationScheduleStages: "Basal, Tillering, Flowering",
      applicationScheduleFrequency: "3 splits",
      waterQuality: "Good quality water, avoid saline water"
    },
    weeds: {
      commonWeeds: "Echinochloa, Cyperus, Amaranthus",
      weedSeason: "Throughout growing season",
      weedControlMethod: "Pre-emergence and post-emergence herbicides",
      criticalPeriodWeed: "First 30-45 days"
    },
    pests: ["Aphids", "Thrips", "Stem borer", "Leaf folder", "White fly", "Jassids"],
    diseases: ["Blast", "Bacterial blight", "Sheath blight", "Brown spot", "False smut"],
    economics: {
      averageYield: "32 q/ha (National average)",
      marketPrice: "₹2200-2800/quintal",
      majorStates: ["Gujarat", "Maharashtra", "Karnataka", "Punjab", "Haryana"],
      costOfCultivation: "₹35,000-45,000/ha"
    },
    nutrition: {
      calories: "380 kcal",
      protein: "12-14%",
      carbohydrates: "70-75%",
      fat: "2-3%",
      fiber: "8-10g",
      vitamins: ["Vitamin B1", "Vitamin B2", "Vitamin B6", "Vitamin E"],
      minerals: ["Iron", "Zinc", "Magnesium", "Phosphorus"],
      bioactiveCompounds: "Antioxidants, Phenolic compounds",
      healthBenefits: "High protein, Good for heart health, Rich in minerals"
    },
    harvest: {
      harvestTime: "120-140 days after sowing",
      maturityIndicators: "Yellowing of leaves, Hard grains",
      harvestingTools: "Sickle, Combine harvester",
      postHarvestLosses: "5-8%",
      storageConditions: "Cool, dry place, 12-14% moisture",
      shelfLife: "2-3 years under proper storage",
      processedProducts: "Flour, Bran, Oil",
      packagingTypes: "Gunny bags, Polypropylene bags",
      coldChain: "Not required for dry storage"
    },
    market: {
      marketTrends: "Increasing demand for high-protein crops",
      exportPotential: "High potential for export",
      exportDestinations: "Middle East, Southeast Asia, Europe",
      valueChainPlayers: "Farmers, Traders, Processors, Exporters",
      certifications: "Organic, Non-GMO, Quality certification",
      subsidies: "Available under various government schemes",
      schemes: "PM-KISAN, PM-Fasal Bima Yojana",
      supportAgencies: "NAFED, State Agricultural Departments"
    },
    technology: {
      aiMlIot: "Precision agriculture, IoT sensors, AI-based crop monitoring",
      smartFarming: "Drones for spraying, GPS-guided farming, Smart irrigation"
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
    sustainability: ["Organic farming", "Conservation agriculture", "Integrated pest management", "Water conservation", "Soil health improvement"],
    innovations: ["High-yielding varieties", "Disease-resistant strains", "Climate-smart agriculture", "Precision farming"],
    climateResilience: ["Drought tolerance", "Heat stress tolerance", "Water use efficiency", "Early maturity"]
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