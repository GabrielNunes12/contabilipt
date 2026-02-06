'use client';

import { LucideIcon, TrendingUp, TrendingDown, DollarSign, Briefcase, Users } from "lucide-react";
import { SavedSimulation } from "@/services/simulation/types";

interface DashboardStatsProps {
    data: SavedSimulation[];
}

import { useTranslations } from 'next-intl';

export function DashboardStats({ data }: DashboardStatsProps) {
    const t = useTranslations('Dashboard');
    if (!data || data.length === 0) return null;

    const current = data[data.length - 1];
    const previous = data.length > 1 ? data[data.length - 2] : null;

    const isEmployee = current.regime === 'employee';

    // Metric Selection
    const currentMetric = isEmployee ? (current.employee_gross_salary || 0) : current.daily_rate;
    const previousMetric = previous ? (isEmployee ? (previous.employee_gross_salary || 0) : previous.daily_rate) : 0;

    const metricTitle = isEmployee ? t('grossSalaryCurrent') : t('dailyRateCurrent');
    const metricIcon = isEmployee ? Briefcase : DollarSign;
    const metricColor = isEmployee ? "text-blue-600" : "text-emerald-600";
    const metricBg = isEmployee ? "bg-blue-50" : "bg-emerald-50";

    // Change calculation
    const diff = currentMetric - previousMetric;
    const percentChange = previousMetric > 0 ? ((diff / previousMetric) * 100).toFixed(1) : 0;
    const isPositive = diff >= 0;

    // Max Metric
    const maxMetric = Math.max(...data.map(d => isEmployee ? (d.employee_gross_salary || 0) : d.daily_rate));
    const maxTitle = isEmployee ? t('grossSalaryHighest') : t('dailyRateHighest');

    const Icon = metricIcon;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Card 1: Current Metric */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-medium text-slate-500">{metricTitle}</p>
                    <div className={`p-2 rounded-lg ${metricBg}`}>
                        <Icon className={`w-5 h-5 ${metricColor}`} />
                    </div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900">
                    {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(currentMetric)}
                </h3>
                {previous && (
                    <div className={`flex items-center gap-1 mt-1 text-sm ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span className="font-medium">{Math.abs(Number(percentChange))}%</span>
                        <span className="text-slate-400">{t('vsLastSimulation')}</span>
                    </div>
                )}
            </div>

            {/* Card 2: Highest Metric */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-medium text-slate-500">{maxTitle}</p>
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900">
                    {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(maxMetric)}
                </h3>
                <p className="text-sm text-slate-400 mt-1">{t('potentialMax')}</p>
            </div>

            {/* Card 3: Simulations Count */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-medium text-slate-500">{t('totalSimulations')}</p>
                    <div className="p-2 bg-purple-50 rounded-lg">
                        <Users className="w-5 h-5 text-purple-600" />
                    </div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900">{data.length}</h3>
                <p className="text-sm text-slate-400 mt-1">{t('scenariosAnalyzed')}</p>
            </div>
        </div>
    );
}
