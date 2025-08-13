// Action types
export const SETTINGS_ACTIONS = {
  UPDATE_STARTING_BALANCE: 'UPDATE_STARTING_BALANCE',
  TOGGLE_BALANCE_FORM: 'TOGGLE_BALANCE_FORM',
  TOGGLE_TRADE_FORM: 'TOGGLE_TRADE_FORM'
};

// Initial state
export const initialSettingsState = {
  startingBalance: 50000,
  showBalanceForm: false,
  showTradeForm: false
};

// Settings reducer
export const settingsReducer = (state, action) => {
  switch (action.type) {
    case SETTINGS_ACTIONS.UPDATE_STARTING_BALANCE:
      return {
        ...state,
        startingBalance: action.payload
      };
    
    case SETTINGS_ACTIONS.TOGGLE_BALANCE_FORM:
      return {
        ...state,
        showBalanceForm: !state.showBalanceForm
      };
    
    case SETTINGS_ACTIONS.TOGGLE_TRADE_FORM:
      return {
        ...state,
        showTradeForm: !state.showTradeForm
      };
    
    default:
      return state;
  }
};
