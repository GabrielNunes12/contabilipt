import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

export async function Header() {
    // Try to get user (will fail on localhost for now, but good for structure)
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const isDev = process.env.NODE_ENV === 'development'

    return (
        <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-950/50 backdrop-blur-md supports-[backdrop-filter]:bg-slate-950/20">
            <div className="container mx-auto px-4 flex h-16 items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <Link href="/" className="flex items-center gap-1 text-white">
                        Contabilí<span className="text-emerald-400">PT</span>
                    </Link>
                    {isDev && <span className="text-[10px] font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">DEV</span>}
                </div>

                <nav className="flex items-center gap-3">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-300 hidden md:inline-block">{user.email}</span>
                            <form action="/auth/signout" method="post">
                                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10">Sair</Button>
                            </form>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link href="/login">
                                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10">
                                    Entrar
                                </Button>
                            </Link>
                            <Link href="/login?view=sign_up">
                                <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 font-medium">
                                    Começar Grátis
                                </Button>
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    )
}
