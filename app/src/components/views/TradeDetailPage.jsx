import React, { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TradeDetailView from '../ui/TradeDetailView';

const TradeDetailPage = ({
  trades,
  editingTrade,
  onEdit,
  onSubmit,
  onCancelEdit,
  onDelete,
  isAuthenticated
}) => {
  const { tradeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const trade = useMemo(() => {
    if (!tradeId) {
      return null;
    }

    return trades.find((item) => String(item.id) === String(tradeId)) || null;
  }, [trades, tradeId]);

  const fromPath = useMemo(() => {
    if (location.state && typeof location.state === 'object') {
      return location.state.from || null;
    }

    return null;
  }, [location.state]);

  const handleBack = () => {
    if (typeof onCancelEdit === 'function') {
      onCancelEdit();
    }

    if (fromPath) {
      navigate(fromPath);
      return;
    }

    navigate('/', { replace: true });
  };

  if (!trade) {
    return (
      <div className="text-center py-12">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Trade Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400">
            We couldn't find details for the requested trade. It may have been deleted or belongs to a different account.
          </p>
          <div>
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TradeDetailView
      trade={trade}
      onBack={handleBack}
      onEdit={onEdit}
      isEditing={Boolean(editingTrade && String(editingTrade.id) === String(trade.id))}
      onSubmit={onSubmit}
      onCancelEdit={onCancelEdit}
      onDelete={onDelete}
      isAuthenticated={isAuthenticated}
    />
  );
};

export default TradeDetailPage;

