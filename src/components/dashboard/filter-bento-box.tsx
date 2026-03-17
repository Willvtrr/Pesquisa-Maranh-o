"use client";

import React from 'react';
import { BentoCard } from './bento-card';
import { cn } from '@/lib/utils';
import { MesoRegion } from '@/data/survey-data';

interface FilterBentoBoxProps {
  filters: {
    region: string;
    age: string;
    gender: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClear: () => void;
}

export const FilterBentoBox = ({ filters, onFilterChange, onClear }: FilterBentoBoxProps) => {
  return (
    <BentoCard title="Segmentação" subtitle="Filtros Multidimensionais" className="lg:row-span-2">
      <div className="flex flex-col gap-6">
        <FilterGroup label="Região">
          <div className="flex flex-wrap gap-2">
            <FilterChip 
              label="Todas" 
              active={filters.region === 'all'} 
              onClick={() => onFilterChange('region', 'all')} 
            />
            {(['Norte', 'Sul', 'Oeste', 'Leste', 'Centro'] as MesoRegion[]).map(r => (
              <FilterChip 
                key={r} 
                label={r} 
                active={filters.region === r} 
                onClick={() => onFilterChange('region', r)} 
              />
            ))}
          </div>
        </FilterGroup>

        <FilterGroup label="Idade">
          <div className="flex flex-wrap gap-2">
            <FilterChip 
              label="Todas" 
              active={filters.age === 'all'} 
              onClick={() => onFilterChange('age', 'all')} 
            />
            {['16-24', '25-34', '35-44', '45-59', '60+'].map(age => (
              <FilterChip 
                key={age}
                label={age} 
                active={filters.age === age} 
                onClick={() => onFilterChange('age', age)} 
              />
            ))}
          </div>
        </FilterGroup>

        <FilterGroup label="Gênero">
          <div className="flex flex-wrap gap-2">
            <FilterChip 
              label="Todos" 
              active={filters.gender === 'all'} 
              onClick={() => onFilterChange('gender', 'all')} 
            />
            {['Masculino', 'Feminino'].map(g => (
              <FilterChip 
                key={g}
                label={g} 
                active={filters.gender === g} 
                onClick={() => onFilterChange('gender', g)} 
              />
            ))}
          </div>
        </FilterGroup>

        <button 
          onClick={onClear}
          className="mt-4 w-full py-3 rounded-2xl bg-zinc-50 text-zinc-400 text-xs font-bold uppercase tracking-widest hover:bg-orange-50 hover:text-orange-600 transition-all"
        >
          Resetar Filtros
        </button>
      </div>
    </BentoCard>
  );
};

const FilterGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">{label}</label>
    {children}
  </div>
);

const FilterChip = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "px-4 py-2 rounded-full text-xs font-semibold transition-all border",
      active 
        ? "bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-600/20" 
        : "bg-white border-zinc-100 text-zinc-500 hover:border-orange-200 hover:text-orange-600"
    )}
  >
    {label}
  </button>
);
