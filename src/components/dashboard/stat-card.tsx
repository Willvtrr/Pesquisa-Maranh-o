"use client";

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { BentoCard } from './bento-card';
import { cn } from '@/lib/utils';

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
    <BentoCard className={cn("p-6", className)}>
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-2xl bg-orange-50 text-orange-600">
            <Icon size={20} />
          </div>
          {trend && (
            <span className={cn(
              "text-[10px] font-bold px-2 py-1 rounded-full",
              trend === 'up' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
            )}>
              {trend === 'up' ? '↑' : '↓'} 2.4%
            </span>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">{label}</p>
          <h2 className="text-3xl font-mono font-bold text-zinc-900 tracking-tighter">{value}</h2>
          {subValue && <p className="text-[10px] text-zinc-400 font-medium">{subValue}</p>}
        </div>
      </div>
    </BentoCard>
  );
};
