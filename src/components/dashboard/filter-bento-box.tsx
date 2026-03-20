"use client";

import React from 'react';
import { LuxuryCard } from './luxury-card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface FilterBentoBoxProps {
  filters: Record<string, string[]>;
  onFilterChange: (key: string, value: string) => void;
  onClear: () => void;
  options: Record<string, string[]>;
  distribution?: Record<string, Record<string, number>>;
  className?: string;
}

export const FilterBentoBox = ({ filters, onFilterChange, onClear, options, distribution, className }: FilterBentoBoxProps) => {
  const isSelected = (key: string, value: string) => filters[key]?.includes(value);

  const filterGroups = [
    { key: 'region', label: 'Mesorregião' },
    { key: 'gender', label: 'Gênero' },
    { key: 'age', label: 'Faixa Etária' },
    { key: 'income', label: 'Renda Familiar' },
    { key: 'education', label: 'Grau de Instrução' },
    { key: 'religion', label: 'Religião' },
  ];

  return (
    <LuxuryCard title="Segmentação" subtitle="Recortes de Dados" className={cn("flex flex-col", className)}>
      <div className="flex flex-col gap-6 mt-4 pb-4 overflow-y-auto max-h-[800px] lg:max-h-none scrollbar-hide">
        {filterGroups.map((group) => (
          <FilterGroup key={group.key} label={group.label}>
            <div className="flex flex-wrap gap-1.5">
              <FilterChip 
                label="Todas" 
                active={isSelected(group.key, 'all')} 
                onClick={() => onFilterChange(group.key, 'all')} 
              />
              {(options[group.key] || []).map(opt => {
                const percentage = distribution?.[group.key]?.[opt];
                return (
                  <FilterChip 
                    key={opt} 
                    label={opt} 
                    percentage={percentage}
                    active={isSelected(group.key, opt)} 
                    onClick={() => onFilterChange(group.key, opt)} 
                  />
                );
              })}
            </div>
          </FilterGroup>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-zinc-100 flex flex-col gap-3">
        <button 
          onClick={onClear}
          className="w-full py-2.5 rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-400 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all shadow-sm"
        >
          Resetar Filtros
        </button>
      </div>
    </LuxuryCard>
  );
};

const FilterGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="space-y-2.5">
    <label className="text-[9px] font-black uppercase text-zinc-400 tracking-[0.15em] flex items-center gap-1.5">
      <span className="w-1 h-1 bg-orange-600/30 rounded-full" />
      {label}
    </label>
    {children}
  </div>
);

export const FilterChip = ({ label, active, percentage, onClick }: { label: string, active: boolean, percentage?: number, onClick: () => void }) => (
  <motion.button 
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={cn(
      "px-3 py-1.5 rounded-xl text-[9px] font-bold transition-all border flex items-center gap-1.5",
      active 
        ? "bg-orange-600 border-orange-600 text-white shadow-md shadow-orange-600/10" 
        : "bg-white border-zinc-100 text-zinc-500 hover:border-orange-200 hover:text-orange-600"
    )}
  >
    <span className="truncate max-w-[120px]">{label}</span>
    {percentage !== undefined && (
      <span className={cn(
        "text-[8px] font-black px-1 py-0.5 rounded-md",
        active ? "bg-white/20 text-white" : "bg-zinc-50 text-zinc-400"
      )}>
        {percentage.toFixed(0)}%
      </span>
    )}
  </motion.button>
);
