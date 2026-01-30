'use client';

import { LucideIcon, CalendarDays, AlertCircle, CheckCircle2 } from "lucide-react";

interface TaxEvent {
    title: string;
    date: string; // "DD-MM" format
    description: string;
    type: 'vat' | 'ss' | 'irs';
    month?: number; // 0-11 for specific filtering
}

import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';
import { X } from "lucide-react";

export function FiscalCalendar() {
    const t = useTranslations('Dashboard');
    const locale = useLocale();
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    // Helper to generate monthly events
    const generateMonthlyEvents = (title: string, description: string, day: string, type: 'ss' | 'irs'): TaxEvent[] => {
        return Array.from({ length: 12 }, (_, i) => ({
            title,
            date: `${day}-${String(i + 1).padStart(2, '0')}`,
            description,
            type,
            month: i
        }));
    };

    // Quarterly VAT Events
    const vatEvents: TaxEvent[] = [
        { title: t('eventVATPeriodicTitle'), date: "20-02", description: t('eventVATPeriodicDesc'), type: 'vat', month: 1 },
        { title: t('eventVATPeriodicTitle'), date: "20-05", description: t('eventVATPeriodicDesc'), type: 'vat', month: 4 },
        { title: t('eventVATPeriodicTitle'), date: "20-08", description: t('eventVATPeriodicDesc'), type: 'vat', month: 7 },
        { title: t('eventVATPeriodicTitle'), date: "20-11", description: t('eventVATPeriodicDesc'), type: 'vat', month: 10 },
    ];

    const ssEvents = generateMonthlyEvents(t('eventSSPaymentTitle'), t('eventSSPaymentDesc'), '20', 'ss');
    const irsEvents = generateMonthlyEvents(t('eventIRSRetentionTitle'), t('eventIRSRetentionDesc'), '20', 'irs');

    const ALL_EVENTS = [...vatEvents, ...ssEvents, ...irsEvents].sort((a, b) => {
        const [d1, m1] = a.date.split('-').map(Number);
        const [d2, m2] = b.date.split('-').map(Number);
        if (m1 !== m2) return m1 - m2;
        return d1 - d2;
    });

    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth(); // 0-indexed

    // Homepage Widget: Show next 3 upcoming events
    const upcomingEvents = ALL_EVENTS
        .filter(event => {
            const [day, month] = event.date.split('-').map(Number);
            const eventMonthIdx = month - 1;

            // If in current month and day hasn't passed OR if in future months
            if (eventMonthIdx === currentMonth) return day >= currentDay;
            if (eventMonthIdx > currentMonth) return true;
            // Also show next year's first events if end of year? (omitted for simplicity)
            return false;
        })
        .slice(0, 3) // Show top 3
        .map(event => {
            const [day, month] = event.date.split('-').map(Number);
            const dateObj = new Date(today.getFullYear(), month - 1, day);

            let status: 'upcoming' | 'urgent' | 'done' = 'upcoming';
            if (month - 1 === currentMonth && currentDay >= day - 3) status = 'urgent';

            return { ...event, fullDate: dateObj, status };
        });

    return (
        <>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-6">
                    <CalendarDays className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-lg font-semibold text-slate-800">{t('fiscalCalendarTitle')}</h3>
                </div>

                <div className="space-y-4">
                    {upcomingEvents.length > 0 ? upcomingEvents.map((event, idx) => (
                        <div key={idx} className={`flex items-start gap-4 p-3 rounded-lg border ${event.status === 'urgent' ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-100'}`}>
                            <div className={`mt-1 w-2 h-2 rounded-full ${event.type === 'vat' ? 'bg-purple-500' :
                                event.type === 'ss' ? 'bg-blue-500' : 'bg-emerald-500'
                                }`} />

                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-medium text-slate-900 text-sm">{event.title}</h4>
                                    <span className={`text-xs font-bold ${event.status === 'urgent' ? 'text-amber-600' : 'text-slate-500'}`}>
                                        {event.fullDate.toLocaleDateString(locale, { day: 'numeric', month: 'short' })}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">{event.description}</p>
                            </div>
                            {event.status === 'urgent' && <AlertCircle className="w-4 h-4 text-amber-500" />}
                        </div>
                    )) : (
                        <p className="text-sm text-slate-500 text-center py-4">{t('noEvents')}</p>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                    <button
                        onClick={() => setIsCalendarOpen(true)}
                        className="text-sm text-emerald-600 font-medium hover:text-emerald-700 hover:underline transition-all"
                    >
                        {t('viewFullCalendar')}
                    </button>
                </div>
            </div>

            {/* Full Calendar Modal */}
            {isCalendarOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                                    <CalendarDays className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">{t('fiscalCalendarTitle')} {today.getFullYear()}</h2>
                                    <p className="text-sm text-slate-500">{t('fiscalCalendarDesc')}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsCalendarOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-6 space-y-8">
                            {Array.from({ length: 12 }, (_, i) => {
                                const monthName = new Date(today.getFullYear(), i, 1).toLocaleString(locale, { month: 'long' });
                                const monthEvents = ALL_EVENTS.filter(e => {
                                    const [, m] = e.date.split('-').map(Number);
                                    return m - 1 === i;
                                });

                                if (monthEvents.length === 0) return null;

                                return (
                                    <div key={i} className="relative">
                                        <div className="sticky top-0 bg-white z-10 py-2 mb-2 border-b border-slate-100 flex items-center gap-2">
                                            <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">{monthName}</span>
                                            <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{t('eventsCount', { count: monthEvents.length })}</span>
                                        </div>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            {monthEvents.map((event, idx) => (
                                                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-emerald-100 hover:bg-emerald-50/10 transition-colors group">
                                                    <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${event.type === 'vat' ? 'bg-purple-500' : event.type === 'ss' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                                                    <div>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="font-medium text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">{event.title}</span>
                                                            <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded ml-2">{event.date.split('-')[0]}</span>
                                                        </div>
                                                        <p className="text-xs text-slate-500 leading-relaxed">{event.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
                            <button onClick={() => setIsCalendarOpen(false)} className="px-6 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors">
                                {t('closeCalendar')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
