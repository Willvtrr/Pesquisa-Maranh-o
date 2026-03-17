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
      whileHover={{ 
        y: -6, 
        transition: { duration: 0.3, ease: "easeOut" } 
      }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        "bg-white rounded-[2.5rem] p-8 flex flex-col gap-4 overflow-hidden relative border border-zinc-200/60",
        "shadow-[0_8px_30px_rgba(0,0,0,0.04),0_4px_10px_rgba(0,0,0,0.02)]",
        "before:absolute before:inset-0 before:rounded-[2.5rem] before:ring-1 before:ring-inset before:ring-white before:pointer-events-none before:z-20",
        className
      )}
    >
      {(title || subtitle) && (
        <div className="space-y-1 mb-2 relative z-10">
          {title && <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{title}</h3>}
          {subtitle && <p className="text-xl font-bold text-zinc-900 tracking-tight">{subtitle}</p>}
        </div>
      )}
      <div className="flex-1 relative z-10">
        {children}
      </div>
      
      {/* Subtle bottom bevel for 3D feel */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-100/50 border-t border-zinc-200/20" />
    </motion.div>
  );
};