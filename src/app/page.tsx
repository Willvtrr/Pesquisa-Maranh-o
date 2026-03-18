"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { MesoRegion } from '@/data/survey-data';
import { StatCard } from '@/components/dashboard/stat-card';
import { InteractiveMap } from '@/components/dashboard/interactive-map';
import { FilterBentoBox } from '@/components/dashboard/filter-bento-box';
import { ApprovalChart } from '@/components/dashboard/approval-chart';
import { CandidateChart } from '@/components/dashboard/candidate-chart';
import { CheckCircle, Activity, MapPin, Zap, ShieldCheck, Database, RefreshCw, Cpu, BrainCircuit } from 'lucide-react';
import { BentoCard } from '@/components/dashboard/bento-card';
import { useUser, useAuth, initiateAnonymousSignIn } from '@/firebase';
import { useSurvey } from '@/hooks/use-survey';
import { motion, AnimatePresence } from 'framer-motion';

// Mapeamento das chaves do seu JSON para facilitar o acesso
const SURVEY_KEYS = {
  GENDER: "Sexo:",
  AGE: "Faixa Etária:",
  REGION: "Mesorregião:",
  CITY: "Cidade:",
  APPROVAL: "1. APROVAÇÃO:",
  PRESIDENT: "4. PRESIDENTE:"
};

