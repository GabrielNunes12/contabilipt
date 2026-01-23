
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export async function Footer() {
    const t = await getTranslations('Footer');

    return (
        <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-1 font-bold text-xl tracking-tight text-white">
                        Contabilí<span className="text-emerald-400">PT</span>
                    </div>

                    <nav className="flex items-center gap-6 text-sm font-medium">
                        <Link href="/privacy-policy" className="hover:text-white transition-colors">
                            {t('privacy')}
                        </Link>
                        <Link href="/refund-policy" className="hover:text-white transition-colors">
                            {t('refund')}
                        </Link>
                    </nav>

                    <div className="text-sm text-slate-500 text-right">
                        <div>{t('rights')}</div>
                        <div className="text-xs text-slate-600 mt-1">{t('disclaimer')}</div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
