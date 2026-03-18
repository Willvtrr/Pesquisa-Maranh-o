
'use client';

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

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

  // Memoiza a query para evitar loops infinitos
  const surveyQuery = useMemoFirebase(() => {
    return collection(db, 'surveyResponses');
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
