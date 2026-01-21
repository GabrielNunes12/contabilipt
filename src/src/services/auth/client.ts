
import { createClient } from "@/lib/supabase/client";
import { AuthResponse } from "./types";

// Client-side Auth Adapter
// Implementation: Supabase

export const authClient = {
    signIn: async (email: string, password: string): Promise<AuthResponse> => {
        const supabase = createClient();

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return {
                success: false,
                error: error.message
            };
        }

        return {
            success: true,
            message: 'Login efetuado com sucesso!'
        };
    },

    signUp: async (email: string, password: string, fullName: string): Promise<AuthResponse> => {
        const supabase = createClient();

        const { error, data } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        });

        if (error) {
            return {
                success: false,
                error: error.message
            };
        }

        if (data.user && data.user.identities && data.user.identities.length === 0) {
            return {
                success: false,
                error: "Este email já está registado."
            };
        }

        return {
            success: true,
            message: 'Registo efetuado! Verifica o teu email para confirmar a conta.'
        };
    },

    signOut: async (): Promise<AuthResponse> => {
        const supabase = createClient();
        const { error } = await supabase.auth.signOut();
        if (error) return { success: false, error: error.message };
        return { success: true };
    }
}
