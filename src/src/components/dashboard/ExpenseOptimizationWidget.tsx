'use client';

import { Calculator, ArrowRight } from "lucide-react";
import { SavedSimulation } from "@/services/simulation/types";
import Link from "next/link";

interface ExpenseOptimizationWidgetProps {
    data: SavedSimulation[];
}

export function ExpenseOptimizationWidget({ data }: ExpenseOptimizationWidgetProps) {
    if (!data || data.length === 0) return null;

    const current = data[data.length - 1];
    const annualIncome = current.daily_rate * current.days_per_month * current.months_per_year;
    // Assuming 'expenses' in simulation is Annual Business Expenses
    const annualExpenses = current.expenses;

    const expenseRatio = (annualExpenses / annualIncome) * 100;

    // In Portugal Simplified Regime, 25% (or 15% depending on activity) is automatically assumed as expenses.
    // If actual expenses > 25%, Organized Accounting might be better to deduct real expenses.
    // We use 25% as the general heuristic trigger.
    const isOrganizedBetter = expenseRatio > 25;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-50 rounded-lg">
                    <Calculator className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-bold text-slate-900">Otimização Fiscal</h3>
            </div>

            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-500">Rácio de Despesas</span>
                        <span className="font-medium text-slate-900">{expenseRatio.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full ${isOrganizedBetter ? 'bg-indigo-500' : 'bg-slate-300'}`}
                            style={{ width: `${Math.min(expenseRatio, 100)}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Ponto de viragem: 25%</p>
                </div>

                <div className={`p-4 rounded-xl ${isOrganizedBetter ? 'bg-indigo-50 border border-indigo-100' : 'bg-slate-50 border border-slate-100'}`}>
                    <h4 className={`font-semibold text-sm ${isOrganizedBetter ? 'text-indigo-900' : 'text-slate-700'}`}>
                        {isOrganizedBetter ? "Considera Contabilidade Organizada" : "Regime Simplificado é Ideal"}
                    </h4>
                    <p className={`text-xs mt-1 ${isOrganizedBetter ? 'text-indigo-700' : 'text-slate-500'}`}>
                        {isOrganizedBetter
                            ? "As tuas despesas reais são superiores à dedução automática do regime simplificado. Podes poupar impostos mudando de regime."
                            : "As tuas despesas são baixas. O coeficiente do regime simplificado compensa mais do que declarar despesas reais."}
                    </p>
                </div>

                <Link href="/" className="w-full py-2 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                    Simular Cenários
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
