
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LuxuryCard } from './luxury-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface VictoryPerceptionCardProps {
  data: { name: string; value: number; party?: string | null }[];
  total: number;
  className?: string;
}

export const VictoryPerceptionCard = ({ data, total, className }: VictoryPerceptionCardProps) => {
  const topItems = data.slice(0, 7);

  return (
    <LuxuryCard className={cn("flex-1", className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3 bg-[#10b981] rounded-full" />
            <span className="text-[10px] font-black text-[#10b981] uppercase tracking-widest">Expectativa Real</span>
          </div>
          <h2 className="text-[18px] font-black text-zinc-900 tracking-tight">Percepção de Vitória</h2>
        </div>
        <div className="px-2 py-1 rounded-md bg-zinc-50 border border-zinc-100">
          <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Estimulada</span>
        </div>
      </div>
      
      <p className="text-[10px] font-medium text-zinc-400 italic mb-6">"Quem você acha que ganhará a eleição...?"</p>

      <div className="space-y-4">
        {topItems.map((item, idx) => {
          const pct = total > 0 ? (item.value / total) * 100 : 0;
          const isNeutral = item.name.toLowerCase().includes('nulo') || 
                            item.name.toLowerCase().includes('branco') || 
                            item.name.toLowerCase().includes('não sabe') ||
                            item.name.toLowerCase().includes('ns/nr');

          return (
            <div key={`${item.name}-${idx}`} className={cn("flex items-center gap-3 group", idx === 0 && "winner")}>
              <Avatar className={cn(
                "w-9 h-9 border-2 border-white shadow-sm shrink-0 transition-all group-hover:scale-110",
                idx === 0 && "border-[#10b981]/30 shadow-[#10b981]/10"
              )}>
                <AvatarImage src={`https://picsum.photos/seed/${item.name}/100/100`} />
                <AvatarFallback className="bg-zinc-50 text-[10px] font-bold text-zinc-400">
                  {isNeutral ? 'N/B' : item.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-1.5">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col overflow-hidden">
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-tight leading-none truncate",
                      idx === 0 ? "text-[#10b981]" : "text-zinc-900",
                      isNeutral && "text-zinc-400"
                    )}>
                      {item.name}
                    </span>
                    {item.party && <span className="text-[8px] font-bold text-zinc-400">({item.party})</span>}
                  </div>
                  <span className={cn(
                    "text-[12px] font-black leading-none",
                    idx === 0 ? "text-[#10b981]" : "text-zinc-900",
                    isNeutral && "text-zinc-400"
                  )}>
                    {pct.toFixed(1)}%
                  </span>
                </div>
                
                <div className="w-full h-2.5 bg-zinc-50 rounded-full border border-zinc-100 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1.2, delay: idx * 0.05 }}
                    className={cn(
                      "h-full rounded-full transition-all",
                      isNeutral ? "bg-zinc-300" : "bg-gradient-to-r from-[#10b981] to-[#059669]"
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
