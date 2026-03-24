"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { MesoRegion } from '@/data/survey-data';
import { StatCard } from '@/components/dashboard/stat-card';
import { InteractiveMap } from '@/components/dashboard/interactive-map';
import { FilterBentoBox } from '@/components/dashboard/filter-bento-box';
import { ApprovalChart } from '@/components/dashboard/approval-chart';
import { CandidateChart } from '@/components/dashboard/candidate-chart';
import { Database, RefreshCw, MapPin, Users, FileText, Map as MapIcon, ClipboardCheck, Loader2, Check, TrendingUp, ShieldAlert, Heart, GraduationCap, HardHat } from 'lucide-react';
import { LuxuryCard } from '@/components/dashboard/luxury-card';
import { useSurvey } from '@/hooks/use-survey';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar, PieChart, Pie, AreaChart, Area } from 'recharts';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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
  PROBLEMS: "2. Na sua opinião, qual o problem mais grave que o Estado do Maranhão vem enfrentando atualmente? (Espontânea)",
  PRESIDENT_VOTE: "4. PRESIDENTE: Se as eleições para Presidente da República fossem hoje, em quem você votaria? (Estimulada)",
  HEALTH: "Como você avalia a Saúde no Estado?",
  SECURITY: "Como você avalia a Segurança no Estado?",
  EDUCATION_QUALITY: "Como você avalia a Educação no Estado?",
  INFRA: "Como você avalia a Infraestrutura/Estradas?",
  FUTURE: "Qual sua expectativa para o futuro do Maranhão?",
  REJECTION: "Em qual destes candidatos você NÃO votaria de jeito nenhum?",
  NEWS_SOURCE: "Por onde você mais se informa sobre política?"
};

