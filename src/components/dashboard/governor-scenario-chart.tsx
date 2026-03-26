
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LuxuryCard } from './luxury-card';

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
      { name: 'Felipe Camarão', value: 34.2, party: 'PT', color: 'bg-orange-600' },
      { name: 'Weverton Rocha', value: 26.5, party: 'PDT', color: 'bg-zinc-800' },
      { name: 'Josimar de Maranhãozinho', value: 15.8, party: 'PL', color: 'bg-zinc-700' },
      { name: 'Roberto Rocha', value: 10.4, party: 'PSDB', color: 'bg-zinc-500' },
    ]
  },
  {
    id: 'cenario2',
    label: 'CENÁRIO 2',
    question: 'E se fossem estes, em quem você votaria?',
    candidates: [
      { name: 'Felipe Camarão', value: 41.5, party: 'PT', color: 'bg-orange-600' },
      { name: 'Josimar de Maranhãozinho', value: 24.1, party: 'PL', color: 'bg-zinc-700' },
      { name: 'Edivaldo Holanda Jr.', value: 14.2, party: 'PSD', color: 'bg-zinc-600' },
      { name: 'Lahésio Bonfim', value: 9.8, party: 'NOVO', color: 'bg-zinc-500' },
    ]
  }
];

interface ScenarioCardProps {
  scenario: Scenario;
  className?: string;
}

export const GovernorScenarioCard = ({ scenario, className }: ScenarioCardProps) => {
  return (
    <LuxuryCard className={cn("flex-1 p-5 min-h-[380px]", className)}>
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <h4 className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-1 h-3 bg-orange-600 rounded-full" />
            DISPUTA ESTADUAL
          </h4>
          <h3 className="text-[16px] font-black text-zinc-950 tracking-tight leading-tight">
            {scenario.label}
          </h3>
        </div>

        <p className="text-[9px] font-bold text-zinc-400 leading-tight italic">
          "{scenario.question}"
        </p>

        <div className="space-y-3">
          <div className="space-y-3">
            {scenario.candidates.map((c, idx) => (
              <div key={c.name} className="flex items-center gap-2.5">
                <div className="w-20 text-right shrink-0">
                  <p className={cn(
                    "text-[9px] truncate transition-colors",
                    idx === 0 ? "font-black text-zinc-900" : "font-bold text-zinc-500"
                  )}>
                    {c.name}
                  </p>
                  <span className="text-[7px] font-black text-zinc-400 uppercase">({c.party})</span>
                </div>
                
                <div className="flex-1 h-5 bg-zinc-50 rounded-full border border-zinc-100/50 overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${c.value}%` }}
                    transition={{ duration: 1, delay: idx * 0.05 }}
                    className={cn("h-full rounded-full transition-all flex items-center justify-end pr-2", c.color)}
                  >
                    <span className="text-[7px] font-black text-white">
                      {c.value.toFixed(1)}%
                    </span>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LuxuryCard>
  );
};
