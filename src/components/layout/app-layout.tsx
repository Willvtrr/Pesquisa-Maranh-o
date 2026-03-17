"use client";

import React from 'react';
import { LayoutDashboard, BarChart3, Users, Settings, Search, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-orange-100 selection:text-orange-900">
      {/* Top Header */}
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-zinc-100 flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-600/20">
              F
            </div>
            <div className="font-bold text-lg tracking-tight">FOCCO <span className="text-zinc-400 font-medium">ANALYTICS</span></div>
          </div>
          
          <nav className="hidden md:flex items-center gap-1">
            <NavItem icon={LayoutDashboard} label="Dashboard" active />
            <NavItem icon={BarChart3} label="Relatórios" />
            <NavItem icon={Users} label="Amostras" />
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-zinc-100 rounded-2xl px-4 py-2 gap-3 text-zinc-400">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Pesquisar métricas..." 
              className="bg-transparent border-none outline-none text-sm font-medium text-zinc-900 placeholder:text-zinc-400 w-48"
            />
          </div>
          <button className="p-2.5 rounded-2xl bg-white border border-zinc-100 text-zinc-400 hover:text-orange-600 transition-colors">
            <Bell size={20} />
          </button>
          <div className="w-10 h-10 rounded-2xl bg-zinc-200 border border-white shadow-sm overflow-hidden">
            <img src="https://picsum.photos/seed/user/100/100" alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto p-8 lg:p-12">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-bold text-orange-600 uppercase tracking-[0.2em]">
              <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
              Live Analytics MA-2024
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900">Resultados Consolidados</h1>
            <p className="text-zinc-400 font-medium">Análise preditiva e estratificação demográfica em tempo real.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="px-5 py-3 rounded-2xl bg-white border border-zinc-100 shadow-sm flex flex-col items-center">
              <span className="text-[10px] font-bold text-zinc-400 uppercase">Amostra (N)</span>
              <span className="text-lg font-mono font-bold text-zinc-900">1.817</span>
            </div>
            <div className="px-5 py-3 rounded-2xl bg-orange-600 text-white shadow-lg shadow-orange-600/20 flex flex-col items-center">
              <span className="text-[10px] font-bold text-orange-200 uppercase">Confiança</span>
              <span className="text-lg font-mono font-bold">95.0%</span>
            </div>
          </div>
        </div>
        
        {children}
      </main>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active }: { icon: any, label: string, active?: boolean }) => (
  <button className={cn(
    "flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold transition-all",
    active 
      ? "bg-orange-50 text-orange-600" 
      : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
  )}>
    <Icon size={18} />
    {label}
  </button>
);
