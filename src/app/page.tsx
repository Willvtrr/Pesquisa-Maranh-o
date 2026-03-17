"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { RAW_SURVEY_DATA, MesoRegion, SurveyRecord } from '@/data/survey-data';
import { StatCard } from '@/components/dashboard/stat-card';
import { InteractiveMap } from '@/components/dashboard/interactive-map';
import { Users, CheckCircle, Activity, MapPin, Target, BarChart, ArrowUpRight } from 'lucide-react';
import { ApprovalChart } from '@/components/dashboard/approval-chart';
import { CandidateChart } from '@/components/dashboard/candidate-chart';
import { motion } from 'framer-motion';

export default function Home() {
  const [surveyData, setSurveyData] = useState<SurveyRecord[]>([]);
  const [filters, setFilters] = useState({
    region: 'all',
    age: 'all',
    gender: 'all'
  });

  useEffect(() => {
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
    <AppLayout 
      filters={filters} 
      onFilterChange={handleFilterChange} 
      onClear={clearFilters}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          label="Amostra (N)" 
          value={stats.total.toLocaleString()} 
          subValue="Total de respondentes validados"
          icon={Users} 
        />
        <StatCard 
          label="Índice Aprovação" 
          value={`${stats.approvalPct.toFixed(1)}%`} 
          subValue="Governo do Estado"
          icon={CheckCircle} 
          trend="up"
          color="text-orange-600"
        />
        <StatCard 
          label="Abstenção/Indecisos" 
          value={`${(100 - stats.approvalPct - stats.disapprovalPct).toFixed(1)}%`} 
          subValue="Votos NS/NR em potencial"
          icon={Activity} 
          trend="neutral"
          color="text-zinc-400"
        />
        <StatCard 
          label="Cidades Ativas" 
          value={stats.citiesCount} 
          subValue="Municípios representados"
          icon={MapPin} 
          color="text-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <InteractiveMap 
            stats={mapStats} 
            activeRegion={filters.region}
            onRegionSelect={(r) => handleFilterChange('region', r || 'all')} 
          />
        </div>
        <div className="space-y-6">
          <ApprovalChart data={chartData.approvalData} />
          <div className="glass-card p-6 bg-orange-600 text-white">
            <div className="flex justify-between items-start mb-4">
              <BarChart size={24} />
              <ArrowUpRight size={20} className="opacity-60" />
            </div>
            <h4 className="text-sm font-mono font-bold uppercase tracking-widest mb-1">Impacto Regional</h4>
            <p className="text-2xl font-bold tracking-tight mb-4">Tendência Positiva</p>
            <div className="text-xs font-mono opacity-80 leading-relaxed">
              O cruzamento de dados indica crescimento de 3.2% na aprovação no setor Norte.
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <CandidateChart data={chartData.candidateData} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-12 glass-card p-8 bg-zinc-50 border-dashed border-zinc-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
            <Target size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900">Metadata de Validação</h3>
            <p className="text-xs text-zinc-400 font-mono">Consistência estatística para amostras randômicas estratificadas.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Margem Erro', value: '± 2.3%', detail: 'Grau de incerteza' },
            { label: 'Confiança', value: '95.0%', detail: 'Intervalo calculado' },
            { label: 'Efeito (DEFF)', value: '1.14', detail: 'Fator de desenho' },
            { label: 'Processamento', value: 'Orange Engine', detail: 'Algoritmo proprietário' }
          ].map((meta, i) => (
            <div key={i} className="space-y-1">
              <div className="text-[10px] font-mono text-zinc-400 font-bold uppercase">{meta.label}</div>
              <div className="text-xl font-mono font-bold text-zinc-900">{meta.value}</div>
              <div className="text-[10px] text-orange-600 font-bold">{meta.detail}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </AppLayout>
  );
}
