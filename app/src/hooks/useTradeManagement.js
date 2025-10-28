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
        .order('entry_date', { ascending: false });

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
      return null;
    }

    const entryPrice = parseFloat(tradeData.entry_price);
    const exitPrice = parseFloat(tradeData.exit_price);
    const quantity = parseInt(tradeData.quantity, 10);
    const positionType = parseInt(tradeData.position_type, 10);

    if ([entryPrice, exitPrice, positionType].some((value) => Number.isNaN(value)) || Number.isNaN(quantity)) {
      console.error('Invalid numeric values provided when adding trade', {
        entry_price: tradeData.entry_price,
        exit_price: tradeData.exit_price,
        quantity: tradeData.quantity,
        position_type: tradeData.position_type
      });
      return null;
    }

    const profit = calculateProfit(
      entryPrice,
      exitPrice,
      quantity,
      positionType
    );

    const parsedResult =
      tradeData.result === null || tradeData.result === undefined || tradeData.result === ''
        ? null
        : parseInt(tradeData.result, 10);

    const newTrade = {
      symbol: tradeData.symbol,
      position_type: Number.isNaN(positionType) ? null : positionType,
      entry_price: entryPrice,
      exit_price: exitPrice,
      quantity,
      entry_date: tradeData.entry_date,
      exit_date: tradeData.exit_date,
      notes: tradeData.notes || '',
      reasoning: tradeData.reasoning || '',
      result: Number.isNaN(parsedResult) ? null : parsedResult,
      option: tradeData.option || '',
      source: tradeData.source || '',
      profit,
      account_id: selectedAccountId
    };

    if (tradeData.user_id) {
      newTrade.user_id = tradeData.user_id;
    }

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
        return null;
      }

      // Refetch all trades instead of just dispatching ADD_TRADE
      // This ensures proper sort order and updates all charts and metrics
      await fetchTrades();
      
      return data;
    } catch (err) {
      console.error('Unexpected error in addTrade:', err);
      return null;
    }
  }, [selectedAccountId, fetchTrades]);

  const updateTrade = useCallback(async (tradeData) => {
    if (!selectedAccountId) {
      console.error('No account selected, cannot update trade');
      return null;
    }

    const entryPrice = parseFloat(tradeData.entry_price);
    const exitPrice = parseFloat(tradeData.exit_price);
    const quantity = parseInt(tradeData.quantity, 10);
    const positionType = parseInt(tradeData.position_type, 10);

    if (!tradeData.id) {
      console.error('Cannot update trade without an id');
      return null;
    }

    if ([entryPrice, exitPrice, positionType].some((value) => Number.isNaN(value)) || Number.isNaN(quantity)) {
      console.error('Invalid numeric values provided when updating trade', {
        entry_price: tradeData.entry_price,
        exit_price: tradeData.exit_price,
        quantity: tradeData.quantity,
        position_type: tradeData.position_type
      });
      return null;
    }

    const profit = calculateProfit(
      entryPrice,
      exitPrice,
      quantity,
      positionType
    );

    const parsedResult =
      tradeData.result === null || tradeData.result === undefined || tradeData.result === ''
        ? null
        : parseInt(tradeData.result, 10);

    const updatedTrade = {
      symbol: tradeData.symbol,
      position_type: Number.isNaN(positionType) ? null : positionType,
      entry_price: entryPrice,
      exit_price: exitPrice,
      quantity,
      entry_date: tradeData.entry_date,
      exit_date: tradeData.exit_date,
      notes: tradeData.notes || '',
      reasoning: tradeData.reasoning || '',
      result: Number.isNaN(parsedResult) ? null : parsedResult,
      option: tradeData.option || '',
      source: tradeData.source || '',
      profit,
      account_id: tradeData.account_id || selectedAccountId
    };

    if (tradeData.user_id) {
      updatedTrade.user_id = tradeData.user_id;
    }

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
        return null;
      }

      // Refetch all trades instead of just dispatching UPDATE_TRADE
      // This ensures proper sort order and updates all charts and metrics
      await fetchTrades();
      
      return data;
    } catch (err) {
      console.error('Unexpected error in updateTrade:', err);
      return null;
    }
  }, [selectedAccountId, fetchTrades]);

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

      // Refetch all trades instead of just dispatching DELETE_TRADE
      // This ensures data consistency and updates all charts and metrics
      await fetchTrades();
    } catch (err) {
      console.error('Unexpected error in deleteTrade:', err);
    }
  }, [selectedAccountId, fetchTrades]);

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
