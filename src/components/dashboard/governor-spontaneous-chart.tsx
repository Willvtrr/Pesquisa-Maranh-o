
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LuxuryCard } from './luxury-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getCandidatePhoto, toTitleCase } from '@/app/page';

interface GovernorSpontaneousChartProps {
  data: { name: string; value: number }[];
  total: number;
  filters: Record<string, string[]>;
  onFilterChange: (key: string, value: string) => void;
}

const PARTY_MAP: Record<string, string> = {
  'Carlos Brandão': 'PSB',
  'Orleans Brandão': 'MDB',
  'Brandão': 'PSB',
  'Felipe Camarão': 'PT',
  'Edivaldo Holanda Jr.': 'PSD',
  'Weverton Rocha': 'PDT',
  'Josimar de Maranhãozinho': 'PL',
  'Roberto Rocha': 'PSDB',
  'Lahésio Bonfim': 'NOVO',
  'Roseana Sarney': 'MDB',
  'Roseana': 'MDB',
  'Iracema Vale': 'PSB',
  'Othelino Neto': 'PCdoB',
  'Eduardo Braide': 'PSD',
  'Flávio Dino': 'PSB',
  'Dino': 'PSB'
};

const COLORS: Record<string, string> = {
  'Carlos Brandão': 'bg-[#c2410c]',
  'Eduardo Braide': 'bg-[#ea580c]',
  'Weverton Rocha': 'bg-[#ea580c]',
  'NS/NR': 'bg-zinc-200',
  'Branco/Nulo': 'bg-zinc-100',
};

export const GovernorSpontaneousChart = ({ data, total, filters, onFilterChange }: GovernorSpontaneousChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const processedData = useMemo(() => {
    if (!data || data.length === 0 || total === 0) return [];

    const indecisionKeywords = ["ns/nr", "não sabe", "não respondeu", "não opinou", "indeciso", "nsnr"];
    const brancoKeywords = ["branco", "nulo", "nenhum", "ninguém"];

    let items = data.map(item => ({
      name: item.name.trim(),
      value: item.value,
      isAbstention: indecisionKeywords.some(kw => item.name.toLowerCase().includes(kw)) || 
                     brancoKeywords.some(kw => item.name.toLowerCase().includes(kw))
    }));

    const candidates = items.filter(i => !i.isAbstention).sort((a, b) => b.value - a.value);
    const abstentions = items.filter(i => i.isAbstention).sort((a, b) => b.value - a.value);

    // No slices - All rows Power BI style
    return [...candidates, ...abstentions];
  }, [data, total]);

  return (
    <LuxuryCard 
      className="h-full relative"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="space-y-1">
          <h4 className="text-[9px] lg:text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-2">
            <span className="w-1 h-3 bg-orange-600 rounded-full" />
            MONITORAMENTO ESTADUAL
          </h4>
          <p className="text-[18px] font-black text-zinc-950 tracking-tight leading-tight">
            Intenção de Voto Governador
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-50 border border-zinc-100 shrink-0 shadow-sm mt-1">
          <div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[7px] font-black text-zinc-400 uppercase tracking-widest text-[7px]">ESPONTÂNEA</span>
        </div>
      </div>

      <p className="text-[11px] font-medium text-zinc-400 italic leading-tight mb-8">
        "Se as eleições para Governador fossem hoje, em quem você votaria?"
      </p>

      <div 
        className="flex-1 flex flex-col gap-5 relative z-10 overflow-y-auto pr-2 max-h-[600px] no-scrollbar"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {processedData.map((item, idx) => {
          const pct = total > 0 ? (item.value / total) * 100 : 0;
          const isFaded = hoveredIndex !== null && hoveredIndex !== idx;
          const party = PARTY_MAP[item.name];
          const barColor = COLORS[item.name] || (item.isAbstention ? 'bg-zinc-200' : 'bg-[#ea580c]');
          const displayName = toTitleCase(item.name);

          return (
            <div 
              key={`${item.name}-${idx}`} 
              className={cn(
                "flex items-center gap-4 group/row cursor-pointer transition-all duration-300",
                hoveredIndex === idx && "translate-x-1"
              )}
              onMouseEnter={() => setHoveredIndex(idx)}
              onClick={() => onFilterChange('gov_spontaneous', item.name)}
            >
              <div className="flex items-center gap-3 w-32 lg:w-44 flex-shrink-0">
                <Avatar className={cn(
                  "w-8 h-8 border border-white shadow-sm shrink-0 transition-transform group-hover/row:scale-110",
                  isFaded && "opacity-40 grayscale"
                )}>
                  <AvatarImage src={getCandidatePhoto(item.name)} />
                  <AvatarFallback className="bg-zinc-100 text-[9px] font-bold text-zinc-400">
                    {item.isAbstention ? (item.name.includes('NS') ? 'NS' : 'N/B') : item.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-center min-w-0">
                  <span className={cn(
                    "text-[11px] transition-colors leading-tight truncate",
                    idx < 2 && !item.isAbstention ? "font-black text-zinc-950" : "font-bold text-zinc-500",
                    isFaded && "text-zinc-300"
                  )}>
                    {displayName}
                  </span>
                  {party && (
                    <span className={cn(
                      "text-[8px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5",
                      isFaded && "text-zinc-200"
                    )}>
                      ({party})
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1 h-8 bg-zinc-50 rounded-full relative border border-zinc-100 overflow-hidden group-hover/row:border-orange-100 transition-colors">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ 
                    width: isMounted ? `${pct}%` : 0,
                    filter: isFaded ? 'grayscale(80%) opacity(40%)' : 'none',
                  }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "h-full rounded-full relative transition-all",
                    barColor
                  )}
                />
              </div>
              
              <div className="w-12 flex-shrink-0">
                <span className={cn(
                  "text-[12px] font-black transition-all duration-300",
                  isFaded ? "text-zinc-300" : "text-zinc-950",
                  hoveredIndex === idx && "text-orange-600"
                )}>
                  {pct.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </LuxuryCard>
  );
};
