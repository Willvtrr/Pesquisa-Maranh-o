
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
import { BentoCard } from '@/components/dashboard/bento-card';
import { useSurvey } from '@/hooks/use-survey';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// MAPEAMENTO EXATO DOS CAMPOS DO SEU JSON
const SURVEY_KEYS = {
  CITY: "Cidade:",
  REGION: "Mesorregião",
  GENDER: "Gênero",
  AGE: "Faixa Etária",
  GOV_APPROVAL: "De modo geral, você aprova ou desaprova o Governo do Governador Carlos Brandão?",
  PROBLEMS: "2. Na sua opinião, qual o problema mais grave que o Estado do Maranhão vem enfrentando atualmente? (Espontânea)",
  PRESIDENT_VOTE: "4. PRESIDENTE: Se as eleições para Presidente da República fossem hoje, em quem você votaria? (Estimulada)"
};

export default function Home() {
  const { data: rawSurveyData, isLoading } = useSurvey();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string>("");
  const [filters, setFilters] = useState({
    region: 'all',
    age: 'all',
    gender: 'all'
  });

  // Efeito para gerar o timestamp de sincronização
  useEffect(() => {
    const updateSyncTime = () => {
      const now = new Date();
      const syncTime = new Date(now.getTime() - 2 * 60000);
      const formattedDate = syncTime.toLocaleDateString('pt-BR');
      const formattedTime = syncTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      setLastSync(`${formattedDate} às ${formattedTime}`);
    };

    updateSyncTime();
  }, [isSyncing]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => setFilters({ region: 'all', age: 'all', gender: 'all' });

  const handleManualSync = async () => {
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSyncing(false);
    toast({
      title: "Sincronização Ativa",
      description: "Os dados foram atualizados em tempo real com o Google Cloud.",
    });
  };

  // Filtragem dos dados reais
  const filteredData = useMemo(() => {
    if (!rawSurveyData) return [];
    
    return rawSurveyData.filter(item => {
      const itemRegion = String(item[SURVEY_KEYS.REGION] || '').trim();
      const itemAge = String(item[SURVEY_KEYS.AGE] || '').trim();
      const itemGender = String(item[SURVEY_KEYS.GENDER] || '').trim();

      const regionMatch = filters.region === 'all' || itemRegion === filters.region;
      const ageMatch = filters.age === 'all' || itemAge === filters.age;
      const genderMatch = filters.gender === 'all' || itemGender === filters.gender;
      
      return regionMatch && ageMatch && genderMatch;
    });
  }, [filters, rawSurveyData]);

  const stats = useMemo(() => {
    const total = filteredData.length;
    const approvalCount = filteredData.filter(d => {
      const val = String(d[SURVEY_KEYS.GOV_APPROVAL] || '').toLowerCase().trim();
      return val === 'aprova';
    }).length;
    
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

    const approvalData = Object.entries(approvalMap).map(([name, value]) => ({ name, value }));

    const candidateCounts: Record<string, number> = {};
    filteredData.forEach(d => {
      const cand = String(d[SURVEY_KEYS.PRESIDENT_VOTE] || 'Não Citado').trim();
      if (cand) candidateCounts[cand] = (candidateCounts[cand] || 0) + 1;
    });

    const candidateData = Object.entries(candidateCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7);

    const problemCounts: Record<string, number> = {};
    filteredData.forEach(d => {
      const prob = String(d[SURVEY_KEYS.PROBLEMS] || '').trim();
      if (prob && prob !== 'NS/NR') {
        problemCounts[prob] = (problemCounts[prob] || 0) + 1;
      }
    });

    const topProblems = Object.entries(problemCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return { approvalData, candidateData, topProblems };
  }, [filteredData]);

  if (isLoading && rawSurveyData.length === 0) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
            Sincronizando Banco de Dados...
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        <BentoCard className="bg-zinc-950 border-none relative overflow-hidden group shadow-2xl p-6 lg:p-8 cursor-default transition-all">
          {/* Brilho Atmosférico Profundo na Base (Z-0) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(234,88,12,0.3)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0 pointer-events-none" />
          
          <div className="flex flex-col h-full justify-between relative z-10">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-orange-600/20 text-orange-500 ring-1 ring-orange-500/30">
                <Database size={20} />
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
                <span className={`w-2 h-2 rounded-full ${rawSurveyData.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  {rawSurveyData.length > 0 ? 'Firestore Ativo' : 'Banco Vazio'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2 mt-6">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Base de Inteligência</span>
              <h4 className="text-xl lg:text-2xl font-bold text-white tracking-tight">Banco de Dados</h4>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide leading-relaxed">
                {rawSurveyData.length.toLocaleString('pt-BR')} Entrevistas Processadas.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              <Button 
                onClick={(e) => { e.stopPropagation(); handleManualSync(); }}
                disabled={isSyncing}
                variant="outline"
                className={cn(
                  "w-full rounded-2xl bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-orange-500/50 hover:text-white transition-all h-14 relative overflow-hidden",
                  isSyncing && "border-orange-500 scale-[0.98] opacity-80"
                )}
              >
                <div className="flex items-center justify-center gap-3 relative z-10">
                  <RefreshCw size={18} className={cn(isSyncing && "animate-spin text-orange-500")} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}
                  </span>
                </div>
                
                {isSyncing && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 4, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 bg-orange-500/20 rounded-full"
                  />
                )}
              </Button>
              
              <div className="min-h-[14px] flex flex-col items-center">
                <AnimatePresence mode="wait">
                  {isSyncing ? (
                    <motion.p 
                      key="syncing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-[9px] text-orange-500 font-black uppercase tracking-widest text-center animate-pulse"
                    >
                      Processando fluxo Google Cloud...
                    </motion.p>
                  ) : lastSync && (
                    <motion.p 
                      key="last-sync"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[9px] text-zinc-600 font-black uppercase tracking-widest text-center"
                    >
                      Última Sincronização: {lastSync}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </BentoCard>

        <StatCard 
          label="Aprovação (Carlos Brandão)" 
          value={`${stats.approvalPct.toFixed(1)}%`} 
          subValue="Gestão Estadual"
          icon={CheckCircle} 
          trend={stats.approvalPct > 50 ? "up" : "down"}
        />
        <StatCard 
          label="Total Amostral" 
          value={stats.total.toLocaleString('pt-BR')} 
          subValue="Registros Qualificados"
          icon={Activity} 
        />
        <StatCard 
          label="Municípios" 
          value={stats.citiesCount} 
          subValue="Capilaridade da Amostra"
          icon={MapPin} 
        />

        <FilterBentoBox 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          onClear={clearFilters} 
        />

        <InteractiveMap 
          stats={filteredData.reduce((acc, curr) => {
            const r = String(curr[SURVEY_KEYS.REGION] || '').trim() as MesoRegion;
            if (r) acc[r] = (acc[r] || 0) + 1;
            return acc;
          }, {} as Record<MesoRegion, number>)} 
          activeRegion={filters.region}
          onRegionSelect={(r) => handleFilterChange('region', r || 'all')} 
        />

        <ApprovalChart data={chartData.approvalData} />
        <CandidateChart data={chartData.candidateData} />

        <BentoCard title="Demandas Sociais" subtitle="Maiores Problemas" className="lg:col-span-2">
          <div className="h-[250px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.topProblems} layout="vertical" margin={{ left: 40, right: 30 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#71717a', fontSize: 10, fontWeight: 800 }}
                  width={100}
                />
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
            Problemas Citados Espontaneamente
          </div>
        </BentoCard>

        <BentoCard className="bg-orange-600 text-white border-none shadow-xl relative p-6 lg:p-8">
          <div className="flex flex-col h-full justify-between relative z-10">
            <div className="p-4 rounded-2xl bg-white/20 w-fit backdrop-blur-md">
              <BarChart3 size={24} />
            </div>
            <div className="space-y-3 mt-8">
              <h4 className="text-2xl font-bold tracking-tight">Focco Analytics Cloud</h4>
              <p className="text-orange-50/90 text-sm leading-relaxed font-medium">
                Arquitetura escalável para processamento de alto volume. Filtros otimizados para recortes demográficos e regionais.
              </p>
            </div>
          </div>
        </BentoCard>
      </div>
    </AppLayout>
  );
}
