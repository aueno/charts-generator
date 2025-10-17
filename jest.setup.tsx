// jest.setup.tsx
import React from 'react';
import '@testing-library/jest-dom';
import 'jest-canvas-mock';

// RechartsなどCanvasベースの描画を含むものは描画をスキップするためモック
jest.mock('recharts', () => {
  const Original = jest.requireActual('recharts');
  return {
    ...Original,
    ResponsiveContainer: ({ children }: any) => React.createElement('div', null, children),
  };
});

// Chart.js を使っている箱ひげ図用モック
jest.mock('chart.js', () => {
  const ChartMock: any = jest.fn().mockImplementation(() => ({
    destroy: jest.fn(),
    update: jest.fn(),
  }));
  // Chart.register を呼び出すコードがあるため静的メソッドを提供
  ChartMock.register = jest.fn();
  return {
    Chart: ChartMock,
    registerables: [],
  };
});

// @sgratzl/chartjs-chart-boxplot が Chart.js の要素に依存しているため、
// テスト環境では簡易モックを提供してモジュール評価エラーを防ぐ。
jest.mock('@sgratzl/chartjs-chart-boxplot', () => ({
  // 最小限のダミークラスをエクスポート
  BoxPlotController: class {},
  BoxAndWiskers: class {},
}));
