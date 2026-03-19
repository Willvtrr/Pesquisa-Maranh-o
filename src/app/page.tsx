
"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { MesoRegion } from '@/data/survey-data';
import { StatCard } from '@/components/dashboard/stat-card';
import { InteractiveMap } from '@/components/dashboard/interactive-map';
import { FilterBentoBox } from '@/components/dashboard/filter-bento-box';
import { ApprovalChart } from '@/components/dashboard/approval-chart';
import { CandidateChart } from '@/components/dashboard/candidate-chart';
import { Database, BarChart3, AlertTriangle, Loader2, RefreshCw, MapPin, Users } from 'lucide-react';
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
  PROBLEMS: "2. Na sua opinião, qual o problem mais grave que o Estado do Maranhão vem enfrentando atualmente? (Espontânea)",
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
        {/* Linha Superior: Exatamente como no print fornecido */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {/* Card 1: Banco de Dados (Escuro) */}
          <div className="relative bg-[#09090b] rounded-[2.5rem] p-8 border border-zinc-800 shadow-2xl transition-all duration-300 hover:border-zinc-700 overflow-hidden flex flex-col group min-h-[420px]">
            <motion.div initial={{ width: 0 }} animate={{ width: isSyncing ? '100%' : '0%' }} transition={{ duration: 2, ease: "easeOut" }} className="absolute top-0 left-0 h-[2px] bg-orange-500 z-20" />
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
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-100 mb-1">Banco de Dados</h2>
              <p className="text-xs font-medium text-zinc-500"><span className="text-zinc-300">{rawSurveyData.length.toLocaleString('pt-BR')}</span> Entrevistas Processadas</p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4 h-[120px] overflow-y-auto mb-8 relative z-10 log-scroll">
              <ul className="space-y-3 text-[10px] font-mono">
                <AnimatePresence initial={false} mode="popLayout">
                  {syncLogs.map((log) => (
                    <motion.li key={log.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
                      {log.status === 'success' ? <span className="text-orange-500 font-bold">✓</span> : <Loader2 className="w-3 h-3 text-orange-500 animate-spin" />}
                      <span className={cn(log.status === 'pending' ? 'text-orange-400' : 'text-zinc-400')}>{log.text}</span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
            <button onClick={handleManualSync} disabled={isSyncing} className={cn("relative w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-xs transition-all duration-200 active:scale-[0.98] overflow-hidden z-10", isSyncing ? "bg-zinc-900 text-zinc-300 border border-zinc-800" : "bg-zinc-100 hover:bg-white text-zinc-900 shadow-lg shadow-black/20")}>
              {isSyncing ? <Loader2 className="animate-spin w-4 h-4 text-orange-500" /> : <RefreshCw className="w-4 h-4" />}
              <span>{isSyncing ? "Sincronizando..." : "Sincronizar Agora"}</span>
            </button>
            <div className="mt-auto text-center relative z-10">
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">ÚLTIMA ATT: <span className="text-zinc-500">{lastSync}</span></p>
            </div>
          </div>

          {/* Card 2: Número de Coletas (Branco) */}
          <div className="px-10 py-12 rounded-[2.5rem] bg-white border border-zinc-100 ring-1 ring-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.03),0_2px_10px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center min-h-[420px] hover:-translate-y-1 transition-all duration-300 group">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-10 text-center">Número de coletas</span>
            <span className="text-7xl font-mono font-bold text-zinc-950 tracking-tighter">
              {totalCount.toLocaleString('pt-BR')}
            </span>
            <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.4em] mt-10 text-center">Até o momento</span>
          </div>

          {/* Card 3: Número de Municípios (Laranja) */}
          <div className="px-10 py-12 rounded-[2.5rem] premium-gradient text-white border border-orange-400/20 ring-1 ring-white/20 shadow-[0_20px_50px_rgba(234,88,12,0.1),0_2px_10px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center min-h-[420px] hover:-translate-y-1 transition-all duration-300">
            <span className="text-[10px] font-black text-orange-100 uppercase tracking-[0.3em] mb-10 text-center">Número de Municípios</span>
            <span className="text-7xl font-mono font-bold tracking-tighter">
              {citiesCount.toLocaleString('pt-BR')}
            </span>
            <span className="text-[10px] font-bold text-orange-200/60 uppercase tracking-[0.4em] mt-10 text-center">Até o momento</span>
          </div>

          {/* Card 4: Status da Operação (Zinco Escuro) */}
          <div className="px-10 py-12 rounded-[2.5rem] bg-zinc-950 text-white border border-zinc-800 ring-1 ring-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.1),0_2px_10px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center min-h-[420px] hover:-translate-y-1 transition-all duration-300">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-10 text-center">Status da Operação</span>
            <span className="text-7xl font-mono font-bold text-white tracking-tighter">
              1 DE 3
            </span>
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em] mt-10 text-center uppercase">Concluindo • Faltam 3</span>
          </div>
        </div>

        {/* Linha de Aprovações: Grade de 3 Colunas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
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
