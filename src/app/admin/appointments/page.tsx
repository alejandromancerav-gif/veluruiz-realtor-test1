'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppState } from '@/context/AppStateContext';

interface AppointmentRow {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  preferredDate: string;
  notes: string | null;
  status: string;
  createdAt: string;
  property: { id: string; title: string } | null;
}

interface Meta {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

const STATUS_BADGE: Record<string, string> = {
  pending:   'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  scheduled: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
};

function statusBadgeClass(status: string) {
  return STATUS_BADGE[status] ?? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-VE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

export default function AppointmentsPage() {
  const { language } = useAppState();

  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [meta, setMeta]                 = useState<Meta | null>(null);
  const [isLoading, setIsLoading]       = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [page, setPage]                 = useState(1);

  const fetchAppointments = async ({ pg = 1, reset = false }: { pg?: number; reset?: boolean } = {}) => {
    if (reset) setIsLoading(true);
    else setIsLoadingMore(true);
    setError(null);

    try {
      const res = await fetch(`/api/appointments?page=${pg}&pageSize=25`);
      if (res.status === 401 || res.status === 403) {
        setError(language === 'en' ? 'Access denied.' : 'Acceso denegado.');
        return;
      }
      if (!res.ok) throw new Error();
      const result = await res.json();

      if (reset) setAppointments(result.data);
      else setAppointments(prev => [...prev, ...result.data]);

      setMeta(result.meta);
      setPage(pg);
    } catch {
      setError(language === 'en' ? 'Error loading requests.' : 'Error al cargar solicitudes.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchAppointments({ pg: 1, reset: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 animate-pulse">
          {language === 'en' ? 'Loading requests...' : 'Cargando solicitudes...'}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-brand-navy-900 dark:text-white tracking-tight">
          {language === 'en' ? 'Visit Requests' : 'Solicitudes de Visita'}
        </h1>
        {meta && (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {meta.total} {language === 'en' ? 'total' : 'en total'}
          </span>
        )}
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-24 text-sm text-slate-400 dark:text-slate-500">
          {language === 'en' ? 'No visit requests yet.' : 'Aún no hay solicitudes de visita.'}
        </div>
      ) : (
        <div className="bg-white dark:bg-brand-navy-900 rounded-2xl border border-slate-200 dark:border-brand-navy-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-brand-navy-800 bg-slate-50 dark:bg-brand-navy-800/50">
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {language === 'en' ? 'Received' : 'Recibida'}
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {language === 'en' ? 'Client' : 'Cliente'}
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {language === 'en' ? 'Preferred Date' : 'Fecha Preferida'}
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {language === 'en' ? 'Property' : 'Propiedad'}
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {language === 'en' ? 'Notes' : 'Notas'}
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {language === 'en' ? 'Status' : 'Estado'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-brand-navy-800">
                {appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50 dark:hover:bg-brand-navy-800/30 transition-colors">
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {formatDate(appt.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-brand-navy-900 dark:text-white">{appt.clientName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{appt.clientEmail}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{appt.clientPhone}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {formatDate(appt.preferredDate)}
                    </td>
                    <td className="px-4 py-3">
                      {appt.property ? (
                        <Link
                          href={`/catalog/${appt.property.id}`}
                          className="text-brand-accent hover:underline text-xs font-medium"
                        >
                          {appt.property.title}
                        </Link>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        {appt.notes ?? '—'}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusBadgeClass(appt.status)}`}>
                        {appt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {meta?.hasMore && (
        <div className="flex justify-center">
          <button
            onClick={() => fetchAppointments({ pg: page + 1 })}
            disabled={isLoadingMore}
            className="px-6 py-3 rounded-xl font-bold text-sm border border-slate-200 dark:border-brand-navy-700 text-slate-600 dark:text-slate-300 hover:bg-brand-accent hover:border-brand-accent hover:text-white transition-all duration-300 disabled:opacity-50"
          >
            {isLoadingMore
              ? (language === 'en' ? 'Loading...' : 'Cargando...')
              : (language === 'en' ? 'Load more' : 'Cargar más')}
          </button>
        </div>
      )}
    </div>
  );
}
