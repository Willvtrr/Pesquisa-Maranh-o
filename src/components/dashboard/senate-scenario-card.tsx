"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LuxuryCard } from './luxury-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getCandidatePhoto, toTitleCase } from '@/app/page';

interface Candidate {
  name: string;
  value: number;
  party: string;
  isAbstention?: boolean;
}

interface Scenario {
  id: string;
  label: string;
  question: string;
  candidates: Candidate[];
}

export const SENATE_SCENARIOS: Scenario[] = [
  {
    id: 'sen-cen-1',
    label: 'Cenário 1',
    question: 'Se os candidatos a Senador fossem estes, em quem você votaria?',
    candidates: [
      { name: 'Weverton Rocha', value: 28.4, party: 'PDT' },
      { name: 'Eliziane Gama', value: 22.1, party: 'PSD' },
      { name: 'Roberto Rocha', value: 18.5, party: 'PSDB' },
      { name: 'Indeciso', value: 15.8, party: '', isAbstention: true },
      { name: 'Branco / Nulo', value: 15.2, party: '', isAbstention: true },
    ]
  },
  {
    id: 'sen-cen-2',
    label: 'Cenário 2',
    question: 'E se fossem estes, em quem você votaria para Senador?',
    candidates: [
      { name: 'Flávio Dino', value: 45.2, party: 'PSB' },
      { name: 'Edivaldo Holanda Jr.', value: 18.4, party: 'PSD' },
      { name: 'Lahésio Bonfim', value: 12.1, party: 'NOVO' },
      { name: 'NS/NR', value: 14.3, party: '', isAbstention: true },
      { name: 'Branco / Nulo', value: 10.0, party: '', isAbstention: true },
    ]
  },
  {
    id: 'sen-cen-3',
    label: 'Cenário 3',
    question: 'E entre estes, em quem você votaria?',
    candidates: [
      { name: 'Iracema Vale', value: 31.5, party: 'PSB' },
      { name: 'Othelino Neto', value: 24.2, party: 'PCdoB' },
      { name: 'Josimar de Maranhãozinho', value: 19.8, party: 'PL' },
      { name: 'NS/NR', value: 12.4, party: '', isAbstention: true },
      { name: 'Nulo', value: 12.1, party: '', isAbstention: true },
    ]
  },
  {
    id: 'sen-cen-4',
    label: 'Cenário 4',
    question: 'E entre estes aqui, em quem você votaria?',
    candidates: [
      { name: 'Roseana Sarney', value: 38.4, party: 'MDB' },
      { name: 'Eduardo Braide', value: 25.1, party: 'PSD' },
      { name: 'Roberto Rocha', value: 14.2, party: 'PSDB' },
      { name: 'NS/NR', value: 12.3, party: '', isAbstention: true },
      { name: 'Ninguém', value: 10.0, party: '', isAbstention: true },
    ]
  },
  {
    id: 'sen-cen-5',
    label: 'Cenário 5',
    question: 'E destes, em quem você votaria?',
    candidates: [
      { name: 'Felipe Camarão', value: 33.1, party: 'PT' },
      { name: 'Weverton Rocha', value: 24.5, party: 'PDT' },
      { name: 'Eliziane Gama', value: 21.2, party: 'PSD' },
      { name: 'NS/NR', value: 11.2, party: '', isAbstention: true },
      { name: 'Branco', value: 10.0, party: '', isAbstention: true },
    ]
  }
];

interface SenateScenarioCardProps {
  scenario: Scenario;
  className?: string;
}

export const SenateScenarioCard = ({ scenario, className }: SenateScenarioCardProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sortedCandidates = [...scenario.candidates].sort((a, b) => {
    if (a.isAbstention && !b.isAbstention) return 1;
    if (!a.isAbstention && b.isAbstention) return -1;
    return b.value - a.value;
  });

  const maxVal = Math.max(...scenario.candidates.filter(c => !c.isAbstention).map(c => c.value), 1);

  return (
    <LuxuryCard className={cn("flex-1", className)}>
      <div className="flex items-start justify-between mb-1">
        <div className="space-y-0.5">
          <h4 className="text-[7px] font-black text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-2">
            <span className="w-1 h-3 bg-orange-600 rounded-full" />
            CORRIDA SENADO
          </h4>
          <p className="text-sm font-black text-zinc-950 tracking-tight leading-tight">{scenario.label}</p>
        </div>
        <div className="flex items-center gap-1 py-0.5 px-2 rounded-full bg-zinc-50 border border-zinc-100 shrink-0 shadow-sm">
          <div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[6px] font-black text-zinc-400 uppercase tracking-widest">ESTIMULADA</span>
        </div>
      </div>
      
      <p className="text-[8px] font-medium text-zinc-400 italic mb-4 leading-tight">"{scenario.question}"</p>

      <div 
        className="space-y-3"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {sortedCandidates.map((c, idx) => {
          const displayName = toTitleCase(c.name);
          const isAbstention = c.isAbstention || c.name.toLowerCase().includes('outros') || c.name.toLowerCase().includes('ns') || c.name.toLowerCase().includes('sabe');
          const isFaded = hoveredIndex !== null && hoveredIndex !== idx;
          
          const visualWidth = isAbstention ? (c.value / 100) * 100 : (c.value / maxVal) * 100;
          const barOpacity = isAbstention ? 1 : Math.max(0.2, 1 - (idx * 0.12));

          return (
            <div 
              key={`${c.name}-${idx}`} 
              className={cn(
                "flex items-center gap-2.5 group/row cursor-pointer transition-all duration-300",
                hoveredIndex === idx && "translate-x-1"
              )}
              onMouseEnter={() => setHoveredIndex(idx)}
            >
              <Avatar className={cn(
                "w-7 h-7 border border-white shadow-sm shrink-0 transition-all",
                isFaded && "opacity-40 grayscale"
              )}>
                <AvatarImage src={getCandidatePhoto(c.name)} />
                <AvatarFallback className="bg-zinc-100 text-[7px] font-bold text-zinc-400">
                  {isAbstention ? 'N/B' : c.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col justify-center min-w-0">
                    <span className={cn(
                      "text-[9px] tracking-tight leading-tight transition-colors",
                      !isAbstention ? "font-black text-zinc-950" : "font-bold text-zinc-500",
                      isFaded && "text-zinc-300"
                    )}>
                      {displayName}
                    </span>
                    {c.party && (
                      <span className={cn(
                        "text-[5px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5",
                        isFaded && "text-zinc-200"
                      )}>
                        ({c.party})
                      </span>
                    )}
                  </div>
                  <span className={cn(
                    "text-[9px] font-black leading-none transition-colors tabular-nums",
                    isFaded ? "text-zinc-300" : (!isAbstention ? "text-zinc-950" : "text-zinc-400"),
                    hoveredIndex === idx && "text-orange-600"
                  )}>
                    {c.value.toFixed(1).replace('.', ',')}%
                  </span>
                </div>
                
                <div className="w-full h-1.5 bg-zinc-50 rounded-full border border-zinc-100 overflow-hidden group-hover/row:border-orange-100 transition-colors">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: isMounted ? `${visualWidth}%` : 0,
                      filter: isFaded ? 'grayscale(80%) opacity(40%)' : 'none',
                    }}
                    transition={{ duration: 1.2, delay: idx * 0.05 }}
                    className={cn(
                      "h-full rounded-full shadow-sm transition-all",
                      !isAbstention ? "bg-gradient-to-r from-[#f27e46] to-[#c44d15]" : "bg-zinc-200"
                    )}
                    style={{ opacity: barOpacity }}
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
