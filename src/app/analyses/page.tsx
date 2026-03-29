
"use client";

import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { LuxuryCard } from '@/components/dashboard/luxury-card';
import { motion } from 'framer-motion';
import { 
  Landmark, 
  Flag, 
  ChevronRight, 
  Target, 
  ShieldCheck, 
  TrendingUp,
  BarChart3,
  Database
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AnalysesHub() {
  const categories = [
    {
      id: 'presidential',
      title: 'Corrida Presidencial',
      subtitle: 'PLANALTO CENTRAL',
      description: 'Inteligência completa sobre a sucessão presidencial em solo maranhense. Cruzamento de intenção de voto, rejeição e tendências por mesorregião.',
      icon: Flag,
      color: 'bg-orange-600',
      path: '/analyses/presidential',
      metrics: ['Amostra Consolidada', 'Margem: 2.2%', 'Confiança: 95%']
    },
    {
      id: 'governor',
      title: 'Corrida Governador',
      subtitle: 'PALÁCIO DOS LEÕES',
      description: 'Monitoramento tático da disputa estadual. Análise de cenários estimulados, percepção de vitória e avaliação do impacto das obras governamentais.',
      icon: Landmark,
      color: 'bg-zinc-950',
      path: '/analyses/governor',
      metrics: ['Tracking Ativo', 'Prefixos Auditados', 'Foco Regional']
    }
  ];

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-16 py-8">
        {/* Header da Seção */}
        <div className="space-y-4 max-w-3xl">
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
            Módulos especializados para decisões cirúrgicas. Explore dados consolidados e tendências estratégicas dos principais cenários políticos.
          </p>
        </div>

        {/* Grid de Categorias */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link href={cat.path}>
                <LuxuryCard className="h-full group cursor-pointer border-none shadow-[0_30px_60px_rgba(0,0,0,0.04)] hover:shadow-[0_40px_80px_rgba(234,88,12,0.12)] hover:-translate-y-2 transition-all duration-500 p-8 md:p-12">
                  <div className="flex flex-col h-full gap-8">
                    <div className="flex justify-between items-start">
                      <div className={cn(
                        "p-5 rounded-[2rem] text-white shadow-2xl transition-transform group-hover:scale-110 duration-500",
                        cat.color
                      )}>
                        <cat.icon size={32} />
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="outline" className="border-zinc-100 text-zinc-400 font-black text-[8px] tracking-widest uppercase px-3 py-1">
                          Consolidado v3.5
                        </Badge>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Live Data</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em] mb-1">{cat.subtitle}</h4>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-zinc-950 uppercase group-hover:text-orange-600 transition-colors">
                          {cat.title}
                        </h2>
                      </div>
                      <p className="text-zinc-500 font-medium leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-50">
                      {cat.metrics.map((m, i) => (
                        <div key={i} className="space-y-1">
                          <p className="text-[8px] font-black text-zinc-300 uppercase tracking-widest leading-none">{i === 0 ? 'Status' : i === 1 ? 'Margem' : 'Nível'}</p>
                          <p className="text-[10px] font-black text-zinc-950 uppercase truncate">{m}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform duration-500 flex items-center gap-2">
                        Acessar Deep Dive <ChevronRight size={14} />
                      </span>
                      <div className="w-12 h-12 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-300 group-hover:bg-zinc-950 group-hover:text-white group-hover:border-zinc-950 transition-all duration-500 shadow-sm">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  </div>
                </LuxuryCard>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Banner de Metodologia */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-zinc-950 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl"
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

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');
