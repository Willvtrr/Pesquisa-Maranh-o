
"use client";

import React, { useState } from 'react';
import { NeomorphicCard } from '../ui/neomorphic-card';
import { MesoRegion } from '@/data/survey-data';
import { motion, AnimatePresence } from 'framer-motion';

interface MaranhaoMapProps {
  onRegionSelect: (region: MesoRegion | null) => void;
  stats: Record<MesoRegion, number>;
}

export const MaranhaoMap = ({ onRegionSelect, stats }: MaranhaoMapProps) => {
  const [hoveredRegion, setHoveredRegion] = useState<MesoRegion | null>(null);

  const regions: { id: MesoRegion; path: string; label: string }[] = [
    { id: 'Norte', label: 'Norte Maranhense', path: "M50,10 L90,10 L90,40 L60,50 Z" },
    { id: 'Oeste', label: 'Oeste Maranhense', path: "M10,40 L50,40 L60,80 L20,90 Z" },
    { id: 'Centro', label: 'Centro Maranhense', path: "M50,40 L80,45 L70,70 L55,75 Z" },
    { id: 'Leste', label: 'Leste Maranhense', path: "M80,45 L100,50 L95,85 L70,80 Z" },
    { id: 'Sul', label: 'Sul Maranhense', path: "M20,90 L60,80 L70,120 L30,130 Z" },
  ];

  return (
    <NeomorphicCard className="h-[500px] relative flex flex-col items-center justify-center overflow-hidden">
      <h3 className="absolute top-6 left-6 text-lg font-bold font-headline text-primary">Mapa de Mesorregiões</h3>
      
      <svg 
        viewBox="0 0 120 150" 
        className="w-full h-full max-h-[400px] filter drop-shadow-xl"
        onMouseLeave={() => setHoveredRegion(null)}
      >
        <defs>
          <linearGradient id="mapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0095A8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1B3A5C" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        
        {regions.map((region) => (
          <motion.path
            key={region.id}
            d={region.path}
            fill={hoveredRegion === region.id ? "url(#mapGrad)" : "#E0E5EC"}
            stroke="#1B3A5C"
            strokeWidth="0.5"
            strokeOpacity="0.2"
            whileHover={{ scale: 1.05, strokeOpacity: 0.8 }}
            onMouseEnter={() => setHoveredRegion(region.id)}
            onClick={() => onRegionSelect(region.id)}
            className="cursor-pointer transition-colors duration-300"
            style={{ filter: hoveredRegion === region.id ? 'drop-shadow(0 0 8px rgba(0,149,168,0.4))' : 'none' }}
          />
        ))}
      </svg>

      <AnimatePresence>
        {hoveredRegion && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 glass px-6 py-3 rounded-2xl border border-white/40 shadow-xl pointer-events-none"
          >
            <p className="text-xs font-bold text-primary uppercase tracking-wider">{hoveredRegion} Maranhense</p>
            <p className="text-sm font-medium text-muted-foreground">{stats[hoveredRegion]} respondentes</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-6 right-6 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Ativo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-secondary" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Inativo</span>
        </div>
      </div>
    </NeomorphicCard>
  );
};
