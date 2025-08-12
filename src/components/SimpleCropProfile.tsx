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
              <TabsTrigger value="varieties" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <Sprout className="h-4 w-4" />
                <span className="hidden sm:inline">Varieties</span>
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
              <TabsTrigger value="morphology" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <Leaf className="h-4 w-4" />
                <span className="hidden sm:inline">Morphology</span>
              </TabsTrigger>
              <TabsTrigger value="genetics" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <Sprout className="h-4 w-4" />
                <span className="hidden sm:inline">Genetics</span>
              </TabsTrigger>
              <TabsTrigger value="reproduction" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <Apple className="h-4 w-4" />
                <span className="hidden sm:inline">Reproduction</span>
              </TabsTrigger>
              <TabsTrigger value="harvest" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Harvest</span>
              </TabsTrigger>
              <TabsTrigger value="government" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Government</span>
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
          <TabsContent value="market" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Economics & Market
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Average Yield:</span> {crop.average_yield || 'Not specified'}</p>
                  <p><span className="font-medium">Market Price:</span> {crop.market_price || 'Not specified'}</p>
                  <p><span className="font-medium">Cost of Cultivation:</span> {crop.cost_of_cultivation || 'Not specified'}</p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <TrendingUp className="h-5 w-5 text-yellow-500" />
                    Market Trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Innovations:</span> {crop.innovations ? crop.innovations.join(', ') : 'Not specified'}</p>
                  <p><span className="font-medium">Sustainability:</span> {crop.sustainability_practices ? crop.sustainability_practices.join(', ') : 'Not specified'}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pests & Diseases Tab */}
          <TabsContent value="pests-diseases" className="space-y-6">
            {/* Main Pest and Disease */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Detailed Pest Information */}
              {crop.pest_name && (
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <Bug className="h-5 w-5 text-red-500" />
                      Pest Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-gray-600">
                    {/* Pest Image */}
                    {crop.pest_image && (
                      <div className="mb-4">
                        <img 
                          src={crop.pest_image} 
                          alt={`${crop.pest_name} pest`}
                          className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Pest Name:</span> {crop.pest_name}
                    </div>
                    {crop.pest_symptoms && (
                      <div>
                        <span className="font-medium">Symptoms:</span> {crop.pest_symptoms}
                      </div>
                    )}
                    {crop.pest_life_cycle && (
                      <div>
                        <span className="font-medium">Life Cycle:</span> {crop.pest_life_cycle}
                      </div>
                    )}
                    {crop.pest_etl && (
                      <div>
                        <span className="font-medium">ETL (Economic Threshold Level):</span> {crop.pest_etl}
                      </div>
                    )}
                    {crop.pest_management && (
                      <div>
                        <span className="font-medium">Management:</span> {crop.pest_management}
                      </div>
                    )}
                    {crop.pest_biocontrol && (
                      <div>
                        <span className="font-medium">Biological Control:</span> {crop.pest_biocontrol}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Detailed Disease Information */}
              {crop.disease_name && (
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <Shield className="h-5 w-5 text-orange-500" />
                      Disease Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-gray-600">
                    {/* Disease Image */}
                    {crop.disease_image && (
                      <div className="mb-4">
                        <img 
                          src={crop.disease_image} 
                          alt={`${crop.disease_name} disease`}
                          className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Disease Name:</span> {crop.disease_name}
                    </div>
                    {crop.disease_causal_agent && (
                      <div>
                        <span className="font-medium">Causal Agent:</span> {crop.disease_causal_agent}
                      </div>
                    )}
                    {crop.disease_symptoms && (
                      <div>
                        <span className="font-medium">Symptoms:</span> {crop.disease_symptoms}
                      </div>
                    )}
                    {crop.disease_life_cycle && (
                      <div>
                        <span className="font-medium">Life Cycle:</span> {crop.disease_life_cycle}
                      </div>
                    )}
                    {crop.disease_management && (
                      <div>
                        <span className="font-medium">Management:</span> {crop.disease_management}
                      </div>
                    )}
                    {crop.disease_biocontrol && (
                      <div>
                        <span className="font-medium">Biological Control:</span> {crop.disease_biocontrol}
                      </div>
                    )}
                  </CardContent>
                </Card>
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
          <TabsContent value="nematodes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {crop.nematode_name ? (
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <Shield className="h-5 w-5 text-purple-500" />
                      Nematode Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-gray-600">
                    {/* Nematode Image */}
                    {crop.nematode_image && (
                      <div className="mb-4">
                        <img 
                          src={crop.nematode_image} 
                          alt={`${crop.nematode_name} nematode`}
                          className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Nematode Name:</span> {crop.nematode_name}
                    </div>
                    {crop.nematode_symptoms && (
                      <div>
                        <span className="font-medium">Symptoms:</span> {crop.nematode_symptoms}
                      </div>
                    )}
                    {crop.nematode_life_cycle && (
                      <div>
                        <span className="font-medium">Life Cycle:</span> {crop.nematode_life_cycle}
                      </div>
                    )}
                    {crop.nematode_etl && (
                      <div>
                        <span className="font-medium">ETL (Economic Threshold Level):</span> {crop.nematode_etl}
                      </div>
                    )}
                    {crop.nematode_management && (
                      <div>
                        <span className="font-medium">Management:</span> {crop.nematode_management}
                      </div>
                    )}
                    {crop.nematode_biocontrol && (
                      <div>
                        <span className="font-medium">Biological Control:</span> {crop.nematode_biocontrol}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="text-center py-12 bg-white border border-gray-200">
                  <CardContent>
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">No nematode data available</h3>
                    <p className="text-gray-600 max-w-prose mx-auto">
                      Detailed nematode information has not been added for this crop yet
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Disorders Tab */}
          <TabsContent value="disorders" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {crop.disorder_name ? (
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      Disorder Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-gray-600">
                    {/* Disorder Image */}
                    {crop.disorder_image && (
                      <div className="mb-4">
                        <img 
                          src={crop.disorder_image} 
                          alt={`${crop.disorder_name} disorder`}
                          className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Disorder Name:</span> {crop.disorder_name}
                    </div>
                    {crop.disorder_cause && (
                      <div>
                        <span className="font-medium">Cause:</span> {crop.disorder_cause}
                      </div>
                    )}
                    {crop.disorder_symptoms && (
                      <div>
                        <span className="font-medium">Symptoms:</span> {crop.disorder_symptoms}
                      </div>
                    )}
                    {crop.disorder_impact && (
                      <div>
                        <span className="font-medium">Impact:</span> {crop.disorder_impact}
                      </div>
                    )}
                    {crop.disorder_control && (
                      <div>
                        <span className="font-medium">Control Measures:</span> {crop.disorder_control}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="text-center py-12 bg-white border border-gray-200">
                  <CardContent>
                    <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">No disorder data available</h3>
                    <p className="text-gray-600 max-w-prose mx-auto">
                      Detailed disorder information has not been added for this crop yet
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Morphology Tab */}
          <TabsContent value="morphology" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Leaf className="h-5 w-5 text-green-500" />
                    Plant Morphology
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-600">
                  {crop.root_system && (
                    <div>
                      <span className="font-medium">Root System:</span> {crop.root_system}
                    </div>
                  )}
                  {crop.leaf && (
                    <div>
                      <span className="font-medium">Leaf Characteristics:</span> {crop.leaf}
                    </div>
                  )}
                  {crop.flowering_season && (
                    <div>
                      <span className="font-medium">Flowering Season:</span> {crop.flowering_season}
                    </div>
                  )}
                  {crop.inflorescence_type && (
                    <div>
                      <span className="font-medium">Inflorescence Type:</span> {crop.inflorescence_type}
                    </div>
                  )}
                  {crop.fruit_type && (
                    <div>
                      <span className="font-medium">Fruit Type:</span> {crop.fruit_type}
                    </div>
                  )}
                  {crop.fruit_development && (
                    <div>
                      <span className="font-medium">Fruit Development:</span> {crop.fruit_development}
                    </div>
                  )}
                  {crop.unique_morphology && (
                    <div>
                      <span className="font-medium">Unique Features:</span> {crop.unique_morphology}
                    </div>
                  )}
                  {crop.edible_part && (
                    <div>
                      <span className="font-medium">Edible Part:</span> {crop.edible_part}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Genetics Tab */}
          <TabsContent value="genetics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Sprout className="h-5 w-5 text-green-500" />
                    Genetic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-600">
                  {crop.chromosome_number && (
                    <div>
                      <span className="font-medium">Chromosome Number:</span> {crop.chromosome_number}
                    </div>
                  )}
                  {crop.breeding_methods && (
                    <div>
                      <span className="font-medium">Breeding Methods:</span> {crop.breeding_methods}
                    </div>
                  )}
                  {crop.biotech_advances && (
                    <div>
                      <span className="font-medium">Biotechnological Advances:</span> {crop.biotech_advances}
                    </div>
                  )}
                  {crop.hybrid_varieties && (
                    <div>
                      <span className="font-medium">Hybrid Varieties:</span> {crop.hybrid_varieties}
                    </div>
                  )}
                  {crop.patents && (
                    <div>
                      <span className="font-medium">Patents/GI Tags:</span> {crop.patents}
                    </div>
                  )}
                  {crop.research_institutes && (
                    <div>
                      <span className="font-medium">Research Institutes:</span> {crop.research_institutes}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reproduction Tab */}
          <TabsContent value="reproduction" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Apple className="h-5 w-5 text-red-500" />
                    Reproductive Biology
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-600">
                  {crop.pollination && (
                    <div>
                      <span className="font-medium">Pollination:</span> {crop.pollination}
                    </div>
                  )}
                  {crop.propagation_type && (
                    <div>
                      <span className="font-medium">Propagation Type:</span> {crop.propagation_type}
                    </div>
                  )}
                  {crop.planting_material && (
                    <div>
                      <span className="font-medium">Planting Material:</span> {crop.planting_material}
                    </div>
                  )}
                  {crop.germination_percent && (
                    <div>
                      <span className="font-medium">Germination %:</span> {crop.germination_percent}
                    </div>
                  )}
                  {crop.rootstock_compatibility && (
                    <div>
                      <span className="font-medium">Rootstock Compatibility:</span> {crop.rootstock_compatibility}
                    </div>
                  )}
                  {crop.nursery_practices && (
                    <div>
                      <span className="font-medium">Nursery Practices:</span> {crop.nursery_practices}
                    </div>
                  )}
                  {crop.training_system && (
                    <div>
                      <span className="font-medium">Training System:</span> {crop.training_system}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Harvest Tab */}
          <TabsContent value="harvest" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Clock className="h-5 w-5 text-orange-500" />
                    Harvest & Post-Harvest
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-600">
                  {crop.harvest_time && (
                    <div>
                      <span className="font-medium">Harvest Time:</span> {crop.harvest_time}
                    </div>
                  )}
                  {crop.maturity_indicators && (
                    <div>
                      <span className="font-medium">Maturity Indicators:</span> {crop.maturity_indicators}
                    </div>
                  )}
                  {crop.harvesting_tools && (
                    <div>
                      <span className="font-medium">Harvesting Tools:</span> {crop.harvesting_tools}
                    </div>
                  )}
                  {crop.post_harvest_losses && (
                    <div>
                      <span className="font-medium">Post-Harvest Losses:</span> {crop.post_harvest_losses}
                    </div>
                  )}
                  {crop.storage_conditions && (
                    <div>
                      <span className="font-medium">Storage Conditions:</span> {crop.storage_conditions}
                    </div>
                  )}
                  {crop.shelf_life && (
                    <div>
                      <span className="font-medium">Shelf Life:</span> {crop.shelf_life}
                    </div>
                  )}
                  {crop.processed_products && (
                    <div>
                      <span className="font-medium">Processed Products:</span> {crop.processed_products}
                    </div>
                  )}
                  {crop.packaging_types && (
                    <div>
                      <span className="font-medium">Packaging Types:</span> {crop.packaging_types}
                    </div>
                  )}
                  {crop.cold_chain && (
                    <div>
                      <span className="font-medium">Cold Chain Requirements:</span> {crop.cold_chain}
                    </div>
                  )}
                  {crop.ripening_characteristics && (
                    <div>
                      <span className="font-medium">Ripening Characteristics:</span> {crop.ripening_characteristics}
                    </div>
                  )}
                  {crop.pre_cooling && (
                    <div>
                      <span className="font-medium">Pre-Cooling Requirements:</span> {crop.pre_cooling}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Government Tab */}
          <TabsContent value="government" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Shield className="h-5 w-5 text-blue-500" />
                    Government Support & Policy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-600">
                  {crop.subsidies && (
                    <div>
                      <span className="font-medium">Available Subsidies:</span> {crop.subsidies}
                    </div>
                  )}
                  {crop.schemes && (
                    <div>
                      <span className="font-medium">Applicable Schemes:</span> {crop.schemes}
                    </div>
                  )}
                  {crop.support_agencies && (
                    <div>
                      <span className="font-medium">Support Agencies:</span> {crop.support_agencies}
                    </div>
                  )}
                  {crop.certifications && (
                    <div>
                      <span className="font-medium">Required Certifications:</span> {crop.certifications}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Technology Tab */}
          <TabsContent value="technology" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <TrendingUp className="h-5 w-5 text-purple-500" />
                    Technology & Innovation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-600">
                  {crop.ai_ml_iot && (
                    <div>
                      <span className="font-medium">AI/ML/IoT Use Cases:</span> {crop.ai_ml_iot}
                    </div>
                  )}
                  {crop.smart_farming && (
                    <div>
                      <span className="font-medium">Smart Farming Scope:</span> {crop.smart_farming}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Cultural Tab */}
          <TabsContent value="cultural" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Info className="h-5 w-5 text-indigo-500" />
                    Cultural & Traditional Relevance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-600">
                  {crop.religious_use && (
                    <div>
                      <span className="font-medium">Religious/Cultural Use:</span> {crop.religious_use}
                    </div>
                  )}
                  {crop.traditional_uses && (
                    <div>
                      <span className="font-medium">Traditional Uses:</span> {crop.traditional_uses}
                    </div>
                  )}
                  {crop.gi_status && (
                    <div>
                      <span className="font-medium">GI Status:</span> {crop.gi_status}
                    </div>
                  )}
                  {crop.fun_fact && (
                    <div>
                      <span className="font-medium">Fun Fact/Trivia:</span> {crop.fun_fact}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Wheat className="h-5 w-5 text-yellow-500" />
                    Insights & Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-600">
                  {crop.key_takeaways && (
                    <div>
                      <span className="font-medium">Key Takeaways:</span> {crop.key_takeaways}
                    </div>
                  )}
                  {crop.swot_strengths && (
                    <div>
                      <span className="font-medium">Strengths:</span> {crop.swot_strengths}
                    </div>
                  )}
                  {crop.swot_weaknesses && (
                    <div>
                      <span className="font-medium">Weaknesses:</span> {crop.swot_weaknesses}
                    </div>
                  )}
                  {crop.swot_opportunities && (
                    <div>
                      <span className="font-medium">Opportunities:</span> {crop.swot_opportunities}
                    </div>
                  )}
                  {crop.swot_threats && (
                    <div>
                      <span className="font-medium">Threats:</span> {crop.swot_threats}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>


    </div>
  );
};

export default SimpleCropProfile;
