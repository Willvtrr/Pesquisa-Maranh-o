"use client";

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <div className="glass-card p-6 flex flex-col gap-4 interactive-ring group bg-white border-zinc-200">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest">{label}</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-mono font-bold tracking-tighter text-zinc-900">
              {value}
            </h2>
            {trend && (
              <span className={cn(
                "text-[10px] font-mono px-1.5 py-0.5 rounded font-bold",
                trend === 'up' ? "text-orange-600 bg-orange-50" : "text-rose-600 bg-rose-50"
              )}>
                {trend === 'up' ? '+' : '-' }2.4%
              </span>
            )}
          </div>
        </div>
        <div className={cn(
          "p-2.5 rounded-lg border border-zinc-100 bg-zinc-50 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors",
          color || "text-zinc-400"
        )}>
          <Icon size={18} />
        </div>
      </div>
      
      {subValue && (
        <div className="text-[10px] text-zinc-400 font-mono mt-auto border-t border-zinc-100 pt-4">
          <span className="text-orange-600 font-bold">CONTEXTO:</span> {subValue}
        </div>
      )}
    </div>
  );
};
