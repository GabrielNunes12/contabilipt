
import { AuthForm } from '@/components/auth/AuthForm'

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-sm">
                <h1 className="text-center text-2xl font-bold mb-6 text-slate-900">ContabiliPT</h1>
                <AuthForm />
            </div>
        </div>
    )
}
