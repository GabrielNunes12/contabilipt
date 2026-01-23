
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { Loader2, AlertTriangle, CreditCard, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SubscriptionManagerProps {
    isPremium: boolean;
}

export function SubscriptionManager({ isPremium }: SubscriptionManagerProps) {
    const t = useTranslations('SubscriptionManager');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCancel = async () => {
        if (!confirm(t('confirmCancel'))) return;

        setLoading(true);
        try {
            const response = await fetch('/api/stripe/cancel', { method: 'POST' });
            if (response.ok) {
                alert(t('successCancel'));
                router.refresh();
            } else {
                alert(t('errorCancel'));
            }
        } catch (error) {
            console.error(error);
            alert(t('errorCancel'));
        } finally {
            setLoading(false);
        }
    };

    if (!isPremium) return null;

    return (
        <Card className="border-slate-200 shadow-sm mb-8">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                    {t('title')}
                </CardTitle>
                <CardDescription>{t('plan')}: <span className="font-medium text-emerald-600">{t('active')}</span></CardDescription>
            </CardHeader>
            <CardContent>
                <div className="bg-slate-50 p-4 rounded-lg flex items-start gap-3 text-sm text-slate-600">
                    <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                    <p>
                        {t('activeDesc')}
                        <span className="font-semibold text-slate-900">15/02/2026</span> {/* Placeholder for now, real date needs DB field */}
                    </p>
                </div>
            </CardContent>
            <CardFooter className="pt-2">
                <Button
                    variant="destructive"
                    onClick={handleCancel}
                    disabled={loading}
                    className="w-full sm:w-auto"
                >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertTriangle className="mr-2 h-4 w-4" />}
                    {t('cancelBtn')}
                </Button>
            </CardFooter>
        </Card>
    );
}
