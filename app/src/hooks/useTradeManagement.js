import { useReducer, useCallback, useEffect, useMemo } from 'react';
import { tradeReducer, TRADE_ACTIONS, initialTradeState } from '../reducers/tradeReducer';
import { calculateProfit } from '../utils/calculations';
import { supabase } from '../supabaseClient';

export const useTradeManagement = (selectedAccountId) => {
  const [state, dispatch] = useReducer(tradeReducer, initialTradeState);

  // Filter trades by selected account
  const accountTrades = useMemo(() => {
    return state.trades.filter(trade => trade.account_id === selectedAccountId);
  }, [state.trades, selectedAccountId]);

  const fetchTrades = useCallback(async () => {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .order('entryDate');

    if (error) {
      console.error('Error fetching trades:', error);
      return;
    }

    dispatch({ type: TRADE_ACTIONS.SET_TRADES, payload: data });
  }, []);

  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  const addTrade = useCallback(async (tradeData) => {
    const profit = calculateProfit(
      parseFloat(tradeData.entryPrice),
      parseFloat(tradeData.exitPrice),
      parseInt(tradeData.quantity),
      tradeData.type
    );

    const newTrade = {
      ...tradeData,
      account_id: selectedAccountId, // Associate trade with current account
      entryPrice: parseFloat(tradeData.entryPrice),
      exitPrice: parseFloat(tradeData.exitPrice),
      quantity: parseInt(tradeData.quantity),
      profit
    };

    const { data, error } = await supabase
      .from('trades')
      .insert([newTrade])
      .select()
      .single();

    if (error) {
      console.error('Error adding trade:', error);
      return;
    }

    dispatch({ type: TRADE_ACTIONS.ADD_TRADE, payload: data });
  }, [selectedAccountId]);

  const updateTrade = useCallback(async (tradeData) => {
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

    const { data, error } = await supabase
      .from('trades')
      .update(updatedTrade)
      .eq('id', tradeData.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating trade:', error);
      return;
    }

    dispatch({ type: TRADE_ACTIONS.UPDATE_TRADE, payload: data });
  }, []);

  const deleteTrade = useCallback(async (tradeId) => {
    const { error } = await supabase
      .from('trades')
      .delete()
      .eq('id', tradeId);

    if (error) {
      console.error('Error deleting trade:', error);
      return;
    }

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
