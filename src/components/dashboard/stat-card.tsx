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
        <div className="flex items-start justify-between mb-4">
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

        <div className="flex items-center justify-center mb-6 w-full px-2">
          {imageUrl ? (
            <div className={cn(
              "relative overflow-hidden transition-all duration-1000 aspect-[16/10] w-full",
              "rounded-[2.5rem] border-[4px] border-white shadow-2xl ring-1 ring-zinc-100"
            )}>
              <Image 
                src={imageUrl} 
                alt={label} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-1000"
              />
            </div>
          ) : Icon ? (
            <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-100 text-zinc-600 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500">
              <Icon size={24} strokeWidth={2.5} />
            </div>
          ) : (
            <div className="aspect-[16/10] w-full bg-zinc-50 rounded-[2.5rem] border border-dashed border-zinc-200 flex items-center justify-center">
               <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Sem Imagem</span>
            </div>
          )}
        </div>

        <div className="space-y-4 mt-auto text-center pb-2">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em]">{label}</p>
            <h2 className={cn(
              "font-mono font-black tracking-tighter leading-none text-zinc-950 text-4xl"
            )}>
              {value}
            </h2>
          </div>
          
          {subValue && (
            <div className="pt-3 border-t border-zinc-100/50 flex justify-center">
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
