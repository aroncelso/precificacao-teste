import { GoogleGenAI, Type } from "@google/genai";
import { PricingInputs, PricingResults } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize client securely (assuming key is present in env)
const ai = new GoogleGenAI({ apiKey });

export const analyzePricingStrategy = async (
  inputs: PricingInputs,
  results: PricingResults
): Promise<{ text: string; suggestions: string[] }> => {
  if (!apiKey) {
    return {
      text: "Chave de API não configurada. Adicione sua API Key para receber análises.",
      suggestions: []
    };
  }

  const prompt = `
    Atue como um consultor financeiro e de precificação sênior para varejo.
    Analise os seguintes dados de precificação de um produto.
    
    IMPORTANTE: O cálculo utilizado é Markup sobre Custo. Ou seja, o lucro líquido calculado é exatamente a porcentagem definida sobre o custo total (Produto + Fixo).
    As despesas (Impostos, Mkt, Taxas) são calculadas sobre o Preço de Venda Final.

    DADOS DE ENTRADA:
    - Preço de Custo: R$ ${inputs.costPrice.toFixed(2)}
    - Custo Fixo Adicional (R$): R$ ${inputs.fixedCost.toFixed(2)}
    - Margem de Lucro Desejada (sobre o Custo): ${inputs.desiredMargin}%
    - Impostos (sobre Venda): ${inputs.taxRate}%
    - Marketing/Comissões (sobre Venda): ${inputs.marketingCost}%
    - Outras Taxas (sobre Venda): ${inputs.otherExpenses}%

    RESULTADOS CALCULADOS:
    - Preço de Venda Sugerido: R$ ${results.sellingPrice.toFixed(2)}
    - Lucro Líquido Real (Valor): R$ ${results.grossProfit.toFixed(2)}

    TAREFA:
    1. Forneça uma análise breve (máximo 2 parágrafos) sobre a viabilidade desse preço. O preço parece competitivo ou o markup está gerando um preço final muito alto?
    2. Liste 3 sugestões táticas curtas para otimizar a estratégia (ex: reduzir custos, ajustar markup, negociar taxas).

    Responda em JSON seguindo este schema.
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
      return JSON.parse(response.text);
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