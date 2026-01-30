'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IRSInput, calculateIRS } from '@/lib/irs-calculator';
import { saveIRSSimulation } from '@/services/irs/server';
import { Euro, Users, PiggyBank, Save, Loader2, Info, Lock } from 'lucide-react';
import { AuthUser } from '@/services/auth/types';
import { useTranslations } from 'next-intl';

interface IRSSimulatorProps {
    user: AuthUser | null;
}

export function IRSSimulator({ user }: IRSSimulatorProps) {
    const t = useTranslations('IRSSimulator');
    const [isSaving, setIsSaving] = useState(false);
    const { register, watch, handleSubmit, setValue } = useForm<IRSInput>({
        defaultValues: {
            annualGrossIncome: 30000,
            incomeType: 'B',
            status: 'single',
            dependents: 0,
            expenses: 250, // General family expenses
            withholdingTax: 0
        }
    });

    const values = watch();
    const result = calculateIRS(values);

    const handleSave = async (data: IRSInput) => {
        if (!user) return;
        setIsSaving(true);
        try {
            await saveIRSSimulation(data);
            alert("Simulação IRS guardada com sucesso!");
        } catch (error) {
            console.error(error);
            alert("Erro ao guardar.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpgrade = async () => {
        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error("Stripe Error:", data.error);
                alert(t('errorPayment'));
            }
        } catch (error) {
            console.error("Payment Error:", error);
            alert(t('errorPayment'));
        }
    };

    if (!user || !user.isPremium) {
        const isPremiumLocked = !!user && !user.isPremium;

        return (
            <div className="relative">
                {/* Blurred Content Placeholder */}
                <div className="grid gap-8 md:grid-cols-2 lg:gap-12 filter blur-sm select-none opacity-50 pointer-events-none" aria-hidden="true">
                    <Card className="w-full shadow-lg border-slate-200 bg-white/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>{t('title')}</CardTitle>
                        </CardHeader>
                        <CardContent className="h-96" />
                    </Card>
                    <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden relative h-96" />
                </div>

                {/* Lock Overlay */}
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md shadow-2xl border-emerald-500/20 bg-white/95 backdrop-blur transform transition-all hover:scale-105 duration-300">
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                                <Lock className="w-8 h-8 text-emerald-600" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-slate-900">
                                {isPremiumLocked ? t('premiumRequired') : t('exclusiveAccess')}
                            </CardTitle>
                            <CardDescription className="text-slate-600 text-lg">
                                {isPremiumLocked ? t('premiumDescription') : t('description')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <p className="text-slate-600 text-center leading-relaxed">
                                {isPremiumLocked ? t('premiumDescription') : t('loginToAccess')}
                            </p>
                            <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-500 mt-4">
                                <div className="bg-slate-50 p-2 rounded">
                                    <span className="block font-semibold text-emerald-600">Grátis</span>
                                    {t('freeSimulations')}
                                </div>
                                <div className="bg-slate-50 p-2 rounded">
                                    <span className="block font-semibold text-emerald-600">2025</span>
                                    {t('officialRules')}
                                </div>
                                <div className="bg-slate-50 p-2 rounded">
                                    <span className="block font-semibold text-emerald-600">Histórico</span>
                                    {t('saveHistory')}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-3 justify-center pb-8 px-8">
                            <Button
                                asChild={!isPremiumLocked}
                                onClick={isPremiumLocked ? handleUpgrade : undefined}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 h-12 text-base font-semibold"
                            >
                                {isPremiumLocked ? (
                                    <span>{t('upgradeBtn')}</span>
                                ) : (
                                    <a href="/login">{t('loginToAccess')}</a>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="grid gap-8 md:grid-cols-2 lg:gap-12 relative z-20">
            {/* Input Section */}
            <Card className="w-full shadow-lg border-slate-200 bg-white/50 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-xl text-slate-800">{t('title')}</CardTitle>
                            <CardDescription className="text-slate-500">{t('description')}</CardDescription>
                        </div>
                        {user && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleSubmit(handleSave)}
                                disabled={isSaving}
                                title={t('saveSimulation')}
                                className="text-slate-400 hover:text-emerald-600"
                            >
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Income Section */}
                    <div className="space-y-4">
                        <Label className="text-base font-semibold text-slate-900 flex items-center gap-2">
                            <Euro className="w-4 h-4 text-emerald-500" />
                            {t('grossIncome')}
                        </Label>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-600">{t('grossIncome')}</Label>
                                <Input type="number" {...register('annualGrossIncome', { valueAsNumber: true })} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-600">{t('incomeType')}</Label>
                                <Select onValueChange={(v: string) => setValue('incomeType', v as 'A' | 'B')} defaultValue={values.incomeType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="A">{t('incomeTypeA')}</SelectItem>
                                        <SelectItem value="B">{t('incomeTypeB')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-600">{t('withholdingTax')}</Label>
                            <Input type="number" {...register('withholdingTax', { valueAsNumber: true })} placeholder="Total retido durante o ano" />
                        </div>
                    </div>

                    <div className="w-full h-px bg-slate-100" />

                    {/* Personal Section */}
                    <div className="space-y-4">
                        <Label className="text-base font-semibold text-slate-900 flex items-center gap-2">
                            <Users className="w-4 h-4 text-emerald-500" />
                            {t('household')}
                        </Label>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-600">{t('maritalStatus')}</Label>
                                <Select onValueChange={(v: string) => setValue('status', v as 'single' | 'married')} defaultValue={values.status}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="single">{t('single')}</SelectItem>
                                        <SelectItem value="married">{t('married')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-600">{t('dependents')}</Label>
                                <Input type="number" {...register('dependents', { valueAsNumber: true })} />
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-px bg-slate-100" />

                    {/* Deductions Section */}
                    <div className="space-y-4">
                        <Label className="text-base font-semibold text-slate-900 flex items-center gap-2">
                            <PiggyBank className="w-4 h-4 text-emerald-500" />
                            {t('deductibleExpenses')}
                        </Label>
                        <div className="space-y-2">
                            <Label className="text-slate-600">{t('deductibleExpenses')}</Label>
                            <Input type="number" {...register('expenses', { valueAsNumber: true })} placeholder={t('expensesPlaceholder')} />
                            <p className="text-xs text-slate-400">{t('expensesHint')}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results Section */}
            <div className="space-y-6">
                <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none -mr-20 -mt-20" />

                    <CardHeader className="pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">{t('liquidationResult')}</CardTitle>
                    </CardHeader>

                    <CardContent className="relative z-10 space-y-6">
                        <div>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-4xl font-bold tracking-tight ${result.amountToPay > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                    {result.amountToPay > 0 ? t('resultToPay') : t('resultToReceive')}
                                </span>
                            </div>
                            <span className="text-5xl font-bold text-white block mt-2">
                                {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(Math.abs(result.amountToPay))}
                            </span>
                        </div>

                        <div className="space-y-3 pt-6 border-t border-slate-800">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">{t('taxableIncome')}</span>
                                <span className="text-slate-300 font-mono">
                                    {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(result.taxableIncome)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">{t('totalTax')}</span>
                                <span className="text-slate-300 font-mono">
                                    {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(result.totalTax)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">{t('netTax')}</span>
                                <span className="text-slate-300 font-mono">
                                    {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(result.netTax)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">{t('effectiveRate')}</span>
                                <span className="text-emerald-400 font-mono">
                                    {(result.effectiveRate * 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 rounded-lg p-4 text-xs text-slate-400 border border-slate-700/50">
                            <div className="flex items-start gap-2">
                                <Info className="w-4 h-4 mt-0.5 shrink-0" />
                                <p>
                                    {t('disclaimerMain')}
                                    {values.incomeType === 'B' && ` ${t('disclaimerB')}`}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