export default function Home() {
  const { data: rawSurveyData } = useSurvey();
  const { user } = useUser();
  const auth = useAuth();
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [filters, setFilters] = useState({
    region: 'all',
    age: 'all',
    gender: 'all'
  });

  useEffect(() => {
    setMounted(true);
    setCurrentDate(new Date().toLocaleDateString('pt-BR'));
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [mounted, user, auth]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => setFilters({ region: 'all', age: 'all', gender: 'all' });

  // Filtragem dos dados reais do JSON
  const filteredData = useMemo(() => {
    if (!rawSurveyData || rawSurveyData.length === 0) return [];
    
    return rawSurveyData.filter(item => {
      // Ignora objetos de metadados se existirem
      if (item.INFO) return false;

      const regionMatch = filters.region === 'all' || item[SURVEY_KEYS.REGION] === filters.region;
      const ageMatch = filters.age === 'all' || item[SURVEY_KEYS.AGE] === filters.age;
      const genderMatch = filters.gender === 'all' || item[SURVEY_KEYS.GENDER] === filters.gender;
      
      return regionMatch && ageMatch && genderMatch;
    });
  }, [filters, rawSurveyData]);

  const stats = useMemo(() => {
    const total = filteredData.length;
    const approvalCount = filteredData.filter(d => d[SURVEY_KEYS.APPROVAL]?.includes('Aprova')).length;
    const citiesCount = new Set(filteredData.map(d => d[SURVEY_KEYS.CITY])).size;
    const approvalPct = total > 0 ? (approvalCount / total) * 100 : 0;

    return { total, approvalCount, approvalPct, citiesCount };
  }, [filteredData]);

  const chartData = useMemo(() => {
    const approvalData = [
      { name: 'Aprova', value: filteredData.filter(d => d[SURVEY_KEYS.APPROVAL]?.includes('Aprova')).length },
      { name: 'Desaprova', value: filteredData.filter(d => d[SURVEY_KEYS.APPROVAL]?.includes('Desaprova')).length },
      { name: 'NS/NR', value: filteredData.filter(d => d[SURVEY_KEYS.APPROVAL]?.includes('NS/NR') || !d[SURVEY_KEYS.APPROVAL]).length },
    ];

    const candidateCounts: Record<string, number> = {};
    filteredData.forEach(d => {
      const cand = d[SURVEY_KEYS.PRESIDENT] || 'Indeciso';
      candidateCounts[cand] = (candidateCounts[cand] || 0) + 1;
    });

    const candidateData = Object.entries(candidateCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    return { approvalData, candidateData };
  }, [filteredData]);

  return (
    <AppLayout>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        <BentoCard className="bg-zinc-950 border-none relative overflow-hidden group shadow-2xl p-6 lg:p-8">
          <div className="flex flex-col h-full justify-between relative z-10">
            <div className="flex items-center justify-between">
              <div className="p-2.5 sm:p-3 rounded-2xl bg-orange-600/20 text-orange-500 ring-1 ring-orange-500/30">
                <Database size={18} className="sm:size-5" />
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800">
                <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${rawSurveyData?.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-400">
                  {rawSurveyData?.length > 0 ? 'Dados Ativos' : 'Aguardando JSON'}
                </span>
              </div>
            </div>
            <div className="space-y-1.5 sm:space-y-2 mt-4 sm:mt-6">
              <span className="text-[8px] sm:text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Infraestrutura</span>
              <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-tight">
                Nuvem Criptografada
              </h4>
              <p className="text-[9px] sm:text-[10px] text-zinc-500 font-bold uppercase tracking-wide">
                {rawSurveyData?.length || 0} REGISTROS EM MEMÓRIA
              </p>
            </div>
            <div className="mt-6 sm:mt-8">
               <p className="text-[8px] sm:text-[9px] text-zinc-600 font-bold uppercase tracking-widest text-center">
                  v-atual: {currentDate || '--/--/----'}
                </p>
            </div>
          </div>
          <div className="absolute -bottom-16 -right-16 w-32 h-32 sm:w-48 sm:h-48 bg-orange-600/10 blur-[60px] rounded-full" />
        </BentoCard>

        <StatCard 
          label="Aprovação" 
          value={`${stats.approvalPct.toFixed(1)}%`} 
          subValue="Sentimento Real"
          icon={CheckCircle} 
          trend={stats.approvalPct > 50 ? "up" : "down"}
        />
        <StatCard 
          label="Amostragem" 
          value={stats.total} 
          subValue="Entrevistas Filtradas"
          icon={Activity} 
        />
        <StatCard 
          label="Cidades" 
          value={stats.citiesCount} 
          subValue="Municípios na Base"
          icon={MapPin} 
        />

        <FilterBentoBox 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          onClear={clearFilters} 
        />

        <InteractiveMap 
          stats={filteredData.reduce((acc, curr) => {
            const r = curr[SURVEY_KEYS.REGION] as MesoRegion;
            if (r) acc[r] = (acc[r] || 0) + 1;
            return acc;
          }, {} as Record<MesoRegion, number>)} 
          activeRegion={filters.region}
          onRegionSelect={(r) => handleFilterChange('region', r || 'all')} 
        />

        <ApprovalChart data={chartData.approvalData} />
        <CandidateChart data={chartData.candidateData} />

        <BentoCard className="bg-orange-600 text-white border-none shadow-xl relative p-6 lg:p-8">
          <div className="flex flex-col h-full justify-between relative z-10">
            <div className="p-3 sm:p-4 rounded-2xl bg-white/20 w-fit backdrop-blur-md">
              <BrainCircuit size={20} className="sm:size-6" fill="currentColor" />
            </div>
            <div className="space-y-2 sm:space-y-3 mt-4 sm:mt-6">
              <div className="flex items-center gap-2 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-orange-200">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-orange-200 animate-pulse" />
                IA Analítica Ativa
              </div>
              <h4 className="text-xl sm:text-2xl font-bold tracking-tight">Insights de IA</h4>
              <p className="text-orange-50/90 text-xs sm:text-sm leading-relaxed">
                {rawSurveyData?.length > 0 
                  ? "Analise as tendências agora com o motor de inteligência estratégica." 
                  : "Aguardando importação de dados para análise preditiva."}
              </p>
            </div>
          </div>
        </BentoCard>

        <BentoCard title="Integridade" subtitle="Focco Engine" className="p-6 lg:p-8">
          <div className="space-y-4 sm:space-y-6 mt-1 sm:mt-2">
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-2xl inner-relief">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="p-2 sm:p-2.5 rounded-xl premium-gradient text-white">
                  <ShieldCheck size={16} className="sm:size-[18px]" />
                </div>
                <div>
                  <div className="text-[8px] sm:text-[9px] font-black uppercase text-zinc-400">Protocolo</div>
                  <div className="text-xs sm:text-sm font-bold text-zinc-950">Segurança Máxima</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex justify-between text-[8px] sm:text-[9px] font-black uppercase text-zinc-500">
                <span>Processamento JSON</span>
                <span className="text-zinc-950 font-mono">100% OK</span>
              </div>
              <div className="h-1.5 sm:h-2 w-full inner-relief rounded-full overflow-hidden p-[1.5px] sm:p-[2px]">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  className="h-full premium-gradient rounded-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[9px] font-black text-zinc-400 uppercase">
              <Cpu size={10} className="sm:size-3 animate-pulse" />
              v3.5-LXS Enterprise
            </div>
          </div>
        </BentoCard>
      </div>
    </AppLayout>
  );
}
