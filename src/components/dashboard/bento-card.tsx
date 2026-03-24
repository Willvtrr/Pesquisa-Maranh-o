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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ 
        y: -5,
        scale: 1.005,
        transition: { duration: 0.15, ease: "circOut" } 
      }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        "bg-white rounded-[2rem] p-6 lg:p-7 flex flex-col gap-4 overflow-hidden relative",
        "border border-zinc-200/80 bento-3d shadow-sm",
        "group transition-shadow duration-300",
        className
      )}
    >
      {(title || subtitle) && (
        <div className="space-y-1 mb-2 relative z-10">
          {title && (
            <h3 className="text-[9px] lg:text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-1 h-3 premium-gradient rounded-full" />
              {title}
            </h3>
          )}
          {subtitle && <p className="text-[18px] font-black text-zinc-950 tracking-tight">{subtitle}</p>}
        </div>
      )}
      
      <div className="flex-1 relative z-10">
        {children}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-zinc-100/40 z-0" />
    </motion.div>
  );
};
