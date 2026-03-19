"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface LuxuryCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

/**
 * LuxuryCard - Componente universal com sombreamento 3D composto.
 * Simula material sólido com oclusão de ambiente e bisel tátil.
 */
export const LuxuryCard = ({ children, className, title, subtitle }: LuxuryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        // Definição de Material (Sólido)
        "bg-white rounded-[2.5rem] p-6 lg:p-8 flex flex-col gap-4 overflow-hidden relative",
        // Bisel Tátil e Brilho de Topo
        "border border-zinc-100 ring-1 ring-white/60",
        // Engenharia da Sombra (Sombra Composta)
        "shadow-[0_20px_50px_rgba(0,0,0,0.03),0_2px_10px_rgba(0,0,0,0.04)]",
        // Interação de Elevação
        "transition-all duration-300 hover:shadow-[0_30px_60px_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.05)] hover:-translate-y-1",
        className
      )}
    >
      {(title || subtitle) && (
        <div className="space-y-1 mb-2 relative z-10">
          {title && (
            <h3 className="text-[9px] lg:text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-1 h-3 bg-orange-600 rounded-full" />
              {title}
            </h3>
          )}
          {subtitle && <p className="text-xl lg:text-2xl font-bold text-zinc-950 tracking-tight">{subtitle}</p>}
        </div>
      )}
      
      <div className="flex-1 relative z-10">
        {children}
      </div>
      
      {/* Sutil detalhe de base para reforçar o volume */}
      <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-zinc-50/50 border-t border-zinc-100/30 z-0" />
    </motion.div>
  );
};
