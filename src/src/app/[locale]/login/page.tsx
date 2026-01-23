import { Suspense } from 'react'
import { AuthForm } from '@/components/auth/AuthForm'
import { getTranslations } from 'next-intl/server';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default async function LoginPage() {
    const t = await getTranslations('LoginHero');

    return (
        <div className="flex min-h-screen">
            {/* Left Side - Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-slate-50">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="mb-10">
                        <Link href="/" className="flex items-center gap-1 text-slate-900 font-bold text-2xl tracking-tight">
                            Contabilí<span className="text-emerald-500">PT</span>
                        </Link>
                    </div>

                    <Suspense fallback={<div>Loading...</div>}>
                        <AuthForm />
                    </Suspense>
                </div>
            </div>

            {/* Right Side - Marketing (Hidden on Mobile) */}
            <div className="hidden lg:flex flex-1 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 blur-[100px] rounded-full opacity-50 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full opacity-30 pointer-events-none" />

                <div className="relative z-10 max-w-lg text-white">
                    <h1 className="text-4xl font-bold tracking-tight mb-6">
                        {t.rich('title', {
                            highlight: (chunks) => <span className="text-emerald-400">{chunks}</span>
                        })}
                    </h1>
                    <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                        {t('subtitle')}
                    </p>

                    <ul className="space-y-4">
                        {[t('feature1'), t('feature2'), t('feature3')].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-slate-200">
                                <CheckCircle className="h-5 w-5 text-emerald-400" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
