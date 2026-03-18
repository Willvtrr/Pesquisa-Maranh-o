
"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { MesoRegion } from '@/data/survey-data';
import { StatCard } from '@/components/dashboard/stat-card';
import { InteractiveMap } from '@/components/dashboard/interactive-map';
import { FilterBentoBox } from '@/components/dashboard/filter-bento-box';
import { ApprovalChart } from '@/components/dashboard/approval-chart';
import { CandidateChart } from '@/components/dashboard/candidate-chart';
import { CheckCircle, Activity, MapPin, Database, Cpu, BarChart3, AlertTriangle } from 'lucide-react';
import { BentoCard } from '@/components/dashboard/bento-card';
import { useUser, useAuth, initiateAnonymousSignIn } from '@/firebase';
import { useSurvey } from '@/hooks/use-survey';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

// MAPEAMENTO EXATO DO SEU JSON REAL
const SURVEY_KEYS = {
  CITY: "Cidade:",
  REGION: "Mesorregião",
  GENDER: "Gênero",
  AGE: "Faixa Etária",
  GOV_APPROVAL: "De modo geral, você aprova ou desaprova o Governo do Governador Carlos Brandão?",
  PRES_APPROVAL: "De modo geral, você aprova ou desaprova o Governo do Presidente Lula?",
  PROBLEMS: "2. Na sua opinião, qual o problema mais grave que o Estado do Maranhão vem enfrentando atualmente? (Espontânea)",
  PRESIDENT_VOTE: "4. PRESIDENTE: Se as eleições para Presidente da República fossem hoje, em quem você votaria? (Estimulada)",
  GOVERNOR_VOTE: "8. Se os candidatos a Governador fossem estes, em quem você votaria? (Cenário 1)"
};

export default function Home() {
  const { data: rawSurveyData } = useSurvey();
  const { user } = useUser();
  const auth = useAuth();
  const [mounted, setMounted] = useState(false);
  
  const [filters, setFilters] = useState({
    region: 'all',
    age: 'all',
    gender: 'all'
  });

  useEffect(() => {
    setMounted(true);
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

  // Filtragem dos dados reais com limpeza de espaços
  const filteredData = useMemo(() => {
    if (!rawSurveyData || rawSurveyData.length === 0) return [];
    
    return rawSurveyData.filter(item => {
      // Ignora o objeto de INFO
      if (item.INFO) return false;

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
    // Processamento de Aprovação
    const approvalMap: Record<string, number> = { 'Aprova': 0, 'Desaprova': 0, 'NS/NR': 0 };
    filteredData.forEach(d => {
      const status = String(d[SURVEY_KEYS.GOV_APPROVAL] || '').trim();
      if (status === 'Aprova') approvalMap['Aprova']++;
      else if (status === 'Desaprova') approvalMap['Desaprova']++;
      else approvalMap['NS/NR']++;
    });

    const approvalData = Object.entries(approvalMap).map(([name, value]) => ({ name, value }));

    // Processamento de Candidatos (Presidente)
    const candidateCounts: Record<string, number> = {};
    filteredData.forEach(d => {
      const cand = String(d[SURVEY_KEYS.PRESIDENT_VOTE] || 'Não Citado').trim();
      if (cand) candidateCounts[cand] = (candidateCounts[cand] || 0) + 1;
    });

    const candidateData = Object.entries(candidateCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7);

    // Principais Problemas
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

  return (
    <AppLayout>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {/* Infraestrutura */}
        <BentoCard className="bg-zinc-950 border-none relative overflow-hidden group shadow-2xl p-6 lg:p-8">
          <div className="flex flex-col h-full justify-between relative z-10">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-orange-600/20 text-orange-500 ring-1 ring-orange-500/30">
                <Database size={20} />
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
                <span className={`w-2 h-2 rounded-full ${rawSurveyData?.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  {rawSurveyData?.length > 0 ? 'Dados Ativos' : 'Aguardando JSON'}
                </span>
              </div>
            </div>
            <div className="space-y-2 mt-6">
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Base de Inteligência</span>
              <h4 className="text-xl lg:text-2xl font-bold text-white tracking-tight">Motor Analítico</h4>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide leading-relaxed">
                {rawSurveyData?.filter(i => !i.INFO).length || 0} Entrevistas Carregadas no Sistema.
              </p>
            </div>
          </div>
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-orange-600/10 blur-[60px] rounded-full" />
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
          value={stats.total} 
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
              <h4 className="text-2xl font-bold tracking-tight">Focco Analytics</h4>
              <p className="text-orange-50/90 text-sm leading-relaxed font-medium">
                Monitoramento dinâmico do cenário eleitoral e administrativo. Filtragem reativa por região e perfil demográfico.
              </p>
            </div>
          </div>
        </BentoCard>
      </div>
    </AppLayout>
  );
}
