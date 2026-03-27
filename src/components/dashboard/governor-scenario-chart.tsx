
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LuxuryCard } from './luxury-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Candidate {
  name: string;
  value: number;
  party: string;
  color: string;
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
      { name: 'Felipe Camarão', value: 34.2, party: 'PT', color: 'from-[#f97316] to-[#ea580c]' },
      { name: 'Weverton Rocha', value: 26.5, party: 'PDT', color: 'from-zinc-700 to-zinc-900' },
      { name: 'Josimar de Maranhãozinho', value: 15.8, party: 'PL', color: 'from-zinc-500 to-zinc-700' },
      { name: 'Roberto Rocha', value: 10.4, party: 'PSDB', color: 'from-zinc-400 to-zinc-600' },
    ]
  },
  {
    id: 'cenario2',
    label: 'CENÁRIO 2',
    question: 'E se fossem estes, em quem você votaria?',
    candidates: [
      { name: 'Felipe Camarão', value: 41.5, party: 'PT', color: 'from-[#f97316] to-[#ea580c]' },
      { name: 'Josimar de Maranhãozinho', value: 24.1, party: 'PL', color: 'from-zinc-700 to-zinc-900' },
      { name: 'Edivaldo Holanda Jr.', value: 14.2, party: 'PSD', color: 'from-zinc-500 to-zinc-700' },
      { name: 'Lahésio Bonfim', value: 9.8, party: 'NOVO', color: 'from-zinc-400 to-zinc-600' },
    ]
  }
];

interface ScenarioCardProps {
  scenario: Scenario;
  className?: string;
}

export const GovernorScenarioCard = ({ scenario, className }: ScenarioCardProps) => {
  return (
    <LuxuryCard className={cn("flex-1", className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3 bg-orange-600 rounded-full" />
            <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Disputa Estadual</span>
          </div>
          <h2 className="text-[18px] font-black text-zinc-900 tracking-tight">{scenario.label}</h2>
        </div>
        <div className="px-2 py-1 rounded-md bg-zinc-50 border border-zinc-100">
          <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Estimulada</span>
        </div>
      </div>
      
      <p className="text-[10px] font-medium text-zinc-400 italic mb-6">"{scenario.question}"</p>

      <div className="space-y-5">
        {scenario.candidates.map((c, idx) => (
          <div key={c.name} className="flex items-center gap-3 group">
            <Avatar className="w-9 h-9 border-2 border-white shadow-sm shrink-0 transition-transform group-hover:scale-110">
              <AvatarImage src={`https://picsum.photos/seed/${c.name}/100/100`} />
              <AvatarFallback className="bg-zinc-100 text-[10px] font-bold text-zinc-400">
                {c.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-1.5">
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-tight leading-none",
                    idx === 0 ? "text-orange-600" : "text-zinc-900"
                  )}>
                    {c.name}
                  </span>
                  <span className="text-[8px] font-bold text-zinc-400">({c.party})</span>
                </div>
                <span className="text-[12px] font-black text-zinc-900 leading-none">{c.value.toFixed(1)}%</span>
              </div>
              
              <div className="w-full h-2.5 bg-zinc-50 rounded-full border border-zinc-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${c.value}%` }}
                  transition={{ duration: 1.2, delay: idx * 0.1 }}
                  className={cn("h-full rounded-full bg-gradient-to-r shadow-sm", c.color)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </LuxuryCard>
  );
};
