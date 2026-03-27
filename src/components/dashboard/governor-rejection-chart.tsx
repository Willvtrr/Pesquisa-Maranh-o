"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { getCandidatePhoto, toTitleCase } from '@/app/page';

interface GovernorRejectionChartProps {
  data: { name: string; value: number; party?: string | null }[];
  total: number;
  title: string;
  overline: string;
  subtitle: string;
  badge: string;
  color?: 'red' | 'rose';
  selected?: string[];
  onFilterChange?: (name: string) => void;
}

export const GovernorRejectionChart = ({ 
  data, 
  total, 
  title,
  overline,
  subtitle,
  badge,
  color = 'red',
  selected = [],
  onFilterChange
}: GovernorRejectionChartProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const barColorClass = color === 'red' 
    ? "from-[#ef4444] to-[#b91c1c]" 
    : "from-[#f43f5e] to-[#be123c]";

  const overlineColorClass = color === 'red' ? "bg-[#dc2626]" : "bg-[#e11d48]";

  return (
    <div className="bg-white rounded-[2rem] p-5 w-full relative overflow-hidden shadow-sm border border-zinc-100 flex flex-col h-full min-h-[320px]">
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={cn("w-1 h-3 rounded-full", overlineColorClass)} />
            <span className="text-[7px] font-black text-zinc-400 uppercase tracking-[0.2em]">
              {overline}
            </span>
          </div>
          <h2 className="text-base font-black text-zinc-950 tracking-tight leading-none mt-1">
            {title}
          </h2>
          <p className="text-[8px] text-zinc-400 italic font-medium">
            {subtitle}
          </p>
        </div>
        <div className="px-2 py-0.5 rounded-full bg-zinc-50 border border-zinc-100 shadow-sm">
          <span className="text-[6px] font-black text-zinc-400 uppercase tracking-widest">
            {badge}
          </span>
        </div>
      </div>

      <ScrollArea className="w-full flex-grow">
        <div className="flex justify-around items-end gap-2 pb-6 px-2 min-w-full">
          {data.map((item, idx) => {
            const pct = total > 0 ? (item.value / total) * 100 : 0;
            const isAbstention = item.name.toLowerCase().includes('nulo') || 
                                 item.name.toLowerCase().includes('branco') || 
                                 item.name.toLowerCase().includes('ns') ||
                                 item.name.toLowerCase().includes('sabe') ||
                                 item.name.toLowerCase().includes('outros');
            const isActive = selected.includes(item.name);

            return (
              <div 
                key={`${item.name}-${idx}`} 
                onClick={() => onFilterChange?.(item.name)}
                className={cn(
                  "flex flex-col items-center w-14 group cursor-pointer transition-all duration-300 p-1.5 rounded-2xl",
                  isActive && "bg-orange-50 ring-1 ring-orange-100 shadow-sm"
                )}
              >
                <div className="w-6 h-[100px] bg-zinc-50 border border-zinc-100 rounded-full flex flex-col justify-end p-0.5 mb-2 shadow-inner">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: isMounted ? `${pct}%` : 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: idx * 0.05 }}
                    className={cn(
                      "w-full rounded-full bg-gradient-to-b shadow-sm",
                      isAbstention ? "from-zinc-200 to-zinc-400" : barColorClass,
                    )}
                  />
                </div>

                <span className={cn(
                  "text-[10px] font-black mb-2 transition-colors tabular-nums",
                  isActive ? "text-orange-600" : "text-zinc-950"
                )}>
                  {pct.toFixed(1).replace('.', ',')}%
                </span>

                <div className="flex flex-col items-center text-center gap-1.5 w-full">
                  <Avatar className={cn(
                    "w-8 h-8 border border-white shadow-md transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-110",
                    isActive && "ring-2 ring-orange-500 ring-offset-2"
                  )}>
                    <AvatarImage src={getCandidatePhoto(item.name)} />
                    <AvatarFallback className="bg-zinc-100 text-[8px] font-bold text-zinc-400">
                      {isAbstention ? (item.name.toLowerCase().includes('ns') ? 'NS' : (item.name.toLowerCase().includes('outros') ? 'O' : 'N/B')) : item.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="min-h-[2.5em] flex flex-col items-center justify-start w-full px-0.5">
                    <p className={cn(
                      "text-[7px] font-black leading-tight uppercase tracking-tighter w-full line-clamp-2",
                      isActive ? "text-orange-600" : "text-zinc-900"
                    )}>
                      {item.name}
                    </p>
                    {item.party && (
                      <p className={cn(
                        "text-[6px] font-bold uppercase tracking-widest mt-0.5 text-zinc-400",
                        isActive && "text-orange-400"
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