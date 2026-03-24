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
    <LuxuryCard className={cn(
      "group overflow-hidden transition-all duration-500", 
      variant === 'hero' ? "rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)]" : "",
      className
    )}>
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
              "relative overflow-hidden transition-all duration-1000",
              variant === 'hero' 
                ? "w-40 h-40 rounded-full border-[6px] border-white shadow-2xl ring-4 ring-orange-500/10" 
                : "w-12 h-12 rounded-2xl border border-white shadow-md ring-1 ring-zinc-100"
            )}>
              <Image 
                src={imageUrl} 
                alt={label} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-1000"
              />
            </div>
          ) : Icon ? (
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-zinc-600 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500">
              <Icon size={20} strokeWidth={2.5} />
            </div>
          ) : null}
        </div>

        <div className="space-y-3 mt-auto text-center">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em]">{label}</p>
            <h2 className={cn(
              "font-mono font-black tracking-tighter leading-none text-zinc-950",
              variant === 'hero' ? "text-5xl" : "text-2xl"
            )}>
              {value}
            </h2>
          </div>
          
          {subValue && (
            <div className="pt-2 border-t border-zinc-100/50 flex justify-center">
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                {subValue}
              </div>
            </div>
          )}
        </div>
      </div>
    </LuxuryCard>
  );
};
