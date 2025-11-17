import React from 'react';
import { Fab } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useFilteredTrades } from '../../hooks/useFilteredTrades';
import { useAuth } from '../../hooks/useAuth';
import TradeHistoryTable from '../tables/TradeHistoryTable';

const TradeHistoryView = ({ trades, onToggleTradeForm }) => {
  const { isAuthenticated } = useAuth();
  const filteredTrades = useFilteredTrades(trades);

  return (
    <div className="space-y-6 relative h-full flex flex-col">
      <div className="flex items-center justify-between flex-shrink-0">
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

      <div className="flex-1 min-h-0">
        <TradeHistoryTable trades={filteredTrades} />
      </div>
    </div>
  );
};

export default TradeHistoryView;

