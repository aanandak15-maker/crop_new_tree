import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Database, 
  Clock, 
  TrendingUp, 
  Memory, 
  Cpu, 
  Wifi,
  Loader2,
  RefreshCw,
  Settings
} from 'lucide-react';

interface PerformanceOptimizerProps {
  totalItems: number;
  loadedItems: number;
  onLoadMore: () => void;
  loading?: boolean;
  cacheStats?: {
    hits: number;
    misses: number;
    size: number;
  };
}

interface PerformanceMetrics {
  loadTime: number;
  memoryUsage: number;
  cacheHitRate: number;
  renderTime: number;
}

const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({
  totalItems,
  loadedItems,
  onLoadMore,
  loading = false,
  cacheStats
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    memoryUsage: 0,
    cacheHitRate: 0,
    renderTime: 0
  });
  const [isOptimized, setIsOptimized] = useState(false);
  const [autoLoad, setAutoLoad] = useState(true);

  // Simulate performance monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        loadTime: Math.random() * 1000 + 100,
        memoryUsage: Math.random() * 50 + 10,
        cacheHitRate: cacheStats ? (cacheStats.hits / (cacheStats.hits + cacheStats.misses)) * 100 : Math.random() * 100,
        renderTime: Math.random() * 50 + 5
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [cacheStats]);

  const loadProgress = useMemo(() => {
    return totalItems > 0 ? (loadedItems / totalItems) * 100 : 0;
  }, [loadedItems, totalItems]);

  const getPerformanceColor = (value: number, threshold: number) => {
    if (value <= threshold * 0.7) return 'text-green-600';
    if (value <= threshold) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceStatus = (value: number, threshold: number) => {
    if (value <= threshold * 0.7) return 'Excellent';
    if (value <= threshold) return 'Good';
    return 'Needs Attention';
  };

  const optimizePerformance = useCallback(() => {
    setIsOptimized(true);
    // In a real app, this would trigger actual optimizations
    setTimeout(() => {
      setMetrics(prev => ({
        ...prev,
        loadTime: prev.loadTime * 0.7,
        renderTime: prev.renderTime * 0.8
      }));
    }, 1000);
  }, []);

  const clearCache = useCallback(() => {
    // In a real app, this would clear the cache
    setMetrics(prev => ({
      ...prev,
      cacheHitRate: 0
    }));
  }, []);

  return (
    <div className="space-y-4">
      {/* Performance Overview */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Zap className="h-5 w-5 text-yellow-500" />
            Performance Monitor
            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
              {isOptimized ? 'Optimized' : 'Standard'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Load Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Data Loading Progress</span>
              <span className="text-sm text-gray-600">{loadedItems} / {totalItems}</span>
            </div>
            <Progress value={loadProgress} className="h-2" />
            {loading && (
              <div className="flex items-center gap-2 mt-2">
                <Loader2 className="h-4 w-4 animate-spin text-yellow-600" />
                <span className="text-sm text-gray-600">Loading more data...</span>
              </div>
            )}
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 border border-gray-200 rounded-lg">
              <Database className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-800">Load Time</p>
              <p className={`text-lg font-bold ${getPerformanceColor(metrics.loadTime, 500)}`}>
                {metrics.loadTime.toFixed(0)}ms
              </p>
              <p className="text-xs text-gray-600">
                {getPerformanceStatus(metrics.loadTime, 500)}
              </p>
            </div>
            <div className="text-center p-3 border border-gray-200 rounded-lg">
              <Memory className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-800">Memory</p>
              <p className={`text-lg font-bold ${getPerformanceColor(metrics.memoryUsage, 30)}`}>
                {metrics.memoryUsage.toFixed(1)}MB
              </p>
              <p className="text-xs text-gray-600">
                {getPerformanceStatus(metrics.memoryUsage, 30)}
              </p>
            </div>
            <div className="text-center p-3 border border-gray-200 rounded-lg">
              <Cpu className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-800">Render Time</p>
              <p className={`text-lg font-bold ${getPerformanceColor(metrics.renderTime, 20)}`}>
                {metrics.renderTime.toFixed(0)}ms
              </p>
              <p className="text-xs text-gray-600">
                {getPerformanceStatus(metrics.renderTime, 20)}
              </p>
            </div>
            <div className="text-center p-3 border border-gray-200 rounded-lg">
              <Wifi className="h-6 w-6 text-orange-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-800">Cache Hit Rate</p>
              <p className={`text-lg font-bold ${getPerformanceColor(100 - metrics.cacheHitRate, 30)}`}>
                {metrics.cacheHitRate.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-600">
                {getPerformanceStatus(100 - metrics.cacheHitRate, 30)}
              </p>
            </div>
          </div>

          {/* Cache Stats */}
          {cacheStats && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-800 mb-2">Cache Statistics</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-green-600">{cacheStats.hits}</p>
                  <p className="text-xs text-gray-600">Cache Hits</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-red-600">{cacheStats.misses}</p>
                  <p className="text-xs text-gray-600">Cache Misses</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-blue-600">{cacheStats.size}</p>
                  <p className="text-xs text-gray-600">Cache Size</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <Button
                onClick={optimizePerformance}
                disabled={isOptimized}
                size="sm"
                className="bg-yellow-400 text-gray-800 hover:bg-yellow-500"
              >
                <Zap className="h-4 w-4 mr-2" />
                Optimize
              </Button>
              <Button
                onClick={clearCache}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear Cache
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setAutoLoad(!autoLoad)}
                variant={autoLoad ? "default" : "outline"}
                size="sm"
                className={autoLoad ? "bg-green-500 hover:bg-green-600" : ""}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Auto Load
              </Button>
              <Button
                onClick={onLoadMore}
                disabled={loading || loadedItems >= totalItems}
                variant="outline"
                size="sm"
              >
                <Settings className="h-4 w-4 mr-2" />
                Load More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Tips */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-800">Performance Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-gray-800">Lazy Loading</p>
                <p className="text-sm text-gray-600">Data is loaded incrementally to improve initial page load time</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-gray-800">Virtual Scrolling</p>
                <p className="text-sm text-gray-600">Only renders visible items for smooth scrolling with large datasets</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-gray-800">Smart Caching</p>
                <p className="text-sm text-gray-600">Frequently accessed data is cached to reduce server requests</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-gray-800">Debounced Search</p>
                <p className="text-sm text-gray-600">Search requests are optimized to prevent excessive API calls</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceOptimizer;
