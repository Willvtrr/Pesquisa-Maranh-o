
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
    <LuxuryCard 
      title="SEGMENTAÇÃO" 
      subtitle="Recortes de Dados" 
      className={cn("flex flex-col h-full", className)}
    >
      <div className="flex flex-col gap-8 flex-1 overflow-y-auto pr-2 scrollbar-hide">
        {filterGroups.map((group) => (
          <div key={group.key} className="space-y-4">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full" />
              {group.label}
            </label>
            <div className="flex flex-wrap gap-x-3 gap-y-3">
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
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-zinc-100">
        <button 
          onClick={onClear}
          className="w-full py-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-100 hover:text-zinc-600 transition-all active:scale-[0.98]"
        >
          Resetar Filtros
        </button>
      </div>
    </LuxuryCard>
  );
};

export const FilterChip = ({ label, active, percentage, onClick }: { label: string, active: boolean, percentage?: number, onClick: () => void }) => (
  <motion.button 
    whileTap={{ scale: 0.96 }}
    onClick={onClick}
    className={cn(
      "px-5 py-2.5 rounded-full text-[11px] font-bold transition-all border flex items-center gap-3",
      active 
        ? "bg-orange-600 border-orange-600 text-white shadow-xl shadow-orange-600/30" 
        : "bg-white border-zinc-100 text-zinc-600 hover:border-zinc-200 hover:bg-zinc-50"
    )}
  >
    <span className="truncate max-w-[120px]">{label}</span>
    {percentage !== undefined && (
      <span className={cn(
        "text-[9px] font-black px-2 py-0.5 rounded-full flex items-center justify-center min-w-[32px]",
        active ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-400"
      )}>
        {Math.round(percentage)}%
      </span>
    )}
  </motion.button>
);
