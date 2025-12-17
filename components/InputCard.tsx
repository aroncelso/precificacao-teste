import React from 'react';

interface InputCardProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  prefix?: string;
  suffix?: string;
  icon?: React.ReactNode;
  step?: string;
  tooltip?: string;
}

export const InputCard: React.FC<InputCardProps> = ({
  label,
  value,
  onChange,
  prefix,
  suffix,
  icon,
  step = "0.01",
  tooltip
}) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
          {icon && <span className="text-slate-400">{icon}</span>}
          {label}
        </label>
        {tooltip && (
          <div className="group relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 cursor-help"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            <div className="absolute right-0 bottom-full mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
            {prefix}
          </span>
        )}
        <input
          type="number"
          min="0"
          step={step}
          value={value === 0 ? '' : value}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            onChange(isNaN(val) ? 0 : val);
          }}
          className={`w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all
            ${prefix ? 'pl-10' : 'pl-3'} 
            ${suffix ? 'pr-10' : 'pr-3'}
          `}
          placeholder="0.00"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};