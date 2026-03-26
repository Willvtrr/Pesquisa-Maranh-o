
"use client";

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface GovernorSpontaneousChartProps {
  data: { name: string; value: number }[];
  total: number;
  filters: Record<string, string[]>;
  onFilterChange: (key: string, value: string) => void;
}

const PARTY_MAP: Record<string, string> = {
  'Carlos Brandão': 'PSB',
  'Orleans Brandão': 'MDB',
  'Brandão': 'PSB',
  'Felipe Camarão': 'PT',
  'Edivaldo Holanda Jr.': 'PSD',
  'Weverton Rocha': 'PDT',
  'Josimar de Maranhãozinho': 'PL',
  'Roberto Rocha': 'PSDB',
  'Lahésio Bonfim': 'NOVO',
  'Roseana Sarney': 'MDB',
  'Roseana': 'MDB',
  'Iracema Vale': 'PSB',
  'Othelino Neto': 'PCdoB',
  'Eduardo Braide': 'PSD',
  'Flávio Dino': 'PSB',
  'Dino': 'PSB'
};

const PHOTO_MAP: Record<string, string> = {
  'Carlos Brandão': '/Retrato_Oficial_de_Carlos_Brandão_como_governador_do_Maranhão.jpg',
  'Eduardo Braide': 'https://picsum.photos/seed/braide/500/500',
  'Orleans Brandão': 'https://picsum.photos/seed/orleans/500/500',
  'Felipe Camarão': 'https://picsum.photos/seed/camarao/500/500',
  'Weverton Rocha': 'https://picsum.photos/seed/weverton/500/500',
  'Josimar de Maranhãozinho': 'https://picsum.photos/seed/josimar/500/500',
  'Roberto Rocha': 'https://picsum.photos/seed/roberto/500/500',
  'Lahésio Bonfim': 'https://picsum.photos/seed/lahesio/500/500',
  'Roseana Sarney': 'https://picsum.photos/seed/roseana/500/500',
};

