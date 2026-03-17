
"use client";

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

export const StatCard = ({ label, value, subValue, icon: Icon, trend, color }: StatCardProps) => {
  return (
    <div className="glass-card p-6 flex flex-col gap-4 interactive-ring group">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{label}</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-mono font-bold tracking-tighter text-zinc-50">
              {value}
            </h2>
            {trend && (
              <span className={cn(
                "text-[10px] font-mono px-1.5 py-0.5 rounded",
                trend === 'up' ? "text-emerald-400 bg-emerald-500/10" : "text-rose-400 bg-rose-500/10"
              )}>
                {trend === 'up' ? '+' : '-' }2.4%
              </span>
            )}
          </div>
        </div>
        <div className={cn(
          "p-2.5 rounded-lg border border-white/5 bg-zinc-900 group-hover:bg-zinc-800 transition-colors",
          color || "text-zinc-400"
        )}>
          <Icon size={18} />
        </div>
      </div>
      
      {subValue && (
        <div className="text-xs text-zinc-500 font-mono mt-auto border-t border-white/5 pt-4">
          <span className="text-zinc-400">CONTEXTO:</span> {subValue}
        </div>
      )}
    </div>
  );
};
