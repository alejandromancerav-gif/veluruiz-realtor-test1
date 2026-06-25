'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppState } from '@/context/AppStateContext';
import { PropertyApiRecord } from '@/types/property.types';
import AddPropertyModal from '@/components/AddPropertyModal';

interface Meta {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

interface Stats {
  active: number;
  inactive: number;
  total: number;
}

const STATUS_BADGE: Record<string, string> = {
  AVAILABLE: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  SOLD:      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  RENTED:    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  PENDING:   'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
};

function statusBadgeClass(status: string) {
  return STATUS_BADGE[status] ?? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
}

export default function AdminPropertiesPage() {
  const { language } = useAppState();

  const [properties, setProperties]       = useState<PropertyApiRecord[]>([]);
  const [meta, setMeta]                   = useState<Meta | null>(null);
  const [stats, setStats]                 = useState<Stats | null>(null);
  const [isLoading, setIsLoading]         = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError]                 = useState<string | null>(null);
  const [actionError, setActionError]     = useState<string | null>(null);
  const [page, setPage]                   = useState(1);
  const [isTogglingId, setIsTogglingId]   = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [editProperty, setEditProperty]   = useState<PropertyApiRecord | null>(null);

  const fetchProperties = async ({ pg = 1, reset = false }: { pg?: number; reset?: boolean } = {}) => {
    if (reset) setIsLoading(true);
    else setIsLoadingMore(true);
    setError(null);

    try {
      const res = await fetch(`/api/properties?includeAll=true&page=${pg}&pageSize=25`);
      if (res.status === 401 || res.status === 403) {
        setError(language === 'en' ? 'Access denied.' : 'Acceso denegado.');
        return;
      }
      if (!res.ok) throw new Error();
      const result = await res.json();

      if (reset) setProperties(result.data);
      else setProperties(prev => [...prev, ...result.data]);

      setMeta(result.meta);
      setPage(pg);
    } catch {
      setError(language === 'en' ? 'Error loading properties.' : 'Error al cargar propiedades.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const fetchStats = () => {
    fetch('/api/properties/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(() => {});
  };

  useEffect(() => {
    fetchProperties({ pg: 1, reset: true });
    fetchStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleActive = async (prop: PropertyApiRecord) => {
    setIsTogglingId(prop.id);
    setActionError(null);
    try {
      const res = await fetch(`/api/properties/${prop.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !prop.isActive }),
      });
      if (!res.ok) throw new Error();
      fetchProperties({ pg: 1, reset: true });
      fetchStats();
    } catch {
      setActionError(language === 'en' ? 'Could not update property.' : 'No se pudo actualizar la propiedad.');
    } finally {
      setIsTogglingId(null);
    }
  };

  const handleOpenCreate = () => {
    setEditProperty(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prop: PropertyApiRecord) => {
    setEditProperty(prop);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    fetchProperties({ pg: 1, reset: true });
    fetchStats();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 animate-pulse">
          {language === 'en' ? 'Loading properties...' : 'Cargando propiedades...'}
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
        <div>
          <h1 className="text-2xl font-extrabold text-brand-navy-900 dark:text-white tracking-tight">
            {language === 'en' ? 'Properties' : 'Propiedades'}
          </h1>
          {stats && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {stats.active} {language === 'en' ? 'active' : 'activas'} · {stats.inactive} {language === 'en' ? 'inactive' : 'inactivas'} · {stats.total} {language === 'en' ? 'total' : 'total'}
            </p>
          )}
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-colors text-xs uppercase"
        >
          {language === 'en' ? '+ Add Property' : '+ Agregar Propiedad'}
        </button>
      </div>

      {actionError && (
        <div className="p-3 bg-red-100 text-red-700 text-xs rounded-lg font-semibold">
          ⚠️ {actionError}
        </div>
      )}

      {properties.length === 0 ? (
        <div className="text-center py-24 text-sm text-slate-400 dark:text-slate-500">
          {language === 'en' ? 'No properties yet.' : 'Aún no hay propiedades.'}
        </div>
      ) : (
        <div className="bg-white dark:bg-brand-navy-900 rounded-2xl border border-slate-200 dark:border-brand-navy-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-brand-navy-800 bg-slate-50 dark:bg-brand-navy-800/50">
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {language === 'en' ? 'Title' : 'Título'}
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {language === 'en' ? 'Location' : 'Ubicación'}
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {language === 'en' ? 'Price' : 'Precio'}
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {language === 'en' ? 'Private' : 'Privada'}
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {language === 'en' ? 'Active' : 'Activa'}
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {language === 'en' ? 'Actions' : 'Acciones'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-brand-navy-800">
                {properties.map((prop) => {
                  const isPubliclyViewable = prop.isActive && !prop.isPrivate;
                  return (
                    <tr key={prop.id} className="hover:bg-slate-50 dark:hover:bg-brand-navy-800/30 transition-colors">
                      <td className="px-4 py-3 max-w-xs">
                        {isPubliclyViewable ? (
                          <Link
                            href={`/catalog/${prop.id}`}
                            className="font-semibold text-brand-navy-900 dark:text-white hover:text-brand-accent dark:hover:text-brand-accent transition-colors line-clamp-2"
                          >
                            {prop.title}
                          </Link>
                        ) : (
                          <span className="font-semibold text-brand-navy-900 dark:text-white line-clamp-2">
                            {prop.title}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="font-medium text-brand-navy-900 dark:text-white text-xs">{prop.city}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{prop.zone}</p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-700 dark:text-slate-300">
                        ${Number(prop.price).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusBadgeClass(prop.status)}`}>
                          {prop.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {prop.isPrivate ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                            {language === 'en' ? 'Private' : 'Privada'}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 dark:text-slate-500">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${prop.isActive ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {prop.isActive
                            ? (language === 'en' ? 'Active' : 'Activa')
                            : (language === 'en' ? 'Inactive' : 'Inactiva')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(prop)}
                            className="text-xs font-semibold text-brand-accent hover:underline"
                          >
                            {language === 'en' ? 'Edit' : 'Editar'}
                          </button>
                          <span className="text-slate-300 dark:text-slate-600">·</span>
                          <button
                            onClick={() => handleToggleActive(prop)}
                            disabled={isTogglingId === prop.id}
                            className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 disabled:opacity-40 transition-colors"
                          >
                            {isTogglingId === prop.id
                              ? '...'
                              : prop.isActive
                                ? (language === 'en' ? 'Deactivate' : 'Desactivar')
                                : (language === 'en' ? 'Activate' : 'Activar')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {meta?.hasMore && (
        <div className="flex justify-center">
          <button
            onClick={() => fetchProperties({ pg: page + 1 })}
            disabled={isLoadingMore}
            className="px-6 py-3 rounded-xl font-bold text-sm border border-slate-200 dark:border-brand-navy-700 text-slate-600 dark:text-slate-300 hover:bg-brand-accent hover:border-brand-accent hover:text-white transition-all duration-300 disabled:opacity-50"
          >
            {isLoadingMore
              ? (language === 'en' ? 'Loading...' : 'Cargando...')
              : (language === 'en' ? 'Load more' : 'Cargar más')}
          </button>
        </div>
      )}

      <AddPropertyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        property={editProperty ?? undefined}
      />
    </div>
  );
}
