import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
});

// We need a Service Role client to bypass RLS and update the user's profile
// (Since the webhook is a system event, not a user action)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
    const body = await request.text();
    const headersList = await headers();
    const sig = headersList.get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        if (!endpointSecret) throw new Error('Webhook secret not found.');
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session;
            console.log('Payment checkout session completed:', session.id);

            const userId = session.client_reference_id;
            const customerEmail = session.customer_details?.email;

            if (userId) {
                // Update user profile
                const { error } = await supabaseAdmin
                    .from('profiles')
                    .update({ is_premium: true })
                    .eq('id', userId);

                if (error) {
                    console.error('Error updating profile:', error);
                    return NextResponse.json({ error: 'Error updating profile' }, { status: 500 });
                }
                console.log(`User ${userId} upgraded to premium.`);
            } else if (customerEmail) {
                // Fallback: Try to find user by email if client_reference_id is missing
                const { data: user } = await supabaseAdmin
                    .from('profiles')
                    .select('id')
                    .eq('email', customerEmail)
                    .single();

                if (user) {
                    await supabaseAdmin
                        .from('profiles')
                        .update({ is_premium: true })
                        .eq('id', user.id);
                    console.log(`User ${user.id} (via email) upgraded to premium.`);
                }
            }
            break;

        case 'customer.subscription.deleted':
            const sub = event.data.object as Stripe.Subscription;
            console.log('Subscription canceled:', sub.id);
            // We need to find the user by Stripe Customer ID or email if stored in metadata
            // For this simple implementation, we might need to rely on email again if not storing customer_id
            // NOTE: Real implementation should store stripe_customer_id in profile.

            // Attempt to find user by looking up customer first? No, we don't have db access to map customer->user easily without column.
            // We can retrieve customer details from Stripe to get email.
            const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
            const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;

            if (customer.email) {
                const { data: user } = await supabaseAdmin
                    .from('profiles')
                    .select('id')
                    .eq('email', customer.email)
                    .single();

                if (user) {
                    await supabaseAdmin
                        .from('profiles')
                        .update({ is_premium: false })
                        .eq('id', user.id);
                    console.log(`User ${user.id} subscription canceled. Premium removed.`);
                }
            }
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
