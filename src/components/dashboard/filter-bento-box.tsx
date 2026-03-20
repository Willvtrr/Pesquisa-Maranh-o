
"use client";

import React, { useState, useMemo } from 'react';
import { LuxuryCard } from './luxury-card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Search, 
  CheckCircle2, 
  X,
  ChevronRight,
  Map as MapIcon
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FilterBentoBoxProps {
  filters: Record<string, string[]>;
  onFilterChange: (key: string, value: string) => void;
  onClear: () => void;
  options: Record<string, string[]>;
  distribution?: Record<string, Record<string, number>>;
  className?: string;
}

const MESO_COLORS: Record<string, string> = {
  'Metrop.': '#ea580c',
  'Norte': '#f97316',
  'Oeste': '#fb923c',
  'Centro': '#fdba74',
  'Leste': '#fed7aa',
  'Sul': '#cbd5e1',
};

// Coordenadas geográficas reais convertidas para caminhos SVG proporcionais ao Maranhão
const MESO_PATHS = [
  { id: 'Metrop.', label: 'METROP.', path: "M55,10 L62,10 L62,18 L55,18 Z" },
  { id: 'Norte', label: 'NORTE', path: "M35,20 L55,10 L62,10 L75,20 L75,35 L60,45 L40,40 Z" },
  { id: 'Leste', label: 'LESTE', path: "M75,20 L95,30 L95,65 L70,85 L60,45 L75,35 Z" },
  { id: 'Oeste', label: 'OESTE', path: "M10,45 L40,40 L45,75 L22,95 L10,85 Z" },
  { id: 'Centro', label: 'CENTRO', path: "M40,40 L60,45 L70,85 L45,75 Z" },
  { id: 'Sul', label: 'SUL', path: "M22,95 L45,75 L70,85 L85,130 L35,132 L20,115 Z" },
];

