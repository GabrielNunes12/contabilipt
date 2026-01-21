'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    // We should not redirect client-side; revalidate and return result
    // But for this specific implementation we will return structured data 
    // so the client service can handle it exactly as before.

    if (error) {
        return { success: false, error: error.message }
    }

    // Refresh caching
    revalidatePath('/', 'layout')

    return { success: true, message: 'Login efetuado com sucesso!' }
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    // We need the origin for the redirect URL
    const origin = (await headers()).get('origin')

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string

    const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
            emailRedirectTo: `${origin}/auth/callback`,
        },
    })

    if (error) {
        return { success: false, error: error.message }
    }

    if (data.user && data.user.identities && data.user.identities.length === 0) {
        return {
            success: false,
            error: "Este email já está registado."
        }
    }

    // No revalidation needed immediately as user needs to confirm email
    return {
        success: true,
        message: 'Registo efetuado! Verifica o teu email para confirmar a conta.'
    }
}

export async function signout() {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath('/', 'layout')
    return { success: true }
}
