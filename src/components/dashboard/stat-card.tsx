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
  breakdown?: { name: string; value: number }[];
}

export const StatCard = ({ 
  label, 
  value, 
  subValue, 
  icon: Icon, 
  imageUrl, 
  trend, 
  className, 
  variant = 'default',
  breakdown
}: StatCardProps) => {
  return (
    <LuxuryCard className={cn(
      "group overflow-hidden transition-all duration-500", 
      "rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)]",
      className
    )}>
      <div className="flex flex-col h-full relative z-10">
        {/* Título Acima da Foto */}
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.25em]">{label}</p>
          </div>
          {trend && (
            <div className={cn(
                "text-[8px] font-black px-2 py-1 rounded-full flex items-center gap-1 uppercase tracking-widest border shadow-sm",
                trend === 'up' 
                  ? "bg-emerald-50/50 text-emerald-600 border-emerald-100" 
                  : "bg-rose-50/50 text-rose-600 border-rose-100"
              )}
            >
              {trend === 'up' ? <ArrowUpRight size={8} /> : <ArrowDownRight size={8} />}
              2026
            </div>
          )}
        </div>

        {/* Foto Retangular Vertical */}
        <div className="flex items-center justify-center mb-6 w-full">
          {imageUrl ? (
            <div className={cn(
              "relative overflow-hidden transition-all duration-1000",
              "aspect-[3/4] w-32 rounded-2xl border-[5px] border-white shadow-[0_20px_40px_rgba(0,0,0,0.15)] ring-1 ring-zinc-200/50"
            )}>
              <Image 
                src={imageUrl} 
                alt={label} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-1000"
              />
            </div>
          ) : (
            <div className="aspect-[3/4] w-32 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200 flex items-center justify-center">
               <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">N/A</span>
            </div>
          )}
        </div>

        {/* Valor Principal */}
        <div className="text-center mb-6">
          <h2 className="text-5xl font-black tracking-tighter leading-none text-zinc-950">
            {value}
          </h2>
        </div>

        {/* Gráfico de Barras Analítico (Estilo Print) */}
        {breakdown && (
          <div className="mt-auto pt-4 border-t border-zinc-100">
            <div className="relative flex justify-between items-end gap-2 h-20 px-2 pb-5">
              {/* Linha de Base Pontilhada Azul */}
              <div className="absolute bottom-[20px] left-0 right-0 border-b border-dotted border-blue-400/40 z-0" />
              
              {breakdown.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 z-10">
                  <span className="text-[9px] font-black text-zinc-900 leading-none">
                    {item.value.toFixed(1)}%
                  </span>
                  <div 
                    className="w-full max-w-[24px] bg-[#fbbf24] transition-all duration-1000 delay-300"
                    style={{ height: `${Math.max(item.value, 2)}%`, minHeight: '2px' }}
                  />
                  <span className="text-[7px] font-black uppercase text-zinc-400 tracking-tighter whitespace-nowrap">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {subValue && (
          <div className="pt-3 border-t border-zinc-100 flex justify-center mt-2">
            <div className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">
              {subValue}
            </div>
          </div>
        )}
      </div>
    </LuxuryCard>
  );
};