export const FilterBentoBox = ({ filters, onFilterChange, onClear, options, distribution, className }: FilterBentoBoxProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isSelected = (key: string, value: string) => filters[key]?.includes(value);

  const filteredCities = useMemo(() => {
    const cities = options.city || [];
    if (!searchTerm) return cities;
    return cities.filter(city => 
      city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options.city, searchTerm]);

  const selectedCitiesCount = filters.city?.[0] === 'all' ? 0 : filters.city?.length || 0;

  const filterGroups = [
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
        
        {/* Municípios Selector */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-pulse" />
            Municípios
          </label>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button className={cn(
                "w-full group relative flex items-center justify-between p-4 rounded-[1.5rem] border transition-all duration-300",
                selectedCitiesCount > 0 
                  ? "bg-orange-50 border-orange-200 shadow-lg shadow-orange-500/10" 
                  : "bg-white border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50"
              )}>
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-2xl transition-colors duration-300",
                    selectedCitiesCount > 0 ? "bg-orange-600 text-white" : "bg-zinc-50 text-zinc-400 group-hover:text-orange-600"
                  )}>
                    <MapPin size={18} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-black text-zinc-950 uppercase tracking-tighter">Escolha as Cidades</h4>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      {selectedCitiesCount > 0 
                        ? `${selectedCitiesCount} Selecionada${selectedCitiesCount > 1 ? 's' : ''}` 
                        : "Selecionar no Mapa"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedCitiesCount > 0 && (
                    <Badge variant="outline" className="bg-orange-600 text-white border-none rounded-full h-5 px-2">
                      {selectedCitiesCount}
                    </Badge>
                  )}
                  <ChevronRight size={14} className="text-zinc-300 group-hover:text-orange-600 transition-colors" />
                </div>
              </button>
            </DialogTrigger>
            
            <DialogContent className="max-w-2xl rounded-[2.5rem] border-zinc-200 p-0 overflow-hidden bg-white/95 backdrop-blur-2xl">
              <DialogHeader className="p-8 pb-4 border-b border-zinc-50 bg-white">
                <DialogTitle className="flex items-center gap-3 text-2xl font-black tracking-tighter">
                  <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
                    <MapIcon size={24} />
                  </div>
                  Escolha os Municípios
                </DialogTitle>
                <div className="relative mt-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 size-4" />
                  <Input 
                    placeholder="Buscar cidade no Maranhão..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 rounded-2xl border-zinc-100 bg-zinc-50 focus:ring-orange-500/20 text-sm font-bold"
                  />
                </div>
              </DialogHeader>
              
              <ScrollArea className="h-[400px] p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button 
                    onClick={() => onFilterChange('city', 'all')}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl border transition-all",
                      filters.city?.[0] === 'all' 
                        ? "bg-orange-600 border-orange-600 text-white" 
                        : "bg-white border-zinc-100 hover:border-zinc-200"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-white/20 flex items-center justify-center font-black text-[10px]">
                        BR
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest">Todos os Municípios</span>
                    </div>
                    {filters.city?.[0] === 'all' && <CheckCircle2 size={16} />}
                  </button>

                  {filteredCities.map((city) => {
                    const active = isSelected('city', city);
                    return (
                      <button 
                        key={city}
                        onClick={() => onFilterChange('city', city)}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-2xl border transition-all group",
                          active 
                            ? "bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-600/20" 
                            : "bg-white border-zinc-100 hover:border-orange-200 hover:bg-orange-50/50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative size-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-zinc-100">
                            <img 
                              src={`https://picsum.photos/seed/${city.toLowerCase().replace(/\s+/g, '-')}/100/100`} 
                              alt={city}
                              className="size-full object-cover"
                            />
                          </div>
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-tight",
                            active ? "text-white" : "text-zinc-700"
                          )}>
                            {city}
                          </span>
                        </div>
                        <div className={cn(
                          "size-5 rounded-full flex items-center justify-center border transition-all",
                          active ? "bg-white border-white text-orange-600" : "bg-zinc-50 border-zinc-100 text-transparent"
                        )}>
                          <CheckCircle2 size={14} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
              
              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  {selectedCitiesCount} Cidades Selecionadas
                </p>
                <button 
                  onClick={() => setIsDialogOpen(false)}
                  className="px-8 py-3 bg-zinc-950 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all"
                >
                  Confirmar Filtros
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Mesorregião - MAPA VETORIAL PRECISO */}
        <div className="space-y-6">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-orange-600 rounded-full" />
            Mesorregião
          </label>
          
          <div className="bg-zinc-50/50 rounded-[2.5rem] p-6 border border-zinc-100 shadow-inner">
            <div className="aspect-[4/5] relative mb-10 px-4">
              <svg viewBox="0 0 100 135" className="w-full h-full drop-shadow-2xl">
                {MESO_PATHS.map((meso) => {
                  const active = isSelected('region', meso.id);
                  return (
                    <motion.path
                      key={meso.id}
                      d={meso.path}
                      fill={active ? MESO_COLORS[meso.id] : "#e2e8f0"}
                      stroke="#ffffff"
                      strokeWidth="1.2"
                      initial={false}
                      animate={{ 
                        fill: active ? MESO_COLORS[meso.id] : "#e2e8f0",
                        scale: active ? 1.05 : 1,
                        filter: active ? `drop-shadow(0 0 12px ${MESO_COLORS[meso.id]}44)` : 'none'
                      }}
                      onClick={() => onFilterChange('region', meso.id)}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  );
                })}
              </svg>
            </div>
            
            {/* Legenda em 2 Colunas (Conforme Protótipo) */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <button 
                onClick={() => onFilterChange('region', 'all')}
                className={cn(
                  "flex items-center justify-between p-2.5 rounded-xl transition-all group",
                  filters.region?.[0] === 'all' 
                    ? "bg-white shadow-lg ring-1 ring-zinc-200" 
                    : "hover:bg-white/50"
                )}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-zinc-400" />
                  <span className="text-[9px] font-black uppercase text-zinc-500">TODAS</span>
                </div>
              </button>

              {MESO_PATHS.map((meso) => {
                const percentage = distribution?.region?.[meso.id] || 0;
                const active = isSelected('region', meso.id);
                return (
                  <button 
                    key={meso.id}
                    onClick={() => onFilterChange('region', meso.id)}
                    className={cn(
                      "flex items-center justify-between p-2.5 rounded-xl transition-all group",
                      active 
                        ? "bg-white shadow-lg ring-1 ring-zinc-200" 
                        : "hover:bg-white/50"
                    )}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: MESO_COLORS[meso.id] }} />
                      <span className={cn(
                        "text-[9px] font-black uppercase truncate",
                        active ? "text-orange-600" : "text-zinc-500"
                      )}>
                        {meso.label}
                      </span>
                    </div>
                    <span className={cn(
                      "text-[8px] font-bold px-1.5 py-0.5 rounded-full",
                      active ? "bg-orange-50 text-orange-600" : "bg-zinc-100 text-zinc-400"
                    )}>{Math.round(percentage)}%</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {filterGroups.map((group) => (
          <div key={group.key} className="space-y-4">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full" />
              {group.label}
            </label>
            <div className="flex flex-wrap gap-x-2 gap-y-2">
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
          className="w-full py-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-100 hover:text-zinc-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <X size={12} />
          Resetar Segmentação
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
      "px-4 py-2.5 rounded-full text-[11px] font-bold transition-all border flex items-center gap-2",
      active 
        ? "bg-orange-600 border-orange-600 text-white shadow-xl shadow-orange-600/30" 
        : "bg-white border-zinc-100 text-zinc-600 hover:border-zinc-200 hover:bg-zinc-50"
    )}
  >
    <span className="truncate max-w-[100px]">{label}</span>
    {percentage !== undefined && (
      <span className={cn(
        "text-[8px] font-black px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[28px]",
        active ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-400"
      )}>
        {Math.round(percentage)}%
      </span>
    )}
  </motion.button>
);
