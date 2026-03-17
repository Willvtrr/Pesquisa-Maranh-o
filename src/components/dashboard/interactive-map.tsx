
"use client";

import React, { useState } from 'react';
import { MesoRegion } from '@/data/survey-data';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';

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
    <div className="glass-card p-6 h-[500px] relative overflow-hidden flex flex-col interactive-ring">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
          <MapPin size={14} className="text-indigo-500" />
          Geolocalização / Mesorregiões
        </h3>
        {activeRegion !== 'all' && (
          <button 
            onClick={() => onRegionSelect(null)}
            className="text-[10px] font-mono text-zinc-500 hover:text-white underline underline-offset-4"
          >
            LIMPAR FOCO
          </button>
        )}
      </div>
      
      <div className="flex-1 relative flex items-center justify-center">
        <svg 
          viewBox="0 0 120 150" 
          className="w-full h-full max-h-[380px]"
          onMouseLeave={() => setHoveredRegion(null)}
        >
          {regions.map((region) => (
            <motion.path
              key={region.id}
              d={region.path}
              fill={activeRegion === region.id ? "#6366f1" : hoveredRegion === region.id ? "#3f3f46" : "#18181b"}
              stroke="#27272a"
              strokeWidth="0.5"
              whileHover={{ scale: 1.02, strokeWidth: 1 }}
              onMouseEnter={() => setHoveredRegion(region.id)}
              onClick={() => onRegionSelect(region.id)}
              className="cursor-pointer transition-all duration-300"
              style={{
                filter: activeRegion === region.id ? 'drop-shadow(0 0 8px rgba(99,102,241,0.4))' : 'none'
              }}
            />
          ))}
        </svg>

        <AnimatePresence>
          {(hoveredRegion || (activeRegion !== 'all' && activeRegion)) && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-0 top-0 w-48 p-4 glass-card bg-zinc-950/90 border-zinc-700/50"
            >
              <div className="text-[10px] font-mono text-indigo-400 uppercase mb-1">DADOS REGIONAIS</div>
              <div className="text-sm font-bold mb-3">{(hoveredRegion || activeRegion)} Maranhense</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-zinc-500">AMOSTRA</span>
                  <span className="text-zinc-50">{stats[hoveredRegion || activeRegion as MesoRegion] || 0}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-zinc-500">REPRESENTAÇÃO</span>
                  <span className="text-zinc-50">
                    {((stats[hoveredRegion || activeRegion as MesoRegion] / 1817) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
          <span className="text-[10px] font-mono text-zinc-500">SELECIONADO</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-zinc-800" />
          <span className="text-[10px] font-mono text-zinc-500">INDISPONÍVEL</span>
        </div>
      </div>
    </div>
  );
};
