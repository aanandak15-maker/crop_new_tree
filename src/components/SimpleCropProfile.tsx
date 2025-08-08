import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getCropByName } from '@/data/cropData';
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
  Target,
  Clock,
  Award,
  Users
} from 'lucide-react';

interface SimpleCropProfileProps {
  cropName: string;
  onBack: () => void;
}

const SimpleCropProfile: React.FC<SimpleCropProfileProps> = ({ cropName, onBack }) => {
  const [selectedVariety, setSelectedVariety] = useState<string | null>(null);
  
  const crop = getCropByName(cropName);

  if (!crop) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Crop Not Found</h2>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  const renderField = (label: string, value: any, unit?: string) => {
    if (!value || value === '' || (Array.isArray(value) && value.length === 0)) return null;
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
    const validFields = fields.filter(field => field.value && field.value !== '');
    if (validFields.length === 0) return null;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {validFields.map((field, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-muted/50 last:border-b-0">
              <span className="font-medium text-sm">{field.label}:</span>
              <span className="text-sm text-muted-foreground text-right max-w-xs">
                {Array.isArray(field.value) ? field.value.join(', ') : field.value}
                {field.unit && ` ${field.unit}`}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-leaf-light via-background to-leaf-light/30">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-harvest-gold to-harvest-gold/80 rounded-lg">
              <Wheat className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">{crop.name}</h1>
              <p className="text-xl text-muted-foreground italic">{crop.scientificName}</p>
              <div className="flex gap-2 mt-2">
                {crop.season.map((season, index) => (
                  <Badge key={index} variant="secondary">
                    {season}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-10">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span className="hidden lg:inline">Basic</span>
            </TabsTrigger>
            <TabsTrigger value="morphology" className="flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              <span className="hidden lg:inline">Morphology</span>
            </TabsTrigger>
            <TabsTrigger value="genetics" className="flex items-center gap-2">
              <Dna className="h-4 w-4" />
              <span className="hidden lg:inline">Genetics</span>
            </TabsTrigger>
            <TabsTrigger value="cultivation" className="flex items-center gap-2">
              <Wheat className="h-4 w-4" />
              <span className="hidden lg:inline">Cultivation</span>
            </TabsTrigger>
            <TabsTrigger value="management" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden lg:inline">Management</span>
            </TabsTrigger>
            <TabsTrigger value="varieties" className="flex items-center gap-2">
              <Sprout className="h-4 w-4" />
              <span className="hidden lg:inline">Varieties</span>
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="flex items-center gap-2">
              <Apple className="h-4 w-4" />
              <span className="hidden lg:inline">Nutrition</span>
            </TabsTrigger>
            <TabsTrigger value="harvest" className="flex items-center gap-2">
              <Scissors className="h-4 w-4" />
              <span className="hidden lg:inline">Harvest</span>
            </TabsTrigger>
            <TabsTrigger value="market" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden lg:inline">Market</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden lg:inline">Insights</span>
            </TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderField("Scientific Name", crop.scientificName)}
                {renderField("Season", crop.season)}
                {renderField("Origin", crop.origin)}
                {renderField("Family", crop.family)}
                {renderField("Description", crop.description)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5" />
                  Climate & Soil Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Climate</h3>
                    {renderField("Temperature", crop.climate.temperature)}
                    {renderField("Rainfall", crop.climate.rainfall)}
                    {renderField("Humidity", crop.climate.humidity)}
                    {renderField("Zone", crop.climate.zone)}
                    {renderField("Optimum Temperature", crop.climate.optimumTemp)}
                    {renderField("Tolerable Temperature", crop.climate.tolerableTemp)}
                    {renderField("Altitude", crop.climate.altitude)}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Soil</h3>
                    {renderField("Soil Types", crop.soil.type)}
                    {renderField("pH Range", crop.soil.ph)}
                    {renderField("Drainage", crop.soil.drainage)}
                    {renderField("Texture", crop.soil.texture)}
                    {renderField("Light Requirement", crop.soil.lightRequirement)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Morphology Tab */}
          <TabsContent value="morphology" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5" />
                  Plant Morphology
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderField("Growth Habit", crop.morphology?.growthHabit)}
                {renderField("Life Span", crop.morphology?.lifeSpan)}
                {renderField("Plant Type", crop.morphology?.plantType)}
                {renderField("Root System", crop.morphology?.rootSystem)}
                {renderField("Leaf", crop.morphology?.leaf)}
                {renderField("Flowering Season", crop.morphology?.floweringSeason)}
                {renderField("Inflorescence Type", crop.morphology?.inflorescenceType)}
                {renderField("Fruit Type", crop.morphology?.fruitType)}
                {renderField("Fruit Development", crop.morphology?.fruitDevelopment)}
                {renderField("Unique Morphology", crop.morphology?.uniqueMorphology)}
                {renderField("Edible Part", crop.morphology?.ediblePart)}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Genetics Tab */}
          <TabsContent value="genetics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dna className="h-5 w-5" />
                  Genetics & Breeding
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderField("Chromosome Number", crop.genetics?.chromosomeNumber)}
                {renderField("Breeding Methods", crop.genetics?.breedingMethods)}
                {renderField("Biotech Advances", crop.genetics?.biotechAdvances)}
                {renderField("Hybrid Varieties", crop.genetics?.hybridVarieties)}
                {renderField("Patents", crop.genetics?.patents)}
                {renderField("Research Institutes", crop.genetics?.researchInstitutes)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flower className="h-5 w-5" />
                  Reproduction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderField("Pollination", crop.reproduction?.pollination)}
                {renderField("Propagation Type", crop.reproduction?.propagationType)}
                {renderField("Planting Material", crop.reproduction?.plantingMaterial)}
                {renderField("Germination Percent", crop.reproduction?.germinationPercent)}
                {renderField("Rootstock Compatibility", crop.reproduction?.rootstockCompatibility)}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cultivation Tab */}
          <TabsContent value="cultivation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wheat className="h-5 w-5" />
                  Cultivation Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {crop.cultivation.landPreparation && crop.cultivation.landPreparation.length > 0 && (
                    <AccordionItem value="land-preparation">
                      <AccordionTrigger>Land Preparation</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1">
                          {crop.cultivation.landPreparation.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  
                  {crop.cultivation.sowing && crop.cultivation.sowing.length > 0 && (
                    <AccordionItem value="sowing">
                      <AccordionTrigger>Sowing</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1">
                          {crop.cultivation.sowing.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  
                  {crop.cultivation.fertilizers && crop.cultivation.fertilizers.length > 0 && (
                    <AccordionItem value="fertilizers">
                      <AccordionTrigger>Fertilizers</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1">
                          {crop.cultivation.fertilizers.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  
                  {crop.cultivation.irrigation && crop.cultivation.irrigation.length > 0 && (
                    <AccordionItem value="irrigation">
                      <AccordionTrigger>Irrigation</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1">
                          {crop.cultivation.irrigation.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  
                  {crop.cultivation.harvesting && crop.cultivation.harvesting.length > 0 && (
                    <AccordionItem value="harvesting">
                      <AccordionTrigger>Harvesting</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1">
                          {crop.cultivation.harvesting.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Climate Tab */}
          <TabsContent value="climate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5" />
                  Climate & Soil Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Climate</h3>
                    {renderField("Temperature", crop.climate.temperature)}
                    {renderField("Rainfall", crop.climate.rainfall)}
                    {renderField("Humidity", crop.climate.humidity)}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Soil</h3>
                    {renderField("Soil Types", crop.soil.type)}
                    {renderField("pH Range", crop.soil.ph)}
                    {renderField("Drainage", crop.soil.drainage)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Varieties Tab */}
          <TabsContent value="varieties" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="h-5 w-5" />
                  Crop Varieties ({crop.varieties.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {crop.varieties.map((variety, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">{variety.name}</CardTitle>
                        <CardDescription>{variety.characteristics}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Yield:</span>
                          <span className="text-sm text-muted-foreground">{variety.yield}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">States:</span>
                          <span className="text-sm text-muted-foreground">{variety.states.join(', ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Resistance:</span>
                          <span className="text-sm text-muted-foreground">{variety.resistance}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pests Tab */}
          <TabsContent value="pests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bug className="h-5 w-5" />
                  Pests & Diseases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {crop.pests && crop.pests.length > 0 && (
                    <AccordionItem value="pests">
                      <AccordionTrigger>Major Pests</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {crop.pests.map((pest, index) => (
                            <div key={index} className="border-l-4 border-red-500 pl-4">
                              <h4 className="font-semibold">{pest}</h4>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  
                  {crop.diseases && crop.diseases.length > 0 && (
                    <AccordionItem value="diseases">
                      <AccordionTrigger>Major Diseases</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {crop.diseases.map((disease, index) => (
                            <div key={index} className="border-l-4 border-orange-500 pl-4">
                              <h4 className="font-semibold">{disease}</h4>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Management Tab */}
          <TabsContent value="management" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Nutrient Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderField("NPK-N", crop.management?.npkN)}
                {renderField("NPK-P", crop.management?.npkP)}
                {renderField("NPK-K", crop.management?.npkK)}
                {renderField("Micronutrient Needs", crop.management?.micronutrientNeeds)}
                {renderField("Biofertilizer Usage", crop.management?.biofertilizerUsage)}
                {renderField("Application Schedule Method", crop.management?.applicationScheduleMethod)}
                {renderField("Application Schedule Stages", crop.management?.applicationScheduleStages)}
                {renderField("Application Schedule Frequency", crop.management?.applicationScheduleFrequency)}
                {renderField("Water Quality", crop.management?.waterQuality)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bug className="h-5 w-5" />
                  Weed Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderField("Common Weeds", crop.weeds?.commonWeeds)}
                {renderField("Weed Season", crop.weeds?.weedSeason)}
                {renderField("Weed Control Method", crop.weeds?.weedControlMethod)}
                {renderField("Critical Period Weed", crop.weeds?.criticalPeriodWeed)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bug className="h-5 w-5" />
                  Pests & Diseases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {crop.pests && crop.pests.length > 0 && (
                    <AccordionItem value="pests">
                      <AccordionTrigger>Major Pests</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {crop.pests.map((pest, index) => (
                            <div key={index} className="border-l-4 border-red-500 pl-4">
                              <h4 className="font-semibold">{pest}</h4>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  
                  {crop.diseases && crop.diseases.length > 0 && (
                    <AccordionItem value="diseases">
                      <AccordionTrigger>Major Diseases</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {crop.diseases.map((disease, index) => (
                            <div key={index} className="border-l-4 border-orange-500 pl-4">
                              <h4 className="font-semibold">{disease}</h4>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Nutrition Tab */}
          <TabsContent value="nutrition" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Apple className="h-5 w-5" />
                  Nutritional Value
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderField("Calories", crop.nutrition?.calories)}
                {renderField("Protein", crop.nutrition?.protein)}
                {renderField("Carbohydrates", crop.nutrition?.carbohydrates)}
                {renderField("Fat", crop.nutrition?.fat)}
                {renderField("Fiber", crop.nutrition?.fiber)}
                {renderField("Vitamins", crop.nutrition?.vitamins)}
                {renderField("Minerals", crop.nutrition?.minerals)}
                {renderField("Bioactive Compounds", crop.nutrition?.bioactiveCompounds)}
                {renderField("Health Benefits", crop.nutrition?.healthBenefits)}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Harvest Tab */}
          <TabsContent value="harvest" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scissors className="h-5 w-5" />
                  Harvest & Post-Harvest
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderField("Harvest Time", crop.harvest?.harvestTime)}
                {renderField("Maturity Indicators", crop.harvest?.maturityIndicators)}
                {renderField("Harvesting Tools", crop.harvest?.harvestingTools)}
                {renderField("Post-Harvest Losses", crop.harvest?.postHarvestLosses)}
                {renderField("Storage Conditions", crop.harvest?.storageConditions)}
                {renderField("Shelf Life", crop.harvest?.shelfLife)}
                {renderField("Processed Products", crop.harvest?.processedProducts)}
                {renderField("Packaging Types", crop.harvest?.packagingTypes)}
                {renderField("Cold Chain", crop.harvest?.coldChain)}
                {renderField("Ripening Characteristics", crop.harvest?.ripeningCharacteristics)}
                {renderField("Pre-Cooling", crop.harvest?.preCooling)}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Market Tab */}
          <TabsContent value="market" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Economics & Market
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Yield & Production</h3>
                    {renderField("Average Yield", crop.economics.averageYield)}
                    {renderField("Market Price", crop.economics.marketPrice)}
                    {renderField("Major States", crop.economics.majorStates)}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Market Information</h3>
                    {renderField("Cost of Cultivation", crop.economics.costOfCultivation)}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Market Trends & Export
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderField("Market Trends", crop.market?.marketTrends)}
                {renderField("Export Potential", crop.market?.exportPotential)}
                {renderField("Export Destinations", crop.market?.exportDestinations)}
                {renderField("Value Chain Players", crop.market?.valueChainPlayers)}
                {renderField("Certifications", crop.market?.certifications)}
                {renderField("Subsidies", crop.market?.subsidies)}
                {renderField("Schemes", crop.market?.schemes)}
                {renderField("Support Agencies", crop.market?.supportAgencies)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Technology & Innovation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderField("AI/ML/IoT", crop.technology?.aiMlIot)}
                {renderField("Smart Farming", crop.technology?.smartFarming)}
                
                {crop.sustainability && crop.sustainability.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Sustainable Practices</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {crop.sustainability.map((practice, index) => (
                        <li key={index}>{practice}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {crop.innovations && crop.innovations.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Innovations</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {crop.innovations.map((innovation, index) => (
                        <li key={index}>{innovation}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {crop.climateResilience && crop.climateResilience.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Climate Resilience</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {crop.climateResilience.map((resilience, index) => (
                        <li key={index}>{resilience}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderField("Key Takeaways", crop.insights?.keyTakeaways)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  SWOT Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-green-600">Strengths</h3>
                    <p className="text-sm text-muted-foreground">{crop.insights?.swotStrengths}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3 text-red-600">Weaknesses</h3>
                    <p className="text-sm text-muted-foreground">{crop.insights?.swotWeaknesses}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3 text-blue-600">Opportunities</h3>
                    <p className="text-sm text-muted-foreground">{crop.insights?.swotOpportunities}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3 text-orange-600">Threats</h3>
                    <p className="text-sm text-muted-foreground">{crop.insights?.swotThreats}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Cultural & Traditional
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderField("Religious Use", crop.cultural?.religiousUse)}
                {renderField("Traditional Uses", crop.cultural?.traditionalUses)}
                {renderField("GI Status", crop.cultural?.giStatus)}
                {renderField("Fun Fact", crop.cultural?.funFact)}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SimpleCropProfile;
