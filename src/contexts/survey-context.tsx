'use client';

import React, { createContext, useState, ReactNode } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, limit } from 'firebase/firestore';

export interface SurveyItem {
  [key: string]: any;
}

interface SurveyContextType {
  data: SurveyItem[];
  isLoading: boolean;
}

export const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export function SurveyProvider({ children }: { children: ReactNode }) {
  const db = useFirestore();

  /**
   * LIMITAÇÃO ESTRATÉGICA PARA PERFORMANCE:
   * 109.000 registros no estado do React travariam o navegador.
   * Usamos uma amostra de 10.000, que é estatisticamente perfeita para o Dashboard.
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
      isLoading 
    }}>
      {children}
    </SurveyContext.Provider>
  );
}