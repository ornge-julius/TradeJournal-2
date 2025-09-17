import { useReducer, useCallback, useEffect } from 'react';
import { accountsReducer, ACCOUNTS_ACTIONS, initialAccountsState } from '../reducers/accountsReducer';
import { usersReducer, USERS_ACTIONS, initialUsersState } from '../reducers/usersReducer';
import { supabase } from '../supabaseClient';

export const useAppState = () => {
  const [accountsState, accountsDispatch] = useReducer(accountsReducer, initialAccountsState);
  const [usersState, usersDispatch] = useReducer(usersReducer, initialUsersState);

  useEffect(() => {
    const fetchAccount = async () => {
      
      try {
        // First, fetch the specific account with the hardcoded ID
        //TODO: Need to change this to fetch all accounts
        //TODO: Change to only fetch account for the user

        const { data: accountData, error: accountError } = await supabase
          .from('accounts')
          .select('*')
          .eq('id', 'f5bf8559-5779-47ce-ba65-75737aed3622').single();
          
        if (accountError) {
          // If account not found, show a helpful message
          if (accountError.code === 'PGRST116') {
            console.error('Account not found. Please check if the account ID exists in the database.');
          }
          return;
        }

        if (!accountData) {
          console.error('No account data returned');
          return;
        }

        // Map database fields to expected format
        //TODO: Instead of mapping the data, access the data using snake_case attributes
        const mappedAccountData = {
          id: accountData.id,
          name: accountData.name || 'Trading Account',
          startingBalance: accountData.starting_balance || 0,
          currentBalance: accountData.current_balance || accountData.starting_balance || 0,
          user_id: accountData.user_id || null,
          created_at: accountData.created_at || new Date().toISOString(),
          isActive: accountData.is_active !== false
        };

        // Set the account data in the state
        accountsDispatch({
          type: ACCOUNTS_ACTIONS.SET_ACCOUNTS,
          payload: [mappedAccountData]
        });

        // Set this account as the selected account
        accountsDispatch({
          type: ACCOUNTS_ACTIONS.SET_SELECTED_ACCOUNT,
          payload: mappedAccountData.id
        });

        // Update the starting balance from the account data
        if (mappedAccountData.startingBalance !== undefined) {
          accountsDispatch({
            type: ACCOUNTS_ACTIONS.UPDATE_STARTING_BALANCE,
            payload: mappedAccountData.startingBalance,
          });
        }

      } catch (err) {
        console.error('Unexpected error in fetchAccount:', err);
      }
    };

    fetchAccount();
  }, []);

  // Account-related functions (maintaining the same API as useSettings)
  const updateStartingBalance = useCallback(async (newBalance) => {
    const balance = parseFloat(newBalance);
    
    if (!accountsState.selectedAccountId) {
      console.error('No account selected, cannot update balance');
      return;
    }
    
    accountsDispatch({ type: ACCOUNTS_ACTIONS.UPDATE_STARTING_BALANCE, payload: balance });

    try {
      const { data, error, status, statusText } = await supabase
        .from('accounts')
        .upsert({ 
          id: accountsState.selectedAccountId, 
          starting_balance: balance 
        });
    } catch (err) {
      console.error('Unexpected error in updateStartingBalance:', err);
    }
  }, [accountsState.selectedAccountId]);

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
