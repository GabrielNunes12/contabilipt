'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
    const t = useTranslations('Header');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const handleValueChange = (nextLocale: string) => {
        router.replace(pathname, { locale: nextLocale });
    };

    return (
        <Select defaultValue={locale} onValueChange={handleValueChange}>
            <SelectTrigger className="w-[140px] h-8 bg-slate-800/50 border-slate-700 text-slate-300">
                <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5" />
                    <SelectValue placeholder={t('language')} />
                </div>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="pt">Português</SelectItem>
            </SelectContent>
        </Select>
    );
}
