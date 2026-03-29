
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// Ícones Inline para evitar bug de HMR do Turbopack com lucide-react
const IconLock = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconEye = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEyeOff = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const IconLoader = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("animate-spin", className)}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const IconCheck = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const IconChevronRight = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

interface AuthGateProps {
  children: React.ReactNode;
}

export const AuthGate = ({ children }: AuthGateProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Chave de acesso única
  const CORRECT_KEY = "maranhao2026";

  useEffect(() => {
    setIsMounted(true);
    const authStatus = sessionStorage.getItem('focco_auth_status');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulação de verificação de protocolo de segurança
    await new Promise(resolve => setTimeout(resolve, 900));

    if (password === CORRECT_KEY) {
      sessionStorage.setItem('focco_auth_status', 'true');
      setIsAuthenticated(true);
    } else {
      setError('Chave de acesso inválida');
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Mesh Gradients Dinâmicos - Fundo Sofisticado */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-orange-100/40 blur-[120px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-amber-50/50 blur-[100px] rounded-full" 
        />
        {/* Grade de Precisão sutil */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[520px] z-10 flex flex-col items-center text-center"
      >
        {/* Logo Monumental - Cor Tradicional */}
        <div className="mb-10">
          <div className="relative w-48 h-16 md:w-64 md:h-20 transition-all duration-500">
            <Image 
              src="/LOGOTIPO 1 - VARIAÇÃO 3.svg" 
              alt="Focco Instituto de Pesquisa" 
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>

        {/* Bandeira do Maranhão Premium */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="mb-8 relative group"
        >
          <div className="absolute inset-0 bg-black/10 blur-xl rounded-lg scale-90 group-hover:scale-100 transition-transform duration-500" />
          <div className="relative border-[6px] border-white shadow-2xl rounded-lg overflow-hidden w-24 h-16 md:w-32 md:h-20">
            <MaranhaoFlag />
          </div>
        </motion.div>

        {/* Tagline */}
        <span className="text-[10px] md:text-[11px] font-black text-zinc-400 uppercase tracking-[0.4em] mb-4">
          Seu App de Monitoramento Eleitoral de Precisão
        </span>

        {/* Título Principal */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] text-zinc-950 mb-12 uppercase">
          <span className="text-orange-600 block">Mapeamento de Votos</span>
        </h1>

        {/* Copy Comercial */}
        <p className="text-sm md:text-base text-zinc-500 font-medium leading-relaxed max-w-md mb-12">
          Mapeamento de votos com precisão cirúrgica no Maranhão. Domine o cenário político com dados em tempo real e inteligência direta para sua tomada de decisão.
        </p>

        {/* Formulário de Acesso */}
        <form onSubmit={handleAccess} className="w-full space-y-4">
          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-orange-500 transition-colors">
              <IconLock className="w-5 h-5" />
            </div>
            <input 
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Insira sua Chave de Acesso"
              className="w-full h-16 bg-white border border-zinc-100 rounded-2xl pl-14 pr-14 text-base font-bold text-zinc-950 placeholder:text-zinc-300 shadow-sm focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 transition-all"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-500 transition-colors"
            >
              {showPassword ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm font-bold text-rose-500"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button 
            type="submit"
            disabled={isLoading || !password}
            className="w-full h-16 bg-zinc-950 text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-zinc-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-zinc-950/10 group overflow-hidden relative"
          >
            {isLoading ? (
              <IconLoader className="w-6 h-6 text-orange-500" />
            ) : (
              <span className="flex items-center gap-2">
                ACESSAR DADOS 
                <IconChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
        </form>

        {/* Rodapé de Segurança */}
        <div className="mt-8 flex items-center gap-6 justify-center">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">Protocolo LXN-2026</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500/10 p-1 rounded-full">
              <IconCheck className="w-3 h-3 text-emerald-500" />
            </div>
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Criptografia Ativa</span>
          </div>
        </div>

        {/* Final Footer */}
        <div className="mt-20 opacity-30">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">
            Focco Analytics • Sistema de Inteligência
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const MaranhaoFlag = () => (
  <svg viewBox="0 0 27 18" className="w-full h-full shadow-inner">
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
