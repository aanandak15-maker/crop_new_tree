import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { getCropByName } from '@/data/cropData';
import { 
  ArrowLeft, Info, Wheat, Leaf, Shield, Apple, TrendingUp, 
  Sprout, Bug, MapPin, Clock, Loader2, AlertTriangle, Droplets, Thermometer
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
}

interface CropData {
  id: string;
  name: string;
  scientific_name: string | null;
  family: string | null;
  season: string[] | null;
  description: string | null;
  origin?: string;
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
  
  // Detailed disease management
  disease_name?: string;
  disease_causal_agent?: string;
  disease_symptoms?: string;
  disease_life_cycle?: string;
  disease_management?: string;
  disease_biocontrol?: string;
  
  // Disorder management
  disorder_name?: string;
  disorder_cause?: string;
  disorder_symptoms?: string;
  disorder_impact?: string;
  disorder_control?: string;
  
  // Nematode management
  nematode_name?: string;
  nematode_symptoms?: string;
  nematode_life_cycle?: string;
  nematode_etl?: string;
  nematode_management?: string;
  nematode_biocontrol?: string;
  
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
            
            // Detailed disease management
            disease_name: staticCrop.diseaseDetails?.name || null,
            disease_causal_agent: staticCrop.diseaseDetails?.causalAgent || null,
            disease_symptoms: staticCrop.diseaseDetails?.symptoms || null,
            disease_life_cycle: staticCrop.diseaseDetails?.lifeCycle || null,
            disease_management: staticCrop.diseaseDetails?.management || null,
            disease_biocontrol: staticCrop.diseaseDetails?.biocontrol || null,
            
            // Disorder management
            disorder_name: staticCrop.disorders?.name || null,
            disorder_cause: staticCrop.disorders?.cause || null,
            disorder_symptoms: staticCrop.disorders?.symptoms || null,
            disorder_impact: staticCrop.disorders?.impact || null,
            disorder_control: staticCrop.disorders?.control || null,
            
