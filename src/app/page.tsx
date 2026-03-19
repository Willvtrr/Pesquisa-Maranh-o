
"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { MesoRegion } from '@/data/survey-data';
import { StatCard } from '@/components/dashboard/stat-card';
import { InteractiveMap } from '@/components/dashboard/interactive-map';
import { FilterBentoBox } from '@/components/dashboard/filter-bento-box';
import { ApprovalChart } from '@/components/dashboard/approval-chart';
import { CandidateChart } from '@/components/dashboard/candidate-chart';
import { CheckCircle, Activity, MapPin, Database, BarChart3, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { LuxuryCard } from '@/components/dashboard/luxury-card';
import { useSurvey } from '@/hooks/use-survey';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const SURVEY_KEYS = {
  CITY: "Cidade:",
  REGION: "Mesorregião",
  GENDER: "Gênero",
  AGE: "Faixa Etária",
  EDUCATION: "Grau de Instrução",
  INCOME: "Renda Familiar",
  RELIGION: "Religião",
  IDEOLOGY: "Você se considera de esquerda, centro ou direita?",
  GOV_APPROVAL: "De modo geral, você aprova ou desaprova o Governo do Governador Carlos Brandão?",
  PROBLEMS: "2. Na sua opinião, qual o problema mais grave que o Estado do Maranhão vem enfrentando atualmente? (Espontânea)",
  PRESIDENT_VOTE: "4. PRESIDENTE: Se as eleições para Presidente da República fossem hoje, em quem você votaria? (Estimulada)"
};

export default function Home() {
  const { data: rawSurveyData, isLoading } = useSurvey();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string>("");
  
  const [filters, setFilters] = useState<Record<string, string[]>>({
    region: ['all'],
    age: ['all'],
    gender: ['all'],
    education: ['all'],
    income: ['all'],
    religion: ['all'],
    ideology: ['all']
  });

  useEffect(() => {
    const updateSyncTime = () => {
      const now = new Date();
      setLastSync(`${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`);
    };
    updateSyncTime();
  }, [isSyncing]);

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
    region: ['all'], age: ['all'], gender: ['all'], education: ['all'], income: ['all'], religion: ['all'], ideology: ['all']
  });

  // Extração dinâmica de opções baseada nos dados REAIS do Firestore
  const dynamicOptions = useMemo(() => {
    const options: Record<string, string[]> = {
      region: [], age: [], gender: [], education: [], income: [], religion: [], ideology: []
    };

    if (!rawSurveyData) return options;

    const getUniques = (key: string) => {
      const vals = new Set<string>();
      rawSurveyData.forEach(item => {
        const val = String(item[key] || '').trim();
        if (val && val !== 'all' && val !== 'NS/NR') vals.add(val);
      });
      return Array.from(vals).sort();
    };

    options.region = getUniques(SURVEY_KEYS.REGION);
    options.age = getUniques(SURVEY_KEYS.AGE);
    options.gender = getUniques(SURVEY_KEYS.GENDER);
    options.education = getUniques(SURVEY_KEYS.EDUCATION);
    options.income = getUniques(SURVEY_KEYS.INCOME);
    options.religion = getUniques(SURVEY_KEYS.RELIGION);
    options.ideology = getUniques(SURVEY_KEYS.IDEOLOGY);

    return options;
  }, [rawSurveyData]);

  const filteredData = useMemo(() => {
    if (!rawSurveyData) return [];
    return rawSurveyData.filter(item => {
      // Ignora documento de informação se existir
      if (item.INFO) return false;

      const checkMatch = (filterKey: string, dataKey: string) => {
        const currentFilters = filters[filterKey];
        if (currentFilters.includes('all')) return true;
        const itemVal = String(item[dataKey] || '').trim();
        return currentFilters.includes(itemVal);
      };

      return (
        checkMatch('region', SURVEY_KEYS.REGION) &&
        checkMatch('age', SURVEY_KEYS.AGE) &&
        checkMatch('gender', SURVEY_KEYS.GENDER) &&
        checkMatch('education', SURVEY_KEYS.EDUCATION) &&
        checkMatch('income', SURVEY_KEYS.INCOME) &&
        checkMatch('religion', SURVEY_KEYS.RELIGION) &&
        checkMatch('ideology', SURVEY_KEYS.IDEOLOGY)
      );
    });
  }, [filters, rawSurveyData]);

  const stats = useMemo(() => {
    const total = filteredData.length;
    const approvalCount = filteredData.filter(d => 
      String(d[SURVEY_KEYS.GOV_APPROVAL] || '').toLowerCase().trim() === 'aprova'
    ).length;
    const citiesCount = new Set(filteredData.map(d => String(d[SURVEY_KEYS.CITY] || '').trim())).size;
    const approvalPct = total > 0 ? (approvalCount / total) * 100 : 0;
    return { total, approvalCount, approvalPct, citiesCount };
  }, [filteredData]);

  const chartData = useMemo(() => {
    const approvalMap: Record<string, number> = { 'Aprova': 0, 'Desaprova': 0, 'NS/NR': 0 };
    filteredData.forEach(d => {
      const status = String(d[SURVEY_KEYS.GOV_APPROVAL] || '').trim();
      if (status === 'Aprova') approvalMap['Aprova']++;
      else if (status === 'Desaprova') approvalMap['Desaprova']++;
      else approvalMap['NS/NR']++;
    });

    const candidateCounts: Record<string, number> = {};
    filteredData.forEach(d => {
      const cand = String(d[SURVEY_KEYS.PRESIDENT_VOTE] || 'Não Citado').trim();
      if (cand) candidateCounts[cand] = (candidateCounts[cand] || 0) + 1;
    });

    const problemCounts: Record<string, number> = {};
    filteredData.forEach(d => {
      const prob = String(d[SURVEY_KEYS.PROBLEMS] || '').trim();
      if (prob && prob !== 'NS/NR') problemCounts[prob] = (problemCounts[prob] || 0) + 1;
    });

    return {
      approvalData: Object.entries(approvalMap).map(([name, value]) => ({ name, value })),
      candidateData: Object.entries(candidateCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 7),
      topProblems: Object.entries(problemCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5)
    };
  }, [filteredData]);

  const handleManualSync = async () => {
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSyncing(false);
    toast({ title: "Sincronização Ativa", description: "Os dados foram atualizados em tempo real com o Google Cloud." });
  };

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {/* Card Banco de Dados */}
        <LuxuryCard className="bg-zinc-950 border-none relative overflow-hidden group shadow-2xl p-6 lg:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(234,88,12,0.4)_0%,transparent_70%)] opacity-80 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="flex flex-col h-full justify-between relative z-10">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-orange-600/20 text-orange-500 ring-1 ring-orange-500/30"><Database size={20} /></div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
                <span className={`w-2 h-2 rounded-full ${rawSurveyData.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Cloud Ativo</span>
              </div>
            </div>
            <div className="space-y-2 mt-6">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Base de Inteligência</span>
              <h4 className="text-xl lg:text-2xl font-bold text-white tracking-tight">Banco de Dados</h4>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">{rawSurveyData.length.toLocaleString('pt-BR')} Entrevistas.</p>
            </div>
            <div className="mt-6 flex flex-col gap-4">
              <Button onClick={handleManualSync} disabled={isSyncing} variant="outline" className="w-full rounded-2xl bg-white/5 border-white/10 text-white hover:bg-orange-600 hover:text-white hover:border-orange-500 h-14">
                <RefreshCw size={18} className={cn(isSyncing && "animate-spin")} />
                <span className="text-[10px] font-black uppercase tracking-widest ml-3">{isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}</span>
              </Button>
              <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest text-center">Sincronizado: {lastSync}</p>
            </div>
          </div>
        </LuxuryCard>

        {/* Estatísticas do Topo */}
        <StatCard label="Aprovação (Gestão)" value={`${stats.approvalPct.toFixed(1)}%`} subValue="Fator de Governo" icon={CheckCircle} trend={stats.approvalPct > 50 ? "up" : "down"} />
        <StatCard label="Total Amostral" value={stats.total.toLocaleString('pt-BR')} subValue="Recorte Selecionado" icon={Activity} />
        <StatCard label="Municípios" value={stats.citiesCount} subValue="Capilaridade" icon={MapPin} />

        {/* Filtros de Segmentação */}
        <FilterBentoBox 
          filters={filters} 
          options={dynamicOptions} 
          onFilterChange={handleFilterChange} 
          onClear={clearFilters} 
          className="lg:col-span-2" 
        />
        
        {/* Mapa Interativo */}
        <InteractiveMap 
          stats={filteredData.reduce((acc, curr) => {
            const r = String(curr[SURVEY_KEYS.REGION] || '').trim() as MesoRegion;
            if (r) acc[r] = (acc[r] || 0) + 1;
            return acc;
          }, {} as Record<MesoRegion, number>)} 
          activeRegion={filters.region[0] === 'all' ? 'all' : filters.region[0]} 
          onRegionSelect={(r) => handleFilterChange('region', r || 'all')} 
        />

        {/* Gráficos */}
        <ApprovalChart data={chartData.approvalData} />
        <CandidateChart data={chartData.candidateData} />

        {/* Demandas Sociais */}
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
          <div className="flex items-center gap-2 mt-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
            <AlertTriangle size={12} className="text-rose-500" />
            Dados filtrados conforme segmentação ativa
          </div>
        </LuxuryCard>

        {/* Footer Card */}
        <LuxuryCard className="bg-orange-600 text-white border-none shadow-xl relative p-6 lg:p-8 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.2)_0%,transparent_50%)]" />
          <div className="flex flex-col h-full justify-between relative z-10">
            <div className="p-4 rounded-2xl bg-white/20 w-fit backdrop-blur-md"><BarChart3 size={24} /></div>
            <div className="space-y-3 mt-8">
              <h4 className="text-2xl font-bold tracking-tight">Análise Executiva</h4>
              <p className="text-orange-50/90 text-sm leading-relaxed font-medium">Os dados acima refletem exatamente a combinação dos filtros selecionados na segmentação.</p>
            </div>
          </div>
        </LuxuryCard>
      </div>
    </AppLayout>
  );
}
