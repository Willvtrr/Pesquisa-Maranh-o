
"use client";

import React, { useMemo, useState } from 'react';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { BottomNav } from '@/components/layout/bottom-nav';
import { RAW_SURVEY_DATA, MesoRegion, SurveyRecord } from '@/data/survey-data';
import { StatItem } from '@/components/dashboard/stat-item';
import { Users, CheckCircle, XCircle, MapPin, Search } from 'lucide-react';
import { ApprovalChart } from '@/components/dashboard/approval-chart';
import { CandidateChart } from '@/components/dashboard/candidate-chart';
import { FilterEngine } from '@/components/filters/filter-engine';
import { MaranhaoMap } from '@/components/dashboard/maranhao-map';
import { motion } from 'framer-motion';

export default function Home() {
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
    return RAW_SURVEY_DATA.filter(item => {
      const regionMatch = filters.region === 'all' || item.region === filters.region;
      const ageMatch = filters.age === 'all' || item.age === filters.age;
      const genderMatch = filters.gender === 'all' || item.gender === filters.gender;
      return regionMatch && ageMatch && genderMatch;
    });
  }, [filters]);

  const stats = useMemo(() => {
    const total = filteredData.length;
    const approvalCount = filteredData.filter(d => d.approval === 'Aprova').length;
    const disapprovalCount = filteredData.filter(d => d.approval === 'Desaprova').length;
    const citiesCount = new Set(filteredData.map(d => d.city)).size;

    const approvalPct = total > 0 ? (approvalCount / total) * 100 : 0;
    const disapprovalPct = total > 0 ? (disapprovalCount / total) * 100 : 0;

    return { total, approvalCount, approvalPct, disapprovalCount, disapprovalPct, citiesCount };
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

  const mapStats = useMemo(() => {
    const counts: Record<MesoRegion, number> = {
      Norte: 0, Sul: 0, Oeste: 0, Leste: 0, Centro: 0
    };
    filteredData.forEach(d => {
      counts[d.region as MesoRegion]++;
    });
    return counts;
  }, [filteredData]);

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row pb-24 lg:pb-0">
      <SidebarNav />
      
      <main className="flex-1 lg:ml-[260px] p-6 lg:p-10 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold font-headline text-primary">Maranhão Insights</h1>
            <p className="text-muted-foreground font-medium">Análise e monitoramento estatístico da opinião pública estadual.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="p-4 rounded-2xl glass flex items-center gap-3 shadow-lg border-white/30">
                <Search size={18} className="text-accent" />
                <span className="text-sm font-bold text-primary opacity-60">Pesquisar registros...</span>
             </div>
          </div>
        </div>

        {/* Filters */}
        <FilterEngine 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          onClear={clearFilters} 
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatItem 
            label="Respondentes" 
            value={stats.total} 
            icon={Users} 
            color="text-primary" 
          />
          <StatItem 
            label="Aprovação" 
            value={stats.approvalPct} 
            suffix="%" 
            icon={CheckCircle} 
            color="text-approval" 
          />
          <StatItem 
            label="Desaprovação" 
            value={stats.disapprovalPct} 
            suffix="%" 
            icon={XCircle} 
            color="text-disapproval" 
          />
          <StatItem 
            label="Cidades" 
            value={stats.citiesCount} 
            icon={MapPin} 
            color="text-accent" 
          />
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <MaranhaoMap 
              stats={mapStats} 
              onRegionSelect={(r) => handleFilterChange('region', r || 'all')} 
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ApprovalChart data={chartData.approvalData} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <CandidateChart data={chartData.candidateData} />
        </motion.div>

        {/* Recent Activity / Raw Data Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/40 rounded-3xl p-6 glass border-none shadow-xl mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold font-headline text-primary">Amostra de Registros</h3>
            <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-bold uppercase">Dados em tempo real</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest border-b border-white/20">
                  <th className="pb-4 px-2">ID</th>
                  <th className="pb-4">Cidade</th>
                  <th className="pb-4">Gênero</th>
                  <th className="pb-4">Idade</th>
                  <th className="pb-4">Situação</th>
                  <th className="pb-4">Candidato</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.slice(0, 5).map((record) => (
                  <tr key={record.id} className="border-b border-white/10 last:border-0 hover:bg-white/20 transition-colors">
                    <td className="py-4 px-2 font-bold text-muted-foreground">#{record.id}</td>
                    <td className="py-4 font-semibold text-primary">{record.city}</td>
                    <td className="py-4 text-muted-foreground">{record.gender}</td>
                    <td className="py-4 text-muted-foreground">{record.age}</td>
                    <td className="py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-lg text-[10px] font-bold uppercase",
                        record.approval === 'Aprova' ? "bg-approval/10 text-approval" : 
                        record.approval === 'Desaprova' ? "bg-disapproval/10 text-disapproval" : "bg-neutral/10 text-neutral"
                      )}>
                        {record.approval}
                      </span>
                    </td>
                    <td className="py-4 font-medium text-primary">{record.candidate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="w-full mt-6 py-4 rounded-2xl bg-white/40 text-accent font-bold text-xs uppercase tracking-widest hover:bg-white/60 transition-all">
            Ver Todos os 1.817 Registros
          </button>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
