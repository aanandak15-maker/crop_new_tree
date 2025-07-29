import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CropData } from '../data/cropData';
import { 
  Thermometer, 
  Droplets, 
  Mountain, 
  Calendar,
  MapPin,
  Sprout,
  Bug,
  Shield,
  DollarSign,
  Leaf,
  Activity
} from 'lucide-react';

interface CropDetailsProps {
  cropData: CropData;
}

export const CropDetails: React.FC<CropDetailsProps> = ({ cropData }) => {
  const detailSections = [
    {
      title: 'Botanical Classification',
      icon: <Sprout className="h-5 w-5" />,
      content: (
        <div className="space-y-2">
          <div><strong>Scientific Name:</strong> <em>{cropData.scientificName}</em></div>
          <div><strong>Family:</strong> {cropData.family}</div>
          <div><strong>Season:</strong> {cropData.season.join(', ')}</div>
        </div>
      )
    },
    {
      title: 'Climate Requirements',
      icon: <Thermometer className="h-5 w-5" />,
      content: (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-red-500" />
            <span><strong>Temperature:</strong> {cropData.climate.temperature}</span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span><strong>Rainfall:</strong> {cropData.climate.rainfall}</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-green-500" />
            <span><strong>Humidity:</strong> {cropData.climate.humidity}</span>
          </div>
        </div>
      )
    },
    {
      title: 'Soil Requirements',
      icon: <Mountain className="h-5 w-5" />,
      content: (
        <div className="space-y-2">
          <div><strong>Soil Type:</strong> {cropData.soil.type.join(', ')}</div>
          <div><strong>pH Range:</strong> {cropData.soil.ph}</div>
          <div><strong>Drainage:</strong> {cropData.soil.drainage}</div>
        </div>
      )
    },
    {
      title: 'Major Varieties',
      icon: <Leaf className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          {cropData.varieties.map((variety, index) => (
            <div key={index} className="p-3 bg-accent/30 rounded-lg border">
              <div className="font-semibold text-primary">{variety.name}</div>
              <div className="text-sm text-muted-foreground mt-1">
                Duration: {variety.duration} | Yield: {variety.yield}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                <Badge variant="secondary" className="text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  {variety.states.slice(0, 2).join(', ')}
                </Badge>
                {variety.resistance.slice(0, 2).map((resistance, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {resistance}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Cultivation Practices',
      icon: <Calendar className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <div>
            <strong className="text-primary">Land Preparation:</strong>
            <ul className="text-sm mt-1 space-y-1 ml-4">
              {cropData.cultivation.landPreparation.map((practice, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  {practice}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <strong className="text-primary">Sowing:</strong>
            <ul className="text-sm mt-1 space-y-1 ml-4">
              {cropData.cultivation.sowing.slice(0, 3).map((practice, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  {practice}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    },
    {
      title: 'Pests & Diseases',
      icon: <Bug className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <div>
            <strong className="flex items-center gap-2 text-destructive">
              <Bug className="h-4 w-4" />
              Common Pests:
            </strong>
            <div className="flex flex-wrap gap-1 mt-2">
              {cropData.pests.slice(0, 5).map((pest, idx) => (
                <Badge key={idx} variant="destructive" className="text-xs">
                  {pest}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <strong className="flex items-center gap-2 text-orange-600">
              <Shield className="h-4 w-4" />
              Common Diseases:
            </strong>
            <div className="flex flex-wrap gap-1 mt-2">
              {cropData.diseases.slice(0, 5).map((disease, idx) => (
                <Badge key={idx} className="text-xs bg-orange-100 text-orange-800 border-orange-300">
                  {disease}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Economics & Market',
      icon: <DollarSign className="h-5 w-5" />,
      content: (
        <div className="space-y-2">
          <div><strong>Average Yield:</strong> {cropData.economics.averageYield}</div>
          <div><strong>Market Price:</strong> {cropData.economics.marketPrice}</div>
          <div>
            <strong>Major Producing States:</strong>
            <div className="flex flex-wrap gap-1 mt-1">
              {cropData.economics.majorStates.map((state, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  {state}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Sustainability Practices',
      icon: <Leaf className="h-5 w-5" />,
      content: (
        <div className="space-y-1">
          {cropData.sustainability.map((practice, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <span className="w-1.5 h-1.5 bg-crop-green rounded-full mt-2 flex-shrink-0"></span>
              {practice}
            </div>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {detailSections.map((section, index) => (
        <Card key={index} className="animate-grow border-border hover:shadow-nature transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-primary text-lg">
              {section.icon}
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {section.content}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};