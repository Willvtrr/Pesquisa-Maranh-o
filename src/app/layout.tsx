
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { SurveyProvider } from '@/contexts/survey-context';
import { PWARegister } from '@/components/pwa-register';
import { GoogleMapsProvider } from '@/components/providers/google-maps-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthGate } from '@/components/auth/auth-gate';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Focco Analytics | Inteligência de Dados',
  description: 'Painel executivo de alta performance para análise de dados estratégicos e pesquisas de opinião.',
  manifest: '/manifest.json',
  icons: {
    icon: '/ICON - VARIAÇÃO 3.svg',
    shortcut: '/ICON - VARIAÇÃO 3.svg',
    apple: '/ICON - VARIAÇÃO 3.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Focco Analytics',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#ea580c',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrains.variable}`}>
      <head>
        <link rel="icon" href="/ICON - VARIAÇÃO 3.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/ICON - VARIAÇÃO 3.svg" />
      </head>
      <body className="font-sans min-h-screen">
        <PWARegister />
        <FirebaseClientProvider>
          <GoogleMapsProvider>
            <SurveyProvider>
              <AuthGate>
                {children}
              </AuthGate>
              <Toaster />
            </SurveyProvider>
          </GoogleMapsProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
