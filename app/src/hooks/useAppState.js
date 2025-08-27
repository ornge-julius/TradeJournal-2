import { useReducer, useCallback } from 'react';
import { accountsReducer, ACCOUNTS_ACTIONS, initialAccountsState } from '../reducers/accountsReducer';
import { usersReducer, USERS_ACTIONS, initialUsersState } from '../reducers/usersReducer';

export const useAppState = () => {
  const [accountsState, accountsDispatch] = useReducer(accountsReducer, initialAccountsState);
  const [usersState, usersDispatch] = useReducer(usersReducer, initialUsersState);

  // Account-related functions (maintaining the same API as useSettings)
  const updateStartingBalance = useCallback((newBalance) => {
    accountsDispatch({ type: ACCOUNTS_ACTIONS.UPDATE_STARTING_BALANCE, payload: parseFloat(newBalance) });
  }, []);

  const toggleBalanceForm = useCallback(() => {
    accountsDispatch({ type: ACCOUNTS_ACTIONS.TOGGLE_BALANCE_FORM });
  }, []);

  const toggleTradeForm = useCallback(() => {
    accountsDispatch({ type: ACCOUNTS_ACTIONS.TOGGLE_TRADE_FORM });
  }, []);

  // User-related functions
  const setUserInfo = useCallback((userInfo) => {
    usersDispatch({ type: USERS_ACTIONS.SET_USER_INFO, payload: userInfo });
  }, []);

  const updateEmail = useCallback((email) => {
    usersDispatch({ type: USERS_ACTIONS.UPDATE_EMAIL, payload: email });
  }, []);

  const updateUsername = useCallback((username) => {
    usersDispatch({ type: USERS_ACTIONS.UPDATE_USERNAME, payload: username });
  }, []);

  const updatePassword = useCallback((password) => {
    usersDispatch({ type: USERS_ACTIONS.UPDATE_PASSWORD, payload: password });
  }, []);

  const clearUserInfo = useCallback(() => {
    usersDispatch({ type: USERS_ACTIONS.CLEAR_USER_INFO });
  }, []);

  // Return the same API as useSettings for backward compatibility
  return {
    // Account state (maintaining exact same API)
    startingBalance: accountsState.startingBalance,
    showBalanceForm: accountsState.showBalanceForm,
    showTradeForm: accountsState.showTradeForm,
    updateStartingBalance,
    toggleBalanceForm,
    toggleTradeForm,
    
    // Additional account state
    currentBalance: accountsState.currentBalance,
    user_id: accountsState.user_id,
    
    // User state
    email: usersState.email,
    username: usersState.username,
    password: usersState.password,
    isAuthenticated: usersState.isAuthenticated,
    setUserInfo,
    updateEmail,
    updateUsername,
    updatePassword,
    clearUserInfo
  };
};
