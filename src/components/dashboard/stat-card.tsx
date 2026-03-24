"use client";

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { LuxuryCard } from './luxury-card';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: React.ReactNode;
  imageUrl?: string;
  trend?: 'up' | 'down';
  className?: string;
  breakdown?: { name: string; value: number }[];
}

export const StatCard = ({ 
  label, 
  value, 
  subValue, 
  imageUrl, 
  trend, 
  className, 
  breakdown
}: StatCardProps) => {
  return (
    <LuxuryCard className={cn(
      "group overflow-hidden transition-all duration-500", 
      "rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] p-10",
      className
    )}>
      <div className="flex flex-col h-full relative z-10">
        {/* Header: Label e Badge 2026 */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-[11px] font-black uppercase text-zinc-400 tracking-[0.3em]">{label}</p>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ecfdf5] border border-[#d1fae5] text-[#065f46] shadow-sm">
            <ArrowUpRight size={10} strokeWidth={3} />
            <span className="text-[10px] font-black tracking-widest">2026</span>
          </div>
        </div>

        {/* Foto Retangular Vertical com Glow */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative group/img">
            <div className="absolute -inset-4 bg-white/40 blur-2xl rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity duration-700" />
            <div className={cn(
              "relative overflow-hidden transition-all duration-1000",
              "aspect-[3/4] w-36 rounded-[2rem] border-[6px] border-white shadow-[0_30px_60px_rgba(0,0,0,0.12)] ring-1 ring-zinc-100"
            )}>
              {imageUrl ? (
                <Image 
                  src={imageUrl} 
                  alt={label} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                />
              ) : (
                <div className="w-full h-full bg-zinc-50 flex items-center justify-center text-zinc-200 uppercase text-[10px] font-black">N/A</div>
              )}
            </div>
          </div>
        </div>

        {/* Valor Principal Gigante */}
        <div className="text-center mb-8">
          <h2 className="text-6xl font-black tracking-tighter text-zinc-950">
            {value}
          </h2>
        </div>

        {/* Linha Divisora Sutil */}
        <div className="w-full h-px bg-zinc-100 mb-8" />

        {/* Gráfico de Barras Analítico (Estilo Print) */}
        {breakdown && (
          <div className="mb-8">
            <div className="relative flex justify-between items-end gap-4 h-24 px-4">
              {/* Linha de Base Pontilhada (Dashed) */}
              <div className="absolute bottom-[32px] left-0 right-0 border-b border-dashed border-blue-400/30 z-0" />
              
              {breakdown.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 z-10">
                  <span className="text-[11px] font-black text-zinc-900 leading-none">
                    {item.value.toFixed(1)}%
                  </span>
                  <div 
                    className="w-full max-w-[32px] bg-[#fbbf24] rounded-sm transition-all duration-1000 shadow-sm"
                    style={{ height: `${Math.max(item.value, 4)}%` }}
                  />
                  <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest whitespace-nowrap">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Footer: Contexto */}
        {subValue && (
          <div className="mt-auto text-center">
            <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">
              {subValue}
            </div>
          </div>
        )}
      </div>
    </LuxuryCard>
  );
};
