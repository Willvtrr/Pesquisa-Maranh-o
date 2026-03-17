
"use client";

import React from 'react';
import { LayoutDashboard, Map as MapIcon, Users, Filter, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const BottomNav = () => {
  const items = [
    { icon: LayoutDashboard, label: 'Home', active: true },
    { icon: MapIcon, label: 'Mapa' },
    { icon: Users, label: 'Social' },
    { icon: Filter, label: 'Filtro' },
    { icon: BarChart3, label: 'Dados' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-6 left-6 right-6 h-16 glass rounded-full flex items-center justify-around px-4 z-50 shadow-2xl">
      {items.map((item, idx) => (
        <button
          key={idx}
          className={cn(
            "flex flex-col items-center justify-center gap-1 transition-all duration-300",
            item.active ? "text-accent scale-110" : "text-muted-foreground"
          )}
        >
          <div className={cn(
            "p-2 rounded-full transition-all",
            item.active && "neo-in bg-white/50"
          )}>
            <item.icon size={20} strokeWidth={item.active ? 2.5 : 2} />
          </div>
          {item.active && (
            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
          )}
        </button>
      ))}
    </nav>
  );
};
