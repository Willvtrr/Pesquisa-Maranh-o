
"use client";

import React from 'react';
import { LayoutDashboard, BarChart3, Users, Settings, Search, Bell, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { BottomNav } from './bottom-nav';
import { useSurvey } from '@/hooks/use-survey';

interface AppLayoutProps {
  children: React.ReactNode;
}

const MaranhaoFlag = () => (
  <svg width="32" height="22" viewBox="0 0 27 18" className="rounded-sm shadow-md ring-1 ring-zinc-200/50 md:w-[54px] md:h-[36px]">
    <rect width="27" height="2" y="0" fill="#E20613" />
    <rect width="27" height="2" y="2" fill="#FFFFFF" />
    <rect width="27" height="2" y="4" fill="#000000" />
    <rect width="27" height="2" y="6" fill="#E20613" />
    <rect width="27" height="2" y="8" fill="#FFFFFF" />
    <rect width="27" height="2" y="10" fill="#000000" />
    <rect width="27" height="2" y="12" fill="#E20613" />
    <rect width="27" height="2" y="14" fill="#FFFFFF" />
    <rect width="27" height="2" y="16" fill="#000000" />
    <rect width="11" height="8" fill="#004185" />
    <path d="M5.5 1.5l.7 2h2.1l-1.7 1.2.7 2.1-1.8-1.3-1.8 1.3.7-2.1-1.7-1.2h2.1z" fill="#fff" />
  </svg>
);

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { data: rawSurveyData } = useSurvey();
  
  // Filtra o objeto de INFO se ele existir para mostrar a contagem real
  const totalCount = React.useMemo(() => {
    if (!rawSurveyData) return 0;
    return rawSurveyData.filter(item => !item.INFO).length;
  }, [rawSurveyData]);

  return (
    <div className="min-h-screen text-zinc-900 font-sans selection:bg-orange-100 selection:text-orange-900 relative pb-24 lg:pb-0">
      <div className="fixed inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:48px_48px] opacity-[0.4] pointer-events-none z-0" />
      
      <header className="h-16 lg:h-24 bg-white/90 backdrop-blur-xl border-b border-zinc-200/80 flex items-center justify-between px-4 sm:px-6 lg:px-12 sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4 lg:gap-10">
          <div className="relative w-28 lg:w-[140px] h-8 lg:h-14">
            <Image 
              src="/LOGOTIPO 1 - VARIAÇÃO 3.svg"
              alt="Focco Intelligence"
              fill
              priority
              className="object-contain cursor-pointer"
            />
          </div>
          
          <nav className="hidden lg:flex items-center gap-3">
            <NavItem icon={LayoutDashboard} label="Painel" active />
            <NavItem icon={BarChart3} label="Análises" />
            <NavItem icon={Users} label="Demografia" />
            <NavItem icon={Settings} label="Sistema" />
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 lg:gap-8">
          <div className="hidden xl:flex items-center inner-relief rounded-[1.25rem] px-6 py-3 gap-4 text-zinc-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-500/5 transition-all w-64 group">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Busca Profunda..." 
              className="bg-transparent border-none outline-none text-sm font-bold text-zinc-950 placeholder:text-zinc-400 w-full"
            />
          </div>
          <button className="p-2 sm:p-3 rounded-xl bg-white border border-zinc-200 text-zinc-400 hover:text-orange-600 transition-all">
            <Bell size={18} className="sm:size-5" />
          </button>
          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl border-2 border-white shadow-lg overflow-hidden ring-1 ring-zinc-200">
            <img src="https://picsum.photos/seed/user-lxs/100/100" alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto p-4 sm:p-6 md:p-12 lg:p-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-10 lg:mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8"
        >
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2.5 sm:gap-3 text-[9px] sm:text-[10px] lg:text-[12px] font-black text-orange-600 uppercase tracking-[0.3em] sm:tracking-[0.4em]">
              <div className="flex gap-1 sm:gap-1.5 items-center">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="relative w-1 h-1 sm:w-1.5 sm:h-1.5 lg:w-2 lg:h-2">
                    <motion.div
                      animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                      className="absolute inset-0 rounded-full premium-gradient"
                    />
                    <div className="w-full h-full rounded-full bg-zinc-200 opacity-40" />
                  </div>
                ))}
              </div>
              Monitoramento em tempo real • 2026
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-8 flex-wrap">
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-zinc-950 leading-[1.1] sm:leading-tight">
                Mapeamento de votos no Maranhão
              </h1>
              <MaranhaoFlag />
            </div>
            
            <p className="text-zinc-500 font-medium text-sm sm:text-base lg:text-xl max-w-2xl leading-relaxed">
              Estratificação de alta precisão e processamento geospacial em tempo real para inteligência de campanha
            </p>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 overflow-x-auto pb-1 sm:pb-2 lg:pb-0 scrollbar-hide">
            <div className="px-5 py-3.5 sm:px-8 sm:py-5 lg:px-10 lg:py-6 rounded-2xl lg:rounded-[2rem] bg-white border border-zinc-200 shadow-lg flex flex-col items-center min-w-[110px] sm:min-w-[140px]">
              <span className="text-[8px] sm:text-[9px] lg:text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-1">Amostragem</span>
              <span className="text-xl sm:text-2xl lg:text-4xl font-mono font-bold text-zinc-950">
                {totalCount.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="px-5 py-3.5 sm:px-8 sm:py-5 lg:px-10 lg:py-6 rounded-2xl lg:rounded-[2rem] premium-gradient text-white shadow-xl flex flex-col items-center min-w-[110px] sm:min-w-[140px]">
              <span className="text-[8px] sm:text-[9px] lg:text-[11px] font-black text-orange-100 uppercase tracking-[0.3em] mb-1">Confiança</span>
              <span className="text-xl sm:text-2xl lg:text-4xl font-mono font-bold">95.0%</span>
            </div>
          </div>
        </motion.div>
        
        {children}

        <footer className="mt-12 sm:mt-20 lg:mt-32 pt-8 sm:pt-10 border-t border-zinc-200 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 pb-10">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg inner-relief flex items-center justify-center text-zinc-400">
              <Cpu size={12} className="sm:size-[14px]" />
            </div>
            <div className="text-[8px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] sm:tracking-[0.3em] text-center lg:text-left">
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
