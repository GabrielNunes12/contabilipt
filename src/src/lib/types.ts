
export type Regime = 'recibos-verdes' | 'unipessoal';

export interface CalculatorInput {
    dailyRate: number;
    workDaysPerMonth: number;
    monthsPerYear: number;
    businessExpenses: number; // Annual expenses (software, hardware, travel)
    isNHR?: boolean; // Non-Habitual Resident status
    municipalityBenefit?: number; // Percentage (0-5)

    // Optimization Inputs
    includeMealAllowance?: boolean; // If true, adds max tax-free meal allowance to net income (Company side)
    customAccountantCost?: number; // Override default 150

    // Scenario Comparison (Employee)
    employeeGrossSalary?: number; // Monthly Gross
    employeeMealAllowance?: number; // Daily Value
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
