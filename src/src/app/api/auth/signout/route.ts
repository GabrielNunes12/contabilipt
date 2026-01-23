import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function POST(request: Request) {
    const supabase = await createClient()

    // Check if we have a session first (optional, but good for debugging)
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        await supabase.auth.signOut()
    }

    return redirect('/')
}
