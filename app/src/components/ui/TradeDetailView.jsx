import React from 'react';
import { ArrowLeft, Edit, ExternalLink, Target, Calendar } from 'lucide-react';
import { calculateTradeDuration, calculateReturnPercentage, getResultText, isWin } from '../../utils/calculations';

const TradeDetailView = ({ trade, onBack, onEdit }) => {
  if (!trade) return null;

  const duration = calculateTradeDuration(trade.entryDate, trade.exitDate);
  const returnPercentage = calculateReturnPercentage(trade.entryPrice, trade.exitPrice);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Trade List
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Trade Details
            </h1>
            <p className="text-gray-400">Complete information for {trade.symbol} trade</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => onEdit(trade)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Trade
            </button>
          </div>
        </div>
      </div>

      {/* Trade Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm font-medium">Symbol</h3>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-white">{trade.symbol}</p>
          <p className="text-xs text-gray-500">{trade.option || 'Stock Trade'}</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm font-medium">P&L</h3>
            {trade.pnl >= 0 ? 
              <span className="text-emerald-400">📈</span> : 
              <span className="text-red-400">📉</span>
            }
          </div>
          <p className={`text-2xl font-bold ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            ${trade.pnl.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">
            {trade.result !== undefined && (
              <span className={isWin(trade.result) ? 'text-emerald-400' : 'text-red-400'}>
                {getResultText(trade.result)}
              </span>
            )}
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm font-medium">Position</h3>
            <Target className="h-5 w-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-400">{trade.type}</p>
          <p className="text-xs text-gray-500">{trade.quantity} contracts</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm font-medium">Duration</h3>
            <Calendar className="h-5 w-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-yellow-400">{duration}d</p>
          <p className="text-xs text-gray-500">
            {trade.entryDate} to {trade.exitDate}
          </p>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Trade Details */}
        <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-6 text-gray-200">Trade Information</h3>
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-gray-700">
              <span className="text-gray-400">Entry Price</span>
              <span className="text-white font-medium">${trade.entryPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-700">
              <span className="text-gray-400">Exit Price</span>
              <span className="text-white font-medium">${trade.exitPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-700">
              <span className="text-gray-400">Quantity</span>
              <span className="text-white font-medium">{trade.quantity}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-700">
              <span className="text-gray-400">Entry Date</span>
              <span className="text-white font-medium">{trade.entryDate}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-700">
              <span className="text-gray-400">Exit Date</span>
              <span className="text-white font-medium">{trade.exitDate}</span>
            </div>
            {trade.source && (
              <div className="flex justify-between py-3 border-b border-gray-700">
                <span className="text-gray-400">Source</span>
                <span className="text-purple-300 font-medium">{trade.source}</span>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Section */}
        <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-6 text-gray-200">Trade Analysis</h3>
          <div className="space-y-6">
            {trade.reason && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  💡 Reason for Entry
                </h4>
                <p className="text-white bg-gray-700/50 rounded-lg p-4">{trade.reason}</p>
              </div>
            )}
            
            {trade.result !== undefined && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  📊 Trade Outcome
                </h4>
                <div className={`inline-flex px-3 py-2 rounded-lg font-medium ${
                  isWin(trade.result)
                    ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700' 
                    : 'bg-red-900/50 text-red-300 border border-red-700'
                }`}>
                  {getResultText(trade.result)}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                📈 Performance Metrics
              </h4>
              <div className="bg-gray-700/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Return %:</span>
                  <span className={`font-medium ${returnPercentage >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {returnPercentage.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Total Return:</span>
                  <span className={`font-medium ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    ${trade.pnl.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extended Notes Section */}
      {trade.notes && (
        <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center gap-2">
            📝 Extended Notes
          </h3>
          <div className="bg-gray-700/30 rounded-lg p-6">
            <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{trade.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeDetailView;
