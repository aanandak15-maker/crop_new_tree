import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Target,
  Zap,
  Leaf,
  DollarSign,
  Shield,
  Star
} from 'lucide-react';

interface AIInsightsProps {
  crop: any;
}

interface Insight {
  type: 'success' | 'warning' | 'info' | 'recommendation';
  title: string;
  description: string;
  icon: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

const AIInsights: React.FC<AIInsightsProps> = ({ crop }) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    // Simulate AI processing time
    const timer = setTimeout(() => {
      generateInsights();
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [crop]);

  const generateInsights = () => {
    const generatedInsights: Insight[] = [];

    // Yield Analysis
    if (crop.average_yield) {
      generatedInsights.push({
        type: 'success',
        title: 'High Yield Potential',
        description: `This crop shows excellent yield potential of ${crop.average_yield}. Consider optimal growing conditions for maximum production.`,
        icon: <TrendingUp className="h-4 w-4" />,
        priority: 'high',
        category: 'yield'
      });
    }

    // Climate Resilience
    if (crop.climate_resilience && crop.climate_resilience.toLowerCase().includes('high')) {
      generatedInsights.push({
        type: 'success',
        title: 'Climate Resilient',
        description: 'This crop demonstrates high climate resilience, making it suitable for changing weather patterns.',
        icon: <Shield className="h-4 w-4" />,
        priority: 'high',
        category: 'sustainability'
      });
    }

    // Pest Management
    if (crop.pest_name) {
      generatedInsights.push({
        type: 'warning',
        title: 'Pest Management Required',
        description: `Monitor for ${crop.pest_name}. Implement preventive measures during ${crop.pest_life_cycle || 'critical growth stages'}.`,
        icon: <AlertTriangle className="h-4 w-4" />,
        priority: 'high',
        category: 'management'
      });
    }

    // Nutritional Benefits
    if (crop.calories || crop.protein) {
      generatedInsights.push({
        type: 'info',
        title: 'Nutritional Benefits',
        description: 'This crop offers significant nutritional value. Consider it for health-conscious markets.',
        icon: <Leaf className="h-4 w-4" />,
        priority: 'medium',
        category: 'nutrition'
      });
    }

    // Market Opportunities
    if (crop.market_price && crop.export_potential) {
      generatedInsights.push({
        type: 'recommendation',
        title: 'Market Opportunity',
        description: 'Strong market demand with export potential. Consider scaling production.',
        icon: <DollarSign className="h-4 w-4" />,
        priority: 'high',
        category: 'market'
      });
    }

    // Technology Integration
    if (crop.ai_ml_iot || crop.smart_farming) {
      generatedInsights.push({
        type: 'info',
        title: 'Technology Ready',
        description: 'This crop is suitable for modern farming technologies and precision agriculture.',
        icon: <Zap className="h-4 w-4" />,
        priority: 'medium',
        category: 'technology'
      });
    }

    // Growth Duration
    if (crop.growth_duration) {
      generatedInsights.push({
        type: 'info',
        title: 'Growth Timeline',
        description: `Crop matures in ${crop.growth_duration}. Plan your farming calendar accordingly.`,
        icon: <Clock className="h-4 w-4" />,
        priority: 'medium',
        category: 'cultivation'
      });
    }

    // Sustainability Score
    if (crop.sustainability_potential && crop.sustainability_potential.toLowerCase().includes('high')) {
      generatedInsights.push({
        type: 'success',
        title: 'Sustainable Choice',
        description: 'Excellent sustainability potential. Ideal for eco-friendly farming practices.',
        icon: <Star className="h-4 w-4" />,
        priority: 'high',
        category: 'sustainability'
      });
    }

    setInsights(generatedInsights);
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'recommendation':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const categories = [
    { id: 'all', name: 'All Insights', count: insights.length },
    { id: 'yield', name: 'Yield', count: insights.filter(i => i.category === 'yield').length },
    { id: 'management', name: 'Management', count: insights.filter(i => i.category === 'management').length },
    { id: 'sustainability', name: 'Sustainability', count: insights.filter(i => i.category === 'sustainability').length },
    { id: 'market', name: 'Market', count: insights.filter(i => i.category === 'market').length },
    { id: 'technology', name: 'Technology', count: insights.filter(i => i.category === 'technology').length },
    { id: 'nutrition', name: 'Nutrition', count: insights.filter(i => i.category === 'nutrition').length },
    { id: 'cultivation', name: 'Cultivation', count: insights.filter(i => i.category === 'cultivation').length }
  ];

  const filteredInsights = selectedCategory === 'all' 
    ? insights 
    : insights.filter(insight => insight.category === selectedCategory);

  if (loading) {
    return (
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Brain className="h-5 w-5 text-purple-500" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Brain className="h-5 w-5 text-purple-500" />
          AI-Powered Insights
          <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">
            {insights.length} Insights
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id ? "bg-yellow-400 text-gray-800 hover:bg-yellow-500" : ""}
            >
              {category.name}
              <Badge variant="secondary" className="ml-2 text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Insights List */}
        <div className="space-y-4">
          {filteredInsights.length === 0 ? (
            <div className="text-center py-8">
              <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No insights available for this category</p>
            </div>
          ) : (
            filteredInsights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="text-purple-600">
                      {insight.icon}
                    </div>
                    <h4 className="font-semibold">{insight.title}</h4>
                  </div>
                  <Badge variant="outline" className={getPriorityColor(insight.priority)}>
                    {insight.priority}
                  </Badge>
                </div>
                <p className="text-sm opacity-90">{insight.description}</p>
              </div>
            ))
          )}
        </div>

        {/* Summary Stats */}
        {insights.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {insights.filter(i => i.type === 'success').length}
                </p>
                <p className="text-xs text-gray-600">Success</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {insights.filter(i => i.type === 'warning').length}
                </p>
                <p className="text-xs text-gray-600">Warnings</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {insights.filter(i => i.type === 'info').length}
                </p>
                <p className="text-xs text-gray-600">Info</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {insights.filter(i => i.type === 'recommendation').length}
                </p>
                <p className="text-xs text-gray-600">Recommendations</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsights;
