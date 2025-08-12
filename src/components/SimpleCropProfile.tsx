import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { getCropByName } from '@/data/cropData';
import { 
  ArrowLeft, Info, Wheat, Leaf, Shield, Apple, TrendingUp, 
  Sprout, Bug, MapPin, Clock, Loader2, AlertTriangle, Droplets, Thermometer, 
  Cloud, Activity, Star
} from 'lucide-react';

interface CropVariety {
  id: string;
  name: string;
  duration: string | null;
  yield_potential: string | null;
  suitable_states: string[] | null;
  disease_resistance: string[] | null;
  special_features: string[] | null;
  grain_quality: string | null;
  description: string | null;
  zone?: string;
  premium_market?: boolean;
  late_sowing_suitable?: boolean;
  irrigation_responsive?: boolean;
  certified_seed_available?: boolean;
}

interface CropData {
  id: string;
  name: string;
  scientific_name: string | null;
  family: string | null;
  season: string[] | null;
  description: string | null;
  origin?: string;
  field_name?: string;
  climate_zone?: string;
  growth_habit?: string;
  life_span?: string;
  plant_type?: string;
  climate_type: string[] | null;
  temperature_range: string | null;
  rainfall_requirement: string | null;
  humidity_range: string | null;
  soil_type: string[] | null;
  soil_ph: string | null;
  drainage_requirement: string | null;
  land_preparation: string[] | null;
  sowing_time: string | null;
  seed_rate: string | null;
  row_spacing: string | null;
  fertilizer_requirement: string[] | null;
  irrigation_schedule: string[] | null;
  harvesting_info: string[] | null;
  pest_list: string[] | null;
  disease_list: string[] | null;
  average_yield: string | null;
  market_price: string | null;
  cost_of_cultivation: string | null;
  nutritional_info: string | null;
  innovations: string[] | null;
  sustainability_practices: string[] | null;
  water_requirement: string | null;
  // Advanced agronomy fields
  npk_n?: string;
  npk_p?: string;
  npk_k?: string;
  micronutrient_needs?: string;
  biofertilizer_usage?: string;
  application_schedule_method?: string;
  application_schedule_stages?: string;
  application_schedule_frequency?: string;
  water_quality?: string;
  optimum_temp?: string;
  tolerable_temp?: string;
  altitude?: string;
  soil_texture?: string;
  light_requirement?: string;
  spacing?: string;
  planting_season?: string;
  
  // Weed management
  common_weeds?: string;
  weed_season?: string;
  weed_control_method?: string;
  critical_period_weed?: string;
  
  // Detailed pest management
  pest_name?: string;
  pest_symptoms?: string;
  pest_life_cycle?: string;
  pest_etl?: string;
  pest_management?: string;
  pest_biocontrol?: string;
  pest_image?: string;
  additional_pests?: Array<{
    name: string;
    symptoms: string;
    lifeCycle: string;
    etl: string;
    management: string;
    biocontrol: string;
    image: string;
  }>;
  
  // Detailed disease management
  disease_name?: string;
  disease_causal_agent?: string;
  disease_symptoms?: string;
  disease_life_cycle?: string;
  disease_management?: string;
  disease_biocontrol?: string;
  disease_image?: string;
  additional_diseases?: Array<{
    name: string;
    causalAgent: string;
    symptoms: string;
    lifeCycle: string;
    management: string;
    biocontrol: string;
    image: string;
  }>;
  
  // Disorder management
  disorder_name?: string;
  disorder_cause?: string;
  disorder_symptoms?: string;
  disorder_impact?: string;
  disorder_control?: string;
  disorder_image?: string;
  
  // Nematode management
  nematode_name?: string;
  nematode_symptoms?: string;
  nematode_life_cycle?: string;
  nematode_etl?: string;
  nematode_management?: string;
  nematode_biocontrol?: string;
  nematode_image?: string;
  
  // Detailed nutrition
  calories?: string;
  protein?: string;
  carbohydrates?: string;
  fat?: string;
  fiber?: string;
  vitamins?: string;
  minerals?: string;
  bioactive_compounds?: string;
  health_benefits?: string;
  
  // Post-harvest and market
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
  market_trends?: string;
  export_potential?: string;
  export_destinations?: string;
  value_chain_players?: string;
  certifications?: string;
  subsidies?: string;
  schemes?: string;
  support_agencies?: string;
  
  // Advanced analytics
  ai_ml_iot?: string;
  smart_farming?: string;
  sustainability_potential?: string;
  waste_to_wealth?: string;
  climate_resilience?: string;
  carbon_footprint?: string;
  religious_use?: string;
  traditional_uses?: string;
  gi_status?: string;
  fun_fact?: string;
  key_takeaways?: string;
  swot_strengths?: string;
  swot_weaknesses?: string;
  swot_opportunities?: string;
  swot_threats?: string;
  
  // Morphology fields
  root_system?: string;
  leaf?: string;
  flowering_season?: string;
  inflorescence_type?: string;
  fruit_type?: string;
  fruit_development?: string;
  unique_morphology?: string;
  edible_part?: string;
  
  // Genetics fields
  chromosome_number?: string;
  breeding_methods?: string;
  biotech_advances?: string;
  hybrid_varieties?: string;
  patents?: string;
  research_institutes?: string;
  
  // Reproductive biology fields
  pollination?: string;
  propagation_type?: string;
  planting_material?: string;
  germination_percent?: string;
  rootstock_compatibility?: string;
  nursery_practices?: string;
  training_system?: string;
  
  // Variety-specific fields
  variety_name?: string;
  yield?: string;
  variety_features?: string;
  variety_suitability?: string;
  market_demand?: string;
  
  varieties?: CropVariety[];
}

interface SimpleCropProfileProps {
  cropName: string;
  onBack: () => void;
}

