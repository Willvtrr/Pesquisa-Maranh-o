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
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-orange-100 selection:text-orange-900">
      {/* Top Header - Apple Glass Style */}
      <header className="h-24 bg-white/70 backdrop-blur-2xl border-b border-zinc-200/50 flex items-center justify-between px-12 sticky top-0 z-50">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[1.25rem] bg-orange-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-orange-600/20 relative group overflow-hidden">
              <span className="relative z-10">F</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500 to-orange-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col">
              <div className="font-black text-xl tracking-tighter leading-none">FOCCO</div>
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
          <div className="hidden xl:flex items-center bg-zinc-100/50 rounded-2xl px-5 py-2.5 gap-3 text-zinc-400 border border-zinc-200/50 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar..." 
              className="bg-transparent border-none outline-none text-sm font-bold text-zinc-900 placeholder:text-zinc-400 w-40"
            />
          </div>
          <button className="p-3 rounded-2xl bg-white border border-zinc-200 text-zinc-400 hover:text-orange-600 hover:border-orange-200 transition-all active:scale-95">
            <Bell size={20} />
          </button>
          <div className="w-12 h-12 rounded-[1.25rem] border-2 border-white shadow-lg overflow-hidden ring-1 ring-zinc-200/50 cursor-pointer hover:scale-105 transition-transform">
            <img src="https://picsum.photos/seed/user/100/100" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <button className="lg:hidden p-3 rounded-2xl bg-zinc-900 text-white">
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1700px] mx-auto p-12 lg:p-16">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-[11px] font-black text-orange-600 uppercase tracking-[0.3em]">
              <div className="flex gap-1">
                <span className="w-1 h-1 rounded-full bg-orange-600" />
                <span className="w-1 h-1 rounded-full bg-orange-400" />
                <span className="w-1 h-1 rounded-full bg-orange-200" />
              </div>
              Live Intelligence MA-2024
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-zinc-950">Resultados Consolidados</h1>
            <p className="text-zinc-400 font-medium text-lg">Estratificação avançada e análise preditiva de comportamento eleitoral.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="px-7 py-4 rounded-[1.5rem] bg-white border border-zinc-100 shadow-sm flex flex-col items-center min-w-[120px]">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Amostra</span>
              <span className="text-2xl font-mono font-bold text-zinc-900">1.817</span>
            </div>
            <div className="px-7 py-4 rounded-[1.5rem] bg-orange-600 text-white shadow-xl shadow-orange-600/20 flex flex-col items-center min-w-[120px] ring-1 ring-orange-400/30">
              <span className="text-[10px] font-black text-orange-200 uppercase tracking-widest mb-1">Confiança</span>
              <span className="text-2xl font-mono font-bold">95.0%</span>
            </div>
          </div>
        </motion.div>
        
        {children}

        <footer className="mt-24 pt-12 border-t border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-6 pb-12">
          <div className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">
            © 2024 FOCCO ANALYTICS • PRO EDITION V3.4
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
    "flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all",
    active 
      ? "bg-orange-600 text-white shadow-lg shadow-orange-600/10" 
      : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
  )}>
    <Icon size={16} strokeWidth={2.5} />
    {label}
  </button>
);
