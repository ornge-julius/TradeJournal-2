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
    // Don't fetch if no account is selected
    if (!selectedAccountId) {
      console.log('No account selected, skipping trade fetch');
      return;
    }

    console.log('Fetching trades for account:', selectedAccountId);
    
    try {
      const { data, error, status, statusText } = await supabase
        .from('trades')
        .select('*')
        .eq('account_id', selectedAccountId)
        .order('entry_date');

      console.log('Supabase response:', { data, error, status, statusText });

      if (error) {
        console.error('Error fetching trades:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return;
      }

      console.log('Successfully fetched trades:', data);
      dispatch({ type: TRADE_ACTIONS.SET_TRADES, payload: data || [] });
    } catch (err) {
      console.error('Unexpected error in fetchTrades:', err);
    }
  }, [selectedAccountId]);

  useEffect(() => {
    if (selectedAccountId) {
      fetchTrades();
    }
  }, [fetchTrades, selectedAccountId]);

  const addTrade = useCallback(async (tradeData) => {
    if (!selectedAccountId) {
      console.error('No account selected, cannot add trade');
      return;
    }

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

    console.log('Adding new trade:', newTrade);

    try {
      const { data, error, status, statusText } = await supabase
        .from('trades')
        .insert([newTrade])
        .select()
        .single();

      console.log('Add trade response:', { data, error, status, statusText });

      if (error) {
        console.error('Error adding trade:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return;
      }

      dispatch({ type: TRADE_ACTIONS.ADD_TRADE, payload: data });
    } catch (err) {
      console.error('Unexpected error in addTrade:', err);
    }
  }, [selectedAccountId]);

  const updateTrade = useCallback(async (tradeData) => {
    if (!selectedAccountId) {
      console.error('No account selected, cannot update trade');
      return;
    }

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

    console.log('Updating trade:', updatedTrade);

    try {
      const { data, error, status, statusText } = await supabase
        .from('trades')
        .update(updatedTrade)
        .eq('id', tradeData.id)
        .select()
        .single();

      console.log('Update trade response:', { data, error, status, statusText });

      if (error) {
        console.error('Error updating trade:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return;
      }

      dispatch({ type: TRADE_ACTIONS.UPDATE_TRADE, payload: data });
    } catch (err) {
      console.error('Unexpected error in updateTrade:', err);
    }
  }, [selectedAccountId]);

  const deleteTrade = useCallback(async (tradeId) => {
    if (!selectedAccountId) {
      console.error('No account selected, cannot delete trade');
      return;
    }

    console.log('Deleting trade:', tradeId);

    try {
      const { error, status, statusText } = await supabase
        .from('trades')
        .delete()
        .eq('id', tradeId);

      console.log('Delete trade response:', { error, status, statusText });

      if (error) {
        console.error('Error deleting trade:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return;
      }

      dispatch({ type: TRADE_ACTIONS.DELETE_TRADE, payload: tradeId });
    } catch (err) {
      console.error('Unexpected error in deleteTrade:', err);
    }
  }, [selectedAccountId]);

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
