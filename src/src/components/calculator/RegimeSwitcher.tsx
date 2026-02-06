
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowLeftRight, TrendingUp } from 'lucide-react';
import { CalculatorInput } from '@/lib/types';
import { calculateRecibosVerdes, calculateUnipessoal } from '@/lib/calculator';
import { useTranslations } from 'next-intl';

interface RegimeSwitcherProps {
    grossIncome: number;
    currentExpenses: number;
    input: CalculatorInput;
}

export function RegimeSwitcher({ grossIncome, input }: RegimeSwitcherProps) {
    const t = useTranslations('Calculator');
    // Generate data points for expenses from 0 to 60% of gross income
    const data = [];
    const step = 2500;
    const maxExpenses = grossIncome * 0.6;

    for (let expense = 0; expense <= maxExpenses; expense += step) {

        // 1. Simplified Regime (Recibos Verdes)
        // Expenses affect the Taxable Income? 
        // In PT, 15% is fixed deduction. 10% is variable deduction based on expenses.
        // If expenses < 10% of Gross, Taxable Income is HIGHER.
        // We need to simulate this dynamic behavior.
        // Currently calculateRecibosVerdes might implicitly assume max deduction or have fixed logic.
        // We might need to adjust logic or just use a standard approximation for the graph.
        // Let's assume standard behavior: Simplified Net is mostly flat or slight curve.

        // Actually, let's treat the input to the calculator as having THIS amount of expenses.
        // We need to override the input's "businessExpenses" for the simulation loop.

        const simInput = { ...input, businessExpenses: expense };

        // Recibos Verdes: 
        // Note: Our current `calculateRecibosVerdes` doesn't strictly use `businessExpenses` to adjust the coefficient 
        // because usually users assume the flat rate. 
        // But for "Regime Switcher" valid expenses count towards the 15% justification.
        // Let's calculate purely:
        const rvResult = calculateRecibosVerdes(simInput);

        // Unipessoal:
        // Expenses DIRECTLY reduce Profit -> Reduce IRC.
        // But they are also OUTFLOWS (unless perks).
        // If I spend 10k on software, my Net Income is 10k less?
        // NO. The graph usually compares "Fiscal Efficiency".
        // But the user cares about "What's left".
        // If I HAVE to spend 10k, which regime is better?
        // So we compare Net Income assuming these expenses ARE paid.

        const uniInput = { ...simInput, ownerSalary: input.ownerSalary || 522.50 }; // Ensure salary is set
        const uniResult = calculateUnipessoal(uniInput);

        data.push({
            expenses: expense,
            simplified: rvResult.netAnnual,
            organized: uniResult.netAnnual,
        });
    }

    // Find intersection (Turning Point)
    let turningPoint = 0;
    for (let i = 0; i < data.length - 1; i++) {
        const current = data[i];
        const next = data[i + 1];
        if ((current.organized < current.simplified && next.organized > next.simplified) ||
            (current.organized > current.simplified && next.organized < next.simplified)) {
            turningPoint = current.expenses;
            break;
        }
    }

    return (
        <Card className="w-full mt-8 border-slate-200 shadow-sm bg-white">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                    <ArrowLeftRight className="w-5 h-5 text-indigo-500" />
                    {t('switcherTitle')}
                </CardTitle>
                <CardDescription>
                    {t('switcherDesc')} <strong>{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(turningPoint)}</strong>.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis
                                dataKey="expenses"
                                tickFormatter={(val) => `${val / 1000}k`}
                                stroke="#64748B"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                tickFormatter={(val) => `${val / 1000}k`}
                                stroke="#64748B"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                formatter={(val: any) => [new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val || 0), '']}
                                labelFormatter={(label) => `Expenses: ${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(label || 0)}`}
                                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="simplified"
                                name={t('legendSimplified')}
                                stroke="#10B981"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 6 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="organized"
                                name={t('legendOrganized')}
                                stroke="#6366F1"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
