
"use client";

import React, { useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Maximize2 } from 'lucide-react';

interface StatCardProps {
  label?: string;
  title?: string;
  subtitle?: string;
  value: number;
  subValue?: React.ReactNode;
  imageUrl?: string;
  className?: string;
  breakdown?: { name: string; value: number }[];
  party?: string;
  onFilterChange?: (name: string) => void;
  onDetailClick?: () => void;
  selected?: string[];
}

const NumberCounter = ({ value, className }: { value: number; className?: string }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
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
  onDetailClick,
  selected = []
}: StatCardProps) => {
  const colors = {
    aprova: '#10b981',
    desaprova: '#f43f5e',
    nsnr: '#d4d4d8',
  };

  const aprovaData = breakdown?.find(b => b.name === 'Aprova')?.value || 0;
  const desaprovaData = breakdown?.find(b => b.name === 'Desaprova')?.value || 0;
  const nsnrData = breakdown?.find(b => b.name === 'NS/NR')?.value || 0;

  const isSelected = (name: string) => selected.includes(name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -8, transition: { duration: 0.2, ease: "easeOut" } }}
      className={cn(
        "bg-white rounded-[3rem] border border-zinc-100/80 p-8 w-full relative overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_40px_80px_rgba(234,88,12,0.1)] flex flex-col cursor-pointer",
        className
      )}
      onClick={onDetailClick}
    >
      <div className="flex flex-col items-start mb-8 relative z-10 w-full min-h-[3.5rem] space-y-1">
        <div className="flex items-center justify-between w-full">
          {title && (
            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-1 h-3 bg-orange-600 rounded-full" />
              {title}
            </h4>
          )}
          <Maximize2 size={14} className="text-zinc-300 group-hover:text-orange-500 transition-colors" />
        </div>
        <h3 className="text-2xl font-black text-zinc-950 leading-tight tracking-tight">
          {subtitle || label} {party && <span className="text-zinc-400 font-bold text-xs ml-1">({party})</span>}
        </h3>
      </div>

      <div className="relative flex justify-center mb-10 z-10 w-full">
        <div className="w-48 h-48 rounded-[2.5rem] overflow-hidden shadow-2xl border-[8px] border-white relative z-10 transition-transform duration-700 group-hover:scale-105 bg-zinc-50">
          {imageUrl ? (
            <Image 
              src={imageUrl} 
              alt={subtitle || label || "Foto"} 
              fill 
              className="object-cover object-top"
              sizes="(max-width: 768px) 192px, 192px"
            />
          ) : (
            <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-300 font-black">N/A</div>
          )}
        </div>
        <div className="absolute inset-0 bg-orange-500/5 blur-[60px] rounded-full scale-75 group-hover:scale-110 transition-transform duration-700" />
      </div>

      <div className="w-full h-2.5 bg-zinc-100 rounded-full flex overflow-hidden mb-10 relative z-10 shadow-inner">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${aprovaData}%` }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="h-full"
          style={{ backgroundColor: colors.aprova }}
        />
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${desaprovaData}%` }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="h-full"
          style={{ backgroundColor: colors.desaprova }}
        />
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${nsnrData}%` }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="h-full"
          style={{ backgroundColor: colors.nsnr }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center relative z-10 border-b border-zinc-50 pb-6 mb-6 w-full">
        <div 
          onClick={(e) => { e.stopPropagation(); onFilterChange?.('Aprova'); }}
          className={cn(
            "flex flex-col items-center cursor-pointer transition-all duration-300 p-2 rounded-2xl",
            isSelected('Aprova') ? "bg-emerald-50 ring-1 ring-emerald-100" : "hover:bg-zinc-50"
          )}
        >
          <div className="flex items-baseline gap-0.5 mb-1">
            <NumberCounter value={aprovaData} className={cn("text-3xl font-black tracking-tighter", isSelected('Aprova') ? "text-emerald-600" : "text-zinc-950")} />
            <span className="text-xs font-black text-zinc-400">%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.aprova }} />
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Aprova</span>
          </div>
        </div>
        
        <div 
          onClick={(e) => { e.stopPropagation(); onFilterChange?.('Desaprova'); }}
          className={cn(
            "flex flex-col items-center cursor-pointer transition-all duration-300 p-2 rounded-2xl",
            isSelected('Desaprova') ? "bg-rose-50 ring-1 ring-rose-100" : "hover:bg-zinc-50"
          )}
        >
          <div className="flex items-baseline gap-0.5 mb-1">
            <NumberCounter value={desaprovaData} className={cn("text-3xl font-black tracking-tighter", isSelected('Desaprova') ? "text-rose-600" : "text-zinc-950")} />
            <span className="text-xs font-black text-zinc-400">%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.desaprova }} />
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Desaprova</span>
          </div>
        </div>
        
        <div 
          onClick={(e) => { e.stopPropagation(); onFilterChange?.('NS/NR'); }}
          className={cn(
            "flex flex-col items-center cursor-pointer transition-all duration-300 p-2 rounded-2xl",
            isSelected('NS/NR') ? "bg-zinc-100 ring-1 ring-zinc-200" : "hover:bg-zinc-50"
          )}
        >
          <div className="flex items-baseline gap-0.5 mb-1">
            <NumberCounter value={nsnrData} className={cn("text-3xl font-black tracking-tighter", isSelected('NS/NR') ? "text-zinc-600" : "text-zinc-950")} />
            <span className="text-xs font-black text-zinc-400">%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.nsnr }} />
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">NS/NR</span>
          </div>
        </div>
      </div>

      <div className="text-center relative z-10 w-full mt-auto">
        <span className="text-xs font-black text-zinc-400 uppercase tracking-[0.4em]">{subValue}</span>
      </div>
    </motion.div>
  );
};
