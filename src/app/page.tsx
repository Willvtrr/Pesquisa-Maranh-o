"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { MesoRegion } from '@/data/survey-data';
import { StatCard } from '@/components/dashboard/stat-card';
import { InteractiveMap } from '@/components/dashboard/interactive-map';
import { FilterBentoBox } from '@/components/dashboard/filter-bento-box';
import { CandidateChart } from '@/components/dashboard/candidate-chart';
import { GovernorScenarioCard, SCENARIOS } from '@/components/dashboard/governor-scenario-chart';
import { VictoryPerceptionCard } from '@/components/dashboard/victory-perception-card';
import { GovernorSpontaneousChart } from '@/components/dashboard/governor-spontaneous-chart';
import { Database, RefreshCw, MapPin, Users, FileText, Map as MapIcon, ClipboardCheck, Loader2, Check, TrendingUp, MessageSquare, ArrowDownRight, AlertTriangle, X, ShieldAlert, Vote, Target } from 'lucide-react';
import { LuxuryCard } from '@/components/dashboard/luxury-card';
import { useSurvey } from '@/hooks/use-survey';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

// Mapeamento de Prefeitos
const CITY_MAYORS: Record<string, { name: string; gender: 'M' | 'F' }> = {
  'SÃO LUÍS': { name: 'Eduardo Braide', gender: 'M' },
  'SÃO JOSÉ DE RIBAMAR': { name: 'Dr. Julinho', gender: 'M' },
  'PAÇO DO LUMIAR': { name: 'Fred Campos', gender: 'M' },
  'RAPOSA': { name: 'Eudes Barros', gender: 'M' },
  'ALCÂNTARA': { name: 'Nivaldo Araújo', gender: 'M' },
  'BACABEIRA': { name: 'Naíra Gonçalo', gender: 'F' },
  'SANTA RITA': { name: 'Dr. Milton Gonçalo', gender: 'M' },
  'ROSÁRIO': { name: 'Jonas Magno', gender: 'M' },
  'PINHEIRO': { name: 'André da Ralpnet', gender: 'M' },
  'CURURUPU': { name: 'Aldo Lopes', gender: 'M' },
  'VIANA': { name: 'Carrinho Cidreira', gender: 'M' },
  'ITAPECURU MIRIM': { name: 'Filipe Marreca', gender: 'M' },
  'CHAPADINHA': { name: 'Belezinha', gender: 'F' },
  'BARREIRINHAS': { name: 'Vinicius Vale', gender: 'M' },
  'TUTÓIA': { name: 'Viriato Cardoso', gender: 'M' },
  'HUMBERTO DE CAMPOS': { name: 'Luis Fernando', gender: 'M' },
  'GUIMARÃES': { name: 'Magno', gender: 'M' },
  'MIRINZAL': { name: 'Deyvison do Posto', gender: 'M' },
  'PERI MIRIM': { name: 'Heliezer do Povo', gender: 'M' },
  'SANTA HELENA': { name: 'Joãozinho Pavão', gender: 'M' },
  'SÃO BENTO': { name: 'Dino Penha', gender: 'M' },
  'TURIAÇU': { name: 'Edésio Cavalcante', gender: 'M' },
  'ANAJATUBA': { name: 'Helder Aragão', gender: 'M' },
  'IMPERATRIZ': { name: 'Rildo Amaral', gender: 'M' },
  'AÇAILÂNDIA': { name: 'Dr. Benjamim', gender: 'M' },
  'GRAJAÚ': { name: 'Dr. Gilson Guerreiro', gender: 'M' },
  'BARRA DO CORDA': { name: 'Rigo Teles', gender: 'M' },
  'BURITICUPU': { name: 'João Carlos', gender: 'M' },
  'ESTREITO': { name: 'Léo Cunha', gender: 'M' },
  'PORTO FRANCO': { name: 'Deoclídes', gender: 'M' },
  'AMARANTE DO MARANHÃO': { name: 'Vanderly', gender: 'F' },
  'MONTES ALTOS': { name: 'Domingos França', gender: 'M' },
  'JOÃO LISBOA': { name: 'Dr. Fábio Holanda', gender: 'M' },
  'SENADOR LA ROCQUE': { name: 'Professor Bartolomeu', gender: 'M' },
  'DAVINÓPOLIS': { name: 'Zé Pequeno', gender: 'M' },
  'GOVERNADOR EDISON LOBÃO': { name: 'Fábio Soares', gender: 'M' },
  'PEDREIRAS': { name: 'Vanessa Maia', gender: 'F' },
  'PRESIDENTE DUTRA': { name: 'Raimundinho da Audiolar', gender: 'M' },
  'COLINAS': { name: 'Renato Santos', gender: 'M' },
  'SÃO MATEUS DO MARANHÃO': { name: 'Miltinho Aragão', gender: 'M' },
  'DOM PEDRO': { name: 'Galego Mota', gender: 'M' },
  'TUNTUM': { name: 'Fernando Pessoa', gender: 'M' },
  'GONÇALVES DIAS': { name: 'Suane Dias', gender: 'F' },
  'GOVERNADOR ARCHER': { name: 'Professora Leide', gender: 'F' },
  'CAXIAS': { name: 'Gentil Neto', gender: 'M' },
  'TIMON': { name: 'Rafael', gender: 'M' },
  'CODÓ': { name: 'Chiquinho FC', gender: 'M' },
  'COELHO NETO': { name: 'Bruno Silva', gender: 'M' },
  'ALDEIAS ALTAS': { name: 'Kedson', gender: 'M' },
  'PARNARAMA': { name: 'Juvenal Silva', gender: 'M' },
  'MATÕES': { name: 'Nonatinho', gender: 'M' },
  'SÃO FRANCISCO DO MARANHÃO': { name: 'Francisco do Posto', gender: 'M' },
  'BACABAL': { name: 'Roberto Costa', gender: 'M' },
  'COROATÁ': { name: 'Edimar Vaqueiro', gender: 'M' },
  'BALSAS': { name: 'Allan da Marissol', gender: 'M' },
  'CAROLINA': { name: 'Jayme Fonseca', gender: 'M' },
  'RIACHÃO': { name: 'Paula Coelho', gender: 'F' },
  'SÃO RAIMUNDO DAS MANGABEIRAS': { name: 'Accioly', gender: 'M' },
  'LORETO': { name: 'Germano Coelho', gender: 'M' },
  'SAMBAÍBA': { name: 'Fátima Dantas', gender: 'F' },
  'ALTO PARNAÍBA': { name: 'Rubens Japonês', gender: 'M' },
  'ALTO ALEGRE DO MARANHÃO': { name: 'Nilsilene do Liorne', gender: 'F' },
  'ARAIOSES': { name: 'Neto Carvalho', gender: 'M' },
  'ARAME': { name: 'Pedro Fernandes', gender: 'M' },
  'ARARI': { name: 'Simplesmente Maria', gender: 'F' },
  'BOM JARDIM': { name: 'Cristiane Varão', gender: 'F' },
  'BREJO': { name: 'Thâmara Castro', gender: 'F' },
  'BURITI': { name: 'André Gaúcho', gender: 'M' },
  'ICATU': { name: 'Wallace', gender: 'M' },
  'LAGO DA PEDRA': { name: 'Maura Jorge', gender: 'F' },
  'MIRANDA DO NORTE': { name: 'Ivaldo Ribeiro', gender: 'M' },
  'PENALVA': { name: 'Guerra', gender: 'M' },
  'PINDARÉ-MIRIM': { name: 'Dr. Alexandre', gender: 'M' },
  'SANTA INÊS': { name: 'Felipe dos Pneus', gender: 'M' },
  'SANTA LUZIA': { name: 'Jucelino Marreca', gender: 'M' },
  'SANTA QUITÉRIA DO MARANHÃO': { name: 'Sâmia Moreira', gender: 'F' },
  'SÃO BERNARDO': { name: 'Chico Carvalho', gender: 'M' },
  'SÃO DOMINGOS DO MARANHÃO': { name: 'Kleber Tratorzão', gender: 'M' },
  'TIMBIRAS': { name: 'Paulo Vinicius', gender: 'M' },
  'URBANO SANTOS': { name: 'Professor Clemilton Barros', gender: 'M' },
  'VARGEM GRANDE': { name: 'Preto', gender: 'M' },
  'VITÓRIA DO MEARIM': { name: 'Nato da Nordestina', gender: 'M' },
  'ZÉ DOCA': { name: 'Flavinha Cunha', gender: 'F' },
};

