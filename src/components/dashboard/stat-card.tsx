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
    <BentoCard className={cn("group", className)}>
      <div className="flex flex-col h-full justify-between relative z-10">
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <div className="p-3 lg:p-4 rounded-xl lg:rounded-2xl inner-relief text-zinc-600 group-hover:premium-gradient group-hover:text-white transition-all duration-500">
            <Icon size={20} className="lg:size-[24px]" strokeWidth={2.5} />
          </div>
          
          {trend && (
            <div className={cn(
                "text-[9px] lg:text-[10px] font-black px-3 lg:px-4 py-1.5 rounded-lg lg:rounded-xl flex items-center gap-1.5 uppercase tracking-widest border shadow-sm",
                trend === 'up' 
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                  : "bg-rose-50 text-rose-600 border-rose-100"
              )}
            >
              {trend === 'up' ? <ArrowUpRight size={10} strokeWidth={3} /> : <ArrowDownRight size={10} strokeWidth={3} />}
              2.4%
            </div>
          )}
        </div>

        <div className="space-y-1.5 lg:space-y-2.5">
          <p className="text-[9px] lg:text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em]">{label}</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl lg:text-5xl font-mono font-bold text-zinc-950 tracking-tighter tabular-nums leading-none">
              {value}
            </h2>
          </div>
          {subValue && (
            <div className="flex items-center gap-2 mt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <p className="text-[10px] lg:text-[11px] text-zinc-500 font-bold uppercase tracking-tight">
                {subValue}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="absolute top-0 right-0 p-4 lg:p-8 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-1000 pointer-events-none">
        <Icon size={120} className="lg:size-[180px]" strokeWidth={0.5} />
      </div>
    </BentoCard>
  );
};