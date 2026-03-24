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
      "rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)]",
      className
    )}>
      <div className="flex flex-col h-full relative z-10">
        <div className="flex items-start justify-between mb-2">
          {trend && (
            <div className={cn(
                "text-[9px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 uppercase tracking-widest border shadow-sm",
                trend === 'up' 
                  ? "bg-emerald-50/50 text-emerald-600 border-emerald-100" 
                  : "bg-rose-50/50 text-rose-600 border-rose-100"
              )}
            >
              {trend === 'up' ? <ArrowUpRight size={10} strokeWidth={3} /> : <ArrowDownRight size={10} strokeWidth={3} />}
              REF. 2026
            </div>
          )}
        </div>

        <div className="flex items-center justify-center mb-6 w-full">
          {imageUrl ? (
            <div className={cn(
              "relative overflow-hidden transition-all duration-1000",
              variant === 'hero' ? "size-32 rounded-full border-[6px] border-white shadow-[0_15px_35px_rgba(0,0,0,0.1)] ring-1 ring-zinc-200/50" : "aspect-video w-full rounded-2xl border-4 border-white shadow-xl"
            )}>
              <Image 
                src={imageUrl} 
                alt={label} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-1000"
              />
            </div>
          ) : Icon ? (
            <div className="p-6 rounded-full bg-zinc-50 border border-zinc-100 text-zinc-600 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500">
              <Icon size={32} strokeWidth={2.5} />
            </div>
          ) : (
            <div className="size-32 bg-zinc-50 rounded-full border border-dashed border-zinc-200 flex items-center justify-center">
               <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">N/A</span>
            </div>
          )}
        </div>

        <div className="space-y-4 text-center pb-2">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.25em]">{label}</p>
            <h2 className={cn(
              "font-sans font-black tracking-tighter leading-none text-zinc-950",
              variant === 'hero' ? "text-5xl" : "text-4xl"
            )}>
              {value}
            </h2>
          </div>
          
          {subValue && (
            <div className="pt-5 border-t border-zinc-100 flex justify-center mt-4">
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                {subValue}
              </div>
            </div>
          )}
        </div>
      </div>
    </LuxuryCard>
  );
};
