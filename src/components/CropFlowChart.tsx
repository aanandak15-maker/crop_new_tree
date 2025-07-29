import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Connection,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { CropData, CropVariety } from '../data/cropData';
import { Wheat, Droplets, Thermometer, Mountain, Bug, Shield, DollarSign, Leaf, Sprout, Calendar, MapPin, Star, Award, CheckCircle, XCircle, Crown, Zap, Apple, TrendingUp } from 'lucide-react';

interface CropNodeData {
  label: string;
  type: 'main' | 'category' | 'variety' | 'detail' | 'variety-detail';
  data?: any;
  icon?: React.ReactNode;
  bgColor?: string;
  variety?: CropVariety;
}

// Custom Node Component
const CropNode = ({ data }: { data: CropNodeData }) => {
  const getNodeStyle = () => {
    switch (data.type) {
      case 'main':
        return 'bg-gradient-to-r from-crop-green to-harvest-gold text-white shadow-nature';
      case 'category':
        return 'bg-card border-2 border-primary';
      case 'variety':
        return 'bg-gradient-to-br from-primary/10 to-secondary/20 border-2 border-primary shadow-lg';
      case 'variety-detail':
        return 'bg-muted border border-border';
      case 'detail':
        return 'bg-secondary border border-secondary-foreground';
      default:
        return 'bg-card';
    }
  };

  const getSize = () => {
    switch (data.type) {
      case 'main':
        return 'min-w-48 min-h-24';
      case 'category':
        return 'min-w-40 min-h-20';
      case 'variety':
        return 'min-w-72 min-h-48'; // Much larger for variety cards
      case 'variety-detail':
        return 'min-w-36 min-h-16';
      default:
        return 'min-w-32 min-h-12';
    }
  };

  // Special rendering for variety cards
  if (data.type === 'variety' && data.variety) {
    const variety = data.variety;
    return (
      <Card className={`${getNodeStyle()} ${getSize()} p-4 transition-all duration-300 hover:scale-102 hover:shadow-xl animate-grow`}>
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="text-primary h-5 w-5" />
              <h3 className="font-bold text-lg text-primary">{variety.name}</h3>
            </div>
            <Badge variant={variety.premiumMarket ? "default" : "secondary"} className="text-xs">
              {variety.zone}
            </Badge>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="font-medium">{variety.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-muted-foreground" />
              <span className="font-medium">{variety.yield}</span>
            </div>
          </div>

          {/* States */}
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground">Suitable States:</div>
            <div className="flex flex-wrap gap-1">
              {variety.states.slice(0, 3).map((state, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {state}
                </Badge>
              ))}
              {variety.states.length > 3 && (
                <span className="text-xs text-muted-foreground">+{variety.states.length - 3}</span>
              )}
            </div>
          </div>

          {/* Resistance & Features */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <Shield className="h-3 w-3 text-green-600" />
              <span className="font-medium">Resistant to: {variety.resistance.slice(0, 2).join(', ')}</span>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {variety.lateSowingSuitable && (
                <Badge variant="secondary" className="text-xs flex items-center gap-1">
                  <CheckCircle className="h-2 w-2" />
                  Late Sowing
                </Badge>
              )}
              {variety.irrigationResponsive && (
                <Badge variant="secondary" className="text-xs flex items-center gap-1">
                  <Droplets className="h-2 w-2" />
                  Irrigation Responsive
                </Badge>
              )}
              {variety.premiumMarket && (
                <Badge variant="default" className="text-xs flex items-center gap-1">
                  <Star className="h-2 w-2" />
                  Premium Market
                </Badge>
              )}
            </div>
          </div>

          {/* Grain Quality */}
          <div className="text-xs">
            <span className="font-medium text-muted-foreground">Quality: </span>
            <span>{variety.grainQuality}</span>
          </div>
        </div>
        <Handle type="target" position={Position.Top} className="w-3 h-3" />
        <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      </Card>
    );
  }

  return (
    <Card className={`${getNodeStyle()} ${getSize()} p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-grow`}>
      <div className="flex items-center gap-2">
        {data.icon && <span className="text-lg">{data.icon}</span>}
        <div className="text-sm font-medium text-center">{data.label}</div>
      </div>
      {data.data && (
        <div className="mt-2 text-xs">
          {Array.isArray(data.data) ? (
            <div className="flex flex-wrap gap-1">
              {data.data.slice(0, 3).map((item: string, idx: number) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {item}
                </Badge>
              ))}
              {data.data.length > 3 && <span className="text-muted-foreground">+{data.data.length - 3}</span>}
            </div>
          ) : (
            <div className="text-muted-foreground">{data.data}</div>
          )}
        </div>
      )}
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </Card>
  );
};

const nodeTypes = {
  cropNode: CropNode,
};

interface CropFlowChartProps {
  cropData: CropData;
}

export const CropFlowChart: React.FC<CropFlowChartProps> = ({ cropData }) => {
  const createFlowData = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Main crop node
    nodes.push({
      id: 'main',
      type: 'cropNode',
      position: { x: 600, y: 50 },
      data: {
        label: `${cropData.name}`,
        type: 'main',
        icon: <Wheat />,
        data: cropData.scientificName,
      },
    });

    // Restructured category nodes - more practical focus
    const categories = [
      { 
        id: 'season-climate', 
        label: 'Season & Agro-Climatic Fit', 
        position: { x: 100, y: 180 }, 
        icon: <Thermometer />,
        data: `${cropData.season.join(', ')} | ${cropData.climate.temperature}`
      },
      { 
        id: 'soil', 
        label: 'Soil & Climate Conditions', 
        position: { x: 350, y: 180 }, 
        icon: <Mountain />,
        data: `pH: ${cropData.soil.ph} | ${cropData.soil.drainage}`
      },
      { 
        id: 'cultivation', 
        label: 'Cultivation Practices', 
        position: { x: 600, y: 180 }, 
        icon: <Calendar />,
        data: `${cropData.cultivation.sowing.length} practices`
      },
      { 
        id: 'varieties', 
        label: '🌟 VARIETIES (USP)', 
        position: { x: 850, y: 180 }, 
        icon: <Crown />,
        data: `${cropData.varieties.length} varieties available`
      },
      { 
        id: 'pests-diseases', 
        label: 'Pest & Disease Profile', 
        position: { x: 1100, y: 180 }, 
        icon: <Bug />,
        data: `${cropData.pests.length + cropData.diseases.length} issues`
      },
      { 
        id: 'economics', 
        label: 'Economics & Market', 
        position: { x: 200, y: 360 }, 
        icon: <DollarSign />,
        data: cropData.economics.marketPrice
      },
      { 
        id: 'nutrition', 
        label: 'Nutritional Value', 
        position: { x: 500, y: 360 }, 
        icon: <Apple />,
        data: `${cropData.nutritionalValue.calories} | ${cropData.nutritionalValue.protein} protein`
      },
      { 
        id: 'innovations', 
        label: 'Innovations & Climate Resilience', 
        position: { x: 800, y: 360 }, 
        icon: <Zap />,
        data: `${cropData.innovations.length} innovations`
      },
    ];

    categories.forEach(category => {
      nodes.push({
        id: category.id,
        type: 'cropNode',
        position: category.position,
        data: {
          label: category.label,
          type: 'category',
          icon: category.icon,
          data: category.data,
        },
      });

      edges.push({
        id: `main-${category.id}`,
        source: 'main',
        target: category.id,
        type: 'smoothstep',
        animated: true,
        style: { stroke: 'hsl(var(--crop-green))', strokeWidth: 2 },
      });
    });

    // Enhanced Variety nodes - prominently displayed as individual crop stories
    cropData.varieties.forEach((variety: CropVariety, index: number) => {
      const varietyId = `variety-${variety.id}`;
      
      // Large prominent variety cards positioned centrally
      nodes.push({
        id: varietyId,
        type: 'cropNode',
        position: { x: 400 + (index * 400), y: 500 }, // Spaced out horizontally for prominence
        data: {
          label: variety.name,
          type: 'variety',
          variety: variety, // Pass full variety data for rich display
        },
      });

      edges.push({
        id: `varieties-${varietyId}`,
        source: 'varieties',
        target: varietyId,
        type: 'smoothstep',
        animated: true,
        style: { stroke: 'hsl(var(--primary))', strokeWidth: 3 }, // Thicker, more prominent edges
      });

      // Variety detail sub-nodes for expanded information
      const detailNodes = [
        { 
          label: 'Cultivation Cost', 
          data: cropData.economics.costOfCultivation, 
          offset: -120,
          icon: <DollarSign />
        },
        { 
          label: 'Disease Resistance', 
          data: variety.resistance.join(', '), 
          offset: 0,
          icon: <Shield />
        },
        { 
          label: 'Market Potential', 
          data: variety.premiumMarket ? 'Premium Market' : 'Standard Market', 
          offset: 120,
          icon: <TrendingUp />
        },
      ];

      detailNodes.forEach((detail, detailIndex) => {
        const detailId = `${varietyId}-detail-${detailIndex}`;
        nodes.push({
          id: detailId,
          type: 'cropNode',
          position: { x: 400 + (index * 400) + detail.offset, y: 720 },
          data: {
            label: detail.label,
            type: 'variety-detail',
            data: detail.data,
            icon: detail.icon,
          },
        });

        edges.push({
          id: `${varietyId}-${detailId}`,
          source: varietyId,
          target: detailId,
          type: 'straight',
          style: { stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1.5 },
        });
      });
    });

    return { nodes, edges };
  }, [cropData]);

  const [nodes, setNodes, onNodesChange] = useNodesState(createFlowData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(createFlowData.edges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

    return (
      <div className="w-full h-[800px] bg-gradient-to-br from-leaf-light to-background rounded-lg border shadow-nature">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="hsl(var(--border))" />
        <Controls className="bg-card border border-border" />
      </ReactFlow>
    </div>
  );
};