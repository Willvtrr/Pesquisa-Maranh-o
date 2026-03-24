"use client";

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform, animate } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface StatCardProps {
  label: string;
  value: string | number; // Ex: "64.1%"
  subValue?: React.ReactNode;
  imageUrl?: string;
  className?: string;
  breakdown?: { name: string; value: number }[];
}

const NumberCounter = ({ value, className }: { value: number; className?: string }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.5,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplayValue(latest),
    });
    return () => controls.stop();
  }, [value]);

  return <span className={className}>{displayValue.toFixed(1)}</span>;
};

export const StatCard = ({ 
  label, 
  value, 
  subValue, 
  imageUrl, 
  className, 
  breakdown 
}: StatCardProps) => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Cores padronizadas do modelo
  const colors = {
    aprova: '#10b981', // emerald-500
    desaprova: '#f43f5e', // rose-500
    nsnr: '#d4d4d8', // zinc-300
  };

  const aprovaData = breakdown?.find(b => b.name === 'Aprova')?.value || 0;
  const desaprovaData = breakdown?.find(b => b.name === 'Desaprova')?.value || 0;
  const nsnrData = breakdown?.find(b => b.name === 'NS/NR')?.value || 0;

  // Cálculo do anel SVG (Circunferência = 2 * PI * R) -> R=45, C=282.7
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * aprovaData) / 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn(
        "bg-white rounded-[2.5rem] border border-zinc-100/80 p-8 md:p-10 w-full relative overflow-hidden group shadow-sm transition-all hover:shadow-xl hover:-translate-y-1",
        className
      )}
    >
      {/* Glow de fundo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-emerald-50/50 blur-[60px] rounded-full z-0 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <h3 className="text-[10px] md:text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">{label}</h3>
        
        <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
          <ArrowUpRight size={12} className="text-emerald-500" strokeWidth={3} />
          <span className="text-[10px] font-black text-emerald-600 tracking-wider">2026</span>
        </div>
      </div>

      {/* Foto com Anel Animado */}
      <div className="relative flex justify-center mb-6 z-10">
        <svg className="absolute inset-0 w-[140px] h-[140px] md:w-[150px] md:h-[150px] mx-auto -top-2 -left-2 md:-top-2.5 md:-left-2.5 transform -rotate-90 pointer-events-none" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#f4f4f5" strokeWidth="2.5" />
          <motion.circle 
            cx="50" 
            cy="50" 
            r={radius} 
            fill="transparent" 
            stroke={colors.aprova} 
            strokeWidth="3.5" 
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        
        <div className="w-32 h-32 md:w-[130px] md:h-[130px] rounded-[2rem] overflow-hidden shadow-lg border-4 border-white relative z-10 transition-transform duration-500 group-hover:scale-105">
          {imageUrl ? (
            <Image 
              src={imageUrl} 
              alt={label} 
              fill 
              className="object-cover object-top"
            />
          ) : (
            <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-300 font-black">N/A</div>
          )}
        </div>
      </div>

      {/* Valor Principal */}
      <div className="text-center relative z-10 mb-5">
        <h2 className="text-6xl md:text-[4.5rem] font-black text-zinc-900 tracking-tighter leading-none">
          <NumberCounter value={aprovaData} />
          <span className="text-4xl md:text-5xl">%</span>
        </h2>
      </div>

      {/* Barra de Progresso Segmentada */}
      <div className="w-full h-2 bg-zinc-100 rounded-full flex overflow-hidden mb-8 relative z-10 shadow-inner">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${aprovaData}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-full"
          style={{ backgroundColor: colors.aprova }}
        />
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${desaprovaData}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="h-full"
          style={{ backgroundColor: colors.desaprova }}
        />
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${nsnrData}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="h-full"
          style={{ backgroundColor: colors.nsnr }}
        />
      </div>

      {/* Grid de Estatísticas */}
      <div className="grid grid-cols-3 gap-2 text-center relative z-10 border-b border-zinc-100/80 pb-6 mb-6">
        <div className="flex flex-col items-center">
          <NumberCounter value={aprovaData} className="text-lg font-black text-zinc-800 mb-1" />
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.aprova }} />
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Aprova</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <NumberCounter value={desaprovaData} className="text-lg font-black text-zinc-800 mb-1" />
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.desaprova }} />
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Desaprova</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <NumberCounter value={nsnrData} className="text-lg font-black text-zinc-800 mb-1" />
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.nsnr }} />
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">NS/NR</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center relative z-10">
        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{subValue}</span>
      </div>
    </motion.div>
  );
};
