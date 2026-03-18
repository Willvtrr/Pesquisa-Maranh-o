
'use client';

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import rawData from '../data/surveyData.json';

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
  const [data, setData] = useState<SurveyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<Record<string, any>>({
    region: 'all',
    age: 'all',
    gender: 'all'
  });

  useEffect(() => {
    // Carrega dados iniciais do JSON para evitar quebra do build
    if (Array.isArray(rawData)) {
      setData(rawData);
    }
    setIsLoading(false);
  }, []);

  return (
    <SurveyContext.Provider value={{ data, filters, setFilters, isLoading }}>
      {children}
    </SurveyContext.Provider>
  );
}
