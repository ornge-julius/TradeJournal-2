import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BatchMetricsCard = ({ title, subtitle, metrics, trades }) => {
  const location = useLocation();
  const fromPath = `${location.pathname}${location.search}`;

  if (!metrics) {
    return (
      <div className="bg-white dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl p-4 sm:p-6 w-full min-w-0 overflow-hidden">
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-200">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{subtitle}</p>
        <div className="text-gray-600 dark:text-gray-400">No data available</div>
      </div>
    );
  }

  const {
    totalTrades = 0,
    totalProfit = 0,
    winRate = 0,
    winningTrades = 0,
    losingTrades = 0,
    avgWin = 0,
    avgLoss = 0
  } = metrics;

  // Find best and worst trades
  const bestTrade = trades && trades.length > 0 
    ? trades.reduce((best, trade) => (trade.profit > (best?.profit || -Infinity) ? trade : best), trades[0])
    : null;
  
  const worstTrade = trades && trades.length > 0 
    ? trades.reduce((worst, trade) => (trade.profit < (worst?.profit || Infinity) ? trade : worst), trades[0])
    : null;

  const formatCurrency = (value) => {
    if (typeof value !== 'number' || isNaN(value)) return '$0.00';
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getProfitColor = (value) => {
    if (value > 0) return 'text-emerald-400';
    if (value < 0) return 'text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const winners = trades.filter(trade => trade.result === 1);
  const losers = trades.filter(trade => trade.result === 0);

  const renderSymbolLink = (trade, className) => {
    const key = trade.id ?? `${trade.symbol}-${trade.entry_date}`;
    const symbol = trade.symbol || '—';

    if (!trade.id) {
      return (
        <span key={key} className={`text-sm font-medium ${className} cursor-default`}>
          {symbol}
        </span>
      );
    }

    return (
      <Link
        key={key}
        to={`/detail/${trade.id}`}
        state={{ from: fromPath }}
        className={`text-sm font-medium ${className} transition-colors`}
      >
        {symbol}
      </Link>
    );
  };

  const renderTradeSymbol = (trade, className) => {
    if (!trade) {
      return '—';
    }

    if (!trade.id) {
      return `(${trade.symbol || '—'}) ${formatCurrency(trade.profit)}`;
    }

    return (
      <>
        (
        <Link
          to={`/detail/${trade.id}`}
          state={{ from: fromPath }}
          className={`${className} underline-offset-2 hover:underline`}
        >
          {trade.symbol || '—'}
        </Link>
        ) {formatCurrency(trade.profit)}
      </>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl p-4 sm:p-6 w-full min-w-0 overflow-hidden">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
      </div>

      <div className="space-y-4">
        {/* Total Trades */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
          <span className="text-sm text-gray-600 dark:text-gray-400">Total Trades</span>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">{totalTrades}</span>
        </div>

        {/* Total Profit/Loss */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
          <span className="text-sm text-gray-600 dark:text-gray-400">Total Profit/Loss</span>
          <span className={`text-lg font-semibold ${getProfitColor(totalProfit)}`}>
            {formatCurrency(totalProfit)}
          </span>
        </div>

        {/* Win Rate */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
          <span className="text-sm text-gray-600 dark:text-gray-400">Win Rate</span>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">{winRate.toFixed(2)}%</span>
        </div>

        {/* Winning Trades */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
          <span className="text-sm text-gray-600 dark:text-gray-400">Winning Trades</span>
          <span className="text-lg font-semibold text-emerald-400">{winningTrades}</span>
        </div>

        {/* Winners */}
        {winners && winners.length > 0 && (
          <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400 pt-1">Winners</span>
              <div className="flex flex-wrap justify-end gap-2">
                {winners.map((winner) =>
                  renderSymbolLink(
                    winner,
                    'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'
                  )
                )}
              </div>
            </div>
          </div>
        )}


        {/* Losing Trades */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
          <span className="text-sm text-gray-600 dark:text-gray-400">Losing Trades</span>
          <span className="text-lg font-semibold text-red-400">{losingTrades}</span>
        </div>

        {/* Losers */}
        {losers && losers.length > 0 && (
          <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400 pt-1">Losers</span>
              <div className="flex flex-wrap justify-end gap-2">
                {losers.map((loser) =>
                  renderSymbolLink(
                    loser,
                    'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* Average Win */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
          <span className="text-sm text-gray-600 dark:text-gray-400">Average Win</span>
          <span className="text-lg font-semibold text-emerald-400">
            {winningTrades > 0 ? formatCurrency(avgWin) : '$0.00'}
          </span>
        </div>

        {/* Average Loss */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
          <span className="text-sm text-gray-600 dark:text-gray-400">Average Loss</span>
          <span className="text-lg font-semibold text-red-400">
            {losingTrades > 0 ? formatCurrency(avgLoss) : '$0.00'}
          </span>
        </div>

        {/* Best Trade */}
        {bestTrade && (
          <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">Best Trade</span>
            <span className="text-lg font-semibold text-emerald-400">
              {renderTradeSymbol(bestTrade, 'text-emerald-400')}
            </span>
          </div>
        )}

        {/* Worst Trade */}
        {worstTrade && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Worst Trade</span>
            <span className="text-lg font-semibold text-red-400">
              {renderTradeSymbol(worstTrade, 'text-red-400')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchMetricsCard;
