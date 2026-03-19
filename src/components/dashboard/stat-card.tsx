
"use client";

import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LuxuryCard } from './luxury-card';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: LucideIcon;
  imageUrl?: string;
  trend?: 'up' | 'down';
  className?: string;
}

export const StatCard = ({ label, value, subValue, icon: Icon, imageUrl, trend, className }: StatCardProps) => {
  return (
    <LuxuryCard className={cn("group", className)}>
      <div className="flex flex-col h-full justify-between relative z-10">
        <div className="flex items-start justify-between mb-4 lg:mb-6">
          {imageUrl ? (
            <div className="relative w-14 h-14 lg:w-16 lg:h-16 rounded-2xl overflow-hidden border-2 border-white shadow-lg ring-1 ring-zinc-200 group-hover:ring-orange-500/50 transition-all duration-500">
              <Image 
                src={imageUrl} 
                alt={label} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
          ) : Icon ? (
            <div className="p-3 lg:p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-zinc-600 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500">
              <Icon size={20} className="lg:size-[24px]" strokeWidth={2.5} />
            </div>
          ) : null}
          
          {trend && (
            <div className={cn(
                "text-[9px] lg:text-[10px] font-black px-3 lg:px-4 py-1.5 rounded-xl flex items-center gap-1.5 uppercase tracking-widest border shadow-sm",
                trend === 'up' 
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                  : "bg-rose-50 text-rose-600 border-rose-100"
              )}
            >
              {trend === 'up' ? <ArrowUpRight size={10} strokeWidth={3} /> : <ArrowDownRight size={10} strokeWidth={3} />}
              Ref. 2026
            </div>
          )}
        </div>

        <div className="space-y-1 lg:space-y-2">
          <p className="text-[9px] lg:text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em]">{label}</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl lg:text-4xl font-mono font-bold text-zinc-950 tracking-tighter tabular-nums leading-none">
              {value}
            </h2>
          </div>
          {subValue && (
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <p className="text-[10px] lg:text-[11px] text-zinc-500 font-bold uppercase tracking-tight">
                {subValue}
              </p>
            </div>
          )}
        </div>
      </div>
    </LuxuryCard>
  );
};
