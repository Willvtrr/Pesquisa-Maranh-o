
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LuxuryCard } from './luxury-card';

interface CandidateChartProps {
  data: { name: string; value: number }[];
  total?: number;
}

const PARTY_MAP: Record<string, string> = {
  'Lula': 'PT',
  'Flávio Bolsonaro': 'PL',
  'Jair Bolsonaro': 'PL',
  'Tarcísio de Freitas': 'REPUBLICANOS',
  'Ratinho Jr.': 'PSD',
  'Ronaldo Caiado': 'UNIÃO',
  'Eduardo Leite': 'PSD',
  'Ciro Gomes': 'PDT',
  'Simone Tebet': 'MDB'
};

const COLORS: Record<string, string> = {
  'Lula': 'bg-[#c2410c]',
  'Flávio Bolsonaro': 'bg-[#ea580c]',
  'Jair Bolsonaro': 'bg-[#ea580c]',
  'Nenhum/Branco/Nulo': 'bg-zinc-300',
  'NS/NR': 'bg-zinc-200',
};

export const CandidateChart = ({ data, total }: CandidateChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalVotes = total || data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <LuxuryCard 
      title="CORRIDA PRESIDENCIAL" 
      subtitle="Intenção de Voto Federal"
      className="h-full"
    >
      <div className="absolute top-4 right-6 flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-50 border border-zinc-100">
        <div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" />
        <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Estimulada</span>
      </div>

      <div 
        className="flex-1 flex flex-col gap-5 mt-6 relative z-10"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {data.map((item, idx) => {
          const pct = totalVotes > 0 ? (item.value / totalVotes) * 100 : 0;
          const isFaded = hoveredIndex !== null && hoveredIndex !== idx;
          const party = PARTY_MAP[item.name];
          const barColor = COLORS[item.name] || 'bg-zinc-200';

          return (
            <div 
              key={item.name} 
              className={cn(
                "flex items-center gap-4 group/row cursor-default transition-all duration-300",
                hoveredIndex === idx && "translate-x-1"
              )}
              onMouseEnter={() => setHoveredIndex(idx)}
            >
              <div className="w-24 lg:w-32 text-right flex flex-col justify-center flex-shrink-0">
                <span className={cn(
                  "text-[12px] transition-colors leading-tight truncate",
                  idx < 2 ? "font-black text-zinc-950" : "font-bold text-zinc-500",
                  isFaded && "text-zinc-300"
                )}>
                  {item.name}
                </span>
                {party && (
                  <span className={cn(
                    "text-[8px] font-black text-zinc-400 uppercase tracking-widest mt-0.5",
                    isFaded && "text-zinc-200"
                  )}>
                    ({party})
                  </span>
                )}
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
                  "text-sm font-black transition-all duration-300",
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
