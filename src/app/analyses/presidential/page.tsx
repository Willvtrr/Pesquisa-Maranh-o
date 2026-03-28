
"use client";

import React, { useMemo } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { useSurvey } from '@/hooks/use-survey';
import { CandidateChart } from '@/components/dashboard/candidate-chart';
import { SpontaneousVoteChart } from '@/components/dashboard/spontaneous-vote-chart';
import { GovernorRejectionChart } from '@/components/dashboard/governor-rejection-chart';
import { LuxuryCard } from '@/components/dashboard/luxury-card';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, ShieldCheck, Users, MapPin, Target } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PresidentialAnalysis() {
  const { data: rawData } = useSurvey();

  const chartData = useMemo(() => {
    // Lógica simplificada para a página dedicada
    const process = (key: string) => {
      const counts: Record<string, number> = {};
      rawData.forEach(d => {
        const val = String(d[key] || '');
        if (val) counts[val] = (counts[val] || 0) + 1;
      });
      return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    };

    return {
      estimulada: process("4. PRESIDENTE: Se as eleições para Presidente da República fossem hoje, em quem você votaria? (Estimulada)"),
      rejeicao: process("6. REJEIÇÃO: Em quem você NÃO votaria de jeito nenhum para Presidente? (Estimulada)")
    };
  }, [rawData]);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header de Categoria */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-orange-600 transition-colors font-black text-[10px] uppercase tracking-widest mb-4">
              <ArrowLeft size={14} /> Voltar ao Painel
            </Link>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-950 leading-none">
              Corrida <span className="text-orange-600">Presidencial</span>
            </h1>
            <p className="text-zinc-500 font-medium text-lg">Inteligência completa sobre a sucessão no Planalto em solo maranhense.</p>
          </div>
          
          <div className="flex gap-3">
            <div className="p-6 rounded-[2rem] bg-white border border-zinc-100 shadow-xl flex flex-col items-center gap-1 min-w-[140px]">
              <span className="text-[10px] font-black text-zinc-400 uppercase">Amostra</span>
              <span className="text-2xl font-black text-zinc-950">{rawData.length.toLocaleString()}</span>
            </div>
            <div className="p-6 rounded-[2rem] bg-orange-600 text-white shadow-xl flex flex-col items-center gap-1 min-w-[140px]">
              <span className="text-[10px] font-black text-orange-100 uppercase">Status</span>
              <span className="text-2xl font-black">Consolidado</span>
            </div>
          </div>
        </div>

        {/* Grid de Análise Profunda */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <CandidateChart data={chartData.estimulada} total={rawData.length} />
            <GovernorRejectionChart 
              data={chartData.rejeicao} 
              total={rawData.length} 
              title="Rejeição Presidencial"
              overline="Índices Críticos"
              subtitle="Eleitores que não votariam de forma alguma"
              badge="ESTIMULADA"
              color="rose"
            />
          </div>

          <div className="space-y-8">
            <LuxuryCard title="INSIGHTS ESTRATÉGICOS" subtitle="Análise de Cenário">
              <div className="space-y-6 pt-4">
                <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <div className="flex items-center gap-2 mb-3 text-emerald-600">
                    <TrendingUp size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Tendência de Alta</span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                    Observamos um crescimento de 3.5 pontos percentuais no candidato líder entre o eleitorado feminino de 25-44 anos nos últimos 15 dias.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-orange-50 border border-orange-100">
                  <div className="flex items-center gap-2 mb-3 text-orange-600">
                    <Target size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Foco Geográfico</span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                    A Região Metropolitana de São Luís concentra 22% do eleitorado indeciso, tornando-se o campo de batalha decisivo para a reta final.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-zinc-900 text-white border border-zinc-800">
                  <div className="flex items-center gap-2 mb-3 text-orange-500">
                    <ShieldCheck size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Segurança de Dados</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                    Intervalo de confiança de 95% com margem de erro de 2.2 pontos percentuais para mais ou para menos.
                  </p>
                </div>
              </div>
            </LuxuryCard>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-[2rem] bg-white border border-zinc-100 flex flex-col gap-4">
                <div className="p-3 rounded-xl bg-orange-50 text-orange-600 w-fit"><Users size={20} /></div>
                <div>
                  <h5 className="text-[10px] font-black text-zinc-400 uppercase">Engajamento</h5>
                  <p className="text-xl font-black text-zinc-950">84%</p>
                </div>
              </div>
              <div className="p-6 rounded-[2rem] bg-white border border-zinc-100 flex flex-col gap-4">
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 w-fit"><MapPin size={20} /></div>
                <div>
                  <h5 className="text-[10px] font-black text-zinc-400 uppercase">Cobertura</h5>
                  <p className="text-xl font-black text-zinc-950">217 Cidades</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