const PARTY_MAP: Record<string, string> = {
  // Federal
  'Lula': 'PT',
  'Jair Bolsonaro': 'PL',
  'Flávio Bolsonaro': 'PL',
  'Tarcísio de Freitas': 'REPUBLICANOS',
  'Ronaldo Caiado': 'UNIÃO',
  'Eduardo Leite': 'PSD',
  'Ciro Gomes': 'PDT',
  'Simone Tebet': 'MDB',
  'Ratinho Jr.': 'PSD',
  // Estadual
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

export const getCandidatePhoto = (name: string) => {
  const n = name.toLowerCase();
  if (n === 'lula' || n.includes('presidente lula')) return '/lula.jpg';
  if (n.includes('carlos brandão') || n.includes('carlos brandao') || n === 'brandão' || n === 'brandao') {
    return '/Retrato_Oficial_de_Carlos_Brandão_como_governador_do_Maranhão.jpg';
  }
  if (n === 'outros' || n.includes('ns/nr') || n.includes('ns/nr')) return 'https://picsum.photos/seed/outros/100/100';
  return `https://picsum.photos/seed/${name}/100/100`;
};

export const toTitleCase = (str: string) => {
  return str.toLowerCase().replace(/(?:^|\s)\w/g, (match) => match.toUpperCase());
};

const DEFAULT_KEYS = {
  CITY: "Cidade:",
  REGION: "Mesorregião",
  GENDER: "Gênero",
  AGE: "Faixa Etária",
  EDUCATION: "Grau de Instrução",
  INCOME: "Renda Familiar",
  RELIGION: "Religião",
  IDEOLOGY: "Você se considera de esquerda, centro ou direita?",
  GOV_APPROVAL: "De modo geral, você aprova ou desaprova o Governo do Governador Carlos Brandão?",
  PRESIDENT_APPROVAL: "De modo geral, você aprova ou desaprova o Governo do Presidente Lula?",
  MAYOR_APPROVAL: "De modo geral, você aprova ou desaprova o Governo do Prefeito da Cidade que você vota? ",
  PROBLEMS: "2. Na sua opinião, qual o problema mais grave que o Estado do Maranhão vem enfrentando atualmente? (Espontânea)",
  WORKS: "3. Na sua opinião, qual obra ou serviço você gostaria que fosse feito aqui na cidade? (Espontânea)",
  PRESIDENT_VOTE: "4. PRESIDENTE: Se as eleições para Presidente da República fossem hoje, in quem você votaria? (Estimulada)",
  PRESIDENT_SECOND_ROUND: "5. Num eventual segundo turno, para Presidente, entre estes, em quem você votaria? (Estimulada)",
  PRESIDENT_REJECTION: "6. REJEIÇÃO: Em quem você NÃO votaria de jeito nenhum para Presidente? (Estimulada)",
  GOV_VOTE_SPONTANEOUS: "7. GOVERNADOR: Se as eleições para Governador fossem hoje, em quem você votaria? (Espontânea)",
  GOV_REJECTION: "10. REJEIÇÃO: Em quem você NÃO votaria de jeito nenhum? (Estimulada)",
  GOV_VICTORY_PERCEPTION: "11. PERCEPÇÃO DE VITÓRIA: Quem você acha que ganhará a eleição para Governador do Maranhão? (Estimulada)",
};

export default function Home() {
  const { data: rawSurveyData, isLoading } = useSurvey();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredSecondRound, setHoveredSecondRound] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const [filters, setFilters] = useState<Record<string, string[]>>({
    region: ['all'],
    city: ['all'],
    age: ['all'],
    gender: ['all'],
    education: ['all'],
    income: ['all'],
    religion: ['all'],
    ideology: ['all'],
    problem: ['all'],
    work: ['all'],
    gov_spontaneous: ['all']
  });

  const activeKeys = useMemo(() => {
    if (!rawSurveyData || rawSurveyData.length === 0) return DEFAULT_KEYS;
    const sample = rawSurveyData.find(d => !d.INFO) || {};
    const keys = Object.keys(sample);

    const findKey = (keywords: string[], fallback: string, exclude: string[] = []) => {
      const exact = keys.find(k => k.toLowerCase() === keywords[0].toLowerCase());
      if (exact) return exact;

      const found = keys.find(k => 
        keywords.every(kw => k.toLowerCase().includes(kw.toLowerCase())) &&
        !exclude.some(ex => k.toLowerCase().includes(ex.toLowerCase()))
      );
      return found || fallback;
    };

    return {
      ...DEFAULT_KEYS,
      CITY: findKey(['cidade'], DEFAULT_KEYS.CITY, ['aprova', 'desaprova', 'governo', 'presidente', 'votar', 'grave', 'problema', 'enfrentando', 'obra', 'serviço', 'gostaria', 'feito']),
      REGION: findKey(['mesorregião'], DEFAULT_KEYS.REGION),
      GENDER: findKey(['gênero'], DEFAULT_KEYS.GENDER),
      AGE: findKey(['etária'], DEFAULT_KEYS.AGE),
      EDUCATION: findKey(['instrução'], DEFAULT_KEYS.EDUCATION),
      INCOME: findKey(['renda'], DEFAULT_KEYS.INCOME),
      RELIGION: findKey(['religião'], DEFAULT_KEYS.RELIGION),
      IDEOLOGY: findKey(['esquerda', 'centro', 'direita', 'considera'], DEFAULT_KEYS.IDEOLOGY),
      GOV_APPROVAL: findKey(['aprova', 'governador'], DEFAULT_KEYS.GOV_APPROVAL),
      PRESIDENT_APPROVAL: findKey(['aprova', 'presidente'], DEFAULT_KEYS.PRESIDENT_APPROVAL),
      MAYOR_APPROVAL: findKey(['aprova', 'prefeito'], DEFAULT_KEYS.MAYOR_APPROVAL),
      PROBLEMS: findKey(['problema', 'grave'], DEFAULT_KEYS.PROBLEMS),
      WORKS: findKey(['obra', 'serviço', 'gostaria'], DEFAULT_KEYS.WORKS),
      PRESIDENT_VOTE: findKey(['4. PRESIDENTE', 'votaria'], DEFAULT_KEYS.PRESIDENT_VOTE),
      PRESIDENT_SECOND_ROUND: findKey(['5. Num eventual segundo turno'], DEFAULT_KEYS.PRESIDENT_SECOND_ROUND),
      PRESIDENT_REJECTION: findKey(['6. REJEIÇÃO'], DEFAULT_KEYS.PRESIDENT_REJECTION),
      GOV_VOTE_SPONTANEOUS: findKey(['7. GOVERNADOR', 'espontânea'], DEFAULT_KEYS.GOV_VOTE_SPONTANEOUS),
      GOV_REJECTION: findKey(['10. REJEIÇÃO'], DEFAULT_KEYS.GOV_REJECTION),
      GOV_VICTORY_PERCEPTION: findKey(['11. PERCEPÇÃO DE VITÓRIA'], DEFAULT_KEYS.GOV_VICTORY_PERCEPTION),
    };
  }, [rawSurveyData]);

  const filteredData = useMemo(() => {
    if (!rawSurveyData) return [];
    return rawSurveyData.filter(item => {
      if (item.INFO) return false;
      const checkMatch = (filterKey: string, dataKey: string) => {
        const currentFilters = filters[filterKey];
        if (!currentFilters || currentFilters.includes('all')) return true;
        const itemVal = String(item[dataKey] || '').trim();
        return currentFilters.includes(itemVal);
      };
      return (
        checkMatch('region', activeKeys.REGION) &&
        checkMatch('city', activeKeys.CITY) &&
        checkMatch('age', activeKeys.AGE) &&
        checkMatch('gender', activeKeys.GENDER) &&
        checkMatch('education', activeKeys.EDUCATION) &&
        checkMatch('income', activeKeys.INCOME) &&
        checkMatch('religion', activeKeys.RELIGION) &&
        checkMatch('ideology', activeKeys.IDEOLOGY) &&
        checkMatch('problem', activeKeys.PROBLEMS) &&
        checkMatch('work', activeKeys.WORKS) &&
        checkMatch('gov_spontaneous', activeKeys.GOV_VOTE_SPONTANEOUS)
      );
    });
  }, [filters, rawSurveyData, activeKeys]);

  const totalDatabaseCount = useMemo(() => filteredData.length || 0, [filteredData]);

  const statsLula = useMemo(() => calculateApproval(filteredData, activeKeys.PRESIDENT_APPROVAL), [filteredData, activeKeys.PRESIDENT_APPROVAL]);
  const statsBrandao = useMemo(() => calculateApproval(filteredData, activeKeys.GOV_APPROVAL), [filteredData, activeKeys.GOV_APPROVAL]);
  const statsPrefeito = useMemo(() => calculateApproval(filteredData, activeKeys.MAYOR_APPROVAL), [filteredData, activeKeys.MAYOR_APPROVAL]);

  const mayorInfo = useMemo(() => {
    const activeCities = filters.city;
    if (activeCities.length === 1 && activeCities[0] !== 'all') {
      const cityUpper = activeCities[0].toUpperCase().trim();
      const info = CITY_MAYORS[cityUpper];
      if (info) {
        const prefix = info.gender === 'F' ? 'Prefa.' : 'Pref.';
        return {
          displayName: `${prefix} ${info.name}`,
          party: PARTY_MAP[info.name] || null
        };
      }
      return { displayName: `Prefeito(a) de ${activeCities[0]}`, party: null };
    }
    return { displayName: "Prefeito(a)", party: null };
  }, [filters.city]);

  const chartData = useMemo(() => {
    const processRanking = (key: string) => {
      if (!filteredData || filteredData.length === 0) return [];
      
      const counts: Record<string, number> = {};
      let nsnrCount = 0;
      let brancoCount = 0;

      const nsnrKeywords = ["ns/nr", "não sabe", "não respondeu", "não opinou", "indeciso", "nsnr", "outros"];
      const brancoKeywords = ["branco", "nulo", "nenhum", "ninguém"];

      filteredData.forEach(d => {
        const val = String(d[key] || '').trim();
        if (!val || val === 'all') return;

        const lowerVal = val.toLowerCase();
        if (nsnrKeywords.some(kw => lowerVal.includes(kw))) {
          nsnrCount += 1;
        } else if (brancoKeywords.some(kw => lowerVal.includes(kw))) {
          brancoCount += 1;
        } else {
          counts[val] = (counts[val] || 0) + 1;
        }
      });

      const candidates = Object.entries(counts).map(([name, value]) => ({ 
        name, 
        value,
        party: PARTY_MAP[name] || null,
        isAbstention: false
      })).sort((a, b) => b.value - a.value);

      const abstentions = [];
      if (nsnrCount > 0) {
        abstentions.push({ name: 'Ns/nr', value: nsnrCount, party: null, isAbstention: true });
      }
      if (brancoCount > 0) {
        abstentions.push({ name: 'Branco / Nulo', value: brancoCount, party: null, isAbstention: true });
      }

      return [...candidates, ...abstentions];
    };

    return {
      candidateData: processRanking(activeKeys.PRESIDENT_VOTE),
      govSpontaneousData: processRanking(activeKeys.GOV_VOTE_SPONTANEOUS), 
      govVictoryData: processRanking(activeKeys.GOV_VICTORY_PERCEPTION),
      rejectionData: processRanking(activeKeys.PRESIDENT_REJECTION),
      secondRoundData: processRanking(activeKeys.PRESIDENT_SECOND_ROUND),
    };
  }, [filteredData, activeKeys]);

  const dynamicOptions = useMemo(() => {
    const options: Record<string, string[]> = {
      region: [], city: [], age: [], gender: [], education: [], income: [], religion: [], ideology: []
    };
    if (!rawSurveyData) return options;

    const getUniques = (key: string) => {
      const vals = new Set<string>();
      rawSurveyData.forEach(item => {
        const val = String(item[key] || '').trim();
        if (val && val !== 'all' && val !== 'NS/NR' && !item.INFO) vals.add(val);
      });
      return Array.from(vals).sort();
    };

    options.region = getUniques(activeKeys.REGION);
    options.city = getUniques(activeKeys.CITY);
    options.age = getUniques(activeKeys.AGE);
    options.gender = getUniques(activeKeys.GENDER);
    options.education = getUniques(activeKeys.EDUCATION);
    options.income = getUniques(activeKeys.INCOME);
    options.religion = getUniques(activeKeys.RELIGION);
    options.ideology = getUniques(activeKeys.IDEOLOGY);
    return options;
  }, [rawSurveyData, activeKeys]);

  const distributionStats = useMemo(() => {
    const stats: Record<string, Record<string, number>> = {};
    const totalCount = filteredData.length;
    if (totalCount === 0) return stats;

    const keys = {
      region: activeKeys.REGION,
      gender: activeKeys.GENDER,
      age: activeKeys.AGE,
      income: activeKeys.INCOME,
      ideology: activeKeys.IDEOLOGY,
      education: activeKeys.EDUCATION,
      religion: activeKeys.RELIGION,
    };

    Object.entries(keys).forEach(([filterKey, dataKey]) => {
      const counts: Record<string, number> = {};
      filteredData.forEach(item => {
        const val = String(item[dataKey] || '').trim();
        if (val) counts[val] = (counts[val] || 0) + 1;
      });
      
      stats[filterKey] = {};
      Object.entries(counts).forEach(([val, count]) => {
        stats[filterKey][val] = (count / totalCount) * 100;
      });
    });

    return stats;
  }, [filteredData, activeKeys]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => {
      const currentValues = prev[key] || [];
      if (value === 'all') return { ...prev, [key]: ['all'] };
      let newValues;
      if (currentValues.includes(value)) {
        newValues = currentValues.filter(v => v !== value);
        if (newValues.length === 0) newValues = ['all'];
      } else {
        newValues = [...currentValues.filter(v => v !== 'all'), value];
      }
      return { ...prev, [key]: newValues };
    });
  };

  const clearFilters = () => setFilters({ 
    region: ['all'], city: ['all'], age: ['all'], gender: ['all'], education: ['all'], income: ['all'], religion: ['all'], ideology: ['all'],
    problem: ['all'], work: ['all'], gov_spontaneous: ['all']
  });

  const handleManualSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSyncing(false);
    toast({ title: "Sincronização Ativa", description: "Os dados foram atualizados em tempo real com o Google Cloud." });
  };

  if (isLoading && rawSurveyData.length === 0) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sincronizando Banco de Dados...</p>
        </div>
      </AppLayout>
    );
  }

  const actualCityCountInDb = dynamicOptions.city.length;
  const coveragePercent = ((actualCityCountInDb / 217) * 100).toFixed(1);

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          <div className="xl:col-span-5 space-y-4 lg:pt-2">
            <div className="flex items-center gap-3 mb-1">
              <div className="flex gap-1.5 items-center">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="relative w-2 h-2">
                    <motion.div
                      animate={{ opacity: [0, 1, 0], scale: [0.8, 1.4, 0.8], backgroundColor: ["#f97316", "#ea580c", "#f97316"] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
                      className="absolute inset-0 rounded-full shadow-[0_0_10px_rgba(234,88,12,0.6)]"
                    />
                    <div className="w-full h-full rounded-full bg-zinc-200 opacity-30" />
                  </div>
                ))}
              </div>
              <div className="text-[10px] font-black text-orange-600 uppercase tracking-[0.4em]">Monitoramento em tempo real</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-4 flex-wrap whitespace-nowrap">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-950 leading-none">Maranhão</h1>
                <MaranhaoFlag />
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-zinc-950/80 leading-tight">Mapeamento de votos</h2>
            </div>
            <p className="text-zinc-500 font-medium text-sm md:text-base leading-relaxed">App de inteligência política e monitoramento de dados eleitorais.</p>
          </div>
          <div className="xl:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3 items-stretch h-[240px]">
            <div className="relative bg-[#09090b] rounded-[2rem] p-4 flex flex-col group shadow-2xl border border-zinc-800 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-orange-500"><Database size={14} /></div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-100">
                  <div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-[6px] font-black tracking-[0.2em] text-zinc-300 uppercase">Cloud Ativo</span>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-[7px] font-black tracking-[0.2em] text-zinc-500 uppercase mb-0.5">Base de Inteligência</p>
                <h3 className="text-sm font-black text-white">Banco de Dados</h3>
                <p className="text-[8px] font-medium text-zinc-400"><span className="text-orange-500 font-black">{totalDatabaseCount.toLocaleString('pt-BR')}</span> Registros na Nuvem</p>
              </div>
              <div className="bg-zinc-900/40 rounded-xl p-2 h-[45px] overflow-y-auto mb-4 log-scroll border border-zinc-800/40">
                <ul className="space-y-1 text-[6px] font-mono">
                  <li className="flex items-center gap-2 text-zinc-400"><Check size={8} className="text-orange-500" /><span>ID: {totalDatabaseCount} - Sincronizado</span></li>
                  <li className="flex items-center gap-2 text-zinc-400"><Check size={8} className="text-orange-500" /><span>Monitoramento v3.5 Ativo</span></li>
                </ul>
              </div>
              <button onClick={handleManualSync} disabled={isSyncing} className="mt-auto w-full flex items-center justify-center gap-2 py-2 rounded-xl font-black text-[8px] uppercase tracking-widest bg-white hover:bg-zinc-100 text-zinc-950 shadow-xl transition-all active:scale-95">
                {isSyncing ? <Loader2 className="animate-spin w-2.5 h-2.5" /> : <RefreshCw size={10} />}
                <span>Sincronizar Agora</span>
              </button>
            </div>
            <div className="bg-white rounded-[2rem] p-4 flex flex-col shadow-xl border border-zinc-100 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-zinc-50 text-zinc-400"><FileText size={14} /></div>
                  <h4 className="text-[7px] font-black tracking-0.2em text-zinc-500 uppercase">Número de Coletas</h4>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-baseline gap-1">
                  <h2 className="text-2xl font-black tracking-tighter text-zinc-950 leading-none">
                    {totalDatabaseCount.toLocaleString('pt-BR')}
                  </h2>
                  <span className="text-lg font-black text-zinc-400">/ 20.000</span>
                </div>
                <div className="flex gap-0.5 mt-8">
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-4 flex-1 rounded-full ${i < (totalDatabaseCount / 20000) * 6 ? 'bg-orange-500' : 'bg-zinc-100'}`} 
                    />
                  ))}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[6px] font-black text-zinc-400 uppercase tracking-widest">Sincronizado</span>
              </div>
            </div>
            <div className="bg-orange-600 rounded-[2rem] p-4 flex flex-col text-white shadow-xl border border-orange-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-[40px] rounded-full pointer-events-none -mr-8 -mt-8"></div>
              <div className="relative z-10 flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-white/20 border border-white/30 text-white backdrop-blur-md"><MapIcon size={14} /></div>
                  <h4 className="text-[7px] font-black tracking-0.2em text-orange-100 uppercase">Municípios na Base</h4>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center relative z-10">
                <div className="flex items-baseline gap-1">
                  <h2 className="text-2xl font-black tracking-tighter leading-none">{actualCityCountInDb}</h2>
                  <span className="text-lg font-black opacity-60">/ 217</span>
                </div>
                <p className="text-[7px] font-black uppercase tracking-widest mt-6 opacity-80">Maranhão • Cobertura {coveragePercent}%</p>
              </div>
              <div className="mt-auto flex items-center justify-between relative z-10">
                <span className="text-[6px] font-black text-white uppercase tracking-widest">Sincronizado</span>
              </div>
            </div>
            <div className="bg-[#09090b] rounded-[2rem] p-4 flex flex-col text-white shadow-2xl border border-zinc-800 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-orange-500"><ClipboardCheck size={14} /></div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-100">
                  <div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-[6px] font-black tracking-[0.2em] text-zinc-300 uppercase">Auditado</span>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-[7px] font-black tracking-[0.2em] text-zinc-500 uppercase mb-0.5">Qualidade da Base</p>
                <h3 className="text-sm font-black text-white">Integridade de Dados</h3>
                <div className="flex gap-1 mt-2">
                  <div className="h-1 flex-[2] rounded-full bg-orange-500"></div>
                  <div className="h-1 flex-1 rounded-full bg-emerald-500"></div>
                  <div className="h-1 flex-1 rounded-full bg-emerald-500"></div>
                </div>
              </div>
              <div className="mt-auto bg-[#121214] border border-zinc-800/60 rounded-2xl p-3">
                <p className="text-[7px] font-black uppercase tracking-widest text-zinc-400">Status: Operacional</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard title="APROVAÇÃO DE GESTÃO" subtitle="Pres. Lula" party="PT" value={`${statsLula.aprova}%`} imageUrl="/lula.jpg" subValue="FEDERAL" breakdown={[{ name: 'Aprova', value: Number(statsLula.aprova) }, { name: 'Desaprova', value: Number(statsLula.desaprova) }, { name: 'NS/NR', value: Number(statsLula.nsnr) }]} />
              <StatCard title="APROVAÇÃO DE GESTÃO" subtitle="Gov. Carlos Brandão" party="PSB" value={`${statsBrandao.aprova}%`} imageUrl="/Retrato_Oficial_de_Carlos_Brandão_como_governador_do_Maranhão.jpg" subValue="ESTADUAL" breakdown={[{ name: 'Aprova', value: Number(statsBrandao.aprova) }, { name: 'Desaprova', value: Number(statsBrandao.desaprova) }, { name: 'NS/NR', value: Number(statsBrandao.nsnr) }]} />
              <StatCard title="APROVAÇÃO DE GESTÃO" subtitle={mayorInfo.displayName} party={mayorInfo.party} value={`${statsPrefeito.aprova}%`} imageUrl="/bandeiracerta.jpg" subValue="MUNICIPAL" breakdown={[{ name: 'Aprova', value: Number(statsPrefeito.aprova) }, { name: 'Desaprova', value: Number(statsPrefeito.desaprova) }, { name: 'NS/NR', value: Number(statsPrefeito.nsnr) }]} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CandidateChart data={chartData.candidateData} total={totalDatabaseCount} />
              <GovernorSpontaneousChart data={chartData.govSpontaneousData} total={totalDatabaseCount} filters={filters} onFilterChange={handleFilterChange} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <LuxuryCard className="h-full">
                <div className="flex items-start justify-between mb-1">
                  <div className="space-y-0.5">
                    <h4 className="text-[7px] font-black text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-2">
                      <span className="w-1 h-3 bg-orange-600 rounded-full" />
                      DISPUTA PRESIDENCIAL
                    </h4>
                    <p className="text-base font-black text-zinc-950 tracking-tight leading-tight">Eventual 2º Turno</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-50 border border-zinc-100 shrink-0 shadow-sm mt-1">
                    <div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" />
                    <span className="text-[6px] font-black text-zinc-400 uppercase tracking-widest">ESTIMULADA</span>
                  </div>
                </div>
                <p className="text-[8px] font-medium text-zinc-400 italic mb-6">"Num eventual segundo turno..."</p>
                <div 
                  className="space-y-4"
                  onMouseLeave={() => setHoveredSecondRound(null)}
                >
                  {chartData.secondRoundData.map((item, idx) => {
                    const pct = ((item.value / Math.max(totalDatabaseCount, 1)) * 100);
                    const isAbstention = item.isAbstention;
                    const displayName = toTitleCase(item.name);
                    const isFaded = hoveredSecondRound !== null && hoveredSecondRound !== idx;
                    
                    return (
                      <div 
                        key={`${item.name}-${idx}`} 
                        className={cn(
                          "flex items-center gap-3 group/row cursor-pointer transition-all duration-300",
                          hoveredSecondRound === idx && "translate-x-1"
                        )}
                        onMouseEnter={() => setHoveredSecondRound(idx)}
                      >
                        <Avatar className={cn(
                          "w-8 h-8 border-2 border-white shadow-sm shrink-0 transition-all",
                          isFaded && "opacity-40 grayscale"
                        )}>
                          <AvatarImage src={getCandidatePhoto(item.name)} />
                          <AvatarFallback className="bg-zinc-100 text-[8px] font-bold text-zinc-400">
                            {isAbstention ? (item.name.toLowerCase().includes('ns') ? 'NS' : 'N/B') : item.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-end">
                            <div className="flex flex-col justify-center min-w-0">
                              <span className={cn(
                                "text-[10px] tracking-tight leading-tight transition-colors",
                                idx < 2 && !isAbstention ? "font-black text-zinc-950" : "font-bold text-zinc-500",
                                isFaded && "text-zinc-300"
                              )}>
                                {displayName}
                              </span>
                              {item.party && (
                                <span className={cn(
                                  "text-[6px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5",
                                  isFaded && "text-zinc-200"
                                )}>
                                  ({item.party})
                                </span>
                              )}
                            </div>
                            <span className={cn(
                              "text-[10px] font-black leading-none transition-colors",
                              isFaded ? "text-zinc-300" : (idx < 2 && !isAbstention ? "text-zinc-950" : "text-zinc-400"),
                              hoveredSecondRound === idx && "text-orange-600"
                            )}>
                              {pct.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-zinc-50 rounded-full border border-zinc-100 overflow-hidden group-hover/row:border-orange-100 transition-colors">
                            <motion.div 
                              initial={{ width: 0 }} 
                              animate={{ 
                                width: `${pct}%`,
                                filter: isFaded ? 'grayscale(80%) opacity(40%)' : 'none',
                              }} 
                              transition={{ duration: 1.2 }} 
                              className={cn(
                                "h-full rounded-full transition-all",
                                idx < 2 && !isAbstention 
                                  ? "bg-gradient-to-r from-[#f27e46] to-[#c44d15]" 
                                  : "bg-zinc-200"
                              )} 
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </LuxuryCard>

              <VictoryPerceptionCard 
                data={chartData.govVictoryData} 
                total={totalDatabaseCount} 
              />

              <GovernorScenarioCard scenario={SCENARIOS[0]} />
              <GovernorScenarioCard scenario={SCENARIOS[1]} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RejectionPillChart 
                data={chartData.rejectionData} 
                total={totalDatabaseCount} 
                overline="Teto Eleitoral Federal"
                title="Índice de Rejeição"
                subtitle='"REJEIÇÃO: Em quem você NÃO votaria de jeito nenhum?"'
                badge="Estimulada"
                color="rose"
                isMounted={isMounted}
              />
              <RejectionPillChart 
                data={chartData.govSpontaneousData} 
                total={totalDatabaseCount} 
                overline="Teto Eleitoral Estadual"
                title="Índice de Rejeição"
                subtitle='"REJEIÇÃO: Em quem você NÃO votaria de jeito nenhum?"'
                badge="Estimulada"
                color="red"
                isMounted={isMounted}
              />
            </div>

            <div className="w-full">
              <InteractiveMap stats={filteredData.reduce((acc, curr) => { const r = String(curr[activeKeys.REGION] || '').trim() as MesoRegion; if (r) acc[r] = (acc[r] || 0) + 1; return acc; }, {} as Record<MesoRegion, number>)} activeRegion={filters.region[0] === 'all' ? 'all' : filters.region[0]} onRegionSelect={(r) => handleFilterChange('region', r || 'all')} />
            </div>
          </div>
          
          <div className="xl:col-span-1">
            <FilterBentoBox filters={filters} options={dynamicOptions} distribution={distributionStats} onFilterChange={handleFilterChange} onClear={clearFilters} className="h-full" />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function calculateApproval(data: any[], questionKey: string) {
  if (!data || data.length === 0) return { aprova: "0.0", desaprova: "0.0", nsnr: "0.0" };
  
  let aprova = 0, desaprova = 0, nsnr = 0;
  const total = data.length;

  data.forEach(row => {
    const answer = String(row[questionKey] || '').trim().toLowerCase();
    if (answer === "aprova") aprova++;
    else if (answer === "desaprova") desaprova++;
    else nsnr++;
  });

  return {
    aprova: ((aprova / total) * 100).toFixed(1),
    desaprova: ((desaprova / total) * 100).toFixed(1),
    nsnr: ((nsnr / total) * 100).toFixed(1)
  };
}

const RejectionPillChart = ({ 
  data, total, title, overline, subtitle, badge, color, isMounted 
}: any) => {
  const overlineColor = color === 'red' ? 'bg-[#dc2626]' : 'bg-[#e11d48]';
  const gradColor = color === 'red' 
    ? 'from-[#ef4444] to-[#b91c1c]' 
    : 'from-[#f43f5e] to-[#be123c]';

  return (
    <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 flex flex-col h-full shadow-sm border border-zinc-100">
      <header className="flex justify-between items-start mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className={cn("w-1 h-4 rounded-full", overlineColor)} />
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em]">{overline}</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tighter">{title}</h1>
          <p className="text-[11px] font-medium text-zinc-400 italic">{subtitle}</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-50 border border-zinc-100 shrink-0 shadow-sm mt-1">
          <div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[7px] font-black text-zinc-400 uppercase tracking-widest">{badge}</span>
        </div>
      </header>

      <div className="flex justify-between items-start gap-4 flex-1 border-b border-zinc-50 pb-6 overflow-x-auto no-scrollbar">
        {data.map((item: any, idx: number) => {
          const pct = total > 0 ? (item.value / total) * 100 : 0;
          const isAbstention = item.isAbstention;

          return (
            <div key={idx} className="flex flex-col items-center min-w-[80px]">
              <div className="w-8 h-[140px] bg-[#f1f5f9] border border-[#e2e8f0] rounded-full flex flex-col justify-end p-1 mb-3 shadow-inner overflow-hidden">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: isMounted ? `${pct}%` : 0 }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
                  className={cn(
                    "w-full rounded-full transition-all bg-gradient-to-b",
                    "min-h-[4px]", 
                    isAbstention ? "from-slate-200 to-slate-400" : gradColor
                  )}
                />
              </div>

              <span className="text-[13px] font-black text-zinc-950 mb-4">{pct.toFixed(1)}%</span>

              <div className="flex flex-col items-center text-center gap-2">
                <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                  <AvatarImage src={getCandidatePhoto(item.name)} className="object-cover" />
                  <AvatarFallback className="bg-zinc-50 text-[10px] font-bold text-zinc-400 uppercase">
                    {isAbstention ? (item.name.toLowerCase().includes('ns') ? 'NS' : 'N/B') : item.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-h-[2.5rem] flex flex-col justify-center">
                  <p className="text-[9px] font-black text-zinc-900 leading-tight uppercase tracking-tight">
                    {item.name.split(' ')[0]}<br />
                    {item.name.split(' ')[1] || ''}
                  </p>
                  {item.party && (
                    <p className="text-[8px] font-bold text-zinc-400 uppercase mt-0.5">({item.party})</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MaranhaoFlag = () => (
  <svg width="24" height="16" viewBox="0 0 27 18" className="rounded-sm shadow-md ring-1 ring-zinc-200/50 md:w-[64px] md:h-[42px]">
    <rect width="27" height="2" y="0" fill="#E20613" />
    <rect width="27" height="2" y="2" fill="#FFFFFF" />
    <rect width="27" height="2" y="4" fill="#000000" />
    <rect width="27" height="2" y="6" fill="#E20613" />
    <rect width="27" height="2" y="8" fill="#FFFFFF" />
    <rect width="27" height="2" y="10" fill="#000000" />
    <rect width="27" height="2" y="12" fill="#E20613" />
    <rect width="27" height="2" y="14" fill="#FFFFFF" />
    <rect width="27" height="2" y="16" fill="#000000" />
    <rect width="11" height="8" fill="#004185" />
    <path d="M5.5 1.5l.7 2h2.1l-1.7 1.2.7 2.1-1.8-1.3-1.8 1.3.7-2.1-1.7-1.2h2.1z" fill="#fff" />
  </svg>
);
