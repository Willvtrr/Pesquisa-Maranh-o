
'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';

/**
 * Provedor SSR-Safe para o Google Maps.
 * Garante que a API carregue apenas no lado do cliente.
 */
export function GoogleMapsProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  useEffect(() => {
    setMounted(true);
  }, []);

  // No servidor, renderiza apenas os filhos. No cliente, envolve com o APIProvider.
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <APIProvider apiKey={apiKey} language="pt-BR" region="BR">
      {children}
    </APIProvider>
  );
}
