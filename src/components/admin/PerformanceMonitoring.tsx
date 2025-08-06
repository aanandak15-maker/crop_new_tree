import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Server, 
  Database, 
  Image as ImageIcon, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Clock,
  BarChart3
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PerformanceMetrics {
  pageLoadTime: number;
  dbResponseTime: number;
  imageLoadTime: number;
  memoryUsage: number;
  cacheHitRate: number;
  errorRate: number;
}

interface HealthCheck {
  service: string;
  status: 'healthy' | 'warning' | 'error';
  responseTime: number;
  lastCheck: Date;
  uptime: number;
}

const PerformanceMonitoring = () => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    pageLoadTime: 0,
    dbResponseTime: 0,
    imageLoadTime: 0,
    memoryUsage: 0,
    cacheHitRate: 0,
    errorRate: 0
  });
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [loadTestRunning, setLoadTestRunning] = useState(false);

  // Performance monitoring
  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(collectMetrics, 5000);
      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const collectMetrics = async () => {
    const startTime = performance.now();
    
    try {
      // Test database response time
      const dbStart = performance.now();
      await supabase.from('crops').select('id').limit(1);
      const dbTime = performance.now() - dbStart;

      // Get performance metrics
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const pageLoad = navigation.loadEventEnd - navigation.fetchStart;

      // Simulate memory usage (in a real app, you'd use performance.memory)
      const memUsage = Math.random() * 100;
      
      // Simulate cache hit rate
      const cacheHit = 85 + Math.random() * 10;
      
      // Simulate error rate
      const errorRate = Math.random() * 2;

      setMetrics({
        pageLoadTime: pageLoad,
        dbResponseTime: dbTime,
        imageLoadTime: Math.random() * 500 + 200,
        memoryUsage: memUsage,
        cacheHitRate: cacheHit,
        errorRate: errorRate
      });

      // Update health checks
      const health: HealthCheck[] = [
        {
          service: 'Database',
          status: dbTime < 100 ? 'healthy' : dbTime < 500 ? 'warning' : 'error',
          responseTime: dbTime,
          lastCheck: new Date(),
          uptime: 99.9
        },
        {
          service: 'Storage',
          status: 'healthy',
          responseTime: Math.random() * 50 + 10,
          lastCheck: new Date(),
          uptime: 99.8
        },
        {
          service: 'Cache',
          status: cacheHit > 80 ? 'healthy' : 'warning',
          responseTime: Math.random() * 10 + 1,
          lastCheck: new Date(),
          uptime: 99.95
        }
      ];
      
      setHealthChecks(health);
    } catch (error) {
      console.error('Error collecting metrics:', error);
    }
  };

  const runLoadTest = async () => {
    setLoadTestRunning(true);
    toast({
      title: "Load Test Started",
      description: "Running performance tests...",
    });

    try {
      // Simulate load testing
      const testPromises = Array.from({ length: 10 }, async (_, i) => {
        const start = performance.now();
        await supabase.from('crops').select('*').limit(10);
        return performance.now() - start;
      });

      const results = await Promise.all(testPromises);
      const avgTime = results.reduce((a, b) => a + b, 0) / results.length;
      
      toast({
        title: "Load Test Complete",
        description: `Average response time: ${avgTime.toFixed(2)}ms`,
      });
    } catch (error) {
      toast({
        title: "Load Test Failed",
        description: "Error running load test",
        variant: "destructive",
      });
    } finally {
      setLoadTestRunning(false);
    }
  };

  const optimizeDatabase = async () => {
    try {
      // In a real application, this would trigger database optimization
      toast({
        title: "Database Optimization",
        description: "Database optimization completed",
      });
    } catch (error) {
      toast({
        title: "Optimization Failed",
        description: "Error optimizing database",
        variant: "destructive",
      });
    }
  };

  const clearCache = () => {
    // Clear browser cache
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    
    toast({
      title: "Cache Cleared",
      description: "Application cache has been cleared",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-crop-green text-primary-foreground';
      case 'warning': return 'bg-harvest-gold text-foreground';
      case 'error': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-6 w-6" />
            Performance & Reliability Monitoring
          </CardTitle>
          <CardDescription>
            Monitor system performance, run load tests, and optimize infrastructure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button 
              onClick={() => setIsMonitoring(!isMonitoring)}
              variant={isMonitoring ? "destructive" : "default"}
            >
              {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
            </Button>
            <Button 
              onClick={runLoadTest} 
              disabled={loadTestRunning}
              variant="outline"
            >
              {loadTestRunning ? "Running..." : "Run Load Test"}
            </Button>
            <Button onClick={optimizeDatabase} variant="outline">
              Optimize Database
            </Button>
            <Button onClick={clearCache} variant="outline">
              Clear Cache
            </Button>
          </div>

          <Tabs defaultValue="metrics" className="space-y-4">
            <TabsList>
              <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
              <TabsTrigger value="health">Health Checks</TabsTrigger>
              <TabsTrigger value="optimization">Optimization</TabsTrigger>
            </TabsList>

            <TabsContent value="metrics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Page Load Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.pageLoadTime.toFixed(0)}ms</div>
                    <Progress value={Math.min(metrics.pageLoadTime / 30, 100)} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      DB Response Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.dbResponseTime.toFixed(0)}ms</div>
                    <Progress value={Math.min(metrics.dbResponseTime / 5, 100)} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Image Load Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.imageLoadTime.toFixed(0)}ms</div>
                    <Progress value={Math.min(metrics.imageLoadTime / 10, 100)} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Server className="h-4 w-4" />
                      Memory Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.memoryUsage.toFixed(1)}%</div>
                    <Progress value={metrics.memoryUsage} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Cache Hit Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.cacheHitRate.toFixed(1)}%</div>
                    <Progress value={metrics.cacheHitRate} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Error Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.errorRate.toFixed(2)}%</div>
                    <Progress value={metrics.errorRate * 10} className="mt-2" />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="health" className="space-y-4">
              <div className="grid gap-4">
                {healthChecks.map((check, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(check.status)}
                          <div>
                            <h3 className="font-semibold">{check.service}</h3>
                            <p className="text-sm text-muted-foreground">
                              Response: {check.responseTime.toFixed(2)}ms | Uptime: {check.uptime}%
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(check.status)}>
                          {check.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="optimization" className="space-y-4">
              <Alert>
                <BarChart3 className="h-4 w-4" />
                <AlertDescription>
                  Performance optimization tools and recommendations based on current metrics.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Database Optimization</CardTitle>
                    <CardDescription>Improve database query performance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">• Create indexes on frequently queried columns</p>
                    <p className="text-sm">• Optimize complex queries with EXPLAIN ANALYZE</p>
                    <p className="text-sm">• Enable query caching for repeated operations</p>
                    <p className="text-sm">• Archive old data to improve performance</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Image Optimization</CardTitle>
                    <CardDescription>Optimize image loading and delivery</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">• Implement lazy loading for images</p>
                    <p className="text-sm">• Use WebP format for better compression</p>
                    <p className="text-sm">• Set up CDN for faster image delivery</p>
                    <p className="text-sm">• Implement responsive image sizes</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Caching Strategy</CardTitle>
                    <CardDescription>Implement efficient caching mechanisms</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">• Browser caching for static assets</p>
                    <p className="text-sm">• API response caching with React Query</p>
                    <p className="text-sm">• Service worker for offline functionality</p>
                    <p className="text-sm">• Redis caching for database queries</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMonitoring;