
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// Ícones Inline para evitar erro de runtime do Turbopack e garantir estabilidade absoluta
const IconLock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconEye = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEyeOff = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const IconLoader = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const IconChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('Estabelecendo conexão segura...');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

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

    // Pequena latência para feedback tátil do botão
    await new Promise(resolve => setTimeout(resolve, 800));

    if (password === CORRECT_KEY) {
      setIsSyncing(true);
      
      // Sequência de mensagens de sincronização profissional com tempo extendido
      setTimeout(() => setSyncMessage('Sincronizando registros geoespaciais...'), 1800);
      setTimeout(() => setSyncMessage('Auditoria de integridade em tempo real...'), 3600);
      setTimeout(() => setSyncMessage('Finalizando carregamento da base...'), 5400);
      
      // Tempo total da animação de "boot" do sistema (7 segundos)
      await new Promise(resolve => setTimeout(resolve, 7000));
      
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
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center relative overflow-hidden font-sans w-full">
      
      {/* Mesh Gradients Dinâmicos para fundo premium */}
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
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>

      <AnimatePresence mode="wait">
        {!isSyncing ? (
          <motion.div 
            key="login-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full z-10 flex flex-col items-center text-center px-4"
          >
            {/* Branding Original */}
            <div className="mb-12">
              <div className="relative w-56 h-20 md:w-72 md:h-24 transition-all duration-500">
                <Image 
                  src="/LOGOTIPO 1 - VARIAÇÃO 3.svg" 
                  alt="Focco Instituto de Pesquisa" 
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="mb-10 relative group"
            >
              <div className="absolute inset-0 bg-black/5 blur-2xl rounded-lg scale-90 group-hover:scale-100 transition-transform duration-500" />
              <div className="relative border-[6px] border-white shadow-2xl rounded-2xl overflow-hidden w-28 h-20 md:w-36 md:h-24 bg-zinc-100 flex items-center justify-center p-1">
                <MaranhaoFlag />
              </div>
            </motion.div>

            <span className="text-[10px] md:text-[11px] font-black text-zinc-400 uppercase tracking-[0.5em] mb-6">
              Sistema de Monitoramento Eleitoral de Precisão
            </span>

            {/* Headline Monumental */}
            <div className="mb-16 space-y-3">
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] text-orange-600 uppercase">
                MAPEAMENTO DE VOTOS
              </h1>
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-zinc-950 uppercase opacity-90">
                MARANHÃO
              </h2>
            </div>

            <p className="text-sm md:text-base text-zinc-500 font-medium leading-relaxed max-w-md mb-12">
              Acesse a inteligência estratégica e dados auditados em tempo real para decisões de alto impacto.
            </p>

            <form onSubmit={handleAccess} className="w-full max-w-[420px] space-y-4">
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-orange-500 transition-colors">
                  <IconLock />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Insira sua Chave de Acesso"
                  className="w-full h-14 bg-white border border-zinc-100 rounded-3xl pl-14 pr-14 text-lg font-bold text-zinc-950 placeholder:text-zinc-300 shadow-sm focus:outline-none focus:ring-8 focus:ring-orange-500/5 focus:border-orange-500 transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-500 transition-colors"
                >
                  {showPassword ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm font-black text-rose-500 uppercase tracking-widest"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <button 
                type="submit"
                disabled={isLoading || !password}
                className="w-full h-14 bg-zinc-950 text-white rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4 hover:bg-zinc-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-zinc-950/20 group overflow-hidden relative"
              >
                {isLoading ? (
                  <IconLoader />
                ) : (
                  <span className="flex items-center gap-3">
                    ACESSAR DADOS 
                    <IconChevronRight />
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </form>

            <div className="mt-8 flex items-center gap-8 justify-center">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.2em]">Protocolo LXN-2026</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-emerald-500/10 p-1.5 rounded-full">
                  <IconCheck />
                </div>
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">Criptografia Ativa</span>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ANIMAÇÃO DE SINCRONIZAÇÃO PROFISSIONAL E MINIMALISTA */
          <motion.div 
            key="syncing-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/95 backdrop-blur-3xl w-full"
          >
            <div className="relative flex items-center justify-center">
              {/* Anéis de Difusão/Scanner (Expandindo do centro) */}
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    delay: i * 0.8,
                    ease: "easeOut" 
                  }}
                  className="absolute rounded-full border border-orange-200/60 w-32 h-32 md:w-48 md:h-48"
                />
              ))}
              
              {/* Ícone com Animação de "Respiração" (Não rotaciona) */}
              <motion.div
                animate={{ 
                  scale: [1, 1.08, 1],
                  filter: [
                    'drop-shadow(0 0 0px rgba(234, 88, 12, 0))',
                    'drop-shadow(0 0 25px rgba(234, 88, 12, 0.4))',
                    'drop-shadow(0 0 0px rgba(234, 88, 12, 0))'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 w-36 h-36 md:w-56 md:h-56 p-4"
              >
                <Image 
                  src="/ICON - VARIAÇÃO 3.svg" 
                  alt="Focco Sync" 
                  fill
                  className="object-contain"
                />
              </motion.div>
            </div>

            <div className="mt-16 text-center space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-4"
              >
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.6, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                      className="w-2 h-2 rounded-full bg-orange-600 shadow-lg shadow-orange-600/20"
                    />
                  ))}
                </div>
                <h2 className="text-[11px] md:text-xs font-black uppercase tracking-[0.6em] text-zinc-950 ml-2">
                  Protocolo Focco
                </h2>
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.p
                  key={syncMessage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="text-base md:text-lg font-bold text-zinc-400 tracking-tight"
                >
                  {syncMessage}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Barra de Progresso Shimmer Minimalista com duração de 7s */}
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "280px" }}
              transition={{ duration: 7.0, ease: "easeInOut" }}
              className="absolute bottom-24 h-0.5 bg-zinc-100 overflow-hidden rounded-full"
            >
              <motion.div 
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-full h-full bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-60"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-24 opacity-20 z-10">
        <p className="text-[9px] font-black uppercase tracking-[0.6em] text-zinc-400">
          Focco Analytics • Inteligência Geoespacial
        </p>
      </div>
    </div>
  );
};

const MaranhaoFlag = () => (
  <svg viewBox="0 0 27 18" className="w-full h-full shadow-inner rounded-sm">
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
