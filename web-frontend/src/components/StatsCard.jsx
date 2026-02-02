import React from 'react';

const StatsCard = ({ title, value, unit, icon, isDarkMode }) => {
  return (
    <div className={`
      p-6 rounded-2xl border shadow-sm transition-all hover:shadow-md
      ${isDarkMode 
        ? 'bg-slate-800 border-slate-700 hover:shadow-blue-900/20' 
        : 'bg-white border-slate-200 hover:shadow-slate-200'
      }
    `}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          {value}
        </span>
        {unit && <span className="text-slate-400 text-sm font-medium">{unit}</span>}
      </div>
    </div>
  );
};

export default StatsCard;