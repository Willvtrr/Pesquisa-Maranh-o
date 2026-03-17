
"use client";

import React, { useState } from 'react';
import { LayoutDashboard, Map as MapIcon, Users, Filter, Settings, ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export const SidebarNav = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: MapIcon, label: 'Explorar Mapa' },
    { icon: Users, label: 'Demografia' },
    { icon: Filter, label: 'Filtros Avançados' },
    { icon: BarChart3, label: 'Relatórios' },
    { icon: Settings, label: 'Configurações' },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      className="hidden lg:flex flex-col h-screen fixed left-0 top-0 glass z-50 transition-all duration-300 border-r border-white/20"
    >
      <div className="p-6 flex items-center justify-between">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white shadow-lg">
                <BarChart3 size={20} />
              </div>
              <span className="font-bold text-lg font-headline text-primary whitespace-nowrap">MA Insights</span>
            </motion.div>
          )}
        </AnimatePresence>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-xl neo-in hover:bg-white/40 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 px-4 mt-4 space-y-2">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            className={cn(
              "w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 group",
              item.active 
                ? "bg-accent text-white shadow-lg" 
                : "text-muted-foreground hover:bg-white/20"
            )}
          >
            <item.icon size={22} className={cn(!item.active && "group-hover:scale-110 transition-transform")} />
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4">
        <div className={cn(
          "rounded-3xl p-4 neo-in transition-all",
          isCollapsed ? "opacity-0" : "opacity-100"
        )}>
          <p className="text-[10px] text-muted-foreground uppercase font-bold text-center">v1.0.4 PRO</p>
        </div>
      </div>
    </motion.aside>
  );
};
