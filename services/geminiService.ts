import { GoogleGenAI, Type } from "@google/genai";
import { PricingInputs, PricingResults } from "../types";

// Initialize client securely (assuming key is present in env)
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzePricingStrategy = async (
  inputs: PricingInputs,
  results: PricingResults
): Promise<{ text: string; suggestions: string[] }> => {
  if (!process.env.API_KEY) {
    return {
      text: "Chave de API não configurada. Adicione sua API Key para receber análises.",
      suggestions: []
    };
  }

  const prompt = `
    Atue como um consultor financeiro e de precificação sênior.
    Analise os dados de precificação abaixo.

    ESTRUTURA DE CÁLCULO UTILIZADA:
    1. Base: O markup de lucro incide EXCLUSIVAMENTE sobre o "Preço de Custo do Produto".
    2. Despesas Fixas: O "Custo Fixo" é tratado como uma despesa monetária que deve ser coberta pelo preço, mas não gera lucro sobre ela.
    3. Despesas Variáveis: Calculadas sobre o preço final de venda.

    DADOS DE ENTRADA:
    - Preço de Custo (Produto): R$ ${inputs.costPrice.toFixed(2)}
    - Margem de Lucro (sobre Custo do Produto): ${inputs.desiredMargin}%
    - Custo Fixo (Despesa Operacional): R$ ${inputs.fixedCost.toFixed(2)}
    
    DESPESAS VARIÁVEIS (Sobre Venda):
    - Impostos: ${inputs.taxRate}%
    - Marketing: ${inputs.marketingCost}%
    - Taxas/Outros: ${inputs.otherExpenses}%

    RESULTADOS:
    - Preço de Venda Final: R$ ${results.sellingPrice.toFixed(2)}
    - Lucro Líquido Real: R$ ${results.grossProfit.toFixed(2)}

    TAREFA:
    1. Analise se o preço final está competitivo dado o custo do produto. O peso das despesas fixas ou impostos está inflando demais o preço?
    2. Liste 3 sugestões táticas para melhorar o resultado (ex: reduzir custo fixo, negociar taxas, alterar markup).

    Responda em JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: {
              type: Type.STRING,
              description: "Análise breve da viabilidade do preço."
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Lista de 3 sugestões práticas."
            }
          },
          required: ["analysis", "suggestions"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        text: data.analysis,
        suggestions: data.suggestions
      };
    }
    throw new Error("Resposta vazia da IA");

  } catch (error) {
    console.error("Erro ao analisar precificação:", error);
    return {
      text: "Não foi possível gerar a análise no momento. Tente novamente.",
      suggestions: ["Verifique sua conexão", "Tente simplificar os dados", "Aguarde alguns instantes"]
    };
  }
};