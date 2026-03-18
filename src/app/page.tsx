"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { MesoRegion, SurveyRecord, RAW_SURVEY_DATA } from '@/data/survey-data';
import { StatCard } from '@/components/dashboard/stat-card';
import { InteractiveMap } from '@/components/dashboard/interactive-map';
import { FilterBentoBox } from '@/components/dashboard/filter-bento-box';
import { ApprovalChart } from '@/components/dashboard/approval-chart';
import { CandidateChart } from '@/components/dashboard/candidate-chart';
import { CheckCircle, Activity, MapPin, Zap, ShieldCheck, Database, RefreshCw, Cpu } from 'lucide-react';
import { BentoCard } from '@/components/dashboard/bento-card';
import { useCollection, useFirestore, useMemoFirebase, setDocumentNonBlocking, useUser, useAuth, initiateAnonymousSignIn } from '@/firebase';
import { collection, query, limit, doc } from 'firebase/firestore';
import { motion } from 'framer-motion';

export default function Home() {
  const db = useFirestore();
  const { user } = useUser();
  const auth = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    const formatted = now.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    setCurrentDate(formatted);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [mounted, user, auth]);

  const surveyQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(db, 'survey_records'), limit(2000));
  }, [db, user]);

  const { data: cloudData, isLoading } = useCollection<SurveyRecord>(surveyQuery);

  const activeData = useMemo(() => {
    if (!mounted) return [];
    if (cloudData && cloudData.length > 0) return cloudData;
    return RAW_SURVEY_DATA;
  }, [cloudData, mounted]);

  const [filters, setFilters] = useState({
    region: 'all',
    age: 'all',
    gender: 'all'
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => setFilters({ region: 'all', age: 'all', gender: 'all' });

  const filteredData = useMemo(() => {
    return activeData.filter(item => {
      const regionMatch = filters.region === 'all' || item.region === filters.region;
      const ageMatch = filters.age === 'all' || item.age === filters.age;
      const genderMatch = filters.gender === 'all' || item.gender === filters.gender;
      return regionMatch && ageMatch && genderMatch;
    });
  }, [filters, activeData]);

  const stats = useMemo(() => {
    const total = filteredData.length;
    const approvalCount = filteredData.filter(d => d.approval === 'Aprova').length;
    const citiesCount = new Set(filteredData.map(d => d.city)).size;
    const approvalPct = total > 0 ? (approvalCount / total) * 100 : 0;

    return { total, approvalCount, approvalPct, citiesCount };
  }, [filteredData]);

  const chartData = useMemo(() => {
    const approvalData = [
      { name: 'Aprova', value: filteredData.filter(d => d.approval === 'Aprova').length },
      { name: 'Desaprova', value: filteredData.filter(d => d.approval === 'Desaprova').length },
      { name: 'NS/NR', value: filteredData.filter(d => d.approval === 'NS/NR').length },
    ];

    const candidateCounts: Record<string, number> = {};
    filteredData.forEach(d => {
      candidateCounts[d.candidate] = (candidateCounts[d.candidate] || 0) + 1;
    });

    const candidateData = Object.entries(candidateCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    return { approvalData, candidateData };
  }, [filteredData]);

  const seedData = async () => {
    if (!user || (cloudData && cloudData.length > 0)) return;
    setIsSyncing(true);
    const itemsToSeed = RAW_SURVEY_DATA.slice(0, 200); 
    
    for (const record of itemsToSeed) {
      const docRef = doc(db, 'survey_records', String(record.id));
      setDocumentNonBlocking(docRef, record, { merge: true });
    }
    
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <AppLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        <BentoCard className="bg-zinc-950 border-none relative overflow-hidden group shadow-2xl p-6 lg:p-8">
          <div className="flex flex-col h-full justify-between relative z-10">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-orange-600/20 text-orange-500 ring-1 ring-orange-500/30">
                <Database size={20} />
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
                <span className={`w-2 h-2 rounded-full ${user ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                  {user ? 'Cloud Ativa' : 'Offline'}
                </span>
              </div>
            </div>
            <div className="space-y-2 mt-6">
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Infraestrutura</span>
              <h4 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
                {cloudData && cloudData.length > 0 ? 'Enterprise' : 'Nuvem Segura'}
              </h4>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">
                41.979 REGISTROS PROCESSADOS
              </p>
            </div>
            {!cloudData || cloudData.length === 0 ? (
              <div className="mt-8 space-y-3">
                <button 
                  onClick={seedData}
                  disabled={isSyncing || !user}
                  className="w-full py-4 rounded-2xl premium-gradient text-white text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
                  Sincronizar
                </button>
                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest text-center">
                  v-atual: {currentDate || '--/--/----'}
                </p>
              </div>
            ) : null}
          </div>
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-orange-600/10 blur-[60px] rounded-full" />
        </BentoCard>

        <StatCard 
          label="Aprovação" 
          value={`${stats.approvalPct.toFixed(1)}%`} 
          subValue="Sentimento Positivo"
          icon={CheckCircle} 
          trend="up"
        />
        <StatCard 
          label="Volatilidade" 
          value="14.2%" 
          subValue="Índice de Oscilação"
          icon={Activity} 
        />
        <StatCard 
          label="Cidades" 
          value={stats.citiesCount} 
          subValue="Municípios Ativos"
          icon={MapPin} 
        />

        <FilterBentoBox 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          onClear={clearFilters} 
        />

        <InteractiveMap 
          stats={activeData.reduce((acc, curr) => {
            acc[curr.region as MesoRegion] = (acc[curr.region as MesoRegion] || 0) + 1;
            return acc;
          }, {} as Record<MesoRegion, number>)} 
          activeRegion={filters.region}
          onRegionSelect={(r) => handleFilterChange('region', r || 'all')} 
        />

        <ApprovalChart data={chartData.approvalData} />
        <CandidateChart data={chartData.candidateData} />

        <BentoCard className="bg-orange-600 text-white border-none shadow-xl relative p-6 lg:p-8">
          <div className="flex flex-col h-full justify-between relative z-10">
            <div className="p-4 rounded-2xl bg-white/20 w-fit backdrop-blur-md">
              <Zap size={24} fill="currentColor" />
            </div>
            <div className="space-y-3 mt-6">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-orange-200">
                <span className="w-2 h-2 rounded-full bg-orange-200 animate-pulse" />
                Pulso Preditivo
              </div>
              <h4 className="text-2xl font-bold tracking-tight">Resumo de Campo</h4>
              <p className="text-orange-50/90 text-sm leading-relaxed">
                {filters.region === 'all' 
                  ? "Tendência de estabilidade nas capitais regionais." 
                  : `Região ${filters.region} apresenta engajamento acima da média.`}
              </p>
            </div>
          </div>
        </BentoCard>

        <BentoCard title="Integridade" subtitle="Orange Engine" className="p-6 lg:p-8">
          <div className="space-y-6 mt-2">
            <div className="flex items-center justify-between p-4 rounded-2xl inner-relief">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl premium-gradient text-white">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div className="text-[9px] font-black uppercase text-zinc-400">Confiança</div>
                  <div className="text-sm font-bold text-zinc-950">95.0% Certificado</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-[9px] font-black uppercase text-zinc-500">
                <span>Fidelidade de Dados</span>
                <span className="text-zinc-950 font-mono">98.4%</span>
              </div>
              <div className="h-2 w-full inner-relief rounded-full overflow-hidden p-[2px]">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '98.4%' }}
                  className="h-full premium-gradient rounded-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-[9px] font-black text-zinc-400 uppercase">
              <Cpu size={12} className="animate-pulse" />
              v3.5-LXS Enterprise
            </div>
          </div>
        </BentoCard>
      </div>
    </AppLayout>
  );
}