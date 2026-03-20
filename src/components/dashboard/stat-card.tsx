"use client";

import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LuxuryCard } from './luxury-card';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: React.ReactNode;
  icon?: LucideIcon;
  imageUrl?: string;
  trend?: 'up' | 'down';
  className?: string;
  variant?: 'default' | 'hero';
}

export const StatCard = ({ label, value, subValue, icon: Icon, imageUrl, trend, className, variant = 'default' }: StatCardProps) => {
  return (
    <LuxuryCard className={cn("group overflow-hidden", className)}>
      <div className="flex flex-col h-full relative z-10">
        <div className="flex items-start justify-between mb-2">
          {trend && (
            <div className={cn(
                "text-[8px] font-black px-2 py-1 rounded-lg flex items-center gap-1 uppercase tracking-widest border shadow-sm",
                trend === 'up' 
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                  : "bg-rose-50 text-rose-600 border-rose-100"
              )}
            >
              {trend === 'up' ? <ArrowUpRight size={8} strokeWidth={3} /> : <ArrowDownRight size={8} strokeWidth={3} />}
              REF. 2026
            </div>
          )}
        </div>

        <div className={cn(
          "flex items-center justify-center flex-1 mb-4",
          variant === 'hero' ? "w-full" : "justify-start"
        )}>
          {imageUrl ? (
            <div className={cn(
              "relative overflow-hidden transition-all duration-500",
              variant === 'hero' 
                ? "w-full aspect-[2/1] rounded-2xl border-2 border-white shadow-xl ring-1 ring-zinc-50" 
                : "w-10 h-10 rounded-xl border border-white shadow-md ring-1 ring-zinc-100"
            )}>
              <Image 
                src={imageUrl} 
                alt={label} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          ) : Icon ? (
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-600 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500">
              <Icon size={18} strokeWidth={2.5} />
            </div>
          ) : null}
        </div>

        <div className="space-y-2 mt-auto">
          <div className="space-y-0.5">
            <p className="text-[8px] font-black uppercase text-zinc-400 tracking-[0.15em]">{label}</p>
            <h2 className="text-2xl font-mono font-bold text-zinc-950 tracking-tighter leading-none">
              {value}
            </h2>
          </div>
          
          {subValue && (
            <div className="pt-1.5 border-t border-zinc-100/50">
              <div className="text-[9px] font-bold text-zinc-500 truncate">
                {subValue}
              </div>
            </div>
          )}
        </div>
      </div>
    </LuxuryCard>
  );
};
