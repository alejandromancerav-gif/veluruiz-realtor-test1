'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAppState } from '@/context/AppStateContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { signOut }  = useAuth();
  const { language } = useAppState();
  const router       = useRouter();
  const pathname     = usePathname();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-brand-navy-950 transition-colors duration-300">
      <header className="bg-brand-navy-900 border-b border-brand-navy-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-white font-bold tracking-wide text-sm uppercase">
              {language === 'en' ? 'Admin Panel' : 'Panel Admin'}
            </span>
            <Link
              href="/admin/appointments"
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith('/admin/appointments')
                  ? 'text-white'
                  : 'text-brand-navy-300 hover:text-white'
              }`}
            >
              {language === 'en' ? 'Visit Requests' : 'Solicitudes'}
            </Link>
            <Link
              href="/admin/properties"
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith('/admin/properties')
                  ? 'text-white'
                  : 'text-brand-navy-300 hover:text-white'
              }`}
            >
              {language === 'en' ? 'Properties' : 'Propiedades'}
            </Link>
          </div>
          <button
            onClick={handleSignOut}
            className="text-xs font-semibold text-brand-navy-300 hover:text-white transition-colors"
          >
            {language === 'en' ? 'Sign out' : 'Cerrar sesión'}
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
