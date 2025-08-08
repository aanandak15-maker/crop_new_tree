import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getCropByName, CropData } from '@/data/cropData';
import { supabase } from '@/integrations/supabase/client';
import VarietyCard from './VarietyCard';
import CropFlowChart from './CropFlowChart';
import ComparisonTool from './ComparisonTool';
import { 
  ArrowLeft, 
  Info, 
  Thermometer, 
  Apple, 
  Bug, 
  Scissors, 
  TrendingUp,
  Lightbulb,
  MapPin,
  Calendar,
  Droplets,
  Sprout,
  Leaf,
  Dna,
  Flower,
  Wheat,
  Shield,
  Zap,
  Globe,
  Heart,
  BookOpen,
  Target
} from 'lucide-react';

interface CropProfileProps {
  cropName: string;
  onBack: () => void;
}

interface DbCrop {
  id: string;
  name: string;
  scientific_name?: string;
  family?: string;
  description?: string;
  season?: string[];
  climate_type?: string[];
  soil_type?: string[];
  water_requirement?: string;
  growth_duration?: string;
  temperature_range?: string;
  rainfall_requirement?: string;
  humidity_range?: string;
  soil_ph?: string;
  drainage_requirement?: string;
  land_preparation?: string[];
  seed_rate?: string;
  row_spacing?: string;
  sowing_time?: string;
  fertilizer_requirement?: string[];
  irrigation_schedule?: string[];
  harvesting_info?: string[];
  pest_list?: string[];
  disease_list?: string[];
  average_yield?: string;
  market_price?: string;
  cost_of_cultivation?: string;
  nutritional_info?: string;
  sustainability_practices?: string[];
  innovations?: string[];
  // New fields from admin form
  field_name?: string;
  origin?: string;
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
  chromosome_number?: string;
  breeding_methods?: string;
  biotech_advances?: string;
  hybrid_varieties?: string;
  patents?: string;
  research_institutes?: string;
  pollination?: string;
  propagation_type?: string;
  planting_material?: string;
  germination_percent?: string;
  rootstock_compatibility?: string;
  nursery_practices?: string;
  training_system?: string;
  spacing?: string;
  planting_season?: string;
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
  common_weeds?: string;
  weed_season?: string;
  weed_control_method?: string;
  critical_period_weed?: string;
  pest_name?: string;
  pest_symptoms?: string;
  pest_life_cycle?: string;
  pest_etl?: string;
  pest_management?: string;
  pest_biocontrol?: string;
  disease_name?: string;
  disease_causal_agent?: string;
  disease_symptoms?: string;
  disease_life_cycle?: string;
  disease_management?: string;
  disease_biocontrol?: string;
  disorder_name?: string;
  disorder_cause?: string;
  disorder_symptoms?: string;
  disorder_impact?: string;
  disorder_control?: string;
  nematode_name?: string;
  nematode_symptoms?: string;
  nematode_life_cycle?: string;
  nematode_etl?: string;
  nematode_management?: string;
  nematode_biocontrol?: string;
  calories?: string;
  protein?: string;
  carbohydrates?: string;
  fat?: string;
  fiber?: string;
  vitamins?: string;
  minerals?: string;
  bioactive_compounds?: string;
  health_benefits?: string;
  variety_name?: string;
  yield?: string;
  variety_features?: string;
  variety_suitability?: string;
  market_demand?: string;
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
}

