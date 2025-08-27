import { useReducer, useCallback, useMemo } from 'react';
import { tradeReducer, TRADE_ACTIONS, initialTradeState } from '../reducers/tradeReducer';
import { calculateProfit } from '../utils/calculations';

export const useTradeManagement = (selectedAccountId) => {
  const [state, dispatch] = useReducer(tradeReducer, initialTradeState);

  // Filter trades by selected account
  const accountTrades = useMemo(() => {
    return state.trades.filter(trade => trade.account_id === selectedAccountId);
  }, [state.trades, selectedAccountId]);

  const addTrade = useCallback((tradeData) => {
    const profit = calculateProfit(
      parseFloat(tradeData.entryPrice),
      parseFloat(tradeData.exitPrice),
      parseInt(tradeData.quantity),
      tradeData.type
    );

    const newTrade = {
      id: Date.now(),
      account_id: selectedAccountId, // Associate trade with current account
      ...tradeData,
      entryPrice: parseFloat(tradeData.entryPrice),
      exitPrice: parseFloat(tradeData.exitPrice),
      quantity: parseInt(tradeData.quantity),
      profit
    };

    dispatch({ type: TRADE_ACTIONS.ADD_TRADE, payload: newTrade });
  }, [selectedAccountId]);

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

  // Function to set trades for a specific account
  const setAccountTrades = useCallback((trades) => {
    dispatch({ type: TRADE_ACTIONS.SET_ACCOUNT_TRADES, payload: trades });
  }, []);

  return {
    trades: accountTrades, // Return filtered trades for current account
    allTrades: state.trades, // Return all trades for cross-account operations
    editingTrade: state.editingTrade,
    viewingTrade: state.viewingTrade,
    addTrade,
    updateTrade,
    deleteTrade,
    setEditingTrade,
    setViewingTrade,
    clearEditingTrade,
    clearViewingTrade,
    setAccountTrades
  };
};
