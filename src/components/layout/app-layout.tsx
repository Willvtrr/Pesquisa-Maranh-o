
"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { LayoutDashboard, BarChart3, Users, Settings, Search, Cpu, MapPin, User2, X, FileJson, Navigation, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BottomNav } from './bottom-nav';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { TOP_61_CITIES } from '@/lib/constants';

interface AppLayoutProps {
  children: React.ReactNode;
}

type SearchResult = {
  type: 'city' | 'candidate' | 'page';
  name: string;
  path?: string;
  category?: string;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 600);
    return () => clearTimeout(timer);
  }, [pathname]);

  const searchResults = useMemo(() => {
    if (searchValue.length < 2) return [];
    
    const term = searchValue.toLowerCase();
    
    const cities: SearchResult[] = TOP_61_CITIES
      .filter(city => city.toLowerCase().includes(term))
      .map(city => ({ type: 'city', name: city, category: 'Município' }));
    
    const candidatesList = [
      'LULA', 'CARLOS BRANDÃO', 'JAIR BOLSONARO', 'FELIPE CAMARÃO', 
      'WEVERTON ROCHA', 'ROSEANA SARNEY', 'FLÁVIO DINO', 'EDUARDO BRAIDE'
    ];
    const candidates: SearchResult[] = candidatesList
      .filter(c => c.toLowerCase().includes(term))
      .map(c => ({ type: 'candidate', name: c, category: 'Liderança' }));

    const pagesList: SearchResult[] = [
      { type: 'page', name: 'PAINEL PRINCIPAL', path: '/', category: 'Módulo' },
      { type: 'page', name: 'HUB DE ANÁLISES', path: '/analyses', category: 'Inteligência' },
      { type: 'page', name: 'CORRIDA PRESIDENCIAL', path: '/analyses/presidential', category: 'Análise' },
      { type: 'page', name: 'CORRIDA GOVERNADOR', path: '/analyses/governor', category: 'Análise' },
      { type: 'page', name: 'IMPORTAR DADOS', path: '/admin/import', category: 'Admin' },
    ];
    const pages = pagesList.filter(p => p.name.toLowerCase().includes(term));

    return [...pages, ...cities, ...candidates].slice(0, 10);
  }, [searchValue]);

  const handleSelect = (result: SearchResult) => {
    setSearchValue("");
    setShowResults(false);
    
    if (result.path) {
      router.push(result.path);
      return;
    }

    const params = new URLSearchParams();
    if (result.type === 'city') {
      params.set('city', result.name);
      router.push(`/?${params.toString()}`);
    } else if (result.type === 'candidate') {
      params.set('candidate', result.name);
      router.push(`/?${params.toString()}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen text-zinc-900 font-sans selection:bg-orange-100 selection:text-orange-900 relative pb-24 lg:pb-0 overflow-x-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:48px_48px] opacity-[0.4] pointer-events-none z-0" />
      
      <AnimatePresence>
        {isNavigating && (
          <motion.div 
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-400 via-orange-600 to-orange-400 origin-left z-[100] shadow-[0_0_10px_rgba(234,88,12,0.5)]"
          />
        )}
      </AnimatePresence>

      <header className="h-16 lg:h-[6rem] bg-white/90 backdrop-blur-xl border-b border-zinc-200/80 flex items-center justify-between px-4 sm:px-6 lg:px-12 sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4 lg:gap-10">
          <Link href="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="relative w-[8.75rem] h-[2.5rem] lg:w-[11.25rem] lg:h-[3.25rem]">
              <Image 
                src="/LOGOTIPO 1 - VARIAÇÃO 3.svg" 
                alt="Focco Analytics Logo" 
                fill
                priority
                className="object-contain"
              />
            </div>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/">
              <NavItem icon={LayoutDashboard} label="Painel" active={pathname === '/'} />
            </Link>
            
            <Link href="/analyses">
              <NavItem icon={BarChart3} label="Análises" active={pathname.startsWith('/analyses')} />
            </Link>

            <NavItem icon={Users} label="Demografia" />
            
            <Link href="/admin/import">
              <NavItem icon={Settings} label="Sistema" active={pathname === '/admin/import'} />
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4 flex-1 justify-end max-w-xl ml-auto relative" ref={searchRef}>
          <div className="flex items-center inner-relief rounded-[1.5rem] px-8 py-4 gap-4 text-zinc-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-500/5 transition-all w-full group border border-zinc-100/50 shadow-inner bg-zinc-50/50">
            <Search size={22} className="text-zinc-300 group-focus-within:text-orange-500 transition-colors" />
            <input 
              type="text" 
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              placeholder="Buscar" 
              className="bg-transparent border-none outline-none text-base font-bold text-zinc-950 placeholder:text-zinc-400 w-full"
            />
            {searchValue && (
              <button onClick={() => setSearchValue("")} className="p-1 hover:bg-zinc-100 rounded-full">
                <X size={16} className="text-zinc-400" />
              </button>
            )}
          </div>

          <AnimatePresence>
            {showResults && searchResults.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[2rem] shadow-2xl border border-zinc-100 p-4 z-[100] max-h-[500px] overflow-y-auto no-scrollbar"
              >
                <div className="space-y-1">
                  {searchResults.map((result, idx) => (
                    <button
                      key={`${result.type}-${result.name}-${idx}`}
                      onClick={() => handleSelect(result)}
                      className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 transition-colors group text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "p-2.5 rounded-xl transition-colors",
                          result.type === 'city' ? "bg-orange-50 text-orange-600" : 
                          result.type === 'candidate' ? "bg-emerald-50 text-emerald-600" :
                          "bg-zinc-100 text-zinc-600"
                        )}>
                          {result.type === 'city' ? <MapPin size={18} /> : 
                           result.type === 'candidate' ? <User2 size={18} /> : 
                           result.category === 'Admin' ? <FileJson size={18} /> : <Navigation size={18} />}
                        </div>
                        <div>
                          <p className="text-xs font-black text-zinc-950 uppercase tracking-tight">{result.name}</p>
                          <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">
                            {result.category} • Maranhão
                          </p>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Search size={14} className="text-orange-500" />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <main className="max-w-[118.75rem] mx-auto p-4 sm:p-6 md:p-10 lg:p-12 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 15, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
            transition={{ 
              duration: 0.45, 
              ease: [0.23, 1, 0.32, 1] 
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>

        <footer className="mt-12 sm:mt-20 lg:mt-32 pt-8 sm:pt-10 border-t border-zinc-200 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 pb-10">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-7 h-7 sm:size-8 rounded-lg inner-relief flex items-center justify-center text-zinc-400">
              <Image src="/ICON - VARIAÇÃO 3.svg" alt="Focco Icon" width={14} height={14} className="opacity-40 grayscale" />
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
  <div className="relative px-5 py-2.5 group cursor-pointer">
    <div className="relative z-10 flex items-center gap-3">
      <Icon size={16} className={cn("transition-colors duration-300", active ? "text-orange-600" : "text-zinc-400 group-hover:text-zinc-950")} />
      <span className={cn("text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300", active ? "text-orange-600" : "text-zinc-400 group-hover:text-zinc-950")}>
        {label}
      </span>
    </div>
    {active && (
      <motion.div 
        layoutId="nav-active-pill"
        className="absolute inset-0 bg-orange-50/60 border border-orange-100 shadow-sm rounded-xl"
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      />
    )}
  </div>
);
