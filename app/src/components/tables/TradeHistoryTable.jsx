import React from 'react';
import { Edit } from 'lucide-react';
import { getResultText, isWin } from '../../utils/calculations';

const TradeHistoryTable = ({ trades, onViewTrade, onEditTrade }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-xl font-semibold text-gray-200">Trade History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700/50">
            <tr>
              <th className="text-left py-4 px-6 font-medium text-gray-300">Symbol</th>
              <th className="text-left py-4 px-6 font-medium text-gray-300">Option</th>
              <th className="text-left py-4 px-6 font-medium text-gray-300">Type</th>
              <th className="text-left py-4 px-6 font-medium text-gray-300">Entry</th>
              <th className="text-left py-4 px-6 font-medium text-gray-300">Exit</th>
              <th className="text-left py-4 px-6 font-medium text-gray-300">Qty</th>
              <th className="text-left py-4 px-6 font-medium text-gray-300">P&L</th>
              <th className="text-left py-4 px-6 font-medium text-gray-300">Reason</th>
              <th className="text-left py-4 px-6 font-medium text-gray-300">Source</th>
              <th className="text-left py-4 px-6 font-medium text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id} className="border-t border-gray-700 hover:bg-gray-700/30 transition-colors">
                <td className="py-4 px-6">
                  <button 
                    onClick={() => onViewTrade(trade)}
                    className="font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    {trade.symbol}
                  </button>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-gray-300 max-w-32 truncate" title={trade.option}>
                    {trade.option || '-'}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    trade.type === 'CALL' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
                  }`}>
                    {trade.type}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-300">${trade.entryPrice.toFixed(2)}</td>
                <td className="py-4 px-6 text-gray-300">${trade.exitPrice.toFixed(2)}</td>
                <td className="py-4 px-6 text-gray-300">{trade.quantity}</td>
                <td className="py-4 px-6">
                  <div>
                    <span className={`font-bold ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      ${trade.pnl.toLocaleString()}
                    </span>
                    {trade.result !== undefined && (
                      <div className={`text-xs mt-1 flex items-center gap-1 ${
                        isWin(trade.result) ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        📊 {getResultText(trade.result)}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-gray-300 max-w-40 truncate" title={trade.reason}>
                    {trade.reason || '-'}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-purple-300">
                    {trade.source || '-'}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => onEditTrade(trade)}
                    className="text-blue-400 hover:text-blue-300 transition-colors p-1 rounded hover:bg-gray-700"
                    title="Edit trade"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradeHistoryTable;
