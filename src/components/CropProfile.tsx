import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getCropByName, CropData } from '@/data/cropData';
import VarietyCard from './VarietyCard';
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
  Sprout
} from 'lucide-react';

interface CropProfileProps {
  cropName: string;
  onBack: () => void;
}

const CropProfile: React.FC<CropProfileProps> = ({ cropName, onBack }) => {
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

  const tabItems = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'varieties', label: 'Varieties', icon: Sprout },
    { id: 'climate', label: 'Climate & Soil', icon: Thermometer },
    { id: 'nutrition', label: 'Nutrition', icon: Apple },
    { id: 'cultivation', label: 'Cultivation', icon: Scissors },
    { id: 'pests', label: 'Pests & Diseases', icon: Bug },
    { id: 'economics', label: 'Economics', icon: TrendingUp },
    { id: 'innovations', label: 'Innovations', icon: Lightbulb },
  ];

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
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{crop.name}</h1>
              <p className="text-muted-foreground italic">{crop.scientificName}</p>
            </div>
            <Badge className="bg-crop-green text-white">
              {crop.season.join(', ')}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <Tabs defaultValue="varieties" className="space-y-6">
          {/* Tab Navigation */}
          <div className="overflow-x-auto">
            <TabsList className="inline-flex w-max min-w-full bg-muted p-1">
              {tabItems.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-crop-green data-[state=active]:text-white"
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sprout className="h-5 w-5 text-crop-green" />
                    Varieties
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-crop-green">{crop.varieties.length}</div>
                  <p className="text-sm text-muted-foreground">Available varieties</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    States
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {[...new Set(crop.varieties.flatMap(v => v.states))].length}
                  </div>
                  <p className="text-sm text-muted-foreground">Growing states</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-harvest-gold" />
                    Avg Yield
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-harvest-gold">
                    {(() => {
                      const avgYield = crop.varieties.reduce((sum, v) => {
                        const yieldStr = v.yield.replace(/[^\d.-]/g, '');
                        const yieldRange = yieldStr.split('-');
                        const avg = yieldRange.length > 1 ? 
                          (parseFloat(yieldRange[0]) + parseFloat(yieldRange[1])) / 2 : 
                          parseFloat(yieldRange[0]);
                        return sum + (isNaN(avg) ? 0 : avg);
                      }, 0) / crop.varieties.length;
                      return Math.round(avgYield);
                    })()}
                  </div>
                  <p className="text-sm text-muted-foreground">Quintals/hectare</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-secondary" />
                    Duration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-secondary">
                    {(() => {
                      const avgDuration = crop.varieties.reduce((sum, v) => {
                        const durationStr = v.duration.replace(/[^\d.-]/g, '');
                        const durationRange = durationStr.split('-');
                        const avg = durationRange.length > 1 ? 
                          (parseFloat(durationRange[0]) + parseFloat(durationRange[1])) / 2 : 
                          parseFloat(durationRange[0]);
                        return sum + (isNaN(avg) ? 0 : avg);
                      }, 0) / crop.varieties.length;
                      return Math.round(avgDuration);
                    })()}
                  </div>
                  <p className="text-sm text-muted-foreground">Days average</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Facts</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Botanical Classification</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p><span className="font-medium">Family:</span> {crop.family}</p>
                    <p><span className="font-medium">Scientific Name:</span> {crop.scientificName}</p>
                    <p><span className="font-medium">Season:</span> {crop.season.join(', ')}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Major Growing States</h4>
                  <div className="flex flex-wrap gap-1">
                    {[...new Set(crop.varieties.flatMap(v => v.states))].slice(0, 8).map((state) => (
                      <Badge key={state} variant="outline" className="text-xs">
                        {state}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Varieties Tab - The Main USP */}
          <TabsContent value="varieties" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                🌟 Crop Varieties - Our Specialty
              </h2>
              <p className="text-muted-foreground">
                Detailed variety profiles with state-wise recommendations and resistance data
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {crop.varieties.map((variety) => (
                <VarietyCard 
                  key={variety.name} 
                  variety={variety} 
                  isSelected={selectedVariety === variety.name}
                  onSelect={() => setSelectedVariety(
                    selectedVariety === variety.name ? null : variety.name
                  )}
                />
              ))}
            </div>
          </TabsContent>

          {/* Climate & Soil Tab */}
          <TabsContent value="climate" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-primary" />
                    Climate Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="font-medium">Temperature:</span>
                    <span className="ml-2 text-muted-foreground">{crop.climate.temperature}</span>
                  </div>
                  <div>
                    <span className="font-medium">Rainfall:</span>
                    <span className="ml-2 text-muted-foreground">{crop.climate.rainfall}</span>
                  </div>
                  <div>
                    <span className="font-medium">Humidity:</span>
                    <span className="ml-2 text-muted-foreground">{crop.climate.humidity}</span>
                  </div>
                  <div>
                    <span className="font-medium">Season:</span>
                    <Badge className="ml-2">{crop.season.join(', ')}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-primary" />
                    Soil Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="font-medium">Type:</span>
                    <span className="ml-2 text-muted-foreground">{crop.soil.type.join(', ')}</span>
                  </div>
                  <div>
                    <span className="font-medium">pH:</span>
                    <span className="ml-2 text-muted-foreground">{crop.soil.ph}</span>
                  </div>
                  <div>
                    <span className="font-medium">Drainage:</span>
                    <span className="ml-2 text-muted-foreground">{crop.soil.drainage}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Nutrition Tab */}
          <TabsContent value="nutrition" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Apple className="h-5 w-5 text-primary" />
                  Nutritional Value (per 100g)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">{crop.nutritionalValue.calories}</div>
                    <div className="text-sm text-muted-foreground">Calories</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-crop-green">{crop.nutritionalValue.protein}g</div>
                    <div className="text-sm text-muted-foreground">Protein</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-harvest-gold">{crop.nutritionalValue.carbohydrates}g</div>
                    <div className="text-sm text-muted-foreground">Carbs</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-secondary">{crop.nutritionalValue.fiber}g</div>
                    <div className="text-sm text-muted-foreground">Fiber</div>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Key Nutrients</h4>
                  <div className="flex flex-wrap gap-2">
                    <h5 className="font-medium mb-1">Vitamins:</h5>
                    {crop.nutritionalValue.vitamins.map((vitamin) => (
                      <Badge key={vitamin} variant="outline">{vitamin}</Badge>
                    ))}
                    <h5 className="font-medium mb-1 ml-4">Minerals:</h5>
                    {crop.nutritionalValue.minerals.map((mineral) => (
                      <Badge key={mineral} variant="outline">{mineral}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs with accordion layout */}
          <TabsContent value="cultivation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cultivation Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  <AccordionItem value="land-prep">
                    <AccordionTrigger>Land Preparation</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-muted-foreground">
                        {crop.cultivation.landPreparation.map((detail, idx) => (
                          <p key={idx}>{detail}</p>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="sowing">
                    <AccordionTrigger>Sowing</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-muted-foreground">
                        {crop.cultivation.sowing.map((detail, idx) => (
                          <p key={idx}>{detail}</p>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="fertilizers">
                    <AccordionTrigger>Fertilizers</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-muted-foreground">
                        {crop.cultivation.fertilizers.map((detail, idx) => (
                          <p key={idx}>{detail}</p>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="irrigation">
                    <AccordionTrigger>Irrigation</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-muted-foreground">
                        {crop.cultivation.irrigation.map((detail, idx) => (
                          <p key={idx}>{detail}</p>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="harvesting">
                    <AccordionTrigger>Harvesting</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-muted-foreground">
                        {crop.cultivation.harvesting.map((detail, idx) => (
                          <p key={idx}>{detail}</p>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pests" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Major Pests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {crop.pests.map((pest, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg">
                        <h4 className="font-medium">{pest}</h4>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Major Diseases</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {crop.diseases.map((disease, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg">
                        <h4 className="font-medium">{disease}</h4>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="economics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Economic Aspects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-crop-green">{crop.economics.costOfCultivation}</div>
                    <div className="text-sm text-muted-foreground">Cost/hectare</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-harvest-gold">{crop.economics.marketPrice}</div>
                    <div className="text-sm text-muted-foreground">Market Price</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">{crop.economics.averageYield}</div>
                    <div className="text-sm text-muted-foreground">Average Yield</div>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Major Growing States</h4>
                  <div className="flex flex-wrap gap-2">
                    {crop.economics.majorStates.map((state) => (
                      <Badge key={state} variant="outline">{state}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="innovations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Climate Resilience & Innovations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Climate Resilience Features</h4>
                    <div className="space-y-2">
                      {crop.climateResilience.map((feature, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <p className="text-muted-foreground">{feature}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Recent Innovations</h4>
                    <div className="space-y-2">
                      {crop.innovations.map((innovation, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <p className="text-muted-foreground">{innovation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Sustainability Practices</h4>
                    <div className="space-y-2">
                      {crop.sustainability.map((practice, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <p className="text-muted-foreground">{practice}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CropProfile;
