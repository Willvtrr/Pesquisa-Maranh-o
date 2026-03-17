
"use client";

import React from 'react';
import { Filter, X, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { MesoRegion, AgeGroup, Gender } from '@/data/survey-data';

interface FilterSidebarProps {
  filters: {
    region: string;
    age: string;
    gender: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClear: () => void;
}

export const FilterSidebar = ({ filters, onFilterChange, onClear }: FilterSidebarProps) => {
  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-widest text-zinc-400">
          <Filter size={16} />
          Filtros
        </div>
        <button 
          onClick={onClear}
          className="text-xs text-zinc-500 hover:text-indigo-400 transition-colors flex items-center gap-1 font-mono"
        >
          RESET [ESC]
        </button>
      </div>

      <div className="space-y-8">
        <FilterGroup label="Mesorregião">
          <FilterOption 
            label="Todas" 
            active={filters.region === 'all'} 
            onClick={() => onFilterChange('region', 'all')} 
          />
          {(['Norte', 'Sul', 'Oeste', 'Leste', 'Centro'] as MesoRegion[]).map(r => (
            <FilterOption 
              key={r} 
              label={`${r} Maranhense`} 
              active={filters.region === r} 
              onClick={() => onFilterChange('region', r)} 
            />
          ))}
        </FilterGroup>

        <FilterGroup label="Perfil Demográfico">
          <div className="space-y-4">
            <div>
              <Label className="text-[10px] uppercase tracking-tighter text-zinc-600 mb-2 block font-mono">Faixa Etária</Label>
              <div className="grid grid-cols-2 gap-2">
                {['16-24', '25-34', '35-44', '45-59', '60+'].map(age => (
                  <FilterChip 
                    key={age}
                    label={age} 
                    active={filters.age === age} 
                    onClick={() => onFilterChange('age', age)} 
                  />
                ))}
                <FilterChip 
                  label="Todas" 
                  active={filters.age === 'all'} 
                  onClick={() => onFilterChange('age', 'all')} 
                />
              </div>
            </div>

            <div>
              <Label className="text-[10px] uppercase tracking-tighter text-zinc-600 mb-2 block font-mono">Gênero</Label>
              <div className="flex gap-2">
                {['Masculino', 'Feminino'].map(g => (
                  <FilterChip 
                    key={g}
                    label={g} 
                    active={filters.gender === g} 
                    onClick={() => onFilterChange('gender', g)} 
                  />
                ))}
                <FilterChip 
                  label="Ambos" 
                  active={filters.gender === 'all'} 
                  onClick={() => onFilterChange('gender', 'all')} 
                />
              </div>
            </div>
          </div>
        </FilterGroup>
      </div>

      <div className="mt-auto pt-8">
        <div className="p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
          <div className="text-[10px] font-mono text-indigo-400 uppercase mb-1">Status do Processamento</div>
          <div className="text-sm font-medium">Motor de Filtro Ativo</div>
          <div className="mt-2 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 w-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="space-y-3">
    <h3 className="text-xs font-bold uppercase tracking-tight text-zinc-200">{label}</h3>
    <div className="space-y-1">{children}</div>
  </div>
);

const FilterOption = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full text-left px-3 py-2 rounded-md text-sm transition-all flex items-center justify-between group",
      active ? "bg-zinc-900 text-zinc-50 border border-white/5" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
    )}
  >
    {label}
    {active && <Check size={14} className="text-indigo-400" />}
  </button>
);

const FilterChip = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "px-3 py-1.5 rounded border text-[10px] font-mono transition-all",
      active 
        ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20" 
        : "border-white/5 bg-zinc-900/50 text-zinc-500 hover:border-zinc-700"
    )}
  >
    {label}
  </button>
);
