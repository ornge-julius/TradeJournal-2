import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getResultText, isWin, getTradeTypeText } from '../../utils/calculations';
import TagBadge from '../ui/TagBadge';
import { useTagFilter } from '../../context/TagFilterContext';

const TradeHistoryTable = ({ trades }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  const { hasActiveFilters, clearTags } = useTagFilter();
  const tradesPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(trades.length / tradesPerPage));

  useEffect(() => {
    setCurrentPage(1);
  }, [trades.length]);

  const isFilteredEmptyState = hasActiveFilters && trades.length === 0;

  // Calculate paginated trades
  const startIndex = (currentPage - 1) * tradesPerPage;
  const endIndex = startIndex + tradesPerPage;
  const paginatedTrades = trades.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  if (isFilteredEmptyState) {
    return (
      <div className="bg-white dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl overflow-hidden">
        <div className="p-8 text-center space-y-3">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">No trades match the selected tags</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Adjust or clear your tag filters to see trade history results.
          </p>
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
    <div className="bg-white dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">Trade History</h3>
        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed text-gray-900 dark:text-gray-200 rounded-md transition-colors flex items-center justify-center"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-gray-700 dark:text-gray-300 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed text-gray-900 dark:text-gray-200 rounded-md transition-colors flex items-center justify-center"
              aria-label="Next page"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
      <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
            <tr>
              <th className="text-left py-4 px-6 font-medium text-gray-700 dark:text-gray-300">Symbol</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700 dark:text-gray-300">Option</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700 dark:text-gray-300">Type</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700 dark:text-gray-300">Entry Price</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700 dark:text-gray-300">Exit Price</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700 dark:text-gray-300">Qty</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700 dark:text-gray-300 w-32">Entry Date</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700 dark:text-gray-300 w-32">Exit Date</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700 dark:text-gray-300">Profit</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700 dark:text-gray-300">Result</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700 dark:text-gray-300 w-48">Reason</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700 dark:text-gray-300">Source</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700 dark:text-gray-300">Tags</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700 dark:text-gray-300">Notes</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTrades.map((trade) => (
              <tr key={trade.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td className="py-4 px-6">
                  <Link
                    to={`/detail/${trade.id}`}
                    state={{ from: `${location.pathname}${location.search}` }}
                    className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    {trade.symbol}
                  </Link>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-gray-700 dark:text-gray-300 max-w-32 truncate" title={trade.option}>
                    {trade.option || '-'}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    trade.position_type === 1 ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
                  }`}>
                    {getTradeTypeText(trade.position_type)}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-700 dark:text-gray-300">${trade.entry_price.toFixed(2)}</td>
                <td className="py-4 px-6 text-gray-700 dark:text-gray-300">${trade.exit_price.toFixed(2)}</td>
                <td className="py-4 px-6 text-gray-700 dark:text-gray-300">{trade.quantity}</td>
                <td className="py-4 px-6 text-gray-700 dark:text-gray-300 text-sm w-32">{trade.entry_date}</td>
                <td className="py-4 px-6 text-gray-700 dark:text-gray-300 text-sm w-32">{trade.exit_date}</td>
                <td className="py-4 px-6">
                  <span className={`font-bold ${trade.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    ${trade.profit.toLocaleString()}
                  </span>
                </td>
                <td className="py-4 px-6">
                  {trade.result !== undefined ? (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      isWin(trade.result) ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
                    }`}>
                      {getResultText(trade.result)}
                    </span>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-500 text-sm">-</span>
                  )}
                </td>
                <td className="py-4 px-6 w-48">
                  <div className="text-sm text-gray-700 dark:text-gray-300 max-w-48 truncate" title={trade.reasoning}>
                    {trade.reasoning || '-'}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-purple-600 dark:text-purple-300 max-w-32 truncate" title={trade.source}>
                    {trade.source || '-'}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-wrap gap-1.5 max-w-44">
                    {trade.tags && trade.tags.length > 0 ? (
                      trade.tags.map((tag) => (
                        <TagBadge key={tag.id} tag={tag} size="small" />
                      ))
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500 text-xs">—</span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-gray-700 dark:text-gray-300 max-w-40 truncate" title={trade.notes}>
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
