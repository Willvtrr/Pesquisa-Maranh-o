
"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { MesoRegion } from '@/data/survey-data';
import { StatCard } from '@/components/dashboard/stat-card';
import { InteractiveMap } from '@/components/dashboard/interactive-map';
import { FilterBentoBox } from '@/components/dashboard/filter-bento-box';
import { ApprovalChart } from '@/components/dashboard/approval-chart';
import { CandidateChart } from '@/components/dashboard/candidate-chart';
import { GovernorScenarioChart } from '@/components/dashboard/governor-scenario-chart';
import { Database, RefreshCw, MapPin, Users, FileText, Map as MapIcon, ClipboardCheck, Loader2, Check, TrendingUp, MessageSquare, ArrowDownRight, AlertTriangle, X, ShieldAlert, Vote } from 'lucide-react';
import { LuxuryCard } from '@/components/dashboard/luxury-card';
import { useSurvey } from '@/hooks/use-survey';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Mapeamento de Prefeitos (Inteligência de Dados Atualizada)
const CITY_MAYORS: Record<string, string> = {
  'SÃO LUÍS': 'Eduardo Braide',
  'SÃO JOSÉ DE RIBAMAR': 'Dr. Julinho',
  'PAÇO DO LUMIAR': 'Fred Campos',
  'RAPOSA': 'Eudes Barros',
  'ALCÂNTARA': 'Nivaldo Araújo',
  'BACABEIRA': 'Naíra Gonçalo',
  'SANTA RITA': 'Dr. Milton Gonçalo',
  'ROSÁRIO': 'Jonas Magno',
  'PINHEIRO': 'André da Ralpnet',
  'CURURUPU': 'Aldo Lopes',
  'VIANA': 'Carrinho Cidreira',
  'ITAPECURU MIRIM': 'Filipe Marreca',
  'CHAPADINHA': 'Belezinha',
  'BARREIRINHAS': 'Vinicius Vale',
  'TUTÓIA': 'Viriato Cardoso',
  'HUMBERTO DE CAMPOS': 'Luis Fernando',
  'GUIMARÃES': 'Magno',
  'MIRINZAL': 'Deyvison do Posto',
  'PERI MIRIM': 'Heliezer do Povo',
  'SANTA HELENA': 'Joãozinho Pavão',
  'SÃO BENTO': 'Dino Penha',
  'TURIAÇU': 'Edésio Cavalcante',
  'ANAJATUBA': 'Helder Aragão',
  'IMPERATRIZ': 'Rildo Amaral',
  'AÇAILÂNDIA': 'Dr. Benjamim',
  'GRAJAÚ': 'Dr. Gilson Guerreiro',
  'BARRA DO CORDA': 'Rigo Teles',
  'BURITICUPU': 'João Carlos',
  'ESTREITO': 'Léo Cunha',
  'PORTO FRANCO': 'Deoclídes',
  'AMARANTE DO MARANHÃO': 'Vanderly',
  'MONTES ALTOS': 'Domingos França',
  'JOÃO LISBOA': 'Dr. Fábio Holanda',
  'SENADOR LA ROCQUE': 'Professor Bartolomeu',
  'DAVINÓPOLIS': 'Zé Pequeno',
  'GOVERNADOR EDISON LOBÃO': 'Fábio Soares',
  'PEDREIRAS': 'Vanessa Maia',
  'PRESIDENTE DUTRA': 'Raimundinho da Audiolar',
  'COLINAS': 'Renato Santos',
  'SÃO MATEUS DO MARANHÃO': 'Miltinho Aragão',
  'DOM PEDRO': 'Galego Mota',
  'TUNTUM': 'Fernando Pessoa',
  'GONÇALVES DIAS': 'Suane Dias',
  'GOVERNADOR ARCHER': 'Professora Leide',
  'CAXIAS': 'Gentil Neto',
  'TIMON': 'Rafael',
  'CODÓ': 'Chiquinho FC',
  'COELHO NETO': 'Bruno Silva',
  'ALDEIAS ALTAS': 'Kedson',
  'PARNARAMA': 'Juvenal Silva',
  'MATÕES': 'Nonatinho',
  'SÃO FRANCISCO DO MARANHÃO': 'Francisco do Posto',
  'BACABAL': 'Roberto Costa',
  'COROATÁ': 'Edimar Vaqueiro',
  'BALSAS': 'Allan da Marissol',
  'CAROLINA': 'Jayme Fonseca',
  'RIACHÃO': 'Paula Coelho',
  'SÃO RAIMUNDO DAS MANGABEIRAS': 'Accioly',
  'LORETO': 'Germano Coelho',
  'SAMBAÍBA': 'Fátima Dantas',
  'ALTO PARNAÍBA': 'Rubens Japonês',
  'ALTO ALEGRE DO MARANHÃO': 'Nilsilene do Liorne',
  'ARAIOSES': 'Neto Carvalho',
  'ARAME': 'Pedro Fernandes',
  'ARARI': 'Simplesmente Maria',
  'BOM JARDIM': 'Cristiane Varão',
  'BREJO': 'Thâmara Castro',
  'BURITI': 'André Gaúcho',
  'ICATU': 'Wallace',
  'LAGO DA PEDRA': 'Maura Jorge',
  'MIRANDA DO NORTE': 'Ivaldo Ribeiro',
  'PENALVA': 'Guerra',
  'PINDARÉ-MIRIM': 'Dr. Alexandre',
  'SANTA INÊS': 'Felipe dos Pneus',
  'SANTA LUZIA': 'Jucelino Marreca',
  'SANTA QUITÉRIA DO MARANHÃO': 'Sâmia Moreira',
  'SÃO BERNARDO': 'Chico Carvalho',
  'SÃO DOMINGOS DO MARANHÃO': 'Kleber Tratorzão',
  'TIMBIRAS': 'Paulo Vinicius',
  'URBANO SANTOS': 'Professor Clemilton Barros',
  'VARGEM GRANDE': 'Preto',
  'VITÓRIA DO MEARIM': 'Nato da Nordestina',
  'ZÉ DOCA': 'Flavinha Cunha',
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
  PROBLEMS: "2. Na sua opinião, qual o problem mais grave que o Estado do Maranhão vem enfrentando atualmente? (Espontânea)",
  WORKS: "3. Na sua opinião, qual obra ou serviço você gostaria que fosse feito aqui na cidade? (Espontânea)",
  PRESIDENT_VOTE: "4. PRESIDENTE: Se as eleições para Presidente da República fossem hoje, em quem você votaria? (Estimulada)",
  PRESIDENT_SECOND_ROUND: "5. Num eventual segundo turno, para Presidente, entre estes, em quem você votaria? (Estimulada)",
  PRESIDENT_REJECTION: "6. REJEIÇÃO: Em quem você NÃO votaria de jeito nenhum para Presidente? (Estimulada)",
};

