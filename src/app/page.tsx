"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { RAW_SURVEY_DATA, MesoRegion, SurveyRecord } from '@/data/survey-data';
import { StatCard } from '@/components/dashboard/stat-card';
import { InteractiveMap } from '@/components/dashboard/interactive-map';
import { FilterBentoBox } from '@/components/dashboard/filter-bento-box';
import { ApprovalChart } from '@/components/dashboard/approval-chart';
import { CandidateChart } from '@/components/dashboard/candidate-chart';
import { Users, CheckCircle, Activity, MapPin, Target, BarChart3 } from 'lucide-react';
import { BentoCard } from '@/components/dashboard/bento-card';

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
      .sort((a, b) => b.value - a.value);

    return { approvalData, candidateData };
  }, [filteredData]);

  return (
    <AppLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:auto-rows-[minmax(180px,auto)]">
        {/* Bento Stats */}
        <StatCard 
          label="Respondentes" 
          value={stats.total.toLocaleString()} 
          subValue="Processados com sucesso"
          icon={Users} 
        />
        <StatCard 
          label="Aprovação" 
          value={`${stats.approvalPct.toFixed(1)}%`} 
          subValue="Índice de governo"
          icon={CheckCircle} 
          trend="up"
        />
        <StatCard 
          label="Indecisos" 
          value={`${(100 - stats.approvalPct - stats.disapprovalPct).toFixed(1)}%`} 
          subValue="Potencial de migração"
          icon={Activity} 
        />
        <StatCard 
          label="Cidades" 
          value={stats.citiesCount} 
          subValue="Municípios ativos"
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

        {/* Design Highlight Bento */}
        <BentoCard className="bg-orange-600 text-white border-none shadow-orange-600/20">
          <div className="flex flex-col h-full justify-between">
            <div className="p-3 rounded-2xl bg-white/20 w-fit">
              <BarChart3 size={24} />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-bold leading-tight">Insight Estratégico</h4>
              <p className="text-orange-100 text-xs font-medium leading-relaxed">
                Cruzamento de dados aponta crescimento de 3.2% no setor Norte na última janela de 24h.
              </p>
            </div>
          </div>
        </BentoCard>

        {/* Meta Info Bento */}
        <BentoCard title="Metadata de Validação" className="lg:col-span-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[8px] font-bold text-zinc-400 uppercase block mb-1">Margem de Erro</span>
              <span className="text-sm font-mono font-bold">± 2.3%</span>
            </div>
            <div>
              <span className="text-[8px] font-bold text-zinc-400 uppercase block mb-1">Fator DEFF</span>
              <span className="text-sm font-mono font-bold">1.14</span>
            </div>
            <div>
              <span className="text-[8px] font-bold text-zinc-400 uppercase block mb-1">Algoritmo</span>
              <span className="text-[10px] font-bold text-orange-600 uppercase">Orange Engine</span>
            </div>
          </div>
        </BentoCard>
      </div>
    </AppLayout>
  );
}
