import { IRS_BRACKETS_2025, IRS_VARS_2025, TAX_RATES_2024 } from "@/config/tax-rates";

export interface IRSInput {
    annualGrossIncome: number;
    incomeType: 'A' | 'B'; // A = Employee, B = Independent (Simplified)
    status: 'single' | 'married';
    dependents: number; // For simplicity, we'll assume > 3 years old for now in MVP
    expenses: number; // General deductions (Saude, Educacao, etc)
    withholdingTax: number; // Retencao na fonte ja paia
}

export interface IRSResult {
    taxableIncome: number;
    totalTax: number;
    netTax: number; // Coleta Liquida
    effectiveRate: number;
    amountToPay: number; // If positive, pay. If negative, receive.
}

export function calculateIRS(data: IRSInput): IRSResult {
    let specificDeduction = 0;
    let taxableIncome = 0;

    // 1. Determine Taxable Income (Rendimento Coletável)
    if (data.incomeType === 'A') {
        specificDeduction = Math.min(data.annualGrossIncome, IRS_VARS_2025.SPECIFIC_DEDUCTION_CATEGORY_A_UPDATED);
        taxableIncome = Math.max(0, data.annualGrossIncome - specificDeduction);
    } else {
        // Category B - Simplified
        // Services: 0.75 coefficient. The 0.25 is legally assumed expenses.
        // There is no specific deduction subtraction like in Cat A, because the 0.25 covers it.
        const coefficient = TAX_RATES_2024.RV_COEFFICIENT_SERVICES;
        taxableIncome = data.annualGrossIncome * coefficient;
    }

    // 2. Marital Splitting
    const splittingFactor = data.status === 'married' ? 2 : 1;
    const taxableIncomePerPerson = taxableIncome / splittingFactor;

    // 3. Find Bracket & Calculate Gross Tax (Coleta Total)
    let taxPerPerson = 0;

    // Simple bracket lookup
    for (const bracket of IRS_BRACKETS_2025) {
        if (taxableIncomePerPerson <= bracket.limit) {
            taxPerPerson = (taxableIncomePerPerson * bracket.rate) - bracket.deduct;
            break;
        }
    }
    // Handle top bracket if loop finishes without break (though Infinity covers it)
    if (taxableIncomePerPerson > 83696) {
        taxPerPerson = (taxableIncomePerPerson * 0.48) - 10600.07;
    }

    // Ensure non-negative from math artifacts (shouldn't happen with correct 'deduct')
    taxPerPerson = Math.max(0, taxPerPerson);

    // Multiply back by split factor
    const totalGrossTax = taxPerPerson * splittingFactor;

    // 4. Subtract Deductions (Deduções à Coleta)
    // Fixed deductions per dependent + User submitted expenses
    const dependentDeduction = data.dependents * 600; // Simplified avg, 2025 values vary by age
    const totalDeductions = dependentDeduction + data.expenses;

    const netTax = Math.max(0, totalGrossTax - totalDeductions);

    // 5. Compare with Withholding
    const amountToPay = netTax - data.withholdingTax;

    return {
        taxableIncome,
        totalTax: totalGrossTax,
        netTax,
        effectiveRate: data.annualGrossIncome > 0 ? (netTax / data.annualGrossIncome) : 0,
        amountToPay: amountToPay // Positive = You pay more. Negative = Refund.
    };
}
