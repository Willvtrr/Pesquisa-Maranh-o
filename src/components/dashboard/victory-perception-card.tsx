
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LuxuryCard } from './luxury-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getCandidatePhoto, toTitleCase } from '@/app/page';

interface VictoryPerceptionCardProps {
  data: { name: string; value: number; party?: string | null; isAbstention?: boolean }[];
  total: number;
  className?: string;
}

export const VictoryPerceptionCard = ({ data, total, className }: VictoryPerceptionCardProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <LuxuryCard className={cn("flex-1", className)}>
      <div className="flex items-start justify-between mb-1">
        <div className="space-y-0.5">
          <h4 className="text-[7px] font-black text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-2">
            <span className="w-1 h-3 bg-[#10b981] rounded-full" />
            CORRIDA ESTADUAL
          </h4>
          <p className="text-base font-black text-zinc-950 tracking-tight leading-tight">Percepção de Vitória</p>
        </div>
        <div className="flex items-center gap-1 py-0.5 px-2 rounded-full bg-zinc-50 border border-zinc-100 shrink-0 shadow-sm">
          <div className="w-1 h-1 rounded-full bg-[#10b981] animate-pulse" />
          <span className="text-[6px] font-black text-zinc-400 uppercase tracking-widest">ESTIMULADA</span>
        </div>
      </div>
      
      <p className="text-[9px] font-medium text-zinc-400 italic mb-6">"Quem você acha que ganhará a eleição...?"</p>

      <div 
        className="space-y-4"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {data.map((item, idx) => {
          const pct = total > 0 ? (item.value / total) * 100 : 0;
          const isAbstention = item.isAbstention || item.name.toLowerCase().includes('outros');
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
              <Avatar className={cn(
                "w-8 h-8 border-2 border-white shadow-sm shrink-0 transition-all",
                isFaded && "opacity-40 grayscale"
              )}>
                <AvatarImage src={getCandidatePhoto(item.name)} />
                <AvatarFallback className="bg-zinc-100 text-[8px] font-bold text-zinc-400">
                  {isAbstention ? (item.name.toLowerCase().includes('ns') ? 'NS' : item.name.toLowerCase().includes('outros') ? 'O' : 'N/B') : item.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col justify-center min-w-0">
                    <span className={cn(
                      "text-[10px] tracking-tight leading-tight transition-colors",
                      idx < 2 && !isAbstention ? "font-black text-zinc-950" : "font-bold text-zinc-500",
                      isFaded && "text-zinc-300"
                    )}>
                      {displayName}
                    </span>
                    {item.party && (
                      <span className={cn(
                        "text-[6px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5",
                        isFaded && "text-zinc-200"
                      )}>
                        ({item.party})
                      </span>
                    )}
                  </div>
                  <span className={cn(
                    "text-[10px] font-black leading-none transition-colors",
                    isFaded ? "text-zinc-300" : (idx < 2 && !isAbstention ? "text-zinc-950" : "text-zinc-400"),
                    hoveredIndex === idx && "text-emerald-600"
                  )}>
                    {pct.toFixed(1)}%
                  </span>
                </div>
                
                <div className="w-full h-2 bg-zinc-50 rounded-full border border-zinc-100 overflow-hidden group-hover/row:border-emerald-100 transition-colors">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: isMounted ? `${pct}%` : 0,
                      filter: isFaded ? 'grayscale(80%) opacity(40%)' : 'none',
                    }}
                    transition={{ duration: 1.2, delay: idx * 0.05 }}
                    className={cn(
                      "h-full rounded-full transition-all",
                      isAbstention || idx >= 2 ? "bg-zinc-200" : "bg-gradient-to-r from-[#10b981] to-[#059669]"
                    )}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </LuxuryCard>
  );
};
