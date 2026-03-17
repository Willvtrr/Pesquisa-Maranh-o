
"use client";

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { NeomorphicCard } from '../ui/neomorphic-card';
import { LucideIcon } from 'lucide-react';

interface StatItemProps {
  label: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  color?: string;
}

export const StatItem = ({ label, value, suffix = "", icon: Icon, color = "text-primary" }: StatItemProps) => {
  const springValue = useSpring(0, { stiffness: 40, damping: 20 });
  const displayValue = useTransform(springValue, (latest) => 
    Math.round(latest).toLocaleString('pt-BR')
  );

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  return (
    <NeomorphicCard className="flex flex-col items-center justify-center gap-3">
      <div className={`p-3 rounded-2xl neo-in ${color}`}>
        <Icon size={24} />
      </div>
      <div className="text-center">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <div className="flex items-baseline justify-center gap-0.5">
          <motion.span className="text-2xl font-bold font-headline">
            {displayValue}
          </motion.span>
          <span className="text-sm font-semibold text-muted-foreground">{suffix}</span>
        </div>
      </div>
    </NeomorphicCard>
  );
};
