
'use server'

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/services/auth/server';

export async function saveSimulation(data: {
    dailyRate: number,
    workDaysPerMonth: number,
    monthsPerYear: number,
    businessExpenses: number
}) {
    const user = await getCurrentUser();

    // Dev Mode Bypass: If no user, just pretend we saved it (or use a mock ID if needed later)
    /*
    if (!user && process.env.NODE_ENV === 'development') {
        console.log("Dev Mode: Bypassing saveSimulation auth check (Mock Save)");
        return { success: true };
    }
    */

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
            title: `Simulação ${new Date().toLocaleDateString('pt-PT')}`
        });

    if (error) {
        console.error("Database Error:", error);
        return { success: false, error: error.message };
    }

    return { success: true };
}