const normalizeText = (text: string) => 
  text.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

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

export default function Home() {
  const { data: rawSurveyData, isLoading } = useSurvey();
  const [isSyncing, setIsSyncing] = useState(false);
  
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
    work: ['all']
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
        checkMatch('work', activeKeys.WORKS)
      );
    });
  }, [filters, rawSurveyData, activeKeys]);

  const calculateApproval = (data: any[], questionKey: string) => {
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
  };

  const statsLula = useMemo(() => calculateApproval(filteredData, activeKeys.PRESIDENT_APPROVAL), [filteredData, activeKeys.PRESIDENT_APPROVAL]);
  const statsBrandao = useMemo(() => calculateApproval(filteredData, activeKeys.GOV_APPROVAL), [filteredData, activeKeys.GOV_APPROVAL]);
  const statsPrefeito = useMemo(() => calculateApproval(filteredData, activeKeys.MAYOR_APPROVAL), [filteredData, activeKeys.MAYOR_APPROVAL]);

  const totalFilteredCount = filteredData.length;
  const totalDatabaseCount = useMemo(() => rawSurveyData?.filter(d => !d.INFO).length || 0, [rawSurveyData]);

  // Inteligência de Exibição do Prefeito
  const selectedMayorName = useMemo(() => {
    const activeCities = filters.city;
    if (activeCities.length === 1 && activeCities[0] !== 'all') {
      const cityUpper = activeCities[0].toUpperCase().trim();
      return CITY_MAYORS[cityUpper] || `Prefeito(a) de ${activeCities[0]}`;
    }
    return "Prefeito(a)";
  }, [filters.city]);

  const chartData = useMemo(() => {
    const processRanking = (key: string) => {
      const counts: Record<string, number> = {};
      filteredData.forEach(d => {
        const val = String(d[key] || '').trim();
        if (val && val !== 'all' && val !== 'NS/NR' && val !== 'Não sabe / Não responde') {
          counts[val] = (counts[val] || 0) + 1;
        }
      });
      return Object.entries(counts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
    };

    const approvalMap: Record<string, number> = { 'Aprova': 0, 'Desaprova': 0, 'NS/NR': 0 };
    filteredData.forEach(d => {
      const val = String(d[activeKeys.GOV_APPROVAL] || '').toLowerCase().trim();
      if (val === 'aprova') approvalMap['Aprova']++;
      else if (val === 'desaprova') approvalMap['Desaprova']++;
      else approvalMap['NS/NR']++;
    });

    return {
      approvalData: Object.entries(approvalMap).map(([name, value]) => ({ name, value })),
      candidateData: processRanking(activeKeys.PRESIDENT_VOTE).slice(0, 7),
      secondRoundData: processRanking(activeKeys.PRESIDENT_SECOND_ROUND).slice(0, 5),
      rejectionData: processRanking(activeKeys.PRESIDENT_REJECTION).slice(0, 7),
      topProblems: processRanking(activeKeys.PROBLEMS).slice(0, 5),
      topWorks: processRanking(activeKeys.WORKS).slice(0, 5),
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
    if (!rawSurveyData || totalDatabaseCount === 0) return stats;

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
      rawSurveyData.forEach(item => {
        if (item.INFO) return;
        const val = String(item[dataKey] || '').trim();
        if (val) counts[val] = (counts[val] || 0) + 1;
      });
      
      stats[filterKey] = {};
      Object.entries(counts).forEach(([val, count]) => {
        stats[filterKey][val] = (count / totalDatabaseCount) * 100;
      });
    });

    return stats;
  }, [rawSurveyData, activeKeys, totalDatabaseCount]);

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
    problem: ['all'], work: ['all']
  });

  const handleManualSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSyncing(false);
    toast({ title: "Sincronização Ativa", description: "Os dados foram atualizados em tempo real com o Google Cloud." });
  };

  const images = {
    lula: '/lula.jpg',
    brandao: '/Retrato_Oficial_de_Carlos_Brandão_como_governador_do_Maranhão.jpg',
    genericMayor: '/bandeiracerta.jpg'
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
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800">
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
                <h2 className="text-2xl font-black tracking-tighter text-zinc-950 leading-none mb-1">{totalFilteredCount.toLocaleString('pt-BR')}</h2>
                <div className="flex gap-0.5 mt-4">
                  {[...Array(6)].map((_, i) => (<div key={i} className={`h-4 flex-1 rounded-full ${i < (totalFilteredCount / (totalDatabaseCount || 1)) * 6 ? 'bg-orange-500' : 'bg-zinc-100'}`} />))}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[6px] font-black text-zinc-400 uppercase tracking-widest">Amostra Filtrada</span>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[6px] font-black uppercase tracking-widest">Em Campo</span>
                </div>
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
                  <span className="text-lg font-black opacity-60">/217</span>
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
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800">
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
              <StatCard 
                title="APROVAÇÃO DE GESTÃO"
                subtitle="Pres. Lula" 
                value={`${statsLula.aprova}%`} 
                imageUrl={images.lula} 
                subValue="FEDERAL" 
                breakdown={[
                  { name: 'Aprova', value: Number(statsLula.aprova) },
                  { name: 'Desaprova', value: Number(statsLula.desaprova) },
                  { name: 'NS/NR', value: Number(statsLula.nsnr) }
                ]} 
              />
              <StatCard 
                title="APROVAÇÃO DE GESTÃO"
                subtitle="Gov. Carlos Brandão" 
                value={`${statsBrandao.aprova}%`} 
                imageUrl={images.brandao} 
                subValue="ESTADUAL" 
                breakdown={[
                  { name: 'Aprova', value: Number(statsBrandao.aprova) },
                  { name: 'Desaprova', value: Number(statsBrandao.desaprova) },
                  { name: 'NS/NR', value: Number(statsBrandao.nsnr) }
                ]} 
              />
              <StatCard 
                title="APROVAÇÃO DE GESTÃO"
                subtitle={selectedMayorName} 
                value={`${statsPrefeito.aprova}%`} 
                imageUrl={images.genericMayor} 
                subValue="MUNICIPAL" 
                breakdown={[
                  { name: 'Aprova', value: Number(statsPrefeito.aprova) },
                  { name: 'Desaprova', value: Number(statsPrefeito.desaprova) },
                  { name: 'NS/NR', value: Number(statsPrefeito.nsnr) }
                ]} 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CandidateChart data={chartData.candidateData} total={filteredData.length} />
              <GovernorScenarioChart />
            </div>

            {/* RANKINGS PRESIDENCIAIS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <LuxuryCard className="group/card">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full w-fit">
                      <Vote className="w-3 h-3 text-orange-600" />
                      <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Eventual 2º Turno</span>
                    </div>
                  </div>
                  <h2 className="text-[18px] font-black text-zinc-900 mb-8 tracking-tight">Intenção de Voto (2º Turno)</h2>
                  <div className="space-y-6 flex-1">
                    {chartData.secondRoundData.map((item, idx) => (
                      <div key={item.name} className="group/row p-2 -m-2 rounded-xl transition-all duration-300 hover:bg-zinc-50">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] font-bold uppercase tracking-wide text-zinc-800">{item.name}</span>
                          </div>
                          <span className="text-[11px] font-black text-orange-600">
                            {((item.value / Math.max(filteredData.length, 1)) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-zinc-100 rounded-full h-1 relative overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.value / Math.max(filteredData.length, 1)) * 100}%` }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className="h-full bg-orange-500 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </LuxuryCard>

              <LuxuryCard className="group/card">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-rose-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full w-fit">
                      <ShieldAlert className="w-3 h-3 text-rose-600" />
                      <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">Teto Eleitoral</span>
                    </div>
                  </div>
                  <h2 className="text-[18px] font-black text-zinc-900 mb-8 tracking-tight">Índice de Rejeição</h2>
                  <div className="space-y-6 flex-1">
                    {chartData.rejectionData.map((item, idx) => (
                      <div key={item.name} className="group/row p-2 -m-2 rounded-xl transition-all duration-300 hover:bg-zinc-50">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] font-bold uppercase tracking-wide text-zinc-800">{item.name}</span>
                          </div>
                          <span className="text-[11px] font-black text-rose-600">
                            {((item.value / Math.max(filteredData.length, 1)) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-zinc-100 rounded-full h-1 relative overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.value / Math.max(filteredData.length, 1)) * 100}%` }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className="h-full bg-rose-500 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </LuxuryCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <LuxuryCard className="group/card">
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full w-fit">
                      <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">Urgência Social</span>
                    </div>
                  </div>
                  <h2 className="text-[18px] font-black text-zinc-900 mb-8 tracking-tight">Problemas Mais Graves</h2>
                  <div className="space-y-6 flex-1">
                    {chartData.topProblems.map((item, idx) => (
                      <div key={item.name} className="group/row p-2 -m-2 rounded-xl transition-all duration-300 hover:bg-zinc-50">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[11px] font-bold uppercase text-zinc-800">{item.name}</span>
                          <span className="text-[11px] font-black text-rose-600">{((item.value / Math.max(filteredData.length, 1)) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-zinc-100 rounded-full h-1 overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${(item.value / Math.max(filteredData.length, 1)) * 100}%` }} className="h-full bg-rose-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </LuxuryCard>

              <LuxuryCard className="group/card">
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full w-fit">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Demandas Populares</span>
                    </div>
                  </div>
                  <h2 className="text-[18px] font-black text-zinc-900 mb-8 tracking-tight">Obras e Serviços Desejados</h2>
                  <div className="space-y-6 flex-1">
                    {chartData.topWorks.map((item, idx) => (
                      <div key={item.name} className="group/row p-2 -m-2 rounded-xl transition-all duration-300 hover:bg-zinc-50">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[11px] font-bold uppercase text-zinc-800">{item.name}</span>
                          <span className="text-[11px] font-black text-emerald-600">{((item.value / Math.max(filteredData.length, 1)) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-zinc-100 rounded-full h-1 overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${(item.value / Math.max(filteredData.length, 1)) * 100}%` }} className="h-full bg-emerald-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </LuxuryCard>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <ApprovalChart data={chartData.approvalData} />
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <InteractiveMap 
                stats={filteredData.reduce((acc, curr) => { const r = String(curr[activeKeys.REGION] || '').trim() as MesoRegion; if (r) acc[r] = (acc[r] || 0) + 1; return acc; }, {} as Record<MesoRegion, number>)} 
                activeRegion={filters.region[0] === 'all' ? 'all' : filters.region[0]} 
                onRegionSelect={(r) => handleFilterChange('region', r || 'all')} 
              />
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
