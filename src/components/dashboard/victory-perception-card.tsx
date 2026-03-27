
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <LuxuryCard className={cn("flex-1", className)}>
      <div className="flex items-start justify-between mb-2">
        <div className="space-y-1">
          <h4 className="text-[9px] lg:text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-2">
            <span className="w-1 h-3 bg-[#10b981] rounded-full" />
            Expectativa Real
          </h4>
          <p className="text-[18px] font-black text-zinc-950 tracking-tight leading-tight">Percepção de Vitória</p>
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
          const isAbstention = item.isAbstention || item.name.toLowerCase().includes('outros');
          const displayName = toTitleCase(item.name);

          return (
            <div key={`${item.name}-${idx}`} className="flex items-center gap-3 group">
              <Avatar className="w-9 h-9 border-2 border-white shadow-sm shrink-0 transition-all group-hover:scale-110">
                <AvatarImage src={getCandidatePhoto(item.name)} />
                <AvatarFallback className="bg-zinc-100 text-[10px] font-bold text-zinc-400">
                  {isAbstention ? (item.name.toLowerCase().includes('ns') ? 'NS' : item.name.toLowerCase().includes('outros') ? 'O' : 'N/B') : item.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-1.5">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col justify-center min-w-0">
                    <span className={cn(
                      "text-[11px] tracking-tight leading-tight transition-colors",
                      idx < 2 && !isAbstention ? "font-black text-zinc-950" : "font-bold text-zinc-500"
                    )}>
                      {displayName}
                    </span>
                    {item.party && <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">({item.party})</span>}
                  </div>
                  <span className={cn(
                    "text-[12px] font-black leading-none",
                    idx < 2 && !isAbstention ? "text-zinc-950" : "text-zinc-400"
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
