
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LuxuryCard } from './luxury-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface GovernorRejectionChartProps {
  data: { name: string; value: number; party?: string | null }[];
  total: number;
}

export const GovernorRejectionChart = ({ data, total }: GovernorRejectionChartProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <LuxuryCard className="flex-1 p-5 min-h-[380px] flex flex-col">
      <div className="flex items-start justify-between mb-2">
        <div className="space-y-1">
          <h4 className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-1 h-3 bg-red-600 rounded-full" />
            Teto Eleitoral Estadual
          </h4>
          <h3 className="text-[16px] font-black text-zinc-950 tracking-tight leading-tight">
            Índice de Rejeição
          </h3>
        </div>
        <div className="px-2 py-1 rounded-md bg-zinc-50 border border-zinc-100">
          <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Estimulada</span>
        </div>
      </div>
      
      <p className="text-[9px] font-bold text-zinc-400 leading-tight italic mb-6">
        "REJEIÇÃO: Em quem você NÃO votaria de jeito nenhum?"
      </p>

      <div className="flex-grow flex items-end justify-between gap-2 pb-2">
        {data.map((item, idx) => {
          const pct = total > 0 ? (item.value / total) * 100 : 0;
          const heightPct = (item.value / maxValue) * 100;
          const isAbstention = item.name.toLowerCase().includes('nulo') || 
                               item.name.toLowerCase().includes('branco') || 
                               item.name.toLowerCase().includes('nenhum') ||
                               item.name.toLowerCase().includes('ns/nr');

          return (
            <div key={`${item.name}-${idx}`} className="flex flex-col items-center flex-1 group">
              <div className="flex flex-col items-center w-full h-full justify-end">
                <motion.span
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="text-[10px] font-black text-zinc-950 mb-2"
                >
                  {pct.toFixed(1)}%
                </motion.span>

                <div className="w-full max-w-[42px] bg-zinc-50 rounded-t-xl relative h-[140px] flex items-end overflow-hidden border border-zinc-100">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: isMounted ? `${heightPct}%` : 0 }}
                    transition={{ duration: 1.2, ease: "circOut", delay: idx * 0.1 }}
                    className={cn(
                      "w-full rounded-t-xl relative transition-all",
                      isAbstention 
                        ? "bg-gradient-to-b from-slate-200 to-slate-400" 
                        : "bg-gradient-to-b from-red-500 to-red-700 shadow-[0_5px_15px_-5px_rgba(220,38,38,0.4)]"
                    )}
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-col items-center text-center">
                <Avatar className="w-8 h-8 border-2 border-white shadow-sm mb-1.5 transition-transform group-hover:scale-110">
                  <AvatarImage 
                    src={`https://picsum.photos/seed/${item.name}/100/100`} 
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-zinc-100 text-[8px] font-black text-zinc-400 uppercase">
                    {isAbstention ? "N/B" : item.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-[8px] font-black text-zinc-900 leading-tight uppercase tracking-tighter w-12 line-clamp-1">
                  {item.name.split(' ')[0]}
                </p>
                {item.party && (
                  <span className="text-[7px] font-bold text-zinc-400 uppercase mt-0.5">
                    ({item.party})
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </LuxuryCard>
  );
};
