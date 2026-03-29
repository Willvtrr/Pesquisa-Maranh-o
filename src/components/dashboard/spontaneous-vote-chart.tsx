
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LuxuryCard } from './luxury-card';
import { toTitleCase, getCandidatePhoto } from '@/app/page';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface SpontaneousVoteChartProps {
  data: { name: string; value: number; party?: string | null; isAbstention?: boolean }[];
  total: number;
  overline: string;
  title: string;
  question: string;
  badge: string;
  selected?: string[];
  showPhotos?: boolean;
  noScroll?: boolean;
  onFilterChange: (value: string) => void;
  className?: string;
}

export const SpontaneousVoteChart = ({ 
  data, 
  total, 
  overline, 
  title, 
  question, 
  badge, 
  selected = [], 
  showPhotos = false,
  noScroll = false,
  onFilterChange,
  className
}: SpontaneousVoteChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalVotes = Math.max(total, 1);

  const content = (
    <div 
      className="flex flex-col gap-1 relative z-10"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {data.map((item, idx) => {
        // Barra de Distribuição Proporcional: reflete o percentual real sobre o total de 100%
        const pct = (item.value / totalVotes) * 100;
        const isFaded = hoveredIndex !== null && hoveredIndex !== idx;
        const isAbstention = item.isAbstention;
        const isActive = selected.includes(item.name);
        const displayName = toTitleCase(item.name);

        const barOpacity = isAbstention ? 1 : Math.max(0.2, 1 - (idx * 0.12));

        return (
          <div 
            key={`${item.name}-${idx}`} 
            className={cn(
              "flex items-center gap-3 group/row cursor-pointer transition-all duration-300 p-0.5 rounded-xl",
              hoveredIndex === idx && "translate-x-1",
              isActive && "bg-orange-50/50 ring-1 ring-orange-200 shadow-sm"
            )}
            onMouseEnter={() => setHoveredIndex(idx)}
            onClick={() => onFilterChange(item.name)}
          >
            <div className="flex items-center gap-2.5 w-32 lg:w-40 flex-shrink-0">
              {showPhotos && (
                <Avatar className={cn(
                  "w-8 h-8 border border-white shadow-sm shrink-0 transition-all",
                  isFaded && !isActive && "opacity-40 grayscale",
                  isActive && "ring-2 ring-orange-500"
                )}>
                  <AvatarImage src={getCandidatePhoto(item.name)} />
                  <AvatarFallback className="bg-zinc-100 text-[8px] font-bold text-zinc-400">
                    {isAbstention ? (item.name.toLowerCase().includes('ns') ? 'NS' : (item.name.toLowerCase().includes('outros') ? 'O' : 'N/B')) : item.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="flex flex-col justify-center min-w-0">
                <span className={cn(
                  "text-[10px] transition-colors leading-tight truncate",
                  !isAbstention ? "font-black text-zinc-950" : "font-bold text-zinc-500",
                  isFaded && !isActive && "text-zinc-300",
                  isActive && "text-orange-600 font-black"
                )}>
                  {displayName}
                </span>
                {item.party && (
                  <span className={cn(
                    "text-[6px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5",
                    isFaded && !isActive && "text-zinc-200",
                    isActive && "text-orange-400"
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
                  filter: isFaded && !isActive ? 'grayscale(80%) opacity(40%)' : 'none',
                }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "h-full rounded-full relative transition-all",
                  isActive ? "bg-orange-600" : (isAbstention 
                    ? "bg-zinc-200" 
                    : "bg-gradient-to-r from-[#f27e46] to-[#c44d15]")
                )}
                style={{ opacity: isActive ? 1 : barOpacity }}
              />
            </div>
            
            <div className="w-10 flex-shrink-0 text-right">
              <span className={cn(
                "text-[10px] font-black transition-all duration-300",
                isFaded && !isActive ? "text-zinc-300" : (!isAbstention ? "text-zinc-950" : "text-zinc-500"),
                (hoveredIndex === idx || isActive) && "text-orange-600"
              )}>
                {pct.toFixed(1).replace('.', ',')}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <LuxuryCard 
      className={cn("h-full relative", className)}
    >
      <div className="flex items-start justify-between mb-1">
        <div className="space-y-0.5">
          <h4 className="text-[7px] font-black text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-2">
            <span className="w-1 h-3 bg-orange-600 rounded-full" />
            {overline}
          </h4>
          <p className="text-base font-black text-zinc-950 tracking-tight leading-tight">
            {title}
          </p>
        </div>
        <div className="flex items-center gap-1 py-0.5 px-2 rounded-full bg-zinc-50 border border-zinc-100 shrink-0 shadow-sm mt-1">
          <div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[6px] font-black text-zinc-400 uppercase tracking-widest">{badge}</span>
        </div>
      </div>

      <p className="text-[8px] font-medium text-zinc-400 italic leading-tight mb-2">
        "{question}"
      </p>

      {noScroll ? (
        content
      ) : (
        <ScrollArea type="always" className="h-[300px] pr-4 -mr-4">
          {content}
        </ScrollArea>
      )}
    </LuxuryCard>
  );
};
