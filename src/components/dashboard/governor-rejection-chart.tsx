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
    <div className="bg-white rounded-[2rem] p-8 lg:p-10 w-full relative overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-zinc-50">
      {/* Header Estilo Clone */}
      <div className="flex justify-between items-start mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-1 h-4 bg-[#dc2626] rounded-full" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em]">
              Teto Eleitoral Estadual
            </span>
          </div>
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight">
            Índice de Rejeição
          </h2>
          <p className="text-[13px] text-zinc-400 italic mt-1 font-medium">
            "REJEIÇÃO: Em quem você NÃO votaria de jeito nenhum?"
          </p>
        </div>
        <div className="px-4 py-2 rounded-full bg-[#f8fafc] border border-zinc-100">
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
            Estimulada
          </span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex justify-between items-start gap-4">
        {data.map((item, idx) => {
          const pct = total > 0 ? (item.value / total) * 100 : 0;
          const isAbstention = item.name.toLowerCase().includes('nulo') || 
                               item.name.toLowerCase().includes('branco') || 
                               item.name.toLowerCase().includes('nenhum') ||
                               item.name.toLowerCase().includes('não sabe');

          return (
            <div key={`${item.name}-${idx}`} className="flex flex-col items-center flex-1 group">
              {/* Bar Track */}
              <div className="w-12 h-[250px] bg-[#f1f5f9] border border-[#e2e8f0] rounded-full flex flex-col justify-end p-1 mb-4 shadow-inner">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: isMounted ? `${pct}%` : 0 }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
                  className={cn(
                    "w-full rounded-full transition-all min-h-[40px] cursor-pointer hover:brightness-110",
                    isAbstention 
                      ? "bg-gradient-to-b from-slate-300 to-slate-500" 
                      : "bg-gradient-to-b from-[#ef4444] to-[#b91c1c] shadow-[0_10px_20px_-10px_rgba(220,38,38,0.4)]"
                  )}
                />
              </div>

              {/* Percentage Label */}
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + idx * 0.1 }}
                className="text-lg font-black text-zinc-900 mb-6"
              >
                {pct.toFixed(1)}%
              </motion.span>

              {/* Candidate Info */}
              <div className="flex flex-col items-center text-center space-y-3">
                <Avatar className="w-14 h-14 border-2 border-zinc-100 shadow-sm transition-transform group-hover:-translate-y-1">
                  <AvatarImage 
                    src={`https://picsum.photos/seed/${item.name}/150/150`} 
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-[#f8fafc] text-[10px] font-bold text-zinc-400 uppercase">
                    {isAbstention ? "N/B" : item.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-0.5">
                  <p className="text-[11px] font-bold text-zinc-900 leading-tight uppercase tracking-tight">
                    {item.name.split(' ')[0]}<br />
                    {item.name.split(' ')[1] || ''}
                  </p>
                  {item.party && (
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase">
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
