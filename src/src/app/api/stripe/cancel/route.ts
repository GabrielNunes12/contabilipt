
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { getCurrentUser } from '@/services/auth/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
});

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // In a real app, we would store the customer_id or subscription_id in the profiles table.
        // Since this is a specialized agent demo, we will try to find the customer by email.
        const users = await stripe.customers.list({ email: user.email, limit: 1 });

        if (users.data.length === 0) {
            return NextResponse.json({ error: "Stripe customer not found" }, { status: 404 });
        }

        const customer = users.data[0];
        const subscriptions = await stripe.subscriptions.list({ customer: customer.id, status: 'active' });

        if (subscriptions.data.length === 0) {
            return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
        }

        // We cancel the first active subscription found (assuming one per user for now)
        const subscriptionId = subscriptions.data[0].id;

        // Immediate cancellation for testing/demo purposes
        await stripe.subscriptions.cancel(subscriptionId);

        // Directly update the database to reflect the change immediately
        // (bypassing reliance on webhooks which may not be configured for localhost)
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        await supabaseAdmin
            .from('profiles')
            .update({ is_premium: false })
            .eq('id', user.id);

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Cancellation Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
