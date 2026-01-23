import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getCurrentUser } from '@/services/auth/server'
import { getTranslations } from 'next-intl/server';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';

export async function Header() {
    const user = await getCurrentUser()
    const isDev = process.env.NODE_ENV === 'development'
    const t = await getTranslations('Header');

    return (
        <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-950/50 backdrop-blur-md supports-[backdrop-filter]:bg-slate-950/20">
            <div className="container mx-auto px-4 flex h-16 items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <Link href="/" className="flex items-center gap-1 text-white">
                        Contabilí<span className="text-emerald-400">PT</span>
                    </Link>
                    {isDev && <span className="text-[10px] font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">{t('dev')}</span>}
                </div>

                <div className="flex items-center gap-4">
                    {/* Add Language Switcher */}
                    <div className="hidden md:block">
                        <LanguageSwitcher />
                    </div>

                    <nav className="flex items-center gap-3">
                        {user ? (
                            <div className="flex items-center gap-4">
                                {/* Premium Dashboard Link */}
                                {user.isPremium && (
                                    <Link
                                        href="/dashboard"
                                        className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                                    >
                                        {t('dashboard')}
                                    </Link>
                                )}

                                <span className="text-sm text-slate-300 hidden md:inline-block">{user.email}</span>
                                <form action="/auth/signout" method="post">
                                    <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10">{t('logout')}</Button>
                                </form>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10">
                                        {t('login')}
                                    </Button>
                                </Link>
                                <Link href="/login?view=sign_up">
                                    <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 font-medium">
                                        {t('startFree')}
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </nav>

                    {/* Mobile Language Switcher (optional, if hidden above) */}
                    <div className="md:hidden">
                        <LanguageSwitcher />
                    </div>
                </div>
            </div>
        </header>
    )
}
