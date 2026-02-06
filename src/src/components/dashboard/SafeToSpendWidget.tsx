'use client';

import { Lock, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { SavedSimulation } from "@/services/simulation/types";
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateRecibosVerdes, calculateUnipessoal, calculateDependentWork } from "@/lib/calculator";
import { CalculatorInput } from "@/lib/types";

interface SafeToSpendWidgetProps {
    data: SavedSimulation[];
}

export function SafeToSpendWidget({ data }: SafeToSpendWidgetProps) {
    const t = useTranslations('Dashboard');

    if (!data || data.length === 0) {
        return (
            <Card className="border-slate-200 shadow-sm bg-white h-full flex flex-col items-center justify-center p-6 text-center">
                <p className="text-slate-400 text-sm">{t('noDataSafeToSpend')}</p>
            </Card>
        );
    }

    const current = data[data.length - 1];

    // Re-calculate based on saved inputs to get accurate breakdown
    // Assuming 'freelancer' as default for safety, or compare both?
    // Let's use the simulation's input to re-run calculation.

    // We need to map SavedSimulation to CalculatorInput roughly.
    // SavedSimulation has: daily_rate, days_per_month, expenses, etc.

    const input: CalculatorInput = {
        dailyRate: current.daily_rate,
        workDaysPerMonth: current.days_per_month,
        monthsPerYear: current.months_per_year,
        businessExpenses: current.expenses,
        // defaults matching calculator
        isNHR: false,
        municipalityBenefit: 0,
        includeMealAllowance: false,
        ownerSalary: 1000, // Reasonable default for display if missing
        ...((current as any).regime === 'company' ? { ownerSalary: 820 } : {}) // Fallback for company
    };

    let result;
    let includesVAT = true;

    if (current.regime === 'company') {
        result = calculateUnipessoal(input);
    } else if (current.regime === 'employee') {
        // Map saved fields to input
        input.employeeGrossSalary = current.employee_gross_salary;
        input.employeeMealAllowance = current.employee_meal_allowance;
        result = calculateDependentWork(input);
        includesVAT = false; // Employees don't charge VAT
    } else {
        result = calculateRecibosVerdes(input);
    }

    const grossAnnualWithVAT = includesVAT ? (result.grossAnnual * 1.23) : result.grossAnnual;

    // Monthly View
    const monthlyTotalCashflow = grossAnnualWithVAT / 12;
    const monthlyNet = result.netAnnual / 12;

    const safeToSpend = monthlyNet;
    const reservedState = monthlyTotalCashflow - monthlyNet;

    return (
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-emerald-500"></div>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-slate-500" />
                    {t('safeToSpendTitle')}
                </CardTitle>
                <p className="text-sm text-slate-500">{t('safeToSpendDesc')}</p>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Red Section: Reserved */}
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-red-50 border border-red-100">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                            <AlertCircle className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-red-600 mb-1">{t('reservedForState')}</p>
                            <div className="text-2xl font-bold text-slate-900">
                                {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(reservedState)}
                            </div>
                            <p className="text-xs text-red-400 mt-1">{t('taxesBreakdown')}</p>
                        </div>
                    </div>

                    {/* Green Section: Safe */}
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-emerald-600 mb-1">{t('safeToSpend')}</p>
                            <div className="text-3xl font-bold text-slate-900">
                                {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(safeToSpend)}
                            </div>
                            <p className="text-xs text-emerald-500 mt-1">{t('peaceOfMind')}</p>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="flex justify-between items-center text-xs text-slate-400 mt-2 px-1">
                        <span>{t('basedOnSimulation', { date: new Date(current.created_at).toLocaleDateString() })}</span>
                        <span title={t('vatDisclaimer')} className="cursor-help border-b border-dotted border-slate-300">
                            {includesVAT ? t('vatIncludedLabel') : t('noVatLabel')}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
