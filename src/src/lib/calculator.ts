
import { CalculatorInput, TaxBreakdown } from "./types";
import { TAX_RATES_2024 } from "@/config/tax-rates";

/**
 * Calculates the Recibos Verdes Taxes (Regime Simplificado)
 */
export function calculateRecibosVerdes(input: CalculatorInput): TaxBreakdown {
    const { dailyRate, workDaysPerMonth, monthsPerYear } = input;

    const grossAnnual = dailyRate * workDaysPerMonth * monthsPerYear;

    // 1. Taxable Income (Rendimento Tributável)
    // Assuming 'Prestação de Serviços' (Coeficient 0.75)
    const taxableIncome = grossAnnual * TAX_RATES_2024.RV_COEFFICIENT_SERVICES;

    // 2. Segurança Social
    // Applied to 70% of the taxable income (Coef 0.7) for purely services, 
    // BUT the SS calculation base is actually 70% of the Gross Income (or Profit), 
    // however for regime simplificado it is usually:
    // Base de incidência = 70% do Rendimento Relevante (que por sua vez é 70% da faturação serviços)
    // Wait, let's verify. 
    // Current rule: Base de incidência mensal = 70% do rendimento relevante.
    // Rendimento Relevante media trimestral... simplified for annual estimation:
    // Annual SS Base = Gross * 0.7
    // Annual SS = SS Base * 21.4%
    // Let's stick to the config constant if possible or standard rule.

    // CORRECTION based on standard simplify: 
    // Contribuição = (Rendimento Trimestral * 70%) * 21.4%
    // So yes, essentially 70% of Servicos is the base.
    const ssBase = grossAnnual * 0.7; // 70% rule for SS base
    const ss = ssBase * TAX_RATES_2024.SS_RATE;

    // 3. IRS (Simulated Progressive Tax)
    // This is complex because it depends on household status.
    // We will assume 'Single, No Dependents' for the baseline simulation.
    // We need a simple bracket calculator or a simplified retention rate.
    // A generic Retention Rate is often used for simple estimation:
    const irsRetention = grossAnnual * TAX_RATES_2024.RETENTION_RATE;

    // NOTE: True IRS is typically lower than retention for many, or higher for high earners.
    // For a "Simulator", using the Retention Rate is a safe "Upfront Cost".
    // To be more precise we would need the annual progressive tables.
    // Let's use Retention for now as "Paid Tax", and maybe refine later.
    // Actually, for "Net Available", users care about what hits the bank.
    // Retention hits the bank (negative). Refund comes next year.
    // Let's show Net after Retention.

    const netAnnual = grossAnnual - ss - irsRetention;

    return {
        grossAnnual,
        ss,
        irs: irsRetention,
        netAnnual,
        netMonthly: netAnnual / 12, // Spread over 12 months for liquidity view
        effectiveTaxRate: (ss + irsRetention) / grossAnnual
    };
}

/**
 * Calculates the Unipessoal Taxes (Simulated Optimization)
 */
export function calculateUnipessoal(input: CalculatorInput): TaxBreakdown {
    const { dailyRate, workDaysPerMonth, monthsPerYear, businessExpenses } = input;
    const grossAnnual = dailyRate * workDaysPerMonth * monthsPerYear;

    // 1. Costs
    // Salary (IAS) - Standard strategy to minimize TSU
    const annualSalaryCost = TAX_RATES_2024.IAS * 14; // 14 months
    const tsuCompany = annualSalaryCost * TAX_RATES_2024.TSU_COMPANY;
    const tsuWorker = annualSalaryCost * TAX_RATES_2024.TSU_WORKER; // Paid by worker, but deducted from salary

    const accountantCost = TAX_RATES_2024.ACCOUNTANT_MONTHLY * 12;
    const otherExpenses = businessExpenses + TAX_RATES_2024.INSURANCE_WORK_ACCIDENTS;

    const totalCompanyCosts = annualSalaryCost + tsuCompany + accountantCost + otherExpenses;

    // 2. Profit (Lucro Tributável)
    const profit = Math.max(0, grossAnnual - totalCompanyCosts);

    // 3. IRC (Corporate Tax)
    // First 50k at 17%, rest at 21%
    let ircc = 0;
    if (profit <= TAX_RATES_2024.IRC_THRESHOLD) {
        ircc = profit * TAX_RATES_2024.IRC_SMALL_COMPANY;
    } else {
        const firstBracket = TAX_RATES_2024.IRC_THRESHOLD * TAX_RATES_2024.IRC_SMALL_COMPANY;
        const secondBracket = (profit - TAX_RATES_2024.IRC_THRESHOLD) * TAX_RATES_2024.IRC_NORMAL;
        ircc = firstBracket + secondBracket;
    }

    // Derrama (Municipal Tax estimate)
    const derrama = profit * TAX_RATES_2024.DERRAMA_ESTIMATED;

    const totalIRC = ircc + derrama;

    // 4. Net Dividend
    const netProfit = profit - totalIRC;
    const dividendTax = netProfit * TAX_RATES_2024.DIVIDEND_TAX;
    const netDividend = netProfit - dividendTax;

    // 5. Total Net for the Person
    // Net Salary (Salary - TSU Worker - IRS on Salary)
    // Simplified IRS on Minimum Wage (IAS) is usually 0 or very low. 
    // Let's assume 0 for IAS-based salary for simplicity or minimal retention.
    const netSalary = annualSalaryCost - tsuWorker; // Ignoring IRS on min wage for now

    const totalNetAnnual = netSalary + netDividend;

    return {
        grossAnnual,
        ss: tsuCompany + tsuWorker, // Total SS paid
        irs: totalIRC + dividendTax, // Total Tax paid (IRC + Dividend Tax)
        netAnnual: totalNetAnnual,
        netMonthly: totalNetAnnual / 12,
        effectiveTaxRate: 1 - (totalNetAnnual / grossAnnual)
    };
}
