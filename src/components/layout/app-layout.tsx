"use client";

import React from 'react';
import { LayoutDashboard, BarChart3, Users, Settings, Search, Bell, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-orange-100 selection:text-orange-900 relative">
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      {/* Top Header - Solid Premium Style */}
      <header className="h-24 bg-white border-b border-zinc-200/80 flex items-center justify-between px-12 sticky top-0 z-50 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl premium-gradient flex items-center justify-center text-white font-black text-2xl shadow-[0_4px_12px_rgba(234,88,12,0.3)] relative group overflow-hidden border border-orange-400/20">
              <span className="relative z-10 drop-shadow-md">F</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent group-hover:opacity-50 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <div className="font-black text-xl tracking-tighter leading-none text-zinc-900">FOCCO</div>
              <div className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em] mt-0.5">Analytics</div>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-2">
            <NavItem icon={LayoutDashboard} label="Dashboard" active />
            <NavItem icon={BarChart3} label="Relatórios" />
            <NavItem icon={Users} label="Amostras" />
            <NavItem icon={Settings} label="Config" />
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden xl:flex items-center bg-zinc-100 rounded-2xl px-5 py-2.5 gap-3 text-zinc-400 border border-zinc-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-500/10 transition-all shadow-inner">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar..." 
              className="bg-transparent border-none outline-none text-sm font-bold text-zinc-900 placeholder:text-zinc-400 w-40"
            />
          </div>
          <button className="p-3 rounded-2xl bg-white border border-zinc-200 text-zinc-400 hover:text-orange-600 hover:border-orange-200 transition-all active:scale-95 shadow-sm">
            <Bell size={20} />
          </button>
          <div className="w-11 h-11 rounded-2xl border-2 border-white shadow-md overflow-hidden ring-1 ring-zinc-200 cursor-pointer hover:scale-105 transition-transform">
            <img src="https://picsum.photos/seed/user/100/100" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <button className="lg:hidden p-3 rounded-2xl bg-zinc-900 text-white shadow-lg">
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1700px] mx-auto p-12 lg:p-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-[11px] font-black text-orange-600 uppercase tracking-[0.3em]">
              <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-600 shadow-[0_0_8px_rgba(234,88,12,0.4)]" />
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                <span className="w-1.5 h-1.5 rounded-full bg-orange-200" />
              </div>
              Live Intelligence MA-2024
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-zinc-950 leading-tight">Resultados Consolidados</h1>
            <p className="text-zinc-500 font-medium text-lg max-w-2xl">Estratificação avançada e análise preditiva de comportamento eleitoral em alta fidelidade.</p>
          </div>
          
          <div className="flex items-center gap-5">
            <div className="px-8 py-5 rounded-3xl bg-white border border-zinc-200 shadow-sm flex flex-col items-center min-w-[140px] relative overflow-hidden group">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 relative z-10">Amostra</span>
              <span className="text-3xl font-mono font-bold text-zinc-900 relative z-10">1.817</span>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-50" />
            </div>
            <div className="px-8 py-5 rounded-3xl premium-gradient text-white shadow-[0_10px_25px_rgba(234,88,12,0.25)] flex flex-col items-center min-w-[140px] border border-orange-400/20 group hover:scale-105 transition-transform">
              <span className="text-[10px] font-black text-orange-100 uppercase tracking-widest mb-1 drop-shadow-sm">Confiança</span>
              <span className="text-3xl font-mono font-bold drop-shadow-md">95.0%</span>
            </div>
          </div>
        </motion.div>
        
        {children}

        <footer className="mt-24 pt-12 border-t border-zinc-200 flex flex-col md:flex-row items-center justify-between gap-6 pb-12">
          <div className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">
            © 2024 FOCCO ANALYTICS • PRO EDITION V3.5
          </div>
          <div className="flex gap-8 text-[11px] font-black text-zinc-400 uppercase tracking-widest">
            <a href="#" className="hover:text-orange-600 transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-orange-600 transition-colors">Privacidade</a>
            <a href="#" className="hover:text-orange-600 transition-colors">Suporte Técnico</a>
          </div>
        </footer>
      </main>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active }: { icon: any, label: string, active?: boolean }) => (
  <button className={cn(
    "flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all relative group",
    active 
      ? "text-orange-600 bg-orange-50/50 border border-orange-100/50 shadow-sm" 
      : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
  )}>
    <Icon size={16} strokeWidth={2.5} className={cn(active ? "text-orange-600" : "text-zinc-400")} />
    {label}
    {active && (
      <motion.div 
        layoutId="nav-active"
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-600"
      />
    )}
  </button>
);
