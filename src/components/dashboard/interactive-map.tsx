"use client";

import React, { useState } from 'react';
import { MesoRegion } from '@/data/survey-data';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Info } from 'lucide-react';
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

  return (
    <BentoCard 
      title="Geolocalização" 
      subtitle="Densidade por Mesorregião" 
      className="lg:col-span-2 lg:row-span-2 relative"
    >
      <div className="absolute top-8 right-8 flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-50 border border-zinc-100">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Dados Ativos</span>
      </div>

      <div className="relative flex-1 flex items-center justify-center min-h-[350px] mt-4">
        <svg 
          viewBox="0 0 120 150" 
          className="w-full h-full max-h-[400px] drop-shadow-2xl"
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
                fill: activeRegion === region.id ? "#ea580c" : hoveredRegion === region.id ? "#ffedd5" : "#f8fafc",
                stroke: activeRegion === region.id ? "#c2410c" : "#e4e4e7"
              }}
              strokeWidth="0.8"
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              onMouseEnter={() => setHoveredRegion(region.id)}
              onClick={() => onRegionSelect(region.id)}
              className="cursor-pointer transition-colors duration-300"
            />
          ))}
        </svg>

        <AnimatePresence>
          {currentRegion && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-0 bottom-0 p-6 glass-card border border-zinc-100/50 min-w-[180px]"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-3 bg-orange-600 rounded-full" />
                <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest">Metadata</span>
              </div>
              <div className="text-lg font-bold text-zinc-900 leading-tight mb-4">{currentRegion}</div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-zinc-400 uppercase font-bold tracking-tighter">Amostra</span>
                  <span className="text-zinc-900 font-black">{stats[currentRegion as MesoRegion] || 0}</span>
                </div>
                <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats[currentRegion as MesoRegion] / 1817) * 100}%` }}
                    className="h-full bg-orange-600"
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
