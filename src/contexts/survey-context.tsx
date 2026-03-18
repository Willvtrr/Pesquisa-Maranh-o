
'use client';

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, limit } from 'firebase/firestore';

export interface SurveyItem {
  [key: string]: any;
}

interface SurveyContextType {
  data: SurveyItem[];
  filters: Record<string, any>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  isLoading: boolean;
}

export const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export function SurveyProvider({ children }: { children: ReactNode }) {
  const db = useFirestore();
  const [filters, setFilters] = useState<Record<string, any>>({
    region: 'all',
    age: 'all',
    gender: 'all'
  });

  // Para volumes de 109k, buscar tudo no cliente pode ser pesado.
  // No entanto, para o Dashboard funcionar como solicitado, buscamos a coleção.
  // Adicionei um limite inicial de 5000 para performance do navegador, 
  // mas o sistema de banco está pronto para o total.
  const surveyQuery = useMemoFirebase(() => {
    return query(collection(db, 'surveyResponses'), limit(10000));
  }, [db]);

  const { data: firestoreData, isLoading } = useCollection<SurveyItem>(surveyQuery);

  return (
    <SurveyContext.Provider value={{ 
      data: firestoreData || [], 
      filters, 
      setFilters, 
      isLoading 
    }}>
      {children}
    </SurveyContext.Provider>
  );
}
