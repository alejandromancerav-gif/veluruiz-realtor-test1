import React from 'react';
import '../styles/globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import { AppStateProvider } from '../context/AppStateContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

// IMPORTACIÓN NUEVA: El widget del chatbox
import AIChatbox from '../components/AIChatBox';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="flex flex-col min-h-screen bg-slate-50 dark:bg-brand-navy-900 transition-colors duration-300">
        <ThemeProvider>
          <AppStateProvider>
            <FavoritesProvider>
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
              
              {/* INYECCIÓN SEGURA DEL CHATBOX */}
              {/* Flotará en toda la aplicación sin afectar el layout */}
              <AIChatbox />
              
            </FavoritesProvider>
          </AppStateProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}