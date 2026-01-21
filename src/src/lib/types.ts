
export type Regime = 'recibos-verdes' | 'unipessoal';

export interface CalculatorInput {
    dailyRate: number;
    workDaysPerMonth: number;
    monthsPerYear: number;
    businessExpenses: number; // Annual expenses (software, hardware, travel)
}

export interface TaxBreakdown {
    grossAnnual: number;
    ss: number;         // Segurança Social total
    irs: number;        // IRS / IRC total paid
    netAnnual: number;
    netMonthly: number; // Spread over 12 months usually
    effectiveTaxRate: number;
}

export interface ComparisonResult {
    recibosVerdes: TaxBreakdown;
    unipessoal: TaxBreakdown;
    difference: number; // Net Unipessoal - Net RV
    winner: Regime;
}
