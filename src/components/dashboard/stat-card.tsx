
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
    <LuxuryCard className={cn("group min-h-[420px]", className)}>
      <div className="flex flex-col h-full relative z-10">
        {/* Top Section: Trend & Actions */}
        <div className="flex items-start justify-between mb-4">
          {trend && (
            <div className={cn(
                "text-[10px] font-black px-4 py-2 rounded-xl flex items-center gap-1.5 uppercase tracking-widest border shadow-sm",
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

        {/* Middle Section: Image (Hero or Small) */}
        <div className={cn(
          "flex items-center justify-center flex-1 mb-8",
          variant === 'hero' ? "w-full" : "justify-start"
        )}>
          {imageUrl ? (
            <div className={cn(
              "relative overflow-hidden transition-all duration-500",
              variant === 'hero' 
                ? "w-full aspect-video rounded-[2rem] border-4 border-white shadow-2xl ring-1 ring-zinc-100" 
                : "w-16 h-16 rounded-2xl border-2 border-white shadow-lg ring-1 ring-zinc-200"
            )}>
              <Image 
                src={imageUrl} 
                alt={label} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          ) : Icon ? (
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-zinc-600 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500">
              <Icon size={24} strokeWidth={2.5} />
            </div>
          ) : null}
        </div>

        {/* Bottom Section: Label, Value & Controls */}
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em]">{label}</p>
            <h2 className="text-4xl font-mono font-bold text-zinc-950 tracking-tighter leading-none">
              {value}
            </h2>
          </div>
          
          {subValue && (
            <div className="pt-2 border-t border-zinc-100/50">
              {subValue}
            </div>
          )}
        </div>
      </div>
    </LuxuryCard>
  );
};
