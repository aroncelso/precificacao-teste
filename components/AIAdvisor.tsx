import React, { useState } from 'react';
import { analyzePricingStrategy } from '../services/geminiService';
import { PricingInputs, PricingResults } from '../types';

interface AIAdvisorProps {
  inputs: PricingInputs;
  results: PricingResults;
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ inputs, results }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<{ text: string; suggestions: string[] } | null>(null);

  const handleAnalyze = async () => {
    if (!results.isValid) return;
    setLoading(true);
    try {
      const result = await analyzePricingStrategy(inputs, results);
      setAnalysis(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl border border-indigo-100 p-6 shadow-sm mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5c0-2 2-3 4-4Z"></path><path d="M12 2v10l-4 4"></path><path d="m12 12 5 2"></path></svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800">Consultor IA Gemini</h3>
        </div>
        {!analysis && (
          <button
            onClick={handleAnalyze}
            disabled={loading || !results.isValid}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analisando...
              </>
            ) : (
              'Analisar Preço'
            )}
          </button>
        )}
      </div>

      {analysis && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <p className="text-slate-700 leading-relaxed mb-4 text-sm bg-white/50 p-3 rounded-lg border border-indigo-50">
            {analysis.text}
          </p>
          
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Sugestões Estratégicas</h4>
            <ul className="grid gap-2">
              {analysis.suggestions.map((suggestion, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 bg-white p-2 rounded border border-indigo-50">
                  <span className="text-indigo-500 font-bold mt-0.5">•</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button 
                onClick={() => setAnalysis(null)}
                className="text-xs text-indigo-500 hover:text-indigo-700 font-medium"
            >
                Nova Análise
            </button>
          </div>
        </div>
      )}

      {!analysis && !loading && (
        <p className="text-sm text-slate-500">
          Utilize a IA para verificar se sua margem é saudável e receber dicas de competitividade.
        </p>
      )}
    </div>
  );
};