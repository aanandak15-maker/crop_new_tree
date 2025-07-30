import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Sprout, 
  Droplets, 
  Sun, 
  Scissors, 
  TrendingUp,
  ChevronRight,
  Calendar,
  Thermometer,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { CropData } from '@/data/cropData';

interface CropFlowChartProps {
  crop: CropData;
  selectedVariety?: string;
}

interface CultivationStep {
  id: string;
  name: string;
  duration: string;
  icon: React.ReactNode;
  activities: string[];
  warnings?: string[];
  keyPoints?: string[];
}

const CropFlowChart: React.FC<CropFlowChartProps> = ({ crop, selectedVariety }) => {
  const [activeStep, setActiveStep] = useState<string>('land-prep');

  const cultivationSteps: CultivationStep[] = [
    {
      id: 'land-prep',
      name: 'Land Preparation',
      duration: '15-20 days',
      icon: <Sprout className="h-5 w-5" />,
      activities: crop.cultivation.landPreparation,
      keyPoints: [
        'Deep ploughing recommended',
        'Remove previous crop residue',
        'Level the field properly'
      ]
    },
    {
      id: 'sowing',
      name: 'Sowing & Planting',
      duration: '5-7 days',
      icon: <Calendar className="h-5 w-5" />,
      activities: crop.cultivation.sowing,
      warnings: [
        'Avoid sowing in waterlogged conditions',
        'Maintain proper seed rate'
      ]
    },
    {
      id: 'irrigation',
      name: 'Irrigation Management',
      duration: 'Throughout season',
      icon: <Droplets className="h-5 w-5" />,
      activities: crop.cultivation.irrigation,
      keyPoints: [
        'Critical irrigation stages',
        'Monitor soil moisture',
        'Avoid over-irrigation'
      ]
    },
    {
      id: 'fertilization',
      name: 'Nutrient Management',
      duration: 'Split applications',
      icon: <TrendingUp className="h-5 w-5" />,
      activities: crop.cultivation.fertilizers,
      keyPoints: [
        'Soil test based application',
        'Split nitrogen doses',
        'Apply at right time'
      ]
    },
    {
      id: 'monitoring',
      name: 'Pest & Disease Watch',
      duration: 'Weekly monitoring',
      icon: <Eye className="h-5 w-5" />,
      activities: [
        'Regular field inspection',
        'Early identification of pests',
        'Preventive spraying if needed',
        'Monitor disease symptoms'
      ],
      warnings: [
        'Don\'t ignore early symptoms',
        'Use recommended pesticides only'
      ]
    },
    {
      id: 'harvesting',
      name: 'Harvesting & Storage',
      duration: '10-15 days',
      icon: <Scissors className="h-5 w-5" />,
      activities: crop.cultivation.harvesting,
      keyPoints: [
        'Harvest at right maturity',
        'Proper drying before storage',
        'Clean storage facilities'
      ]
    }
  ];

  const getStepProgress = (stepIndex: number) => {
    const activeIndex = cultivationSteps.findIndex(step => step.id === activeStep);
    if (stepIndex < activeIndex) return 100;
    if (stepIndex === activeIndex) return 50;
    return 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Cultivation Timeline for {crop.name}
        </h3>
        {selectedVariety && (
          <Badge variant="secondary" className="mb-4">
            Optimized for {selectedVariety}
          </Badge>
        )}
        <p className="text-muted-foreground">
          Interactive step-by-step cultivation guide
        </p>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Cultivation Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {cultivationSteps.map((step, index) => (
              <div key={step.id} className="text-center">
                <Button
                  variant={activeStep === step.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveStep(step.id)}
                  className="w-full mb-2 h-auto p-3"
                >
                  <div className="flex flex-col items-center gap-1">
                    {step.icon}
                    <span className="text-xs">{step.name}</span>
                  </div>
                </Button>
                <Progress 
                  value={getStepProgress(index)} 
                  className="h-2"
                />
                <span className="text-xs text-muted-foreground mt-1 block">
                  {step.duration}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Step Details */}
      {cultivationSteps.map((step) => (
        activeStep === step.id && (
          <Card key={step.id} className="border-crop-green">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {step.icon}
                {step.name}
                <Badge variant="secondary">{step.duration}</Badge>
              </CardTitle>
              <CardDescription>
                Detailed guidance for this cultivation stage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Activities */}
              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Key Activities
                </h4>
                <div className="grid gap-2">
                  {step.activities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                      <ChevronRight className="h-4 w-4 text-crop-green mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{activity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Points */}
              {step.keyPoints && (
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    Key Points to Remember
                  </h4>
                  <div className="grid gap-2">
                    {step.keyPoints.map((point, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-leaf-light/20 rounded-lg border border-crop-green/20">
                        <div className="h-2 w-2 bg-crop-green rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-foreground">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {step.warnings && (
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    Important Warnings
                  </h4>
                  <div className="grid gap-2">
                    {step.warnings.map((warning, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                        <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground">{warning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )
      ))}

      {/* Climate Considerations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5" />
            Climate Considerations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Temperature</h4>
              <p className="text-sm text-muted-foreground">{crop.climate.temperature}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Rainfall</h4>
              <p className="text-sm text-muted-foreground">{crop.climate.rainfall}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Humidity</h4>
              <p className="text-sm text-muted-foreground">{crop.climate.humidity}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CropFlowChart;