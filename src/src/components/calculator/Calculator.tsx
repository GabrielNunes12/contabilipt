
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { calculateRecibosVerdes, calculateUnipessoal } from '@/lib/calculator';
import { CalculatorInput } from '@/lib/types';
import { BUSINESS_DEFAULTS } from '@/config/tax-rates';
import { Euro, ArrowRight, Lock, Unlock, FileDown, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AuthUser } from '@/services/auth/types';
import { cn } from '@/lib/utils';
import { saveSimulation } from '@/services/simulation/server';

interface CalculatorProps {
    user: AuthUser | null;
}

export function Calculator({ user }: CalculatorProps) {
    const router = useRouter();
    const { register, watch, handleSubmit } = useForm<CalculatorInput>({
        defaultValues: {
            dailyRate: 350,
            workDaysPerMonth: BUSINESS_DEFAULTS.WORK_DAYS_MONTH,
            monthsPerYear: BUSINESS_DEFAULTS.MONTHS_YEAR,
            businessExpenses: 0
        }
    });

    const values = watch();
    const rvResult = calculateRecibosVerdes(values);
    const uniResult = calculateUnipessoal(values);

    const savings = uniResult.netAnnual - rvResult.netAnnual;
    const isUniBetter = savings > 0;

    const handleSave = async () => {
        if (!user) return;
        const result = await saveSimulation(values);
        if (result.success) {
            alert("Simulação guardada com sucesso!");
        } else {
            alert("Erro ao guardar.");
        }
    };

    const handleBuy = async () => {
        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error("Stripe Error:", data.error);
                alert("Erro ao iniciar pagamento.");
            }
        } catch (error) {
            console.error("Payment Error:", error);
            alert("Erro de conexão.");
        }
    };

    return (
        <div className="grid gap-8 md:grid-cols-2 lg:gap-12 relative z-20">
            {/* Input Section */}
            <Card className="w-full shadow-lg border-slate-200 bg-white/50 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-xl text-slate-800">Teus Dados</CardTitle>
                            <CardDescription className="text-slate-500">Simula o teu cenário atual.</CardDescription>
                        </div>
                        {user && (
                            <Button variant="ghost" size="icon" onClick={handleSave} title="Guardar Simulação" className="text-slate-400 hover:text-emerald-600">
                                <Save className="w-5 h-5" />
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="dailyRate" className="text-slate-600 font-medium">Daily Rate (€)</Label>
                        <div className="relative group">
                            <Euro className="absolute left-3 top-2.5 h-4 w-4 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
                            <Input
                                id="dailyRate"
                                type="number"
                                className="pl-9 border-slate-200 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 transition-all font-medium text-slate-800"
                                {...register('dailyRate', { valueAsNumber: true })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-slate-600 font-medium">Dias / Mês</Label>
                            <Input type="number" className="border-slate-200 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 text-slate-800" {...register('workDaysPerMonth', { valueAsNumber: true })} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-600 font-medium">Meses / Ano</Label>
                            <Input type="number" className="border-slate-200 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 text-slate-800" {...register('monthsPerYear', { valueAsNumber: true })} />
                        </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-slate-100">
                        <Label htmlFor="expenses" className="text-slate-600 font-medium">Despesas Anuais (€)</Label>
                        <Input
                            id="expenses"
                            type="number"
                            className="border-slate-200 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 text-slate-800"
                            placeholder="0"
                            {...register('businessExpenses', { valueAsNumber: true })}
                        />
                        <p className="text-xs text-slate-400">Ex: Software, Hardware, Contabilidade</p>
                    </div>
                </CardContent>
            </Card>

            {/* Results Section */}
            <div className="space-y-6">
                <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none -mr-10 -mt-10" />
                    <CardHeader className="pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">Recibos Verdes (Líquido)</CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold tracking-tight text-white">
                                {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(rvResult.netMonthly)}
                            </span>
                            <span className="text-lg text-slate-500">/mês</span>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-2 gap-8 text-sm">
                            <div>
                                <p className="text-slate-500 mb-1">Bruto Anual</p>
                                <p className="font-medium text-slate-200 text-lg">
                                    {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(rvResult.grossAnnual)}
                                </p>
                            </div>
                            <div>
                                <p className="text-slate-500 mb-1">Impostos Totais</p>
                                <p className="font-medium text-red-400/90 text-lg">
                                    -{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(rvResult.ss + rvResult.irs)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Premium Teaser (Upsell) */}
                <Card className={cn("border-2 relative overflow-hidden transition-all duration-500",
                    user?.isPremium ? "bg-white border-emerald-500/50 shadow-emerald-500/10 shadow-xl" : "bg-slate-50/50 border-slate-200 border-dashed"
                )}>
                    {!user?.isPremium && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6 text-center">
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Queres ganhar mais?</h3>
                            <p className="text-slate-500 text-sm mb-4 max-w-[200px]">Descobre quanto podes poupar ao abrir empresa.</p>
                            <Button onClick={handleBuy} variant="default" size="lg" className="shadow-lg shadow-emerald-500/20 animate-pulse bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8">
                                <Lock className="w-4 h-4 mr-2" />
                                Desbloquear Otimização
                            </Button>
                        </div>
                    )}
                    <CardHeader className="bg-emerald-50/30 border-b border-emerald-100/50 pb-4">
                        <CardTitle className="flex items-center gap-2 text-slate-800">
                            {user?.isPremium ? <Unlock className="w-5 h-5 text-emerald-500" /> : <Lock className="w-5 h-5 text-slate-400" />}
                            <span className="font-bold">Cenário Otimizado</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className={cn("pt-6", !user?.isPremium ? "blur-sm select-none opacity-50" : "")}>
                        <div className="space-y-5">
                            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                                <span className="text-slate-600 font-medium">Unipessoal Líquido</span>
                                <span className={cn("font-bold text-2xl", isUniBetter ? "text-emerald-600" : "text-slate-600")}>
                                    {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(uniResult.netMonthly)}
                                    <span className="text-xs font-normal text-slate-400 ml-1">/mês</span>
                                </span>
                            </div>

                            {isUniBetter ? (
                                <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-emerald-900">Poupança Anual</span>
                                        <span className="text-xs text-emerald-600 font-medium uppercase tracking-wide">Dinheiro no bolso</span>
                                    </div>
                                    <span className="font-bold text-2xl text-emerald-600">
                                        +{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(savings)}
                                    </span>
                                </div>
                            ) : (
                                <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 text-amber-800 text-sm">
                                    Neste nível de faturação, manter <strong>Recibos Verdes</strong> compensa mais.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
