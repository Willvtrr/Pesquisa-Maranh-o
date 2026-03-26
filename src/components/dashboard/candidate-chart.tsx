
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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

  const totalVotes = useMemo(() => {
    if (total) return total;
    return data.reduce((acc, curr) => acc + curr.value, 0);
  }, [data, total]);

  return (
    <div className="bg-white rounded-[2.5rem] border border-zinc-200/80 p-10 md:p-14 relative overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] group/container h-full flex flex-col">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="relative z-10 mb-12 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-4 bg-[#ea580c] rounded-full"></div>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Corrida Presidencial</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-zinc-950 tracking-tighter leading-none">
            Intenção de Voto Federal
          </h1>
        </div>
        
        <div className="flex items-center gap-2 bg-white border border-zinc-200 shadow-sm px-4 py-2 rounded-full mt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Estimulada</span>
        </div>
      </div>

      <div 
        className="flex-1 flex flex-col gap-8 relative z-10"
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
                "flex items-center gap-6 group/row cursor-default transition-all duration-300",
                hoveredIndex === idx && "translate-x-1"
              )}
              onMouseEnter={() => setHoveredIndex(idx)}
            >
              <div className="w-32 lg:w-44 text-right flex flex-col justify-center flex-shrink-0">
                <span className={cn(
                  "text-[16px] transition-colors leading-tight truncate",
                  idx < 2 ? "font-black text-zinc-950" : "font-bold text-zinc-500",
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
