
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
      description: 'Inteligência completa sobre a sucessão presidencial em solo maranhense. Cruzamento de intenção de voto, rejeição e tendências por mesorregião.',
      image: 'https://picsum.photos/seed/pres-analysis/800/600',
      path: '/analyses/presidential',
      metrics: ['Margem: 2.2%', 'Confiança: 95%']
    },
    {
      id: 'governor',
      title: 'Sucessão Estadual',
      subtitle: 'PALÁCIO DOS LEÕES',
      description: 'Monitoramento tático da disputa estadual. Análise de cenários estimulados, percepção de vitória e avaliação do impacto das obras governamentais.',
      image: 'https://picsum.photos/seed/gov-analysis/800/600',
      path: '/analyses/governor',
      metrics: ['Tracking Ativo', 'Foco Regional']
    }
  ];

  const legislativeAnalyses = [
    {
      id: 'senate',
      title: 'Cenários do Senado',
      subtitle: 'CONGRESSO NACIONAL',
      description: 'Mapeamento de múltiplas vagas para o Senado. Alianças preferidas e cruzamento de "Segundo Voto" em tempo real.',
      image: 'https://picsum.photos/seed/senate-analysis/800/600',
      path: '#',
      metrics: ['5 Cenários', 'Live Data']
    },
    {
      id: 'deputies',
      title: 'Rankings Proporcionais',
      subtitle: 'CÂMARA & ASSEMBLEIA',
      description: 'Identificação de puxadores de voto e capilaridade de candidatos a Deputado Federal e Estadual por microrregião.',
      image: 'https://picsum.photos/seed/dep-analysis/800/600',
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
      path: '#',
      metrics: ['Cobertura 100%', 'Gargalos']
    }
  ];

  return (
    <AppLayout>
      <div className="w-full space-y-16 py-8">
        {/* Header da Seção */}
        <div className="space-y-4 max-w-3xl px-4 lg:px-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
              <BarChart3 size={20} />
            </div>
            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">Inteligência Analítica</h4>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-950 leading-none">
            Hub de <span className="text-orange-600">Análises</span>
          </h1>
          <p className="text-zinc-500 font-medium text-lg leading-relaxed">
            Módulos especializados para decisões cirúrgicas. Explore dados consolidados e tendências estratégicas dos principais cenários políticos do Maranhão.
          </p>
        </div>

        {/* Grupo: Esfera Executiva */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] whitespace-nowrap">Esfera Executiva</span>
            <div className="h-px bg-zinc-100 flex-1" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {executiveAnalyses.map((cat, idx) => (
              <AnalysisCard key={cat.id} {...cat} delay={idx * 0.1} />
            ))}
          </div>
        </div>

        {/* Grupo: Força Legislativa */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] whitespace-nowrap">Força Legislativa</span>
            <div className="h-px bg-zinc-100 flex-1" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {legislativeAnalyses.map((cat, idx) => (
              <AnalysisCard key={cat.id} {...cat} delay={0.2 + idx * 0.1} />
            ))}
          </div>
        </div>

        {/* Grupo: Inteligência Territorial */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] whitespace-nowrap">Inteligência Territorial</span>
            <div className="h-px bg-zinc-100 flex-1" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {territorialAnalyses.map((cat, idx) => (
              <AnalysisCard key={cat.id} {...cat} delay={0.4 + idx * 0.1} />
            ))}
          </div>
        </div>

        {/* Metodologia Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-zinc-950 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl mt-12"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 blur-[120px] -mr-40 -mt-40 rounded-full" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-orange-500" size={24} />
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em]">Rigor Metodológico Focco</h4>
              </div>
              <h2 className="text-4xl font-black tracking-tighter leading-tight">
                Dados auditados com <span className="text-orange-500 underline underline-offset-8 decoration-orange-500/30">tecnologia geoespacial</span> de ponta.
              </h2>
              <p className="text-zinc-400 font-medium text-lg leading-relaxed">
                Nossas análises utilizam algoritmos proprietários para neutralizar outliers e garantir que cada insight reflita a realidade orgânica das ruas maranhenses.
              </p>
            </div>
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              {[
                { label: 'Confiança', value: '95%', icon: Target },
                { label: 'Margem Erro', value: '2.2%', icon: TrendingUp },
                { label: 'Auditado', value: '100%', icon: ShieldCheck },
                { label: 'Registros', value: '+109K', icon: Database },
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] flex flex-col gap-2">
                  <stat.icon className="text-orange-500 mb-2" size={20} />
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">{stat.label}</p>
                  <p className="text-2xl font-black tabular-nums leading-none">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}

function AnalysisCard({ title, subtitle, description, image, path, metrics, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Link href={path}>
        <LuxuryCard className="h-full group cursor-pointer border-none shadow-[0_30px_60px_rgba(0,0,0,0.04)] hover:shadow-[0_40px_80px_rgba(234,88,12,0.12)] hover:-translate-y-2 transition-all duration-500 p-0 overflow-hidden">
          <div className="flex flex-col lg:flex-row h-full">
            <div className="relative w-full lg:w-2/5 min-h-[200px] lg:min-h-full overflow-hidden">
              <Image 
                src={image} 
                alt={title} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                data-ai-hint="Government building"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 lg:to-transparent" />
            </div>
            
            <div className="flex flex-col flex-1 p-8 md:p-10 gap-6">
              <div className="flex justify-between items-start">
                <div className="flex flex-col items-start gap-1">
                  <h4 className="text-[9px] font-black text-orange-600 uppercase tracking-[0.3em]">{subtitle}</h4>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Live Data</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-zinc-950 uppercase group-hover:text-orange-600 transition-colors">
                  {title}
                </h2>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed line-clamp-3">
                  {description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-50">
                {metrics.map((m: string, i: number) => (
                  <div key={i} className="space-y-1">
                    <p className="text-[8px] font-black text-zinc-300 uppercase tracking-widest leading-none">{i === 0 ? 'Status' : 'Nível'}</p>
                    <p className="text-[10px] font-black text-zinc-950 uppercase truncate">{m}</p>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-4 flex items-center justify-between">
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform duration-500 flex items-center gap-2">
                  Acessar Deep Dive <ChevronRight size={14} />
                </span>
                <div className="w-10 h-10 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-300 group-hover:bg-zinc-950 group-hover:text-white group-hover:border-zinc-950 transition-all duration-500 shadow-sm">
                  <ChevronRight size={18} />
                </div>
              </div>
            </div>
          </div>
        </LuxuryCard>
      </Link>
    </motion.div>
  );
}
