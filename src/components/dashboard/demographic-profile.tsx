
"use client";

import React, { useEffect, useMemo } from 'react';
import { LuxuryCard } from './luxury-card';
import { BarChart3 } from 'lucide-react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DemographicProfileProps {
  stats: Record<string, Record<string, number>>;
}

const Counter = ({ value, color, symbolColor, decimals = 0 }: { value: number, color: string, symbolColor: string, decimals?: number }) => {
  const springValue = useSpring(0, { stiffness: 40, damping: 20 });
  const displayValue = useTransform(springValue, (latest) => 
    decimals > 0 ? latest.toFixed(decimals).replace('.', ',') : Math.round(latest)
  );

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  return (
    <h2 className={cn("text-[3.5rem] lg:text-[4.5rem] leading-none font-black tracking-tighter drop-shadow-sm flex items-baseline", color)}>
      <motion.span>{displayValue}</motion.span>
      <span className={cn("text-2xl lg:text-3xl ml-1", symbolColor)}>{decimals > 0 ? '%' : '%'}</span>
    </h2>
  );
};

export const DemographicProfile = ({ stats }: DemographicProfileProps) => {
  const femalePct = stats.gender?.['Feminino'] || 0;
  const malePct = stats.gender?.['Masculino'] || 0;

  const maxAgePct = useMemo(() => {
    const ageStats = stats.age || {};
    return Math.max(...Object.values(ageStats), 0.1);
  }, [stats.age]);

  return (
    <LuxuryCard className="w-full">
      <div className="flex items-center gap-3 mb-10 border-b border-zinc-100 pb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-50 text-orange-500 border border-orange-100">
          <BarChart3 size={20} />
        </div>
        <div>
          <h3 className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">Visão Geral</h3>
          <h2 className="text-2xl font-black tracking-tighter text-zinc-900">Perfil Demográfico da Amostra</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-0 lg:divide-x divide-zinc-100">
        
        {/* Escolaridade */}
        <div className="lg:col-span-3 lg:pr-8 flex flex-col min-h-[200px]">
          <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-8 text-center">Escolaridade</h4>
          <div className="flex items-end justify-between flex-grow gap-2 h-48">
            {Object.entries(stats.education || {}).map(([label, pct], idx) => (
              <div key={idx} className="flex flex-col items-center flex-1 group">
                <span className="text-[9px] font-bold text-zinc-800 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {pct.toFixed(1)}%
                </span>
                <div className="w-full bg-zinc-100 rounded-t-sm h-full flex items-end relative overflow-hidden">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${pct}%` }}
                    className={`w-full ${pct > 25 ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]' : 'bg-zinc-800'} rounded-t-sm hover:bg-orange-600 transition-colors`}
                  />
                </div>
                <span className="text-[8px] font-semibold text-zinc-400 mt-3 text-center truncate w-full" title={label}>
                  {label.substring(0, 8)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sexo (Gênero Premium Chart) */}
        <div className="lg:col-span-4 lg:px-8 flex flex-col justify-center min-h-[350px] mesh-bg relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2">
            <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-4 text-center">Gênero</h4>
          </div>

          <div className="grid grid-cols-2 gap-4 relative mt-4">
            <div className="absolute left-1/2 top-10 bottom-10 w-px bg-gradient-to-b from-transparent via-zinc-200 to-transparent -translate-x-1/2 hidden md:block"></div>

            <div className="flex flex-col items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Counter value={femalePct} color="text-[#e83e8c]" symbolColor="text-[#f472b6]" />
                <p className="text-[9px] font-black tracking-[0.15em] text-zinc-500 uppercase">Feminino</p>
                <div className="glass-capsule w-20 h-40 lg:w-24 lg:h-48 p-4 relative flex items-center justify-center transform transition-transform hover:-translate-y-2 duration-500 mt-2">
                  <div className="w-full h-full mask-female bg-[#831843] relative overflow-hidden">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${femalePct}%` }}
                      transition={{ duration: 2, ease: [0.2, 0.8, 0.2, 1] }}
                      className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#e83e8c] to-[#f472b6] shadow-[0_-15px_30px_rgba(232,62,140,0.5)]"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-white/40 blur-[1px]"></div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Counter value={malePct} color="text-[#1d70b8]" symbolColor="text-[#60a5fa]" />
                <p className="text-[9px] font-black tracking-[0.15em] text-zinc-500 uppercase">Masculino</p>
                <div className="glass-capsule w-20 h-40 lg:w-24 lg:h-48 p-4 relative flex items-center justify-center transform transition-transform hover:-translate-y-2 duration-500 mt-2">
                  <div className="w-full h-full mask-male bg-[#1e3a8a] relative overflow-hidden">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${malePct}%` }}
                      transition={{ duration: 2, ease: [0.2, 0.8, 0.2, 1] }}
                      className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#1d70b8] to-[#60a5fa] shadow-[0_-15px_30px_rgba(29,112,184,0.5)]"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-white/40 blur-[1px]"></div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Faixa Etária - NOVO VISUAL MINIMALISTA */}
        <div className="lg:col-span-2 lg:px-8 flex flex-col min-h-[300px]">
          <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-8 text-center">Faixa Etária</h4>
          <div className="flex items-end justify-between flex-grow gap-3 h-48">
            {Object.entries(stats.age || {}).map(([label, pct], idx) => {
              const isMax = pct === maxAgePct;
              return (
                <div key={idx} className="flex flex-col items-center flex-1 group h-full">
                  <div className="mb-4 transition-transform group-hover:-translate-y-1">
                    <Counter 
                      value={pct} 
                      decimals={1} 
                      size="text-sm lg:text-xl" 
                      symbolSize="text-[10px]" 
                      color={isMax ? "text-orange-500" : "text-zinc-800"} 
                      symbolColor={isMax ? "text-orange-400" : "text-zinc-400"} 
                    />
                  </div>
                  <div className="w-full max-w-[40px] bg-zinc-100 rounded-t-xl h-full flex items-end overflow-hidden relative">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${(pct / maxAgePct) * 100}%` }}
                      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                      className={cn(
                        "w-full rounded-t-xl transition-colors",
                        isMax 
                          ? "bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.4)]" 
                          : "bg-zinc-800 group-hover:bg-zinc-700"
                      )}
                    />
                  </div>
                  <span className={cn(
                    "mt-6 text-[8px] font-bold uppercase tracking-widest text-center leading-tight transition-colors",
                    isMax ? "text-orange-600" : "text-zinc-500 group-hover:text-zinc-800"
                  )}>
                    {label.replace(' anos', '').replace('-', ' a ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Religião e Renda */}
        <div className="lg:col-span-3 lg:pl-8 flex flex-col min-h-[200px] gap-10">
          <div>
            <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-6 text-center">Religião</h4>
            <div className="space-y-3">
              {Object.entries(stats.religion || {}).slice(0, 3).map(([label, pct], idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-[9px] font-semibold text-zinc-700 w-16 text-right truncate">{label}</span>
                  <div className="flex-grow h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      className={`h-full ${idx === 0 ? 'bg-orange-500' : idx === 1 ? 'bg-zinc-800' : 'bg-zinc-400'}`}
                    />
                  </div>
                  <span className={`text-[9px] font-black w-10 ${idx === 0 ? 'text-orange-600' : 'text-zinc-600'}`}>
                    {pct.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-grow flex flex-col">
            <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-6 text-center">Renda Familiar</h4>
            <div className="flex items-end justify-between flex-grow gap-2 h-24">
              {Object.entries(stats.income || {}).slice(0, 4).map(([label, pct], idx) => (
                <div key={idx} className="flex flex-col items-center flex-1 group">
                  <span className={`text-[8px] font-bold mb-1 ${idx === 0 ? 'text-orange-600' : 'text-zinc-600'}`}>
                    {pct.toFixed(1)}%
                  </span>
                  <div className="w-full bg-zinc-100 rounded-t-sm h-full flex items-end relative overflow-hidden">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${pct}%` }}
                      className={`w-full ${idx === 0 ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.2)]' : 'bg-zinc-800'} rounded-t-sm`}
                    />
                  </div>
                  <span className="text-[7px] font-bold text-zinc-400 mt-2 text-center leading-tight truncate w-full">
                    {label.split(' ')[0]} {label.split(' ')[1] || ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </LuxuryCard>
  );
};
