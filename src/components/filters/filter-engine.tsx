
"use client";

import React from 'react';
import { NeomorphicCard } from '../ui/neomorphic-card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { MesoRegion, AgeGroup, Gender } from '@/data/survey-data';

interface FilterEngineProps {
  filters: {
    region: string;
    age: string;
    gender: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClear: () => void;
}

export const FilterEngine = ({ filters, onFilterChange, onClear }: FilterEngineProps) => {
  return (
    <NeomorphicCard className="mb-8 overflow-visible">
      <div className="flex flex-col md:flex-row items-end gap-6">
        <div className="flex-1 w-full space-y-2">
          <Label className="text-muted-foreground font-bold text-xs uppercase ml-1">Região</Label>
          <Select value={filters.region} onValueChange={(val) => onFilterChange('region', val)}>
            <SelectTrigger className="rounded-2xl neo-in border-none h-12">
              <SelectValue placeholder="Todas as Regiões" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="all">Todas as Regiões</SelectItem>
              <SelectItem value="Norte">Norte Maranhense</SelectItem>
              <SelectItem value="Sul">Sul Maranhense</SelectItem>
              <SelectItem value="Oeste">Oeste Maranhense</SelectItem>
              <SelectItem value="Leste">Leste Maranhense</SelectItem>
              <SelectItem value="Centro">Centro Maranhense</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 w-full space-y-2">
          <Label className="text-muted-foreground font-bold text-xs uppercase ml-1">Faixa Etária</Label>
          <Select value={filters.age} onValueChange={(val) => onFilterChange('age', val)}>
            <SelectTrigger className="rounded-2xl neo-in border-none h-12">
              <SelectValue placeholder="Todas as Idades" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="all">Todas as Idades</SelectItem>
              <SelectItem value="16-24">16-24 anos</SelectItem>
              <SelectItem value="25-34">25-34 anos</SelectItem>
              <SelectItem value="35-44">35-44 anos</SelectItem>
              <SelectItem value="45-59">45-59 anos</SelectItem>
              <SelectItem value="60+">60+ anos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 w-full space-y-2">
          <Label className="text-muted-foreground font-bold text-xs uppercase ml-1">Gênero</Label>
          <Select value={filters.gender} onValueChange={(val) => onFilterChange('gender', val)}>
            <SelectTrigger className="rounded-2xl neo-in border-none h-12">
              <SelectValue placeholder="Ambos os Gêneros" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="all">Ambos os Gêneros</SelectItem>
              <SelectItem value="Masculino">Masculino</SelectItem>
              <SelectItem value="Feminino">Feminino</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <button 
          onClick={onClear}
          className="h-12 px-6 rounded-2xl bg-white/50 text-accent font-bold text-xs uppercase tracking-widest neo-out hover:neo-in transition-all whitespace-nowrap"
        >
          Limpar
        </button>
      </div>
    </NeomorphicCard>
  );
};
