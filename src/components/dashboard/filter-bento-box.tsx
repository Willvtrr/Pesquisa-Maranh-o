
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
    { key: 'ideology', label: 'Posicionamento Ideológico' },
    { key: 'education', label: 'Grau de Instrução' },
    { key: 'religion', label: 'Religião' },
  ];

  // Divide os grupos em colunas para ocupar a largura horizontal estendida
  const leftColumn = filterGroups.filter((_, i) => i % 2 === 0);
  const rightColumn = filterGroups.filter((_, i) => i % 2 !== 0);

  return (
    <LuxuryCard title="Segmentação" subtitle="Recortes de Dados" className={cn("h-full", className)}>
      <div className="flex flex-col md:flex-row gap-x-12 gap-y-8 mt-4 pb-4">
        {/* Coluna Esquerda */}
        <div className="flex-1 space-y-8">
          {leftColumn.map((group) => (
            <FilterGroup key={group.key} label={group.label}>
              <div className="flex flex-wrap gap-2">
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

        {/* Coluna Direita */}
        <div className="flex-1 space-y-8">
          {rightColumn.map((group) => (
            <FilterGroup key={group.key} label={group.label}>
              <div className="flex flex-wrap gap-2">
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
      </div>

      <div className="mt-8 pt-6 border-t border-zinc-100 flex items-center justify-between gap-6">
        <button 
          onClick={onClear}
          className="flex-1 py-3 rounded-2xl bg-zinc-50 border border-zinc-100 text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all shadow-sm"
        >
          Resetar Filtros Globais
        </button>
        <div className="hidden lg:flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-50/50 border border-orange-100">
          <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Motor Power-BI Ativo</span>
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
        </div>
      </div>
    </LuxuryCard>
  );
};

const FilterGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="space-y-4">
    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] flex items-center gap-2">
      <span className="w-1 h-1 bg-zinc-300 rounded-full" />
      {label}
    </label>
    {children}
  </div>
);

const FilterChip = ({ label, active, percentage, onClick }: { label: string, active: boolean, percentage?: number, onClick: () => void }) => (
  <motion.button 
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={cn(
      "px-5 py-2.5 rounded-2xl text-[11px] font-bold transition-all border flex items-center gap-2",
      active 
        ? "bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-600/20" 
        : "bg-white border-zinc-100 text-zinc-500 hover:border-orange-200 hover:text-orange-600"
    )}
  >
    {label}
    {percentage !== undefined && (
      <span className={cn(
        "text-[9px] font-black px-1.5 py-0.5 rounded-md",
        active ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-400"
      )}>
        {percentage.toFixed(0)}%
      </span>
    )}
  </motion.button>
);
