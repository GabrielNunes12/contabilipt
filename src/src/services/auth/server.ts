
import { createClient } from "@/lib/supabase/server";
import { AuthUser } from "./types";

/**
 * Server-side Auth Adapter
 * Implementation: Supabase
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
    try {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error && !error.message.includes("Auth session missing")) {
            console.error("Debug - getCurrentUser Error:", error.message, error.status);
        }

        if (!user) return null;

        // Fetch Profile for Premium Status
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_premium, full_name')
            .eq('id', user.id)
            .single();

        return {
            id: user.id,
            email: user.email,
            isPremium: profile?.is_premium || false,
            fullName: profile?.full_name
        };
    } catch (error) {
        console.error("Auth Adapter Error:", error);
        return null;
    }
}
