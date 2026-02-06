
import { getCurrentUser } from '@/services/auth/server';
import { getUserSimulations } from '@/services/simulation/server';
import { redirect } from 'next/navigation';
import { RateHistoryChart } from '@/components/dashboard/RateHistoryChart';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { FiscalCalendar } from '@/components/dashboard/FiscalCalendar';
import { TaxBracketAlert } from '@/components/dashboard/TaxBracketAlert';
import { ExpenseOptimizationWidget } from '@/components/dashboard/ExpenseOptimizationWidget';
import { SubscriptionManager } from '@/components/dashboard/SubscriptionManager';
import { SafeToSpendWidget } from '@/components/dashboard/SafeToSpendWidget';
import { ExpenseRadar } from '@/components/dashboard/ExpenseRadar';
import { getTranslations } from 'next-intl/server';

export default async function DashboardPage() {
    const user = await getCurrentUser();
    const t = await getTranslations('Dashboard');

    // 1. Auth Protection
    if (!user) {
        redirect('/');
    }

    // 2. Premium Protection
    if (!user.isPremium) {
        // Option A: Redirect to home or pricing
        //redirect('/?upgrade=true');

        // Option B: Show a "Locked" Dashboard UI (Better for conversion)

        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <h1 className="text-2xl font-bold mb-4">{t('premiumTitle')}</h1>
                    <p className="mb-6 text-slate-600">{t('premiumDesc')}</p>
                    <a href="/?upgrade=true" className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium">
                        {t('premiumBtn')}
                    </a>
                </div>
            </div>
        )

    }

    const simulations = await getUserSimulations();

    return (
        <main className="min-h-screen bg-slate-50 pt-32 pb-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">{t('welcome', { name: user.fullName || 'Contractor' })}</h1>
                    <p className="text-slate-500">{t('welcomeDesc')}</p>
                </div>

                <DashboardStats data={simulations} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Chart Column (2/3 width) */}
                    <div className="lg:col-span-2 space-y-8">
                        <RateHistoryChart data={simulations} />

                        {/* Premium Widgets Grid - Side by Side below chart */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <SafeToSpendWidget data={simulations} />
                            <ExpenseRadar data={simulations} />
                        </div>

                        {/* Tax Bracket Alert */}
                        <TaxBracketAlert data={simulations} />
                    </div>

                    {/* Sidebar Column (1/3 width) */}
                    <div className="space-y-8">
                        <SubscriptionManager isPremium={user.isPremium} />
                        <FiscalCalendar />

                        {/* Keep the general advice widget here as a secondary tip */}
                        <ExpenseOptimizationWidget data={simulations} />
                    </div>
                </div>
            </div>
        </main>
    );
}
