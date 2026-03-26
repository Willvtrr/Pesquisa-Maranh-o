
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
    <LuxuryCard className="h-full relative overflow-hidden flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-1">
          <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-1 h-4 bg-red-600 rounded-full" />
            Teto Eleitoral Estadual
          </h4>
          <p className="text-[18px] font-black text-zinc-950 tracking-tight leading-tight">
            Índice de Rejeição
          </p>
          <p className="text-[11px] font-medium text-zinc-400 italic leading-tight">
            "REJEIÇÃO: Em quem você NÃO votaria de jeito nenhum?"
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-zinc-50 border border-zinc-100 shrink-0">
          <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Estimulada</span>
        </div>
      </div>

      <div className="flex-grow flex items-end justify-between gap-4 mt-8 pb-4 min-h-[300px]">
        {data.map((item, idx) => {
          const pct = total > 0 ? (item.value / total) * 100 : 0;
          const heightPct = (item.value / maxValue) * 100;
          const isAbstention = item.name.toLowerCase().includes('nulo') || 
                               item.name.toLowerCase().includes('branco') || 
                               item.name.toLowerCase().includes('nenhum') ||
                               item.name.toLowerCase().includes('ns/nr');

          return (
            <div key={`${item.name}-${idx}`} className="flex flex-col items-center flex-1 relative group">
              <div className="flex flex-col items-center w-full h-full justify-end">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="mb-2"
                >
                  <span className="text-sm font-black text-zinc-950">{pct.toFixed(1)}%</span>
                </motion.div>

                <div className="w-full max-w-[50px] bg-zinc-50 rounded-t-xl relative h-[200px] flex items-end overflow-hidden group-hover:ring-2 ring-red-100 transition-all">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: isMounted ? `${heightPct}%` : 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
                    className={cn(
                      "w-full rounded-t-xl relative cursor-pointer transition-all",
                      isAbstention 
                        ? "bg-gradient-to-b from-slate-300 to-slate-400" 
                        : "bg-gradient-to-b from-red-500 to-red-700 shadow-[0_10px_20px_-10px_rgba(220,38,38,0.4)]"
                    )}
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-col items-center text-center">
                <div className="relative mb-2">
                  <Avatar className="w-12 h-12 border-4 border-white shadow-md transition-transform group-hover:scale-110">
                    <AvatarImage 
                      src={`https://picsum.photos/seed/${item.name}/100/100`} 
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-zinc-100 text-zinc-400 text-[10px] font-black">
                      {isAbstention ? "N/B" : item.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <p className="text-[10px] font-black text-zinc-900 leading-tight uppercase tracking-tighter w-16 line-clamp-2">
                  {item.name}
                </p>
                {item.party && (
                  <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
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
