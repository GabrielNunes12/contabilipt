export interface AuthUser {
    id: string;
    email?: string;
    isPremium: boolean;
    fullName?: string;
}

export interface AuthResponse {
    success: boolean;
    error?: string;
    message?: string;
}