const CropProfile: React.FC<CropProfileProps> = ({ cropName, onBack }) => {
  const [selectedVariety, setSelectedVariety] = useState<string | null>(null);
  const [dbCrop, setDbCrop] = useState<DbCrop | null>(null);
  const [dbVarieties, setDbVarieties] = useState<any[]>([]);
  const [dbPests, setDbPests] = useState<any[]>([]);
  const [dbDiseases, setDbDiseases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const crop = getCropByName(cropName);

  useEffect(() => {
    fetchAllCropData();
  }, [cropName]);

  const fetchAllCropData = async () => {
    try {
      // Fetch crop data
      const { data: cropData, error: cropError } = await supabase
        .from('crops')
        .select('*')
        .ilike('name', cropName)
        .maybeSingle();
      
      if (cropData) {
        setDbCrop(cropData);
        
        // Fetch varieties for this crop
        const { data: varietiesData } = await supabase
          .from('varieties')
          .select('*')
          .eq('crop_id', cropData.id);
        
        // Fetch pests for this crop
        const { data: pestsData } = await supabase
          .from('crop_pests')
          .select(`
            *,
            pests:pest_id (*)
          `)
          .eq('crop_id', cropData.id);
        
        // Fetch diseases for this crop
        const { data: diseasesData } = await supabase
          .from('crop_diseases')
          .select(`
            *,
            diseases:disease_id (*)
          `)
          .eq('crop_id', cropData.id);
        
        setDbVarieties(varietiesData || []);
        setDbPests(pestsData || []);
        setDbDiseases(diseasesData || []);
      }
    } catch (error) {
      console.error('Error fetching crop data from database:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!crop && !dbCrop && !loading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Crop Not Found</h2>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  // Use static crop data if available, otherwise use database crop
  const cropData = crop || dbCrop;
  if (!cropData) return null;

  const tabItems = [
    { id: 'basic', label: 'Basic Info', icon: Info },
    { id: 'morphology', label: 'Morphology', icon: Leaf },
    { id: 'genetics', label: 'Genetics', icon: Dna },
    { id: 'reproduction', label: 'Reproduction', icon: Flower },
    { id: 'cultivation', label: 'Cultivation', icon: Wheat },
    { id: 'climate', label: 'Climate & Soil', icon: Thermometer },
    { id: 'management', label: 'Management', icon: Shield },
    { id: 'nutrition', label: 'Nutrition', icon: Apple },
    { id: 'varieties', label: 'Varieties', icon: Sprout },
    { id: 'harvest', label: 'Harvest', icon: Scissors },
    { id: 'market', label: 'Market', icon: TrendingUp },
    { id: 'tech', label: 'Tech & Innovation', icon: Zap },
    { id: 'sustainability', label: 'Sustainability', icon: Globe },
    { id: 'cultural', label: 'Cultural', icon: Heart },
    { id: 'insights', label: 'Insights', icon: BookOpen },
  ];

  const renderField = (label: string, value: any, unit?: string) => {
    if (!value || value === '') return null;
    return (
      <div className="flex justify-between items-center py-2 border-b border-muted/50 last:border-b-0">
        <span className="font-medium text-sm">{label}:</span>
        <span className="text-sm text-muted-foreground">
          {Array.isArray(value) ? value.join(', ') : value}{unit && ` ${unit}`}
        </span>
      </div>
    );
  };

  const renderSection = (title: string, fields: { label: string; value: any; unit?: string }[]) => {
    const validFields = fields.filter(f => f.value && f.value !== '');
    if (validFields.length === 0) return null;

    return (
      <AccordionItem value={title.toLowerCase().replace(/\s+/g, '-')}>
        <AccordionTrigger className="text-sm font-medium">
          {title}
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-1">
            {validFields.map((field, index) => (
              <div key={index}>
                {renderField(field.label, field.value, field.unit)}
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-leaf-light to-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {crop?.name || dbCrop?.name}
              </h1>
              <p className="text-muted-foreground italic">
                {crop?.scientificName || dbCrop?.scientific_name}
              </p>
            </div>
            <Badge className="bg-crop-green text-white">
              {(crop?.season || dbCrop?.season || []).join(', ')}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <Tabs defaultValue="basic" className="space-y-6">
          {/* Tab Navigation */}
          <div className="overflow-x-auto">
            <TabsList className="inline-flex w-max min-w-full bg-muted p-1">
              {tabItems.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex items-center gap-2 px-3 py-2 text-xs data-[state=active]:bg-crop-green data-[state=active]:text-white"
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Basic Plant Identification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {renderSection("Plant Details", [
                    { label: "Common Name", value: dbCrop?.name },
                    { label: "Botanical Name", value: dbCrop?.scientific_name },
                    { label: "Field Name", value: dbCrop?.field_name },
                    { label: "Family", value: dbCrop?.family },
                    { label: "Origin", value: dbCrop?.origin },
                    { label: "Climate Zone", value: dbCrop?.climate_zone },
                    { label: "Growth Habit", value: dbCrop?.growth_habit },
                    { label: "Life Span", value: dbCrop?.life_span },
                    { label: "Plant Type", value: dbCrop?.plant_type },
                  ])}
                  {renderSection("Description", [
                    { label: "Description", value: dbCrop?.description },
                  ])}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Morphology Tab */}
          <TabsContent value="morphology" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-primary" />
                  Morphology & Anatomy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {renderSection("Root System", [
                    { label: "Root System", value: dbCrop?.root_system },
                  ])}
                  {renderSection("Leaf Characteristics", [
                    { label: "Leaf", value: dbCrop?.leaf },
                  ])}
                  {renderSection("Flowering", [
                    { label: "Flowering Season", value: dbCrop?.flowering_season },
                    { label: "Inflorescence Type", value: dbCrop?.inflorescence_type },
                  ])}
                  {renderSection("Fruit", [
                    { label: "Fruit Type", value: dbCrop?.fruit_type },
                    { label: "Fruit Development", value: dbCrop?.fruit_development },
                    { label: "Edible Part", value: dbCrop?.edible_part },
                  ])}
                  {renderSection("Unique Features", [
                    { label: "Unique Morphological Features", value: dbCrop?.unique_morphology },
                  ])}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Genetics Tab */}
          <TabsContent value="genetics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dna className="h-5 w-5 text-primary" />
                  Genetic Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {renderSection("Genetic Details", [
                    { label: "Chromosome Number", value: dbCrop?.chromosome_number },
                    { label: "Breeding Methods", value: dbCrop?.breeding_methods },
                    { label: "Biotech Advances", value: dbCrop?.biotech_advances },
                    { label: "Hybrid Varieties", value: dbCrop?.hybrid_varieties },
                  ])}
                  {renderSection("Research & Patents", [
                    { label: "Patents/GI Tag", value: dbCrop?.patents },
                    { label: "Research Institutes", value: dbCrop?.research_institutes },
                  ])}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reproduction Tab */}
          <TabsContent value="reproduction" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flower className="h-5 w-5 text-primary" />
                  Reproductive Biology
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {renderSection("Pollination", [
                    { label: "Pollination Type", value: dbCrop?.pollination },
                  ])}
                  {renderSection("Propagation", [
                    { label: "Propagation Type", value: dbCrop?.propagation_type },
                    { label: "Planting Material", value: dbCrop?.planting_material },
                    { label: "Germination %", value: dbCrop?.germination_percent },
                  ])}
                  {renderSection("Nursery & Training", [
                    { label: "Rootstock Compatibility", value: dbCrop?.rootstock_compatibility },
                    { label: "Nursery Practices", value: dbCrop?.nursery_practices },
                    { label: "Training System", value: dbCrop?.training_system },
                  ])}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cultivation Tab */}
          <TabsContent value="cultivation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wheat className="h-5 w-5 text-primary" />
                  Cultivation Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {renderSection("Planting", [
                    { label: "Spacing", value: dbCrop?.spacing },
                    { label: "Seed Rate", value: dbCrop?.seed_rate },
                    { label: "Planting Season", value: dbCrop?.planting_season },
                    { label: "Row Spacing", value: dbCrop?.row_spacing },
                    { label: "Sowing Time", value: dbCrop?.sowing_time },
                  ])}
                  {renderSection("Fertilizer", [
                    { label: "NPK - N", value: dbCrop?.npk_n, unit: "kg/plant" },
                    { label: "NPK - P", value: dbCrop?.npk_p, unit: "kg/plant" },
                    { label: "NPK - K", value: dbCrop?.npk_k, unit: "kg/plant" },
                    { label: "Micronutrients", value: dbCrop?.micronutrient_needs },
                    { label: "Biofertilizer", value: dbCrop?.biofertilizer_usage },
                  ])}
                  {renderSection("Application Schedule", [
                    { label: "Method", value: dbCrop?.application_schedule_method },
                    { label: "Critical Stages", value: dbCrop?.application_schedule_stages },
                    { label: "Frequency", value: dbCrop?.application_schedule_frequency },
                  ])}
                  {renderSection("Land Preparation", [
                    { label: "Land Preparation", value: dbCrop?.land_preparation },
                  ])}
                  {renderSection("Fertilizer Requirements", [
                    { label: "Fertilizer Requirements", value: dbCrop?.fertilizer_requirement },
                  ])}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Climate & Soil Tab */}
          <TabsContent value="climate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-primary" />
                  Climate & Soil Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {renderSection("Temperature", [
                    { label: "Optimum Temperature", value: dbCrop?.optimum_temp },
                    { label: "Tolerable Temperature", value: dbCrop?.tolerable_temp },
                  ])}
                  {renderSection("Water", [
                    { label: "Water Requirement", value: dbCrop?.water_requirement },
                    { label: "Water Quality", value: dbCrop?.water_quality },
                    { label: "Rainfall Requirement", value: dbCrop?.rainfall_requirement },
                    { label: "Humidity Range", value: dbCrop?.humidity_range },
                  ])}
                  {renderSection("Soil", [
                    { label: "Soil Type", value: dbCrop?.soil_type },
                    { label: "Soil Texture", value: dbCrop?.soil_texture },
                    { label: "pH Range", value: dbCrop?.soil_ph },
                    { label: "Drainage", value: dbCrop?.drainage_requirement },
                  ])}
                  {renderSection("Environment", [
                    { label: "Altitude", value: dbCrop?.altitude },
                    { label: "Light Requirement", value: dbCrop?.light_requirement },
                  ])}
                  {renderSection("Irrigation", [
                    { label: "Irrigation Schedule", value: dbCrop?.irrigation_schedule },
                  ])}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Management Tab */}
          <TabsContent value="management" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Management Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {renderSection("Weed Management", [
                    { label: "Common Weeds", value: dbCrop?.common_weeds },
                    { label: "Weed Season", value: dbCrop?.weed_season },
                    { label: "Control Method", value: dbCrop?.weed_control_method },
                    { label: "Critical Period", value: dbCrop?.critical_period_weed },
                  ])}
                  {renderSection("Pest Management", [
                    { label: "Pest Name", value: dbCrop?.pest_name },
                    { label: "Symptoms", value: dbCrop?.pest_symptoms },
                    { label: "Life Cycle", value: dbCrop?.pest_life_cycle },
                    { label: "ETL", value: dbCrop?.pest_etl },
                    { label: "Management", value: dbCrop?.pest_management },
                    { label: "Biocontrol", value: dbCrop?.pest_biocontrol },
                  ])}
                  {renderSection("Disease Management", [
                    { label: "Disease Name", value: dbCrop?.disease_name },
                    { label: "Causal Agent", value: dbCrop?.disease_causal_agent },
                    { label: "Symptoms", value: dbCrop?.disease_symptoms },
                    { label: "Life Cycle", value: dbCrop?.disease_life_cycle },
                    { label: "Management", value: dbCrop?.disease_management },
                    { label: "Biocontrol", value: dbCrop?.disease_biocontrol },
                  ])}
                  {renderSection("Physiological Disorders", [
                    { label: "Disorder Name", value: dbCrop?.disorder_name },
                    { label: "Cause", value: dbCrop?.disorder_cause },
                    { label: "Symptoms", value: dbCrop?.disorder_symptoms },
                    { label: "Impact", value: dbCrop?.disorder_impact },
                    { label: "Control", value: dbCrop?.disorder_control },
                  ])}
                  {renderSection("Nematode Management", [
                    { label: "Nematode Name", value: dbCrop?.nematode_name },
                    { label: "Symptoms", value: dbCrop?.nematode_symptoms },
                    { label: "Life Cycle", value: dbCrop?.nematode_life_cycle },
                    { label: "ETL", value: dbCrop?.nematode_etl },
                    { label: "Management", value: dbCrop?.nematode_management },
                    { label: "Biocontrol", value: dbCrop?.nematode_biocontrol },
                  ])}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Nutrition Tab */}
          <TabsContent value="nutrition" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Apple className="h-5 w-5 text-primary" />
                  Nutritional Composition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {renderSection("Basic Nutrients", [
                    { label: "Calories", value: dbCrop?.calories, unit: "kcal/100g" },
                    { label: "Protein", value: dbCrop?.protein, unit: "g/100g" },
                    { label: "Carbohydrates", value: dbCrop?.carbohydrates, unit: "g/100g" },
                    { label: "Fat", value: dbCrop?.fat, unit: "g/100g" },
                    { label: "Fiber", value: dbCrop?.fiber, unit: "g/100g" },
                  ])}
                  {renderSection("Vitamins & Minerals", [
                    { label: "Vitamins", value: dbCrop?.vitamins },
                    { label: "Minerals", value: dbCrop?.minerals },
                  ])}
                  {renderSection("Bioactive Compounds", [
                    { label: "Bioactive Compounds", value: dbCrop?.bioactive_compounds },
                    { label: "Health Benefits", value: dbCrop?.health_benefits },
                  ])}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Varieties Tab */}
          <TabsContent value="varieties" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                🌟 Crop Varieties - Our Specialty
              </h2>
              <p className="text-muted-foreground">
                Detailed variety profiles with state-wise recommendations and resistance data
              </p>
            </div>

            {crop?.varieties || dbVarieties.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Static varieties */}
                {crop?.varieties?.map((variety) => (
                  <VarietyCard 
                    key={variety.name} 
                    variety={variety} 
                    isSelected={selectedVariety === variety.name}
                    onSelect={() => setSelectedVariety(
                      selectedVariety === variety.name ? null : variety.name
                    )}
                  />
                ))}
                
                {/* Database varieties */}
                {dbVarieties.map((variety) => (
                  <Card key={variety.id} className="border-2 hover:border-crop-green transition-colors cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{variety.name}</span>
                        <Badge>{variety.maturity_group || 'Standard'}</Badge>
                      </CardTitle>
                      <CardDescription>{variety.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Duration:</span>
                          <span className="ml-2">{variety.duration || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="font-medium">Yield:</span>
                          <span className="ml-2">{variety.yield_potential || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="font-medium">Plant Height:</span>
                          <span className="ml-2">{variety.plant_height || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="font-medium">Grain Quality:</span>
                          <span className="ml-2">{variety.grain_quality || 'Not specified'}</span>
                        </div>
                      </div>
                      
                      {variety.suitable_states && variety.suitable_states.length > 0 && (
                        <div>
                          <span className="font-medium text-sm">Suitable States:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {variety.suitable_states.slice(0, 6).map((state: string) => (
                              <Badge key={state} variant="outline" className="text-xs">{state}</Badge>
                            ))}
                            {variety.suitable_states.length > 6 && (
                              <Badge variant="outline" className="text-xs">
                                +{variety.suitable_states.length - 6} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {variety.disease_resistance && variety.disease_resistance.length > 0 && (
                        <div>
                          <span className="font-medium text-sm">Disease Resistance:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {variety.disease_resistance.map((disease: string) => (
                              <Badge key={disease} variant="secondary" className="text-xs">{disease}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">No variety information available for this crop yet.</p>
                </CardContent>
              </Card>
            )}

            {/* Database variety fields */}
            <Card>
              <CardHeader>
                <CardTitle>Variety Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {renderSection("Variety Details", [
                    { label: "Variety Name", value: dbCrop?.variety_name },
                    { label: "Yield", value: dbCrop?.yield },
                    { label: "Features", value: dbCrop?.variety_features },
                    { label: "Suitability", value: dbCrop?.variety_suitability },
                    { label: "Market Demand", value: dbCrop?.market_demand },
                  ])}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Harvest Tab */}
          <TabsContent value="harvest" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scissors className="h-5 w-5 text-primary" />
                  Harvest & Post-Harvest
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {renderSection("Harvesting", [
                    { label: "Harvest Time", value: dbCrop?.harvest_time },
                    { label: "Maturity Indicators", value: dbCrop?.maturity_indicators },
                    { label: "Harvesting Tools", value: dbCrop?.harvesting_tools },
                  ])}
                  {renderSection("Post-Harvest", [
                    { label: "Post-Harvest Losses", value: dbCrop?.post_harvest_losses, unit: "%" },
                    { label: "Storage Conditions", value: dbCrop?.storage_conditions },
                    { label: "Shelf Life", value: dbCrop?.shelf_life },
                    { label: "Processed Products", value: dbCrop?.processed_products },
                    { label: "Packaging Types", value: dbCrop?.packaging_types },
                  ])}
                  {renderSection("Special Requirements", [
                    { label: "Cold Chain", value: dbCrop?.cold_chain },
                    { label: "Ripening Characteristics", value: dbCrop?.ripening_characteristics },
                    { label: "Pre-cooling", value: dbCrop?.pre_cooling },
                  ])}
                  {renderSection("Harvesting Information", [
                    { label: "Harvesting Info", value: dbCrop?.harvesting_info },
                  ])}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Market Tab */}
          <TabsContent value="market" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Market & Economics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {renderSection("Pricing", [
                    { label: "Market Price", value: dbCrop?.market_price, unit: "Rs/kg" },
                    { label: "Market Trends", value: dbCrop?.market_trends },
                    { label: "Cost of Cultivation", value: dbCrop?.cost_of_cultivation },
                    { label: "Average Yield", value: dbCrop?.average_yield },
                  ])}
                  {renderSection("Export", [
                    { label: "Export Potential", value: dbCrop?.export_potential },
                    { label: "Export Destinations", value: dbCrop?.export_destinations },
                  ])}
                  {renderSection("Value Chain", [
                    { label: "Value Chain Players", value: dbCrop?.value_chain_players },
                    { label: "Certifications", value: dbCrop?.certifications },
                  ])}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tech & Innovation Tab */}
          <TabsContent value="tech" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Technology & Innovation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {renderSection("Smart Farming", [
                    { label: "AI/ML/IoT Use Cases", value: dbCrop?.ai_ml_iot },
                    { label: "Smart Farming Scope", value: dbCrop?.smart_farming },
                  ])}
                  {renderSection("Innovations", [
                    { label: "Innovations", value: dbCrop?.innovations },
                  ])}
                  {renderSection("Government Support", [
                    { label: "Subsidies", value: dbCrop?.subsidies },
                    { label: "Schemes", value: dbCrop?.schemes },
                    { label: "Support Agencies", value: dbCrop?.support_agencies },
                  ])}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sustainability Tab */}
          <TabsContent value="sustainability" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Sustainability & Environment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {renderSection("Sustainability", [
                    { label: "Sustainability Potential", value: dbCrop?.sustainability_potential },
                    { label: "Sustainability Practices", value: dbCrop?.sustainability_practices },
                    { label: "Waste-to-Wealth", value: dbCrop?.waste_to_wealth },
                  ])}
                  {renderSection("Climate", [
                    { label: "Climate Resilience", value: dbCrop?.climate_resilience },
                    { label: "Carbon Footprint", value: dbCrop?.carbon_footprint },
                  ])}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cultural Tab */}
          <TabsContent value="cultural" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Cultural & Traditional Relevance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {renderSection("Cultural Uses", [
                    { label: "Religious Use", value: dbCrop?.religious_use },
                    { label: "Traditional Uses", value: dbCrop?.traditional_uses },
                  ])}
                  {renderSection("Status & Facts", [
                    { label: "GI Status", value: dbCrop?.gi_status },
                    { label: "Fun Fact", value: dbCrop?.fun_fact },
                  ])}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Insights & Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {renderSection("Key Takeaways", [
                    { label: "Key Takeaways", value: dbCrop?.key_takeaways },
                  ])}
                  {renderSection("SWOT Analysis", [
                    { label: "Strengths", value: dbCrop?.swot_strengths },
                    { label: "Weaknesses", value: dbCrop?.swot_weaknesses },
                    { label: "Opportunities", value: dbCrop?.swot_opportunities },
                    { label: "Threats", value: dbCrop?.swot_threats },
                  ])}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CropProfile;
