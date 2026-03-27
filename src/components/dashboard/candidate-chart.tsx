
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LuxuryCard } from './luxury-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CandidateChartProps {
  data: { name: string; value: number; party?: string | null; isAbstention?: boolean }[];
  total?: number;
}

const COLORS: Record<string, string> = {
  'Lula': 'bg-gradient-to-r from-[#f27e46] to-[#c44d15]',
  'Flávio Bolsonaro': 'bg-gradient-to-r from-[#f27e46] to-[#c44d15]',
  'Jair Bolsonaro': 'bg-gradient-to-r from-[#f27e46] to-[#c44d15]',
};

export const CandidateChart = ({ data, total }: CandidateChartProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalVotes = total || data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <LuxuryCard className="h-full relative">
      <div className="flex items-start justify-between mb-2 border-l-[5px] border-[#e66324] pl-4">
        <div className="space-y-1">
          <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.15em]">CORRIDA PRESIDENCIAL</h4>
          <p className="text-[18px] font-black text-zinc-950 tracking-tight leading-tight">Intenção de Voto Federal</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-50 border border-zinc-100 shrink-0 shadow-sm mt-1">
          <div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[7px] font-black text-zinc-400 uppercase tracking-widest">ESTIMULADA</span>
        </div>
      </div>

      <p className="text-[11px] font-medium text-zinc-400 italic leading-tight mb-8">
        "Se as eleições para Presidente da República fossem hoje, em quem você votaria?"
      </p>

      <div className="flex-1 flex flex-col gap-5 relative z-10">
        {data.map((item, idx) => {
          const pct = totalVotes > 0 ? (item.value / totalVotes) * 100 : 0;
          const barColor = item.isAbstention ? 'bg-zinc-200' : (COLORS[item.name] || 'bg-gradient-to-r from-[#f27e46] to-[#c44d15]');

          return (
            <div key={`${item.name}-${idx}`} className="flex items-center gap-4 group/row">
              <div className="flex items-center gap-3 w-36 lg:w-48 shrink-0">
                <Avatar className="w-9 h-9 border border-white shadow-sm shrink-0 transition-transform group-hover/row:scale-110">
                  <AvatarImage src={`https://picsum.photos/seed/${item.name}/100/100`} />
                  <AvatarFallback className="bg-zinc-100 text-[9px] font-bold text-zinc-400">
                    {item.isAbstention ? 'N/B' : item.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-center min-w-0">
                  <span className={cn(
                    "text-[11px] leading-tight truncate transition-colors",
                    idx < 2 && !item.isAbstention ? "font-black text-zinc-950" : "font-bold text-zinc-500"
                  )}>
                    {item.name}
                  </span>
                  {item.party && (
                    <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">({item.party})</span>
                  )}
                </div>
              </div>

              <div className="flex-1 h-2.5 bg-zinc-50 rounded-full relative border border-zinc-100 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: isMounted ? `${pct}%` : 0 }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                  className={cn("h-full rounded-full transition-all", barColor)}
                />
              </div>
              
              <div className="w-12 shrink-0 text-right">
                <span className={cn(
                  "text-[12px] font-black transition-colors",
                  idx < 2 && !item.isAbstention ? "text-zinc-950" : "text-zinc-400"
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
