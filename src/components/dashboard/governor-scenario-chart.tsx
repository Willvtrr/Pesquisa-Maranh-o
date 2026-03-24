"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const SCENARIOS: Scenario[] = [
  {
    id: 'cenario1',
    label: 'CENÁRIO 1',
    question: 'Se os candidatos a Governador fossem estes, em quem você votaria?',
    candidates: [
      { name: 'Felipe Camarão', value: 34.2, party: 'PT', color: 'bg-orange-600' },
      { name: 'Weverton Rocha', value: 26.5, party: 'PDT', color: 'bg-zinc-800' },
      { name: 'Josimar de Maranhãozinho', value: 15.8, party: 'PL', color: 'bg-zinc-700' },
      { name: 'Roberto Rocha', value: 10.4, party: 'PSDB', color: 'bg-zinc-500' },
      { name: 'Nenhum/Branco/Nulo', value: 8.2, party: '-', color: 'bg-zinc-300' },
      { name: 'NS/NR', value: 4.9, party: '-', color: 'bg-zinc-200' },
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
      { name: 'Nenhum/Branco/Nulo', value: 6.5, party: '-', color: 'bg-zinc-300' },
      { name: 'NS/NR', value: 3.9, party: '-', color: 'bg-zinc-200' },
    ]
  }
];

export const GovernorScenarioChart = () => {
  const [activeScenarioId, setActiveScenarioId] = useState('cenario1');
  const activeScenario = useMemo(() => 
    SCENARIOS.find(s => s.id === activeScenarioId) || SCENARIOS[0]
  , [activeScenarioId]);

  return (
    <LuxuryCard 
      title="DISPUTA ESTADUAL" 
      subtitle="Cenários Estimulados" 
      className="lg:col-span-2 h-full"
    >
      <div className="space-y-8 mt-2">
        {/* Toggle Interativo Estilo Premium Orange */}
        <div className="bg-[#09090b] p-1.5 rounded-full flex items-center relative overflow-hidden border border-zinc-800 shadow-inner">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveScenarioId(s.id)}
              className={cn(
                "relative z-10 flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500",
                activeScenarioId === s.id ? "text-white" : "text-zinc-500 hover:text-zinc-400"
              )}
            >
              {activeScenarioId === s.id && (
                <motion.div
                  layoutId="activeTabScenario"
                  className="absolute inset-0 bg-orange-600 rounded-full shadow-[0_0_25px_rgba(234,88,12,0.4)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-20">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Pergunta e Gráfico */}
        <div className="space-y-6">
          <div className="min-h-[40px]">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeScenario.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-[13px] font-bold text-zinc-500 leading-tight italic"
              >
                "{activeScenario.question}"
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeScenario.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {activeScenario.candidates.map((c, idx) => (
                  <div key={c.name} className="flex items-center gap-4 group">
                    <div className="w-40 text-right shrink-0">
                      <p className={cn(
                        "text-[11px] transition-colors truncate",
                        idx === 0 ? "font-black text-zinc-900" : "font-bold text-zinc-500"
                      )}>
                        {c.name}
                      </p>
                      <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">({c.party})</span>
                    </div>
                    
                    <div className="flex-1 h-8 bg-zinc-50 rounded-full border border-zinc-100/50 overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${c.value}%` }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: idx * 0.1 }}
                        className={cn("h-full rounded-full transition-all flex items-center justify-end pr-3", c.color)}
                      >
                        <span className="text-[10px] font-black text-white drop-shadow-sm">
                          {c.value.toFixed(1)}%
                        </span>
                      </motion.div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </LuxuryCard>
  );
};
