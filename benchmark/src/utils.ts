export interface BenchmarkMetrics {
  renderTime: number;
  updateTime: number;
  memoryUsage: number;
}

export const measurePerformance = async (
  testFn: () => Promise<void>,
  iterations: number = 5,
): Promise<BenchmarkMetrics> => {
  // Warm up
  await testFn();

  // Clear memory if possible
  if (window.gc) {
    window.gc();
  }

  // Wait for GC to complete
  await new Promise(resolve => setTimeout(resolve, 100));

  const startMemory = (performance as any).memory
    ? (performance as any).memory.usedJSHeapSize
    : 0;
  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();
    await testFn();
    const endTime = performance.now();
    times.push(endTime - startTime);

    // Small delay between iterations
    await new Promise(resolve => setTimeout(resolve, 20));
  }

  const endMemory = (performance as any).memory
    ? (performance as any).memory.usedJSHeapSize
    : 0;

  // Calculate average time (excluding the slowest run)
  times.sort((a, b) => a - b);
  const relevantTimes = times.slice(0, -1); // Remove the slowest run
  const avgTime =
    relevantTimes.reduce((sum, time) => sum + time, 0) / relevantTimes.length;

  return {
    renderTime: avgTime,
    updateTime: avgTime / 1000, // Assuming 1000 operations per test
    memoryUsage: (endMemory - startMemory) / 1024 / 1024, // MB
  };
};

// Helper to measure component render time
export const measureRenderTime = async (
  renderFn: () => void,
  iterations: number = 5,
): Promise<number> => {
  // Warm up
  renderFn();

  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();
    renderFn();
    const endTime = performance.now();
    times.push(endTime - startTime);
  }

  // Calculate average time (excluding the slowest run)
  times.sort((a, b) => a - b);
  const relevantTimes = times.slice(0, -1);
  return relevantTimes.reduce((sum, time) => sum + time, 0) / relevantTimes.length;
};

// Helper to measure state update time
export const measureUpdateTime = async (
  updateFn: () => void,
  iterations: number = 100,
): Promise<number> => {
  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();
    updateFn();
    const endTime = performance.now();
    times.push(endTime - startTime);
  }

  // Calculate average time
  return times.reduce((sum, time) => sum + time, 0) / times.length;
};
