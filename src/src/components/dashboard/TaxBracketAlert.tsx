'use client';

import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { SavedSimulation } from "@/services/simulation/types";
import { FISCAL_LIMITS_2025 } from "@/config/tax-rates";

interface TaxBracketAlertProps {
    data: SavedSimulation[];
}

export function TaxBracketAlert({ data }: TaxBracketAlertProps) {
    if (!data || data.length === 0) return null;

    const current = data[data.length - 1];
    const annualIncome = current.daily_rate * current.days_per_month * current.months_per_year;

    // Thresholds (2025)
    // const VAT_LIMIT = 15000;
    // const SIMPLIFIED_LIMIT = 200000;
    const { VAT_EXEMPTION, SIMPLIFIED_REGIME } = FISCAL_LIMITS_2025;

    const vatUsage = (annualIncome / VAT_EXEMPTION) * 100;
    const simplifiedUsage = (annualIncome / SIMPLIFIED_REGIME) * 100;

    // Helper to determine status
    const getStatus = (usage: number) => {
        if (usage >= 100) return 'exceeded';
        if (usage >= 90) return 'warning';
        return 'safe';
    };

    const vatStatus = getStatus(vatUsage);
    const simplifiedStatus = getStatus(simplifiedUsage);

    if (vatStatus === 'safe' && simplifiedStatus === 'safe') {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mt-8">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Situação Fiscal Saudável</h3>
                        <p className="text-slate-500 mt-1">
                            Estás dentro dos limites do Regime de Isenção de IVA ({FISCAL_LIMITS_2025.VAT_EXEMPTION / 1000}k€) e do Regime Simplificado ({FISCAL_LIMITS_2025.SIMPLIFIED_REGIME / 1000}k€).
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 mt-8">
            {/* VAT Alert */}
            {vatStatus !== 'safe' && (
                <div className={`p-6 rounded-2xl border ${vatStatus === 'exceeded' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                    <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${vatStatus === 'exceeded' ? 'bg-red-100' : 'bg-amber-100'}`}>
                            <AlertTriangle className={`w-6 h-6 ${vatStatus === 'exceeded' ? 'text-red-600' : 'text-amber-600'}`} />
                        </div>
                        <div>
                            <h3 className={`text-lg font-semibold ${vatStatus === 'exceeded' ? 'text-red-900' : 'text-amber-900'}`}>
                                {vatStatus === 'exceeded' ? 'Limite IVA Ultrapassado' : 'Atenção ao Limite de Isenção de IVA'}
                            </h3>
                            <p className={`${vatStatus === 'exceeded' ? 'text-red-700' : 'text-amber-700'} mt-1`}>
                                A tua faturação anual estimada ({annualIncome.toLocaleString('pt-PT')}€) {vatStatus === 'exceeded' ? 'excede' : 'está próxima'} do limite de isenção de {FISCAL_LIMITS_2025.VAT_EXEMPTION.toLocaleString('pt-PT')}€.
                                {vatStatus === 'exceeded' && " Terás de cobrar IVA a partir de Fevereiro do ano seguinte ou imediatamente se ultrapassaste o limiar de cadastro."}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Simplified Regime Alert */}
            {simplifiedStatus !== 'safe' && (
                <div className={`p-6 rounded-2xl border ${simplifiedStatus === 'exceeded' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                    <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${simplifiedStatus === 'exceeded' ? 'bg-red-100' : 'bg-amber-100'}`}>
                            <AlertTriangle className={`w-6 h-6 ${simplifiedStatus === 'exceeded' ? 'text-red-600' : 'text-amber-600'}`} />
                        </div>
                        <div>
                            <h3 className={`text-lg font-semibold ${simplifiedStatus === 'exceeded' ? 'text-red-900' : 'text-amber-900'}`}>
                                {simplifiedStatus === 'exceeded' ? 'Limite Regime Simplificado Ultrapassado' : 'Atenção ao Limite do Regime Simplificado'}
                            </h3>
                            <p className={`${simplifiedStatus === 'exceeded' ? 'text-red-700' : 'text-amber-700'} mt-1`}>
                                Estás {simplifiedStatus === 'exceeded' ? 'acima' : 'próximo'} do teto de {FISCAL_LIMITS_2025.SIMPLIFIED_REGIME.toLocaleString('pt-PT')}€ para o Regime Simplificado. A Contabilidade Organizada pode tornar-se obrigatória.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
