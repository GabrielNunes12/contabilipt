
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
};

export const BUSINESS_DEFAULTS = {
    WORK_DAYS_MONTH: 21,
    MONTHS_YEAR: 11,
};
