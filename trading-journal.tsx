import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target, Calendar, Plus, Filter, Edit, X, ArrowLeft, ExternalLink, Settings } from 'lucide-react';

const TradingJournal = () => {
  const [trades, setTrades] = useState([
    {
      id: 1,
      symbol: 'AAPL',
      type: 'CALL',
      entryPrice: 150.00,
      exitPrice: 155.50,
      quantity: 100,
      entryDate: '2024-08-01',
      exitDate: '2024-08-03',
      pnl: 550,
      notes: 'Strong earnings report',
      reason: 'Bullish earnings expectations',
      result: 'WIN',
      option: 'AAPL 08/04 $152.50 Call',
      source: 'TradingView analysis'
    },
    {
      id: 2,
      symbol: 'TSLA',
      type: 'PUT',
      entryPrice: 250.00,
      exitPrice: 240.00,
      quantity: 50,
      entryDate: '2024-08-05',
      exitDate: '2024-08-07',
      pnl: 500,
      notes: 'Overvalued, correction expected',
      reason: 'Technical reversal pattern',
      result: 'WIN',
      option: 'TSLA 08/11 $245 Put',
      source: 'Market sentiment analysis'
    },
    {
      id: 3,
      symbol: 'MSFT',
      type: 'CALL',
      entryPrice: 300.00,
      exitPrice: 295.00,
      quantity: 75,
      entryDate: '2024-08-08',
      exitDate: '2024-08-10',
      pnl: -375,
      notes: 'Stop loss triggered',
      reason: 'Cloud growth momentum',
      result: 'LOSS',
      option: 'MSFT 08/18 $305 Call',
      source: 'Analyst upgrade'
    }
  ]);

  const [newTrade, setNewTrade] = useState({
    symbol: '',
    type: 'CALL',
    entryPrice: '',
    exitPrice: '',
    quantity: '',
    entryDate: '',
    exitDate: '',
    notes: '',
    reason: '',
    result: 'WIN',
    option: '',
    source: ''
  });

  const [showForm, setShowForm] = useState(false);
  const [editingTrade, setEditingTrade] = useState(null);
  const [viewingTrade, setViewingTrade] = useState(null);
  const [startingBalance, setStartingBalance] = useState(50000);
  const [showBalanceForm, setShowBalanceForm] = useState(false);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalTrades = trades.length;
    const winningTrades = trades.filter(t => t.pnl > 0).length;
    const losingTrades = trades.filter(t => t.pnl < 0).length;
    const totalPnL = trades.reduce((sum, trade) => sum + trade.pnl, 0);
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    const avgWin = winningTrades > 0 ? trades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0) / winningTrades : 0;
    const avgLoss = losingTrades > 0 ? Math.abs(trades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0) / losingTrades) : 0;
    
    return {
      totalTrades,
      winningTrades,
      losingTrades,
      totalPnL,
      winRate,
      avgWin,
      avgLoss,
      currentBalance: startingBalance + totalPnL
    };
  }, [trades, startingBalance]);

  // Chart data
  const cumulativePnLData = useMemo(() => {
    let cumulative = 0;
    return trades.map((trade, index) => {
      cumulative += trade.pnl;
      return {
        date: trade.exitDate,
        cumulative,
        trade: trade.pnl,
        tradeNum: index + 1
      };
    });
  }, [trades]);

  const accountBalanceData = useMemo(() => {
    let balance = startingBalance;
    const data = [{ date: 'Start', balance: startingBalance, tradeNum: 0 }];
    
    trades.forEach((trade, index) => {
      balance += trade.pnl;
      data.push({
        date: trade.exitDate,
        balance,
        tradeNum: index + 1
      });
    });
    
    return data;
  }, [trades, startingBalance]);

  const winLossData = [
    { name: 'Winning Trades', value: metrics.winningTrades, color: '#10B981' },
    { name: 'Losing Trades', value: metrics.losingTrades, color: '#EF4444' }
  ];

  const handleAddTrade = () => {
    if (!newTrade.symbol || !newTrade.entryPrice || !newTrade.exitPrice || !newTrade.quantity || !newTrade.entryDate || !newTrade.exitDate) {
      return; // Basic validation
    }
    
    const pnl = (parseFloat(newTrade.exitPrice) - parseFloat(newTrade.entryPrice)) * parseInt(newTrade.quantity);
    const adjustedPnL = newTrade.type === 'PUT' ? -pnl : pnl;
    
    if (editingTrade) {
      // Update existing trade
      const updatedTrade = {
        ...editingTrade,
        ...newTrade,
        entryPrice: parseFloat(newTrade.entryPrice),
        exitPrice: parseFloat(newTrade.exitPrice),
        quantity: parseInt(newTrade.quantity),
        pnl: adjustedPnL
      };
      
      setTrades(trades.map(trade => 
        trade.id === editingTrade.id ? updatedTrade : trade
      ));
      setEditingTrade(null);
    } else {
      // Add new trade
      const trade = {
        id: Date.now(),
        ...newTrade,
        entryPrice: parseFloat(newTrade.entryPrice),
        exitPrice: parseFloat(newTrade.exitPrice),
        quantity: parseInt(newTrade.quantity),
        pnl: adjustedPnL
      };
      
      setTrades([...trades, trade]);
    }
    
    setNewTrade({
      symbol: '',
      type: 'Long',
      entryPrice: '',
      exitPrice: '',
      quantity: '',
      entryDate: '',
      exitDate: '',
      notes: '',
      reason: '',
      result: '',
      option: '',
      source: ''
    });
    setShowForm(false);
  };

  const handleEditTrade = (trade) => {
    setNewTrade({
      symbol: trade.symbol,
      type: trade.type,
      entryPrice: trade.entryPrice.toString(),
      exitPrice: trade.exitPrice.toString(),
      quantity: trade.quantity.toString(),
      entryDate: trade.entryDate,
      exitDate: trade.exitDate,
      notes: trade.notes || '',
      reason: trade.reason || '',
      result: trade.result || '',
      option: trade.option || '',
      source: trade.source || ''
    });
    setEditingTrade(trade);
    setShowForm(true);
  };

  const handleViewTrade = (trade) => {
    setViewingTrade(trade);
  };

  const handleBackToList = () => {
    setViewingTrade(null);
  };

  const handleUpdateBalance = (newBalance) => {
    setStartingBalance(parseFloat(newBalance));
    setShowBalanceForm(false);
  };

  const handleCancelEdit = () => {
    setEditingTrade(null);
    setNewTrade({
      symbol: '',
      type: 'Long',
      entryPrice: '',
      exitPrice: '',
      quantity: '',
      entryDate: '',
      exitDate: '',
      notes: '',
      reason: '',
      result: '',
      option: '',
      source: ''
    });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Trade Detail View */}
        {viewingTrade ? (
          <div>
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={handleBackToList}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-4"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Trade List
              </button>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    Trade Details
                  </h1>
                  <p className="text-gray-400">Complete information for {viewingTrade.symbol} trade</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleEditTrade(viewingTrade)}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Trade
                  </button>
                </div>
              </div>
            </div>

            {/* Trade Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm font-medium">Symbol</h3>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-white">{viewingTrade.symbol}</p>
                <p className="text-xs text-gray-500">{viewingTrade.option || 'Stock Trade'}</p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm font-medium">P&L</h3>
                  {viewingTrade.pnl >= 0 ? 
                    <TrendingUp className="h-5 w-5 text-emerald-400" /> : 
                    <TrendingDown className="h-5 w-5 text-red-400" />
                  }
                </div>
                <p className={`text-2xl font-bold ${viewingTrade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  ${viewingTrade.pnl.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  {viewingTrade.result && (
                    <span className={viewingTrade.result === 'WIN' ? 'text-emerald-400' : 'text-red-400'}>
                      {viewingTrade.result}
                    </span>
                  )}
                </p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm font-medium">Position</h3>
                  <Target className="h-5 w-5 text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-purple-400">{viewingTrade.type}</p>
                <p className="text-xs text-gray-500">{viewingTrade.quantity} contracts</p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm font-medium">Duration</h3>
                  <Calendar className="h-5 w-5 text-yellow-400" />
                </div>
                <p className="text-2xl font-bold text-yellow-400">
                  {Math.ceil((new Date(viewingTrade.exitDate) - new Date(viewingTrade.entryDate)) / (1000 * 60 * 60 * 24))}d
                </p>
                <p className="text-xs text-gray-500">
                  {viewingTrade.entryDate} to {viewingTrade.exitDate}
                </p>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Trade Details */}
              <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-6 text-gray-200">Trade Information</h3>
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-gray-700">
                    <span className="text-gray-400">Entry Price</span>
                    <span className="text-white font-medium">${viewingTrade.entryPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-700">
                    <span className="text-gray-400">Exit Price</span>
                    <span className="text-white font-medium">${viewingTrade.exitPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-700">
                    <span className="text-gray-400">Quantity</span>
                    <span className="text-white font-medium">{viewingTrade.quantity}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-700">
                    <span className="text-gray-400">Entry Date</span>
                    <span className="text-white font-medium">{viewingTrade.entryDate}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-700">
                    <span className="text-gray-400">Exit Date</span>
                    <span className="text-white font-medium">{viewingTrade.exitDate}</span>
                  </div>
                  {viewingTrade.source && (
                    <div className="flex justify-between py-3 border-b border-gray-700">
                      <span className="text-gray-400">Source</span>
                      <span className="text-purple-300 font-medium">{viewingTrade.source}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Analysis Section */}
              <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-6 text-gray-200">Trade Analysis</h3>
                <div className="space-y-6">
                  {viewingTrade.reason && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                        💡 Reason for Entry
                      </h4>
                      <p className="text-white bg-gray-700/50 rounded-lg p-4">{viewingTrade.reason}</p>
                    </div>
                  )}
                  
                  {viewingTrade.result && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                        📊 Trade Outcome
                      </h4>
                      <div className={`inline-flex px-3 py-2 rounded-lg font-medium ${
                        viewingTrade.result === 'WIN' 
                          ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700' 
                          : 'bg-red-900/50 text-red-300 border border-red-700'
                      }`}>
                        {viewingTrade.result}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                      📈 Performance Metrics
                    </h4>
                    <div className="bg-gray-700/50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Return %:</span>
                        <span className={`font-medium ${viewingTrade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {(((viewingTrade.exitPrice - viewingTrade.entryPrice) / viewingTrade.entryPrice) * 100).toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Total Return:</span>
                        <span className={`font-medium ${viewingTrade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          ${viewingTrade.pnl.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Extended Notes Section */}
            {viewingTrade.notes && (
              <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center gap-2">
                  📝 Extended Notes
                </h3>
                <div className="bg-gray-700/30 rounded-lg p-6">
                  <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{viewingTrade.notes}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Main Dashboard View
          <div>
        {/* Header */}
        <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  Trading Journal
                </h1>
                <p className="text-gray-400">Track your trades and analyze your performance</p>
              </div>
              <button
                onClick={() => setShowBalanceForm(!showBalanceForm)}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
            </div>

            {/* Balance Setting Form */}
            {showBalanceForm && (
              <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 mt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-200">Account Settings</h3>
                <div className="flex items-end gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Starting Account Balance</label>
                    <input
                      type="number"
                      step="0.01"
                      defaultValue={startingBalance}
                      placeholder="50000"
                      className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleUpdateBalance(e.target.value);
                        }
                      }}
                      id="balanceInput"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const input = document.getElementById('balanceInput');
                        handleUpdateBalance(input.value);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => setShowBalanceForm(false)}
                      className="bg-gray-600 hover:bg-gray-700 px-4 py-3 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm font-medium">Account Balance</h3>
              <DollarSign className="h-5 w-5 text-blue-400" />
            </div>
            <p className={`text-2xl font-bold ${metrics.currentBalance >= startingBalance ? 'text-emerald-400' : 'text-red-400'}`}>
              ${metrics.currentBalance.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">Starting: ${startingBalance.toLocaleString()}</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm font-medium">Total P&L</h3>
              {metrics.totalPnL >= 0 ? 
                <TrendingUp className="h-5 w-5 text-emerald-400" /> : 
                <TrendingDown className="h-5 w-5 text-red-400" />
              }
            </div>
            <p className={`text-2xl font-bold ${metrics.totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              ${metrics.totalPnL.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">{trades.length} total trades</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm font-medium">Win Rate</h3>
              <Target className="h-5 w-5 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-purple-400">
              {metrics.winRate.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500">{metrics.winningTrades}W / {metrics.losingTrades}L</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm font-medium">Avg Win/Loss</h3>
              <Calendar className="h-5 w-5 text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-yellow-400">
              ${metrics.avgWin.toFixed(0)}/${metrics.avgLoss.toFixed(0)}
            </p>
            <p className="text-xs text-gray-500">Risk/Reward Ratio</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Account Balance Over Time */}
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-200">Account Balance Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={accountBalanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="tradeNum" 
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Balance']}
                  labelFormatter={(label) => `Trade #${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#1E40AF' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Win/Loss Ratio */}
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-200">Win/Loss Ratio</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={winLossData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {winLossData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-gray-400">Wins ({metrics.winningTrades})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-400">Losses ({metrics.losingTrades})</span>
              </div>
            </div>
          </div>

          {/* Total Profit Chart */}
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 lg:col-span-2">
            <h3 className="text-xl font-semibold mb-4 text-gray-200">Cumulative Profit/Loss</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cumulativePnLData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="tradeNum" 
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                  formatter={(value, name) => {
                    if (name === 'cumulative') return [`$${value.toLocaleString()}`, 'Cumulative P&L'];
                    return [`$${value.toLocaleString()}`, 'Trade P&L'];
                  }}
                  labelFormatter={(label) => `Trade #${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2, fill: '#059669' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Add Trade Button */}
        <div className="mb-6">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5" />
            Add New Trade
          </button>
        </div>

        {/* Add/Edit Trade Form */}
        {showForm && (
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-200">
                {editingTrade ? 'Edit Trade' : 'Add New Trade'}
              </h3>
              <button 
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Symbol</label>
                <input
                  type="text"
                  placeholder="e.g., AAPL"
                  value={newTrade.symbol}
                  onChange={(e) => setNewTrade({...newTrade, symbol: e.target.value.toUpperCase()})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Position Type</label>
                <select
                  value={newTrade.type}
                  onChange={(e) => setNewTrade({...newTrade, type: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="CALL">CALL</option>
                  <option value="PUT">PUT</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Option Contract</label>
                <input
                  type="text"
                  placeholder="e.g., AAPL 08/18 $150 Call"
                  value={newTrade.option}
                  onChange={(e) => setNewTrade({...newTrade, option: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Entry Price</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newTrade.entryPrice}
                  onChange={(e) => setNewTrade({...newTrade, entryPrice: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Exit Price</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newTrade.exitPrice}
                  onChange={(e) => setNewTrade({...newTrade, exitPrice: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
                <input
                  type="number"
                  placeholder="0"
                  value={newTrade.quantity}
                  onChange={(e) => setNewTrade({...newTrade, quantity: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Entry Date</label>
                <input
                  type="date"
                  value={newTrade.entryDate}
                  onChange={(e) => setNewTrade({...newTrade, entryDate: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Exit Date</label>
                <input
                  type="date"
                  value={newTrade.exitDate}
                  onChange={(e) => setNewTrade({...newTrade, exitDate: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Source</label>
                <input
                  type="text"
                  placeholder="e.g., TradingView, Discord"
                  value={newTrade.source}
                  onChange={(e) => setNewTrade({...newTrade, source: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Reason for Trade</label>
                <input
                  type="text"
                  placeholder="Why did you enter this trade?"
                  value={newTrade.reason}
                  onChange={(e) => setNewTrade({...newTrade, reason: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Trade Result</label>
                <select
                  value={newTrade.result}
                  onChange={(e) => setNewTrade({...newTrade, result: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select result</option>
                  <option value="WIN">WIN</option>
                  <option value="LOSS">LOSS</option>
                </select>
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-300 mb-2">Additional Notes</label>
                <textarea
                  placeholder="Any additional thoughts or observations..."
                  value={newTrade.notes}
                  onChange={(e) => setNewTrade({...newTrade, notes: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                />
              </div>
              <div className="flex gap-2 md:col-span-3">
                <button
                  type="button"
                  onClick={handleAddTrade}
                  className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg font-medium transition-colors flex-1"
                >
                  {editingTrade ? 'Update Trade' : 'Add Trade'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Trade History */}
        <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-xl font-semibold text-gray-200">Trade History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-300">Symbol</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-300">Option</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-300">Type</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-300">Entry</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-300">Exit</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-300">Qty</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-300">P&L</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-300">Reason</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-300">Source</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade) => (
                  <tr key={trade.id} className="border-t border-gray-700 hover:bg-gray-700/30 transition-colors">
                    <td className="py-4 px-6">
                      <button 
                        onClick={() => handleViewTrade(trade)}
                        className="font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                      >
                        {trade.symbol}
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-300 max-w-32 truncate" title={trade.option}>
                        {trade.option || '-'}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        trade.type === 'CALL' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
                      }`}>
                        {trade.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-300">${trade.entryPrice.toFixed(2)}</td>
                    <td className="py-4 px-6 text-gray-300">${trade.exitPrice.toFixed(2)}</td>
                    <td className="py-4 px-6 text-gray-300">{trade.quantity}</td>
                    <td className="py-4 px-6">
                      <div>
                        <span className={`font-bold ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          ${trade.pnl.toLocaleString()}
                        </span>
                        {trade.result && (
                          <div className={`text-xs mt-1 flex items-center gap-1 ${
                            trade.result === 'WIN' ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                            📊 {trade.result}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-300 max-w-40 truncate" title={trade.reason}>
                        {trade.reason || '-'}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-purple-300">
                        {trade.source || '-'}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleEditTrade(trade)}
                        className="text-blue-400 hover:text-blue-300 transition-colors p-1 rounded hover:bg-gray-700"
                        title="Edit trade"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default TradingJournal;