            // Nematode management
            nematode_name: staticCrop.nematodes?.name || null,
            nematode_symptoms: staticCrop.nematodes?.symptoms || null,
            nematode_life_cycle: staticCrop.nematodes?.lifeCycle || null,
            nematode_etl: staticCrop.nematodes?.etl || null,
            nematode_management: staticCrop.nematodes?.management || null,
            nematode_biocontrol: staticCrop.nematodes?.biocontrol || null,
            
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
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderStatCard(
                "Varieties", 
                stats.varieties, 
                <Sprout className="h-5 w-5 text-yellow-600" />, 
                "text-yellow-600"
              )}
              {renderStatCard(
                "States", 
                stats.states, 
                <MapPin className="h-5 w-5 text-blue-600" />, 
                "text-blue-600"
              )}
              {renderStatCard(
                "Avg Yield", 
                stats.avgYield, 
                <TrendingUp className="h-5 w-5 text-yellow-600" />, 
                "text-yellow-600"
              )}
              {renderStatCard(
                "Duration", 
                stats.avgDuration, 
                <Clock className="h-5 w-5 text-gray-600" />, 
                "text-gray-600"
              )}
            </div>

            {/* Quick Facts */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-800">Quick Facts</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-gray-800">Botanical Classification</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Family:</span> {crop.family || 'Not specified'}</p>
                    <p><span className="font-medium">Scientific Name:</span> {crop.scientific_name || 'Not specified'}</p>
                    <p><span className="font-medium">Season:</span> {crop.season ? crop.season.join(', ') : 'Not specified'}</p>
                    <p><span className="font-medium">Origin:</span> {crop.origin || 'Not specified'}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-gray-800">Major Growing States</h4>
                  <div className="flex flex-wrap gap-1">
                    {crop.varieties ? 
                      [...new Set(crop.varieties.flatMap(v => v.suitable_states || []))].slice(0, 8).map((state) => (
                        <Badge key={state} variant="outline" className="text-xs border-gray-300 text-gray-700">
                          {state}
                        </Badge>
                      )) : []
                    }
                    {crop.varieties && [...new Set(crop.varieties.flatMap(v => v.suitable_states || []))].length > 8 && (
                      <Badge variant="outline" className="text-xs border-gray-300 text-gray-700">
                        +{[...new Set(crop.varieties.flatMap(v => v.suitable_states || []))].length - 8} more
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Climate & Soil */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Info className="h-5 w-5 text-blue-500" />
                    Climate Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Temperature:</span> {crop.temperature_range || 'Not specified'}</p>
                  <p><span className="font-medium">Rainfall:</span> {crop.rainfall_requirement || 'Not specified'}</p>
                  <p><span className="font-medium">Humidity:</span> {crop.humidity_range || 'Not specified'}</p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Leaf className="h-5 w-5 text-green-500" />
                    Soil Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Soil Types:</span> {crop.soil_type ? crop.soil_type.join(', ') : 'Not specified'}</p>
                  <p><span className="font-medium">pH Range:</span> {crop.soil_ph || 'Not specified'}</p>
                  <p><span className="font-medium">Drainage:</span> {crop.drainage_requirement || 'Not specified'}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Varieties Tab */}
          <TabsContent value="varieties" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-[clamp(20px,2.5vw,28px)] font-bold text-gray-800 mb-2">
                🌟 Crop Varieties - Our Specialty
              </h2>
              <p className="text-gray-600 max-w-prose mx-auto">
                Detailed variety profiles with state-wise recommendations
              </p>
            </div>

            {crop.varieties && crop.varieties.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {crop.varieties.map((variety, index) => (
                  <Card key={variety.id} className="border border-gray-200 hover:border-yellow-400 transition-all duration-200 ease-out cursor-pointer bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-gray-800">
                        <span>{variety.name}</span>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700">#{index + 1}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-800">Yield:</span>
                          <span className="ml-2 text-gray-600">{variety.yield_potential || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-800">Duration:</span>
                          <span className="ml-2 text-gray-600">{variety.duration || 'Not specified'}</span>
                        </div>
                      </div>
                      
                      <div>
                        <span className="font-medium text-sm text-gray-800">Suitable States:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {variety.suitable_states ? variety.suitable_states.slice(0, 6).map((state) => (
                            <Badge key={state} variant="outline" className="text-xs border-gray-300 text-gray-700">{state}</Badge>
                          )) : []}
                          {variety.suitable_states && variety.suitable_states.length > 6 && (
                            <Badge variant="outline" className="text-xs border-gray-300 text-gray-700">
                              +{variety.suitable_states.length - 6} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {variety.description && (
                        <p className="text-sm text-gray-600">
                          {variety.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12 bg-white border border-gray-200">
                <CardContent>
                  <Sprout className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">No varieties available</h3>
                  <p className="text-gray-600 max-w-prose mx-auto">
                    Variety information has not been added for this crop yet
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Cultivation Tab */}
          <TabsContent value="cultivation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Land Preparation */}
              {crop.land_preparation && crop.land_preparation.length > 0 && (
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <Sprout className="h-5 w-5 text-green-500" />
                      Land Preparation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                      {crop.land_preparation.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Sowing Information */}
              {crop.sowing_time && (
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <Clock className="h-5 w-5 text-blue-500" />
                      Sowing Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Sowing Time:</span> {crop.sowing_time}</p>
                    <p><span className="font-medium">Seed Rate:</span> {crop.seed_rate || 'Not specified'}</p>
                    <p><span className="font-medium">Row Spacing:</span> {crop.row_spacing || 'Not specified'}</p>
                  </CardContent>
                </Card>
              )}

              {/* Climate & Soil Requirements */}
              {(crop.optimum_temp || crop.tolerable_temp || crop.altitude || crop.soil_texture) && (
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <Thermometer className="h-5 w-5 text-orange-500" />
                      Climate & Soil
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Optimum Temperature:</span> {crop.optimum_temp || 'Not specified'}</p>
                    <p><span className="font-medium">Tolerable Temperature:</span> {crop.tolerable_temp || 'Not specified'}</p>
                    <p><span className="font-medium">Altitude:</span> {crop.altitude || 'Not specified'}</p>
                    <p><span className="font-medium">Soil Texture:</span> {crop.soil_texture || 'Not specified'}</p>
                  </CardContent>
                </Card>
              )}

              {/* Weed Management */}
              {(crop.common_weeds || crop.weed_control_method) && (
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <Leaf className="h-5 w-5 text-red-500" />
                      Weed Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Common Weeds:</span> {crop.common_weeds || 'Not specified'}</p>
                    <p><span className="font-medium">Control Methods:</span> {crop.weed_control_method || 'Not specified'}</p>
                    <p><span className="font-medium">Critical Period:</span> {crop.critical_period_weed || 'Not specified'}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Management Tab */}
          <TabsContent value="management" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Fertilizer Management */}
              {crop.fertilizer_requirement && crop.fertilizer_requirement.length > 0 && (
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <Shield className="h-5 w-5 text-blue-500" />
                      Fertilizer Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                      {crop.fertilizer_requirement.map((fertilizer, index) => (
                        <li key={index}>{fertilizer}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Advanced Fertilizer Details */}
              {(crop.npk_n || crop.npk_p || crop.npk_k || crop.micronutrient_needs) && (
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <Shield className="h-5 w-5 text-green-500" />
                      NPK & Micronutrients
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Nitrogen (N):</span> {crop.npk_n || 'Not specified'}</p>
                    <p><span className="font-medium">Phosphorus (P):</span> {crop.npk_p || 'Not specified'}</p>
                    <p><span className="font-medium">Potassium (K):</span> {crop.npk_k || 'Not specified'}</p>
                    <p><span className="font-medium">Micronutrients:</span> {crop.micronutrient_needs || 'Not specified'}</p>
                  </CardContent>
                </Card>
              )}

              {/* Irrigation Schedule */}
              {crop.irrigation_schedule && crop.irrigation_schedule.length > 0 && (
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <Droplets className="h-5 w-5 text-blue-500" />
                      Irrigation Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                      {crop.irrigation_schedule.map((schedule, index) => (
                        <li key={index}>{schedule}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Water Quality & Requirements */}
              {(crop.water_quality || crop.water_requirement) && (
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <Droplets className="h-5 w-5 text-cyan-500" />
                      Water Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Water Requirement:</span> {crop.water_requirement || 'Not specified'}</p>
                    <p><span className="font-medium">Water Quality:</span> {crop.water_quality || 'Not specified'}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Nutrition Tab */}
          <TabsContent value="nutrition" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Nutritional Info */}
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Apple className="h-5 w-5 text-green-500" />
                    Basic Nutrition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {crop.nutritional_info ? (
                    <p className="text-sm text-gray-600">{crop.nutritional_info}</p>
                  ) : (
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-medium">Calories:</span> {crop.calories || 'Not specified'}</p>
                      <p><span className="font-medium">Protein:</span> {crop.protein || 'Not specified'}</p>
                      <p><span className="font-medium">Carbohydrates:</span> {crop.carbohydrates || 'Not specified'}</p>
                      <p><span className="font-medium">Fat:</span> {crop.fat || 'Not specified'}</p>
                      <p><span className="font-medium">Fiber:</span> {crop.fiber || 'Not specified'}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Detailed Nutritional Components */}
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Info className="h-5 w-5 text-purple-500" />
                    Nutritional Components
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Vitamins:</span> {crop.vitamins || 'Not specified'}</p>
                  <p><span className="font-medium">Minerals:</span> {crop.minerals || 'Not specified'}</p>
                  <p><span className="font-medium">Bioactive Compounds:</span> {crop.bioactive_compounds || 'Not specified'}</p>
                  <p><span className="font-medium">Health Benefits:</span> {crop.health_benefits || 'Not specified'}</p>
                </CardContent>
              </Card>
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
                  <CardContent className="space-y-3 text-sm text-gray-600">
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
                  <CardContent className="space-y-3 text-sm text-gray-600">
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
                  <CardContent className="space-y-3 text-sm text-gray-600">
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
                  <CardContent className="space-y-3 text-sm text-gray-600">
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
