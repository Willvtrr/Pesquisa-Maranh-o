
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
  // Processamento dos dados para o layout premium
  const processed = useMemo(() => {
    if (!data || total === 0) return { pods: [], indecision: [], others: [] };

    // Identificar e separar Brancos/Nulos e NS/NR
    const indecisionNames = ['Não Sabe / Não Respondeu', 'NS/NR', 'Não sabe', 'Branco / Nulo', 'Branco', 'Nulo', 'Nenhum'];
    
    const indecisionItems = data.filter(item => 
      indecisionNames.some(name => item.name.toLowerCase().includes(name.toLowerCase()))
    );

    const candidatesItems = data.filter(item => 
      !indecisionNames.some(name => item.name.toLowerCase().includes(name.toLowerCase()))
    );

    // Top 3 para os Pods
    const pods = candidatesItems.slice(0, 3).map((item, idx) => ({
      ...item,
      rank: idx + 1,
      pct: (item.value / total) * 100
    }));

    // Outros nomes lembrados (do 4º em diante)
    const others = candidatesItems.slice(3, 9).map(item => ({
      ...item,
      pct: (item.value / total) * 100
    }));

    // Formatar itens de indecisão especificamente para o box
    const ns_nr = indecisionItems.find(item => 
      ['não sabe', 'ns/nr'].some(n => item.name.toLowerCase().includes(n))
    ) || { name: 'Não Sabe / Não Respondeu', value: 0 };

    const branco_nulo = indecisionItems.find(item => 
      ['branco', 'nulo', 'nenhum'].some(n => item.name.toLowerCase().includes(n))
    ) || { name: 'Branco / Nulo', value: 0 };

    return {
      pods,
      indecision: [
        { name: 'Não Sabe / Não Respondeu', pct: (ns_nr.value / total) * 100 },
        { name: 'Branco / Nulo', pct: (branco_nulo.value / total) * 100 }
      ],
      others
    };
  }, [data, total]);

  return (
    <div className="bg-white rounded-[2.5rem] border border-zinc-200/80 p-8 md:p-14 relative overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)]">
      {/* Elemento Decorativo de Fundo */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      {/* Header do Componente */}
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
        
        {/* Lado Esquerdo: Top 3 Pods */}
        <div className="col-span-1 lg:col-span-7">
          <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-5">Destaques Espontâneos</h4>
          
          <div className="grid grid-cols-3 gap-3 md:gap-5">
            {processed.pods.map((pod, idx) => (
              <motion.div 
                key={pod.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "bg-white border border-zinc-100 rounded-[1.5rem] p-4 md:p-5 flex flex-col items-center justify-between h-[280px] md:h-[320px] relative group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-zinc-200",
                  idx === 0 && "border-orange-200 bg-orange-50/30"
                )}
              >
                <div className={cn(
                  "w-7 h-7 rounded-lg font-black flex items-center justify-center text-xs mb-3 shadow-sm",
                  idx === 0 ? "bg-orange-100 text-[#ea580c]" : "bg-zinc-100 text-zinc-500"
                )}>
                  {pod.rank}º
                </div>
                
                <h3 className={cn(
                  "text-sm font-bold text-center leading-tight truncate w-full",
                  idx === 0 ? "text-zinc-900" : "text-zinc-600"
                )}>
                  {pod.name}
                </h3>
                
                <div className="my-4">
                  <NumberCounter value={pod.pct} />
                </div>
                
                <div className={cn(
                  "w-full rounded-xl relative overflow-hidden flex-1 mt-2",
                  idx === 0 ? "bg-orange-100/50" : "bg-zinc-100"
                )}>
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${pod.pct > 0 ? (pod.pct / processed.pods[0].pct) * 100 : 0}%` }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      "absolute bottom-0 left-0 w-full rounded-xl",
                      idx === 0 
                        ? "bg-gradient-to-t from-[#c2410c] to-[#ea580c] shadow-[0_0_15px_rgba(234,88,12,0.3)]" 
                        : "bg-gradient-to-t from-zinc-400 to-zinc-300"
                    )}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Lado Direito: Indecisão e Outros */}
        <div className="col-span-1 lg:col-span-5 flex flex-col justify-between">
          
          {/* Box de Indecisão */}
          <div className="mb-8 bg-zinc-50/50 p-5 rounded-2xl border border-zinc-100">
            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-5">Indecisão e Brancos</h4>
            
            {processed.indecision.map((item, idx) => (
              <div key={item.name} className={cn(idx === 0 && "mb-4")}>
                <div className="flex justify-between text-[13px] font-bold text-zinc-600 mb-2">
                  <span>{item.name}</span>
                  <span className="text-zinc-800 text-sm">{item.pct.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2.5 bg-zinc-200/60 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    className={cn("h-full", idx === 0 ? "bg-zinc-400" : "bg-zinc-300")}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Lista de Outros Nomes */}
          <div>
            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Outros Nomes Lembrados</h4>
            <div className="space-y-1">
              {processed.others.map((item, idx) => (
                <div key={item.name} className="group p-2 -mx-2 rounded-xl transition-all duration-200 hover:bg-zinc-50 hover:translate-x-1">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold text-zinc-600">{item.name}</span>
                    <span className="text-xs font-bold text-zinc-800">{item.pct.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: idx * 0.05 }}
                      className={cn("h-full", item.pct > 1 ? "bg-orange-300" : "bg-zinc-300")}
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
