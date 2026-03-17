
"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { MesoRegion, SurveyRecord, RAW_SURVEY_DATA } from '@/data/survey-data';
import { StatCard } from '@/components/dashboard/stat-card';
import { InteractiveMap } from '@/components/dashboard/interactive-map';
import { FilterBentoBox } from '@/components/dashboard/filter-bento-box';
import { ApprovalChart } from '@/components/dashboard/approval-chart';
import { CandidateChart } from '@/components/dashboard/candidate-chart';
import { CheckCircle, Activity, MapPin, Zap, ShieldCheck, Database, RefreshCw } from 'lucide-react';
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

  // Defer rendering of dynamic/random data until after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Automatically sign in anonymously to satisfy security rules
  useEffect(() => {
    if (mounted && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [mounted, user, auth]);

  // Firestore Collection - Only query if user is authenticated
  const surveyQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(db, 'survey_records'), limit(2000));
  }, [db, user]);

  const { data: cloudData, isLoading } = useCollection<SurveyRecord>(surveyQuery);

  // Fallback to static data if cloud is empty or loading for demonstration
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

  // Handle Seeding data to Firestore for initial setup
  const seedData = async () => {
    if (!user || (cloudData && cloudData.length > 0)) return;
    setIsSyncing(true);
    const itemsToSeed = RAW_SURVEY_DATA.slice(0, 200); 
    
    for (const record of itemsToSeed) {
      // Use setDocumentNonBlocking with a stable ID to satisfy integrity rules
      const docRef = doc(db, 'survey_records', String(record.id));
      setDocumentNonBlocking(docRef, record, { merge: true });
    }
    
    // Artificial delay for UX
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <AppLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:auto-rows-[minmax(180px,auto)]">
        {/* Real-time Status Card */}
        <BentoCard className="bg-zinc-900 border-none relative overflow-hidden group">
          <div className="flex flex-col h-full justify-between relative z-10">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-orange-600/20 text-orange-500 ring-1 ring-orange-500/30">
                <Database size={18} />
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${user ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${user ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {user ? 'Cloud Live' : 'Connecting...'}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Origem de Dados</span>
              <h4 className="text-xl font-bold text-white tracking-tight">
                {cloudData && cloudData.length > 0 ? 'Firestore DB' : 'Static Demo'}
              </h4>
              <p className="text-[10px] text-zinc-400 font-medium">
                {isLoading ? 'Sincronizando...' : `${activeData.length} registros ativos.`}
              </p>
            </div>
            {!cloudData || cloudData.length === 0 ? (
              <button 
                onClick={seedData}
                disabled={isSyncing || !user}
                className="mt-4 w-full py-2.5 rounded-xl bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-orange-500 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={12} className={isSyncing ? "animate-spin" : ""} />
                Sincronizar DB
              </button>
            ) : null}
          </div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-orange-600/5 blur-[50px] rounded-full" />
        </BentoCard>

        <StatCard 
          label="Aprovação" 
          value={`${stats.approvalPct.toFixed(1)}%`} 
          subValue="Sentimento positivo médio"
          icon={CheckCircle} 
          trend="up"
        />
        <StatCard 
          label="Volatilidade" 
          value="14.2%" 
          subValue="Índice de potencial troca"
          icon={Activity} 
        />
        <StatCard 
          label="Capilaridade" 
          value={stats.citiesCount} 
          subValue="Municípios ativos"
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

        {/* Intelligence Insight Bento */}
        <BentoCard className="bg-orange-600 text-white border-none shadow-2xl shadow-orange-600/30 group relative">
          <div className="flex flex-col h-full justify-between relative z-10">
            <div className="p-3 rounded-2xl bg-white/20 w-fit backdrop-blur-md ring-1 ring-white/30 group-hover:scale-110 transition-transform">
              <Zap size={24} fill="currentColor" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-orange-200">
                <span className="w-1 h-1 rounded-full bg-orange-200 animate-ping" />
                Live Analysis
              </div>
              <h4 className="text-2xl font-bold leading-tight tracking-tight">Tendência Regional</h4>
              <p className="text-orange-100/80 text-xs font-medium leading-relaxed">
                {filters.region === 'all' 
                  ? "Consolidação de liderança do Candidato A em áreas urbanas." 
                  : `Recorte ${filters.region} aponta alta indecisão no público jovem.`}
              </p>
            </div>
          </div>
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 blur-[100px] rounded-full pointer-events-none" />
        </BentoCard>

        {/* Quality Assurance Bento */}
        <BentoCard title="Qualidade" subtitle="Controle Orange Engine" className="lg:col-span-1">
          <div className="space-y-5 mt-2">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-emerald-500" />
                <div>
                  <div className="text-[9px] font-black uppercase text-zinc-400">Confiança</div>
                  <div className="text-xs font-bold text-zinc-900">95% Validada</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-mono font-bold text-orange-600">±2.3pp</div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[10px] font-black uppercase text-zinc-400 px-1">
                <span>Integridade de Dados</span>
                <span className="text-zinc-900">98.4%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '98.4%' }}
                  className="h-full bg-orange-600"
                />
              </div>
            </div>
          </div>
        </BentoCard>
      </div>
    </AppLayout>
  );
}
