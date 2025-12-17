import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { InputCard } from './components/InputCard';
import { ResultCard } from './components/ResultCard';
import { PricingInputs, PricingResults } from './types';

// Initial State
const initialInputs: PricingInputs = {
  costPrice: 100,
  desiredMargin: 100, // Example: 100% markup on product cost
  taxRate: 18,
  marketingCost: 5,
  fixedCost: 10,
  otherExpenses: 4.5,
};

function App() {
  const [inputs, setInputs] = useState<PricingInputs>(initialInputs);

  const handleInputChange = (field: keyof PricingInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // Calculation Logic
  const results: PricingResults = useMemo(() => {
    const { costPrice, desiredMargin, taxRate, marketingCost, fixedCost, otherExpenses } = inputs;
    
    // Formula Update based on user request:
    // 1. Profit is calculated ONLY on the Product Cost (Markup).
    // 2. Fixed Cost is an expense (additive), not part of the markup base.
    // 3. Variable expenses are percentage of final price.
    
    // Math:
    // Profit = CostPrice * MarkupRate
    // RevenueNeeded = CostPrice + Profit + FixedCost
    // SellingPrice = RevenueNeeded / (1 - VariableExpensesRate)
    
    const totalVariableRates = (taxRate + marketingCost + otherExpenses) / 100;
    const markupRate = desiredMargin / 100;
    
    const divisor = 1 - totalVariableRates;
    
    if (divisor <= 0) {
      return {
        sellingPrice: 0,
        grossProfit: 0,
        totalPercentageCosts: (totalVariableRates * 100),
        totalFixedCosts: fixedCost,
        isValid: false,
        breakdown: []
      };
    }

    const targetProfit = costPrice * markupRate;
    const numerator = costPrice + targetProfit + fixedCost;
    
    const sellingPrice = numerator / divisor;
    
    // Breakdown values
    const taxValue = sellingPrice * (taxRate / 100);
    const marketingValue = sellingPrice * (marketingCost / 100);
    const otherValue = sellingPrice * (otherExpenses / 100);
    
    // Recalculate profit slightly from remaining to ensure exact chart sum (floating point safety)
    // Theoretically equal to targetProfit
    const actualProfit = sellingPrice - costPrice - fixedCost - taxValue - marketingValue - otherValue;
    
    const breakdown = [
      { name: 'Lucro (Markup)', value: actualProfit, fill: '#22c55e' },
      { name: 'Custo Produto', value: costPrice, fill: '#64748b' },
      { name: 'Despesa Fixa', value: fixedCost, fill: '#8b5cf6' }, // Purple for fixed cost
      { name: 'Impostos', value: taxValue, fill: '#ef4444' },
      { name: 'Mkt/Comissões', value: marketingValue, fill: '#f59e0b' },
      { name: 'Outras Taxas', value: otherValue, fill: '#3b82f6' },
    ].filter(item => item.value > 0);

    return {
      sellingPrice,
      grossProfit: actualProfit,
      totalPercentageCosts: totalVariableRates * 100,
      totalFixedCosts: fixedCost,
      isValid: true,
      breakdown
    };
  }, [inputs]);

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Precifica.AI</h1>
          <p className="text-slate-500 mt-1">Calculadora de Preço de Venda</p>
        </div>
        <div className="text-right hidden md:block">
           <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-600/20">
            Margem sobre Custo do Produto
          </span>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path></svg>
              Produto (Base)
            </h2>
            <div className="grid gap-4">
              <InputCard
                label="Preço de Custo"
                value={inputs.costPrice}
                onChange={(v) => handleInputChange('costPrice', v)}
                prefix="R$"
                tooltip="Quanto você paga ao fornecedor pelo produto. O lucro será calculado sobre este valor."
              />
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
              Despesas e Margem
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <InputCard
                  label="Margem de Lucro"
                  value={inputs.desiredMargin}
                  onChange={(v) => handleInputChange('desiredMargin', v)}
                  suffix="%"
                  tooltip="Porcentagem de lucro aplicada EXCLUSIVAMENTE sobre o Preço de Custo."
                />
              </div>
              <div className="sm:col-span-2">
                 <InputCard
                  label="Custo Fixo (Despesa)"
                  value={inputs.fixedCost}
                  onChange={(v) => handleInputChange('fixedCost', v)}
                  prefix="R$"
                  tooltip="Valor monetário a ser coberto pelo preço (ex: Frete, Embalagem, Custo Operacional unitário)."
                />
              </div>
             
              <InputCard
                label="Impostos"
                value={inputs.taxRate}
                onChange={(v) => handleInputChange('taxRate', v)}
                suffix="%"
                tooltip="Impostos sobre a venda total."
              />
              <InputCard
                label="Marketing/Ads"
                value={inputs.marketingCost}
                onChange={(v) => handleInputChange('marketingCost', v)}
                suffix="%"
                tooltip="Custos variáveis de venda."
              />
              <InputCard
                label="Taxas Cartão"
                value={inputs.otherExpenses}
                onChange={(v) => handleInputChange('otherExpenses', v)}
                suffix="%"
                tooltip="Taxas financeiras sobre a venda."
              />
            </div>
          </section>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Numbers */}
          {!results.isValid ? (
             <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center text-red-800">
                <h3 className="text-xl font-bold mb-2">Impossível Calcular</h3>
                <p>As despesas variáveis (%) ultrapassam 100% do preço de venda.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ResultCard 
                label="Preço de Venda Sugerido"
                value={results.sellingPrice}
                highlight={true}
                subValue="Cobre Custo + Despesas + Lucro"
              />
              <ResultCard 
                label="Lucro Líquido (R$)"
                value={results.grossProfit}
                isCurrency={true}
                subValue={`${inputs.desiredMargin}% sobre o Custo do Produto`}
              />
            </div>
          )}

          {/* Chart Section */}
          {results.isValid && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-[400px] flex flex-col">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">Destino do Faturamento</h3>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={results.breakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {results.breakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;