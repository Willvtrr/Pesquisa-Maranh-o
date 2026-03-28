"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TrendingUp, AlertCircle, CheckCircle2, Target } from 'lucide-react';

interface RankingItem {
  name: string;
  value: number;
}

interface RankingCardProps {
  title: string;
  overline: string;
  subtitle?: string;
  footerLabel: string;
  data: RankingItem[];
  total: number;
  color: 'red' | 'green' | 'orange';
  className?: string;
}

export const RankingCard = ({ 
  title, 
  overline, 
  subtitle,
  footerLabel, 
  data, 
  total, 
  color,
  className 
}: RankingCardProps) => {
  const maxVal = useMemo(() => Math.max(...data.map(d => d.value), 1), [data]);

  const colorStyles = {
    red: {
      overline: "text-rose-500",
      bar: "bg-rose-500",
      percentage: "text-rose-500",
      icon: <AlertCircle size={12} className="text-zinc-300" />,
      indicator: "bg-rose-500"
    },
    green: {
      overline: "text-emerald-500",
      bar: "bg-emerald-500",
      percentage: "text-emerald-500",
      icon: <CheckCircle2 size={12} className="text-zinc-300" />,
      indicator: "bg-emerald-500"
    },
    orange: {
      overline: "text-orange-500",
      bar: "bg-orange-600",
      percentage: "text-orange-600",
      icon: <Target size={12} className="text-zinc-300" />,
      indicator: "bg-orange-600"
    }
  };

  const style = colorStyles[color];

  return (
    <div className={cn(
      "bg-white rounded-[2.5rem] p-6 lg:p-7 border border-zinc-100 shadow-sm flex flex-col h-full",
      className
    )}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <div className={cn("w-1 h-3 rounded-full", style.indicator)} />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">
            {overline}
          </span>
        </div>
        <h2 className="text-lg font-black text-zinc-950 tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[8px] font-medium text-zinc-400 italic mt-1 leading-tight">
            "{subtitle}"
          </p>
        )}
      </div>

      {/* List */}
      <div className="flex-1 space-y-4">
        {data.slice(0, 5).map((item, idx) => {
          const pct = total > 0 ? (item.value / total) * 100 : 0;
          const relativeWidth = (item.value / maxVal) * 100;

          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-zinc-300 uppercase tabular-nums">
                    #{idx + 1}
                  </span>
                  <span className="text-[10px] font-black text-zinc-800 uppercase tracking-tight truncate max-w-[180px]">
                    {item.name}
                  </span>
                </div>
                <span className={cn("text-[10px] font-black tabular-nums", style.percentage)}>
                  {pct.toFixed(1).replace('.', ',')}%
                </span>
              </div>
              <div className="h-[2px] w-full bg-zinc-50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${relativeWidth}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                  className={cn("h-full rounded-full", style.bar)}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-5 border-t border-zinc-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {style.icon}
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
            {footerLabel}
          </span>
        </div>
        {color === 'green' ? (
          <TrendingUp size={12} className="text-emerald-500" />
        ) : color === 'red' ? (
          <TrendingUp size={12} className="text-rose-500 rotate-180" />
        ) : (
          <TrendingUp size={12} className="text-orange-500" />
        )}
      </div>
    </div>
  );
};