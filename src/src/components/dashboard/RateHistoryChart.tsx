'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Simulation {
    created_at: string;
    daily_rate: number;
    expenses: number;
}

interface RateHistoryChartProps {
    data: Simulation[];
}

export function RateHistoryChart({ data }: RateHistoryChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center border border-slate-200 rounded-xl bg-white text-slate-400">
                Sem histórico disponível. Guarda uma simulação para veres o gráfico.
            </div>
        );
    }

    const formattedData = data.map(item => ({
        ...item,
        date: new Date(item.created_at).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' }),
    }));

    return (
        <div className="w-full h-[350px] bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Evolução do Daily Rate</h3>
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
                    />
                    <Line
                        type="monotone"
                        dataKey="daily_rate"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ fill: '#10b981', r: 4, strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, fill: '#10b981' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
