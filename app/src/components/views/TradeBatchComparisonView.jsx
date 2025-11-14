import React, { useMemo } from 'react';
import { calculateMetrics } from '../../utils/calculations';
import {
  calculateTradeBatches,
  generateWinLossChartData,
  generateBatchComparisonData
} from '../../utils/calculations';
import WinLossChart from '../charts/WinLossChart';
import BatchComparisonLineChart from '../charts/BatchComparisonLineChart';
import BatchMetricsCard from '../ui/BatchMetricsCard';
import AvgWLCard from '../ui/cards/AvgWLCard';
import { filterTradesByTags, useTagFilter } from '../../context/TagFilterContext';

const TradeBatchComparisonView = ({ trades }) => {
  const { selectedTagIds, hasActiveFilters, clearTags } = useTagFilter();

  const filteredTrades = useMemo(() => {
    return filterTradesByTags(trades, selectedTagIds);
  }, [trades, selectedTagIds]);

  const { currentBatch, previousBatch } = useMemo(() => {
    return calculateTradeBatches(filteredTrades);
  }, [filteredTrades]);

  const currentMetrics = useMemo(() => {
    return calculateMetrics(currentBatch, 0);
  }, [currentBatch]);

  const previousMetrics = useMemo(() => {
    return calculateMetrics(previousBatch, 0);
  }, [previousBatch]);

  const currentWinLossData = useMemo(() => {
    return generateWinLossChartData(currentBatch);
  }, [currentBatch]);

  const previousWinLossData = useMemo(() => {
    return generateWinLossChartData(previousBatch);
  }, [previousBatch]);

  const comparisonLineData = useMemo(() => {
    return generateBatchComparisonData(currentBatch, previousBatch);
  }, [currentBatch, previousBatch]);

  if (!trades || trades.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Trade Batch Comparison</h1>
          <p className="text-gray-600 dark:text-gray-400">No trades available for comparison</p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">Please add trades to view batch comparison</p>
        </div>
      </div>
    );
  }

  if (hasActiveFilters && filteredTrades.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Trade Batch Comparison</h1>
          <p className="text-gray-600 dark:text-gray-400">No trades match the selected tag filters.</p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center space-y-3">
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your tag filters to see comparison data.</p>
          <button
            type="button"
            onClick={clearTags}
            className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            Clear tag filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Trade Batch Comparison</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {filteredTrades.length <= 10
            ? `Showing baseline view with ${currentBatch.length} trades (comparison available once you reach 11+ trades)`
            : `Comparing your most recent ${currentBatch.length} trades vs previous ${previousBatch.length} trades`
          }
        </p>
      </div>

      {/* Win Rate Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Previous Batch Win Rate */}
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-200">
            Previous Batch Win Rate: {previousMetrics.winRate.toFixed(1)}%
          </h3>
          {/* When 10 or fewer trades, previousBatch will have same data as currentBatch */}
          <WinLossChart
            data={previousWinLossData}
            winningTrades={previousMetrics.winningTrades}
            losingTrades={previousMetrics.losingTrades}
          />
        </div>

        {/* Current Batch Win Rate */}
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-200">
            Current Batch Win Rate: {currentMetrics.winRate.toFixed(1)}%
          </h3>
          <WinLossChart
            data={currentWinLossData}
            winningTrades={currentMetrics.winningTrades}
            losingTrades={currentMetrics.losingTrades}
          />
        </div>

        {/* Previous Avg W/L $ */}
        <AvgWLCard
          title="Previous Avg W/L $"
          subtitle={`${previousBatch.length} trades`}
          metrics={previousMetrics}
          trades={previousBatch}
          avgWin={previousMetrics.avgWin}
          avgLoss={previousMetrics.avgLoss}
        />

        {/* Current Avg W/L $ */}
        <AvgWLCard
          title="Current Avg W/L $"
          subtitle={`${currentBatch.length} trades`}
          metrics={currentMetrics}
          trades={currentBatch}
          avgWin={currentMetrics.avgWin}
          avgLoss={currentMetrics.avgLoss}
        />
      </div>

      {/* Cumulative P&L Comparison Line Chart */}
      {/* Always show chart - when 10 or fewer trades, both lines will overlap with same data */}
      <BatchComparisonLineChart data={comparisonLineData} />

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Previous Batch Metrics */}
        {/* When 10 or fewer trades, previousBatch will have same data as currentBatch */}
        <BatchMetricsCard
          title="Previous Batch"
          subtitle={`${previousBatch.length} trades`}
          metrics={previousMetrics}
          trades={previousBatch}
        />

        {/* Current Batch Metrics */}
        <BatchMetricsCard
          title="Current Batch"
          subtitle={`${currentBatch.length} trades`}
          metrics={currentMetrics}
          trades={currentBatch}
        />
      </div>
    </div>
  );
};

export default TradeBatchComparisonView;
