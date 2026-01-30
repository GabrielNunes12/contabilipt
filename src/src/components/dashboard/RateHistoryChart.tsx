'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { calculateRecibosVerdes, calculateUnipessoal } from '@/lib/calculator';
import { CalculatorInput } from '@/lib/types';
import { useTranslations, useLocale } from 'next-intl';

interface Simulation {
    created_at: string;
    daily_rate: number;
    expenses: number;
    days_per_month: number;
    months_per_year: number;
    is_nhr: boolean;
    municipality_benefit: number;
    include_meal_allowance: boolean;
    custom_accountant_cost: number;
    employee_gross_salary: number;
    employee_meal_allowance: number;
}

interface RateHistoryChartProps {
    data: Simulation[];
}

export function RateHistoryChart({ data }: RateHistoryChartProps) {
    const t = useTranslations('Dashboard');
    const locale = useLocale();

    if (!data || data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center border border-slate-200 rounded-xl bg-white text-slate-400">
                {t('noHistory')}
            </div>
        );
    }

    const formattedData = data.map(item => {
        // Map DB snake_case to CalculatorInput camelCase
        const input: CalculatorInput = {
            dailyRate: item.daily_rate,
            workDaysPerMonth: item.days_per_month || 21,
            monthsPerYear: item.months_per_year || 11,
            businessExpenses: item.expenses,
            isNHR: item.is_nhr,
            municipalityBenefit: item.municipality_benefit || 0,
            includeMealAllowance: item.include_meal_allowance,
            customAccountantCost: item.custom_accountant_cost,
            employeeGrossSalary: item.employee_gross_salary,
            employeeMealAllowance: item.employee_meal_allowance
        };

        const rvResult = calculateRecibosVerdes(input);
        const companyResult = calculateUnipessoal(input);

        return {
            date: new Date(item.created_at).toLocaleDateString(locale, { day: '2-digit', month: '2-digit' }),
            netFreelancer: Math.round(rvResult.netMonthly),
            netCompany: Math.round(companyResult.netMonthly),
            daily_rate: item.daily_rate // Keep strictly for reference if needed
        };
    });

    return (
        <div className="w-full h-[400px] bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
            <div className="flex justify-between items-center mb-6 shrink-0">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">{t('netIncomeEvolution')}</h3>
                    <p className="text-sm text-slate-500">{t('monthlyComparison')}</p>
                </div>
            </div>

            <div className="flex-1 min-h-0 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formattedData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                            dataKey="date"
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tick={{ dy: 10 }}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}€`}
                            width={50}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                            itemStyle={{ fontSize: '13px', fontWeight: 500 }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        <Line
                            name={t('freelancerNet')}
                            type="monotone"
                            dataKey="netFreelancer"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={{ fill: '#10b981', r: 4, strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 6, fill: '#10b981' }}
                        />
                        <Line
                            name={t('companyNet')}
                            type="monotone"
                            dataKey="netCompany"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ fill: '#3b82f6', r: 4, strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 6, fill: '#3b82f6' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
