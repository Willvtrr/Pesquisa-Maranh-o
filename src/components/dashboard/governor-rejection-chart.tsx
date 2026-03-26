
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface GovernorRejectionChartProps {
  data: { name: string; value: number; party?: string | null }[];
  total: number;
  title?: string;
  overline?: string;
  subtitle?: string;
  badge?: string;
  color?: 'red' | 'rose';
}

export const GovernorRejectionChart = ({ 
  data, 
  total, 
  title = "Índice de Rejeição",
  overline = "TETO ELEITORAL ESTADUAL",
  subtitle = '"REJEIÇÃO: Em quem você NÃO votaria de jeito nenhum?"',
  badge = "Estimulada",
  color = 'red'
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
    <div className="bg-white rounded-[2.5rem] p-6 lg:p-8 w-full relative overflow-hidden shadow-sm border border-zinc-100 flex flex-col h-full min-h-[380px]">
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={cn("w-1 h-4 rounded-full", overlineColorClass)} />
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em]">
              {overline}
            </span>
          </div>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
            {title}
          </h2>
          <p className="text-[11px] text-zinc-400 italic font-medium">
            {subtitle}
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-[#f8fafc] border border-zinc-100">
          <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">
            {badge}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-start gap-2 mt-auto border-b border-zinc-50 pb-4">
        {data.map((item, idx) => {
          const pct = total > 0 ? (item.value / total) * 100 : 0;
          const isAbstention = item.name.toLowerCase().includes('nulo') || 
                               item.name.toLowerCase().includes('branco') || 
                               item.name.toLowerCase().includes('nenhum');

          return (
            <div key={`${item.name}-${idx}`} className="flex flex-col items-center flex-1 group">
              {/* Bar Track - Compacto 140px */}
              <div className="w-8 h-[140px] bg-[#f1f5f9] border border-[#e2e8f0] rounded-full flex flex-col justify-end p-1 mb-2 shadow-inner">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: isMounted ? `${pct}%` : 0 }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
                  className={cn(
                    "w-full rounded-full transition-all min-h-[20px] bg-gradient-to-b",
                    isAbstention 
                      ? "from-slate-200 to-slate-400" 
                      : barColorClass
                  )}
                />
              </div>

              <span className="text-[12px] font-black text-zinc-900 mb-2">
                {pct.toFixed(1)}%
              </span>

              <div className="flex flex-col items-center text-center space-y-1">
                <Avatar className="w-10 h-10 border-2 border-white shadow-sm transition-transform group-hover:-translate-y-0.5">
                  <AvatarImage 
                    src={`https://picsum.photos/seed/${item.name}/100/100`} 
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-[#f8fafc] text-[8px] font-bold text-zinc-400 uppercase">
                    {isAbstention ? "N/B" : item.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-0 min-h-[2.4em] flex flex-col justify-center">
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
