
"use client";

import React from 'react';
import { LayoutDashboard, BarChart3, Users, Settings, Search, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { BottomNav } from './bottom-nav';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen text-zinc-900 font-sans selection:bg-orange-100 selection:text-orange-900 relative pb-24 lg:pb-0">
      {/* Background Grid Sutil */}
      <div className="fixed inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:48px_48px] opacity-[0.4] pointer-events-none z-0" />
      
      <header className="h-16 lg:h-24 bg-white/90 backdrop-blur-xl border-b border-zinc-200/80 flex items-center justify-between px-4 sm:px-6 lg:px-12 sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4 lg:gap-10">
          <div className="relative w-28 lg:w-[140px] h-8 lg:h-14">
            <Image 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Bandeira_do_Maranh%C3%A3o.svg/1200px-Bandeira_do_Maranh%C3%A3o.svg.png"
              alt="Focco Intelligence"
              fill
              priority
              className="object-contain cursor-pointer grayscale brightness-50 contrast-125"
            />
          </div>
          
          <nav className="hidden lg:flex items-center gap-3">
            <NavItem icon={LayoutDashboard} label="Painel" active />
            <NavItem icon={BarChart3} label="Análises" />
            <NavItem icon={Users} label="Demografia" />
            <NavItem icon={Settings} label="Sistema" />
          </nav>
        </div>

        {/* Busca Ampliada e Centralizada */}
        <div className="flex items-center gap-4 flex-1 justify-end max-w-xl ml-auto">
          <div className="flex items-center inner-relief rounded-[1.5rem] px-8 py-4 gap-4 text-zinc-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-500/5 transition-all w-full group border border-zinc-100/50 shadow-inner bg-zinc-50/50">
            <Search size={22} className="text-zinc-300 group-focus-within:text-orange-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Busca" 
              className="bg-transparent border-none outline-none text-base font-bold text-zinc-950 placeholder:text-zinc-400 w-full"
            />
          </div>
        </div>
      </header>

      <main className="max-w-[1900px] mx-auto p-4 sm:p-6 md:p-10 lg:p-12 relative z-10">
        {children}

        <footer className="mt-12 sm:mt-20 lg:mt-32 pt-8 sm:pt-10 border-t border-zinc-200 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 pb-10">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg inner-relief flex items-center justify-center text-zinc-400">
              <Cpu size={12} className="sm:size-[14px]" />
            </div>
            <div className="text-[8px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center lg:text-left">
              © 2026 FOCCO ANALYTICS • V3.5-LXS
            </div>
          </div>
          <div className="hidden lg:flex gap-10 text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em]">
            <a href="#" className="hover:text-orange-600 transition-colors">Protocolos</a>
            <a href="#" className="hover:text-orange-600 transition-colors">Criptografia</a>
            <a href="#" className="hover:text-orange-600 transition-colors">Suporte</a>
          </div>
        </footer>
      </main>

      <BottomNav />
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active }: { icon: any, label: string, active?: boolean }) => (
  <button className={cn(
    "flex items-center gap-3 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all",
    active ? "text-orange-600 bg-orange-50/60 border border-orange-100" : "text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100"
  )}>
    <Icon size={16} />
    {label}
  </button>
);
