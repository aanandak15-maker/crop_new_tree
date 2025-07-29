import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CropVariety } from '@/data/cropData';
import { 
  Shield, 
  Clock, 
  TrendingUp, 
  MapPin, 
  Star, 
  CheckCircle, 
  XCircle, 
  Sprout,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface VarietyCardProps {
  variety: CropVariety;
  isSelected: boolean;
  onSelect: () => void;
}

const VarietyCard: React.FC<VarietyCardProps> = ({ variety, isSelected, onSelect }) => {
  const getResistanceColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return 'bg-crop-green text-white';
      case 'medium': return 'bg-harvest-gold text-white';
      case 'low': return 'bg-destructive text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getYieldCategory = (yieldStr: string) => {
    const yieldNum = parseFloat(yieldStr.replace(/[^\d.-]/g, '').split('-')[0]) || 0;
    if (yieldNum >= 60) return { label: 'High Yield', color: 'text-crop-green' };
    if (yieldNum >= 45) return { label: 'Medium Yield', color: 'text-harvest-gold' };
    return { label: 'Standard Yield', color: 'text-muted-foreground' };
  };

  const yieldCategory = getYieldCategory(variety.yield);

  return (
    <Card 
      className={`transition-all duration-300 cursor-pointer hover:shadow-nature ${
        isSelected 
          ? 'ring-2 ring-crop-green shadow-nature' 
          : 'hover:shadow-lg hover:scale-[1.02]'
      }`}
      onClick={onSelect}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl text-crop-green mb-1 flex items-center gap-2">
              <Sprout className="h-5 w-5" />
              {variety.name}
            </CardTitle>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge className="bg-leaf-light text-crop-green">
                {variety.zone}
              </Badge>
              {variety.lateSowingSuitable && (
                <Badge variant="outline" className="border-crop-green text-crop-green">
                  Late Sowing ✓
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-harvest-gold">{variety.yield.split(' ')[0]}</div>
            <div className="text-xs text-muted-foreground">q/ha</div>
            <div className={`text-xs font-medium ${yieldCategory.color}`}>
              {yieldCategory.label}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-muted rounded-lg p-3">
            <Clock className="h-4 w-4 mx-auto mb-1 text-primary" />
            <div className="text-lg font-bold text-primary">{variety.duration}</div>
            <div className="text-xs text-muted-foreground">Days</div>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <Star className="h-4 w-4 mx-auto mb-1 text-harvest-gold" />
            <div className="text-lg font-bold text-harvest-gold">{variety.grainQuality}</div>
            <div className="text-xs text-muted-foreground">Quality</div>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <TrendingUp className="h-4 w-4 mx-auto mb-1 text-secondary" />
            <div className="text-lg font-bold text-secondary">{variety.premiumMarket ? 'Premium' : 'Standard'}</div>
            <div className="text-xs text-muted-foreground">Market</div>
          </div>
        </div>

        {/* State Recommendations */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">Suitable States</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {variety.states.slice(0, isSelected ? undefined : 4).map((state) => (
              <Badge key={state} variant="outline" className="text-xs">
                {state}
              </Badge>
            ))}
            {!isSelected && variety.states.length > 4 && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                +{variety.states.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        {/* Disease Resistance */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-crop-green" />
            <span className="font-medium text-sm">Disease Resistance</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {variety.resistance.slice(0, isSelected ? undefined : 4).map((disease) => (
              <Badge key={disease} variant="outline" className="text-xs">
                {disease}
              </Badge>
            ))}
            {!isSelected && variety.resistance.length > 4 && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                +{variety.resistance.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        {/* Special Features */}
        <div className="flex flex-wrap gap-2">
          {variety.irrigationResponsive && (
            <div className="flex items-center gap-1 text-xs text-crop-green">
              <CheckCircle className="h-3 w-3" />
              Irrigation Responsive
            </div>
          )}
          {variety.certifiedSeedAvailable && (
            <div className="flex items-center gap-1 text-xs text-primary">
              <CheckCircle className="h-3 w-3" />
              Certified Seed
            </div>
          )}
          {!variety.lateSowingSuitable && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <XCircle className="h-3 w-3" />
              Not for Late Sowing
            </div>
          )}
        </div>

        {/* Expanded Details */}
        {isSelected && (
          <div className="mt-4 pt-4 border-t space-y-3">
            <div>
              <h4 className="font-medium text-sm mb-2">Detailed Features</h4>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="flex justify-between">
                  <span>Irrigation Response:</span>
                  <span className={variety.irrigationResponsive ? 'text-crop-green' : 'text-muted-foreground'}>
                    {variety.irrigationResponsive ? 'High' : 'Standard'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Grain Quality:</span>
                  <span className="text-harvest-gold font-medium">{variety.grainQuality}</span>
                </div>
                <div className="flex justify-between">
                  <span>Market Category:</span>
                  <span className="text-primary font-medium">{variety.premiumMarket ? 'Premium' : 'Standard'}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-2">Complete Resistance Profile</h4>
              <div className="flex flex-wrap gap-1">
                {variety.resistance.map((disease) => (
                  <Badge key={disease} variant="outline" className="text-xs">
                    {disease}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-2">Key Characteristics</h4>
              <div className="flex flex-wrap gap-1">
                {variety.characteristics.map((char) => (
                  <Badge key={char} variant="secondary" className="text-xs">
                    {char}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-2">All Recommended States</h4>
              <div className="flex flex-wrap gap-1">
                {variety.states.map((state) => (
                  <Badge key={state} variant="outline" className="text-xs">
                    {state}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Expand/Collapse Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full mt-2 text-crop-green hover:text-crop-green hover:bg-leaf-light"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          {isSelected ? (
            <>
              Show Less <ChevronUp className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              View Full Profile <ChevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default VarietyCard;