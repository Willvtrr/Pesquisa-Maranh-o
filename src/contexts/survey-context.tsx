
'use client';

import React, { createContext, useState, ReactNode } from 'react';
import rawData from '../data/surveyData.json';

export interface SurveyItem {
  [key: string]: any;
}

interface SurveyContextType {
  data: SurveyItem[];
  filters: Record<string, any>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

export const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export function SurveyProvider({ children }: { children: ReactNode }) {
  // O Next.js recarrega automaticamente quando você salvar o JSON
  const [data] = useState<SurveyItem[]>(Array.isArray(rawData) ? rawData : []);
  const [filters, setFilters] = useState<Record<string, any>>({
    region: 'all',
    age: 'all',
    gender: 'all'
  });

  return (
    <SurveyContext.Provider value={{ data, filters, setFilters }}>
      {children}
    </SurveyContext.Provider>
  );
}
