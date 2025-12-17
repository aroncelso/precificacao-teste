export interface PricingInputs {
  costPrice: number;
  desiredMargin: number; // percentage
  taxRate: number; // percentage
  marketingCost: number; // percentage
  fixedCost: number; // currency value (flat)
  otherExpenses: number; // percentage (e.g., card fees)
}

export interface PricingResults {
  sellingPrice: number;
  grossProfit: number;
  totalPercentageCosts: number; // tax + marketing + other
  totalFixedCosts: number;
  isValid: boolean;
  breakdown: {
    name: string;
    value: number;
    fill: string;
  }[];
}