import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getCurrentUser } from '@/services/auth/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover', // Latest stable API version
});

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();

        // In Dev Mode, we might not have a real user, but for checkout we need one?
        // Actually, for "Unlock", we just need to return a session URL.
        // If we want to associate it with a Supabase User, we pass client_reference_id.

        // If dev mode bypass is active and no user, we can't really "attach" it to a user.
        // But let's assume the flow starts from a logged-in context (or our dev mock).

        const priceId = process.env.STRIPE_PRICE_ID;

        if (!priceId) {
            return NextResponse.json({ error: "Stripe Price ID not configured" }, { status: 500 });
        }

        const origin = request.headers.get('origin') || 'http://localhost:3000';

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${origin}/?payment_success=true`,
            cancel_url: `${origin}/?payment_canceled=true`,
            // If we have a user ID, pass it. If it's the dev mock, it won't exist in Stripe/Supabase sync, but that's fine for dev.
            client_reference_id: user?.id,
            customer_email: user?.email,
        });

        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (error: any) {
        console.error("Stripe Checkout Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
