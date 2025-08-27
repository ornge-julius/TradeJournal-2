// Action types
export const ACCOUNTS_ACTIONS = {
  UPDATE_STARTING_BALANCE: 'UPDATE_STARTING_BALANCE',
  UPDATE_CURRENT_BALANCE: 'UPDATE_CURRENT_BALANCE',
  SET_USER_ID: 'SET_USER_ID',
  TOGGLE_BALANCE_FORM: 'TOGGLE_BALANCE_FORM',
  TOGGLE_TRADE_FORM: 'TOGGLE_TRADE_FORM',
  ADD_ACCOUNT: 'ADD_ACCOUNT',
  UPDATE_ACCOUNT: 'UPDATE_ACCOUNT',
  DELETE_ACCOUNT: 'DELETE_ACCOUNT',
  SET_SELECTED_ACCOUNT: 'SET_SELECTED_ACCOUNT',
  SET_ACCOUNTS: 'SET_ACCOUNTS'
};

// Initial state
export const initialAccountsState = {
  accounts: [
    {
      id: 1,
      name: 'Main Account',
      startingBalance: 4000,
      currentBalance: 4000,
      user_id: null,
      created_at: new Date().toISOString(),
      isActive: true
    }
  ],
  selectedAccountId: 1,
  showBalanceForm: false,
  showTradeForm: false
};

// Accounts reducer
export const accountsReducer = (state, action) => {
  switch (action.type) {
    case ACCOUNTS_ACTIONS.ADD_ACCOUNT:
      const newAccount = {
        ...action.payload,
        id: Date.now(),
        created_at: new Date().toISOString(),
        isActive: true
      };
      return {
        ...state,
        accounts: [...state.accounts, newAccount],
        selectedAccountId: newAccount.id
      };
    
    case ACCOUNTS_ACTIONS.UPDATE_ACCOUNT:
      return {
        ...state,
        accounts: state.accounts.map(account => 
          account.id === action.payload.id ? action.payload : account
        )
      };
    
    case ACCOUNTS_ACTIONS.DELETE_ACCOUNT:
      const remainingAccounts = state.accounts.filter(account => account.id !== action.payload);
      let newSelectedId = state.selectedAccountId;
      
      // If we're deleting the selected account, switch to the first remaining account
      if (action.payload === state.selectedAccountId && remainingAccounts.length > 0) {
        newSelectedId = remainingAccounts[0].id;
      }
      
      return {
        ...state,
        accounts: remainingAccounts,
        selectedAccountId: newSelectedId
      };
    
    case ACCOUNTS_ACTIONS.SET_SELECTED_ACCOUNT:
      return {
        ...state,
        selectedAccountId: action.payload
      };
    
    case ACCOUNTS_ACTIONS.SET_ACCOUNTS:
      return {
        ...state,
        accounts: action.payload
      };
    
    case ACCOUNTS_ACTIONS.UPDATE_STARTING_BALANCE:
      return {
        ...state,
        accounts: state.accounts.map(account => 
          account.id === state.selectedAccountId 
            ? { ...account, startingBalance: action.payload, currentBalance: action.payload }
            : account
        )
      };
    
    case ACCOUNTS_ACTIONS.UPDATE_CURRENT_BALANCE:
      return {
        ...state,
        accounts: state.accounts.map(account => 
          account.id === state.selectedAccountId 
            ? { ...account, currentBalance: action.payload }
            : account
        )
      };
    
    case ACCOUNTS_ACTIONS.SET_USER_ID:
      return {
        ...state,
        accounts: state.accounts.map(account => ({ ...account, user_id: action.payload }))
      };
    
    case ACCOUNTS_ACTIONS.TOGGLE_BALANCE_FORM:
      return {
        ...state,
        showBalanceForm: !state.showBalanceForm
      };
    
    case ACCOUNTS_ACTIONS.TOGGLE_TRADE_FORM:
      return {
        ...state,
        showTradeForm: !state.showTradeForm
      };
    
    default:
      return state;
  }
};
