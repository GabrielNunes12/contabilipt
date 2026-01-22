'use server'

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/services/auth/server';
import { IRSInput, IRSResult, calculateIRS } from '@/lib/irs-calculator';

export async function saveIRSSimulation(data: IRSInput) {
    const user = await getCurrentUser();

    if (!user) return { success: false, error: "Unauthorized" };

    const result: IRSResult = calculateIRS(data);
    const supabase = await createClient();

    const { error } = await supabase
        .from('irs_simulations')
        .insert({
            user_id: user.id,
            annual_gross_income: data.annualGrossIncome,
            income_type: data.incomeType,
            status: data.status,
            dependents: data.dependents,
            expenses: data.expenses,
            withholding_tax: data.withholdingTax,
            result_net_tax: result.netTax,
            result_amount_to_pay: result.amountToPay
        });

    if (error) {
        console.error("Database Error:", error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function getIRSSimulations() {
    const user = await getCurrentUser();
    if (!user) return [];

    const supabase = await createClient();

    const { data } = await supabase
        .from('irs_simulations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return data || [];
}