export const GovernorSpontaneousChart = ({ data, total, filters, onFilterChange }: GovernorSpontaneousChartProps) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const isSelected = (nome: string) => filters.gov_spontaneous?.includes(nome);

  const processed = useMemo(() => {
    if (!data || data.length === 0 || total === 0) return { ranking: [], indecisos: 0, brancos: 0 };

    const indecisionKeywords = ["ns/nr", "não sabe", "não respondeu", "não opinou", "indeciso", "nsnr"];
    const brancoKeywords = ["branco", "nulo", "nenhum", "ninguém"];

    const indecisosCount = data
      .filter(item => indecisionKeywords.some(kw => item.name.toLowerCase().includes(kw)))
      .reduce((acc, curr) => acc + curr.value, 0);

    const brancosCount = data
      .filter(item => brancoKeywords.some(kw => item.name.toLowerCase().includes(kw)))
      .reduce((acc, curr) => acc + curr.value, 0);

    const ranking = data
      .filter(item => 
        !indecisionKeywords.some(kw => item.name.toLowerCase().includes(kw)) &&
        !brancoKeywords.some(kw => item.name.toLowerCase().includes(kw))
      )
      .map(item => ({
        nome: item.name.trim(),
        porcentagem: (item.value / total) * 100,
        party: PARTY_MAP[item.name.trim()] || null
      }))
      .sort((a, b) => b.porcentagem - a.porcentagem);

    return {
      ranking,
      indecisos: (indecisosCount / total) * 100,
      brancos: (brancosCount / total) * 100
    };
  }, [data, total]);

  const { ranking, indecisos, brancos } = processed;

  return (
    <div className="bg-white rounded-[3rem] border border-zinc-200/60 p-10 lg:p-14 relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.04)] h-full flex flex-col">
      {/* Header Estilo Referência */}
      <div className="relative z-10 mb-12 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-4 bg-orange-600 rounded-full" />
            <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.3em]">Monitoramento Estadual</h4>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-zinc-950 tracking-tighter leading-[0.9] max-w-sm">
            Intenção de Voto Governador
          </h1>
        </div>
        
        <div className="flex items-center gap-2 bg-white border border-zinc-100 shadow-sm px-5 py-2.5 rounded-full w-fit self-start sm:self-center">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.4)]" />
          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Espontânea</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        {/* Destaques (Top 3 Cápsulas Verticais) */}
        <div className="lg:col-span-8 flex flex-col">
          <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-12">Destaques Espontâneos</h4>
          
          <div className="grid grid-cols-3 gap-6 flex-1 items-start">
            {[0, 1, 2].map((pos) => {
              const item = ranking[pos];
              const active = item ? isSelected(item.nome) : false;
              const photoUrl = item ? PHOTO_MAP[item.nome] : null;
              const isFaded = hoveredIdx !== null && hoveredIdx !== pos;
              
              return (
                <motion.div 
                  key={pos}
                  onMouseEnter={() => setHoveredIdx(pos)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onClick={() => item && onFilterChange('gov_spontaneous', item.nome)}
                  className={cn(
                    "bg-white border rounded-[5rem] p-4 pt-10 pb-12 flex flex-col items-center gap-8 relative transition-all duration-500 cursor-pointer shadow-sm min-h-[400px]",
                    active ? "border-orange-500 bg-orange-50/20" : "border-zinc-100",
                    isFaded && "opacity-40 grayscale-[0.5] scale-95"
                  )}
                >
                  <div className="relative">
                    <div className="size-24 lg:size-28 rounded-full bg-zinc-50 relative overflow-hidden border-4 border-white shadow-2xl">
                      {photoUrl ? (
                        <Image src={photoUrl} alt={item?.nome || "Candidato"} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-zinc-200 uppercase">500x500</div>
                      )}
                    </div>
                    {/* Badge de Posição Circular */}
                    <div className={cn(
                      "absolute top-0 -right-2 size-10 rounded-full font-black flex items-center justify-center text-xs shadow-xl border-4 border-white",
                      pos === 0 ? "bg-orange-600 text-white" : "bg-zinc-950 text-white"
                    )}>
                      {pos + 1}º
                    </div>
                  </div>

                  <div className="text-center space-y-4 w-full">
                    <div className="flex flex-col items-center">
                      <span className={cn(
                        "text-2xl font-black transition-colors leading-none mb-2",
                        active ? "text-orange-950" : "text-zinc-950"
                      )}>
                        {item ? `${item.nome.split(' ')[0][0]}.` : '-'}
                      </span>
                      <div className="flex items-baseline gap-1 justify-center">
                        <span className={cn("text-3xl font-black", active ? "text-orange-600" : "text-zinc-950")}>
                          {item?.porcentagem.toFixed(1) || '0.0'}
                        </span>
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">%</span>
                      </div>
                      {item?.party && (
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">
                          ({item.party})
                        </span>
                      )}
                    </div>
                    {/* Barra Horizontal Estilo Referência */}
                    <div className="w-14 h-1.5 bg-zinc-100 rounded-full mx-auto overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item?.porcentagem || 0}%` }}
                        className={cn("h-full", pos === 0 ? "bg-orange-600" : "bg-zinc-400")} 
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Sidebar de Inteligência Estilo Image Referência */}
        <div className="lg:col-span-4 flex flex-col pt-20">
          {/* Controle de Indecisão - Box flutuante arredondado */}
          <div className="bg-zinc-50/50 p-8 rounded-[3rem] border border-zinc-100 mb-14 shadow-inner">
            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-10">Controle de Indecisão</h4>
            
            <div className="space-y-10">
              <div 
                className="cursor-pointer group"
                onClick={() => onFilterChange('gov_spontaneous', 'NS/NR')}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] font-bold text-zinc-700 uppercase tracking-tight">Não Sabe / NS/NR</span>
                </div>
                <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-zinc-100">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${indecisos}%` }}
                    className="h-full bg-zinc-400" 
                  />
                </div>
              </div>

              <div 
                className="cursor-pointer group"
                onClick={() => onFilterChange('gov_spontaneous', 'Branco/Nulo')}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] font-bold text-zinc-700 uppercase tracking-tight">Branco / Nulo</span>
                </div>
                <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-zinc-100/50">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${brancos}%` }}
                    className="h-full bg-zinc-200" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Outros Nomes - Lista Vertical Compacta */}
          <div>
            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-10">Outros Nomes Citados</h4>
            <div className="space-y-8 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
              {ranking.slice(3, 10).map((item) => {
                const active = isSelected(item.nome);
                const photoUrl = PHOTO_MAP[item.nome];
                return (
                  <div 
                    key={item.nome} 
                    onClick={() => onFilterChange('gov_spontaneous', item.nome)}
                    className="cursor-pointer group flex items-center gap-4"
                  >
                    <div className="size-12 rounded-full bg-zinc-50 relative overflow-hidden shrink-0 border-2 border-white shadow-lg">
                      {photoUrl ? (
                        <Image src={photoUrl} alt={item.nome} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] font-black text-zinc-300">IMG</div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className={cn("text-[13px] font-black truncate", active ? "text-orange-600" : "text-zinc-900")}>
                          {item.nome}
                        </span>
                        <span className="text-[11px] font-black text-zinc-400">{item.porcentagem.toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.porcentagem}%` }}
                          className={cn("h-full", active ? "bg-orange-600" : "bg-zinc-300")}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
