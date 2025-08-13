import { useReducer, useCallback } from 'react';
import { settingsReducer, SETTINGS_ACTIONS, initialSettingsState } from '../reducers/settingsReducer';

export const useSettings = () => {
  const [state, dispatch] = useReducer(settingsReducer, initialSettingsState);

  const updateStartingBalance = useCallback((newBalance) => {
    dispatch({ type: SETTINGS_ACTIONS.UPDATE_STARTING_BALANCE, payload: parseFloat(newBalance) });
  }, []);

  const toggleBalanceForm = useCallback(() => {
    dispatch({ type: SETTINGS_ACTIONS.TOGGLE_BALANCE_FORM });
  }, []);

  const toggleTradeForm = useCallback(() => {
    dispatch({ type: SETTINGS_ACTIONS.TOGGLE_TRADE_FORM });
  }, []);

  return {
    startingBalance: state.startingBalance,
    showBalanceForm: state.showBalanceForm,
    showTradeForm: state.showTradeForm,
    updateStartingBalance,
    toggleBalanceForm,
    toggleTradeForm
  };
};
