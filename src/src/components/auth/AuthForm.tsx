'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { authClient } from '@/services/auth/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function AuthForm() {
    const t = useTranslations('Auth');
    const searchParams = useSearchParams();
    const router = useRouter();
    const isRegisterView = searchParams.get('view') === 'sign_up';

    const [isRegister, setIsRegister] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsRegister(isRegisterView);
    }, [isRegisterView]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            if (isRegister) {
                const response = await authClient.signUp(email, password, fullName);
                if (!response.success) {
                    setError(response.error || t('errorRegister'));
                } else {
                    setMessage(response.message || t('successRegister'));
                    // Optional: clear form or redirect
                }
            } else {
                const response = await authClient.signIn(email, password);
                if (!response.success) {
                    setError(response.error || t('errorLogin'));
                } else {
                    // Force hard refresh to update server components (Header, etc.)
                    // Using window.location.href ensures cookies are sent and server components re-render with fresh auth state
                    window.location.href = '/';
                }
            }
        } catch (err) {
            setError(t('errorGeneric'));
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsRegister(!isRegister);
        setMessage(null);
        setError(null);
    };

    return (
        <div className="w-full">
            <div className="space-y-2 mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    {isRegister ? t('titleRegister') : t('titleLogin')}
                </h1>
                <p className="text-slate-500">
                    {isRegister ? t('descRegister') : t('descLogin')}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {isRegister && (
                    <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-slate-700">{t('labelName')}</Label>
                        <Input
                            id="fullName"
                            type="text"
                            placeholder={t('placeholderName')}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required={isRegister}
                            className="bg-white border-slate-200 focus-visible:ring-emerald-500"
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700">{t('labelEmail')}</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="exemplo@tech.pt"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-white border-slate-200 focus-visible:ring-emerald-500"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-slate-700">{t('labelPassword')}</Label>
                        {!isRegister && (
                            <a href="#" className="text-xs text-emerald-600 hover:text-emerald-500 font-medium">Esqueceu-se?</a>
                        )}
                    </div>

                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="bg-white border-slate-200 focus-visible:ring-emerald-500"
                    />
                </div>

                {error && (
                    <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md border border-red-100 flex items-center gap-2">
                        <span className="block w-1.5 h-1.5 rounded-full bg-red-500" />
                        {error}
                    </div>
                )}

                {message && (
                    <div className="text-sm text-emerald-600 bg-emerald-50 p-3 rounded-md border border-emerald-100 flex items-center gap-2">
                        <span className="block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {message}
                    </div>
                )}

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 h-10 font-semibold text-white shadow-sm" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isRegister ? t('btnRegister') : t('btnLogin')}
                </Button>
            </form>

            <div className="mt-6 text-center text-sm">
                <span className="text-slate-500">
                    {isRegister ? t('switchLogin') : t('switchRegister')}{" "}
                </span>
                <button onClick={toggleMode} className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors">
                    {isRegister ? t('login') : t('register')}
                </button>
            </div>
        </div>
    );
}
