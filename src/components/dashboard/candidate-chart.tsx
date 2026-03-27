"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LuxuryCard } from './luxury-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CandidateChartProps {
  data: { name: string; value: number }[];
  total?: number;
}

const PARTY_MAP: Record<string, string> = {
  'Lula': 'PT',
  'Flávio Bolsonaro': 'PL',
  'Jair Bolsonaro': 'PL',
  'Tarcísio de Freitas': 'REPUBLICANOS',
  'Ratinho Jr.': 'PSD',
  'Ronaldo Caiado': 'UNIÃO',
  'Eduardo Leite': 'PSD',
  'Ciro Gomes': 'PDT',
  'Simone Tebet': 'MDB'
};

const COLORS: Record<string, string> = {
  'Lula': 'bg-[#c2410c]',
  'Flávio Bolsonaro': 'bg-[#ea580c]',
  'Jair Bolsonaro': 'bg-[#ea580c]',
  'Nenhum/Branco/Nulo': 'bg-zinc-300',
  'NS/NR': 'bg-zinc-200',
};

export const CandidateChart = ({ data, total }: CandidateChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalVotes = total || data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <LuxuryCard 
      className="h-full relative"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="space-y-1">
          <h4 className="text-[9px] lg:text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-2">
            <span className="w-1 h-3 bg-orange-600 rounded-full" />
            CORRIDA PRESIDENCIAL
          </h4>
          <p className="text-[18px] font-black text-zinc-950 tracking-tight leading-tight">
            Intenção de Voto Federal
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-50 border border-zinc-100 shrink-0 shadow-sm mt-1">
          <div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[7px] font-black text-zinc-400 uppercase tracking-widest text-[7px]">ESTIMULADA</span>
        </div>
      </div>

      <p className="text-[11px] font-medium text-zinc-400 italic leading-tight mb-8">
        "Se as eleições para Presidente da República fossem hoje, em quem você votaria?"
      </p>

      <div 
        className="flex-1 flex flex-col gap-5 relative z-10"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {data.map((item, idx) => {
          const pct = totalVotes > 0 ? (item.value / totalVotes) * 100 : 0;
          const isFaded = hoveredIndex !== null && hoveredIndex !== idx;
          const party = PARTY_MAP[item.name];
          const barColor = COLORS[item.name] || (item.name.toLowerCase().includes('nulo') || item.name.toLowerCase().includes('ns/nr') || item.name.toLowerCase().includes('nenhum') ? 'bg-zinc-200' : 'bg-[#ea580c]');
          const isAbstention = item.name.toLowerCase().includes('nulo') || 
                               item.name.toLowerCase().includes('branco') || 
                               item.name.toLowerCase().includes('nenhum') ||
                               item.name.toLowerCase().includes('ns/nr');

          return (
            <div 
              key={item.name} 
              className={cn(
                "flex items-center gap-4 group/row cursor-default transition-all duration-300",
                hoveredIndex === idx && "translate-x-1"
              )}
              onMouseEnter={() => setHoveredIndex(idx)}
            >
              <div className="flex items-center gap-3 w-32 lg:w-44 flex-shrink-0">
                <Avatar className={cn(
                  "w-8 h-8 border border-white shadow-sm shrink-0 transition-transform group-hover/row:scale-110",
                  isFaded && "opacity-40 grayscale"
                )}>
                  <AvatarImage src={`https://picsum.photos/seed/${item.name}/100/100`} />
                  <AvatarFallback className="bg-zinc-100 text-[9px] font-bold text-zinc-400">
                    {isAbstention ? 'N/B' : item.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-center min-w-0">
                  <span className={cn(
                    "text-[11px] transition-colors leading-tight truncate",
                    idx < 2 && !isAbstention ? "font-black text-zinc-950" : "font-bold text-zinc-500",
                    isFaded && "text-zinc-300"
                  )}>
                    {item.name}
                  </span>
                  {party && (
                    <span className={cn(
                      "text-[8px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5",
                      isFaded && "text-zinc-200"
                    )}>
                      ({party})
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1 h-8 bg-zinc-50 rounded-full relative border border-zinc-100 overflow-hidden group-hover/row:border-orange-100 transition-colors">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ 
                    width: isMounted ? `${pct}%` : 0,
                    filter: isFaded ? 'grayscale(80%) opacity(40%)' : 'none',
                  }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "h-full rounded-full relative transition-all",
                    barColor
                  )}
                />
              </div>
              
              <div className="w-12 flex-shrink-0">
                <span className={cn(
                  "text-[12px] font-black transition-all duration-300",
                  isFaded ? "text-zinc-300" : "text-zinc-950",
                  hoveredIndex === idx && "text-orange-600"
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