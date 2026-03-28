
'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';

export function GoogleMapsProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  useEffect(() => {
    setMounted(true);
  }, []);

  // No servidor, apenas renderizamos os filhos sem o provedor
  // No cliente, após a montagem, renderizamos o APIProvider
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <APIProvider apiKey={apiKey} language="pt-BR" region="BR">
      {children}
    </APIProvider>
  );
}
