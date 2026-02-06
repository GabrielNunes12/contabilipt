'use client';

import * as React from 'react';
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

    const [isOpen, setIsOpen] = React.useState(false);

    // Generate Full Year Events (Simulated)
    const fullYearEvents: (Omit<TaxEvent, 'date'> & { date: Date })[] = [];
    for (let m = 0; m < 12; m++) {
        // SS: 20th of every month
        fullYearEvents.push({
            date: new Date(today.getFullYear(), m, 20),
            title: t('eventSSPaymentTitle'),
            description: t('eventSSPaymentDesc'),
            type: 'ss'
        });
        // IRS Retention: 20th of every month
        fullYearEvents.push({
            date: new Date(today.getFullYear(), m, 20),
            title: t('eventIRSRetentionTitle'),
            description: t('eventIRSRetentionDesc'),
            type: 'irs'
        });
        // VAT: Quarterly (May, Aug, Nov, Feb)
        if ([1, 4, 7, 10].includes(m)) {
            fullYearEvents.push({
                date: new Date(today.getFullYear(), m, 20), // Declaration
                title: t('eventVATPeriodicTitle'),
                description: t('eventVATPeriodicDesc'),
                type: 'vat'
            });
            fullYearEvents.push({
                date: new Date(today.getFullYear(), m, 25), // Payment
                title: t('eventVATPaymentTitle'),
                description: t('eventVATPaymentDesc'),
                type: 'vat'
            });
        }
    }
    fullYearEvents.sort((a, b) => a.date.getTime() - b.date.getTime());


    return (
        <>
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
                    <button
                        onClick={() => setIsOpen(true)}
                        className="text-sm text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
                    >
                        {t('viewFullCalendar')}
                    </button>
                </div>
            </div>

            {/* Full Calendar Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">{t('fiscalCalendarTitle')} {today.getFullYear()}</h3>
                                <p className="text-slate-500 text-sm">{t('fiscalCalendarDesc')}</p>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                                X
                            </button>
                        </div>
                        <div className="overflow-y-auto p-6 space-y-8">
                            {/* Group by Month */}
                            {Array.from({ length: 12 }).map((_, monthIdx) => {
                                const montEvents = fullYearEvents.filter(e => e.date.getMonth() === monthIdx);
                                if (montEvents.length === 0) return null;

                                return (
                                    <div key={monthIdx}>
                                        <h4 className="font-bold text-slate-800 mb-3 sticky top-0 bg-white py-2">
                                            {new Date(2024, monthIdx, 1).toLocaleDateString('pt-PT', { month: 'long' })}
                                        </h4>
                                        <div className="space-y-3">
                                            {montEvents.map((ev, i) => (
                                                <div key={i} className="flex gap-4 p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                                                    <div className="flex flex-col items-center justify-center min-w-[50px] bg-slate-50 rounded p-2 text-center">
                                                        <span className="text-xs text-slate-500 uppercase">{ev.date.toLocaleDateString('pt-PT', { month: 'short' })}</span>
                                                        <span className="text-lg font-bold text-slate-900">{ev.date.getDate()}</span>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-800">{ev.title}</div>
                                                        <div className="text-xs text-slate-500 uppercase tracking-wide flex items-center gap-2 mt-1">
                                                            <span className={`w-2 h-2 rounded-full ${ev.type === 'vat' ? 'bg-purple-500' : ev.type === 'ss' ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
                                                            {ev.type}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
                            <button onClick={() => setIsOpen(false)} className="px-6 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-100 transition-colors">
                                {t('closeCalendar')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
