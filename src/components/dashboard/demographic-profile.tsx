"use client";

import React from 'react';
import { LuxuryCard } from './luxury-card';
import { BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

interface DemographicProfileProps {
  stats: Record<string, Record<string, number>>;
}

export const DemographicProfile = ({ stats }: DemographicProfileProps) => {
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
        <div className="lg:col-span-4 lg:pr-8 flex flex-col min-h-[200px]">
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

        {/* Sexo */}
        <div className="lg:col-span-2 lg:px-8 flex flex-col justify-center min-h-[200px]">
          <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-8 text-center">Sexo</h4>
          <div className="flex flex-col gap-6">
            {Object.entries(stats.gender || {}).map(([label, pct], idx) => (
              <div key={idx}>
                <div className="flex justify-between items-end mb-1.5">
                  <span className="text-[10px] font-semibold text-zinc-700">{label}</span>
                  <span className={`text-[12px] font-black ${idx === 0 ? 'text-orange-500' : 'text-zinc-800'}`}>{pct.toFixed(1)}%</span>
                </div>
                <div className="h-5 w-full bg-zinc-100 rounded-md overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    className={`h-full ${idx === 0 ? 'bg-orange-500' : 'bg-zinc-800'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Faixa Etária */}
        <div className="lg:col-span-3 lg:px-8 flex flex-col min-h-[200px]">
          <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-8 text-center">Faixa Etária</h4>
          <div className="flex items-end justify-between flex-grow gap-3 h-48">
            {Object.entries(stats.age || {}).slice(0, 5).map(([label, pct], idx) => (
              <div key={idx} className="flex flex-col items-center flex-1 group">
                <span className="text-[9px] font-bold text-zinc-800 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {pct.toFixed(1)}%
                </span>
                <div className="w-full bg-zinc-100 rounded-t-sm h-full flex items-end relative overflow-hidden">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${pct}%` }}
                    className={`w-full ${pct > 20 ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]' : 'bg-zinc-800'} rounded-t-sm`}
                  />
                </div>
                <span className="text-[8px] font-semibold text-zinc-400 mt-3 text-center leading-tight">
                  {label.replace(' anos', '')}
                </span>
              </div>
            ))}
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
