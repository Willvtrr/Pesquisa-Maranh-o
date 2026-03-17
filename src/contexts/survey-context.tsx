
'use client';

import React, { createContext, useState, ReactNode } from 'react';
import rawData from '../data/surveyData.json';

/**
 * Interface para os dados de pesquisa. 
 * As chaves são dinâmicas para suportar o formato "Cidade:", "4. PRESIDENTE:..." etc.
 */
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
  // Inicializa o estado com o array massivo importado do JSON
  const [data] = useState<SurveyItem[]>(rawData);
  const [filters, setFilters] = useState<Record<string, any>>({});

  return (
    <SurveyContext.Provider value={{ data, filters, setFilters }}>
      {children}
    </SurveyContext.Provider>
  );
}
