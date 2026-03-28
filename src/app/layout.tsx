import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { SurveyProvider } from '@/contexts/survey-context';
import { PWARegister } from '@/components/pwa-register';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Focco Analytics | Inteligência de Dados',
  description: 'Painel executivo de alta performance para análise de dados estratégicos e pesquisas de opinião.',
  manifest: '/manifest.json',
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
        <link rel="apple-touch-icon" href="https://picsum.photos/seed/focco-pwa-192/192/192" />
      </head>
      <body className="font-sans min-h-screen">
        <PWARegister />
        <FirebaseClientProvider>
          <SurveyProvider>
            {children}
          </SurveyProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}