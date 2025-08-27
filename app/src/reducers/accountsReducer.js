// Action types
export const ACCOUNTS_ACTIONS = {
  UPDATE_STARTING_BALANCE: 'UPDATE_STARTING_BALANCE',
  UPDATE_CURRENT_BALANCE: 'UPDATE_CURRENT_BALANCE',
  SET_USER_ID: 'SET_USER_ID',
  TOGGLE_BALANCE_FORM: 'TOGGLE_BALANCE_FORM',
  TOGGLE_TRADE_FORM: 'TOGGLE_TRADE_FORM'
};

// Initial state
export const initialAccountsState = {
  startingBalance: 4000,
  currentBalance: 4000,
  user_id: null,
  showBalanceForm: false,
  showTradeForm: false
};

// Accounts reducer
export const accountsReducer = (state, action) => {
  switch (action.type) {
    case ACCOUNTS_ACTIONS.UPDATE_STARTING_BALANCE:
      return {
        ...state,
        startingBalance: action.payload,
        currentBalance: action.payload // Update current balance when starting balance changes
      };
    
    case ACCOUNTS_ACTIONS.UPDATE_CURRENT_BALANCE:
      return {
        ...state,
        currentBalance: action.payload
      };
    
    case ACCOUNTS_ACTIONS.SET_USER_ID:
      return {
        ...state,
        user_id: action.payload
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
