"use client";

import React from 'react';
import { LayoutDashboard, BarChart3, Users, Settings, Search, Bell, Menu, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen text-zinc-900 font-sans selection:bg-orange-100 selection:text-orange-900 relative">
      <div className="fixed inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:48px_48px] opacity-[0.4] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.8),transparent)] pointer-events-none z-0" />

      <header className="h-24 bg-white/90 backdrop-blur-xl border-b border-zinc-200/80 flex items-center justify-between px-12 sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-16">
          <div className="flex items-center gap-5">
            <Image 
              src="/LOGOTIPO 1 - VARIAÇÃO 3.svg"
              alt="Focco Intelligence"
              width={180}
              height={56}
              priority
              className="h-14 w-auto object-contain cursor-pointer hover:scale-105 transition-transform duration-150"
            />
          </div>
          
          <nav className="hidden lg:flex items-center gap-3">
            <NavItem icon={LayoutDashboard} label="Painel" active />
            <NavItem icon={BarChart3} label="Análises" />
            <NavItem icon={Users} label="Demografia" />
            <NavItem icon={Settings} label="Sistema" />
          </nav>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden xl:flex items-center inner-relief rounded-[1.25rem] px-6 py-3 gap-4 text-zinc-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-500/5 transition-all w-64 group">
            <Search size={18} className="group-focus-within:text-orange-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Busca Profunda..." 
              className="bg-transparent border-none outline-none text-sm font-bold text-zinc-950 placeholder:text-zinc-400 w-full"
            />
          </div>
          <button className="p-3.5 rounded-2xl bg-white border border-zinc-200 text-zinc-400 hover:text-orange-600 hover:border-orange-300 transition-all hover:scale-110 shadow-sm active:scale-95">
            <Bell size={22} />
          </button>
          <div className="w-12 h-12 rounded-2xl border-4 border-white shadow-xl overflow-hidden ring-1 ring-zinc-200 cursor-pointer hover:scale-110 transition-transform active:scale-95">
            <img src="https://picsum.photos/seed/user-lxs/100/100" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <button className="lg:hidden p-3.5 rounded-2xl bg-zinc-950 text-white shadow-xl">
            <Menu size={22} />
          </button>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto p-12 lg:p-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-10"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-[12px] font-black text-orange-600 uppercase tracking-[0.4em]">
              <div className="flex gap-2.5 items-center">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="relative w-2 h-2">
                    <motion.div
                      animate={{ 
                        opacity: [0, 1, 0],
                        scale: [0.8, 1.2, 0.8]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        delay: i * 0.4,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 rounded-full premium-gradient shadow-[0_0_10px_rgba(234,88,12,0.5)]"
                    />
                    <div className="w-full h-full rounded-full bg-zinc-200 opacity-40" />
                  </div>
                ))}
              </div>
              Monitoramento em tempo real • 2026
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-zinc-950 leading-tight">Análises Consolidadas</h1>
            <p className="text-zinc-500 font-medium text-xl max-w-3xl leading-relaxed">
              Estratificação de alta precisão e processamento geospacial em tempo real para inteligência estratégica.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="px-10 py-6 rounded-[2rem] bg-white border border-zinc-200 shadow-lg flex flex-col items-center min-w-[160px] hover-lift">
              <span className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-2">Amostragem</span>
              <span className="text-4xl font-mono font-bold text-zinc-950">1.817</span>
            </div>
            <div className="px-10 py-6 rounded-[2rem] premium-gradient text-white shadow-2xl flex flex-col items-center min-w-[160px] border border-orange-400/30 hover-lift group">
              <span className="text-[11px] font-black text-orange-100 uppercase tracking-[0.3em] mb-2 drop-shadow-sm">Confiança</span>
              <span className="text-4xl font-mono font-bold drop-shadow-xl">95.0%</span>
            </div>
          </div>
        </motion.div>
        
        {children}

        <footer className="mt-32 pt-16 border-t border-zinc-200 flex flex-col md:flex-row items-center justify-between gap-8 pb-16">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl inner-relief flex items-center justify-center text-zinc-400">
              <Cpu size={18} />
            </div>
            <div className="text-[12px] font-black text-zinc-400 uppercase tracking-[0.3em]">
              © 2026 FOCCO ANALYTICS • EDIÇÃO PRO V3.5-LXS
            </div>
          </div>
          <div className="flex gap-10 text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em]">
            <a href="#" className="hover:text-orange-600 transition-colors border-b border-transparent hover:border-orange-600/30 pb-1">Protocolos</a>
            <a href="#" className="hover:text-orange-600 transition-colors border-b border-transparent hover:border-orange-600/30 pb-1">Criptografia</a>
            <a href="#" className="hover:text-orange-600 transition-colors border-b border-transparent hover:border-orange-600/30 pb-1">Suporte Avançado</a>
          </div>
        </footer>
      </main>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active }: { icon: any, label: string, active?: boolean }) => (
  <button className={cn(
    "flex items-center gap-3.5 px-7 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all relative group",
    active 
      ? "text-orange-600 bg-orange-50/60 border border-orange-100/50 shadow-sm" 
      : "text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100"
  )}>
    <Icon size={18} strokeWidth={active ? 3 : 2.5} className={cn(active ? "text-orange-600" : "text-zinc-400 group-hover:text-zinc-950")} />
    {label}
  </button>
);