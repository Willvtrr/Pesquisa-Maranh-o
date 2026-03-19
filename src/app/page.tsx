
"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { MesoRegion } from '@/data/survey-data';
import { StatCard } from '@/components/dashboard/stat-card';
import { InteractiveMap } from '@/components/dashboard/interactive-map';
import { FilterBentoBox, FilterChip } from '@/components/dashboard/filter-bento-box';
import { ApprovalChart } from '@/components/dashboard/approval-chart';
import { CandidateChart } from '@/components/dashboard/candidate-chart';
import { Database, RefreshCw, MapPin, Users, FileText, Map as MapIcon, ClipboardCheck, Loader2 } from 'lucide-react';
import { LuxuryCard } from '@/components/dashboard/luxury-card';
import { useSurvey } from '@/hooks/use-survey';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEFAULT_KEYS = {
  CITY: "Cidade:",
  REGION: "Mesorregião",
  GENDER: "Gênero",
  AGE: "Faixa Etária",
  EDUCATION: "Grau de Instrução",
  INCOME: "Renda Familiar",
  RELIGION: "Religião",
  IDEOLOGY: "Você se considera de esquerda, centro ou direita?",
  GOV_APPROVAL: "De modo geral, você aprova ou desaprova o Governo do Governador Carlos Brandão?",
  PRESIDENT_APPROVAL: "De modo geral, você aprova ou desaprova o Governo do Presidente Lula?",
  MAYOR_APPROVAL: "De modo geral, você aprova ou desaprova o Governo do Prefeito?",
  PROBLEMS: "2. Na sua opinião, qual o problema mais grave que o Estado do Maranhão vem enfrentando atualmente? (Espontânea)",
  PRESIDENT_VOTE: "4. PRESIDENTE: Se as eleições para Presidente da República fossem hoje, em quem você votaria? (Estimulada)"
};

