"use client";

import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BentoCard } from './bento-card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down';
  className?: string;
}

export const StatCard = ({ label, value, subValue, icon: Icon, trend, className }: StatCardProps) => {
  return (
    <BentoCard className={cn("group transition-all duration-700", className)}>
      <div className="flex flex-col h-full justify-between relative z-10">
        <div className="flex items-center justify-between mb-8">
          {/* Container do Ícone: Relevo Técnico e Acento Metálico - Rotação Removida */}
          <div className="p-4 rounded-2xl inner-relief text-zinc-600 group-hover:premium-gradient group-hover:text-white group-hover:border-transparent transition-all duration-500 group-hover:scale-110">
            <Icon size={24} strokeWidth={2.5} />
          </div>
          
          {trend && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "text-[10px] font-black px-4 py-1.5 rounded-xl flex items-center gap-1.5 uppercase tracking-widest border shadow-sm",
                trend === 'up' 
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                  : "bg-rose-50 text-rose-600 border-rose-100"
              )}
            >
              {trend === 'up' ? <ArrowUpRight size={12} strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />}
              2.4%
            </motion.div>
          )}
        </div>

        <div className="space-y-2.5">
          <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.3em]">{label}</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-5xl font-mono font-bold text-zinc-950 tracking-tighter tabular-nums leading-none">
              {value}
            </h2>
          </div>
          {subValue && (
            <div className="flex items-center gap-3 mt-3">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
              <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-tight leading-none">
                {subValue}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Detalhe Visual de Fundo: Profundidade 3D */}
      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-[0.04] transition-opacity duration-1000 pointer-events-none">
        <Icon size={180} strokeWidth={0.5} className="text-zinc-950" />
      </div>
    </BentoCard>
  );
};