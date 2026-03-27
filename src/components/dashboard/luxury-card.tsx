"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface LuxuryCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export const LuxuryCard = ({ children, className, title, subtitle }: LuxuryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        "bg-white rounded-[2rem] p-5 lg:p-6 flex flex-col gap-3 overflow-hidden relative",
        "border border-zinc-200/60 ring-1 ring-white/60",
        "shadow-[0_15px_40px_rgba(234,88,12,0.04),0_1px_3px_rgba(0,0,0,0.01)]",
        "transition-all duration-300 hover:shadow-[0_25px_50px_rgba(234,88,12,0.08)]",
        className
      )}
    >
      {(title || subtitle) && (
        <div className="space-y-0.5 mb-1 relative z-10">
          {title && (
            <h3 className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-1 h-3 bg-orange-600 rounded-full" />
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-base font-black text-zinc-950 tracking-tight leading-tight">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      <div className="flex-1 relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
