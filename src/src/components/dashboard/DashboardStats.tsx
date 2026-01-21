'use client';

import { LucideIcon, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

interface Simulation {
    daily_rate: number;
    created_at: string;
}

interface DashboardStatsProps {
    data: Simulation[];
}

export function DashboardStats({ data }: DashboardStatsProps) {
    if (!data || data.length === 0) return null;

    const current = data[data.length - 1];
    const previous = data.length > 1 ? data[data.length - 2] : null;

    const currentRate = current.daily_rate;
    const previousRate = previous ? previous.daily_rate : 0;

    // Change calculation
    const diff = currentRate - previousRate;
    const percentChange = previousRate > 0 ? ((diff / previousRate) * 100).toFixed(1) : 0;
    const isPositive = diff >= 0;

    // Highest Rate
    const maxRate = Math.max(...data.map(d => d.daily_rate));

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Card 1: Current Rate */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-medium text-slate-500">Daily Rate Atual</p>
                    <div className="p-2 bg-emerald-50 rounded-lg">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                    </div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900">{currentRate}€</h3>
                {previous && (
                    <div className={`flex items-center gap-1 mt-1 text-sm ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span className="font-medium">{Math.abs(Number(percentChange))}%</span>
                        <span className="text-slate-400">vs última simulação</span>
                    </div>
                )}
            </div>

            {/* Card 2: Highest Rate */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-medium text-slate-500">Maior Rate Registado</p>
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900">{maxRate}€</h3>
                <p className="text-sm text-slate-400 mt-1">O teu potencial máximo</p>
            </div>

            {/* Card 3: Simulations Count */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-medium text-slate-500">Total Simulações</p>
                    <div className="p-2 bg-purple-50 rounded-lg">
                        <DollarSign className="w-5 h-5 text-purple-600" />
                    </div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900">{data.length}</h3>
                <p className="text-sm text-slate-400 mt-1">Cenários analisados</p>
            </div>
        </div>
    );
}
