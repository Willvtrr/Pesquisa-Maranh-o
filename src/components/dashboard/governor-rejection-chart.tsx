"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
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

  return (
    <div className="bg-white rounded-[2rem] p-6 lg:p-7 w-full relative overflow-hidden shadow-sm border border-zinc-100 flex flex-col h-full">
      {/* Header Premium Clone */}
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3 bg-[#dc2626] rounded-full" />
            <span className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.15em]">
              Teto Eleitoral Estadual
            </span>
          </div>
          <h2 className="text-xl font-black text-zinc-900 tracking-tight">
            Índice de Rejeição
          </h2>
          <p className="text-[10px] text-zinc-400 italic font-medium">
            "REJEIÇÃO: Em quem você NÃO votaria de jeito nenhum?"
          </p>
        </div>
        <div className="px-3 py-1 rounded-full bg-[#f8fafc] border border-zinc-100">
          <span className="text-[7px] font-black text-zinc-400 uppercase tracking-widest">
            Estimulada
          </span>
        </div>
      </div>

      {/* Chart Container - Compacto */}
      <div className="flex justify-between items-start gap-2 mt-auto">
        {data.map((item, idx) => {
          const pct = total > 0 ? (item.value / total) * 100 : 0;
          const isAbstention = item.name.toLowerCase().includes('nulo') || 
                               item.name.toLowerCase().includes('branco') || 
                               item.name.toLowerCase().includes('nenhum');

          return (
            <div key={`${item.name}-${idx}`} className="flex flex-col items-center flex-1 group">
              {/* Bar Track - Ultra Compacto */}
              <div className="w-8 h-[140px] bg-[#f1f5f9] border border-[#e2e8f0] rounded-full flex flex-col justify-end p-1 mb-3 shadow-inner">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: isMounted ? `${pct}%` : 0 }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
                  className={cn(
                    "w-full rounded-full transition-all min-h-[16px]",
                    isAbstention 
                      ? "bg-gradient-to-b from-slate-300 to-slate-500" 
                      : "bg-gradient-to-b from-[#ef4444] to-[#b91c1c] shadow-[0_4px_10px_-2px_rgba(220,38,38,0.3)]"
                  )}
                />
              </div>

              {/* Percentage Label */}
              <span className="text-[11px] font-black text-zinc-900 mb-3">
                {pct.toFixed(1)}%
              </span>

              {/* Candidate Info */}
              <div className="flex flex-col items-center text-center space-y-2">
                <Avatar className="w-10 h-10 border-2 border-white shadow-sm transition-transform group-hover:-translate-y-0.5">
                  <AvatarImage 
                    src={`https://picsum.photos/seed/${item.name}/100/100`} 
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-[#f8fafc] text-[8px] font-bold text-zinc-400 uppercase">
                    {isAbstention ? "N/B" : item.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-0">
                  <p className="text-[9px] font-black text-zinc-900 leading-tight uppercase tracking-tight">
                    {item.name.split(' ')[0]}<br />
                    {item.name.split(' ')[1] || ''}
                  </p>
                  {item.party && (
                    <p className="text-[8px] font-bold text-zinc-400 uppercase">
                      ({item.party})
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
