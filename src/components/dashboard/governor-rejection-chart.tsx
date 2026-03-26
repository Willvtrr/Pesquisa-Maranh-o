
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LuxuryCard } from './luxury-card';

interface GovernorRejectionChartProps {
  data: { name: string; value: number; party?: string | null }[];
  total: number;
}

const COLORS: Record<string, string> = {
  'NS/NR': 'bg-zinc-200',
  'Nenhum/Branco/Nulo': 'bg-zinc-300',
};

export const GovernorRejectionChart = ({ data, total }: GovernorRejectionChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <LuxuryCard className="h-full relative">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-1">
          <h4 className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-2">
            <span className="w-1 h-3 bg-rose-600 rounded-full" />
            TETO ELEITORAL ESTADUAL
          </h4>
          <p className="text-[16px] font-black text-zinc-950 tracking-tight leading-tight">
            Índice de Rejeição
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-50 border border-zinc-100 shrink-0">
          <span className="text-[7px] font-black text-zinc-400 uppercase tracking-widest">Estimulada</span>
        </div>
      </div>

      <p className="text-[10px] font-medium text-zinc-400 italic leading-tight mb-6">
        "REJEIÇÃO: Em quem você NÃO votaria de jeito nenhum?"
      </p>

      <div 
        className="flex-1 flex flex-col gap-4 relative z-10"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {data.map((item, idx) => {
          const pct = total > 0 ? (item.value / total) * 100 : 0;
          const isFaded = hoveredIndex !== null && hoveredIndex !== idx;
          const barColor = COLORS[item.name] || 'bg-rose-500';

          return (
            <div 
              key={`${item.name}-${idx}`} 
              className={cn(
                "flex items-center gap-3 group/row cursor-default transition-all duration-300",
                hoveredIndex === idx && "translate-x-1"
              )}
              onMouseEnter={() => setHoveredIndex(idx)}
            >
              <div className="w-24 text-right flex flex-col justify-center flex-shrink-0">
                <span className={cn(
                  "text-[10px] transition-colors leading-tight truncate",
                  idx < 2 ? "font-black text-zinc-950" : "font-bold text-zinc-500",
                  isFaded && "text-zinc-300"
                )}>
                  {item.name}
                </span>
                {item.party && (
                  <span className={cn(
                    "text-[7px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5",
                    isFaded && "text-zinc-200"
                  )}>
                    ({item.party})
                  </span>
                )}
              </div>

              <div className="flex-1 h-6 bg-zinc-50 rounded-full relative border border-zinc-100 overflow-hidden group-hover/row:border-rose-100 transition-colors">
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
              
              <div className="w-10 flex-shrink-0">
                <span className={cn(
                  "text-[10px] font-black transition-all duration-300",
                  isFaded ? "text-zinc-300" : "text-zinc-950",
                  hoveredIndex === idx && "text-rose-600"
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
