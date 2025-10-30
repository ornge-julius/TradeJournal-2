import React from 'react';
import { Info } from 'lucide-react';

const AvgWLCard = ({ avgWin, avgLoss }) => {
  const calculateRatio = () => {
    if (!avgLoss || avgLoss === 0) return 'N/A';
    return (avgWin / avgLoss).toFixed(2);
  };

  const roundedWin = Math.round(avgWin || 0);
  const roundedLoss = Math.round(avgLoss || 0);
  
  // Normalize values for bar display (max bar width is 100%)
  const total = roundedWin + roundedLoss || 1;
  const winPercentage = (roundedWin / total) * 100;
  const lossPercentage = (roundedLoss / total) * 100;

  return (
    <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all h-full flex flex-col justify-center">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-gray-400 text-sm font-medium">Avg W/L $</h3>
        <Info className="h-4 w-4 text-gray-400" />
      </div>
      
      <p className="text-2xl font-bold text-white mb-4">{calculateRatio()}</p>
      
      <div className="flex items-stretch h-8 gap-1">
        {/* Win Bar */}
        {roundedWin > 0 && (
          <div 
            className="bg-[#10B981] rounded flex items-center justify-center min-w-[40px]"
            style={{ width: `${winPercentage}%` }}
          >
            <span className="text-xs font-medium text-white px-1">${roundedWin}</span>
          </div>
        )}
        
        {/* Loss Bar */}
        {roundedLoss > 0 && (
          <div 
            className="bg-gray-900 rounded flex items-center justify-center min-w-[40px]"
            style={{ width: `${lossPercentage}%` }}
          >
            <span className="text-xs font-medium text-white px-1">${roundedLoss}</span>
          </div>
        )}
        
        {/* Handle edge case where both are zero */}
        {roundedWin === 0 && roundedLoss === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-xs text-gray-500">No data</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvgWLCard;

