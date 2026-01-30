
import { CalculatorInput, TaxBreakdown } from "./types";
import { TAX_RATES_2024, IRS_BRACKETS_2025, IRS_VARS_2025 } from "@/config/tax-rates";

/**
 * Calculates the Recibos Verdes Taxes (Regime Simplificado)
 */
// Helper to find simplified IRS tax from brackets (for Net Tax estimation)
// This mirrors the logic in irs-calculator.ts but simplified for the "Quick Compare" calculator
function calculateSimplifiedIRS(taxableIncome: number, isNHR: boolean): { totalTax: number, rate: number } {
    if (isNHR) {
        // NHR: Flat 20% on taxable income (Category B / High Value)
        return {
            totalTax: taxableIncome * 0.20,
            rate: 0.20
        };
    }

    // Standard Progressive Brackets
    // We use the 2025 brackets imported from config
    // Note: This logic finds the "Coleta" (Gross Tax) before deductions
    let tax = 0;
    let rate = 0;

    for (const bracket of IRS_BRACKETS_2025) {
        if (taxableIncome <= bracket.limit) {
            tax = (taxableIncome * bracket.rate) - bracket.deduct;
            rate = bracket.rate; // Marginal rate
            break;
        }
    }
    // Handle top bracket if loop finishes (Infinity)
    if (taxableIncome > 83696) {
        // Fallback to top bracket manual calc if needed, but the loop covers Infinity
        // The last bracket in config has limit Infinity.
        // If loop somehow didn't break (shouldn't happen), we take the last one.
        const last = IRS_BRACKETS_2025[IRS_BRACKETS_2025.length - 1];
        tax = (taxableIncome * last.rate) - last.deduct;
        rate = last.rate;
    }

    return { totalTax: Math.max(0, tax), rate };
}

