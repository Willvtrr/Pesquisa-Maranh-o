
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface FoccoLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const FoccoLoader = ({ size = 'md', className, label }: FoccoLoaderProps) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div className={cn("relative", sizes[size])}>
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full"
        />
        <motion.div
          animate={{ 
            rotate: 360 
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="relative z-10 w-full h-full"
        >
          <Image 
            src="/ICON - VARIAÇÃO 3.svg" 
            alt="Focco Loader" 
            fill
            className="object-contain"
          />
        </motion.div>
      </div>
      {label && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400"
        >
          {label}
        </motion.p>
      )}
    </div>
  );
};
