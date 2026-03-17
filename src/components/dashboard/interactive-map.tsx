"use client";

import React, { useState } from 'react';
import { MesoRegion } from '@/data/survey-data';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { BentoCard } from './bento-card';

interface InteractiveMapProps {
  onRegionSelect: (region: MesoRegion | null) => void;
  stats: Record<MesoRegion, number>;
  activeRegion: string;
}

export const InteractiveMap = ({ onRegionSelect, stats, activeRegion }: InteractiveMapProps) => {
  const [hoveredRegion, setHoveredRegion] = useState<MesoRegion | null>(null);

  const regions: { id: MesoRegion; path: string; label: string }[] = [
    { id: 'Norte', label: 'Norte Maranhense', path: "M50,10 L90,10 L90,40 L60,50 Z" },
    { id: 'Oeste', label: 'Oeste Maranhense', path: "M10,40 L50,40 L60,80 L20,90 Z" },
    { id: 'Centro', label: 'Centro Maranhense', path: "M50,40 L80,45 L70,70 L55,75 Z" },
    { id: 'Leste', label: 'Leste Maranhense', path: "M80,45 L100,50 L95,85 L70,80 Z" },
    { id: 'Sul', label: 'Sul Maranhense', path: "M20,90 L60,80 L70,120 L30,130 Z" },
  ];

  const currentRegion = hoveredRegion || (activeRegion !== 'all' ? activeRegion : null);
  const totalSamples = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <BentoCard 
      title="Geolocalização" 
      subtitle="Densidade por Mesorregião" 
      className="lg:col-span-2 lg:row-span-2 relative group"
    >
      <div className="absolute top-8 right-8 flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white border border-zinc-200 shadow-md z-20">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></span>
        </span>
        <span className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.15em]">Sinal Ativo</span>
      </div>

      <div className="relative flex-1 flex items-center justify-center min-h-[380px] mt-6">
        <svg 
          viewBox="0 0 120 150" 
          className="w-full h-full max-h-[420px] drop-shadow-[0_25px_40px_rgba(0,0,0,0.06)]"
          onMouseLeave={() => setHoveredRegion(null)}
        >
          {regions.map((region) => (
            <motion.path
              key={region.id}
              d={region.path}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                fill: activeRegion === region.id ? "#ea580c" : hoveredRegion === region.id ? "#f4f4f5" : "#fdfdfd",
                stroke: activeRegion === region.id ? "#c2410c" : "#e4e4e7"
              }}
              strokeWidth="0.8"
              whileHover={{ 
                scale: 1.02, 
                strokeWidth: 1.2,
                transition: { duration: 0.2 } 
              }}
              onMouseEnter={() => setHoveredRegion(region.id)}
              onClick={() => onRegionSelect(region.id)}
              className="cursor-pointer transition-all duration-300"
            />
          ))}
        </svg>

        <AnimatePresence>
          {currentRegion && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              className="absolute right-0 bottom-4 p-8 bg-white border border-zinc-200 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] min-w-[260px] z-30"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-4 premium-gradient rounded-full" />
                  <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">Regional ID</span>
                </div>
                <ArrowUpRight size={16} className="text-zinc-300" />
              </div>
              
              <div className="text-2xl font-bold text-zinc-950 leading-tight mb-2">{currentRegion}</div>
              <p className="text-[11px] text-zinc-400 font-bold mb-8 uppercase tracking-widest">Maranhão • BR</p>
              
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-zinc-400 uppercase block tracking-tighter">Amostragem</span>
                    <span className="text-4xl font-mono font-bold text-zinc-900 leading-none tracking-tighter">
                      {stats[currentRegion as MesoRegion] || 0}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black text-zinc-400 uppercase block tracking-tighter">Share</span>
                    <span className="text-lg font-bold text-orange-600">
                      {totalSamples > 0 ? ((stats[currentRegion as MesoRegion] / totalSamples) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden shadow-inner border border-zinc-200/50">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats[currentRegion as MesoRegion] / totalSamples) * 100}%` }}
                    className="h-full premium-gradient shadow-[0_0_8px_rgba(234,88,12,0.3)]"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BentoCard>
  );
};
