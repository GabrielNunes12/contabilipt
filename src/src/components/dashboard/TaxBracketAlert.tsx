'use client';

import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { SavedSimulation } from "@/services/simulation/types";
import { FISCAL_LIMITS_2025 } from "@/config/tax-rates";

interface TaxBracketAlertProps {
    data?: SavedSimulation[];
    annualIncome?: number;
    clientLocation?: 'pt' | 'eu' | 'world';
}

import { useTranslations } from 'next-intl';

export function TaxBracketAlert({ data, annualIncome: propIncome, clientLocation = 'pt' }: TaxBracketAlertProps) {
    const t = useTranslations('Dashboard');

    let annualIncome = 0;
    if (propIncome) {
        annualIncome = propIncome;
    } else if (data && data.length > 0) {
        const current = data[data.length - 1];
        annualIncome = current.daily_rate * current.days_per_month * current.months_per_year;
    } else {
        return null;
    }

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
                        <h3 className="text-lg font-semibold text-slate-900">{t('fiscalHealth')}</h3>
                        <p className="text-slate-500 mt-1">
                            {t('fiscalHealthDesc', { val1: VAT_EXEMPTION / 1000, val2: SIMPLIFIED_REGIME / 1000 })}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Custom Logic for International Clients
    const isInternational = clientLocation === 'eu' || clientLocation === 'world';
    const vatExtraText = isInternational && vatStatus === 'exceeded'
        ? t('vatExceededInternational')
        : (vatStatus === 'exceeded' ? t('vatExtraExceeded') : '');

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
                                {vatStatus === 'exceeded' ? t('vatLimitExceeded') : t('vatLimitWarning')}
                            </h3>
                            <p className={`${vatStatus === 'exceeded' ? 'text-red-700' : 'text-amber-700'} mt-1`}>
                                {t('vatExceededDesc', {
                                    val1: annualIncome.toLocaleString('pt-PT'),
                                    status: vatStatus === 'exceeded' ? t('statusExceeded') : t('statusNear'),
                                    val2: VAT_EXEMPTION.toLocaleString('pt-PT'),
                                    extra: vatExtraText
                                })}
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
                                {simplifiedStatus === 'exceeded' ? t('simplifiedLimitExceeded') : t('simplifiedLimitWarning')}
                            </h3>
                            <p className={`${simplifiedStatus === 'exceeded' ? 'text-red-700' : 'text-amber-700'} mt-1`}>
                                {t('simplifiedExceededDesc', {
                                    status: simplifiedStatus === 'exceeded' ? t('statusAbove') : t('statusClose'),
                                    val: SIMPLIFIED_REGIME.toLocaleString('pt-PT')
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
