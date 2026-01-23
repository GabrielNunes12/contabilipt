
import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/layout/Header';

export default async function PrivacyPolicyPage() {
    const t = await getTranslations('PrivacyPolicy');

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <main className="container mx-auto px-4 py-24 max-w-4xl">
                <article className="prose prose-slate lg:prose-lg mx-auto bg-white p-8 md:p-12 rounded-xl shadow-sm border border-slate-200">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t('title')}</h1>
                    <p className="text-sm text-slate-500 mb-8 pb-8 border-b border-slate-100">{t('lastUpdated')}</p>

                    <div className="space-y-8 text-slate-600 leading-relaxed">
                        <p className="text-lg">{t('intro')}</p>

                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-3">{t('section1Title')}</h2>
                            <p>{t('section1Content')}</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-3">{t('section2Title')}</h2>
                            <p>{t('section2Content')}</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-3">{t('section3Title')}</h2>
                            <p>{t('section3Content')}</p>
                        </section>
                    </div>
                </article>
            </main>
        </div>
    );
}
