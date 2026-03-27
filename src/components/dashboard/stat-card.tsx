
"use client";

import React, { useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface StatCardProps {
  label?: string;
  title?: string;
  subtitle?: string;
  value: number; // Agora numérico puro
  subValue?: React.ReactNode;
  imageUrl?: string;
  className?: string;
  breakdown?: { name: string; value: number }[];
  party?: string;
  onFilterChange?: (name: string) => void;
  selected?: string[];
}

const NumberCounter = ({ value, className }: { value: number; className?: string }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Garante que o valor seja numérico antes da animação
    const targetValue = isNaN(value) ? 0 : value;
    const controls = animate(displayValue, targetValue, {
      duration: 1.5,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplayValue(latest),
    });
    return () => controls.stop();
  }, [value]);

  return <span className={className}>{displayValue.toFixed(1).replace('.', ',')}</span>;
};

export const StatCard = ({ 
  label, 
  title,
  subtitle,
  value, 
  subValue, 
  imageUrl, 
  className, 
  breakdown,
  party,
  onFilterChange,
  selected = []
}: StatCardProps) => {
  const colors = {
    aprova: '#10b981', // emerald-500
    desaprova: '#f43f5e', // rose-500
    nsnr: '#d4d4d8', // zinc-300
  };

  const aprovaData = breakdown?.find(b => b.name === 'Aprova')?.value || 0;
  const desaprovaData = breakdown?.find(b => b.name === 'Desaprova')?.value || 0;
  const nsnrData = breakdown?.find(b => b.name === 'NS/NR')?.value || 0;

  const displayTitle = title;
  const displaySubtitle = subtitle || label;

  const isSelected = (name: string) => selected.includes(name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn(
        "bg-white rounded-[2.5rem] border border-zinc-100/80 p-6 md:p-8 w-full relative overflow-hidden group shadow-[0_20px_50px_rgba(234,88,12,0.08)] transition-all hover:shadow-[0_30px_60px_rgba(234,88,12,0.12)] hover:-translate-y-1 flex flex-col",
        className
      )}
    >
      <div className="flex flex-col items-start mb-6 relative z-10 w-full min-h-[3.5rem] space-y-1">
        {displayTitle && (
          <h4 className="text-[7px] font-black text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-2">
            <span className="w-1 h-3 bg-orange-600 rounded-full" />
            {displayTitle}
          </h4>
        )}
        <h3 className="text-lg font-black text-zinc-950 leading-tight tracking-tight">
          {displaySubtitle} {party && <span className="text-zinc-400 font-black text-[10px]">({party})</span>}
        </h3>
      </div>

      <div className="relative flex justify-center mb-6 z-10 w-full">
        <div className="w-40 h-40 md:w-44 md:h-44 rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-white relative z-10 transition-transform duration-500 group-hover:scale-105 bg-white">
          {imageUrl ? (
            <Image 
              src={imageUrl} 
              alt={displaySubtitle || "Foto"} 
              fill 
              className="object-cover object-top"
              sizes="(max-width: 768px) 160px, 176px"
            />
          ) : (
            <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-300 font-black">N/A</div>
          )}
        </div>
      </div>

      <div className="w-full h-2 bg-zinc-100 rounded-full flex overflow-hidden mb-6 relative z-10 shadow-inner">
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

      <div className="grid grid-cols-3 gap-1 text-center relative z-10 border-b border-zinc-100/80 pb-4 mb-4 w-full">
        <div 
          onClick={() => onFilterChange?.('Aprova')}
          className={cn(
            "flex flex-col items-center cursor-pointer transition-all duration-300 p-1.5 rounded-2xl",
            isSelected('Aprova') ? "bg-emerald-50 ring-1 ring-emerald-100" : "hover:bg-zinc-50"
          )}
        >
          <div className="flex items-baseline gap-0.5 mb-0.5">
            <NumberCounter value={aprovaData} className={cn("text-xl font-black", isSelected('Aprova') ? "text-emerald-600" : "text-zinc-900")} />
            <span className="text-[10px] font-black text-zinc-400">%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: colors.aprova }} />
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Aprova</span>
          </div>
        </div>
        
        <div 
          onClick={() => onFilterChange?.('Desaprova')}
          className={cn(
            "flex flex-col items-center cursor-pointer transition-all duration-300 p-1.5 rounded-2xl",
            isSelected('Desaprova') ? "bg-rose-50 ring-1 ring-rose-100" : "hover:bg-zinc-50"
          )}
        >
          <div className="flex items-baseline gap-0.5 mb-0.5">
            <NumberCounter value={desaprovaData} className={cn("text-xl font-black", isSelected('Desaprova') ? "text-rose-600" : "text-zinc-900")} />
            <span className="text-[10px] font-black text-zinc-400">%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: colors.desaprova }} />
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Desaprova</span>
          </div>
        </div>
        
        <div 
          onClick={() => onFilterChange?.('NS/NR')}
          className={cn(
            "flex flex-col items-center cursor-pointer transition-all duration-300 p-1.5 rounded-2xl",
            isSelected('NS/NR') ? "bg-zinc-100 ring-1 ring-zinc-200" : "hover:bg-zinc-50"
          )}
        >
          <div className="flex items-baseline gap-0.5 mb-0.5">
            <NumberCounter value={nsnrData} className={cn("text-xl font-black", isSelected('NS/NR') ? "text-zinc-600" : "text-zinc-900")} />
            <span className="text-[10px] font-black text-zinc-400">%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: colors.nsnr }} />
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">NS/NR</span>
          </div>
        </div>
      </div>

      <div className="text-center relative z-10 w-full mt-auto">
        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">{subValue}</span>
      </div>
    </motion.div>
  );
};
