'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SavedSimulation } from '@/services/simulation/types';
import { useTranslations } from 'next-intl';

interface RateHistoryChartProps {
    data: SavedSimulation[];
}

export function RateHistoryChart({ data }: RateHistoryChartProps) {
    const t = useTranslations('Dashboard');

    if (!data || data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center border border-slate-200 rounded-xl bg-white text-slate-400">
                {t('noDataChart')}
            </div>
        );
    }

    const lastSim = data[data.length - 1];
    const isEmployee = lastSim.regime === 'employee';
    const dataKey = isEmployee ? 'employee_gross_salary' : 'daily_rate';
    const title = isEmployee ? t('grossSalaryEvolution') : t('dailyRateEvolution');
    const color = isEmployee ? '#2563eb' : '#10b981'; // Blue for Employee, Emerald for Freelancer

    const formattedData = data.map(item => ({
        ...item,
        date: new Date(item.created_at).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' }),
        value: isEmployee ? (item.employee_gross_salary || 0) : item.daily_rate
    }));

    return (
        <div className="w-full h-[350px] bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">{title}</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                        dataKey="date"
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}€`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                        formatter={(value: any) => [`${value}€`, isEmployee ? t('grossSalary') : t('dailyRateLabel')]}
                    />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={3}
                        dot={{ fill: color, r: 4, strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, fill: color }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
