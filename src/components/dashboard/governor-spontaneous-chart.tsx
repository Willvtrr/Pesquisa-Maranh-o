
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

    return [...candidates.slice(0, 5), ...abstentions];
  }, [data, total]);

  return (
    <div className="bg-white rounded-[2.5rem] border border-zinc-200/80 p-10 md:p-14 relative overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] group/container h-full flex flex-col">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="relative z-10 mb-12 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-4 bg-[#ea580c] rounded-full"></div>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Monitoramento Estadual</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-zinc-950 tracking-tighter leading-none">
            Intenção de Voto Governador
          </h1>
        </div>
        
        <div className="flex items-center gap-2 bg-white border border-zinc-200 shadow-sm px-4 py-2 rounded-full mt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Espontânea</span>
        </div>
      </div>

      <div 
        className="flex-1 flex flex-col gap-8 relative z-10"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {processedData.map((item, idx) => {
          const pct = total > 0 ? (item.value / total) * 100 : 0;
          const isFaded = hoveredIndex !== null && hoveredIndex !== idx;
          const party = PARTY_MAP[item.name];
          const barColor = COLORS[item.name] || (item.isAbstention ? 'bg-zinc-200' : 'bg-[#ea580c]');

          return (
            <div 
              key={`${item.name}-${idx}`} 
              className={cn(
                "flex items-center gap-6 group/row cursor-pointer transition-all duration-300",
                hoveredIndex === idx && "translate-x-1"
              )}
              onMouseEnter={() => setHoveredIndex(idx)}
              onClick={() => onFilterChange('gov_spontaneous', item.name)}
            >
              <div className="w-32 lg:w-44 text-right flex flex-col justify-center flex-shrink-0">
                <span className={cn(
                  "text-[16px] transition-colors leading-tight truncate",
                  idx < 2 && !item.isAbstention ? "font-black text-zinc-950" : "font-bold text-zinc-500",
                  isFaded && "text-zinc-300"
                )}>
                  {item.name}
                </span>
                {party && (
                  <span className={cn(
                    "text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1",
                    isFaded && "text-zinc-200"
                  )}>
                    ({party})
                  </span>
                )}
              </div>

              <div className="flex-1 h-12 bg-zinc-50 rounded-full relative border border-zinc-100 overflow-hidden group-hover/row:border-orange-100 transition-colors">
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
              
              <div className="w-16 flex-shrink-0">
                <span className={cn(
                  "text-xl font-black transition-all duration-300",
                  isFaded ? "text-zinc-300" : "text-zinc-950",
                  hoveredIndex === idx && "scale-110 text-orange-600"
                )}>
                  {pct.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
