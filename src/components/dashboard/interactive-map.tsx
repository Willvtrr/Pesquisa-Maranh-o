"use client";

import React, { useState } from 'react';
import { MesoRegion } from '@/data/survey-data';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';
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

  return (
    <BentoCard 
      title="Geolocalização" 
      subtitle="Distribuição por Mesorregiões" 
      className="lg:col-span-2 lg:row-span-2"
    >
      <div className="relative flex-1 flex items-center justify-center min-h-[300px]">
        <svg 
          viewBox="0 0 120 150" 
          className="w-full h-full max-h-[350px]"
          onMouseLeave={() => setHoveredRegion(null)}
        >
          {regions.map((region) => (
            <motion.path
              key={region.id}
              d={region.path}
              fill={activeRegion === region.id ? "#ea580c" : hoveredRegion === region.id ? "#ffedd5" : "#f4f4f5"}
              stroke={activeRegion === region.id ? "#c2410c" : "#e4e4e7"}
              strokeWidth="1"
              whileHover={{ scale: 1.02 }}
              onMouseEnter={() => setHoveredRegion(region.id)}
              onClick={() => onRegionSelect(region.id)}
              className="cursor-pointer transition-all duration-300"
            />
          ))}
        </svg>

        <AnimatePresence>
          {(hoveredRegion || (activeRegion !== 'all' && activeRegion)) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute right-0 top-0 p-4 bg-white/80 backdrop-blur-md border border-zinc-100 rounded-3xl shadow-xl pointer-events-none"
            >
              <div className="text-[10px] font-bold text-orange-600 uppercase mb-1">DADOS DA REGIÃO</div>
              <div className="text-sm font-bold text-zinc-900">{(hoveredRegion || activeRegion)}</div>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between gap-4 text-[10px] font-mono">
                  <span className="text-zinc-400 uppercase">N</span>
                  <span className="text-zinc-900 font-bold">{stats[hoveredRegion || activeRegion as MesoRegion] || 0}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BentoCard>
  );
};
