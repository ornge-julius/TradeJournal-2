import React, { useMemo } from 'react';
import { Fab } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useDateFilter, filterTradesByExitDate } from '../../context/DateFilterContext';
import { useAuth } from '../../hooks/useAuth';
import TradeHistoryTable from '../tables/TradeHistoryTable';

const TradeHistoryView = ({ trades, onToggleTradeForm }) => {
  const { isAuthenticated } = useAuth();
  const { filter } = useDateFilter();

  const filteredTrades = useMemo(() => {
    return filterTradesByExitDate(trades, filter);
  }, [trades, filter]);

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Trade History</h1>
        {isAuthenticated && (
          <Fab
            color="primary"
            aria-label="add trade"
            onClick={onToggleTradeForm}
            sx={{
              background: 'linear-gradient(to right, #2563EB, #059669)',
              '&:hover': {
                background: 'linear-gradient(to right, #1D4ED8, #047857)',
              },
              zIndex: 10,
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

      <TradeHistoryTable trades={filteredTrades} />
    </div>
  );
};

export default TradeHistoryView;

