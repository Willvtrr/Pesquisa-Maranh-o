
"use client";

import React, { useMemo } from 'react';
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
};

const NumberCounter = ({ value, isSmall = false }: { value: number; isSmall?: boolean }) => {
  return (
    <span className={cn(
      "font-black tracking-tight transition-colors",
      isSmall ? "text-sm" : "text-2xl md:text-3xl"
    )}>
      {value.toFixed(1)}
      <span className={cn(
        "font-bold opacity-40 ml-0.5",
        isSmall ? "text-[10px]" : "text-xl md:text-2xl"
      )}>%</span>
    </span>
  );
};

export const GovernorSpontaneousChart = ({ data, total, filters, onFilterChange }: GovernorSpontaneousChartProps) => {
  const isSelected = (nome: string) => {
    return filters.gov_spontaneous?.includes(nome);
  };

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
            {[0, 1, 2].map((pos) => {
              const item = ranking[pos];
              const active = item ? isSelected(item.nome) : false;
              const photoUrl = item ? PHOTO_MAP[item.nome] : null;
              
              return (
                <motion.div 
                  key={pos}
                  whileHover={item ? { y: -5 } : {}}
                  onClick={() => item && onFilterChange('gov_spontaneous', item.nome)}
                  className={cn(
                    "bg-white border rounded-[1.5rem] p-4 md:p-5 flex flex-col items-center justify-between h-auto relative transition-all duration-300 cursor-pointer shadow-sm",
                    active ? "border-orange-500 bg-orange-50/30 ring-2 ring-orange-500/20" : "border-zinc-100 hover:border-zinc-200"
                  )}
                >
                  <div className={cn(
                    "w-7 h-7 rounded-lg font-black flex items-center justify-center text-xs mb-3 shadow-sm",
                    pos === 0 ? "bg-orange-100 text-[#ea580c]" : "bg-zinc-100 text-zinc-500"
                  )}>{pos + 1}º</div>
                  
                  <div className="text-center w-full mb-4">
                    <h3 className={cn(
                      "text-sm font-bold leading-tight truncate w-full transition-colors",
                      active ? "text-orange-900" : "text-zinc-800"
                    )}>{item?.nome || '-'}</h3>
                    {item?.party && (
                      <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-1 block">
                        ({item.party})
                      </span>
                    )}
                  </div>

                  <div className={cn("mb-6 transition-colors", active ? "text-orange-600" : "text-zinc-900")}>
                    <NumberCounter value={item?.porcentagem || 0} />
                  </div>

                  <div className="w-full aspect-square bg-zinc-100 rounded-[1.5rem] relative overflow-hidden group/photo border border-zinc-100/50">
                    {photoUrl ? (
                      <Image 
                        src={photoUrl} 
                        alt={item?.nome || "Foto"} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover/photo:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-zinc-300 uppercase">Foto</div>
                    )}
                    
                    {/* Barra Horizontal no Rodapé da Foto */}
                    <div className="absolute bottom-0 left-0 w-full h-2.5 bg-black/10 backdrop-blur-sm">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item ? (item.porcentagem / Math.max(ranking[0]?.porcentagem || 10, 1)) * 100 : 0}%` }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                        className={cn(
                          "h-full shadow-lg transition-colors",
                          active ? "bg-orange-500" : (pos === 0 ? "bg-orange-600" : "bg-zinc-400")
                        )} 
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="col-span-1 lg:col-span-5 flex flex-col justify-between">
          <div className="mb-8 bg-zinc-50/50 p-5 rounded-2xl border border-zinc-100">
            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-5">Indecisão e Brancos</h4>
            
            <div 
              className={cn("mb-4 cursor-pointer p-2 -m-2 rounded-xl transition-all", isSelected('NS/NR') ? "bg-orange-50/50" : "hover:bg-zinc-100/30")}
              onClick={() => onFilterChange('gov_spontaneous', 'NS/NR')}
            >
              <div className="flex justify-between text-[13px] font-bold text-zinc-600 mb-2">
                <span className={isSelected('NS/NR') ? "text-orange-600" : ""}>Não Sabe / Não Respondeu</span>
                <span className={cn("text-sm", isSelected('NS/NR') ? "text-orange-700" : "text-zinc-800")}>{indecisos.toFixed(1)}%</span>
              </div>
              <div className="w-full h-2.5 bg-zinc-200/60 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${indecisos}%` }}
                  className={cn("h-full transition-colors", isSelected('NS/NR') ? "bg-orange-500" : "bg-zinc-400")} 
                />
              </div>
            </div>

            <div 
              className={cn("cursor-pointer p-2 -m-2 rounded-xl transition-all", isSelected('Branco/Nulo') ? "bg-orange-50/50" : "hover:bg-zinc-100/30")}
              onClick={() => onFilterChange('gov_spontaneous', 'Branco/Nulo')}
            >
              <div className="flex justify-between text-[13px] font-bold text-zinc-600 mb-2">
                <span className={isSelected('Branco/Nulo') ? "text-orange-600" : ""}>Branco / Nulo</span>
                <span className={cn("text-sm", isSelected('Branco/Nulo') ? "text-orange-700" : "text-zinc-800")}>{brancos.toFixed(1)}%</span>
              </div>
              <div className="w-full h-2.5 bg-zinc-200/60 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${brancos}%` }}
                  className={cn("h-full transition-colors", isSelected('Branco/Nulo') ? "bg-orange-500" : "bg-zinc-300")} 
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Outros Nomes Lembrados</h4>
            <div className="space-y-1">
              {ranking.slice(3, 9).map((item, idx) => {
                const active = isSelected(item.nome);
                return (
                  <div 
                    key={item.nome} 
                    onClick={() => onFilterChange('gov_spontaneous', item.nome)}
                    className={cn(
                      "p-2 -mx-2 rounded-xl transition-all duration-200 cursor-pointer group",
                      active ? "bg-orange-50" : "hover:bg-zinc-50 hover:translate-x-1"
                    )}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className={cn("text-xs font-semibold transition-colors", active ? "text-orange-600" : "text-zinc-600")}>
                          {item.nome}
                        </span>
                        {item.party && (
                          <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">
                            ({item.party})
                          </span>
                        )}
                      </div>
                      <span className={cn("text-xs font-bold transition-colors", active ? "text-orange-700" : "text-zinc-800")}>
                        {item.porcentagem.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.porcentagem}%` }}
                        className={cn("h-full transition-colors", active ? "bg-orange-500" : (item.porcentagem > 1 ? "bg-orange-300" : "bg-zinc-300"))}
                      />
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
