
"use client";

import React, { useState, useMemo } from 'react';
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
  'Ciro Gomes': 'PDT',
  'Simone Tebet': 'MDB'
};

const COLORS = [
  'from-[#c2410c] to-[#ea580c]',
  'from-[#ea580c] to-[#f97316]',
  'bg-[#fdba74]',
  'bg-[#fed7aa]',
  'bg-[#cbd5e1]',
  'bg-[#e2e8f0]',
  'bg-[#c2410c]'
];

export const CandidateChart = ({ data, total }: CandidateChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const totalVotes = useMemo(() => {
    if (total) return total;
    return data.reduce((acc, curr) => acc + curr.value, 0);
  }, [data, total]);

  return (
    <div className="bg-white rounded-[2.5rem] border border-zinc-200/80 p-8 md:p-12 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] transition-all lg:col-span-2">
      <div className="mb-10">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-1.5 h-4 bg-[#ea580c] rounded-full"></div>
          <span className="text-[10px] md:text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">Corrida Presidencial</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
            Intenção de Voto <span className="text-zinc-400 font-semibold">(Estimulada)</span>
          </h2>
        </div>
      </div>

      <div 
        className="flex flex-col gap-5 relative z-10"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {data.map((item, idx) => {
          const pct = totalVotes > 0 ? (item.value / totalVotes) * 100 : 0;
          const isFaded = hoveredIndex !== null && hoveredIndex !== idx;
          const isMain = idx < 2;
          const party = PARTY_MAP[item.name];

          return (
            <div 
              key={item.name} 
              className={cn(
                "flex items-center gap-4 h-9 md:h-11 cursor-default transition-all duration-300",
                hoveredIndex === idx && "translate-x-1"
              )}
              onMouseEnter={() => setHoveredIndex(idx)}
            >
              <div className="w-32 md:w-44 text-right flex flex-col justify-center flex-shrink-0">
                <span className={cn(
                  "text-sm md:text-base leading-tight transition-colors",
                  isMain ? "font-black text-zinc-800" : "font-bold text-zinc-600",
                  isFaded && "text-zinc-300"
                )}>
                  {item.name}
                </span>
                {party && (
                  <span className={cn(
                    "text-[10px] md:text-xs font-semibold text-zinc-400",
                    isFaded && "text-zinc-200"
                  )}>
                    ({party})
                  </span>
                )}
              </div>

              <div className="flex-1 h-full bg-zinc-100 rounded-full relative overflow-visible">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${pct}%`,
                    filter: isFaded ? 'grayscale(80%) opacity(40%)' : 'none',
                    boxShadow: hoveredIndex === idx ? '0 4px 12px -2px rgba(0,0,0,0.15)' : 'none'
                  }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "h-full rounded-full relative transition-all",
                    COLORS[idx % COLORS.length].startsWith('bg') 
                      ? COLORS[idx % COLORS.length] 
                      : `bg-gradient-to-r ${COLORS[idx % COLORS.length]}`
                  )}
                >
                  <span className={cn(
                    "absolute -right-12 md:-right-16 top-1/2 -translate-y-1/2 text-sm md:text-lg font-black transition-all duration-300",
                    isFaded ? "text-zinc-300" : "text-zinc-600",
                    hoveredIndex === idx && "scale-110 text-zinc-900"
                  )}>
                    {pct.toFixed(1)}%
                  </span>
                </motion.div>
              </div>
              <div className="w-10 md:w-14 flex-shrink-0"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
