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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        "bg-white rounded-[2.5rem] p-8 shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-zinc-100/50 flex flex-col gap-4 overflow-hidden group relative",
        "before:absolute before:inset-0 before:rounded-[2.5rem] before:ring-1 before:ring-inset before:ring-white/80 before:pointer-events-none",
        className
      )}
    >
      {(title || subtitle) && (
        <div className="space-y-1 mb-2 relative z-10">
          {title && <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{title}</h3>}
          {subtitle && <p className="text-lg font-bold text-zinc-900 tracking-tight">{subtitle}</p>}
        </div>
      )}
      <div className="flex-1 relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
