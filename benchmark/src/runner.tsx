import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

interface BenchmarkResult {
  library: string;
  renderTime: number;
  updateTime: number;
  memoryUsage: number;
}

const BenchmarkRunner: React.FC = () => {
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [iterations, setIterations] = useState(10);
  const [itemCount, setItemCount] = useState(1000);
  const [activeTest, setActiveTest] = useState<string | null>(null);

  const runBenchmark = async () => {
    setIsRunning(true);
    setResults([]);

    // 预热阶段 - 在实际测试前运行所有库一次
    const libraries = ['Zustand', 'Redux', 'Recoil', 'Jotai', 'Yoks'];

    // 预热所有库
    setActiveTest('Warming up...');
    for (const library of libraries) {
      // 运行一次预热
      switch (library) {
        case 'Yoks':
          await benchmarkYoks(Math.min(100, itemCount));
          break;
        case 'Zustand':
          await benchmarkZustand(Math.min(100, itemCount));
          break;
        case 'Redux':
          await benchmarkRedux(Math.min(100, itemCount));
          break;
        case 'Recoil':
          await benchmarkRecoil(Math.min(100, itemCount));
          break;
        case 'Jotai':
          await benchmarkJotai(Math.min(100, itemCount));
          break;
      }
    }

    // 强制垃圾回收
    if (window.gc) {
      window.gc();
    }

    // 等待GC完成
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newResults: BenchmarkResult[] = [];

    // 随机化库的测试顺序，避免顺序偏差
    const shuffledLibraries = [...libraries].sort(() => Math.random() - 0.5);

    for (const library of shuffledLibraries) {
      setActiveTest(library);

      // 等待UI更新
      await new Promise(resolve => setTimeout(resolve, 100));

      // 强制垃圾回收
      if (window.gc) {
        window.gc();
      }

      // 等待GC完成
      await new Promise(resolve => setTimeout(resolve, 500));

      const startMemory = (performance as any).memory
        ? (performance as any).memory.usedJSHeapSize
        : 0;
      const startTime = performance.now();

      // 运行特定基准测试
      for (let i = 0; i < iterations; i++) {
        switch (library) {
          case 'Yoks':
            await benchmarkYoks(itemCount);
            break;
          case 'Zustand':
            await benchmarkZustand(itemCount);
            break;
          case 'Redux':
            await benchmarkRedux(itemCount);
            break;
          case 'Recoil':
            await benchmarkRecoil(itemCount);
            break;
          case 'Jotai':
            await benchmarkJotai(itemCount);
            break;
        }
      }

      const endTime = performance.now();

      const endMemory = (performance as any).memory
        ? (performance as any).memory.usedJSHeapSize
        : 0;

      newResults.push({
        library,
        renderTime: (endTime - startTime) / iterations,
        updateTime: (endTime - startTime) / (iterations * itemCount),
        memoryUsage: (endMemory - startMemory) / 1024 / 1024, // MB
      });

      // 清理内存
      if (window.gc) {
        window.gc();
      }

      // 等待GC完成
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // 按原始顺序排序结果以保持一致的显示
    newResults.sort(
      (a, b) => libraries.indexOf(a.library) - libraries.indexOf(b.library),
    );

    setResults(newResults);
    setIsRunning(false);
    setActiveTest(null);
  };

  // Placeholder for actual benchmark implementations
  const benchmarkYoks = async (count: number) => {
    // Implementation will be added
    await new Promise(resolve => setTimeout(resolve, 10));
  };

  const benchmarkZustand = async (count: number) => {
    // Implementation will be added
    await new Promise(resolve => setTimeout(resolve, 10));
  };

  const benchmarkRedux = async (count: number) => {
    // Implementation will be added
    await new Promise(resolve => setTimeout(resolve, 10));
  };

  const benchmarkRecoil = async (count: number) => {
    // Implementation will be added
    await new Promise(resolve => setTimeout(resolve, 10));
  };

  const benchmarkJotai = async (count: number) => {
    // Implementation will be added
    await new Promise(resolve => setTimeout(resolve, 10));
  };

  const renderTimeData = {
    labels: results.map(r => r.library),
    datasets: [
      {
        label: 'Render Time (ms)',
        data: results.map(r => r.renderTime),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const updateTimeData = {
    labels: results.map(r => r.library),
    datasets: [
      {
        label: 'Update Time (ms per item)',
        data: results.map(r => r.updateTime),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const memoryData = {
    labels: results.map(r => r.library),
    datasets: [
      {
        label: 'Memory Usage (MB)',
        data: results.map(r => r.memoryUsage),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="benchmark-container">
      <div className="benchmark-header">
        <h1>State Management Library Benchmark</h1>
        <p>Compare performance between Yoks, Zustand, Redux, Recoil, and Jotai</p>
      </div>

      <div className="benchmark-controls">
        <div>
          <label htmlFor="iterations">Iterations: </label>
          <input
            id="iterations"
            type="number"
            value={iterations}
            onChange={e => setIterations(Number(e.target.value))}
            min="1"
            max="100"
            disabled={isRunning}
          />
        </div>

        <div>
          <label htmlFor="itemCount">Items: </label>
          <input
            id="itemCount"
            type="number"
            value={itemCount}
            onChange={e => setItemCount(Number(e.target.value))}
            min="10"
            max="10000"
            disabled={isRunning}
          />
        </div>

        <button onClick={runBenchmark} disabled={isRunning}>
          {isRunning ? 'Running...' : 'Run Benchmark'}
        </button>
      </div>

      {activeTest && (
        <div>
          <h3>Testing {activeTest}...</h3>
          <progress value={undefined} />
        </div>
      )}

      {results.length > 0 && (
        <div className="benchmark-results">
          <h2>Results</h2>

          <div className="benchmark-chart">
            <h3>Render Time</h3>
            <Bar data={renderTimeData} options={{ responsive: true }} />
          </div>

          <div className="benchmark-chart">
            <h3>Update Time</h3>
            <Bar data={updateTimeData} options={{ responsive: true }} />
          </div>

          <div className="benchmark-chart">
            <h3>Memory Usage</h3>
            <Bar data={memoryData} options={{ responsive: true }} />
          </div>

          <h3>Detailed Results</h3>
          <table className="benchmark-table">
            <thead>
              <tr>
                <th>Library</th>
                <th>Render Time (ms)</th>
                <th>Update Time (ms per item)</th>
                <th>Memory Usage (MB)</th>
              </tr>
            </thead>
            <tbody>
              {results.map(result => (
                <tr key={result.library}>
                  <td>{result.library}</td>
                  <td>{result.renderTime.toFixed(2)}</td>
                  <td>{result.updateTime.toFixed(4)}</td>
                  <td>{result.memoryUsage.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BenchmarkRunner;
