"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { RAW_SURVEY_DATA, MesoRegion, SurveyRecord } from '@/data/survey-data';
import { StatCard } from '@/components/dashboard/stat-card';
import { InteractiveMap } from '@/components/dashboard/interactive-map';
import { FilterBentoBox } from '@/components/dashboard/filter-bento-box';
import { ApprovalChart } from '@/components/dashboard/approval-chart';
import { CandidateChart } from '@/components/dashboard/candidate-chart';
import { Users, CheckCircle, Activity, MapPin, Zap, ShieldCheck } from 'lucide-react';
import { BentoCard } from '@/components/dashboard/bento-card';
import { motion } from 'framer-motion';

export default function Home() {
  const [surveyData, setSurveyData] = useState<SurveyRecord[]>([]);
  const [filters, setFilters] = useState({
    region: 'all',
    age: 'all',
    gender: 'all'
  });

  useEffect(() => {
    // Simulando carregamento de dados após hidratação
    setSurveyData(RAW_SURVEY_DATA);
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => setFilters({ region: 'all', age: 'all', gender: 'all' });

  const filteredData = useMemo(() => {
    return surveyData.filter(item => {
      const regionMatch = filters.region === 'all' || item.region === filters.region;
      const ageMatch = filters.age === 'all' || item.age === filters.age;
      const genderMatch = filters.gender === 'all' || item.gender === filters.gender;
      return regionMatch && ageMatch && genderMatch;
    });
  }, [filters, surveyData]);

  const stats = useMemo(() => {
    const total = filteredData.length;
    const approvalCount = filteredData.filter(d => d.approval === 'Aprova').length;
    const disapprovalCount = filteredData.filter(d => d.approval === 'Desaprova').length;
    const citiesCount = new Set(filteredData.map(d => d.city)).size;

    const approvalPct = total > 0 ? (approvalCount / total) * 100 : 0;
    const disapprovalPct = total > 0 ? (disapprovalCount / total) * 100 : 0;

    return { total, approvalCount, approvalPct, disapprovalCount, disapprovalPct, citiesCount };
  }, [filteredData]);

  const mapStats = useMemo(() => {
    const counts: Record<MesoRegion, number> = {
      Norte: 0, Sul: 0, Oeste: 0, Leste: 0, Centro: 0
    };
    filteredData.forEach(d => {
      counts[d.region as MesoRegion]++;
    });
    return counts;
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

  return (
    <AppLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:auto-rows-[minmax(200px,auto)]">
        {/* Bento Stats */}
        <StatCard 
          label="Amostra (N)" 
          value={stats.total.toLocaleString()} 
          subValue="Registros validados via Orange Engine"
          icon={Users} 
        />
        <StatCard 
          label="Aprovação de Governo" 
          value={`${stats.approvalPct.toFixed(1)}%`} 
          subValue="Variação positiva na última janela"
          icon={CheckCircle} 
          trend="up"
        />
        <StatCard 
          label="Volatilidade" 
          value="14.2%" 
          subValue="Índice de potencial troca de voto"
          icon={Activity} 
        />
        <StatCard 
          label="Capilaridade" 
          value={stats.citiesCount} 
          subValue="Municípios com dados ativos"
          icon={MapPin} 
        />

        {/* Filters Box - Spans 2 rows vertically */}
        <FilterBentoBox 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          onClear={clearFilters} 
        />

        {/* Map - Main Feature, spans 2 columns and 2 rows */}
        <InteractiveMap 
          stats={mapStats} 
          activeRegion={filters.region}
          onRegionSelect={(r) => handleFilterChange('region', r || 'all')} 
        />

        {/* Approval Chart */}
        <ApprovalChart data={chartData.approvalData} />

        {/* Candidate Chart - Spans 2 columns */}
        <CandidateChart data={chartData.candidateData} />

        {/* Insights Bento - Premium Visual */}
        <BentoCard className="bg-orange-600 text-white border-none shadow-2xl shadow-orange-600/30 group">
          <div className="flex flex-col h-full justify-between relative z-10">
            <div className="p-3 rounded-2xl bg-white/20 w-fit backdrop-blur-md ring-1 ring-white/30 group-hover:scale-110 transition-transform">
              <Zap size={24} fill="currentColor" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-orange-200">
                <span className="w-1 h-1 rounded-full bg-orange-200 animate-ping" />
                Live Insight
              </div>
              <h4 className="text-2xl font-bold leading-tight tracking-tight">Crescimento Orgânico</h4>
              <p className="text-orange-100/80 text-xs font-medium leading-relaxed">
                Cruzamento de dados aponta ascensão de 4.1% no setor Leste impulsionada pelo público 16-24.
              </p>
            </div>
          </div>
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 blur-[100px] rounded-full pointer-events-none" />
        </BentoCard>

        {/* Technical Validation Bento */}
        <BentoCard title="Validação" subtitle="Controle de Qualidade" className="lg:col-span-1">
          <div className="space-y-6 mt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase text-zinc-400">Status</div>
                  <div className="text-xs font-bold text-zinc-900">Nível Confiança 95%</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black uppercase text-zinc-400">Margem</div>
                <div className="text-xs font-mono font-bold text-orange-600">±2.3pp</div>
              </div>
            </div>
            <div className="pt-4 border-t border-zinc-100 flex gap-4">
              <div className="flex-1 p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                <span className="text-[8px] font-black text-zinc-400 uppercase block mb-1">Algoritmo</span>
                <span className="text-[10px] font-bold text-zinc-900">V3.4 Stable</span>
              </div>
              <div className="flex-1 p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                <span className="text-[8px] font-black text-zinc-400 uppercase block mb-1">Latência</span>
                <span className="text-[10px] font-bold text-zinc-900">12ms</span>
              </div>
            </div>
          </div>
        </BentoCard>
      </div>
    </AppLayout>
  );
}
