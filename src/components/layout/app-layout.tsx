
"use client";

import React from 'react';
import { FilterSidebar } from '../dashboard/filter-sidebar';
import { LayoutDashboard, Database, BarChart3, Users, Settings, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface AppLayoutProps {
  children: React.ReactNode;
  filters: any;
  onFilterChange: (key: string, value: string) => void;
  onClear: () => void;
}

export const AppLayout = ({ children, filters, onFilterChange, onClear }: AppLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-50 overflow-hidden">
      {/* Desktop Navigation (Slim) */}
      <aside className="hidden lg:flex flex-col w-16 border-r border-white/5 bg-zinc-950 items-center py-6 gap-8">
        <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xl">
          F
        </div>
        <nav className="flex flex-col gap-4">
          <NavItem icon={LayoutDashboard} active />
          <NavItem icon={BarChart3} />
          <NavItem icon={Database} />
          <NavItem icon={Users} />
        </nav>
        <div className="mt-auto">
          <NavItem icon={Settings} />
        </div>
      </aside>

      {/* Filter Sidebar (Desktop) */}
      <aside className="hidden lg:block w-72 border-r border-white/5 bg-zinc-950/50 overflow-y-auto">
        <FilterSidebar 
          filters={filters} 
          onFilterChange={onFilterChange} 
          onClear={onClear} 
        />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between px-6 z-50">
        <div className="font-bold text-lg tracking-tight">FOCCO <span className="text-zinc-500 font-normal">ANALYTICS</span></div>
        <Sheet>
          <SheetTrigger asChild>
            <button className="p-2 text-zinc-400 hover:text-white transition-colors">
              <Menu size={24} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 bg-zinc-950 border-white/5 p-0">
            <FilterSidebar 
              filters={filters} 
              onFilterChange={onFilterChange} 
              onClear={onClear} 
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-16 lg:pt-0 pb-20 lg:pb-0">
        <div className="max-w-[1600px] mx-auto p-6 lg:p-10">
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest mb-2">Workspace / Analytics</div>
              <h1 className="text-4xl font-bold tracking-tight">Pesquisa Estadual <span className="text-zinc-500 font-light">MA-2024</span></h1>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Data
              </div>
              <div className="px-3 py-1 border border-white/5 rounded bg-zinc-900">N: 1.817</div>
            </div>
          </header>
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-white/5 bg-zinc-950/80 backdrop-blur-md flex items-center justify-around px-6 z-50">
        <NavItem icon={LayoutDashboard} active />
        <NavItem icon={BarChart3} />
        <NavItem icon={Users} />
        <NavItem icon={Settings} />
      </nav>
    </div>
  );
};

const NavItem = ({ icon: Icon, active }: { icon: any, active?: boolean }) => (
  <button className={cn(
    "p-2.5 rounded-xl transition-all",
    active ? "text-white bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.3)]" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
  )}>
    <Icon size={20} />
  </button>
);
