
'use server'

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/services/auth/server';

import { CalculatorInput } from '@/lib/types';

export async function saveSimulation(data: CalculatorInput) {
    const user = await getCurrentUser();

    if (!user) return { success: false, error: "Unauthorized" };

    const supabase = await createClient();

    const { error } = await supabase
        .from('simulations')
        .insert({
            user_id: user.id,
            daily_rate: data.dailyRate,
            days_per_month: data.workDaysPerMonth,
            months_per_year: data.monthsPerYear,
            expenses: data.businessExpenses,
            is_nhr: data.isNHR,
            municipality_benefit: data.municipalityBenefit,
            include_meal_allowance: data.includeMealAllowance,
            custom_accountant_cost: data.customAccountantCost,
            employee_gross_salary: data.employeeGrossSalary,
            employee_meal_allowance: data.employeeMealAllowance,
            regime: data.regime, // Saves specific regime (freelancer, company, employee)
            title: `Simulação ${new Date().toLocaleDateString('pt-PT')}`
        });

    if (error) {
        console.error("Database Error:", error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function getUserSimulations() {
    const user = await getCurrentUser();

    if (!user) return [];

    const supabase = await createClient();

    const { data } = await supabase
        .from('simulations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

    return data || [];
}
