import React from 'react';
import { Fab } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useFilteredTrades } from '../../hooks/useFilteredTrades';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import TradeHistoryTable from '../tables/TradeHistoryTable';

const TradeHistoryView = ({ trades, onToggleTradeForm }) => {
  const { isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  const filteredTrades = useFilteredTrades(trades);

  return (
    <div className="space-y-6 relative h-full flex flex-col">
      <div className="flex items-center justify-between flex-shrink-0">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Trade History</h1>
        {isAuthenticated && (
          <Fab
            aria-label="add trade"
            onClick={onToggleTradeForm}
            sx={{
              backgroundColor: '#10B981',
              border: isDark ? '1px solid #000000' : 'none',
              color: isDark ? '#000000' : '#FFFFFF',
              '&:hover': {
                backgroundColor: '#059669',
              },
              zIndex: 10,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            }}
          >
            <AddIcon />
          </Fab>
        )}
        {!isAuthenticated && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sign in to add trades
          </p>
        )}
      </div>

      <div className="flex-1 min-h-0">
        <TradeHistoryTable trades={filteredTrades} />
      </div>
    </div>
  );
};

export default TradeHistoryView;

