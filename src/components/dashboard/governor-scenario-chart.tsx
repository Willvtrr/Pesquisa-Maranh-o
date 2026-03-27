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

export const SCENARIOS: Scenario[] = [
  {
    id: 'cenario1',
    label: 'CENÁRIO 1',
    question: 'Se os candidatos a Governador fossem estes, em quem você votaria?',
    candidates: [
      { name: 'Felipe Camarão', value: 34.2, party: 'PT' },
      { name: 'Weverton Rocha', value: 26.5, party: 'PDT' },
      { name: 'Josimar de Maranhãozinho', value: 15.8, party: 'PL' },
      { name: 'Roberto Rocha', value: 10.4, party: 'PSDB' },
      { name: 'Branco / Nulo', value: 13.1, party: 'Votos Inválidos', isAbstention: true },
    ]
  },
  {
    id: 'cenario2',
    label: 'CENÁRIO 2',
    question: 'E se fossem estes, em quem você votaria?',
    candidates: [
      { name: 'Felipe Camarão', value: 41.5, party: 'PT' },
      { name: 'Josimar de Maranhãozinho', value: 24.1, party: 'PL' },
      { name: 'Edivaldo Holanda Jr.', value: 14.2, party: 'PSD' },
      { name: 'Lahésio Bonfim', value: 9.8, party: 'NOVO' },
      { name: 'Branco / Nulo', value: 10.4, party: 'Votos Inválidos', isAbstention: true },
    ]
  }
];

interface ScenarioCardProps {
  scenario: Scenario;
  className?: string;
}

export const GovernorScenarioCard = ({ scenario, className }: ScenarioCardProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Ordenação interna para garantir abstenções por último
  const sortedCandidates = [...scenario.candidates].sort((a, b) => {
    if (a.isAbstention && !b.isAbstention) return 1;
    if (!a.isAbstention && b.isAbstention) return -1;
    return b.value - a.value;
  });

  return (
    <LuxuryCard className={cn("flex-1", className)}>
      <div className="flex items-start justify-between mb-2">
        <div className="space-y-1">
          <h4 className="text-[9px] lg:text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-2">
            <span className="w-1 h-3 bg-orange-600 rounded-full" />
            Disputa Estadual
          </h4>
          <p className="text-[18px] font-black text-zinc-950 tracking-tight leading-tight">{scenario.label}</p>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-50 border border-zinc-100 shrink-0 shadow-sm mt-1">
          <div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[7px] font-black text-zinc-400 uppercase tracking-widest">ESTIMULADA</span>
        </div>
      </div>
      
      <p className="text-[10px] font-medium text-zinc-400 italic mb-6">"{scenario.question}"</p>

      <div className="space-y-5">
        {sortedCandidates.slice(0, 5).map((c, idx) => {
          const displayName = toTitleCase(c.name);
          return (
            <div key={`${c.name}-${idx}`} className="flex items-center gap-3 group">
              <Avatar className="w-9 h-9 border-2 border-white shadow-sm shrink-0 transition-transform group-hover:scale-110">
                <AvatarImage src={getCandidatePhoto(c.name)} />
                <AvatarFallback className="bg-zinc-100 text-[10px] font-bold text-zinc-400">
                  {c.isAbstention ? 'N/B' : c.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-1.5">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col justify-center min-w-0">
                    <span className={cn(
                      "text-[11px] tracking-tight leading-tight transition-colors",
                      idx < 2 && !c.isAbstention ? "font-black text-zinc-950" : "font-bold text-zinc-500"
                    )}>
                      {displayName}
                    </span>
                    <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">({c.party})</span>
                  </div>
                  <span className={cn(
                    "text-[12px] font-black leading-none",
                    idx < 2 && !c.isAbstention ? "text-zinc-950" : "text-zinc-400"
                  )}>{c.value.toFixed(1)}%</span>
                </div>
                
                <div className="w-full h-2.5 bg-zinc-50 rounded-full border border-zinc-100 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: isMounted ? `${c.value}%` : 0 }}
                    transition={{ duration: 1.2, delay: idx * 0.1 }}
                    className={cn(
                      "h-full rounded-full shadow-sm transition-all",
                      idx < 2 && !c.isAbstention ? "bg-gradient-to-r from-[#f27e46] to-[#c44d15]" : "bg-zinc-200"
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
