
export const TAX_RATES_2024 = {
    // Recibos Verdes
    RV_COEFFICIENT_SERVICES: 0.75, // Coeficiente para prestação de serviços (75% é tributável)
    SS_RATE: 0.214, // Taxa normal SS TI (Mantém-se 21.4%)
    SS_TIER_MIN: -0.25, // -25% opcional
    SS_TIER_MAX: 0.25, // +25% opcional

    // Values 2025
    IAS: 522.50, // Updated for 2025 (Portaria n.º 6-B/2025/1)
    RETENTION_RATE: 0.23, // Nova taxa de retenção na fonte 2025 (desceu de 25%)

    // IRS Brackets (Simplified) - Just for simulation reference if needed
    IRS_EXEMPTION: 12180, // Mínimo de existência (870 * 14)

    // Unipessoal
    TSU_COMPANY: 0.2375, // Mantém-se 23.75%
    TSU_WORKER: 0.11,   // Mantém-se 11%

    // IRC 2025
    IRC_SMALL_COMPANY: 0.16, // Reduzida 17% -> 16% (Primeiros 50k)
    IRC_NORMAL: 0.20,       // Reduzida de 21% -> 20%
    IRC_THRESHOLD: 50000,

    DIVIDEND_TAX: 0.28,    // Mantém-se 28% (Taxa liberatória)
    DERRAMA_ESTIMATED: 0.015, // Estimativa média (varia por município)

    // Cost Assumptions
    ACCOUNTANT_MONTHLY: 150,
    INSURANCE_WORK_ACCIDENTS: 200, // Annual estimate

    // Optimizations
    MEAL_ALLOWANCE_MAX_CARD: 9.60, // Max tax-free daily value (Card)
};

export const BUSINESS_DEFAULTS = {
    WORK_DAYS_MONTH: 21,
    MONTHS_YEAR: 11,
};

// Official 2025 IRS Brackets (Continente)
// Source: OE2025 / update logic
export const IRS_BRACKETS_2025 = [
    { limit: 8059, rate: 0.125, deduct: 0 },
    { limit: 12160, rate: 0.160, deduct: 282.07 }, // (8059 * 0.16) - (8059 * 0.125) = 1289.44 - 1007.38 = 282.06
    { limit: 17233, rate: 0.220, deduct: 1011.67 },
    { limit: 22306, rate: 0.250, deduct: 1528.66 },
    { limit: 28400, rate: 0.320, deduct: 3089.42 }, // Check: 22306*0.32 - Tax(22306)
    { limit: 41629, rate: 0.355, deduct: 4083.42 },
    { limit: 44987, rate: 0.435, deduct: 7414.38 },
    { limit: 83696, rate: 0.450, deduct: 8089.19 },
    { limit: Infinity, rate: 0.480, deduct: 10600.07 },
];

export const IRS_VARS_2025 = {
    SPECIFIC_DEDUCTION_CATEGORY_A: 4104, // Stays as baseline or updated to 8.54*IAS. 8.54 * 522.50 = 4462.15. Using new value.
    SPECIFIC_DEDUCTION_CATEGORY_A_UPDATED: 4462.15,
    MINIMUM_EXISTENCE: 12180, // Updated 2025 estimate
    DEPENDENT_DEDUCTION_3_PLUS: 900, // Estimate for > 3yo
    DEPENDENT_DEDUCTION_UP_TO_3: 726, // Estimate for <= 3yo
};

export const FISCAL_LIMITS_2025 = {
    VAT_EXEMPTION: 15000, // Limite de isenção de IVA (Artigo 53.º)
    SIMPLIFIED_REGIME: 200000, // Limite máximo para enquadramento no Regime Simplificado
};