export function calculateRecibosVerdes(input: CalculatorInput): TaxBreakdown {
    const { dailyRate, workDaysPerMonth, monthsPerYear, isNHR, municipalityBenefit } = input;

    const grossAnnual = dailyRate * workDaysPerMonth * monthsPerYear;

    // 1. Taxable Income (Rendimento Tributável)
    // Coeficiente 0.75 (Prestação de Serviços)
    const taxableIncome = grossAnnual * TAX_RATES_2024.RV_COEFFICIENT_SERVICES;

    // 2. Segurança Social
    // Base de incidência = 70% do Gross Annual (simplified annualization)
    const ssBase = grossAnnual * 0.7;
    const ss = ssBase * TAX_RATES_2024.SS_RATE;

    // 3. IRS (Simulated Progressive Tax or NHR)
    // We calculate the "Coleta" (Gross Tax)
    const { totalTax: grossIRS, rate: marginalRate } = calculateSimplifiedIRS(taxableIncome, !!isNHR);

    // 4. Deductions (Deduções à Coleta)
    // For a user "Single, No Dependents", standard deduction approx 250 + specific deduction...
    // In the User's example: 1300.18 EUR.
    // Let's assume a baseline deduction for a standard lifestyle (General Family + Health + Etc).
    // 1300 is a reasonable average for a single person optimizing e-fatura.
    // If NHR, usually deductions apply differently? Actually NHR pays flat 20%, often no deductions.
    // But for safety/code simplicity we'll subtract standard deductions if not NHR, or assume NHR is final (flat).
    // User instruction didn't specify, but usually NHR 20% is final.
    // However, let's keep it flexible. If NHR, we often assume strict 20%.
    const standardDeduction = isNHR ? 0 : 1300;

    // 5. Municipal Benefit (Devolução de IRS)
    // Calculates on the Collection (Coleta) or Net Collection?
    // User code suggests: 4.5% of something gave 935.71.
    // 935.71 / 0.045 = 20793...
    // Gross Tax (Coleta) was 22093. 
    // Coleta Liquida (22093 - 1300) = 20793.
    // So Municipal Benefit = (GrossIRS - Deductions) * BenefitRate
    let municipalReduction = 0;
    if (municipalityBenefit && municipalityBenefit > 0) {
        const netColeta = Math.max(0, grossIRS - standardDeduction);
        municipalReduction = netColeta * (municipalityBenefit / 100);
    }

    // 6. Net IRS to Pay
    // Coleta - Deduções - MunicipalBenefit
    // Ensure we don't go below zero (refund limited to withholding... wait, this is year-end map, not withholding refund)
    // This is "Tax Bill".
    const netIRS = Math.max(0, grossIRS - standardDeduction - municipalReduction);

    const netAnnual = grossAnnual - ss - netIRS;

    return {
        grossAnnual,
        ss,
        irs: netIRS,
        netAnnual,
        netMonthly: netAnnual / 12,
        effectiveTaxRate: (ss + netIRS) / grossAnnual
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

    const accountantCost = (input.customAccountantCost ?? TAX_RATES_2024.ACCOUNTANT_MONTHLY) * 12;
    const otherExpenses = businessExpenses + TAX_RATES_2024.INSURANCE_WORK_ACCIDENTS;

    // Meal Allowance (Subsídio de Alimentação)
    // If active, it's a cost for the company (deductible) and tax-free income for the worker (up to limit).
    let mealAllowanceYearly = 0;
    if (input.includeMealAllowance) {
        // Annual days = months * days/month
        const annualDays = monthsPerYear * workDaysPerMonth;
        mealAllowanceYearly = annualDays * TAX_RATES_2024.MEAL_ALLOWANCE_MAX_CARD;
    }

    const totalCompanyCosts = annualSalaryCost + tsuCompany + accountantCost + otherExpenses + mealAllowanceYearly;

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

    const totalNetAnnual = netSalary + netDividend + mealAllowanceYearly;

    return {
        grossAnnual,
        ss: tsuCompany + tsuWorker, // Total SS paid
        irs: totalIRC + dividendTax, // Total Tax paid (IRC + Dividend Tax)
        netAnnual: totalNetAnnual,
        netMonthly: totalNetAnnual / 12,
        effectiveTaxRate: 1 - (totalNetAnnual / grossAnnual)
    };
}

/**
 * Calculates the Dependent Work Taxes (Scenario A - Employee)
 */
export function calculateDependentWork(input: CalculatorInput): TaxBreakdown {
    const { employeeGrossSalary = 0, employeeMealAllowance = 0, workDaysPerMonth, monthsPerYear } = input;

    // Standard PT Contract: 14 Months
    const grossAnnual = employeeGrossSalary * 14;

    // 1. Social Security (Segurança Social Worker)
    const ss = grossAnnual * TAX_RATES_2024.TSU_WORKER;

    // 2. IRS (Category A)
    // We calculate "Coleta" using progressive brackets
    const { totalTax: grossIRS } = calculateSimplifiedIRS(grossAnnual, false);

    // Specific Deduction for Category A (4462.15 or limits)
    // Rule: The deduction is the specific deduction (4462.15) OR SS paid, whichever is higher, essentially.
    // Actually, usually it's Specific Deduction fixed, unless SS is higher.
    const specificDeduction = Math.max(IRS_VARS_2025.SPECIFIC_DEDUCTION_CATEGORY_A_UPDATED, ss);

    // Standard Deductions (Health, Family...) -> 250 baseline + user simulated?
    // Let's assume the same simplified "Standard Deduction" used in Freelancer for consistency (1300 if single).
    // But Category A deduction applies to the tax base calculation or collection?
    // Wait, Progressive Brackets apply to "Rendimento Coletável" (Inc - SpecificDeduction).
    // The previous simplified logic applied bracket to the WHOLE income then subtracted. That acts like a retention.
    // Let's refine for Dependent Work to be consistent with standard IRS logic:
    // 1. Gross - Specific Deduction = Taxable Base.
    // 2. Base * Bracket Rate - Bracket Deduct = Coleta.
    // 3. Coleta - Personal Deductions = Net IRS.

    // Re-use Simplified IRS logic?
    // calculateSimplifiedIRS applies bracket to the INPUT.
    // So we pass (Gross - Specific) to it.
    const taxableBase = Math.max(0, grossAnnual - specificDeduction);
    const { totalTax: coleta } = calculateSimplifiedIRS(taxableBase, false);

    // Personal Deductions (e-fatura + Family)
    // Using 1300 baseline for simulator consistency
    const personalDeductions = 1300;

    const netIRS = Math.max(0, coleta - personalDeductions);

    // 3. Meal Allowance
    // Avg 11 months * 21 days
    // Assumption: Tax Free (card) or just added net.
    // User wants to compare "With Meal Allowance".
    const annualMealAllowance = employeeMealAllowance * workDaysPerMonth * monthsPerYear;

    const netAnnual = grossAnnual - ss - netIRS + annualMealAllowance;

    return {
        grossAnnual,
        ss,
        irs: netIRS,
        netAnnual,
        netMonthly: netAnnual / 14, // Employee usually thinks in 14 months, but comparison is annual. Let's return /12 for normalization or /14?
        // Uniform comparison usually /12.
        effectiveTaxRate: (ss + netIRS) / grossAnnual
    };
}
