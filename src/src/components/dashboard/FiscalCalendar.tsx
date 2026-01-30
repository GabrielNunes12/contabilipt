'use client';

import { LucideIcon, CalendarDays, AlertCircle, CheckCircle2 } from "lucide-react";

interface TaxEvent {
    title: string;
    date: string; // "DD-MM" format for recurring
    description: string;
    type: 'vat' | 'ss' | 'irs';
}

// Moved inside component to use translations

import { useTranslations } from 'next-intl';

export function FiscalCalendar() {
    const t = useTranslations('Dashboard');

    const TAX_EVENTS: TaxEvent[] = [
        {
            title: t('eventSSPaymentTitle'),
            date: "20-current",
            description: t('eventSSPaymentDesc'),
            type: 'ss'
        },
        {
            title: t('eventVATPeriodicTitle'),
            date: "20-dummy",
            description: t('eventVATPeriodicDesc'),
            type: 'vat'
        },
        {
            title: t('eventVATPaymentTitle'),
            date: "25-dummy",
            description: t('eventVATPaymentDesc'),
            type: 'vat'
        },
        {
            title: t('eventIRSRetentionTitle'),
            date: "20-current",
            description: t('eventIRSRetentionDesc'),
            type: 'irs'
        }
    ];
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth(); // 0-indexed

    // Simple logic to determine if it's a VAT month (Quarterly: Feb, May, Aug, Nov for submission of prev quarter)
    // Actually, in Portugal quarterly VAT is due:
    // Q1 (Jan-Mar): Declaration by May 20, Payment by May 25
    // But this is just a quick implementation
    const isVatMonth = [1, 4, 7, 10].includes(currentMonth);

    const upcomingEvents = TAX_EVENTS
        .filter(event => {
            if (event.type === 'vat' && !isVatMonth) return false;
            return true;
        })
        .map(event => {
            let day = parseInt(event.date.split('-')[0]);
            let date = new Date(today.getFullYear(), currentMonth, day);

            // If date passed, show for next month? For now, just mark as done or urgent
            let status: 'upcoming' | 'urgent' | 'done' = 'upcoming';
            if (currentDay > day) status = 'done';
            if (currentDay >= day - 3 && currentDay <= day) status = 'urgent';

            return { ...event, fullDate: date, status };
        })
        .sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6">
                <CalendarDays className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-semibold text-slate-800">{t('fiscalCalendarTitle')}</h3>
            </div>

            <div className="space-y-4">
                {upcomingEvents.map((event, idx) => (
                    <div key={idx} className={`flex items-start gap-4 p-3 rounded-lg border ${event.status === 'urgent' ? 'bg-amber-50 border-amber-200' :
                        event.status === 'done' ? 'bg-slate-50 border-slate-100 opacity-60' :
                            'bg-white border-slate-100'
                        }`}>
                        <div className={`mt-1 w-2 h-2 rounded-full ${event.type === 'vat' ? 'bg-purple-500' :
                            event.type === 'ss' ? 'bg-blue-500' : 'bg-emerald-500'
                            }`} />

                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className="font-medium text-slate-900 text-sm">{event.title}</h4>
                                <span className={`text-xs font-bold ${event.status === 'urgent' ? 'text-amber-600' : 'text-slate-500'
                                    }`}>
                                    {event.fullDate.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{event.description}</p>
                        </div>

                        {event.status === 'urgent' && <AlertCircle className="w-4 h-4 text-amber-500" />}
                        {event.status === 'done' && <CheckCircle2 className="w-4 h-4 text-slate-400" />}
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">
                    {t('viewFullCalendar')}
                </button>
            </div>
        </div>
    );
}
