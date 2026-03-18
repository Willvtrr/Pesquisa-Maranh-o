
'use client';

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, limit, orderBy } from 'firebase/firestore';

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

  /**
   * IMPORTANTE: Para 109k registros, carregar tudo no navegador causaria "Out of Memory".
   * Definimos um limite de 10.000 para a amostra do dashboard. 
   * Isso é estatisticamente mais que suficiente para um painel executivo preciso.
   */
  const surveyQuery = useMemoFirebase(() => {
    return query(
      collection(db, 'surveyResponses'), 
      limit(10000)
    );
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
