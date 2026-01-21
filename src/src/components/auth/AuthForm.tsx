'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { authClient } from '@/services/auth/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function AuthForm() {
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
                    setError(response.error || "Erro no registo.");
                } else {
                    setMessage(response.message || "Verifica o teu email!");
                    // Optional: clear form or redirect
                }
            } else {
                const response = await authClient.signIn(email, password);
                if (!response.success) {
                    setError(response.error || "Erro no login.");
                } else {
                    // Force hard refresh to update server components (Header, etc.)
                    // Using window.location.href ensures cookies are sent and server components re-render with fresh auth state
                    window.location.href = '/';
                }
            }
        } catch (err) {
            setError("Ocorreu um erro inesperado.");
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
        <Card className="w-full max-w-sm mx-auto shadow-lg">
            <CardHeader>
                <CardTitle>{isRegister ? 'Criar Conta' : 'Entrar'}</CardTitle>
                <CardDescription>
                    {isRegister
                        ? 'Começa a otimizar os teus impostos hoje.'
                        : 'Bem-vindo de volta.'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {isRegister && (
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Nome Completo</Label>
                            <Input
                                id="fullName"
                                type="text"
                                placeholder="João Silva"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required={isRegister}
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="exemplo@tech.pt"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Palavra-passe</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    {error && (
                        <div className="text-sm text-red-500 bg-red-50 p-2 rounded border border-red-200">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="text-sm text-emerald-600 bg-emerald-50 p-2 rounded border border-emerald-200">
                            {message}
                        </div>
                    )}

                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 font-medium" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isRegister ? 'Criar Conta Grátis' : 'Entrar'}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex justify-center border-t p-4 bg-slate-50 rounded-b-lg">
                <Button variant="link" size="sm" onClick={toggleMode} className="text-slate-500">
                    {isRegister ? 'Já tens conta? Entrar' : 'Ainda não tens conta? Registar'}
                </Button>
            </CardFooter>
        </Card>
    );
}
