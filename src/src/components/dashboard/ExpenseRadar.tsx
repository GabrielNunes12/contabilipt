'use client';

import { useState } from 'react';
import { Target, Monitor, ChevronRight, ShoppingCart } from "lucide-react";
import { SavedSimulation } from "@/services/simulation/types";
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { calculateHardwareCost } from "@/lib/calculator";

interface ExpenseRadarProps {
    data: SavedSimulation[];
}

export function ExpenseRadar({ data }: ExpenseRadarProps) {
    const t = useTranslations('Dashboard');
    const [simPrice, setSimPrice] = useState<number>(1000);

    // Default values if no data
    const current = data && data.length > 0 ? data[data.length - 1] : { expenses: 0 };
    const currentExpenses = current.expenses || 0;

    // Gamification: "IT Equipment Ceiling". 
    // Usually small assets < 1000 can be fully deducted.
    // Large assets depreciated.
    // Let's set a "Target Deduction" of 2000€ for demo.
    const targetDeduction = 2000;
    const remaining = Math.max(0, targetDeduction - currentExpenses);
    const progress = Math.min(100, (currentExpenses / targetDeduction) * 100);

    // Hardware Sim Calculation
    const hardware = calculateHardwareCost(simPrice);

    return (
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-500" />
                    {t('expenseRadarTitle')}
                </CardTitle>
                <p className="text-sm text-slate-500">{t('expenseRadarDesc')}</p>
            </CardHeader>
            <CardContent>
                {/* 1. Deductibility Tracker */}
                <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600">{t('itEquipmentLimit')}</span>
                        <span className="font-bold text-slate-900">{remaining}€ {t('remaining')}</span>
                    </div>
                    <Progress value={progress} className="h-2 bg-slate-100" />
                    <p className="text-xs text-slate-400 mt-2">
                        {t('deductibilityTip', { amount: 2000 })}
                    </p>
                </div>

                {/* 2. Hardware Simulator */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <h4 className="font-semibold text-slate-800 text-sm mb-3 flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-slate-500" />
                        {t('simulatorTitle')}
                    </h4>

                    <div className="flex gap-2 mb-4">
                        <div className="relative flex-1">
                            <Input
                                type="number"
                                value={simPrice}
                                onChange={(e) => setSimPrice(Number(e.target.value))}
                                className="bg-white border-slate-200"
                            />
                            <span className="absolute right-3 top-2.5 text-slate-400 text-sm">€</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="p-3 bg-white rounded-lg border border-slate-100">
                            <span className="block text-xs text-slate-400 mb-1">{t('individualCost')}</span>
                            <span className="font-bold text-slate-600 line-through decoration-red-400">
                                {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(hardware.individualCost)}
                            </span>
                        </div>
                        <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                            <span className="block text-xs text-indigo-500 mb-1">{t('companyCost')}</span>
                            <span className="font-bold text-indigo-700 text-lg">
                                {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(hardware.companyRealCost)}
                            </span>
                        </div>
                    </div>

                    <div className="mt-3 text-center">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                            {t('youSave')} {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(hardware.totalSavings)}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
