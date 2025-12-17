import React from 'react';

interface ResultCardProps {
  label: string;
  value: number;
  isCurrency?: boolean;
  highlight?: boolean;
  subValue?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ 
  label, 
  value, 
  isCurrency = true, 
  highlight = false,
  subValue
}) => {
  const formattedValue = isCurrency 
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
    : `${value.toFixed(2)}%`;

  return (
    <div className={`p-6 rounded-2xl border ${highlight ? 'bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-200' : 'bg-white border-slate-200 text-slate-800'}`}>
      <p className={`text-sm font-medium mb-1 ${highlight ? 'text-brand-100' : 'text-slate-500'}`}>
        {label}
      </p>
      <h3 className="text-3xl font-bold tracking-tight">
        {formattedValue}
      </h3>
      {subValue && (
        <p className={`text-xs mt-2 ${highlight ? 'text-brand-200' : 'text-slate-400'}`}>
          {subValue}
        </p>
      )}
    </div>
  );
};