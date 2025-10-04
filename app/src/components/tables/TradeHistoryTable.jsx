import React from 'react';
import { getResultText, isWin, getTradeTypeText } from '../../utils/calculations';

const TradeHistoryTable = ({ trades, onViewTrade }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-xl font-semibold text-gray-200">Trade History</h3>
      </div>
      <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
        <table className="w-full">
          <thead className="bg-gray-700 sticky top-0 z-10">
            <tr>
              <th className="text-left py-4 px-6 font-medium text-gray-300">Symbol</th>
              <th className="text-left py-4 px-6 font-medium text-gray-300">Option</th>
              <th className="text-left py-4 px-6 font-medium text-gray-300">Type</th>
              <th className="text-left py-4 px-6 font-medium text-gray-300">Entry Price</th>
              <th className="text-left py-4 px-6 font-medium text-gray-300">Exit Price</th>
              <th className="text-left py-4 px-6 font-medium text-gray-300">Qty</th>
              <th className="text-left py-4 px-6 font-medium text-gray-300 w-32">Entry Date</th>
              <th className="text-left py-4 px-6 font-medium text-gray-300 w-32">Exit Date</th>
              <th className="text-left py-4 px-6 font-medium text-gray-300">Profit</th>
              <th className="text-left py-4 px-6 font-medium text-gray-300">Result</th>
              <th className="text-left py-4 px-6 font-medium text-gray-300 w-48">Reason</th>
              <th className="text-left py-4 px-6 font-medium text-gray-300">Source</th>
              <th className="text-left py-4 px-6 font-medium text-gray-300">Notes</th>
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
                    trade.position_type === 1 ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
                  }`}>
                    {getTradeTypeText(trade.position_type)}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-300">${trade.entry_price.toFixed(2)}</td>
                <td className="py-4 px-6 text-gray-300">${trade.exit_price.toFixed(2)}</td>
                <td className="py-4 px-6 text-gray-300">{trade.quantity}</td>
                <td className="py-4 px-6 text-gray-300 text-sm w-32">{trade.entry_date}</td>
                <td className="py-4 px-6 text-gray-300 text-sm w-32">{trade.exit_date}</td>
                <td className="py-4 px-6">
                  <span className={`font-bold ${trade.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    ${trade.profit.toLocaleString()}
                  </span>
                </td>
                <td className="py-4 px-6">
                  {trade.result !== undefined ? (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      isWin(trade.result) ? 'bg-emerald-900/50 text-emerald-300' : 'bg-red-900/50 text-red-300'
                    }`}>
                      {getResultText(trade.result)}
                    </span>
                  ) : (
                    <span className="text-gray-500 text-sm">-</span>
                  )}
                </td>
                <td className="py-4 px-6 w-48">
                  <div className="text-sm text-gray-300 max-w-48 truncate" title={trade.reasoning}>
                    {trade.reasoning || '-'}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-purple-300 max-w-32 truncate" title={trade.source}>
                    {trade.source || '-'}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-gray-300 max-w-40 truncate" title={trade.notes}>
                    {trade.notes || '-'}
                  </div>
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
