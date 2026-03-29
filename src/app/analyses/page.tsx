
"use client";

import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { LuxuryCard } from '@/components/dashboard/luxury-card';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  Target, 
  ShieldCheck, 
  TrendingUp,
  BarChart3,
  Database
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function AnalysesHub() {
  const executiveAnalyses = [
    {
      id: 'presidential',
      title: 'Sucessão Presidencial',
      subtitle: 'PLANALTO CENTRAL',
      description: 'Inteligência completa sobre a sucessão presidencial em solo maranhense. Cruzamento de intenção de voto, rejeição e tendências.',
      image: 'https://picsum.photos/seed/pres-analysis/800/600',
      hint: 'President Lula',
      path: '/analyses/presidential',
      metrics: ['Margem: 2.2%', 'Confiança: 95%']
    },
    {
      id: 'governor',
      title: 'Sucessão Estadual',
      subtitle: 'PALÁCIO DOS LEÕES',
      description: 'Monitoramento tático da disputa estadual. Análise de cenários estimulados, percepção de vitória e impacto governamental.',
      image: 'https://picsum.photos/seed/gov-analysis/800/600',
      hint: 'Governor Brandao',
      path: '/analyses/governor',
      metrics: ['Tracking Ativo', 'Foco Regional']
    }
  ];

  const legislativeAnalyses = [
    {
      id: 'senate',
      title: 'Cenários do Senado',
      subtitle: 'CONGRESSO NACIONAL',
      description: 'Mapeamento de múltiplas vagas para o Senado. Alianças preferidas e cruzamento de Segundo Voto em tempo real.',
      image: 'https://picsum.photos/seed/senate-analysis/800/600',
      hint: 'Senate Chamber',
      path: '#',
      metrics: ['5 Cenários', 'Live Data']
    },
    {
      id: 'deputies',
      title: 'Rankings Proporcionais',
      subtitle: 'CÂMARA & ASSEMBLEIA',
      description: 'Identificação de puxadores de voto e capilaridade de candidatos a Deputado Federal e Estadual por microrregião.',
      image: 'https://picsum.photos/seed/dep-analysis/800/600',
      hint: 'Auditorium Assembly',
      path: '#',
      metrics: ['Auditado', 'Micro-Regional']
    }
  ];

  const territorialAnalyses = [
    {
      id: 'municipalities',
      title: 'Radar Municipal',
      subtitle: '217 MUNICÍPIOS',
      description: 'Comparativo de aprovação de prefeitos, principais problemas locais e demandas de obras prioritárias por cidade.',
      image: 'https://picsum.photos/seed/mun-analysis/800/600',
      hint: 'City Aerial',
      path: '#',
      metrics: ['Cobertura 100%', 'Gargalos']
    }
  ];

  return (
    <AppLayout>
      <div className="w-full space-y-10 py-4">
        {/* Header da Seção */}
        <div className="space-y-2 max-w-2xl px-4 lg:px-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600">
              <BarChart3 size={14} />
            </div>
            <h4 className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.4em]">Inteligência Analítica</h4>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-zinc-950 leading-none">
            Hub de <span className="text-orange-600">Análises</span>
          </h1>
          <p className="text-zinc-500 font-medium text-xs leading-relaxed max-w-lg">
            Módulos especializados para decisões cirúrgicas. Explore dados consolidados e tendências estratégicas dos principais cenários políticos.
          </p>
        </div>

        {/* Grupo: Esfera Executiva */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.3em] whitespace-nowrap">Esfera Executiva</span>
            <div className="h-px bg-zinc-100 flex-1" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {executiveAnalyses.map((cat, idx) => (
              <AnalysisCard key={cat.id} {...cat} delay={idx * 0.05} />
            ))}
          </div>
        </div>

        {/* Grupo: Força Legislativa */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.3em] whitespace-nowrap">Força Legislativa</span>
            <div className="h-px bg-zinc-100 flex-1" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {legislativeAnalyses.map((cat, idx) => (
              <AnalysisCard key={cat.id} {...cat} delay={0.1 + idx * 0.05} />
            ))}
          </div>
        </div>

        {/* Grupo: Inteligência Territorial */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.3em] whitespace-nowrap">Inteligência Territorial</span>
            <div className="h-px bg-zinc-100 flex-1" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {territorialAnalyses.map((cat, idx) => (
              <AnalysisCard key={cat.id} {...cat} delay={0.2 + idx * 0.05} />
            ))}
          </div>
        </div>

        {/* Metodologia Banner Compacto */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-zinc-950 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl mt-8"
        >
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-orange-600/10 blur-[80px] -mr-20 -mt-20 rounded-full" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-orange-500" size={16} />
                <h4 className="text-[9px] font-black uppercase tracking-[0.4em]">Rigor Metodológico Focco</h4>
              </div>
              <h2 className="text-xl font-black tracking-tighter leading-tight">
                Dados auditados com <span className="text-orange-500 underline underline-offset-4 decoration-orange-500/30">tecnologia geoespacial</span>.
              </h2>
              <p className="text-zinc-400 font-medium text-[10px] leading-relaxed max-w-md">
                Algoritmos proprietários neutralizam outliers e garantem insights que refletem a realidade orgânica das ruas.
              </p>
            </div>
            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              {[
                { label: 'Confiança', value: '95%', icon: Target },
                { label: 'Margem Erro', value: '2.2%', icon: TrendingUp },
                { label: 'Auditado', value: '100%', icon: ShieldCheck },
                { label: 'Registros', value: '+109K', icon: Database },
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col gap-1">
                  <stat.icon className="text-orange-500 mb-1" size={14} />
                  <p className="text-[7px] font-black text-zinc-500 uppercase tracking-widest leading-none">{stat.label}</p>
                  <p className="text-lg font-black tabular-nums leading-none">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}

function AnalysisCard({ title, subtitle, description, image, hint, path, metrics, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Link href={path}>
        <LuxuryCard className="h-full group cursor-pointer border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 p-0 overflow-hidden bg-white">
          <div className="flex flex-col lg:flex-row h-full min-h-[160px]">
            <div className="relative w-full lg:w-[180px] min-h-[120px] lg:min-h-full overflow-hidden shrink-0">
              <Image 
                src={image} 
                alt={title} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                data-ai-hint={hint}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 lg:to-transparent" />
            </div>
            
            <div className="flex flex-col flex-1 p-5 md:p-6 gap-4">
              <div className="flex justify-between items-start">
                <div className="flex flex-col items-start gap-0.5">
                  <h4 className="text-[7px] font-black text-orange-600 uppercase tracking-[0.3em]">{subtitle}</h4>
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[7px] font-black text-zinc-400 uppercase tracking-widest">Live Data</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <h2 className="text-base font-black tracking-tighter text-zinc-950 uppercase group-hover:text-orange-600 transition-colors leading-tight">
                  {title}
                </h2>
                <p className="text-zinc-500 text-[10px] font-medium leading-relaxed line-clamp-2">
                  {description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-50">
                {metrics.map((m: string, i: number) => (
                  <div key={i} className="space-y-0.5">
                    <p className="text-[6px] font-black text-zinc-300 uppercase tracking-widest leading-none">{i === 0 ? 'Status' : 'Nível'}</p>
                    <p className="text-[9px] font-black text-zinc-950 uppercase truncate">{m}</p>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-2 flex items-center justify-between">
                <span className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform duration-500 flex items-center gap-1.5">
                  Acessar <ChevronRight size={10} />
                </span>
                <div className="w-7 h-7 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-300 group-hover:bg-zinc-950 group-hover:text-white group-hover:border-zinc-950 transition-all duration-500 shadow-sm">
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          </div>
        </LuxuryCard>
      </Link>
    </motion.div>
  );
}
