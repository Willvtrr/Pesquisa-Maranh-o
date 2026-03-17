
"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface NeomorphicCardProps {
  children: React.ReactNode;
  className?: string;
  inset?: boolean;
  hoverable?: boolean;
}

export const NeomorphicCard = ({ 
  children, 
  className, 
  inset = false,
  hoverable = false 
}: NeomorphicCardProps) => {
  return (
    <motion.div
      whileHover={hoverable ? { scale: 1.01, translateY: -2 } : {}}
      className={cn(
        "bg-background rounded-3xl p-6 transition-all duration-300",
        inset ? "neo-in" : "neo-out",
        className
      )}
    >
      {children}
    </motion.div>
  );
};
