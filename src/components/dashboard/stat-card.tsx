
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
    <BentoCard className={cn("p-8 overflow-hidden group", className)}>
      <div className="flex flex-col h-full justify-between relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="p-3.5 rounded-2xl bg-orange-50 text-orange-600 ring-1 ring-orange-100 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500">
            <Icon size={24} />
          </div>
          {trend && (
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1 uppercase tracking-widest",
                trend === 'up' ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100" : "bg-rose-50 text-rose-600 ring-1 ring-rose-100"
              )}
            >
              {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              2.4%
            </motion.div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em]">{label}</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-mono font-bold text-zinc-900 tracking-tighter tabular-nums leading-none">
              {value}
            </h2>
          </div>
          {subValue && (
            <div className="flex items-center gap-2 mt-2">
              <div className="w-1 h-1 rounded-full bg-orange-400" />
              <p className="text-[11px] text-zinc-400 font-medium leading-relaxed uppercase tracking-tighter">
                {subValue}
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Subtle Background Pattern */}
      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity duration-700">
        <Icon size={120} className="text-zinc-900" />
      </div>
    </BentoCard>
  );
};
