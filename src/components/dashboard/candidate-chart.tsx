"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LuxuryCard } from './luxury-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getCandidatePhoto, toTitleCase } from '@/app/page';

interface CandidateChartProps {
  data: { name: string; value: number; party?: string | null; isAbstention?: boolean }[];
  total?: number;
}

export const CandidateChart = ({ data, total }: CandidateChartProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalVotes = total || 1;

  return (
    <LuxuryCard className="h-full relative">
      <div className="flex items-start justify-between mb-1">
        <div className="space-y-0.5">
          <h4 className="text-[7px] font-black text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-2">
            <span className="w-1 h-3 bg-orange-600 rounded-full" />
            DISPUTA PRESIDENCIAL
          </h4>
          <p className="text-base font-black text-zinc-950 tracking-tight leading-tight">Intenção de voto presidente</p>
        </div>
        <div className="flex items-center gap-1 py-0.5 px-2 rounded-full bg-zinc-50 border border-zinc-100 shrink-0 shadow-sm">
          <div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[6px] font-black text-zinc-400 uppercase tracking-widest">ESTIMULADA</span>
        </div>
      </div>

      <p className="text-[9px] font-medium text-zinc-400 italic mb-6">
        "Se as eleições para Presidente da República fossem hoje, em quem você votaria?"
      </p>

      <div 
        className="flex-1 flex flex-col gap-4 relative z-10 overflow-y-auto pr-1 max-h-[600px] no-scrollbar"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {data.map((item, idx) => {
          const pct = (item.value / totalVotes) * 100;
          const isAbstention = item.isAbstention;
          const displayName = toTitleCase(item.name);
          const isFaded = hoveredIndex !== null && hoveredIndex !== idx;

          return (
            <div 
              key={`${item.name}-${idx}`} 
              className={cn(
                "flex items-center gap-3 group/row cursor-pointer transition-all duration-300",
                hoveredIndex === idx && "translate-x-1"
              )}
              onMouseEnter={() => setHoveredIndex(idx)}
            >
              <div className="flex items-center gap-2.5 w-32 lg:w-40 shrink-0">
                <Avatar className={cn(
                  "w-8 h-8 border border-white shadow-sm shrink-0 transition-all",
                  isFaded && "opacity-40 grayscale"
                )}>
                  <AvatarImage src={getCandidatePhoto(item.name)} />
                  <AvatarFallback className="bg-zinc-100 text-[8px] font-bold text-zinc-400">
                    {isAbstention ? (item.name.toLowerCase().includes('ns') ? 'NS' : 'N/B') : item.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-center min-w-0">
                  <span className={cn(
                    "text-[10px] leading-tight truncate transition-colors",
                    idx < 2 && !isAbstention ? "font-black text-zinc-950" : "font-bold text-zinc-500",
                    isFaded && "text-zinc-300"
                  )}>
                    {displayName}
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
              </div>

              <div className="flex-1 h-2 bg-zinc-50 rounded-full relative border border-zinc-100 overflow-hidden group-hover/row:border-orange-100 transition-colors">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ 
                    width: isMounted ? `${pct}%` : 0,
                    filter: isFaded ? 'grayscale(80%) opacity(40%)' : 'none',
                  }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "h-full rounded-full transition-all",
                    idx < 2 && !isAbstention 
                      ? "bg-gradient-to-r from-[#f27e46] to-[#c44d15]" 
                      : "bg-zinc-200"
                  )}
                />
              </div>
              
              <div className="w-10 shrink-0 text-right">
                <span className={cn(
                  "text-[10px] font-black transition-all duration-300",
                  isFaded ? "text-zinc-300" : (idx < 2 && !isAbstention ? "text-zinc-950" : "text-zinc-500"),
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