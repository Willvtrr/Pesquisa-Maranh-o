
"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { MesoRegion } from '@/data/survey-data';
import { StatCard } from '@/components/dashboard/stat-card';
import { InteractiveMap } from '@/components/dashboard/interactive-map';
import { FilterBentoBox } from '@/components/dashboard/filter-bento-box';
import { ApprovalChart } from '@/components/dashboard/approval-chart';
import { CandidateChart } from '@/components/dashboard/candidate-chart';
import { Database, BarChart3, AlertTriangle, Loader2, RefreshCw, MapPin, Users, FileText, Map as MapIcon, ClipboardCheck } from 'lucide-react';
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

export default function Home() {
  const { data: rawSurveyData, isLoading } = useSurvey();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string>("");
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

  const topCities = useMemo(() => {
    if (!rawSurveyData) return [];
    const counts: Record<string, number> = {};
    rawSurveyData.filter(item => !item.INFO).forEach(item => {
      const city = String(item["Cidade:"] || "").trim();
      if (city) counts[city] = (counts[city] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
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

  useEffect(() => {
    const updateSyncTime = () => {
      const date = new Date();
      date.setMinutes(date.getMinutes() - 12);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      setLastSync(`${day}/${month}/${year} ÀS ${hours}:${minutes}`);
    };
    if (!lastSync) updateSyncTime();
  }, [lastSync]);

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
    setLastSync(`${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ÀS ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
    setIsSyncing(false);
    toast({ title: "Sincronização Ativa", description: "Os dados foram atualizados em tempo real com o Google Cloud." });
  };

  const images = {
    lula: PlaceHolderImages.find(i => i.id === 'lula-photo')?.imageUrl,
    brandao: PlaceHolderImages.find(i => i.id === 'brandao-photo')?.imageUrl,
    prefeito: PlaceHolderImages.find(i => i.id === 'prefeito-photo')?.imageUrl,
  };

  const selectedCity = filters.city[0];
  const mayorImageUrl = selectedCity === 'all' 
    ? "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Bandeira_do_Maranh%C3%A3o.svg/1200px-Bandeira_do_Maranh%C3%A3o.svg.png" 
    : `https://picsum.photos/seed/flag-${selectedCity.toLowerCase().replace(/\s+/g, '-')}/400/300`;

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
      <div className="space-y-8">
        {/* Linha Superior: Operação */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          
          {/* Card 1: Banco de Dados */}
          <div className="relative card-dark rounded-[2.5rem] p-8 transition-all duration-300 hover:lift flex flex-col group min-h-[420px]">
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-orange-500 shadow-inner">
                <Database size={20} />
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-[10px] font-semibold tracking-wide text-zinc-300 uppercase">Cloud Ativo</span>
              </div>
            </div>
            <div className="mb-6 relative z-10">
              <h3 className="text-[10px] font-semibold tracking-[0.2em] text-zinc-500 uppercase mb-2">Base de Inteligência</h3>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-100 mb-1">Banco de Dados</h2>
              <p className="text-xs font-medium text-zinc-500"><span className="text-zinc-300">{rawSurveyData.length.toLocaleString('pt-BR')}</span> Registros na Nuvem</p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4 h-[120px] overflow-y-auto mb-8 relative z-10 log-scroll">
              <ul className="space-y-3 text-[10px] font-mono">
                <AnimatePresence initial={false} mode="popLayout">
                  {syncLogs.map((log) => (
                    <motion.li key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
                      {log.status === 'success' ? <span className="text-orange-500 font-bold">✓</span> : <Loader2 className="w-3 h-3 text-orange-500 animate-spin" />}
                      <span className={cn(log.status === 'pending' ? 'text-orange-400' : 'text-zinc-400')}>{log.text}</span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
            <button onClick={handleManualSync} disabled={isSyncing} className={cn("relative w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-xs transition-all duration-200 active:scale-[0.98] overflow-hidden z-10", isSyncing ? "bg-zinc-900 text-zinc-300 border border-zinc-800" : "bg-white hover:bg-zinc-100 text-zinc-900")}>
              {isSyncing ? <Loader2 className="animate-spin w-4 h-4 text-orange-500" /> : <RefreshCw className="w-4 h-4" />}
              <span>{isSyncing ? "Processando..." : "Sincronizar Agora"}</span>
            </button>
          </div>

          {/* Card 2: Número de Coletas */}
          <div className="card-white rounded-[2.5rem] p-8 flex flex-col hover:lift transition-all duration-300 min-h-[420px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 text-zinc-500 shadow-inner">
                <FileText size={16} strokeWidth={2.5} />
              </div>
              <h3 className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Número de Coletas</h3>
            </div>
            
            <div className="flex-grow flex flex-col justify-center">
              <h2 className="text-[4.5rem] lg:text-[5rem] leading-none font-black tracking-tighter text-zinc-900">
                {totalCount.toLocaleString('pt-BR')}
              </h2>
              
              <div className="mt-8">
                <div className="flex justify-between items-end mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">↑ +12.4%</span>
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wide">vs. Meta</span>
                  </div>
                </div>
                
                <div className="flex items-end gap-1.5 h-12 w-full pt-2 border-b border-zinc-100 pb-1">
                  {[40, 60, 45, 75, 50, 100].map((h, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "w-full rounded-t-sm transition-all duration-500",
                        i === 5 ? "bg-zinc-800" : "bg-zinc-100"
                      )}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-6 mt-4">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Até o momento</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <span className="text-[10px] font-black text-emerald-600 uppercase">Em Campo</span>
              </div>
            </div>
          </div>

          {/* Card 3: Número de Municípios */}
          <div className="card-orange rounded-[2.5rem] p-8 flex flex-col hover:lift transition-all duration-300 min-h-[420px] relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 blur-[60px] rounded-full pointer-events-none -mr-10 -mt-10"></div>
            
            <div className="relative z-10 flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 border border-white/30 text-white backdrop-blur-sm shadow-inner">
                <MapIcon size={16} strokeWidth={2.5} />
              </div>
              <h3 className="text-xs font-bold tracking-widest text-orange-100 uppercase">Número de Municípios</h3>
            </div>
            
            <div className="relative z-10 flex-grow flex flex-col justify-center">
              <div className="flex items-baseline gap-1">
                <h2 className="text-[4.5rem] lg:text-[5rem] font-black tracking-tighter text-white leading-none">
                  {citiesCount}
                </h2>
                <span className="text-2xl font-bold text-orange-200 tracking-tighter">/217</span>
              </div>

              <div className="mt-8">
                <div className="flex justify-between text-[9px] font-black text-orange-100 uppercase tracking-widest mb-3 border-b border-orange-400/30 pb-2">
                  <span>Municípios com Maior Volume</span>
                </div>
                
                <div className="space-y-2 mt-3">
                  {topCities.map(([name, count], i) => (
                    <div key={name} className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white tracking-wide uppercase text-[10px]">{i+1}. {name}</span>
                      <span className="font-mono font-bold text-orange-200 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-md">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="relative z-10 flex items-center justify-between border-t border-orange-400/50 pt-6 mt-4">
              <span className="text-[10px] font-black text-orange-200 uppercase tracking-widest">Cobertura: {((citiesCount / 217) * 100).toFixed(1)}%</span>
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl shadow-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider">Em Campo</span>
              </div>
            </div>
          </div>

          {/* Card 4: Status Operacional */}
          <div className="card-dark rounded-[2.5rem] p-8 flex flex-col min-h-[420px] text-white">
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                  <ClipboardCheck size={24} />
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 shadow-inner">
                  <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
                  <span className="text-[10px] font-black tracking-widest text-zinc-100 uppercase">Em Andamento</span>
                </div>
              </div>
      
              <div className="mb-8">
                <h3 className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase mb-2">Status Operacional</h3>
                <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Painel de Pesquisas</h2>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  Avançando na <span className="text-orange-500">Pesquisa 1 de 3</span> programadas
                </p>
              </div>
      
              <div className="flex gap-3 mb-10">
                <div className="h-2 flex-1 rounded-full bg-zinc-800 relative overflow-hidden">
                  <div className="absolute inset-y-0 left-0 w-[70%] bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.4)]"></div>
                </div>
                <div className="h-2 flex-1 rounded-full bg-zinc-800"></div>
                <div className="h-2 flex-1 rounded-full bg-zinc-800"></div>
              </div>
      
              <div className="bg-[#121214] border border-zinc-800/60 rounded-[2rem] p-6 flex-1 flex flex-col justify-center gap-8">
                <div className="flex items-center gap-5">
                  <div className="relative flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-orange-500 ring-4 ring-orange-500/20"></div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-white uppercase tracking-widest">Pesquisa 1: Em Campo</p>
                    <p className="text-[9px] font-black text-orange-500 uppercase">Reta final (Quase Concluída)</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-5">
                  <div className="w-4 h-4 rounded-full bg-zinc-800"></div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">Pesquisa 2: Programada</p>
                    <p className="text-[9px] font-black text-zinc-700 uppercase">Aguardando Início</p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="w-4 h-4 rounded-full bg-zinc-800"></div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">Pesquisa 3: Futura</p>
                    <p className="text-[9px] font-black text-zinc-700 uppercase">Planejada</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grade de Aprovações */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <StatCard label="APROVAÇÃO PRESIDENTE" value={`${approvalStats.presPct.toFixed(1)}%`} imageUrl={images.lula} trend={approvalStats.presPct > 50 ? "up" : "down"} subValue="Governo Federal" />
          <StatCard label="APROVAÇÃO GOVERNADOR" value={`${approvalStats.govPct.toFixed(1)}%`} imageUrl={images.brandao} trend={approvalStats.govPct > 50 ? "up" : "down"} subValue="Gestão Carlos Brandão" />
          
          <StatCard 
            label={mayorLabel}
            value={`${approvalStats.mayorPct.toFixed(1)}%`} 
            imageUrl={mayorImageUrl}
            trend={approvalStats.mayorPct > 50 ? "up" : "down"} 
            variant="hero"
            subValue={
              <div className="relative w-full space-y-3">
                <Select value={filters.city[0]} onValueChange={(val) => handleFilterChange('city', val)}>
                  <SelectTrigger className="h-12 bg-zinc-50/80 border-zinc-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-950 focus:ring-orange-500/20 shadow-sm">
                    <div className="flex items-center gap-2 truncate">
                      <MapPin size={14} className="text-orange-600 shrink-0" />
                      <SelectValue placeholder="MÉDIA ESTADUAL" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-[2rem] border-zinc-200 shadow-2xl max-h-[350px]">
                    <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest py-3">MÉDIA ESTADUAL</SelectItem>
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
          <FilterBentoBox filters={filters} options={dynamicOptions} onFilterChange={handleFilterChange} onClear={clearFilters} className="lg:col-span-2" />
          <InteractiveMap stats={filteredData.reduce((acc, curr) => { const r = String(curr[activeKeys.REGION] || '').trim() as MesoRegion; if (r) acc[r] = (acc[r] || 0) + 1; return acc; }, {} as Record<MesoRegion, number>)} activeRegion={filters.region[0] === 'all' ? 'all' : filters.region[0]} onRegionSelect={(r) => handleFilterChange('region', r || 'all')} />
          <ApprovalChart data={chartData.approvalData} />
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
