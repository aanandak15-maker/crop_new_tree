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
import { Wheat, Droplets, Thermometer, Mountain, Bug, Shield, DollarSign, Leaf, Sprout, Calendar, MapPin } from 'lucide-react';

interface CropNodeData {
  label: string;
  type: 'main' | 'category' | 'variety' | 'detail';
  data?: any;
  icon?: React.ReactNode;
  bgColor?: string;
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
        return 'bg-accent border border-accent-foreground';
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
        return 'min-w-36 min-h-16';
      default:
        return 'min-w-32 min-h-12';
    }
  };

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
      position: { x: 400, y: 50 },
      data: {
        label: `${cropData.name}`,
        type: 'main',
        icon: <Wheat />,
        data: cropData.scientificName,
      },
    });

    // Category nodes
    const categories = [
      { 
        id: 'botanical', 
        label: 'Botanical Info', 
        position: { x: 100, y: 200 }, 
        icon: <Sprout />,
        data: [cropData.scientificName, cropData.family]
      },
      { 
        id: 'climate', 
        label: 'Climate & Soil', 
        position: { x: 300, y: 200 }, 
        icon: <Thermometer />,
        data: cropData.climate.temperature
      },
      { 
        id: 'varieties', 
        label: 'Varieties', 
        position: { x: 500, y: 200 }, 
        icon: <Mountain />,
        data: `${cropData.varieties.length} varieties`
      },
      { 
        id: 'cultivation', 
        label: 'Cultivation', 
        position: { x: 700, y: 200 }, 
        icon: <Calendar />,
        data: cropData.season.join(', ')
      },
      { 
        id: 'pests', 
        label: 'Pests & Diseases', 
        position: { x: 200, y: 350 }, 
        icon: <Bug />,
        data: `${cropData.pests.length + cropData.diseases.length} issues`
      },
      { 
        id: 'economics', 
        label: 'Economics', 
        position: { x: 600, y: 350 }, 
        icon: <DollarSign />,
        data: cropData.economics.averageYield
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

    // Variety nodes
    cropData.varieties.forEach((variety: CropVariety, index: number) => {
      const varietyId = `variety-${variety.id}`;
      nodes.push({
        id: varietyId,
        type: 'cropNode',
        position: { x: 350 + (index * 150), y: 350 },
        data: {
          label: variety.name,
          type: 'variety',
          icon: <Leaf />,
          data: variety.duration,
        },
      });

      edges.push({
        id: `varieties-${varietyId}`,
        source: 'varieties',
        target: varietyId,
        type: 'smoothstep',
        style: { stroke: 'hsl(var(--harvest-gold))', strokeWidth: 2 },
      });

      // Variety details
      const detailNodes = [
        { label: 'Yield', data: variety.yield, offset: -100 },
        { label: 'States', data: variety.states.slice(0, 2).join(', '), offset: 0 },
        { label: 'Resistance', data: variety.resistance.slice(0, 2).join(', '), offset: 100 },
      ];

      detailNodes.forEach((detail, detailIndex) => {
        const detailId = `${varietyId}-detail-${detailIndex}`;
        nodes.push({
          id: detailId,
          type: 'cropNode',
          position: { x: 350 + (index * 150) + detail.offset, y: 500 },
          data: {
            label: detail.label,
            type: 'detail',
            data: detail.data,
          },
        });

        edges.push({
          id: `${varietyId}-${detailId}`,
          source: varietyId,
          target: detailId,
          type: 'straight',
          style: { stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 },
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
    <div className="w-full h-[600px] bg-gradient-to-br from-leaf-light to-background rounded-lg border shadow-nature">
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