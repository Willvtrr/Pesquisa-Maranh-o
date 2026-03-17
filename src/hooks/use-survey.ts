
'use client';

import { useContext } from 'react';
import { SurveyContext } from '@/contexts/survey-context';

/**
 * Hook customizado para acessar os dados e filtros da pesquisa globalmente.
 */
export function useSurvey() {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error('useSurvey deve ser usado dentro de um SurveyProvider');
  }
  return context;
}
