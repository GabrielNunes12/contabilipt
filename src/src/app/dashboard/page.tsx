
import { getCurrentUser } from '@/services/auth/server';
import { getUserSimulations } from '@/services/simulation/server';
import { redirect } from 'next/navigation';
import { RateHistoryChart } from '@/components/dashboard/RateHistoryChart';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { FiscalCalendar } from '@/components/dashboard/FiscalCalendar';
import { TaxBracketAlert } from '@/components/dashboard/TaxBracketAlert';
import { ExpenseOptimizationWidget } from '@/components/dashboard/ExpenseOptimizationWidget';

export default async function DashboardPage() {
    const user = await getCurrentUser();

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
                    <h1 className="text-2xl font-bold mb-4">Funcionalidade Premium 💎</h1>
                    <p className="mb-6 text-slate-600">O Dashboard Avançado é exclusivo para membros Premium.</p>
                    <a href="/?upgrade=true" className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium">
                        Atualizar para Premium
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
                    <h1 className="text-3xl font-bold text-slate-900">Olá, {user.fullName || 'Contractor'} 👋</h1>
                    <p className="text-slate-500">Aqui está a análise da tua evolução financeira.</p>
                </div>

                <DashboardStats data={simulations} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Chart Column */}
                    <div className="lg:col-span-2">
                        <RateHistoryChart data={simulations} />

                        {/* Tax Bracket Alert */}
                        <div className="mt-8">
                            <TaxBracketAlert data={simulations} />
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="space-y-8">
                        <FiscalCalendar />

                        {/* Expense Optimization */}
                        <ExpenseOptimizationWidget data={simulations} />
                    </div>
                </div>
            </div>
        </main>
    );
}
