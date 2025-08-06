import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  memoryUsage?: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const mountTime = useRef<number>(performance.now());
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    interactionTime: 0,
  });

  useEffect(() => {
    const renderTime = performance.now() - mountTime.current;
    
    // Get memory usage if available (Chrome only)
    const memoryUsage = (performance as any).memory?.usedJSHeapSize;

    setMetrics(prev => ({
      ...prev,
      renderTime,
      memoryUsage,
    }));

    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance Metrics for ${componentName}:`, {
        renderTime: `${renderTime.toFixed(2)}ms`,
        memoryUsage: memoryUsage ? `${(memoryUsage / 1024 / 1024).toFixed(2)}MB` : 'N/A',
      });
    }

    // Measure interaction time
    const handleFirstInput = (event: Event) => {
      const interactionTime = performance.now() - mountTime.current;
      setMetrics(prev => ({ ...prev, interactionTime }));
      
      // Remove listener after first interaction
      document.removeEventListener('click', handleFirstInput);
      document.removeEventListener('keydown', handleFirstInput);
    };

    document.addEventListener('click', handleFirstInput, { once: true });
    document.addEventListener('keydown', handleFirstInput, { once: true });

    return () => {
      document.removeEventListener('click', handleFirstInput);
      document.removeEventListener('keydown', handleFirstInput);
    };
  }, [componentName]);

  const measureOperation = async <T,>(
    operation: () => Promise<T> | T,
    operationName: string
  ): Promise<T> => {
    const start = performance.now();
    
    try {
      const result = await operation();
      const duration = performance.now() - start;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${operationName} took ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`${operationName} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  };

  return {
    metrics,
    measureOperation,
  };
};