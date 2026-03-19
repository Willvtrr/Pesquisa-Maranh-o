
"use client";

import React from 'react';
import { LuxuryCard } from './luxury-card';
import { cn } from '@/lib/utils';
import { MesoRegion } from '@/data/survey-data';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FilterBentoBoxProps {
  filters: {
    region: string;
    age: string;
    gender: string;
    education: string;
    income: string;
    religion: string;
    ideology: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClear: () => void;
}

export const FilterBentoBox = ({ filters, onFilterChange, onClear }: FilterBentoBoxProps) => {
  return (
    <LuxuryCard title="Segmentação" subtitle="Recortes de Dados" className="lg:row-span-2 lg:h-full">
      <ScrollArea className="h-[500px] lg:h-[700px] pr-4">
        <div className="flex flex-col gap-8 mt-4 pb-8">
          <FilterGroup label="Mesorregião">
            <div className="flex flex-wrap gap-2">
              <FilterChip label="Todas" active={filters.region === 'all'} onClick={() => onFilterChange('region', 'all')} />
              {(['Norte', 'Sul', 'Oeste', 'Leste', 'Centro'] as MesoRegion[]).map(r => (
                <FilterChip key={r} label={r} active={filters.region === r} onClick={() => onFilterChange('region', r)} />
              ))}
            </div>
          </FilterGroup>

          <FilterGroup label="Faixa Etária">
            <div className="flex flex-wrap gap-2">
              <FilterChip label="Todas" active={filters.age === 'all'} onClick={() => onFilterChange('age', 'all')} />
              {['16-24', '25-34', '35-44', '45-59', '60+'].map(age => (
                <FilterChip key={age} label={age} active={filters.age === age} onClick={() => onFilterChange('age', age)} />
              ))}
            </div>
          </FilterGroup>

          <FilterGroup label="Gênero">
            <div className="flex flex-wrap gap-2">
              <FilterChip label="Todos" active={filters.gender === 'all'} onClick={() => onFilterChange('gender', 'all')} />
              {['Masculino', 'Feminino'].map(g => (
                <FilterChip key={g} label={g} active={filters.gender === g} onClick={() => onFilterChange('gender', g)} />
              ))}
            </div>
          </FilterGroup>

          <FilterGroup label="Grau de Instrução">
            <div className="flex flex-wrap gap-2">
              <FilterChip label="Todos" active={filters.education === 'all'} onClick={() => onFilterChange('education', 'all')} />
              {['Analfabeto', 'Fund. Incompleto', 'Fund. Completo', 'Médio Incompleto', 'Médio Completo', 'Superior Incompleto', 'Superior Completo'].map(e => (
                <FilterChip key={e} label={e} active={filters.education === e} onClick={() => onFilterChange('education', e)} />
              ))}
            </div>
          </FilterGroup>

          <FilterGroup label="Renda Familiar">
            <div className="flex flex-wrap gap-2">
              <FilterChip label="Todas" active={filters.income === 'all'} onClick={() => onFilterChange('income', 'all')} />
              {['Até 1 SM', '1 a 2 SM', '2 a 5 SM', '5 a 10 SM', 'Mais de 10 SM'].map(i => (
                <FilterChip key={i} label={i} active={filters.income === i} onClick={() => onFilterChange('income', i)} />
              ))}
            </div>
          </FilterGroup>

          <FilterGroup label="Religião">
            <div className="flex flex-wrap gap-2">
              <FilterChip label="Todas" active={filters.religion === 'all'} onClick={() => onFilterChange('religion', 'all')} />
              {['Católica', 'Evangélica', 'Espírita', 'Outras', 'Sem Religião'].map(r => (
                <FilterChip key={r} label={r} active={filters.religion === r} onClick={() => onFilterChange('religion', r)} />
              ))}
            </div>
          </FilterGroup>

          <FilterGroup label="Posicionamento Ideológico">
            <div className="flex flex-wrap gap-2">
              <FilterChip label="Todos" active={filters.ideology === 'all'} onClick={() => onFilterChange('ideology', 'all')} />
              {['Esquerda', 'Centro', 'Direita', 'NS/NR'].map(id => (
                <FilterChip key={id} label={id} active={filters.ideology === id} onClick={() => onFilterChange('ideology', id)} />
              ))}
            </div>
          </FilterGroup>

          <button 
            onClick={onClear}
            className="mt-4 w-full py-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all"
          >
            Resetar Filtros
          </button>
        </div>
      </ScrollArea>
    </LuxuryCard>
  );
};

const FilterGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="space-y-4">
    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em]">{label}</label>
    {children}
  </div>
);

const FilterChip = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <motion.button 
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={cn(
      "px-5 py-2.5 rounded-2xl text-[11px] font-bold transition-all border",
      active 
        ? "bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-600/20" 
        : "bg-white border-zinc-100 text-zinc-500 hover:border-orange-200 hover:text-orange-600"
    )}
  >
    {label}
  </motion.button>
);
