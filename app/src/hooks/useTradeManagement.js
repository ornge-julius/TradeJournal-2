import { useReducer, useCallback } from 'react';
import { tradeReducer, TRADE_ACTIONS, initialTradeState } from '../reducers/tradeReducer';
import { calculateProfit } from '../utils/calculations';

export const useTradeManagement = () => {
  const [state, dispatch] = useReducer(tradeReducer, initialTradeState);

  const addTrade = useCallback((tradeData) => {
    const profit = calculateProfit(
      parseFloat(tradeData.entryPrice),
      parseFloat(tradeData.exitPrice),
      parseInt(tradeData.quantity),
      tradeData.type
    );

    const newTrade = {
      id: Date.now(),
      ...tradeData,
      entryPrice: parseFloat(tradeData.entryPrice),
      exitPrice: parseFloat(tradeData.exitPrice),
      quantity: parseInt(tradeData.quantity),
      profit
    };

    dispatch({ type: TRADE_ACTIONS.ADD_TRADE, payload: newTrade });
  }, []);

  const updateTrade = useCallback((tradeData) => {
    const profit = calculateProfit(
      parseFloat(tradeData.entryPrice),
      parseFloat(tradeData.exitPrice),
      parseInt(tradeData.quantity),
      tradeData.type
    );

    const updatedTrade = {
      ...tradeData,
      entryPrice: parseFloat(tradeData.entryPrice),
      exitPrice: parseFloat(tradeData.exitPrice),
      quantity: parseInt(tradeData.quantity),
      profit
    };

    dispatch({ type: TRADE_ACTIONS.UPDATE_TRADE, payload: updatedTrade });
  }, []);

  const deleteTrade = useCallback((tradeId) => {
    dispatch({ type: TRADE_ACTIONS.DELETE_TRADE, payload: tradeId });
  }, []);

  const setEditingTrade = useCallback((trade) => {
    dispatch({ type: TRADE_ACTIONS.SET_EDITING_TRADE, payload: trade });
  }, []);

  const setViewingTrade = useCallback((trade) => {
    dispatch({ type: TRADE_ACTIONS.SET_VIEWING_TRADE, payload: trade });
  }, []);

  const clearEditingTrade = useCallback(() => {
    dispatch({ type: TRADE_ACTIONS.CLEAR_EDITING_TRADE });
  }, []);

  const clearViewingTrade = useCallback(() => {
    dispatch({ type: TRADE_ACTIONS.CLEAR_VIEWING_TRADE });
  }, []);

  return {
    trades: state.trades,
    editingTrade: state.editingTrade,
    viewingTrade: state.viewingTrade,
    addTrade,
    updateTrade,
    deleteTrade,
    setEditingTrade,
    setViewingTrade,
    clearEditingTrade,
    clearViewingTrade
  };
};
