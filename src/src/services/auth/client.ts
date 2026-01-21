
import { login, signup, signout } from "@/app/auth/actions";
import { AuthResponse } from "./types";

// Client-side Auth Adapter
// Implementation: Server Actions (Supabase abstracted)

export const authClient = {
    signIn: async (email: string, password: string): Promise<AuthResponse> => {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        return await login(formData);
    },

    signUp: async (email: string, password: string, fullName: string): Promise<AuthResponse> => {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('fullName', fullName);

        return await signup(formData);
    },

    signOut: async (): Promise<AuthResponse> => {
        const result = await signout();
        // Force a window reload or client-side redirect if needed, 
        // essentially we just want to ensure the UI updates
        // window.location.reload() - arguably handled by usage site or revalidatePath
        return result;
    }
}
