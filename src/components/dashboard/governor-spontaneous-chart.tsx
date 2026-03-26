
"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GovernorSpontaneousChartProps {
  data: { name: string; value: number }[];
  total: number;
}

const NumberCounter = ({ value, isSmall = false }: { value: number; isSmall?: boolean }) => {
  return (
    <span className={cn(
      "font-black text-zinc-900 tracking-tight",
      isSmall ? "text-sm" : "text-2xl md:text-3xl"
    )}>
      {value.toFixed(1)}
      <span className={cn(
        "font-bold text-zinc-400 ml-0.5",
        isSmall ? "text-[10px]" : "text-xl md:text-2xl"
      )}>%</span>
    </span>
  );
};

export const GovernorSpontaneousChart = ({ data, total }: GovernorSpontaneousChartProps) => {
  // Processamento dos dados reais do banco de dados
  const processed = useMemo(() => {
    if (!data || data.length === 0 || total === 0) return { ranking: [], indecisos: 0, brancos: 0 };

    // Palavras-chave abrangentes para capturar variações do banco
    const indecisionKeywords = ["ns/nr", "não sabe", "não respondeu", "não opinou", "indeciso", "nsnr"];
    const brancoKeywords = ["branco", "nulo", "nenhum", "ninguém"];

    const indecisosCount = data
      .filter(item => indecisionKeywords.some(kw => item.name.toLowerCase().includes(kw)))
      .reduce((acc, curr) => acc + curr.value, 0);

    const brancosCount = data
      .filter(item => brancoKeywords.some(kw => item.name.toLowerCase().includes(kw)))
      .reduce((acc, curr) => acc + curr.value, 0);

    // O ranking exclui apenas os grupos de indecisão e brancos já processados
    const ranking = data
      .filter(item => 
        !indecisionKeywords.some(kw => item.name.toLowerCase().includes(kw)) &&
        !brancoKeywords.some(kw => item.name.toLowerCase().includes(kw))
      )
      .map(item => ({
        nome: item.name.trim(),
        porcentagem: (item.value / total) * 100
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
    <div className="bg-white rounded-[2.5rem] border border-zinc-200/80 p-8 md:p-14 relative overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)]">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="relative z-10 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-1.5 h-4 bg-[#ea580c] rounded-full"></div>
            <span className="text-[10px] md:text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">Monitoramento Estadual</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight leading-none">
            Intenção de Voto Governador
          </h1>
        </div>
        
        <div className="flex items-center gap-2 bg-white border border-zinc-200 shadow-sm px-4 py-2 rounded-full w-fit">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ea580c]"></span>
          </span>
          <span className="text-[11px] font-black text-zinc-700 uppercase tracking-widest">Espontânea</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 relative z-10">
        <div className="col-span-1 lg:col-span-7">
          <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-5">Destaques Espontâneos</h4>
          
          <div className="grid grid-cols-3 gap-3 md:gap-5">
            {/* 1º Lugar */}
            <div className="bg-white border border-orange-200 bg-orange-50/30 rounded-[1.5rem] p-4 md:p-5 flex flex-col items-center justify-between h-[280px] md:h-[320px] relative group transition-all duration-300 hover:-translate-y-1">
              <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#ea580c] font-black flex items-center justify-center text-xs mb-3 shadow-sm">1º</div>
              <h3 className="text-sm font-bold text-zinc-800 text-center leading-tight truncate w-full">{ranking[0]?.nome || '-'}</h3>
              <div className="my-4">
                <NumberCounter value={ranking[0]?.porcentagem || 0} />
              </div>
              <div className="w-full bg-orange-100/50 rounded-xl relative overflow-hidden flex-1 mt-2">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${ranking[0] ? (ranking[0].porcentagem / Math.max(ranking[0].porcentagem, 10)) * 100 : 0}%` }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#c2410c] to-[#ea580c] shadow-[0_0_15px_rgba(234,88,12,0.3)]" 
                />
              </div>
            </div>

            {/* 2º Lugar */}
            <div className="bg-white border border-zinc-100 rounded-[1.5rem] p-4 md:p-5 flex flex-col items-center justify-between h-[280px] md:h-[320px] relative group transition-all duration-300 hover:-translate-y-1">
              <div className="w-7 h-7 rounded-lg bg-zinc-100 text-zinc-500 font-black flex items-center justify-center text-xs mb-3">2º</div>
              <h3 className="text-sm font-bold text-zinc-600 text-center leading-tight truncate w-full">{ranking[1]?.nome || '-'}</h3>
              <div className="my-4">
                <NumberCounter value={ranking[1]?.porcentagem || 0} />
              </div>
              <div className="w-full bg-zinc-100 rounded-xl relative overflow-hidden flex-1 mt-2">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${ranking[1] ? (ranking[1].porcentagem / Math.max(ranking[0]?.porcentagem || 1, 10)) * 100 : 0}%` }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-zinc-400 to-zinc-300" 
                />
              </div>
            </div>

            {/* 3º Lugar */}
            <div className="bg-white border border-zinc-100 rounded-[1.5rem] p-4 md:p-5 flex flex-col items-center justify-between h-[280px] md:h-[320px] relative group transition-all duration-300 hover:-translate-y-1">
              <div className="w-7 h-7 rounded-lg bg-zinc-100 text-zinc-500 font-black flex items-center justify-center text-xs mb-3">3º</div>
              <h3 className="text-sm font-bold text-zinc-600 text-center leading-tight truncate w-full">{ranking[2]?.nome || '-'}</h3>
              <div className="my-4">
                <NumberCounter value={ranking[2]?.porcentagem || 0} />
              </div>
              <div className="w-full bg-zinc-100 rounded-xl relative overflow-hidden flex-1 mt-2">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${ranking[2] ? (ranking[2].porcentagem / Math.max(ranking[0]?.porcentagem || 1, 10)) * 100 : 0}%` }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-zinc-400 to-zinc-300" 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-5 flex flex-col justify-between">
          <div className="mb-8 bg-zinc-50/50 p-5 rounded-2xl border border-zinc-100">
            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-5">Indecisão e Brancos</h4>
            <div className="mb-4">
              <div className="flex justify-between text-[13px] font-bold text-zinc-600 mb-2">
                <span>Não Sabe / Não Respondeu</span>
                <span className="text-zinc-800 text-sm">{indecisos.toFixed(1)}%</span>
              </div>
              <div className="w-full h-2.5 bg-zinc-200/60 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${indecisos}%` }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full bg-zinc-400" 
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[13px] font-bold text-zinc-600 mb-2">
                <span>Branco / Nulo</span>
                <span className="text-zinc-800 text-sm">{brancos.toFixed(1)}%</span>
              </div>
              <div className="w-full h-2.5 bg-zinc-200/60 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${brancos}%` }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full bg-zinc-300" 
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Outros Nomes Lembrados</h4>
            <div className="space-y-1">
              {ranking.slice(3, 9).map((item, idx) => (
                <div key={item.nome} className="p-2 -mx-2 rounded-xl transition-all duration-200 hover:bg-zinc-50 hover:translate-x-1">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold text-zinc-600">{item.nome}</span>
                    <span className="text-xs font-bold text-zinc-800">{item.porcentagem.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.porcentagem}%` }}
                      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: idx * 0.05 }}
                      className={cn("h-full", item.porcentagem > 1 ? "bg-orange-300" : "bg-zinc-300")}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
