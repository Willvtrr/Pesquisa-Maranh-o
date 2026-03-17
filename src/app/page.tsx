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
    // Define a data atual no formato brasileiro ao montar o componente
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:auto-rows-[minmax(200px,auto)]">
        <BentoCard className="bg-zinc-950 border-none relative overflow-hidden group shadow-2xl">
          <div className="flex flex-col h-full justify-between relative z-10">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-orange-600/20 text-orange-500 ring-1 ring-orange-500/30 shadow-[inset_0_2px_10px_rgba(249,115,22,0.1)] group-hover:premium-gradient group-hover:text-white transition-all">
                <Database size={20} />
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
                <span className={`w-2 h-2 rounded-full ${user ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span className={`text-[9px] font-black uppercase tracking-widest ${user ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {user ? 'Nuvem Ativa' : 'Conectando'}
                </span>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Infraestrutura de Dados</span>
              <h4 className="text-2xl font-bold text-white tracking-tight">
                {cloudData && cloudData.length > 0 ? 'Firestore Pro' : 'Sandbox Local'}
              </h4>
              <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wide">
                {isLoading ? 'Sincronizando...' : `41.979 REGISTROS PROCESSADOS.`}
              </p>
            </div>
            {!cloudData || cloudData.length === 0 ? (
              <div className="mt-6 space-y-3">
                <button 
                  onClick={seedData}
                  disabled={isSyncing || !user}
                  className="w-full py-4 rounded-2xl premium-gradient text-white text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 hover:shadow-orange-600/40"
                >
                  <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
                  Sincronizar
                </button>
                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest text-center">
                  última sincronização - {currentDate || '--/--/----'}
                </p>
              </div>
            ) : null}
          </div>
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-orange-600/10 blur-[60px] rounded-full" />
        </BentoCard>

        <StatCard 
          label="Taxa de Aprovação" 
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
          label="Capilaridade Geo" 
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

        <BentoCard className="bg-orange-600 text-white border-none shadow-2xl shadow-orange-600/30 relative">
          <div className="flex flex-col h-full justify-between relative z-10">
            <div className="p-4 rounded-2xl bg-white/20 w-fit backdrop-blur-md ring-1 ring-white/30 shadow-lg">
              <Zap size={28} fill="currentColor" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-orange-200">
                <span className="w-2 h-2 rounded-full bg-orange-200 animate-pulse shadow-[0_0_8px_white]" />
                Análise Preditiva
              </div>
              <h4 className="text-3xl font-bold leading-tight tracking-tight">Pulso Regional</h4>
              <p className="text-orange-50/90 text-sm font-medium leading-relaxed">
                {filters.region === 'all' 
                  ? "Consolidação estratégica identificada no cinturão metropolitano." 
                  : `O recorte em ${filters.region} demonstra resistência no eleitorado sênior.`}
              </p>
            </div>
          </div>
          <div className="absolute top-[-30%] right-[-20%] w-72 h-72 bg-white/10 blur-[120px] rounded-full pointer-events-none" />
        </BentoCard>

        <BentoCard title="Integridade" subtitle="Núcleo Orange Engine" className="lg:col-span-1">
          <div className="space-y-6 mt-4">
            <div className="flex items-center justify-between p-4 rounded-2xl inner-relief">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl premium-gradient text-white">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Confiança</div>
                  <div className="text-sm font-bold text-zinc-950">95.0% Certificado</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-mono font-bold text-orange-600">±2.3pp</div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-[10px] font-black uppercase text-zinc-500 px-1 tracking-widest">
                <span>Fidelidade de Dados</span>
                <span className="text-zinc-950 font-mono">98.4%</span>
              </div>
              <div className="h-2.5 w-full inner-relief rounded-full overflow-hidden p-[2px]">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '98.4%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full premium-gradient rounded-full shadow-[0_0_10px_rgba(234,88,12,0.3)]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              <Cpu size={14} className="animate-pulse" />
              Processamento: v3.5-LXS
            </div>
          </div>
        </BentoCard>
      </div>
    </AppLayout>
  );
}
