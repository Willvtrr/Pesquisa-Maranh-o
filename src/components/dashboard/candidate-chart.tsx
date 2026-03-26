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
  'Nenhum/Branco/Nulo': 'bg-[#fdba74]',
  'NS/NR': 'bg-[#fed7aa]',
  'Tarcísio de Freitas': 'bg-[#cbd5e1]',
  'Ratinho Jr.': 'bg-[#e2e8f0]',
  'Ronaldo Caiado': 'bg-[#c2410c]',
  'Eduardo Leite': 'bg-[#cbd5e1]',
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
    <div className="bg-white rounded-[2rem] border border-zinc-200/80 p-6 lg:p-8 shadow-[0_20px_50px_rgba(234,88,12,0.04)] hover:shadow-[0_30px_60px_rgba(234,88,12,0.08)] transition-all lg:col-span-2 group/container overflow-hidden">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-3.5 bg-[#ea580c] rounded-full"></div>
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Corrida Presidencial</span>
        </div>
        <h2 className="text-[22px] font-black text-zinc-900 tracking-tight leading-none">
          Intenção de Voto <span className="text-zinc-400 font-medium">(Estimulada)</span>
        </h2>
      </div>

      <div 
        className="flex flex-col gap-4 relative z-10 chart-container"
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
                "flex items-center gap-4 h-9 cursor-default transition-all duration-300 chart-row",
                hoveredIndex === idx && "translate-x-1"
              )}
              onMouseEnter={() => setHoveredIndex(idx)}
            >
              <div className="w-32 lg:w-40 text-right flex flex-col justify-center flex-shrink-0">
                <span className={cn(
                  "text-[13px] transition-colors leading-tight",
                  idx < 2 ? "font-black text-zinc-800" : "font-bold text-zinc-500",
                  isFaded && "text-zinc-300"
                )}>
                  {item.name}
                </span>
                {party && (
                  <span className={cn(
                    "text-[10px] font-bold text-zinc-400 transition-colors",
                    isFaded && "text-zinc-200"
                  )}>
                    ({party})
                  </span>
                )}
              </div>

              <div className="flex-1 h-[26px] bg-zinc-50 rounded-full relative overflow-visible border border-zinc-100/50">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ 
                    width: isMounted ? `${pct}%` : 0,
                    filter: isFaded ? 'grayscale(80%) opacity(40%)' : 'none',
                    boxShadow: hoveredIndex === idx ? '0 4px 12px -2px rgba(234,88,12,0.2)' : 'none'
                  }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "h-full rounded-full relative transition-all flex items-center justify-end pr-2",
                    barColor
                  )}
                >
                  <span className={cn(
                    "absolute -right-14 top-1/2 -translate-y-1/2 text-[14px] font-black transition-all duration-300",
                    isFaded ? "text-zinc-300" : "text-zinc-700",
                    hoveredIndex === idx && "scale-105 text-zinc-950"
                  )}>
                    {pct.toFixed(1)}%
                  </span>
                </motion.div>
              </div>
              <div className="w-12 flex-shrink-0"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