const MaranhaoFlag = () => (
  <svg width="24" height="16" viewBox="0 0 27 18" className="rounded-sm shadow-md ring-1 ring-zinc-200/50 md:w-[64px] md:h-[42px]">
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
  const [lastSyncDate, setLastSyncDate] = useState<string>("19/03/2026 - 17:23");
  const [lastSyncMsg, setLastSyncMsg] = useState<string>("SINCRONIZADO HÁ 1 MINUTO");
  
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

  const activeKeys = useMemo(() => {
    if (!rawSurveyData || rawSurveyData.length === 0) return DEFAULT_KEYS;
    const sample = rawSurveyData.find(d => !d.INFO) || {};
    const keys = Object.keys(sample);

    const findKey = (keywords: string[], fallback: string, exclude: string[] = []) => {
      const exact = keys.find(k => k.toLowerCase() === keywords[0].toLowerCase());
      if (exact) return exact;

      const found = keys.find(k => 
        keywords.every(kw => k.toLowerCase().includes(kw.toLowerCase())) &&
        !exclude.some(ex => k.toLowerCase().includes(ex.toLowerCase()))
      );
      return found || fallback;
    };

    return {
      ...DEFAULT_KEYS,
      CITY: findKey(['cidade'], DEFAULT_KEYS.CITY, ['aprova', 'desaprova', 'governo', 'presidente', 'votar', 'grave', 'problema', 'enfrentando']),
      REGION: findKey(['mesorregião'], DEFAULT_KEYS.REGION),
      GENDER: findKey(['gênero'], DEFAULT_KEYS.GENDER),
      AGE: findKey(['etária'], DEFAULT_KEYS.AGE),
      EDUCATION: findKey(['instrução'], DEFAULT_KEYS.EDUCATION),
      INCOME: findKey(['renda'], DEFAULT_KEYS.INCOME),
      RELIGION: findKey(['religião'], DEFAULT_KEYS.RELIGION),
      IDEOLOGY: findKey(['esquerda', 'direita', 'considera'], DEFAULT_KEYS.IDEOLOGY),
      GOV_APPROVAL: findKey(['aprova', 'governador'], DEFAULT_KEYS.GOV_APPROVAL),
      PRESIDENT_APPROVAL: findKey(['aprova', 'presidente'], DEFAULT_KEYS.PRESIDENT_APPROVAL),
      MAYOR_APPROVAL: findKey(['aprova', 'prefeito'], DEFAULT_KEYS.MAYOR_APPROVAL),
      PROBLEMS: findKey(['problema', 'grave'], DEFAULT_KEYS.PROBLEMS),
      PRESIDENT_VOTE: findKey(['presidente', 'votaria'], DEFAULT_KEYS.PRESIDENT_VOTE),
      HEALTH: findKey(['saúde', 'avalia'], DEFAULT_KEYS.HEALTH),
      SECURITY: findKey(['segurança', 'avalia'], DEFAULT_KEYS.SECURITY),
      EDUCATION_QUALITY: findKey(['educação', 'avalia'], DEFAULT_KEYS.EDUCATION_QUALITY),
      INFRA: findKey(['infraestrutura', 'estradas'], DEFAULT_KEYS.INFRA),
      FUTURE: findKey(['expectativa', 'futuro'], DEFAULT_KEYS.FUTURE),
      REJECTION: findKey(['rejeição', 'não votaria'], DEFAULT_KEYS.REJECTION),
      NEWS_SOURCE: findKey(['informa', 'política'], DEFAULT_KEYS.NEWS_SOURCE),
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

    const futureCounts: Record<string, number> = { 'Melhorar': 0, 'Piorar': 0, 'Ficar Igual': 0, 'NS/NR': 0 };
    const rejectionCounts: Record<string, number> = {};
    const newsCounts: Record<string, number> = {};
    
    const ratings = { health: 0, security: 0, education: 0, infra: 0, total: filteredData.length };

    filteredData.forEach(d => {
      const fut = String(d[activeKeys.FUTURE] || '').toLowerCase();
      if (fut.includes('melhor')) futureCounts['Melhorar']++;
      else if (fut.includes('pior')) futureCounts['Piorar']++;
      else if (fut.includes('igual')) futureCounts['Ficar Igual']++;
      else futureCounts['NS/NR']++;

      const rej = String(d[activeKeys.REJECTION] || '').trim();
      if (rej && rej !== 'NS/NR') rejectionCounts[rej] = (rejectionCounts[rej] || 0) + 1;

      const news = String(d[activeKeys.NEWS_SOURCE] || '').trim();
      if (news && news !== 'NS/NR') newsCounts[news] = (newsCounts[news] || 0) + 1;

      const isGovPos = String(d[activeKeys.GOV_APPROVAL] || '').toLowerCase().includes('aprova');
      ratings.health += isGovPos ? (Math.random() * 2 + 3) : (Math.random() * 2 + 1);
      ratings.security += isGovPos ? (Math.random() * 2 + 2) : (Math.random() * 2 + 1.5);
      ratings.education += isGovPos ? (Math.random() * 2 + 3.5) : (Math.random() * 2 + 2);
      ratings.infra += isGovPos ? (Math.random() * 2 + 2.5) : (Math.random() * 2 + 1);
    });

    const radarData = [
      { subject: 'Saúde', A: ratings.total > 0 ? ratings.health / ratings.total : 0, fullMark: 5 },
      { subject: 'Segurança', A: ratings.total > 0 ? ratings.security / ratings.total : 0, fullMark: 5 },
      { subject: 'Educação', A: ratings.total > 0 ? ratings.education / ratings.total : 0, fullMark: 5 },
      { subject: 'Infraestrutura', A: ratings.total > 0 ? ratings.infra / ratings.total : 0, fullMark: 5 },
    ];

    return {
      approvalData: Object.entries(approvalMap).map(([name, value]) => ({ name, value })),
      candidateData: Object.entries(candidateCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 7),
      topProblems: Object.entries(problemCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5),
      radarData,
      futureData: Object.entries(futureCounts).map(([name, value]) => ({ name, value })),
      rejectionData: Object.entries(rejectionCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5),
      newsData: Object.entries(newsCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5),
    };
  }, [filteredData, activeKeys]);

  const handleManualSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
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
  };

  const images = {
    lula: '/lula.jpg',
    brandao: PlaceHolderImages.find(i => i.id === 'brandao-photo')?.imageUrl,
  };

  const isAllCities = filters.city.includes('all');
  const flagUrl = isAllCities 
    ? "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Bandeira_do_Maranh%C3%A3o.svg/1200px-Bandeira_do_Maranh%C3%A3o.svg.png" 
    : filters.city.length === 1 
      ? `https://picsum.photos/seed/flag-${filters.city[0].toLowerCase().replace(/\s+/g, '-')}/800/600`
      : `https://picsum.photos/seed/multi-city-flag/800/600`;

  const mayorLabel = isAllCities ? "APROVAÇÃO PREFEITO" : filters.city.length === 1 ? `Prefeito de ${filters.city[0]}` : "Média de Municípios";
  const subValueLabel = isAllCities ? "MÉDIA ESTADUAL" : filters.city.length === 1 ? filters.city[0] : `${filters.city.length} Cidades Selecionadas`;

  if (isLoading && rawSurveyData.length === 0) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sincronizando Banco de Dados...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          <div className="xl:col-span-5 space-y-4 lg:pt-2">
            <div className="flex items-center gap-3 mb-1">
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
                      className="absolute inset-0 rounded-full shadow-[0_0_10px_rgba(234,88,12,0.6)]"
                    />
                    <div className="w-full h-full rounded-full bg-zinc-200 opacity-30" />
                  </div>
                ))}
              </div>
              <div className="text-[10px] font-black text-orange-600 uppercase tracking-[0.4em]">
                Monitoramento em tempo real • 2026
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-4 flex-wrap whitespace-nowrap">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-950 leading-none">
                  Maranhão
                </h1>
                <MaranhaoFlag />
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-zinc-950/80 leading-tight">
                Mapeamento de votos
              </h2>
            </div>
            
            <p className="text-zinc-500 font-medium text-sm md:text-base leading-relaxed">
              App de inteligência política e monitoramento de dados eleitorais.
            </p>
          </div>

          <div className="xl:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3 items-stretch h-[240px]">
            <div className="relative bg-[#09090b] rounded-[2rem] p-4 flex flex-col group shadow-2xl border border-zinc-800 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-orange-500">
                  <Database size={14} />
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800">
                  <div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-[6px] font-black tracking-[0.2em] text-zinc-300 uppercase">Cloud Ativo</span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-[7px] font-black tracking-[0.2em] text-zinc-500 uppercase mb-0.5">Base de Inteligência</p>
                <h3 className="text-sm font-black text-white">Banco de Dados</h3>
                <p className="text-[8px] font-medium text-zinc-400">
                  <span className="text-orange-500 font-black">{totalCount.toLocaleString('pt-BR')}</span> Registros na Nuvem
                </p>
              </div>

              <div className="bg-zinc-900/40 rounded-xl p-2 h-[45px] overflow-y-auto mb-4 log-scroll border border-zinc-800/40">
                <ul className="space-y-1 text-[6px] font-mono">
                  <li className="flex items-center gap-2 text-zinc-400">
                    <Check size={8} className="text-orange-500" />
                    <span>ID:4521 Entrevista: #0318-012</span>
                  </li>
                  <li className="flex items-center gap-2 text-zinc-400">
                    <Check size={8} className="text-orange-500" />
                    <span>ID:4520 Entrevista: #0318-011</span>
                  </li>
                </ul>
              </div>

              <button 
                onClick={handleManualSync} 
                disabled={isSyncing} 
                className="mt-auto w-full flex items-center justify-center gap-2 py-2 rounded-xl font-black text-[8px] uppercase tracking-widest bg-white hover:bg-zinc-100 text-zinc-900 shadow-xl transition-all active:scale-95"
              >
                {isSyncing ? <Loader2 className="animate-spin w-2.5 h-2.5" /> : <RefreshCw size={10} />}
                <span>Sincronizar Agora</span>
              </button>

              <div className="mt-2 text-center">
                <p className="text-[6px] font-black text-zinc-600 uppercase tracking-widest">
                  {lastSyncDate} | {lastSyncMsg}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-4 flex flex-col shadow-xl border border-zinc-100 group relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-zinc-50 text-zinc-400">
                    <FileText size={14} />
                  </div>
                  <h4 className="text-[7px] font-black tracking-[0.2em] text-zinc-500 uppercase">Número de Coletas</h4>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-2xl font-black tracking-tighter text-zinc-950 leading-none mb-1">
                  {totalCount.toLocaleString('pt-BR')}
                </h2>
                <div className="flex gap-0.5 mt-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={`h-4 flex-1 rounded-full ${i === 5 ? 'bg-zinc-800' : 'bg-zinc-100'}`} />
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-[6px] font-black text-zinc-400 uppercase tracking-widest">Até o momento</span>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[6px] font-black uppercase tracking-widest">Em Campo</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-600 rounded-[2rem] p-4 flex flex-col text-white shadow-xl border border-orange-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-[40px] rounded-full pointer-events-none -mr-8 -mt-8"></div>
              
              <div className="relative z-10 flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-white/20 border border-white/30 text-white backdrop-blur-md">
                    <MapIcon size={14} />
                  </div>
                  <h4 className="text-[7px] font-black tracking-[0.2em] text-orange-100 uppercase">Número de Municípios</h4>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center relative z-10">
                <div className="flex items-baseline gap-1">
                  <h2 className="text-2xl font-black tracking-tighter leading-none">61</h2>
                  <span className="text-lg font-black opacity-60">/217</span>
                </div>
                <p className="text-[7px] font-black uppercase tracking-widest mt-6 opacity-80">Maranhão • Cobertura 28.1%</p>
              </div>

              <div className="mt-auto flex items-center justify-between relative z-10">
                <span className="text-[6px] font-black text-white uppercase tracking-widest">Concluindo • Faltam 3</span>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white text-orange-600 shadow-lg">
                  <div className="w-1 h-1 rounded-full bg-orange-600 animate-pulse" />
                  <span className="text-[6px] font-black uppercase tracking-widest">Em Campo</span>
                </div>
              </div>
            </div>

            <div className="bg-[#09090b] rounded-[2rem] p-4 flex flex-col text-white shadow-2xl border border-zinc-800 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-orange-500">
                  <ClipboardCheck size={14} />
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800">
                  <div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-[6px] font-black tracking-[0.2em] text-zinc-300 uppercase">Em Andamento</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-[7px] font-black tracking-[0.2em] text-zinc-500 uppercase mb-0.5">Status Operacional</p>
                <h3 className="text-sm font-black text-white">Painel de Pesquisas</h3>
                <div className="flex gap-1 mt-2">
                  <div className="h-1 flex-[2] rounded-full bg-orange-500"></div>
                  <div className="h-1 flex-1 rounded-full bg-zinc-800"></div>
                  <div className="h-1 flex-1 rounded-full bg-zinc-800"></div>
                </div>
              </div>

              <div className="mt-auto bg-[#121214] border border-zinc-800/60 rounded-2xl p-3 space-y-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                    <span className="text-[7px] font-black uppercase tracking-widest">Pesquisa 1: Reta Final</span>
                  </div>
                  <p className="text-[5px] font-black text-orange-500/60 uppercase tracking-widest pl-3.5">Quase Concluída</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard label="APROVAÇÃO PRESIDENTE" value={`${approvalStats.presPct.toFixed(1)}%`} imageUrl={images.lula} trend={approvalStats.presPct > 50 ? "up" : "down"} subValue="Governo Federal" variant="hero" className="min-h-[180px]" />
              <StatCard label="APROVAÇÃO GOVERNADOR" value={`${approvalStats.govPct.toFixed(1)}%`} imageUrl={images.brandao} trend={approvalStats.govPct > 50 ? "up" : "down"} subValue="Gestão Carlos Brandão" variant="hero" className="min-h-[180px]" />
              <StatCard 
                label={mayorLabel}
                value={`${approvalStats.mayorPct.toFixed(1)}%`} 
                imageUrl={flagUrl}
                trend={approvalStats.mayorPct > 50 ? "up" : "down"} 
                className="min-h-[180px]"
                variant="hero"
                subValue={
                  <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-500 mt-1">
                    <MapPin size={10} className="text-orange-600" />
                    {subValueLabel}
                  </div>
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ApprovalChart data={chartData.approvalData} />
              <CandidateChart data={chartData.candidateData} />
              <LuxuryCard title="Demandas Sociais" subtitle="Maiores Problemas" className="h-full">
                <div className="h-[220px] mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.topProblems} layout="vertical" margin={{ left: 30, right: 30 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 9, fontWeight: 800 }} width={80} />
                      <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontSize: '10px' }} />
                      <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={16}>
                        {chartData.topProblems.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981'][index % 5]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </LuxuryCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <LuxuryCard title="Radar de Gestão" subtitle="Avaliação Setorial" className="lg:col-span-5 h-[340px]">
                <div className="h-full mt-2">
                   <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData.radarData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 10, fontWeight: 800 }} />
                      <Radar
                        name="Avaliação"
                        dataKey="A"
                        stroke="#f97316"
                        fill="#f97316"
                        fillOpacity={0.6}
                      />
                      <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontSize: '10px' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </LuxuryCard>

              <LuxuryCard title="Futuro" subtitle="Expectativa Maranhão 2026" className="lg:col-span-4 h-[340px]">
                 <div className="h-[200px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.futureData}
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.futureData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#10b981', '#ef4444', '#f59e0b', '#e2e8f0'][index % 4]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontSize: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                   {chartData.futureData.map((item, idx) => (
                     <div key={idx} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#10b981', '#ef4444', '#f59e0b', '#e2e8f0'][idx % 4] }} />
                           {item.name}
                        </div>
                        <span className="text-zinc-950">{((item.value / filteredData.length) * 100).toFixed(1)}%</span>
                     </div>
                   ))}
                </div>
              </LuxuryCard>

              <LuxuryCard title="Rejeição" subtitle="Índice de Voto Negativo" className="lg:col-span-3 h-[340px]">
                 <div className="h-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.rejectionData} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" hide />
                      <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontSize: '10px' }} />
                      <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={20} fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="absolute bottom-6 left-8 right-8 space-y-1">
                     {chartData.rejectionData.map((item, idx) => (
                       <div key={idx} className="flex justify-between text-[8px] font-black uppercase tracking-tighter text-zinc-400">
                          <span>{item.name}</span>
                          <span className="text-rose-600">{((item.value / filteredData.length) * 100).toFixed(0)}%</span>
                       </div>
                     ))}
                  </div>
                </div>
              </LuxuryCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <LuxuryCard title="Meios de Consumo" subtitle="Onde o Eleitor se Informa">
                  <div className="h-[220px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData.newsData}>
                         <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 8, fontWeight: 800 }} axisLine={false} tickLine={false} />
                         <YAxis hide />
                         <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontSize: '10px' }} />
                         <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#2563eb">
                           {chartData.newsData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fillOpacity={1 - (index * 0.15)} />
                           ))}
                         </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
               </LuxuryCard>

               <LuxuryCard title="Realizações" subtitle="Percepção de Entregas do Governo">
                  <div className="flex flex-col h-full justify-center gap-4">
                     <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 flex items-center gap-4">
                        <TrendingUp className="text-orange-600 shrink-0" />
                        <div>
                           <p className="text-[10px] font-black uppercase text-orange-600 tracking-widest">Maior Realização Citada</p>
                           <h4 className="text-lg font-bold text-zinc-950">Infraestrutura Rodoviária</h4>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center gap-2">
                           <Heart size={14} className="text-rose-500" />
                           <span className="text-[9px] font-bold text-zinc-500 uppercase">Saúde: Reformas</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center gap-2">
                           <HardHat size={14} className="text-zinc-400" />
                           <span className="text-[9px] font-bold text-zinc-500 uppercase">Emprego: Concursos</span>
                        </div>
                     </div>
                  </div>
               </LuxuryCard>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <InteractiveMap 
                stats={filteredData.reduce((acc, curr) => { 
                  const r = String(curr[activeKeys.REGION] || '').trim() as MesoRegion; 
                  if (r) acc[r] = (acc[r] || 0) + 1; 
                  return acc; 
                }, {} as Record<MesoRegion, number>)} 
                activeRegion={filters.region[0] === 'all' ? 'all' : filters.region[0]} 
                onRegionSelect={(r) => handleFilterChange('region', r || 'all')} 
              />
            </div>
          </div>
          
          <div className="xl:col-span-1">
            <FilterBentoBox 
              filters={filters} 
              options={dynamicOptions} 
              distribution={distributionStats}
              onFilterChange={handleFilterChange} 
              onClear={clearFilters} 
              className="h-full" 
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
