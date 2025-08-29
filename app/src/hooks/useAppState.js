import { useReducer, useCallback, useEffect } from 'react';
import { accountsReducer, ACCOUNTS_ACTIONS, initialAccountsState } from '../reducers/accountsReducer';
import { usersReducer, USERS_ACTIONS, initialUsersState } from '../reducers/usersReducer';
import { supabase } from '../supabaseClient';

export const useAppState = () => {
  const [accountsState, accountsDispatch] = useReducer(accountsReducer, initialAccountsState);
  const [usersState, usersDispatch] = useReducer(usersReducer, initialUsersState);

  useEffect(() => {
    const fetchAccount = async () => {
      const { data, error } = await supabase
        .from('accounts')
        .select('starting_balance')
        .single();

      if (error) {
        console.error('Error fetching account:', error);
        return;
      }

      accountsDispatch({
        type: ACCOUNTS_ACTIONS.UPDATE_STARTING_BALANCE,
        payload: data.starting_balance,
      });
    };

    fetchAccount();
  }, []);

  // Account-related functions (maintaining the same API as useSettings)
  const updateStartingBalance = useCallback(async (newBalance) => {
    const balance = parseFloat(newBalance);
    accountsDispatch({ type: ACCOUNTS_ACTIONS.UPDATE_STARTING_BALANCE, payload: balance });

    await supabase.from('accounts').upsert({ id: 1, starting_balance: balance });
  }, []);

  const toggleBalanceForm = useCallback(() => {
    accountsDispatch({ type: ACCOUNTS_ACTIONS.TOGGLE_BALANCE_FORM });
  }, []);

  const toggleTradeForm = useCallback(() => {
    accountsDispatch({ type: ACCOUNTS_ACTIONS.TOGGLE_TRADE_FORM });
  }, []);

  // New account management functions
  const addAccount = useCallback((accountData) => {
    accountsDispatch({ type: ACCOUNTS_ACTIONS.ADD_ACCOUNT, payload: accountData });
  }, []);

  const updateAccount = useCallback((accountData) => {
    accountsDispatch({ type: ACCOUNTS_ACTIONS.UPDATE_ACCOUNT, payload: accountData });
  }, []);

  const deleteAccount = useCallback((accountId) => {
    accountsDispatch({ type: ACCOUNTS_ACTIONS.DELETE_ACCOUNT, payload: accountId });
  }, []);

  const selectAccount = useCallback((accountId) => {
    accountsDispatch({ type: ACCOUNTS_ACTIONS.SET_SELECTED_ACCOUNT, payload: accountId });
  }, []);

  const setAccounts = useCallback((accounts) => {
    accountsDispatch({ type: ACCOUNTS_ACTIONS.SET_ACCOUNTS, payload: accounts });
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

  // Get selected account data
  const selectedAccount = accountsState.accounts.find(acc => acc.id === accountsState.selectedAccountId);

  // Return the same API as useSettings for backward compatibility
  return {
    // Account state (maintaining exact same API)
    startingBalance: selectedAccount?.startingBalance || 0,
    showBalanceForm: accountsState.showBalanceForm,
    showTradeForm: accountsState.showTradeForm,
    updateStartingBalance,
    toggleBalanceForm,
    toggleTradeForm,
    
    // Additional account state
    currentBalance: selectedAccount?.currentBalance || 0,
    user_id: selectedAccount?.user_id || null,
    
    // New account management state and functions
    accounts: accountsState.accounts,
    selectedAccountId: accountsState.selectedAccountId,
    selectedAccount,
    addAccount,
    updateAccount,
    deleteAccount,
    selectAccount,
    setAccounts,
    
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
