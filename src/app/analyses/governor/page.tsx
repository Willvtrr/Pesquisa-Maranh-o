
"use client";

import React, { useMemo } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { useSurvey } from '@/hooks/use-survey';
import { SpontaneousVoteChart } from '@/components/dashboard/spontaneous-vote-chart';
import { GovernorScenarioCard, SCENARIOS } from '@/components/dashboard/governor-scenario-chart';
import { VictoryPerceptionCard } from '@/components/dashboard/victory-perception-card';
import { LuxuryCard } from '@/components/dashboard/luxury-card';
import { motion } from 'framer-motion';
import { ArrowLeft, Landmark, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function GovernorAnalysis() {
  const { data: rawData } = useSurvey();

  const chartData = useMemo(() => {
    const process = (key: string) => {
      const counts: Record<string, number> = {};
      rawData.forEach(d => {
        const val = String(d[key] || '');
        if (val) counts[val] = (counts[val] || 0) + 1;
      });
      return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    };

    return {
      espontanea: process("7. GOVERNADOR: Se as eleições para Governador fossem hoje, em quem você votaria? (Espontânea)"),
      vitoria: process("11. PERCEPÇÃO DE VITÓRIA: Quem você acha que ganhará a eleição para Governador do Maranhão? (Estimulada)")
    };
  }, [rawData]);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-orange-600 transition-colors font-black text-[10px] uppercase tracking-widest mb-4">
              <ArrowLeft size={14} /> Voltar ao Painel
            </Link>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-950 leading-none">
              Palácio <span className="text-orange-600">dos Leões</span>
            </h1>
            <p className="text-zinc-500 font-medium text-lg">Monitoramento da sucessão estadual e aprovação do governo.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GovernorScenarioCard scenario={SCENARIOS[0]} />
              <GovernorScenarioCard scenario={SCENARIOS[1]} />
            </div>
            <SpontaneousVoteChart 
              data={chartData.espontanea} 
              total={rawData.length} 
              overline="ESTADUAL" 
              title="Voto Espontâneo" 
              question="Em quem você votaria para Governador?" 
              badge="ESPONTÂNEA" 
              showPhotos 
              onFilterChange={() => {}}
            />
          </div>

          <div className="space-y-8">
            <VictoryPerceptionCard data={chartData.vitoria} total={rawData.length} />
            
            <LuxuryCard title="ANÁLISE DE IMPACTO" subtitle="Resumo Executivo">
              <div className="space-y-6 pt-4">
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-4">
                  <CheckCircle2 className="text-emerald-600 shrink-0" size={20} />
                  <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                    A gestão estadual mantém estabilidade em 58%, com pico de aprovação na Baixada Maranhense devido às obras de infraestrutura.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-rose-50 border border-rose-100 flex items-start gap-4">
                  <AlertTriangle className="text-rose-600 shrink-0" size={20} />
                  <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                    O principal gargalo identificado pela população é a Segurança Pública, citada por 42% dos entrevistados como problema grave.
                  </p>
                </div>
              </div>
            </LuxuryCard>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
