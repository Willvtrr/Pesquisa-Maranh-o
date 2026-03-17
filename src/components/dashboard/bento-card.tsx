"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export const BentoCard = ({ children, className, title, subtitle }: BentoCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white rounded-[2rem] p-8 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-zinc-100/50 flex flex-col gap-4 overflow-hidden",
        className
      )}
    >
      {(title || subtitle) && (
        <div className="space-y-1 mb-2">
          {title && <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">{title}</h3>}
          {subtitle && <p className="text-xs text-zinc-400 font-medium">{subtitle}</p>}
        </div>
      )}
      <div className="flex-1">
        {children}
      </div>
    </motion.div>
  );
};
