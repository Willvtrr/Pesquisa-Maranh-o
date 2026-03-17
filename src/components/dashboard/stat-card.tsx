"use client";

import React from 'react';
import { LucideIcon } from 'lucide-react';
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
    <BentoCard className={cn("p-8", className)}>
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-center justify-between mb-6">
          <div className="p-3 rounded-2xl bg-orange-50 text-orange-600 ring-1 ring-orange-100">
            <Icon size={22} />
          </div>
          {trend && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1",
                trend === 'up' ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100" : "bg-rose-50 text-rose-600 ring-1 ring-rose-100"
              )}
            >
              <span className="text-xs">{trend === 'up' ? '↑' : '↓'}</span>
              2.4%
            </motion.div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em]">{label}</p>
          <div className="flex items-baseline gap-1">
            <h2 className="text-4xl font-mono font-bold text-zinc-900 tracking-tighter">{value}</h2>
          </div>
          {subValue && <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">{subValue}</p>}
        </div>
      </div>
    </BentoCard>
  );
};
