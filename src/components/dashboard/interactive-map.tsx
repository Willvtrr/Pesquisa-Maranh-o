
"use client";

import React, { useState, useEffect } from 'react';
import { MesoRegion } from '@/data/survey-data';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Info, ArrowUpRight } from 'lucide-react';
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
      <div className="absolute top-8 right-8 flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/50 backdrop-blur-md border border-zinc-100 z-20">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
        </span>
        <span className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">Atividade Live</span>
      </div>

      <div className="relative flex-1 flex items-center justify-center min-h-[380px] mt-6">
        <svg 
          viewBox="0 0 120 150" 
          className="w-full h-full max-h-[420px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
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
                fill: activeRegion === region.id ? "#ea580c" : hoveredRegion === region.id ? "#fff7ed" : "#f8fafc",
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
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute right-0 bottom-0 p-8 glass-card border border-white/60 min-w-[240px] z-30"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-orange-600 rounded-full" />
                  <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">Regional ID</span>
                </div>
                <ArrowUpRight size={14} className="text-zinc-300" />
              </div>
              
              <div className="text-2xl font-bold text-zinc-950 leading-tight mb-2">{currentRegion}</div>
              <p className="text-[11px] text-zinc-400 font-medium mb-6 uppercase tracking-widest">Maranhão, Brasil</p>
              
              <div className="space-y-5">
                <div className="flex justify-between items-end">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-zinc-400 uppercase block tracking-tighter">Amostragem</span>
                    <span className="text-3xl font-mono font-bold text-zinc-900 leading-none">
                      {stats[currentRegion as MesoRegion] || 0}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black text-zinc-400 uppercase block tracking-tighter">Share</span>
                    <span className="text-sm font-bold text-orange-600">
                      {totalSamples > 0 ? ((stats[currentRegion as MesoRegion] / totalSamples) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats[currentRegion as MesoRegion] / totalSamples) * 100}%` }}
                    className="h-full bg-gradient-to-r from-orange-600 to-orange-400"
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