const SimpleCropProfile: React.FC<SimpleCropProfileProps> = ({ cropName, onBack }) => {
  const [crop, setCrop] = useState<CropData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCrop = async () => {
      try {
        setLoading(true);
        // Use maybeSingle to avoid 406 when no row exists
        const { data, error } = await supabase
          .from('crops')
          .select(`
            *,
            varieties (*)
          `)
          .eq('name', cropName)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching crop:', error);
        }

        if (data) {
          setCrop(data as unknown as CropData);
          return;
        }
        
        // Fallback to static dataset if DB has no record
        const staticCrop = getCropByName(cropName);
        if (staticCrop) {
          const mapped: CropData = {
            id: staticCrop.id,
            name: staticCrop.name,
            scientific_name: staticCrop.scientificName || null,
            family: staticCrop.family || null,
            season: staticCrop.season || null,
            description: staticCrop.description || null,
            origin: staticCrop.origin,
            field_name: staticCrop.morphology?.growthHabit || null,
            climate_zone: staticCrop.climate?.zone || null,
            growth_habit: staticCrop.morphology?.growthHabit || null,
            life_span: staticCrop.morphology?.lifeSpan || null,
            plant_type: staticCrop.morphology?.plantType || null,
            climate_type: staticCrop.climate?.zone ? [staticCrop.climate.zone] : null,
            temperature_range: staticCrop.climate?.temperature || null,
            rainfall_requirement: staticCrop.climate?.rainfall || null,
            humidity_range: staticCrop.climate?.humidity || null,
            soil_type: staticCrop.soil?.type || null,
            soil_ph: staticCrop.soil?.ph || null,
            drainage_requirement: staticCrop.soil?.drainage || null,
            land_preparation: staticCrop.cultivation?.landPreparation || null,
            sowing_time: Array.isArray(staticCrop.cultivation?.sowing)
              ? staticCrop.cultivation.sowing.join('; ')
              : null,
            seed_rate: null,
            row_spacing: staticCrop.cultivation?.spacing || null,
            fertilizer_requirement: staticCrop.cultivation?.fertilizers || null,
            irrigation_schedule: staticCrop.cultivation?.irrigation || null,
            harvesting_info: staticCrop.cultivation?.harvesting || null,
            pest_list: staticCrop.pests || null,
            disease_list: staticCrop.diseases || null,
            average_yield: staticCrop.economics?.averageYield || null,
            market_price: staticCrop.economics?.marketPrice || null,
            cost_of_cultivation: staticCrop.economics?.costOfCultivation || null,
            nutritional_info: staticCrop.nutrition
              ? `Calories: ${staticCrop.nutrition.calories}, Protein: ${staticCrop.nutrition.protein}, Carbs: ${staticCrop.nutrition.carbohydrates}`
              : null,
            innovations: staticCrop.innovations || null,
            sustainability_practices: staticCrop.sustainability || null,
            water_requirement: staticCrop.climate?.rainfall || null,
            
            // Advanced agronomy fields
            npk_n: staticCrop.management?.npkN || null,
            npk_p: staticCrop.management?.npkP || null,
            npk_k: staticCrop.management?.npkK || null,
            micronutrient_needs: staticCrop.management?.micronutrientNeeds || null,
            biofertilizer_usage: staticCrop.management?.biofertilizerUsage || null,
            application_schedule_method: staticCrop.management?.applicationScheduleMethod || null,
            application_schedule_stages: staticCrop.management?.applicationScheduleStages || null,
            application_schedule_frequency: staticCrop.management?.applicationScheduleFrequency || null,
            water_quality: staticCrop.management?.waterQuality || null,
            optimum_temp: staticCrop.climate?.optimumTemp || null,
            tolerable_temp: staticCrop.climate?.tolerableTemp || null,
            altitude: staticCrop.climate?.altitude || null,
            soil_texture: staticCrop.soil?.texture || null,
            light_requirement: staticCrop.soil?.lightRequirement || null,
            spacing: staticCrop.cultivation?.spacing || null,
            planting_season: staticCrop.cultivation?.plantingSeason || null,
            
            // Weed management
            common_weeds: staticCrop.weeds?.commonWeeds || null,
            weed_season: staticCrop.weeds?.weedSeason || null,
            weed_control_method: staticCrop.weeds?.weedControlMethod || null,
            critical_period_weed: staticCrop.weeds?.criticalPeriodWeed || null,
            
            // Detailed pest management
            pest_name: staticCrop.pestDetails?.name || null,
            pest_symptoms: staticCrop.pestDetails?.symptoms || null,
            pest_life_cycle: staticCrop.pestDetails?.lifeCycle || null,
            pest_etl: staticCrop.pestDetails?.etl || null,
            pest_management: staticCrop.pestDetails?.management || null,
            pest_biocontrol: staticCrop.pestDetails?.biocontrol || null,
            pest_image: staticCrop.pestDetails?.image || null,
            additional_pests: staticCrop.additionalPests || null,
            
            // Detailed disease management
            disease_name: staticCrop.diseaseDetails?.name || null,
            disease_causal_agent: staticCrop.diseaseDetails?.causalAgent || null,
            disease_symptoms: staticCrop.diseaseDetails?.symptoms || null,
            disease_life_cycle: staticCrop.diseaseDetails?.lifeCycle || null,
            disease_management: staticCrop.diseaseDetails?.management || null,
            disease_biocontrol: staticCrop.diseaseDetails?.biocontrol || null,
            disease_image: staticCrop.diseaseDetails?.image || null,
            additional_diseases: staticCrop.additionalDiseases || null,
            
            // Disorder management
            disorder_name: staticCrop.disorders?.name || null,
            disorder_cause: staticCrop.disorders?.cause || null,
            disorder_symptoms: staticCrop.disorders?.symptoms || null,
            disorder_impact: staticCrop.disorders?.impact || null,
            disorder_control: staticCrop.disorders?.control || null,
            disorder_image: staticCrop.disorders?.image || null,
            
            // Nematode management
            nematode_name: staticCrop.nematodes?.name || null,
            nematode_symptoms: staticCrop.nematodes?.symptoms || null,
            nematode_life_cycle: staticCrop.nematodes?.lifeCycle || null,
            nematode_etl: staticCrop.nematodes?.etl || null,
            nematode_management: staticCrop.nematodes?.management || null,
            nematode_biocontrol: staticCrop.nematodes?.biocontrol || null,
            nematode_image: staticCrop.nematodes?.image || null,
            
            // Detailed nutrition
            calories: staticCrop.nutrition?.calories || null,
            protein: staticCrop.nutrition?.protein || null,
            carbohydrates: staticCrop.nutrition?.carbohydrates || null,
            fat: staticCrop.nutrition?.fat || null,
            fiber: staticCrop.nutrition?.fiber || null,
            vitamins: Array.isArray(staticCrop.nutrition?.vitamins) ? staticCrop.nutrition.vitamins.join(', ') : null,
            minerals: Array.isArray(staticCrop.nutrition?.minerals) ? staticCrop.nutrition.minerals.join(', ') : null,
            bioactive_compounds: staticCrop.nutrition?.bioactiveCompounds || null,
            health_benefits: staticCrop.nutrition?.healthBenefits || null,
            
            // Post-harvest and market
            harvest_time: staticCrop.harvest?.harvestTime || null,
            maturity_indicators: staticCrop.harvest?.maturityIndicators || null,
            harvesting_tools: staticCrop.harvest?.harvestingTools || null,
            post_harvest_losses: staticCrop.harvest?.postHarvestLosses || null,
            storage_conditions: staticCrop.harvest?.storageConditions || null,
            shelf_life: staticCrop.harvest?.shelfLife || null,
            processed_products: staticCrop.harvest?.processedProducts || null,
            packaging_types: staticCrop.harvest?.packagingTypes || null,
            cold_chain: staticCrop.harvest?.coldChain || null,
            ripening_characteristics: staticCrop.harvest?.ripeningCharacteristics || null,
            pre_cooling: staticCrop.harvest?.preCooling || null,
            market_trends: staticCrop.market?.marketTrends || null,
            export_potential: staticCrop.market?.exportPotential || null,
            export_destinations: staticCrop.market?.exportDestinations || null,
            value_chain_players: staticCrop.market?.valueChainPlayers || null,
            certifications: staticCrop.market?.certifications || null,
            subsidies: staticCrop.market?.subsidies || null,
            schemes: staticCrop.market?.schemes || null,
            support_agencies: staticCrop.market?.supportAgencies || null,
            
            // Advanced analytics
            ai_ml_iot: staticCrop.technology?.aiMlIot || null,
            smart_farming: staticCrop.technology?.smartFarming || null,
            sustainability_potential: staticCrop.sustainabilityDetails?.potential || null,
            waste_to_wealth: staticCrop.sustainabilityDetails?.wasteToWealth || null,
            climate_resilience: staticCrop.climateResilience ? staticCrop.climateResilience.join(', ') : null,
            carbon_footprint: staticCrop.sustainabilityDetails?.carbonFootprint || null,
            religious_use: staticCrop.cultural?.religiousUse || null,
            traditional_uses: staticCrop.cultural?.traditionalUses || null,
            gi_status: staticCrop.cultural?.giStatus || null,
            fun_fact: staticCrop.cultural?.funFact || null,
            key_takeaways: staticCrop.insights?.keyTakeaways || null,
            swot_strengths: staticCrop.insights?.swotStrengths || null,
            swot_weaknesses: staticCrop.insights?.swotWeaknesses || null,
            swot_opportunities: staticCrop.insights?.swotOpportunities || null,
            swot_threats: staticCrop.insights?.swotThreats || null,
            
            // Morphology fields
            root_system: staticCrop.morphology?.rootSystem || null,
            leaf: staticCrop.morphology?.leaf || null,
            flowering_season: staticCrop.morphology?.floweringSeason || null,
            inflorescence_type: staticCrop.morphology?.inflorescenceType || null,
            fruit_type: staticCrop.morphology?.fruitType || null,
            fruit_development: staticCrop.morphology?.fruitDevelopment || null,
            unique_morphology: staticCrop.morphology?.uniqueMorphology || null,
            edible_part: staticCrop.morphology?.ediblePart || null,
            
            // Genetics fields
            chromosome_number: staticCrop.genetics?.chromosomeNumber || null,
            breeding_methods: staticCrop.genetics?.breedingMethods || null,
            biotech_advances: staticCrop.genetics?.biotechAdvances || null,
            hybrid_varieties: staticCrop.genetics?.hybridVarieties || null,
            patents: staticCrop.genetics?.patents || null,
            research_institutes: staticCrop.genetics?.researchInstitutes || null,
            
            // Reproductive biology fields
            pollination: staticCrop.reproduction?.pollination || null,
            propagation_type: staticCrop.reproduction?.propagationType || null,
            planting_material: staticCrop.reproduction?.plantingMaterial || null,
            germination_percent: staticCrop.reproduction?.germinationPercent || null,
            rootstock_compatibility: staticCrop.reproduction?.rootstockCompatibility || null,
            nursery_practices: staticCrop.reproduction?.nurseryPractices || null,
            training_system: staticCrop.reproduction?.trainingSystem || null,
            
            // Variety-specific fields
            variety_name: staticCrop.varieties?.[0]?.name || null,
            yield: staticCrop.varieties?.[0]?.yield || null,
            variety_features: staticCrop.varieties?.[0]?.characteristics ? staticCrop.varieties[0].characteristics.join(', ') : null,
            variety_suitability: staticCrop.varieties?.[0]?.zone || null,
            market_demand: staticCrop.economics?.marketDemand || null,
            
            varieties: (staticCrop.varieties || []).map(v => ({
              id: v.id,
              name: v.name,
              duration: v.duration || null,
              yield_potential: v.yield || null,
              suitable_states: v.states || null,
              disease_resistance: v.resistance || null,
              special_features: v.characteristics || null,
              grain_quality: v.grainQuality || null,
              description: null,
              zone: v.zone || null,
              premium_market: v.premiumMarket || false,
              late_sowing_suitable: v.lateSowingSuitable || false,
              irrigation_responsive: v.irrigationResponsive || false,
              certified_seed_available: v.certifiedSeedAvailable || false,
            })),
          };

          setCrop(mapped);
          setError(null);
          return;
        }

        setError(`Could not find crop: ${cropName}`);
      } catch (err) {
        console.error('Error fetching crop:', err);
        setError('Failed to load crop data');
      } finally {
        setLoading(false);
      }
    };

    fetchCrop();
  }, [cropName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-leaf-light to-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-crop-green" />
          <p className="text-muted-foreground">Loading crop data...</p>
        </div>
      </div>
    );
  }

  if (error || !crop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-leaf-light to-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Crop Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              {error || `Could not find crop: ${cropName}`}
            </p>
            <Button onClick={onBack}>Back to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderStatCard = (title: string, value: string | number, icon: any, color: string) => (
    <Card className="hover:shadow-elegant transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${color}`}>
          {value}
        </div>
        <p className="text-sm text-muted-foreground">Available {title.toLowerCase()}</p>
      </CardContent>
    </Card>
  );

  const getCropStats = () => {
    const varieties = crop.varieties?.length || 0;
    const states = crop.varieties ? 
      [...new Set(crop.varieties.flatMap(v => v.suitable_states || []))].length : 0;
    
    // Try to extract yield from average_yield field
    let avgYield = 0;
    if (crop.average_yield) {
      const yieldMatch = crop.average_yield.match(/(\d+)/);
      avgYield = yieldMatch ? parseInt(yieldMatch[1]) : 0;
    }
    
    // Try to extract duration from varieties
    let avgDuration = 0;
    if (crop.varieties && crop.varieties.length > 0) {
      const durations = crop.varieties
        .map(v => v.duration)
        .filter(d => d)
        .map(d => {
          const match = d?.match(/(\d+)/);
          return match ? parseInt(match[1]) : 0;
        });
      avgDuration = durations.length > 0 ? 
        Math.round(durations.reduce((sum, d) => sum + d, 0) / durations.length) : 0;
    }
    
    return { varieties, avgYield, states, avgDuration };
  };

  const stats = getCropStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white bg-opacity-80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 text-gray-800 hover:text-yellow-600 hover:bg-yellow-50">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="flex-1">
              <h1 className="text-[clamp(24px,3vw,32px)] font-bold text-gray-800">
                {crop.name}
              </h1>
              <p className="text-gray-600 italic">
                {crop.scientific_name || 'Scientific name not available'}
              </p>
            </div>
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
              {crop.season ? crop.season.join(', ') : 'Season not specified'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          {/* Tab Navigation */}
          <div className="overflow-x-auto">
            <TabsList className="inline-flex w-max min-w-full bg-white border border-gray-200 p-1">
              <TabsTrigger value="overview" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <Info className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="morphology" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <Leaf className="h-4 w-4" />
                <span className="hidden sm:inline">Morphology</span>
              </TabsTrigger>
              <TabsTrigger value="genetics" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <Sprout className="h-4 w-4" />
                <span className="hidden sm:inline">Genetics</span>
              </TabsTrigger>
              <TabsTrigger value="varieties" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <Sprout className="h-4 w-4" />
                <span className="hidden sm:inline">Varieties</span>
              </TabsTrigger>
              <TabsTrigger value="reproduction" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <Apple className="h-4 w-4" />
                <span className="hidden sm:inline">Reproduction</span>
              </TabsTrigger>
              <TabsTrigger value="cultivation" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <Leaf className="h-4 w-4" />
                <span className="hidden sm:inline">Cultivation</span>
              </TabsTrigger>
              <TabsTrigger value="management" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Management</span>
              </TabsTrigger>
              <TabsTrigger value="nutrition" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <Apple className="h-4 w-4" />
                <span className="hidden sm:inline">Nutrition</span>
              </TabsTrigger>
              <TabsTrigger value="government" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Government</span>
              </TabsTrigger>
              <TabsTrigger value="market" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Market</span>
              </TabsTrigger>
              <TabsTrigger value="pests-diseases" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <Bug className="h-4 w-4" />
                <span className="hidden sm:inline">Pests & Diseases</span>
              </TabsTrigger>
              <TabsTrigger value="nematodes" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Nematodes</span>
              </TabsTrigger>
              <TabsTrigger value="disorders" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden sm:inline">Disorders</span>
              </TabsTrigger>
              <TabsTrigger value="harvest" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Harvest</span>
              </TabsTrigger>
              <TabsTrigger value="technology" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Technology</span>
              </TabsTrigger>
              <TabsTrigger value="cultural" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <Info className="h-4 w-4" />
                <span className="hidden sm:inline">Cultural</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <Wheat className="h-4 w-4" />
                <span className="hidden sm:inline">Insights</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 p-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Wheat className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">{crop.name}</h1>
                    <p className="text-gray-600 italic">{crop.scientific_name}</p>
                  </div>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed max-w-3xl">
                  {crop.description || 'A comprehensive overview of this important agricultural crop with detailed information about cultivation, management, and economic aspects.'}
                </p>
              </div>
            </div>

            {/* Quick Stats with Enhanced Design */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                    <Sprout className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Varieties</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.varieties}</p>
                  </div>
                </div>
                <div className="w-full bg-yellow-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{width: `${Math.min((stats.varieties / 10) * 100, 100)}%`}}></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">States</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.states}</p>
                  </div>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: `${Math.min((stats.states / 20) * 100, 100)}%`}}></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Yield</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.avgYield}</p>
                  </div>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-purple-400 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Duration</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.avgDuration}</p>
                  </div>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
              </div>
            </div>

            {/* Quick Facts with Enhanced Design */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Botanical Classification */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-emerald-400 rounded-lg flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Botanical Classification</h3>
                    <p className="text-sm text-gray-600">Taxonomic and biological details</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-100">
                      <span className="font-medium text-gray-700">Family</span>
                      <span className="text-gray-600">{crop.family || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-100">
                      <span className="font-medium text-gray-700">Scientific Name</span>
                      <span className="text-gray-600 italic">{crop.scientific_name || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-100">
                      <span className="font-medium text-gray-700">Season</span>
                      <span className="text-gray-600">{crop.season ? crop.season.join(', ') : 'Not specified'}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-100">
                      <span className="font-medium text-gray-700">Origin</span>
                      <span className="text-gray-600">{crop.origin || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-100">
                      <span className="font-medium text-gray-700">Growth Habit</span>
                      <span className="text-gray-600">{crop.growth_habit || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-100">
                      <span className="font-medium text-gray-700">Life Span</span>
                      <span className="text-gray-600">{crop.life_span || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Major Growing States */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Major Growing States</h3>
                    <p className="text-sm text-gray-600">Geographic distribution across India</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {crop.varieties ? 
                      [...new Set(crop.varieties.flatMap(v => v.suitable_states || []))].slice(0, 12).map((state) => (
                        <Badge key={state} className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 transition-colors">
                          {state}
                        </Badge>
                      )) : []
                    }
                    {crop.varieties && [...new Set(crop.varieties.flatMap(v => v.suitable_states || []))].length > 12 && (
                      <Badge className="bg-gray-100 text-gray-600 border-gray-200">
                        +{[...new Set(crop.varieties.flatMap(v => v.suitable_states || []))].length - 12} more
                      </Badge>
                    )}
                  </div>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Primary growing regions with optimal conditions</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Climate & Soil with Enhanced Design */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Climate Requirements */}
              <div className="bg-gradient-to-br from-sky-50 to-cyan-50 border border-sky-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-sky-400 rounded-lg flex items-center justify-center">
                    <Thermometer className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Climate Requirements</h3>
                    <p className="text-sm text-gray-600">Environmental conditions for optimal growth</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-sky-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <Thermometer className="h-4 w-4 text-red-500" />
                      </div>
                      <span className="font-semibold text-gray-800">Temperature</span>
                    </div>
                    <p className="text-gray-600 ml-11">{crop.temperature_range || 'Not specified'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-sky-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Droplets className="h-4 w-4 text-blue-500" />
                      </div>
                      <span className="font-semibold text-gray-800">Rainfall</span>
                    </div>
                    <p className="text-gray-600 ml-11">{crop.rainfall_requirement || 'Not specified'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-sky-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Cloud className="h-4 w-4 text-green-500" />
                      </div>
                      <span className="font-semibold text-gray-800">Humidity</span>
                    </div>
                    <p className="text-gray-600 ml-11">{crop.humidity_range || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Soil Requirements */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-amber-400 rounded-lg flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Soil Requirements</h3>
                    <p className="text-sm text-gray-600">Soil characteristics for successful cultivation</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-amber-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Leaf className="h-4 w-4 text-amber-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Soil Types</span>
                    </div>
                    <div className="ml-11">
                      {crop.soil_type ? (
                        <div className="flex flex-wrap gap-1">
                          {crop.soil_type.map((type, index) => (
                            <Badge key={index} className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600">Not specified</p>
                      )}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-amber-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-purple-500" />
                      </div>
                      <span className="font-semibold text-gray-800">pH Range</span>
                    </div>
                    <p className="text-gray-600 ml-11">{crop.soil_ph || 'Not specified'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-amber-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Droplets className="h-4 w-4 text-blue-500" />
                      </div>
                      <span className="font-semibold text-gray-800">Drainage</span>
                    </div>
                    <p className="text-gray-600 ml-11">{crop.drainage_requirement || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Varieties Tab */}
          <TabsContent value="varieties" className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center">
                    <Sprout className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">Crop Varieties</h1>
                    <p className="text-gray-600">Comprehensive variety profiles with detailed specifications</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Sprout className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Total Varieties</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{crop.varieties?.length || 0}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Coverage</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{crop.varieties ? [...new Set(crop.varieties.flatMap(v => v.suitable_states || []))].length : 0} States</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-yellow-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Premium</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">{crop.varieties?.filter(v => v.premium_market).length || 0} Varieties</p>
                  </div>
                </div>
              </div>
            </div>

            {crop.varieties && crop.varieties.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {crop.varieties.map((variety, index) => (
                  <div key={variety.id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:border-green-300 group">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Sprout className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{variety.name}</h3>
                          <p className="text-sm text-gray-600">Variety #{index + 1}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          {variety.zone || 'General'}
                        </Badge>
                        {variety.premium_market && (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
                            Premium
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white rounded-lg p-4 border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="h-3 w-3 text-green-600" />
                          </div>
                          <span className="font-medium text-gray-700 text-sm">Yield</span>
                        </div>
                        <p className="text-lg font-bold text-gray-800">{variety.yield_potential || 'Not specified'}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Clock className="h-3 w-3 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-700 text-sm">Duration</span>
                        </div>
                        <p className="text-lg font-bold text-gray-800">{variety.duration || 'Not specified'}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Star className="h-3 w-3 text-purple-600" />
                          </div>
                          <span className="font-medium text-gray-700 text-sm">Quality</span>
                        </div>
                        <p className="text-sm font-medium text-gray-800">{variety.grain_quality || 'Not specified'}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                            <MapPin className="h-3 w-3 text-orange-600" />
                          </div>
                          <span className="font-medium text-gray-700 text-sm">States</span>
                        </div>
                        <p className="text-sm font-medium text-gray-800">{variety.suitable_states?.length || 0} States</p>
                      </div>
                                         </div>

                     {/* Suitable States */}
                     <div className="mb-6">
                       <div className="flex items-center gap-2 mb-3">
                         <div className="w-5 h-5 bg-blue-100 rounded-lg flex items-center justify-center">
                           <MapPin className="h-3 w-3 text-blue-600" />
                         </div>
                         <span className="font-semibold text-gray-800">Suitable States</span>
                       </div>
                       <div className="flex flex-wrap gap-2">
                         {variety.suitable_states ? variety.suitable_states.slice(0, 8).map((state) => (
                           <Badge key={state} className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 transition-colors">
                             {state}
                           </Badge>
                         )) : []}
                         {variety.suitable_states && variety.suitable_states.length > 8 && (
                           <Badge className="bg-gray-100 text-gray-600 border-gray-200">
                             +{variety.suitable_states.length - 8} more
                           </Badge>
                         )}
                       </div>
            </div>

                     {/* Special Features */}
                     {variety.special_features && variety.special_features.length > 0 && (
                       <div className="mb-6">
                         <div className="flex items-center gap-2 mb-3">
                           <div className="w-5 h-5 bg-green-100 rounded-lg flex items-center justify-center">
                             <Star className="h-3 w-3 text-green-600" />
                           </div>
                           <span className="font-semibold text-gray-800">Special Features</span>
                         </div>
                         <div className="flex flex-wrap gap-2">
                           {variety.special_features.slice(0, 4).map((feature, idx) => (
                             <Badge key={idx} className="bg-green-100 text-green-800 border-green-200">
                               {feature}
                             </Badge>
                           ))}
                           {variety.special_features.length > 4 && (
                             <Badge className="bg-gray-100 text-gray-600 border-gray-200">
                               +{variety.special_features.length - 4} more
                             </Badge>
                           )}
                         </div>
                       </div>
                     )}

                     {/* Disease Resistance */}
                     {variety.disease_resistance && variety.disease_resistance.length > 0 && (
                       <div className="mb-6">
                         <div className="flex items-center gap-2 mb-3">
                           <div className="w-5 h-5 bg-red-100 rounded-lg flex items-center justify-center">
                             <Shield className="h-3 w-3 text-red-600" />
                           </div>
                           <span className="font-semibold text-gray-800">Disease Resistance</span>
                         </div>
                         <div className="flex flex-wrap gap-2">
                           {variety.disease_resistance.slice(0, 3).map((disease, idx) => (
                             <Badge key={idx} className="bg-red-100 text-red-800 border-red-200">
                               {disease}
                             </Badge>
                           ))}
                           {variety.disease_resistance.length > 3 && (
                             <Badge className="bg-gray-100 text-gray-600 border-gray-200">
                               +{variety.disease_resistance.length - 3} more
                             </Badge>
                           )}
                         </div>
                       </div>
                     )}

                     {/* Characteristics */}
                     <div className="flex flex-wrap gap-2 mb-4">
                       {variety.premium_market && (
                         <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                           Premium Market
                         </Badge>
                       )}
                       {variety.late_sowing_suitable && (
                         <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                           Late Sowing
                         </Badge>
                       )}
                       {variety.irrigation_responsive && (
                         <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                           Irrigation Responsive
                         </Badge>
                       )}
                       {variety.certified_seed_available && (
                         <Badge className="bg-green-100 text-green-800 border-green-200">
                           Certified Seed
                         </Badge>
                       )}
                     </div>

                     {/* Description */}
                     {variety.description && (
                       <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                         <p className="text-sm text-gray-700 leading-relaxed">
                           {variety.description}
                         </p>
                       </div>
                     )}
                    </div>
                ))}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-12 text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sprout className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">No Varieties Available</h3>
                <p className="text-gray-600 max-w-prose mx-auto text-lg">
                  Variety information has not been added for this crop yet. Check back later for detailed variety profiles.
                </p>
                <div className="mt-6 flex justify-center">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-500">Variety data will include yield potential, disease resistance, and regional suitability</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Cultivation Tab */}
          <TabsContent value="cultivation" className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center">
                    <Sprout className="h-8 w-8 text-white" />
                  </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Cultivation Guide</h1>
                    <p className="text-gray-600">Complete growing practices and management techniques</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Sprout className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Land Prep</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{crop.land_preparation?.length || 0} Steps</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Sowing</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{crop.sowing_time ? 'Ready' : 'Pending'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Thermometer className="h-4 w-4 text-orange-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Climate</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">{crop.optimum_temp ? 'Set' : 'Pending'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <Leaf className="h-4 w-4 text-red-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Weed Control</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{crop.weed_control_method ? 'Ready' : 'Pending'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Land Preparation */}
              {crop.land_preparation && crop.land_preparation.length > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center">
                      <Sprout className="h-6 w-6 text-white" />
                </div>
                <div>
                      <h3 className="text-xl font-bold text-gray-800">Land Preparation</h3>
                      <p className="text-sm text-gray-600">Essential steps for optimal soil conditions</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {crop.land_preparation.map((step, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-green-100">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-sm font-bold text-green-600">{index + 1}</span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sowing Information */}
              {crop.sowing_time && (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Sowing Information</h3>
                      <p className="text-sm text-gray-600">Timing and spacing guidelines</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Sowing Time</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.sowing_time}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Sprout className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Seed Rate</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.seed_rate || 'Not specified'}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Row Spacing</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.row_spacing || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Climate & Soil Requirements */}
              {(crop.optimum_temp || crop.tolerable_temp || crop.altitude || crop.soil_texture) && (
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-orange-400 rounded-lg flex items-center justify-center">
                      <Thermometer className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Climate & Soil</h3>
                      <p className="text-sm text-gray-600">Environmental requirements</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-orange-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <Thermometer className="h-4 w-4 text-red-500" />
                        </div>
                        <span className="font-semibold text-gray-800">Optimum Temperature</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.optimum_temp || 'Not specified'}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-orange-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Thermometer className="h-4 w-4 text-orange-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Tolerable Temperature</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.tolerable_temp || 'Not specified'}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-orange-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Altitude</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.altitude || 'Not specified'}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-orange-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                          <Leaf className="h-4 w-4 text-amber-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Soil Texture</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.soil_texture || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Weed Management */}
              {(crop.common_weeds || crop.weed_control_method) && (
                <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-red-400 rounded-lg flex items-center justify-center">
                      <Leaf className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Weed Management</h3>
                      <p className="text-sm text-gray-600">Control strategies and methods</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-red-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <Leaf className="h-4 w-4 text-red-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Common Weeds</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.common_weeds || 'Not specified'}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-red-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                          <Shield className="h-4 w-4 text-pink-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Control Methods</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.weed_control_method || 'Not specified'}</p>
                    </div>
                    {crop.critical_period_weed && (
                      <div className="bg-white rounded-lg p-4 border border-red-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Clock className="h-4 w-4 text-orange-600" />
                          </div>
                          <span className="font-semibold text-gray-800">Critical Period</span>
                        </div>
                        <p className="text-gray-700 ml-11">{crop.critical_period_weed}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Management Tab */}
          <TabsContent value="management" className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 p-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-purple-400 rounded-full flex items-center justify-center">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">Crop Management</h1>
                    <p className="text-gray-600">Fertilizer, irrigation, and water management strategies</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-white rounded-lg p-4 border border-purple-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Shield className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Fertilizers</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{crop.fertilizer_requirement?.length || 0} Types</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-purple-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Droplets className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Irrigation</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{crop.irrigation_schedule?.length || 0} Stages</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-purple-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                        <Droplets className="h-4 w-4 text-cyan-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Water Quality</span>
                    </div>
                    <p className="text-2xl font-bold text-cyan-600">{crop.water_quality ? 'Set' : 'Pending'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Fertilizer Management */}
              {crop.fertilizer_requirement && crop.fertilizer_requirement.length > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Fertilizer Management</h3>
                      <p className="text-sm text-gray-600">Essential nutrient requirements</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {crop.fertilizer_requirement.map((fertilizer, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-green-100">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-sm font-bold text-green-600">{index + 1}</span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{fertilizer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* NPK & Micronutrients */}
              {(crop.npk_n || crop.npk_p || crop.npk_k || crop.micronutrient_needs) && (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">NPK & Micronutrients</h3>
                      <p className="text-sm text-gray-600">Detailed nutrient specifications</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Nitrogen (N)</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.npk_n || 'Not specified'}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Phosphorus (P)</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.npk_p || 'Not specified'}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-orange-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Potassium (K)</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.npk_k || 'Not specified'}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Star className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Micronutrients</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.micronutrient_needs || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Irrigation Schedule */}
              {crop.irrigation_schedule && crop.irrigation_schedule.length > 0 && (
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-cyan-400 rounded-lg flex items-center justify-center">
                      <Droplets className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Irrigation Schedule</h3>
                      <p className="text-sm text-gray-600">Watering timeline and requirements</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {crop.irrigation_schedule.map((schedule, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-cyan-100">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-sm font-bold text-cyan-600">{index + 1}</span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{schedule}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Water Management */}
              {(crop.water_quality || crop.water_requirement) && (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-indigo-400 rounded-lg flex items-center justify-center">
                      <Droplets className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Water Management</h3>
                      <p className="text-sm text-gray-600">Quality and quantity requirements</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-indigo-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <Droplets className="h-4 w-4 text-indigo-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Water Requirement</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.water_requirement || 'Not specified'}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-indigo-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Shield className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Water Quality</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.water_quality || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Nutrition Tab */}
          <TabsContent value="nutrition" className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center">
                    <Apple className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">Nutritional Profile</h1>
                    <p className="text-gray-600">Comprehensive nutritional information and health benefits</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-red-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Calories</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{crop.calories || 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Protein</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{crop.protein || 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-yellow-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Carbs</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">{crop.carbohydrates || 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Fiber</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{crop.fiber || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Nutritional Info */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center">
                    <Apple className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Basic Nutrition</h3>
                    <p className="text-sm text-gray-600">Macronutrient composition</p>
                  </div>
                </div>
                {crop.nutritional_info ? (
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <p className="text-sm text-gray-700 leading-relaxed">{crop.nutritional_info}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-green-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-red-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Calories</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.calories || 'Not specified'}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-green-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Protein</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.protein || 'Not specified'}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-green-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-yellow-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Carbohydrates</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.carbohydrates || 'Not specified'}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-green-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-orange-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Fat</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.fat || 'Not specified'}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-green-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Fiber</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.fiber || 'Not specified'}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Detailed Nutritional Components */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-purple-400 rounded-lg flex items-center justify-center">
                    <Info className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Nutritional Components</h3>
                    <p className="text-sm text-gray-600">Vitamins, minerals, and health benefits</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-purple-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Star className="h-4 w-4 text-yellow-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Vitamins</span>
                    </div>
                    <p className="text-gray-700 ml-11">{crop.vitamins || 'Not specified'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-purple-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Minerals</span>
                    </div>
                    <p className="text-gray-700 ml-11">{crop.minerals || 'Not specified'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-purple-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Leaf className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Bioactive Compounds</span>
                    </div>
                    <p className="text-gray-700 ml-11">{crop.bioactive_compounds || 'Not specified'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-purple-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <Shield className="h-4 w-4 text-red-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Health Benefits</span>
                    </div>
                    <p className="text-gray-700 ml-11">{crop.health_benefits || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Market Tab */}
          <TabsContent value="market" className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 p-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">Market & Economics</h1>
                    <p className="text-gray-600">Commercial viability and market trends analysis</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-white rounded-lg p-4 border border-yellow-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Yield</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{crop.average_yield || 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-yellow-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Price</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{crop.market_price || 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-yellow-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Cost</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{crop.cost_of_cultivation || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Economics & Market */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Economics & Market</h3>
                    <p className="text-sm text-gray-600">Financial performance indicators</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Average Yield</span>
                    </div>
                    <p className="text-gray-700 ml-11">{crop.average_yield || 'Not specified'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Market Price</span>
                    </div>
                    <p className="text-gray-700 ml-11">{crop.market_price || 'Not specified'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Cost of Cultivation</span>
                    </div>
                    <p className="text-gray-700 ml-11">{crop.cost_of_cultivation || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Market Trends */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Market Trends</h3>
                    <p className="text-sm text-gray-600">Innovation and sustainability practices</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-yellow-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Star className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Innovations</span>
                    </div>
                    <div className="ml-11">
                      {crop.innovations && crop.innovations.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                          {crop.innovations.map((innovation, index) => (
                            <Badge key={index} className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                              {innovation}
                        </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-700">Not specified</p>
                      )}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-yellow-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Leaf className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Sustainability</span>
                    </div>
                    <div className="ml-11">
                      {crop.sustainability_practices && crop.sustainability_practices.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {crop.sustainability_practices.map((practice, index) => (
                            <Badge key={index} className="bg-green-100 text-green-800 border-green-200 text-xs">
                              {practice}
                      </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-700">Not specified</p>
                    )}
                  </div>
                </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Pests & Diseases Tab */}
          <TabsContent value="pests-diseases" className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 p-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-red-400 rounded-full flex items-center justify-center">
                    <Bug className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">Pests & Diseases</h1>
                    <p className="text-gray-600">Comprehensive pest and disease management information</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-white rounded-lg p-4 border border-red-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <Bug className="h-4 w-4 text-red-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Pests</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{crop.pest_name ? '1 Main' : '0'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-red-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Shield className="h-4 w-4 text-orange-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Diseases</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">{crop.disease_name ? '1 Main' : '0'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-red-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Additional</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{((crop.additional_pests?.length || 0) + (crop.additional_diseases?.length || 0))}</p>
                  </div>
                </div>
              </div>
            </div>

                        {/* Main Pest and Disease */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Detailed Pest Information */}
              {crop.pest_name && (
                <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-red-400 rounded-lg flex items-center justify-center">
                      <Bug className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Pest Details</h3>
                      <p className="text-sm text-gray-600">Main pest affecting this crop</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {/* Pest Image */}
                    {crop.pest_image && (
                      <div className="mb-4">
                        <img 
                          src={crop.pest_image} 
                          alt={`${crop.pest_name} pest`}
                          className="w-full h-48 object-cover rounded-lg border border-red-200"
                        />
                      </div>
                    )}
                    <div className="bg-white rounded-lg p-4 border border-red-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <Bug className="h-4 w-4 text-red-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Pest Name</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.pest_name}</p>
                    </div>
                    {crop.pest_symptoms && (
                      <div className="bg-white rounded-lg p-4 border border-red-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Activity className="h-4 w-4 text-orange-600" />
                          </div>
                          <span className="font-semibold text-gray-800">Symptoms</span>
                        </div>
                        <p className="text-gray-700 ml-11">{crop.pest_symptoms}</p>
                      </div>
                    )}
                    {crop.pest_life_cycle && (
                      <div className="bg-white rounded-lg p-4 border border-red-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Activity className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-semibold text-gray-800">Life Cycle</span>
                        </div>
                        <p className="text-gray-700 ml-11">{crop.pest_life_cycle}</p>
                      </div>
                    )}
                    {crop.pest_etl && (
                      <div className="bg-white rounded-lg p-4 border border-red-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Activity className="h-4 w-4 text-yellow-600" />
                          </div>
                          <span className="font-semibold text-gray-800">ETL (Economic Threshold Level)</span>
                        </div>
                        <p className="text-gray-700 ml-11">{crop.pest_etl}</p>
                      </div>
                    )}
                    {crop.pest_management && (
                      <div className="bg-white rounded-lg p-4 border border-red-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <Shield className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="font-semibold text-gray-800">Management</span>
                        </div>
                        <p className="text-gray-700 ml-11">{crop.pest_management}</p>
                      </div>
                    )}
                    {crop.pest_biocontrol && (
                      <div className="bg-white rounded-lg p-4 border border-red-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Leaf className="h-4 w-4 text-purple-600" />
                          </div>
                          <span className="font-semibold text-gray-800">Biological Control</span>
                        </div>
                        <p className="text-gray-700 ml-11">{crop.pest_biocontrol}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Detailed Disease Information */}
              {crop.disease_name && (
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-orange-400 rounded-lg flex items-center justify-center">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Disease Details</h3>
                      <p className="text-sm text-gray-600">Main disease affecting this crop</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {/* Disease Image */}
                    {crop.disease_image && (
                      <div className="mb-4">
                        <img 
                          src={crop.disease_image} 
                          alt={`${crop.disease_name} disease`}
                          className="w-full h-48 object-cover rounded-lg border border-orange-200"
                        />
                      </div>
                    )}
                    <div className="bg-white rounded-lg p-4 border border-orange-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Shield className="h-4 w-4 text-orange-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Disease Name</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.disease_name}</p>
                    </div>
                    {crop.disease_causal_agent && (
                      <div className="bg-white rounded-lg p-4 border border-orange-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <Bug className="h-4 w-4 text-red-600" />
                          </div>
                          <span className="font-semibold text-gray-800">Causal Agent</span>
                        </div>
                        <p className="text-gray-700 ml-11">{crop.disease_causal_agent}</p>
                      </div>
                    )}
                    {crop.disease_symptoms && (
                      <div className="bg-white rounded-lg p-4 border border-orange-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Activity className="h-4 w-4 text-yellow-600" />
                          </div>
                          <span className="font-semibold text-gray-800">Symptoms</span>
                        </div>
                        <p className="text-gray-700 ml-11">{crop.disease_symptoms}</p>
                      </div>
                    )}
                    {crop.disease_life_cycle && (
                      <div className="bg-white rounded-lg p-4 border border-orange-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Activity className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-semibold text-gray-800">Life Cycle</span>
                        </div>
                        <p className="text-gray-700 ml-11">{crop.disease_life_cycle}</p>
                      </div>
                    )}
                    {crop.disease_management && (
                      <div className="bg-white rounded-lg p-4 border border-orange-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <Shield className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="font-semibold text-gray-800">Management</span>
                        </div>
                        <p className="text-gray-700 ml-11">{crop.disease_management}</p>
                      </div>
                    )}
                    {crop.disease_biocontrol && (
                      <div className="bg-white rounded-lg p-4 border border-orange-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Leaf className="h-4 w-4 text-emerald-600" />
                          </div>
                          <span className="font-semibold text-gray-800">Biological Control</span>
                        </div>
                        <p className="text-gray-700 ml-11">{crop.disease_biocontrol}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Fallback for basic pest/disease lists */}
              {!crop.pest_name && crop.pest_list && crop.pest_list.length > 0 && (
                <Card className="bg-white border border-gray-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <Bug className="h-5 w-5 text-red-500" />
                      Common Pests
                  </CardTitle>
                </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {crop.pest_list.map((pest, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">{pest}</span>
                        </div>
                      ))}
                    </div>
                </CardContent>
              </Card>
              )}

              {!crop.disease_name && crop.disease_list && crop.disease_list.length > 0 && (
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <Shield className="h-5 w-5 text-orange-500" />
                      Common Diseases
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {crop.disease_list.map((disease, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">{disease}</span>
            </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Additional Pests and Diseases */}
            {(crop.additional_pests && crop.additional_pests.length > 0) || (crop.additional_diseases && crop.additional_diseases.length > 0) ? (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Additional Pests & Diseases</h3>
                  <p className="text-gray-600">Comprehensive list of other common pests and diseases affecting this crop</p>
            </div>

                {/* Additional Pests */}
                {crop.additional_pests && crop.additional_pests.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {crop.additional_pests.map((pest, index) => (
                      <Card key={index} className="bg-white border border-gray-200">
                    <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-gray-800">
                            <Bug className="h-5 w-5 text-red-500" />
                            {pest.name}
                      </CardTitle>
                    </CardHeader>
                        <CardContent className="space-y-4 text-sm text-gray-600">
                          {/* Pest Image */}
                          {pest.image && (
                            <div className="mb-4">
                              <img 
                                src={pest.image} 
                                alt={`${pest.name} pest`}
                                className="w-full h-48 object-cover rounded-lg border border-gray-200"
                              />
                            </div>
                          )}
                        <div>
                            <span className="font-medium">Symptoms:</span> {pest.symptoms}
                        </div>
                        <div>
                            <span className="font-medium">Life Cycle:</span> {pest.lifeCycle}
                        </div>
                          <div>
                            <span className="font-medium">ETL:</span> {pest.etl}
                      </div>
                      <div>
                            <span className="font-medium">Management:</span> {pest.management}
                        </div>
                          <div>
                            <span className="font-medium">Biological Control:</span> {pest.biocontrol}
                      </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Additional Diseases */}
                {crop.additional_diseases && crop.additional_diseases.length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    {crop.additional_diseases.map((disease, index) => (
                      <Card key={index} className="bg-white border border-gray-200">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-gray-800">
                            <Shield className="h-5 w-5 text-orange-500" />
                            {disease.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-gray-600">
                          {/* Disease Image */}
                          {disease.image && (
                            <div className="mb-4">
                              <img 
                                src={disease.image} 
                                alt={`${disease.name} disease`}
                                className="w-full h-48 object-cover rounded-lg border border-gray-200"
                              />
                            </div>
                          )}
                          <div>
                            <span className="font-medium">Causal Agent:</span> {disease.causalAgent}
                          </div>
                          <div>
                            <span className="font-medium">Symptoms:</span> {disease.symptoms}
                          </div>
                          <div>
                            <span className="font-medium">Life Cycle:</span> {disease.lifeCycle}
                          </div>
                          <div>
                            <span className="font-medium">Management:</span> {disease.management}
                          </div>
                          <div>
                            <span className="font-medium">Biological Control:</span> {disease.biocontrol}
                          </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
                )}
              </div>
            ) : null}
          </TabsContent>

          {/* Nematodes Tab */}
          <TabsContent value="nematodes" className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 p-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-purple-400 rounded-full flex items-center justify-center">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">Nematodes</h1>
                    <p className="text-gray-600">Microscopic soil pests and their management</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-white rounded-lg p-4 border border-purple-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Shield className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Main Nematode</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{crop.nematode_name ? 'Present' : 'None'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-purple-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-red-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Symptoms</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{crop.nematode_symptoms ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-purple-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Shield className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Management</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{crop.nematode_management ? 'Available' : 'Pending'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {crop.nematode_name ? (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-purple-400 rounded-lg flex items-center justify-center">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Nematode Details</h3>
                      <p className="text-sm text-gray-600">Microscopic soil pest information</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {/* Nematode Image */}
                    {crop.nematode_image && (
                      <div className="mb-4">
                        <img 
                          src={crop.nematode_image} 
                          alt={`${crop.nematode_name} nematode`}
                          className="w-full h-48 object-cover rounded-lg border border-purple-200"
                        />
                      </div>
                    )}
                    <div className="bg-white rounded-lg p-4 border border-purple-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Shield className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Nematode Name</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.nematode_name}</p>
                    </div>
                    {crop.nematode_symptoms && (
                      <div className="bg-white rounded-lg p-4 border border-purple-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <Activity className="h-4 w-4 text-red-600" />
                          </div>
                          <span className="font-semibold text-gray-800">Symptoms</span>
                        </div>
                        <p className="text-gray-700 ml-11">{crop.nematode_symptoms}</p>
                      </div>
                    )}
                    {crop.nematode_life_cycle && (
                      <div className="bg-white rounded-lg p-4 border border-purple-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Activity className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-semibold text-gray-800">Life Cycle</span>
                        </div>
                        <p className="text-gray-700 ml-11">{crop.nematode_life_cycle}</p>
                      </div>
                    )}
                    {crop.nematode_etl && (
                      <div className="bg-white rounded-lg p-4 border border-purple-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Activity className="h-4 w-4 text-yellow-600" />
                          </div>
                          <span className="font-semibold text-gray-800">ETL (Economic Threshold Level)</span>
                        </div>
                        <p className="text-gray-700 ml-11">{crop.nematode_etl}</p>
                      </div>
                    )}
                    {crop.nematode_management && (
                      <div className="bg-white rounded-lg p-4 border border-purple-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <Shield className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="font-semibold text-gray-800">Management</span>
                        </div>
                        <p className="text-gray-700 ml-11">{crop.nematode_management}</p>
                      </div>
                    )}
                    {crop.nematode_biocontrol && (
                      <div className="bg-white rounded-lg p-4 border border-purple-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Leaf className="h-4 w-4 text-emerald-600" />
                          </div>
                          <span className="font-semibold text-gray-800">Biological Control</span>
                        </div>
                        <p className="text-gray-700 ml-11">{crop.nematode_biocontrol}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-12 text-center hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No Nematode Data Available</h3>
                  <p className="text-gray-600 max-w-prose mx-auto">
                    Detailed nematode information has not been added for this crop yet
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Disorders Tab */}
          <TabsContent value="disorders" className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 p-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">Disorders</h1>
                    <p className="text-gray-600">Physiological and environmental disorders</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-white rounded-lg p-4 border border-amber-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Main Disorder</span>
                    </div>
                    <p className="text-2xl font-bold text-amber-600">{crop.disorder_name ? 'Present' : 'None'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-amber-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-red-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Symptoms</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{crop.disorder_symptoms ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-amber-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Impact</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{crop.disorder_impact ? 'Assessed' : 'Pending'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {crop.disorder_name ? (
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-amber-400 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Disorder Details</h3>
                      <p className="text-sm text-gray-600">Physiological disorder information</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {/* Disorder Image */}
                    {crop.disorder_image && (
                      <div className="mb-4">
                        <img 
                          src={crop.disorder_image} 
                          alt={`${crop.disorder_name} disorder`}
                          className="w-full h-48 object-cover rounded-lg border border-amber-200"
                        />
                      </div>
                    )}
                    <div className="bg-white rounded-lg p-4 border border-amber-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Disorder Name</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.disorder_name}</p>
                    </div>
                    {crop.disorder_cause && (
                      <div className="bg-white rounded-lg p-4 border border-amber-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <Activity className="h-4 w-4 text-red-600" />
                          </div>
                          <span className="font-semibold text-gray-800">Cause</span>
                        </div>
                        <p className="text-gray-700 ml-11">{crop.disorder_cause}</p>
                      </div>
                    )}
                    {crop.disorder_symptoms && (
                      <div className="bg-white rounded-lg p-4 border border-amber-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Activity className="h-4 w-4 text-yellow-600" />
                          </div>
                          <span className="font-semibold text-gray-800">Symptoms</span>
                        </div>
                        <p className="text-gray-700 ml-11">{crop.disorder_symptoms}</p>
                      </div>
                    )}
                    {crop.disorder_impact && (
                      <div className="bg-white rounded-lg p-4 border border-amber-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Activity className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-semibold text-gray-800">Impact</span>
                        </div>
                        <p className="text-gray-700 ml-11">{crop.disorder_impact}</p>
                      </div>
                    )}
                    {crop.disorder_control && (
                      <div className="bg-white rounded-lg p-4 border border-amber-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <Shield className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="font-semibold text-gray-800">Control Measures</span>
                        </div>
                        <p className="text-gray-700 ml-11">{crop.disorder_control}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-12 text-center hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No Disorder Data Available</h3>
                  <p className="text-gray-600 max-w-prose mx-auto">
                    Detailed disorder information has not been added for this crop yet
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Morphology Tab */}
          <TabsContent value="morphology" className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center">
                    <Leaf className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">Plant Morphology</h1>
                    <p className="text-gray-600">Physical structure and characteristics</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Leaf className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Root System</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{crop.root_system ? 'Set' : 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Leaf className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Leaves</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{crop.leaf ? 'Set' : 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-yellow-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Flowers</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">{crop.flowering_season ? 'Set' : 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Fruits</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{crop.fruit_type ? 'Set' : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Plant Morphology</h3>
                    <p className="text-sm text-gray-600">Physical structure and characteristics</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {crop.root_system && (
                    <div className="bg-white rounded-lg p-4 border border-green-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Leaf className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Root System</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.root_system}</p>
                    </div>
                  )}
                  {crop.leaf && (
                    <div className="bg-white rounded-lg p-4 border border-green-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Leaf className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Leaf Characteristics</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.leaf}</p>
                    </div>
                  )}
                  {crop.flowering_season && (
                    <div className="bg-white rounded-lg p-4 border border-green-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-yellow-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Flowering Season</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.flowering_season}</p>
                    </div>
                  )}
                  {crop.inflorescence_type && (
                    <div className="bg-white rounded-lg p-4 border border-green-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-orange-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Inflorescence Type</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.inflorescence_type}</p>
                    </div>
                  )}
                  {crop.fruit_type && (
                    <div className="bg-white rounded-lg p-4 border border-green-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Fruit Type</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.fruit_type}</p>
                    </div>
                  )}
                  {crop.fruit_development && (
                    <div className="bg-white rounded-lg p-4 border border-green-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-pink-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Fruit Development</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.fruit_development}</p>
                    </div>
                  )}
                  {crop.unique_morphology && (
                    <div className="bg-white rounded-lg p-4 border border-green-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <Star className="h-4 w-4 text-indigo-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Unique Features</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.unique_morphology}</p>
                    </div>
                  )}
                  {crop.edible_part && (
                    <div className="bg-white rounded-lg p-4 border border-green-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Apple className="h-4 w-4 text-emerald-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Edible Part</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.edible_part}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Genetics Tab */}
          <TabsContent value="genetics" className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center">
                    <Sprout className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">Genetic Information</h1>
                    <p className="text-gray-600">Breeding, biotechnology, and research advances</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Chromosomes</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{crop.chromosome_number ? 'Set' : 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Sprout className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Breeding</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{crop.breeding_methods ? 'Set' : 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Star className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Biotech</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{crop.biotech_advances ? 'Set' : 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-yellow-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Patents</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">{crop.patents ? 'Set' : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center">
                    <Sprout className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Genetic Information</h3>
                    <p className="text-sm text-gray-600">Breeding, biotechnology, and research advances</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {crop.chromosome_number && (
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Chromosome Number</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.chromosome_number}</p>
                    </div>
                  )}
                  {crop.breeding_methods && (
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Sprout className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Breeding Methods</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.breeding_methods}</p>
                    </div>
                  )}
                  {crop.biotech_advances && (
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Star className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Biotechnological Advances</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.biotech_advances}</p>
                    </div>
                  )}
                  {crop.hybrid_varieties && (
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-orange-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Hybrid Varieties</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.hybrid_varieties}</p>
                    </div>
                  )}
                  {crop.patents && (
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-yellow-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Patents/GI Tags</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.patents}</p>
                    </div>
                  )}
                  {crop.research_institutes && (
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-indigo-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Research Institutes</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.research_institutes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Reproduction Tab */}
          <TabsContent value="reproduction" className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 p-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-red-400 rounded-full flex items-center justify-center">
                    <Apple className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">Reproductive Biology</h1>
                    <p className="text-gray-600">Pollination, propagation, and growth practices</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-white rounded-lg p-4 border border-red-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-red-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Pollination</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{crop.pollination ? 'Set' : 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-red-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Sprout className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Propagation</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{crop.propagation_type ? 'Set' : 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-red-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Germination</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{crop.germination_percent ? 'Set' : 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-red-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Nursery</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{crop.nursery_practices ? 'Set' : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-red-400 rounded-lg flex items-center justify-center">
                    <Apple className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Reproductive Biology</h3>
                    <p className="text-sm text-gray-600">Pollination, propagation, and growth practices</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {crop.pollination && (
                    <div className="bg-white rounded-lg p-4 border border-red-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-red-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Pollination</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.pollination}</p>
                    </div>
                  )}
                  {crop.propagation_type && (
                    <div className="bg-white rounded-lg p-4 border border-red-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Sprout className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Propagation Type</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.propagation_type}</p>
                    </div>
                  )}
                  {crop.planting_material && (
                    <div className="bg-white rounded-lg p-4 border border-red-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Planting Material</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.planting_material}</p>
                    </div>
                  )}
                  {crop.germination_percent && (
                    <div className="bg-white rounded-lg p-4 border border-red-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-yellow-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Germination %</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.germination_percent}</p>
                    </div>
                  )}
                  {crop.rootstock_compatibility && (
                    <div className="bg-white rounded-lg p-4 border border-red-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Rootstock Compatibility</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.rootstock_compatibility}</p>
                    </div>
                  )}
                  {crop.nursery_practices && (
                    <div className="bg-white rounded-lg p-4 border border-red-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-indigo-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Nursery Practices</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.nursery_practices}</p>
                    </div>
                  )}
                  {crop.training_system && (
                    <div className="bg-white rounded-lg p-4 border border-red-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-emerald-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Training System</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.training_system}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Harvest Tab */}
          <TabsContent value="harvest" className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 p-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">Harvest & Post-Harvest</h1>
                    <p className="text-gray-600">Timing, tools, storage, and processing information</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-white rounded-lg p-4 border border-orange-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Clock className="h-4 w-4 text-orange-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Harvest Time</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">{crop.harvest_time ? 'Set' : 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-orange-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Maturity</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{crop.maturity_indicators ? 'Set' : 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-orange-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Storage</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{crop.storage_conditions ? 'Set' : 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-orange-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Shelf Life</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{crop.shelf_life ? 'Set' : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-orange-400 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Harvest & Post-Harvest</h3>
                    <p className="text-sm text-gray-600">Timing, tools, storage, and processing information</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {crop.harvest_time && (
                    <div className="bg-white rounded-lg p-4 border border-orange-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Clock className="h-4 w-4 text-orange-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Harvest Time</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.harvest_time}</p>
                    </div>
                  )}
                  {crop.maturity_indicators && (
                    <div className="bg-white rounded-lg p-4 border border-orange-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Maturity Indicators</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.maturity_indicators}</p>
                    </div>
                  )}
                  {crop.harvesting_tools && (
                    <div className="bg-white rounded-lg p-4 border border-orange-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Harvesting Tools</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.harvesting_tools}</p>
                    </div>
                  )}
                  {crop.post_harvest_losses && (
                    <div className="bg-white rounded-lg p-4 border border-orange-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-red-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Post-Harvest Losses</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.post_harvest_losses}</p>
                    </div>
                  )}
                  {crop.storage_conditions && (
                    <div className="bg-white rounded-lg p-4 border border-orange-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-indigo-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Storage Conditions</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.storage_conditions}</p>
                    </div>
                  )}
                  {crop.shelf_life && (
                    <div className="bg-white rounded-lg p-4 border border-orange-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Shelf Life</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.shelf_life}</p>
                    </div>
                  )}
                  {crop.processed_products && (
                    <div className="bg-white rounded-lg p-4 border border-orange-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-emerald-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Processed Products</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.processed_products}</p>
                    </div>
                  )}
                  {crop.packaging_types && (
                    <div className="bg-white rounded-lg p-4 border border-orange-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-yellow-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Packaging Types</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.packaging_types}</p>
                    </div>
                  )}
                  {crop.cold_chain && (
                    <div className="bg-white rounded-lg p-4 border border-orange-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-cyan-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Cold Chain Requirements</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.cold_chain}</p>
                    </div>
                  )}
                  {crop.ripening_characteristics && (
                    <div className="bg-white rounded-lg p-4 border border-orange-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-pink-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Ripening Characteristics</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.ripening_characteristics}</p>
                    </div>
                  )}
                  {crop.pre_cooling && (
                    <div className="bg-white rounded-lg p-4 border border-orange-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-slate-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Pre-Cooling Requirements</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.pre_cooling}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Government Tab */}
          <TabsContent value="government" className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">Government Support & Policy</h1>
                    <p className="text-gray-600">Subsidies, schemes, and regulatory information</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Shield className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Subsidies</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{crop.subsidies ? 'Available' : 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Schemes</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{crop.schemes ? 'Available' : 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Agencies</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{crop.support_agencies ? 'Available' : 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-yellow-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Certifications</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">{crop.certifications ? 'Required' : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Government Support & Policy</h3>
                    <p className="text-sm text-gray-600">Subsidies, schemes, and regulatory information</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {crop.subsidies && (
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Shield className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Available Subsidies</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.subsidies}</p>
                    </div>
                  )}
                  {crop.schemes && (
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Applicable Schemes</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.schemes}</p>
                    </div>
                  )}
                  {crop.support_agencies && (
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Support Agencies</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.support_agencies}</p>
                    </div>
                  )}
                  {crop.certifications && (
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-yellow-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Required Certifications</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.certifications}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Technology Tab */}
          <TabsContent value="technology" className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 p-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-purple-400 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">Technology & Innovation</h1>
                    <p className="text-gray-600">AI/ML, IoT, and smart farming applications</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-white rounded-lg p-4 border border-purple-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="font-semibold text-gray-800">AI/ML/IoT</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{crop.ai_ml_iot ? 'Available' : 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-purple-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-pink-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Smart Farming</span>
                    </div>
                    <p className="text-2xl font-bold text-pink-600">{crop.smart_farming ? 'Available' : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-purple-400 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Technology & Innovation</h3>
                    <p className="text-sm text-gray-600">AI/ML, IoT, and smart farming applications</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {crop.ai_ml_iot && (
                    <div className="bg-white rounded-lg p-4 border border-purple-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <TrendingUp className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="font-semibold text-gray-800">AI/ML/IoT Use Cases</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.ai_ml_iot}</p>
                    </div>
                  )}
                  {crop.smart_farming && (
                    <div className="bg-white rounded-lg p-4 border border-purple-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-pink-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Smart Farming Scope</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.smart_farming}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Cultural Tab */}
          <TabsContent value="cultural" className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 p-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-indigo-400 rounded-full flex items-center justify-center">
                    <Info className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">Cultural & Traditional Relevance</h1>
                    <p className="text-gray-600">Religious, traditional, and cultural significance</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-white rounded-lg p-4 border border-indigo-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Info className="h-4 w-4 text-indigo-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Religious Use</span>
                    </div>
                    <p className="text-2xl font-bold text-indigo-600">{crop.religious_use ? 'Present' : 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-indigo-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Traditional</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{crop.traditional_uses ? 'Present' : 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-indigo-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Star className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-semibold text-gray-800">GI Status</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{crop.gi_status ? 'Protected' : 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-indigo-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-yellow-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Fun Facts</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">{crop.fun_fact ? 'Available' : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-indigo-400 rounded-lg flex items-center justify-center">
                    <Info className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Cultural & Traditional Relevance</h3>
                    <p className="text-sm text-gray-600">Religious, traditional, and cultural significance</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {crop.religious_use && (
                    <div className="bg-white rounded-lg p-4 border border-indigo-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <Info className="h-4 w-4 text-indigo-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Religious/Cultural Use</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.religious_use}</p>
                    </div>
                  )}
                  {crop.traditional_uses && (
                    <div className="bg-white rounded-lg p-4 border border-indigo-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Traditional Uses</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.traditional_uses}</p>
                    </div>
                  )}
                  {crop.gi_status && (
                    <div className="bg-white rounded-lg p-4 border border-indigo-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Star className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="font-semibold text-gray-800">GI Status</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.gi_status}</p>
                    </div>
                  )}
                  {crop.fun_fact && (
                    <div className="bg-white rounded-lg p-4 border border-indigo-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-yellow-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Fun Fact/Trivia</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.fun_fact}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 p-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Wheat className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">Insights & Analysis</h1>
                    <p className="text-gray-600">Key takeaways and SWOT analysis</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
                  <div className="bg-white rounded-lg p-4 border border-yellow-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Wheat className="h-4 w-4 text-yellow-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Key Points</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">{crop.key_takeaways ? 'Set' : 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Strengths</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{crop.swot_strengths ? 'Set' : 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-red-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-red-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Weaknesses</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{crop.swot_weaknesses ? 'Set' : 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Opportunities</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{crop.swot_opportunities ? 'Set' : 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-orange-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-orange-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Threats</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">{crop.swot_threats ? 'Set' : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                    <Wheat className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Insights & Analysis</h3>
                    <p className="text-sm text-gray-600">Key takeaways and SWOT analysis</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {crop.key_takeaways && (
                    <div className="bg-white rounded-lg p-4 border border-yellow-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <Wheat className="h-4 w-4 text-yellow-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Key Takeaways</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.key_takeaways}</p>
                    </div>
                  )}
                  {crop.swot_strengths && (
                    <div className="bg-white rounded-lg p-4 border border-green-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Strengths</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.swot_strengths}</p>
                    </div>
                  )}
                  {crop.swot_weaknesses && (
                    <div className="bg-white rounded-lg p-4 border border-red-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-red-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Weaknesses</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.swot_weaknesses}</p>
                    </div>
                  )}
                  {crop.swot_opportunities && (
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Opportunities</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.swot_opportunities}</p>
                    </div>
                  )}
                  {crop.swot_threats && (
                    <div className="bg-white rounded-lg p-4 border border-orange-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-orange-600" />
                        </div>
                        <span className="font-semibold text-gray-800">Threats</span>
                      </div>
                      <p className="text-gray-700 ml-11">{crop.swot_threats}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>


    </div>
  );
};

export default SimpleCropProfile;
