
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { getCandidatePhoto, toTitleCase } from '@/app/page';

interface VictoryPerceptionCardProps {
  data: { name: string; value: number; party?: string | null; isAbstention?: boolean }[];
  total: number;
  overline?: string;
  title?: string;
  question?: string;
  badge?: string;
  className?: string;
  onFilterChange?: (name: string) => void;
  selected?: string[];
}

export const VictoryPerceptionCard = ({ 
  data, 
  total, 
  overline = "CORRIDA GOVERNAMENTAL",
  title = "Percepção de Vitória",
  question = '"Quem você acha que ganhará a eleição...?"',
  badge = "ESTIMULADA",
  className,
  onFilterChange,
  selected = []
}: VictoryPerceptionCardProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lógica de Escala de Líder: O maior valor define o preenchimento de 100% da barra visual
  const maxValue = useMemo(() => {
    if (!data || data.length === 0) return 1;
    return Math.max(...data.map(d => d.value), 1);
  }, [data]);

  return (
    <div 
      className={cn(
        "bg-white rounded-[2rem] p-5 w-full relative overflow-hidden shadow-sm border border-zinc-100 flex flex-col h-full min-h-[320px]",
        className
      )}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3 rounded-full bg-emerald-500" />
            <span className="text-[7px] font-black text-zinc-400 uppercase tracking-[0.2em]">
              {overline}
            </span>
          </div>
          <h2 className="text-base font-black text-zinc-950 tracking-tight leading-none mt-1">
            {title}
          </h2>
          <p className="text-[8px] text-zinc-400 italic font-medium">
            {question}
          </p>
        </div>
        <div className="px-2 py-0.5 rounded-full bg-zinc-50 border border-zinc-100 shadow-sm">
          <span className="text-[6px] font-black text-zinc-400 uppercase tracking-widest">
            {badge}
          </span>
        </div>
      </div>

      <ScrollArea type="always" className="w-full flex-grow">
        <div className="flex justify-around items-end gap-2 pb-6 px-2 min-w-full">
          {data.map((item, idx) => {
            const displayPct = total > 0 ? (item.value / total) * 100 : 0;
            const visualHeight = (item.value / maxValue) * 100;
            
            const isAbstention = item.isAbstention || 
                                 item.name.toLowerCase().includes('nulo') || 
                                 item.name.toLowerCase().includes('branco') || 
                                 item.name.toLowerCase().includes('ns') ||
                                 item.name.toLowerCase().includes('sabe') ||
                                 item.name.toLowerCase().includes('outros');
            
            const isActive = selected.includes(item.name);
            const isFaded = hoveredIndex !== null && hoveredIndex !== idx;

            return (
              <div 
                key={`${item.name}-${idx}`} 
                onMouseEnter={() => setHoveredIndex(idx)}
                onClick={() => onFilterChange?.(item.name)}
                className={cn(
                  "flex flex-col items-center w-14 group cursor-pointer transition-all duration-300 p-1.5 rounded-2xl",
                  isActive && "bg-emerald-50 ring-1 ring-emerald-200 shadow-sm",
                  isFaded && !isActive && "opacity-40 grayscale-[0.5]"
                )}
              >
                <div className="w-6 h-[100px] bg-zinc-50 border border-zinc-100 rounded-full flex flex-col justify-end p-0.5 mb-2 shadow-inner">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: isMounted ? `${visualHeight}%` : 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: idx * 0.05 }}
                    className={cn(
                      "w-full rounded-full bg-gradient-to-b shadow-sm",
                      isAbstention ? "from-zinc-200 to-zinc-400" : "from-emerald-400 to-emerald-600",
                    )}
                  />
                </div>

                <span className={cn(
                  "text-[10px] font-black mb-2 transition-colors tabular-nums",
                  isActive ? "text-emerald-600" : "text-zinc-950"
                )}>
                  {displayPct.toFixed(1).replace('.', ',')}%
                </span>

                <div className="flex flex-col items-center text-center gap-1.5 w-full">
                  <Avatar className={cn(
                    "w-8 h-8 border border-white shadow-md transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-110",
                    isActive && "ring-2 ring-emerald-500 ring-offset-2"
                  )}>
                    <AvatarImage src={getCandidatePhoto(item.name)} />
                    <AvatarFallback className="bg-zinc-100 text-[8px] font-bold text-zinc-400">
                      {isAbstention ? (item.name.toLowerCase().includes('ns') ? 'NS' : (item.name.toLowerCase().includes('outros') ? 'O' : 'N/B')) : item.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="min-h-[2.5em] flex flex-col items-center justify-start w-full px-0.5">
                    <p className={cn(
                      "text-[7px] font-black leading-tight uppercase tracking-tighter w-full line-clamp-2",
                      isActive ? "text-emerald-600" : "text-zinc-900"
                    )}>
                      {item.name}
                    </p>
                    {item.party && (
                      <p className={cn(
                        "text-[6px] font-bold uppercase tracking-widest mt-0.5 text-zinc-400",
                        isActive && "text-emerald-400"
                      )}>
                        ({item.party})
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="h-1.5" />
      </ScrollArea>
    </div>
  );
};