const MaranhaoFlag = () => (
  <svg width="24" height="16" viewBox="0 0 27 18" className="rounded-sm shadow-md ring-1 ring-zinc-200/50 md:w-[48px] md:h-[32px]">
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

export default function Home() {
  const { data: rawSurveyData, isLoading } = useSurvey();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncDate, setLastSyncDate] = useState<string>("19/03/2026 - 17:07");
  const [lastSyncMsg, setLastSyncMsg] = useState<string>("SINCRONIZADO HÁ 1 MINUTO");
  const [syncLogs, setSyncLogs] = useState<{id: string, text: string, status: 'success' | 'pending'}[]>([
    { id: '1', text: "ID:4521 Entrevista: #0318-012", status: 'success' },
    { id: '2', text: "ID:4520 Entrevista: #0318-011", status: 'success' },
    { id: '3', text: "ID:4519 Entrevista: #0318-010", status: 'success' },
  ]);
  
  const [filters, setFilters] = useState<Record<string, string[]>>({
    region: ['all'],
    city: ['all'],
    age: ['all'],
    gender: ['all'],
    education: ['all'],
    income: ['all'],
    religion: ['all'],
    ideology: ['all']
  });

  const totalCount = useMemo(() => {
    if (!rawSurveyData) return 0;
    return rawSurveyData.filter(item => !item.INFO).length;
  }, [rawSurveyData]);

  const citiesCount = useMemo(() => {
    if (!rawSurveyData) return 0;
    const cities = new Set(
      rawSurveyData
        .filter(item => !item.INFO)
        .map(item => String(item["Cidade:"] || "").trim())
        .filter(city => city !== "")
    );
    return cities.size;
  }, [rawSurveyData]);

  const activeKeys = useMemo(() => {
    if (!rawSurveyData || rawSurveyData.length === 0) return DEFAULT_KEYS;
    const sample = rawSurveyData.find(d => !d.INFO) || {};
    const keys = Object.keys(sample);

    const findKey = (keywords: string[], fallback: string, exclude: string[] = []) => {
      const found = keys.find(k => 
        keywords.every(kw => k.toLowerCase().includes(kw.toLowerCase())) &&
        !exclude.some(ex => k.toLowerCase().includes(ex.toLowerCase()))
      );
      return found || fallback;
    };

    return {
      CITY: findKey(['cidade'], DEFAULT_KEYS.CITY, ['aprova', 'desaprova', 'governo', 'presidente', 'votar']),
      REGION: findKey(['mesorregião'], DEFAULT_KEYS.REGION),
      GENDER: findKey(['gênero'], DEFAULT_KEYS.GENDER),
      AGE: findKey(['etária'], DEFAULT_KEYS.AGE),
      EDUCATION: findKey(['instrução'], DEFAULT_KEYS.EDUCATION),
      INCOME: findKey(['renda'], DEFAULT_KEYS.INCOME),
      RELIGION: findKey(['religião'], DEFAULT_KEYS.RELIGION),
      IDEOLOGY: findKey(['esquerda', 'direita'], DEFAULT_KEYS.IDEOLOGY),
      GOV_APPROVAL: findKey(['aprova', 'governador'], DEFAULT_KEYS.GOV_APPROVAL),
      PRESIDENT_APPROVAL: findKey(['aprova', 'presidente'], DEFAULT_KEYS.PRESIDENT_APPROVAL),
      MAYOR_APPROVAL: findKey(['aprova', 'prefeito'], DEFAULT_KEYS.MAYOR_APPROVAL),
      PROBLEMS: findKey(['problema', 'grave'], DEFAULT_KEYS.PROBLEMS),
      PRESIDENT_VOTE: findKey(['presidente', 'votaria'], DEFAULT_KEYS.PRESIDENT_VOTE),
    };
  }, [rawSurveyData]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => {
      const currentValues = prev[key] || [];
      if (value === 'all') return { ...prev, [key]: ['all'] };
      let newValues;
      if (currentValues.includes(value)) {
        newValues = currentValues.filter(v => v !== value);
        if (newValues.length === 0) newValues = ['all'];
      } else {
        newValues = [...currentValues.filter(v => v !== 'all'), value];
      }
      return { ...prev, [key]: newValues };
    });
  };

  const clearFilters = () => setFilters({ 
    region: ['all'], city: ['all'], age: ['all'], gender: ['all'], education: ['all'], income: ['all'], religion: ['all'], ideology: ['all']
  });

  const dynamicOptions = useMemo(() => {
    const options: Record<string, string[]> = {
      region: [], city: [], age: [], gender: [], education: [], income: [], religion: [], ideology: []
    };
    if (!rawSurveyData) return options;

    const getUniques = (key: string) => {
      const vals = new Set<string>();
      rawSurveyData.forEach(item => {
        const val = String(item[key] || '').trim();
        if (val && val !== 'all' && val !== 'NS/NR' && !item.INFO) vals.add(val);
      });
      return Array.from(vals).sort();
    };

    options.region = getUniques(activeKeys.REGION);
    options.city = getUniques(activeKeys.CITY);
    options.age = getUniques(activeKeys.AGE);
    options.gender = getUniques(activeKeys.GENDER);
    options.education = getUniques(activeKeys.EDUCATION);
    options.income = getUniques(activeKeys.INCOME);
    options.religion = getUniques(activeKeys.RELIGION);
    options.ideology = getUniques(activeKeys.IDEOLOGY);
    return options;
  }, [rawSurveyData, activeKeys]);

  const distributionStats = useMemo(() => {
    const stats: Record<string, Record<string, number>> = {};
    if (!rawSurveyData || totalCount === 0) return stats;

    const keys = {
      region: activeKeys.REGION,
      gender: activeKeys.GENDER,
      age: activeKeys.AGE,
      income: activeKeys.INCOME,
      ideology: activeKeys.IDEOLOGY,
      education: activeKeys.EDUCATION,
      religion: activeKeys.RELIGION,
    };

    Object.entries(keys).forEach(([filterKey, dataKey]) => {
      const counts: Record<string, number> = {};
      rawSurveyData.forEach(item => {
        if (item.INFO) return;
        const val = String(item[dataKey] || '').trim();
        if (val) counts[val] = (counts[val] || 0) + 1;
      });
      
      stats[filterKey] = {};
      Object.entries(counts).forEach(([val, count]) => {
        stats[filterKey][val] = (count / totalCount) * 100;
      });
    });

    return stats;
  }, [rawSurveyData, activeKeys, totalCount]);

  const filteredData = useMemo(() => {
    if (!rawSurveyData) return [];
    return rawSurveyData.filter(item => {
      if (item.INFO) return false;
      const checkMatch = (filterKey: string, dataKey: string) => {
        const currentFilters = filters[filterKey];
        if (currentFilters.includes('all')) return true;
        const itemVal = String(item[dataKey] || '').trim();
        return currentFilters.includes(itemVal);
      };
      return (
        checkMatch('region', activeKeys.REGION) &&
        checkMatch('city', activeKeys.CITY) &&
        checkMatch('age', activeKeys.AGE) &&
        checkMatch('gender', activeKeys.GENDER) &&
        checkMatch('education', activeKeys.EDUCATION) &&
        checkMatch('income', activeKeys.INCOME) &&
        checkMatch('religion', activeKeys.RELIGION) &&
        checkMatch('ideology', activeKeys.IDEOLOGY)
      );
    });
  }, [filters, rawSurveyData, activeKeys]);

  const approvalStats = useMemo(() => {
    const total = filteredData.length;
    const calculatePct = (key: string) => {
      if (total === 0) return 0;
      const approvalCount = filteredData.filter(d => {
        const val = String(d[key] || '').toLowerCase().trim();
        return val === 'aprova' || val === 'aprovado' || val === 'sim';
      }).length;
      return (approvalCount / total) * 100;
    };
    return { total, govPct: calculatePct(activeKeys.GOV_APPROVAL), presPct: calculatePct(activeKeys.PRESIDENT_APPROVAL), mayorPct: calculatePct(activeKeys.MAYOR_APPROVAL) };
  }, [filteredData, activeKeys]);

  const chartData = useMemo(() => {
    const approvalMap: Record<string, number> = { 'Aprova': 0, 'Desaprova': 0, 'NS/NR': 0 };
    filteredData.forEach(d => {
      const val = String(d[activeKeys.GOV_APPROVAL] || '').toLowerCase().trim();
      if (val === 'aprova' || val === 'aprovado' || val === 'sim') approvalMap['Aprova']++;
      else if (val === 'desaprova' || val === 'desaprovado' || val === 'não' || val === 'nao') approvalMap['Desaprova']++;
      else approvalMap['NS/NR']++;
    });

    const candidateCounts: Record<string, number> = {};
    filteredData.forEach(d => {
      const cand = String(d[activeKeys.PRESIDENT_VOTE] || 'Não Citado').trim();
      if (cand) candidateCounts[cand] = (candidateCounts[cand] || 0) + 1;
    });

    const problemCounts: Record<string, number> = {};
    filteredData.forEach(d => {
      const prob = String(d[activeKeys.PROBLEMS] || '').trim();
      if (prob && prob !== 'NS/NR') problemCounts[prob] = (problemCounts[prob] || 0) + 1;
    });

    return {
      approvalData: Object.entries(approvalMap).map(([name, value]) => ({ name, value })),
      candidateData: Object.entries(candidateCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 7),
      topProblems: Object.entries(problemCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5)
    };
  }, [filteredData, activeKeys]);

  const handleManualSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    const pendingId = Math.random().toString();
    setSyncLogs(prev => [{ id: pendingId, text: "Buscando pacotes...", status: 'pending' }, ...prev]);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSyncLogs(prev => prev.map(log => log.id === pendingId ? { ...log, text: `ID:${4522 + prev.length} Entrevista: #0318-013`, status: 'success' } : log));
    
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setLastSyncDate(`${day}/${month}/${year} - ${hours}:${minutes}`);
    setLastSyncMsg("SINCRONIZADO AGORA");
    setIsSyncing(false);
    toast({ title: "Sincronização Ativa", description: "Os dados foram atualizados em tempo real com o Google Cloud." });
    
    setTimeout(() => {
      setLastSyncMsg("SINCRONIZADO HÁ 1 MINUTO");
    }, 60000);
  };

  const images = {
    lula: PlaceHolderImages.find(i => i.id === 'lula-photo')?.imageUrl,
    brandao: PlaceHolderImages.find(i => i.id === 'brandao-photo')?.imageUrl,
  };

  const selectedCity = filters.city[0];
  const flagUrl = selectedCity === 'all' 
    ? "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Bandeira_do_Maranh%C3%A3o.svg/1200px-Bandeira_do_Maranh%C3%A3o.svg.png" 
    : `https://picsum.photos/seed/flag-${selectedCity.toLowerCase().replace(/\s+/g, '-')}/800/600`;

  const mayorLabel = selectedCity === 'all' ? "APROVAÇÃO PREFEITO" : `Prefeito de ${selectedCity}`;

  if (isLoading && rawSurveyData.length === 0) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sincronizando Banco de Dados...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-12">
        {/* CABEÇALHO INTEGRADO: Título + Grade Operacional Lateral */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
          
          {/* LADO ESQUERDO: Títulos do Dashboard */}
          <div className="xl:col-span-3 space-y-6 lg:pt-4">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5 mb-1">
                <div className="flex gap-1.5 items-center">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="relative w-2 h-2">
                      <motion.div
                        animate={{ 
                          opacity: [0, 1, 0], 
                          scale: [0.8, 1.4, 0.8],
                          backgroundColor: ["#f97316", "#ea580c", "#f97316"] 
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          delay: i * 0.4,
                          ease: "easeInOut" 
                        }}
                        className="absolute inset-0 rounded-full shadow-[0_0_10px_rgba(234,88,12,0.5)]"
                      />
                      <div className="w-full h-full rounded-full bg-zinc-200 opacity-30" />
                    </div>
                  ))}
                </div>
                <div className="text-[11px] font-black text-orange-600 uppercase tracking-[0.4em]">
                  Monitoramento em tempo real • 2026
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-zinc-950 leading-none">
                  Maranhão
                </h1>
                <MaranhaoFlag />
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter text-zinc-950/80 leading-tight">
                Mapeamento de votos
              </h2>
            </div>
            
            <p className="text-zinc-500 font-medium text-sm lg:text-lg max-w-xs leading-relaxed">
              Inteligência analítica e mapeamento geoespacial estratégico.
            </p>
          </div>

          {/* LADO DIREITO: Grade de Cards Otimizada (3 Colunas) */}
          <div className="xl:col-span-9 grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
            
            {/* Card 1: Banco de Dados (Altura Total) */}
            <div className="relative card-dark rounded-[2rem] p-5 flex flex-col group h-[360px] shadow-2xl">
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 text-orange-500 shadow-inner">
                  <Database size={16} />
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800">
                  <div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-[8px] font-bold tracking-widest text-zinc-300 uppercase">Cloud Ativo</span>
                </div>
              </div>
              <div className="mb-4 relative z-10">
                <h3 className="text-[8px] font-black tracking-[0.2em] text-zinc-500 uppercase mb-1">Base de Inteligência</h3>
                <h2 className="text-lg font-black tracking-tight text-zinc-100 mb-0.5">Banco de Dados</h2>
                <p className="text-[9px] font-medium text-zinc-500"><span className="text-zinc-300 font-bold">{totalCount.toLocaleString('pt-BR')}</span> Registros</p>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-3 h-[80px] overflow-y-auto mb-4 relative z-10 log-scroll">
                <AnimatePresence initial={false} mode="popLayout">
                  <ul className="space-y-2 text-[8px] font-mono">
                    {syncLogs.map((log) => (
                      <motion.li key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                        {log.status === 'success' ? <span className="text-orange-500 font-bold">✓</span> : <Loader2 className="w-2 h-2 text-orange-500 animate-spin" />}
                        <span className={cn(log.status === 'pending' ? 'text-orange-400' : 'text-zinc-400')}>{log.text}</span>
                      </motion.li>
                    ))}
                  </ul>
                </AnimatePresence>
              </div>
              <div className="space-y-2 mt-auto">
                <button onClick={handleManualSync} disabled={isSyncing} className={cn("relative w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all duration-200 active:scale-[0.98] overflow-hidden z-10", isSyncing ? "bg-zinc-900 text-zinc-300 border border-zinc-800" : "bg-white hover:bg-zinc-100 text-zinc-900 shadow-lg")}>
                  {isSyncing ? <Loader2 className="animate-spin w-3 h-3 text-orange-500" /> : <RefreshCw className="w-3 h-3" />}
                  <span>{isSyncing ? "Sincronizando..." : "Sincronizar Agora"}</span>
                </button>
                <div className="text-center z-10 space-y-0.5">
                  <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest leading-none">{lastSyncDate}</p>
                  <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none">{lastSyncMsg}</p>
                </div>
              </div>
            </div>

            {/* COLUNA CENTRAL: Empilhamento de Coletas e Municípios */}
            <div className="flex flex-col gap-4 h-[360px]">
              {/* Card 2: Número de Coletas (Compacto) */}
              <div className="card-white rounded-[1.5rem] p-4 flex flex-col justify-center flex-1 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-100 text-zinc-400 shadow-inner">
                      <FileText size={12} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-[8px] font-black tracking-widest text-zinc-500 uppercase">Coletas</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[7px] font-black text-emerald-600 uppercase">EM CAMPO</span>
                  </div>
                </div>
                <h2 className="text-4xl font-black tracking-tighter text-zinc-950 font-mono leading-none">
                  {totalCount.toLocaleString('pt-BR')}
                </h2>
              </div>

              {/* Card 3: Número de Municípios (Compacto) */}
              <div className="card-orange rounded-[1.5rem] p-4 flex flex-col justify-center flex-1 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-[30px] rounded-full pointer-events-none -mr-6 -mt-6"></div>
                <div className="relative z-10 flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 border border-white/30 text-white backdrop-blur-sm shadow-inner">
                      <MapIcon size={12} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-[8px] font-black tracking-widest text-orange-100 uppercase">Municípios</h3>
                  </div>
                  <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-full shadow-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[7px] font-black text-emerald-600 uppercase">EM CAMPO</span>
                  </div>
                </div>
                <div className="relative z-10 flex items-baseline gap-1">
                  <h2 className="text-4xl font-black tracking-tighter text-white leading-none font-mono">{citiesCount}</h2>
                  <span className="text-xs font-bold text-orange-200 tracking-tighter">/217</span>
                </div>
              </div>
            </div>

            {/* Card 4: Status Operacional (Altura Total) */}
            <div className="card-dark rounded-[2rem] p-5 flex flex-col text-white h-[360px] group shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 text-orange-500">
                  <ClipboardCheck size={18} />
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-[8px] font-black tracking-widest text-zinc-100 uppercase">Em Andamento</span>
                </div>
              </div>
              <div className="mb-4">
                <h3 className="text-[8px] font-black tracking-[0.2em] text-zinc-500 uppercase mb-1">Status Operacional</h3>
                <h2 className="text-xl font-black tracking-tight text-white mb-2 leading-none">Painel de Pesquisas</h2>
                <div className="flex gap-1.5 mb-6">
                  <div className="h-1.5 flex-1 rounded-full bg-zinc-800 overflow-hidden relative">
                    <div className="h-full w-[85%] bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.6)]"></div>
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                  <div className="h-1.5 flex-1 rounded-full bg-zinc-800"></div>
                  <div className="h-1.5 flex-1 rounded-full bg-zinc-800"></div>
                </div>
              </div>
              <div className="bg-[#121214] border border-zinc-800/60 rounded-[1.5rem] p-4 flex-1 flex flex-col justify-center gap-4 mt-auto">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500 ring-4 ring-orange-500/20"></div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-black text-white uppercase tracking-widest">Pesquisa 1: Reta Final</p>
                    <p className="text-[7px] font-black text-orange-500 uppercase tracking-widest">Quase Concluída</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 opacity-30">
                  <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Pesquisa 2: Aguardando</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Linha de Segmentação: Full Width */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <FilterBentoBox 
            filters={filters} 
            options={dynamicOptions} 
            distribution={distributionStats}
            onFilterChange={handleFilterChange} 
            onClear={clearFilters} 
            className="lg:col-span-4" 
          />
        </div>

        {/* Grade de Aprovações (3 cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <StatCard label="APROVAÇÃO PRESIDENTE" value={`${approvalStats.presPct.toFixed(1)}%`} imageUrl={images.lula} trend={approvalStats.presPct > 50 ? "up" : "down"} subValue="Governo Federal" className="h-[360px]" />
          <StatCard label="APROVAÇÃO GOVERNADOR" value={`${approvalStats.govPct.toFixed(1)}%`} imageUrl={images.brandao} trend={approvalStats.govPct > 50 ? "up" : "down"} subValue="Gestão Carlos Brandão" className="h-[360px]" />
          <StatCard 
            label={mayorLabel}
            value={`${approvalStats.mayorPct.toFixed(1)}%`} 
            imageUrl={flagUrl}
            trend={approvalStats.mayorPct > 50 ? "up" : "down"} 
            variant="hero"
            className="h-[360px]"
            subValue={
              <div className="relative w-full space-y-3">
                <Select value={filters.city[0]} onValueChange={(val) => handleFilterChange('city', val)}>
                  <SelectTrigger className="h-10 bg-zinc-50/80 border-zinc-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-950 focus:ring-orange-500/20 shadow-sm">
                    <div className="flex items-center gap-2 truncate">
                      <MapPin size={12} className="text-orange-600 shrink-0" />
                      <SelectValue placeholder="MÉDIA ESTADUAL" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-[2rem] border-zinc-200 shadow-2xl max-h-[350px]">
                    <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest py-3 italic">MÉDIA ESTADUAL</SelectItem>
                    {dynamicOptions.city.map(city => (
                      <SelectItem key={city} value={city} className="text-[10px] font-bold uppercase py-3 border-t border-zinc-50 first:border-none">
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2 px-1">
                  <Users size={12} className="text-zinc-400" />
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">N = {approvalStats.total.toLocaleString('pt-BR')}</span>
                </div>
              </div>
            }
          />
        </div>

        {/* Restante do Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <InteractiveMap stats={filteredData.reduce((acc, curr) => { const r = String(curr[activeKeys.REGION] || '').trim() as MesoRegion; if (r) acc[r] = (acc[r] || 0) + 1; return acc; }, {} as Record<MesoRegion, number>)} activeRegion={filters.region[0] === 'all' ? 'all' : filters.region[0]} onRegionSelect={(r) => handleFilterChange('region', r || 'all')} />
          <ApprovalChart data={chartData.approvalData} />
          
          <LuxuryCard title="POSICIONAMENTO IDEOLÓGICO" subtitle="Ideologia">
            <div className="space-y-4 mt-4">
              <div className="flex flex-wrap gap-2">
                <FilterChip 
                  label="Todas" 
                  active={filters.ideology.includes('all')} 
                  onClick={() => handleFilterChange('ideology', 'all')} 
                />
                {dynamicOptions.ideology.map(opt => (
                  <FilterChip 
                    key={opt} 
                    label={opt} 
                    percentage={distributionStats.ideology?.[opt]}
                    active={filters.ideology.includes(opt)} 
                    onClick={() => handleFilterChange('ideology', opt)} 
                  />
                ))}
              </div>
              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest pt-2 border-t border-zinc-50">
                Filtro Dinâmico Ativo
              </p>
            </div>
          </LuxuryCard>

          <CandidateChart data={chartData.candidateData} />
          <LuxuryCard title="Demandas Sociais" subtitle="Maiores Problemas" className="lg:col-span-2">
            <div className="h-[250px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.topProblems} layout="vertical" margin={{ left: 40, right: 30 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10, fontWeight: 800 }} width={100} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontSize: '11px' }} />
                  <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={20}>
                    {chartData.topProblems.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981'][index % 5]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </LuxuryCard>
        </div>
      </div>
    </AppLayout>
  );
}
