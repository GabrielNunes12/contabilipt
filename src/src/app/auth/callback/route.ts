import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            console.log("Auth Code Exchange Successful. Session User:", data.user?.email);
            // Use redirect() which handles cookie merging better in newer Next.js versions
            return redirect(`${origin}${next}`)
        } else {
            console.error("Auth Code Exchange Error:", error);
        }
    }

    // return the user to an error page with instructions
    return redirect(`${origin}/auth/auth-code-error`)
}
