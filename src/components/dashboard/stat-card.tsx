
"use client";

import React, { useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';
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
  // Cores padronizadas do modelo
  const colors = {
    aprova: '#10b981', // emerald-500
    desaprova: '#f43f5e', // rose-500
    nsnr: '#d4d4d8', // zinc-300
  };

  const aprovaData = breakdown?.find(b => b.name === 'Aprova')?.value || 0;
  const desaprovaData = breakdown?.find(b => b.name === 'Desaprova')?.value || 0;
  const nsnrData = breakdown?.find(b => b.name === 'NS/NR')?.value || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn(
        "bg-white rounded-[2.5rem] border border-zinc-100/80 p-8 md:p-10 w-full relative overflow-hidden group shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col items-center",
        className
      )}
    >
      {/* Header Centralizado */}
      <div className="flex items-center justify-center mb-8 relative z-10 w-full">
        <h3 className="text-[10px] md:text-[11px] font-black text-zinc-950 uppercase tracking-[0.2em]">{label}</h3>
      </div>

      {/* Foto com Tamanho Ajustado */}
      <div className="relative flex justify-center mb-8 z-10 w-full">
        <div className="w-52 h-52 md:w-[210px] md:h-[210px] rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-white relative z-10 transition-transform duration-500 group-hover:scale-105 bg-white">
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

      {/* Barra de Progresso Segmentada */}
      <div className="w-full h-2.5 bg-zinc-100 rounded-full flex overflow-hidden mb-8 relative z-10 shadow-inner">
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

      {/* Grid de Estatísticas Detalhadas */}
      <div className="grid grid-cols-3 gap-2 text-center relative z-10 border-b border-zinc-100/80 pb-6 mb-6 w-full">
        <div className="flex flex-col items-center">
          <NumberCounter value={aprovaData} className="text-xl font-black text-zinc-900 mb-1" />
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.aprova }} />
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Aprova</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <NumberCounter value={desaprovaData} className="text-xl font-black text-zinc-900 mb-1" />
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.desaprova }} />
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Desaprova</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <NumberCounter value={nsnrData} className="text-xl font-black text-zinc-900 mb-1" />
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.nsnr }} />
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">NS/NR</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center relative z-10 w-full">
        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{subValue}</span>
      </div>
    </motion.div>
  );
};
