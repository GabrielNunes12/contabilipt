
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { calculateRecibosVerdes, calculateUnipessoal, calculateDependentWork } from '@/lib/calculator';
import { CalculatorInput } from '@/lib/types';
import { BUSINESS_DEFAULTS, TAX_RATES_2024 } from '@/config/tax-rates';
import { Euro, ArrowRight, Lock, Unlock, FileDown, Save, Building2, Palmtree, Utensils, Calculator as CalcIcon, Briefcase, Users, Target, Car, Heart, GraduationCap, PiggyBank, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AuthUser } from '@/services/auth/types';
import { cn } from '@/lib/utils';
import { RegimeSwitcher } from './RegimeSwitcher';
import { saveSimulation } from '@/services/simulation/server';
import { useTranslations } from 'next-intl';

interface CalculatorProps {
    user: AuthUser | null;
}

export function Calculator({ user }: CalculatorProps) {
    const t = useTranslations('Calculator');
    const router = useRouter();
    const { register, watch, handleSubmit } = useForm<CalculatorInput>({
        defaultValues: {
            dailyRate: 350,
            workDaysPerMonth: BUSINESS_DEFAULTS.WORK_DAYS_MONTH,
            monthsPerYear: BUSINESS_DEFAULTS.MONTHS_YEAR,
            businessExpenses: 0,
            isNHR: false,
            municipalityBenefit: 0,
            includeMealAllowance: true,
            customAccountantCost: 150,
            employeeGrossSalary: 2500,
            employeeMealAllowance: 9.60,
        }
    });

    const values = watch();
    const rvResult = calculateRecibosVerdes(values);
    const uniResult = calculateUnipessoal(values);
    const depResult = calculateDependentWork(values);

    // Winner logic
    const results = [
        { id: 'employee', net: depResult.netAnnual, title: t('scenarioEmployee') },
        { id: 'freelancer', net: rvResult.netAnnual, title: t('scenarioFreelancer') },
        { id: 'company', net: uniResult.netAnnual, title: t('scenarioCompany') }
    ];
    const winner = results.reduce((prev, current) => (prev.net > current.net) ? prev : current);

    const savings = uniResult.netAnnual - rvResult.netAnnual;

    const handleSave = async () => {
        if (!user) return;
        const result = await saveSimulation(values);
        if (result.success) {
            alert(t('successSave'));
        } else {
            alert(t('errorSave'));
        }
    };

    const handleLogin = () => {
        router.push('/login');
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
                alert(t('errorPayment'));
            }
        } catch (error) {
            console.error("Payment Error:", error);
            alert(t('errorPayment'));
        }
    };

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
                            <Button variant="ghost" size="icon" onClick={handleSave} title={t('saveSimulation')} className="text-slate-400 hover:text-emerald-600">
                                <Save className="w-5 h-5" />
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="dailyRate" className="text-slate-600 font-medium">{t('dailyRate')}</Label>
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
                            <Label className="text-slate-600 font-medium">{t('daysPerMonth')}</Label>
                            <Input type="number" className="border-slate-200 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 text-slate-800" {...register('workDaysPerMonth', { valueAsNumber: true })} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-600 font-medium">{t('monthsPerYear')}</Label>
                            <Input type="number" className="border-slate-200 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 text-slate-800" {...register('monthsPerYear', { valueAsNumber: true })} />
                        </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-slate-100">
                        <Label htmlFor="expenses" className="text-slate-600 font-medium">{t('annualExpenses')}</Label>
                        <Input
                            id="expenses"
                            type="number"
                            className="border-slate-200 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 text-slate-800"
                            placeholder="0"
                            {...register('businessExpenses', { valueAsNumber: true })}
                        />
                        <p className="text-xs text-slate-400">{t('expensesHint')}</p>
                    </div>

                    {/* Advanced Tax Settings */}
                    <div className="pt-4 border-t border-slate-100 space-y-4">
                        <Label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-emerald-500" />
                            {t('taxAdjustments')}
                        </Label>

                        <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-slate-50/50">
                            <div className="space-y-0.5">
                                <Label htmlFor="nhr" className="text-base font-medium text-slate-700 cursor-pointer flex items-center gap-2">
                                    <Palmtree className="w-4 h-4 text-emerald-600" />
                                    {t('nhrLabel')}
                                </Label>
                                <p className="text-xs text-slate-500">{t('nhrDesc')}</p>
                            </div>
                            <input
                                type="checkbox"
                                id="nhr"
                                {...register('isNHR')}
                                className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label htmlFor="municipality" className="text-slate-600 font-medium">{t('municipalityLabel')}</Label>
                                <span className="text-sm font-mono text-emerald-600">{values.municipalityBenefit || 0}%</span>
                            </div>
                            <Input
                                id="municipality"
                                type="range"
                                min="0"
                                max="5"
                                step="0.5"
                                className="accent-emerald-600 cursor-pointer"
                                {...register('municipalityBenefit', { valueAsNumber: true })}
                            />
                            <p className="text-xs text-slate-400">{t('municipalityHelp')}</p>
                        </div>
                    </div>


                </CardContent>
            </Card>

            {/* Company Optimization Settings - New Card */}
            <Card className="w-full shadow-lg border-slate-200 bg-white/50 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-purple-600" />
                                {t('optimizationTitle')}
                            </CardTitle>
                            <CardDescription className="text-slate-500">{t('optimizationDesc')}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-slate-50/50">
                        <div className="space-y-0.5">
                            <Label htmlFor="mealAllowance" className="text-base font-medium text-slate-700 cursor-pointer flex items-center gap-2">
                                <Utensils className="w-4 h-4 text-emerald-600" />
                                {t('mealAllowanceLabel')}
                            </Label>
                            <p className="text-xs text-slate-500 max-w-[200px]">{t('mealAllowanceDesc')}</p>
                        </div>
                        <input
                            type="checkbox"
                            id="mealAllowance"
                            {...register('includeMealAllowance')}
                            className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="accountant" className="text-slate-600 font-medium">{t('accountantLabel')}</Label>
                        <div className="relative">
                            <Euro className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                id="accountant"
                                type="number"
                                className="pl-9 border-slate-200"
                                {...register('customAccountantCost', { valueAsNumber: true })}
                            />
                        </div>
                    </div>

                    {/* Perks Section */}
                    <div className="pt-4 border-t border-slate-100 space-y-4">
                        <Label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                            {t('perksTitle')}
                        </Label>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="kms" className="text-slate-600 font-medium text-xs">{t('kmsLabel')}</Label>
                                <div className="relative">
                                    <Car className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="kms"
                                        type="number"
                                        placeholder={t('kmsDesc')}
                                        className="pl-9 border-slate-200 text-sm"
                                        {...register('kilometers', { valueAsNumber: true })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="health" className="text-slate-600 font-medium text-xs">{t('healthLabel')}</Label>
                                <div className="relative">
                                    <Heart className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="health"
                                        type="number"
                                        placeholder={t('monthly')}
                                        className="pl-9 border-slate-200 text-sm"
                                        {...register('healthInsurance', { valueAsNumber: true })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="education" className="text-slate-600 font-medium text-xs">{t('educationLabel')}</Label>
                                <div className="relative">
                                    <GraduationCap className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="education"
                                        type="number"
                                        placeholder={t('monthly')}
                                        className="pl-9 border-slate-200 text-sm"
                                        {...register('educationVouchers', { valueAsNumber: true })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ppr" className="text-slate-600 font-medium text-xs">{t('pprLabel')}</Label>
                                <div className="relative">
                                    <PiggyBank className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="ppr"
                                        type="number"
                                        placeholder="€/Year"
                                        className="pl-9 border-slate-200 text-sm"
                                        {...register('ppr', { valueAsNumber: true })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Salary vs Dividend Splitter (Premium) */}
                    <div className="pt-2 border-t border-slate-100 mt-4">
                        <div className="flex justify-between items-center mb-2">
                            <Label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                <Target className="w-4 h-4 text-emerald-500" />
                                {t('salaryTitle')}
                            </Label>
                            {!user?.isPremium && <Lock className="w-3 h-3 text-amber-500" />}
                        </div>

                        <div className={cn("space-y-3 p-3 border border-slate-200 rounded-lg bg-slate-50/50 relative", !user?.isPremium && "opacity-75")}>
                            {!user?.isPremium && (
                                <div className="absolute inset-0 z-10 cursor-not-allowed group flex items-center justify-center cursor-pointer" onClick={handleBuy}>
                                    <div className="bg-slate-900/90 text-white text-xs py-1 px-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                        {t('premiumBadge')}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between text-xs text-slate-500">
                                <span>{t('salaryBase')}</span>
                                <span>{t('salaryMax')}</span>
                            </div>
                            <Input
                                type="range"
                                min={TAX_RATES_2024.IAS} // IAS
                                max={5000} // Reasonable Cap
                                step={50}
                                defaultValue={TAX_RATES_2024.IAS}
                                disabled={!user?.isPremium}
                                className={cn("accent-emerald-600", !user?.isPremium ? "cursor-not-allowed" : "cursor-pointer")}
                                {...register('ownerSalary', { valueAsNumber: true })}
                            />
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500">{t('salaryDesc')}</span>
                                <span className="text-sm font-mono font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                                    {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(values.ownerSalary || TAX_RATES_2024.IAS)}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Scenario A Input (Employee Baseline) */}
            <Card className="w-full shadow-lg border-slate-200 bg-white/50 backdrop-blur-sm relative overflow-hidden">

                <CardHeader>
                    <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-blue-500" />
                        {t('scenarioEmployeeTitle')}
                    </CardTitle>
                    <CardDescription>{t('scenarioEmployeeDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="grossSalary" className="text-slate-600 font-medium">{t('grossSalaryLabel')}</Label>
                        <div className="relative">
                            <Euro className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                id="grossSalary"
                                type="number"
                                className="pl-9 border-slate-200"
                                {...register('employeeGrossSalary', { valueAsNumber: true })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="empMeal" className="text-slate-600 font-medium">{t('mealAllowanceDailyLabel')}</Label>
                        <div className="relative">
                            <Utensils className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                id="empMeal"
                                type="number"
                                step="0.1"
                                className="pl-9 border-slate-200"
                                {...register('employeeMealAllowance', { valueAsNumber: true })}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results Section (3-Column Grid) */}
            <div className="md:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Scenario A: Employee */}
                    <Card className={cn("border-2 transition-all relative overflow-hidden", winner.id === 'employee' ? "border-blue-500 shadow-blue-500/10 shadow-lg bg-blue-50/10" : "border-slate-200 bg-white")}>

                        <CardHeader>
                            <CardTitle className="text-lg text-slate-700 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-blue-500" />
                                {t('scenarioEmployee')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-800">
                                {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(depResult.netMonthly)}
                                <span className="text-sm font-normal text-slate-400 ml-1">{t('perMonth')}</span>
                            </div>
                            <div className="mt-4 text-sm text-slate-500">
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span>{t('grossAnnual')}</span>
                                    <span className="font-medium">{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(depResult.grossAnnual)}</span>
                                </div>
                                <div className="flex justify-between py-1 mt-1 text-red-500">
                                    <span>{t('taxes')}</span>
                                    <span>-{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(depResult.ss + depResult.irs)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Scenario B: Freelancer */}
                    <Card className={cn("border-2 transition-all", winner.id === 'freelancer' ? "border-emerald-500 shadow-emerald-500/10 shadow-lg bg-emerald-50/10" : "border-slate-200 bg-white")}>
                        <CardHeader>
                            <CardTitle className="text-lg text-slate-700 flex items-center gap-2">
                                <Users className="w-5 h-5 text-emerald-500" />
                                {t('scenarioFreelancer')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-800">
                                {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(rvResult.netMonthly)}
                                <span className="text-sm font-normal text-slate-400 ml-1">{t('perMonth')}</span>
                            </div>
                            <div className="mt-4 text-sm text-slate-500">
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span>{t('grossAnnual')}</span>
                                    <span className="font-medium">{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(rvResult.grossAnnual)}</span>
                                </div>
                                <div className="flex justify-between py-1 mt-1 text-red-500">
                                    <span>{t('taxes')}</span>
                                    <span>-{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(rvResult.ss + rvResult.irs)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Scenario C: Company */}
                    <Card className={cn("border-2 transition-all relative overflow-hidden", winner.id === 'company' ? "border-purple-500 shadow-purple-500/10 shadow-lg bg-purple-50/10" : "border-slate-200 bg-white")}>
                        {!user?.isPremium && (
                            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-4 text-center">
                                <Lock className="w-8 h-8 text-slate-400 mb-2" />
                                <Button size="sm" onClick={handleBuy} className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg">
                                    {t('upgradeToView')}
                                </Button>
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle className="text-lg text-slate-700 flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-purple-500" />
                                {t('scenarioCompany')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className={cn(!user?.isPremium && "blur-sm opacity-50")}>
                            <div className="text-3xl font-bold text-slate-800">
                                {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(uniResult.netMonthly)}
                                <span className="text-sm font-normal text-slate-400 ml-1">{t('perMonth')}</span>
                            </div>
                            <div className="mt-4 text-sm text-slate-500">
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span>{t('grossAnnual')}</span>
                                    <span className="font-medium">{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(uniResult.grossAnnual)}</span>
                                </div>
                                <div className="flex justify-between py-1 mt-1 text-red-500">
                                    <span>{t('taxes')}</span>
                                    <span>-{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(uniResult.ss + uniResult.irs)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Regime Switcher Chart */}
                    <div className="md:col-span-3 relative">
                        {!user?.isPremium && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-4 text-center border border-slate-200 rounded-lg">
                                <Lock className="w-8 h-8 text-slate-400 mb-2" />
                                <h3 className="font-semibold text-slate-800 mb-1">{t('premiumBadge')}</h3>
                                <p className="text-sm text-slate-500 mb-3 max-w-[200px]">{t('upsellDesc')}</p>
                                <Button size="sm" onClick={handleBuy} className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg">
                                    {t('upgradeToView')}
                                </Button>
                            </div>
                        )}
                        <div className={cn(!user?.isPremium && "opacity-20 blur-sm pointer-events-none")}>
                            <RegimeSwitcher
                                grossIncome={rvResult.grossAnnual}
                                currentExpenses={values.businessExpenses}
                                input={values}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
