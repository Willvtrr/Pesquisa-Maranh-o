
import type { Metadata } from 'next';
import './globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { SurveyProvider } from '@/contexts/survey-context';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Focco Analytics | Inteligência de Dados',
  description: 'Painel executivo de alta performance para análise de dados estratégicos e pesquisas de opinião.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="font-sans min-h-screen">
        <FirebaseClientProvider>
          <SurveyProvider>
            {children}
          </SurveyProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
