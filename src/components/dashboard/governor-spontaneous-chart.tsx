
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
  'Felipe Camarão': 'bg-[#ea580c]',
  'Weverton Rocha': 'bg-[#ea580c]',
  'Branco/Nulo': 'bg-[#fdba74]',
  'NS/NR': 'bg-[#fed7aa]',
  'Outros': 'bg-[#cbd5e1]',
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

    return [...candidates.slice(0, 5), ...abstentions];
  }, [data, total]);

  return (
    <div className="bg-white rounded-[2.5rem] border border-zinc-200/80 p-8 md:p-14 relative overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] group/container h-full">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="relative z-10 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-1.5 h-4 bg-[#ea580c] rounded-full"></div>
            <span className="text-[10px] md:text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">Monitoramento Estadual</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-zinc-950 tracking-tight leading-none">
            Intenção de Voto Governador
          </h1>
        </div>
        
        <div className="flex items-center gap-2 bg-white border border-zinc-200 shadow-sm px-4 py-2 rounded-full w-fit">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ea580c]"></span>
          </span>
          <span className="text-[11px] font-black text-zinc-700 uppercase tracking-widest">Espontânea</span>
        </div>
      </div>

      <div 
        className="flex flex-col gap-5 relative z-10 chart-container"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {processedData.map((item, idx) => {
          const pct = total > 0 ? (item.value / total) * 100 : 0;
          const isFaded = hoveredIndex !== null && hoveredIndex !== idx;
          const party = PARTY_MAP[item.name];
          const barColor = COLORS[item.name] || (item.isAbstention ? 'bg-zinc-200' : 'bg-zinc-200');

          return (
            <div 
              key={`${item.name}-${idx}`} 
              className={cn(
                "flex items-center gap-5 h-10 cursor-pointer transition-all duration-300 chart-row",
                hoveredIndex === idx && "translate-x-1"
              )}
              onMouseEnter={() => setHoveredIndex(idx)}
              onClick={() => onFilterChange('gov_spontaneous', item.name)}
            >
              <div className="w-32 lg:w-48 text-right flex flex-col justify-center flex-shrink-0">
                <span className={cn(
                  "text-[14px] transition-colors leading-tight truncate",
                  idx < 2 && !item.isAbstention ? "font-black text-zinc-800" : "font-bold text-zinc-500",
                  isFaded && "text-zinc-300"
                )}>
                  {item.name}
                </span>
                {party && (
                  <span className={cn(
                    "text-[10px] font-black text-zinc-400 transition-colors uppercase tracking-widest",
                    isFaded && "text-zinc-200"
                  )}>
                    ({party})
                  </span>
                )}
              </div>

              <div className="flex-1 h-[32px] bg-zinc-50 rounded-full relative overflow-visible border border-zinc-100/50 shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ 
                    width: isMounted ? `${pct}%` : 0,
                    filter: isFaded ? 'grayscale(80%) opacity(40%)' : 'none',
                    boxShadow: hoveredIndex === idx ? '0 4px 12px -2px rgba(234,88,12,0.2)' : 'none'
                  }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "h-full rounded-full relative transition-all flex items-center justify-end pr-3",
                    idx === 0 && !item.isAbstention ? "bg-[#c2410c]" : 
                    !item.isAbstention ? "bg-[#ea580c]" : "bg-zinc-300"
                  )}
                >
                  <span className={cn(
                    "absolute -right-16 top-1/2 -translate-y-1/2 text-[15px] font-black transition-all duration-300",
                    isFaded ? "text-zinc-300" : "text-zinc-700",
                    hoveredIndex === idx && "scale-105 text-zinc-950"
                  )}>
                    {pct.toFixed(1)}%
                  </span>
                </motion.div>
              </div>
              <div className="w-14 flex-shrink-0"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
