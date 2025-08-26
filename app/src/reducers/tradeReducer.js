// Action types
export const TRADE_ACTIONS = {
  ADD_TRADE: 'ADD_TRADE',
  UPDATE_TRADE: 'UPDATE_TRADE',
  DELETE_TRADE: 'DELETE_TRADE',
  SET_TRADES: 'SET_TRADES',
  SET_EDITING_TRADE: 'SET_EDITING_TRADE',
  SET_VIEWING_TRADE: 'SET_VIEWING_TRADE',
  CLEAR_EDITING_TRADE: 'CLEAR_EDITING_TRADE',
  CLEAR_VIEWING_TRADE: 'CLEAR_VIEWING_TRADE'
};

// Initial state
export const initialTradeState = {
  trades: [
    {
      id: 1,
      symbol: 'AAPL',
      type: 1,
      entryPrice: 1.50,
      exitPrice: 1.55,
      quantity: 100,
      entryDate: '2024-08-01',
      exitDate: '2024-08-03',
      profit: 500,
      notes: 'Strong earnings report',
      reason: 'Bullish earnings expectations',
      result: 1,
      option: 'AAPL 08/04 $152.50 Call',
      source: 'TradingView analysis'
    },
    {
      id: 2,
      symbol: 'TSLA',
      type: 2,
      entryPrice: 2.50,
      exitPrice: 2.40,
      quantity: 50,
      entryDate: '2024-08-05',
      exitDate: '2024-08-07',
      profit: 500,
      notes: 'Overvalued, correction expected',
      reason: 'Technical reversal pattern',
      result: 1,
      option: 'TSLA 08/11 $245 Put',
      source: 'Market sentiment analysis'
    },
    {
      id: 3,
      symbol: 'MSFT',
      type: 1,
      entryPrice: 3.00,
      exitPrice: 2.95,
      quantity: 75,
      entryDate: '2024-08-08',
      exitDate: '2024-08-10',
      profit: -375,
      notes: 'Stop loss triggered',
      reason: 'Cloud growth momentum',
      result: 0,
      option: 'MSFT 08/18 $305 Call',
      source: 'Analyst upgrade'
    }
  ],
  editingTrade: null,
  viewingTrade: null
};

// Trade reducer
export const tradeReducer = (state, action) => {
  switch (action.type) {
    case TRADE_ACTIONS.ADD_TRADE:
      return {
        ...state,
        trades: [...state.trades, action.payload]
      };
    
    case TRADE_ACTIONS.UPDATE_TRADE:
      return {
        ...state,
        trades: state.trades.map(trade => 
          trade.id === action.payload.id ? action.payload : trade
        )
      };
    
    case TRADE_ACTIONS.DELETE_TRADE:
      return {
        ...state,
        trades: state.trades.filter(trade => trade.id !== action.payload)
      };
    
    case TRADE_ACTIONS.SET_TRADES:
      return {
        ...state,
        trades: action.payload
      };
    
    case TRADE_ACTIONS.SET_EDITING_TRADE:
      return {
        ...state,
        editingTrade: action.payload
      };
    
    case TRADE_ACTIONS.SET_VIEWING_TRADE:
      return {
        ...state,
        viewingTrade: action.payload
      };
    
    case TRADE_ACTIONS.CLEAR_EDITING_TRADE:
      return {
        ...state,
        editingTrade: null
      };
    
    case TRADE_ACTIONS.CLEAR_VIEWING_TRADE:
      return {
        ...state,
        viewingTrade: null
      };
    
    default:
      return state;
  }
};
