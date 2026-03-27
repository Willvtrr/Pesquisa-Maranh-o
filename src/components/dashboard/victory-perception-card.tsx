
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LuxuryCard } from './luxury-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface VictoryPerceptionCardProps {
  data: { name: string; value: number; party?: string | null; isAbstention?: boolean }[];
  total: number;
  className?: string;
}

export const VictoryPerceptionCard = ({ data, total, className }: VictoryPerceptionCardProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <LuxuryCard className={cn("flex-1", className)}>
      <div className="flex items-start justify-between mb-4 border-l-[5px] border-[#10b981] pl-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-[#10b981] uppercase tracking-widest">Expectativa Real</span>
          </div>
          <h2 className="text-[18px] font-black text-zinc-900 tracking-tight leading-none">Percepção de Vitória</h2>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-50 border border-zinc-100 shrink-0 shadow-sm mt-1">
          <div className="w-1 h-1 rounded-full bg-[#10b981] animate-pulse" />
          <span className="text-[7px] font-black text-zinc-400 uppercase tracking-widest">ESTIMULADA</span>
        </div>
      </div>
      
      <p className="text-[10px] font-medium text-zinc-400 italic mb-6">"Quem você acha que ganhará a eleição...?"</p>

      <div className="space-y-4">
        {data.map((item, idx) => {
          const pct = total > 0 ? (item.value / total) * 100 : 0;

          return (
            <div key={`${item.name}-${idx}`} className="flex items-center gap-3 group">
              <Avatar className="w-9 h-9 border-2 border-white shadow-sm shrink-0 transition-all group-hover:scale-110">
                <AvatarImage src={`https://picsum.photos/seed/${item.name}/100/100`} />
                <AvatarFallback className="bg-zinc-50 text-[10px] font-bold text-zinc-400">
                  {item.isAbstention ? 'N/B' : item.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-1.5">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col justify-center min-w-0">
                    <span className={cn(
                      "text-[11px] tracking-tight leading-tight transition-colors",
                      idx < 2 && !item.isAbstention ? "font-black text-zinc-950" : "font-bold text-zinc-500"
                    )}>
                      {item.name}
                    </span>
                    {item.party && <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">({item.party})</span>}
                  </div>
                  <span className={cn(
                    "text-[12px] font-black leading-none",
                    idx < 2 && !item.isAbstention ? "text-zinc-950" : "text-zinc-400"
                  )}>
                    {pct.toFixed(1)}%
                  </span>
                </div>
                
                <div className="w-full h-2.5 bg-zinc-50 rounded-full border border-zinc-100 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: isMounted ? `${pct}%` : 0 }}
                    transition={{ duration: 1.2, delay: idx * 0.05 }}
                    className={cn(
                      "h-full rounded-full transition-all",
                      item.isAbstention || idx >= 2 ? "bg-zinc-200" : "bg-gradient-to-r from-[#10b981] to-[#059669]"
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
