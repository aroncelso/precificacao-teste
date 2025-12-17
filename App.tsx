import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { InputCard } from './components/InputCard';
import { ResultCard } from './components/ResultCard';
import { AIAdvisor } from './components/AIAdvisor';
import { PricingInputs, PricingResults } from './types';

// Initial State
const initialInputs: PricingInputs = {
  costPrice: 100,
  desiredMargin: 50, // Updated default to be more realistic for markup
  taxRate: 18,
  marketingCost: 5,
  fixedCost: 0,
  otherExpenses: 4.5, // e.g. card machine fees
};

const COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6', '#64748b'];

function App() {
  const [inputs, setInputs] = useState<PricingInputs>(initialInputs);

  const handleInputChange = (field: keyof PricingInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // Calculation Logic
  const results: PricingResults = useMemo(() => {
    const { costPrice, desiredMargin, taxRate, marketingCost, fixedCost, otherExpenses } = inputs;
    
    // Formula Update: Markup on Cost
    // SellingPrice = (Cost + FixedCost) * (1 + DesiredMarkup) / (1 - TotalPercentageExpenses)
    
    const totalVariableRates = (taxRate + marketingCost + otherExpenses) / 100;
    const markupRate = desiredMargin / 100;
    
    // Divisor is only affected by variable expenses now
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

    const totalBaseCost = costPrice + fixedCost;
    const sellingPrice = (totalBaseCost * (1 + markupRate)) / divisor;
    
    // Verification values
    const taxValue = sellingPrice * (taxRate / 100);
    const marketingValue = sellingPrice * (marketingCost / 100);
    const otherValue = sellingPrice * (otherExpenses / 100);
    
    // Profit value is mathematically: totalBaseCost * markupRate
    // We calculate it deductively to ensure chart sums up perfectly
    const profitValue = sellingPrice - totalBaseCost - taxValue - marketingValue - otherValue;
    
    const breakdown = [
      { name: 'Lucro Líquido', value: profitValue, fill: '#22c55e' },
      { name: 'Custo Produto', value: costPrice, fill: '#64748b' },
      { name: 'Impostos', value: taxValue, fill: '#ef4444' },
      { name: 'Mkt/Comissões', value: marketingValue, fill: '#f59e0b' },
      { name: 'Outras Taxas', value: otherValue + fixedCost, fill: '#3b82f6' },
    ].filter(item => item.value > 0);

    return {
      sellingPrice,
      grossProfit: profitValue,
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
          <p className="text-slate-500 mt-1">Calculadora de Preço de Venda Baseada em Custos</p>
        </div>
        <div className="text-right hidden md:block">
           <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-600/20">
            Fórmula: Markup sobre Custo
          </span>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              Custos Base
            </h2>
            <div className="grid gap-4">
              <InputCard
                label="Preço de Custo"
                value={inputs.costPrice}
                onChange={(v) => handleInputChange('costPrice', v)}
                prefix="R$"
                tooltip="Quanto você paga ao fornecedor pelo produto."
              />
              <InputCard
                label="Custo Fixo (Unitário)"
                value={inputs.fixedCost}
                onChange={(v) => handleInputChange('fixedCost', v)}
                prefix="R$"
                tooltip="Valor fixo em dinheiro a ser agregado ao custo (ex: frete unitário, embalagem)."
              />
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
              Variáveis e Lucro (%)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputCard
                label="Margem de Lucro"
                value={inputs.desiredMargin}
                onChange={(v) => handleInputChange('desiredMargin', v)}
                suffix="%"
                tooltip="Porcentagem de lucro aplicada sobre o CUSTO do produto (Markup)."
              />
              <InputCard
                label="Impostos"
                value={inputs.taxRate}
                onChange={(v) => handleInputChange('taxRate', v)}
                suffix="%"
                tooltip="Impostos sobre a venda total (ex: Simples, ICMS)."
              />
              <InputCard
                label="Marketing/Comissão"
                value={inputs.marketingCost}
                onChange={(v) => handleInputChange('marketingCost', v)}
                suffix="%"
                tooltip="Comissão de marketplace, vendedor ou ads (sobre a venda)."
              />
              <InputCard
                label="Taxas Cartão/Outros"
                value={inputs.otherExpenses}
                onChange={(v) => handleInputChange('otherExpenses', v)}
                suffix="%"
                tooltip="Taxas da maquininha ou outras porcentagens (sobre a venda)."
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
                <p>As despesas variáveis (Impostos + Marketing + Taxas) ultrapassam 100% do preço de venda.</p>
                <div className="mt-4 font-mono bg-white inline-block px-4 py-2 rounded border border-red-100">
                  Total Despesas: {(inputs.taxRate + inputs.marketingCost + inputs.otherExpenses).toFixed(2)}%
                </div>
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ResultCard 
                label="Preço de Venda Sugerido"
                value={results.sellingPrice}
                highlight={true}
                subValue="Garante margem livre de despesas"
              />
              <ResultCard 
                label="Lucro Líquido (R$)"
                value={results.grossProfit}
                isCurrency={true}
                subValue={`Representa ${inputs.desiredMargin}% sobre o custo`}
              />
            </div>
          )}

          {/* Chart Section */}
          {results.isValid && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-[400px] flex flex-col">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">Composição do Preço Final</h3>
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

          {/* AI Section */}
          <AIAdvisor inputs={inputs} results={results} />

        </div>
      </main>
    </div>
  );
}

export default App;