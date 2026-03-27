
"use client";

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { LuxuryCard } from './luxury-card';
import { cn } from '@/lib/utils';
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Search, 
  ChevronRight,
  Map as MapIcon,
  X
} from 'lucide-react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MesoRegion } from '@/data/survey-data';

const GEOJSON_URL = 'https://servicodados.ibge.gov.br/api/v3/malhas/estados/21?qualidade=minima&formato=application/vnd.geo+json&intrarregiao=mesorregiao';

interface FilterBentoBoxProps {
  filters: Record<string, string[]>;
  onFilterChange: (key: string, value: string) => void;
  onClear: () => void;
  options: Record<string, string[]>;
  distribution?: Record<string, Record<string, number>>;
  className?: string;
}

const MESO_COLORS: Record<string, string> = {
  'Metrop.': '#f43f5e',
  'Norte': '#f97316',
  'Oeste': '#22c55e',
  'Centro': '#eab308',
  'Leste': '#3b82f6',
  'Sul': '#a855f7',
};

const mapStyles = [
  { "elementType": "geometry", "stylers": [{ "color": "#f8f9fa" }] },
  { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
  { "featureType": "road", "stylers": [{ "visibility": "off" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e2e8f0" }] }
];

const mapIBGENameToApp = (ibgeName: any): MesoRegion => {
  if (!ibgeName) return 'Norte';
  const name = String(ibgeName).toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
  if (name.includes('metropol')) return 'Metrop.';
  if (name.includes('norte')) return 'Norte';
  if (name.includes('sul')) return 'Sul';
  if (name.includes('oeste')) return 'Oeste';
  if (name.includes('leste')) return 'Leste';
  if (name.includes('centro')) return 'Centro';
  return 'Norte';
};

const getRegionNameFromFeature = (feature: google.maps.Data.Feature): string | null => {
  const keys = ['NM_MESO', 'nm_meso', 'nome', 'NM_MESOREG', 'NOME_MESO', 'name', 'id'];
  for (const key of keys) {
    const val = feature.getProperty(key);
    if (val) return String(val);
  }
  return null;
};

const Counter = ({ value, color, symbolColor, size = "text-[3.5rem]", symbolSize = "text-2xl", decimals = 0 }: { value: number, color: string, symbolColor: string, size?: string, symbolSize?: string, decimals?: number }) => {
  const springValue = useSpring(0, { stiffness: 40, damping: 20 });
  const displayValue = useTransform(springValue, (latest) => 
    decimals > 0 ? latest.toFixed(decimals).replace('.', ',') : Math.round(latest)
  );

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  return (
    <h2 className={cn("leading-none font-black tracking-tighter flex items-baseline", size, color)}>
      <motion.span>{displayValue}</motion.span>
      <span className={cn("ml-0.5", symbolSize, symbolColor)}>%</span>
    </h2>
  );
};

export const FilterBentoBox = ({ filters, onFilterChange, onClear, options, distribution, className }: FilterBentoBoxProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [hoveredPolitic, setHoveredPolitic] = useState<string | null>(null);
  
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || "",
    language: 'pt-BR',
    region: 'BR'
  });

  const isSelected = (key: string, value: string) => filters[key]?.includes(value);
  const activeRegion = filters.region?.[0] || 'all';

  const femalePct = distribution?.gender?.['Feminino'] || 0;
  const malePct = distribution?.gender?.['Masculino'] || 0;
  const isGenderActive = (val: string) => filters.gender?.includes('all') || filters.gender?.includes(val);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    mapInstance.data.loadGeoJson(GEOJSON_URL);
  }, []);

  useEffect(() => {
    if (!map) return;
    const clickListener = map.data.addListener('click', (event: google.maps.Data.MouseEvent) => {
      const rawName = getRegionNameFromFeature(event.feature);
      const region = mapIBGENameToApp(rawName);
      onFilterChange('region', region);
    });
    return () => google.maps.event.removeListener(clickListener);
  }, [map, onFilterChange]);

  useEffect(() => {
    if (map) {
      map.data.setStyle((feature) => {
        const rawName = getRegionNameFromFeature(feature);
        const regionKey = mapIBGENameToApp(rawName);
        const isSelectionActive = activeRegion !== 'all';
        const isThisRegionActive = activeRegion === regionKey;
        
        let fillColor = MESO_COLORS[regionKey] || '#f97316';
        let fillOpacity = 0.75;
        let strokeWeight = 1.5;
        let strokeColor = '#ffffff';

        if (isSelectionActive) {
          if (isThisRegionActive) {
            fillOpacity = 0.95;
            strokeWeight = 3;
            strokeColor = '#ffffff';
          } else {
            fillOpacity = 0.05;
            strokeWeight = 0.5;
            strokeColor = '#f1f5f9';
          }
        }
        return { fillColor, fillOpacity, strokeColor, strokeWeight, visible: true };
      });
    }
  }, [map, activeRegion]);

  const filteredCities = useMemo(() => {
    const cities = options.city || [];
    if (!searchTerm) return cities;
    return cities.filter(city => city.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [options.city, searchTerm]);

  const selectedCitiesCount = filters.city?.[0] === 'all' ? 0 : filters.city?.length || 0;

  const maxAgePct = useMemo(() => {
    const ageStats = distribution?.age || {};
    return Math.max(...Object.values(ageStats), 0.1);
  }, [distribution]);

  const getIdeologyKey = (term: string) => options.ideology?.find(o => o.toLowerCase().includes(term.toLowerCase())) || '';
  const esqKey = getIdeologyKey('esquerda');
  const cenKey = getIdeologyKey('centro');
  const dirKey = getIdeologyKey('direita');
  const nsnrKey = options.ideology?.find(o => 
    o.toLowerCase().includes('não sabe') || 
    o.toLowerCase().includes('ns/nr') || 
    o.toLowerCase().includes('indeciso') ||
    o.toLowerCase().includes('nenhum')
  ) || 'NS/NR';

  const pEsq = distribution?.ideology?.[esqKey] || 0;
  const pCen = distribution?.ideology?.[cenKey] || 0;
  const pDir = distribution?.ideology?.[dirKey] || 0;
  const pUndecided = Math.max(0, 100 - (pEsq + pCen + pDir));

  const maxIncomePct = useMemo(() => {
    const incomeStats = distribution?.income || {};
    const values = Object.values(incomeStats);
    return values.length > 0 ? Math.max(...values) : 1;
  }, [distribution]);

  const maxEducationPct = useMemo(() => {
    const eduStats = distribution?.education || {};
    const values = Object.values(eduStats);
    return values.length > 0 ? Math.max(...values) : 1;
  }, [distribution]);

  const politicalSlices = [
    { id: 'direita', label: 'DIREITA', color: '#2563eb', pct: pDir, key: dirKey, textX: 75.8, textY: 34.7, textColor: 'white' },
    { id: 'centro', label: 'CENTRO', color: '#9ca3af', pct: pCen, key: cenKey, textX: 64.9, textY: 76.0, textColor: 'white' },
    { id: 'esquerda', label: 'ESQUERDA', color: '#dc2626', pct: pEsq, key: esqKey, textX: 25.4, textY: 67.1, textColor: 'white' },
    { id: 'nsnr', label: 'NS/NR', color: '#e2e8f0', pct: pUndecided, key: nsnrKey, textX: 32.4, textY: 25.8, textColor: '#475569' }
  ];

  return (
    <LuxuryCard title="SEGMENTAÇÃO" subtitle="Recorte de Dados" className={cn("h-fit", className)}>
      <div className="flex flex-col gap-6 pr-1 no-scrollbar pb-2">
        
        {/* Município */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-pulse" />
            Recorte por Município
          </label>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <button className={cn(
                "w-full flex items-center justify-between p-4 rounded-[1.5rem] border transition-all duration-300",
                selectedCitiesCount > 0 ? "bg-orange-50 border-orange-200" : "bg-white border-zinc-100 hover:bg-zinc-50"
              )}>
                <div className="flex items-center gap-4">
                  <div className={cn("p-3 rounded-2xl", selectedCitiesCount > 0 ? "bg-orange-600 text-white" : "bg-zinc-50 text-zinc-400")}>
                    <MapPin size={18} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-black text-zinc-950 uppercase tracking-tighter">Cidades Alvo</h4>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{selectedCitiesCount > 0 ? `${selectedCitiesCount} Ativas` : "Selecionar Municípios"}</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-zinc-300" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="h-full w-full sm:max-w-[600px] p-0 bg-white/95 backdrop-blur-2xl flex flex-col">
              <SheetHeader className="p-8 pb-4 bg-white border-b border-zinc-100">
                <SheetTitle className="flex items-center gap-3 text-2xl font-black tracking-tighter">
                  <div className="p-2 rounded-xl bg-orange-50 text-orange-600"><MapIcon size={24} /></div>
                  Base Territorial
                </SheetTitle>
                <div className="relative mt-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 size-4" />
                  <Input 
                    placeholder="Buscar cidade..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 rounded-2xl bg-zinc-50 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </SheetHeader>
              <ScrollArea className="flex-grow p-8">
                <div className="grid grid-cols-2 gap-3 pb-24">
                  <button 
                    onClick={() => onFilterChange('city', 'all')} 
                    className={cn(
                      "col-span-2 p-5 rounded-2xl border transition-all flex justify-center items-center font-black uppercase text-xs tracking-widest h-16", 
                      filters.city?.[0] === 'all' 
                        ? "bg-orange-600 text-white border-orange-500 shadow-lg shadow-orange-600/20" 
                        : "bg-white border-zinc-100 text-zinc-800"
                    )}
                  >
                    Todos
                  </button>
                  {filteredCities.map((city) => (
                    <button 
                      key={city} 
                      onClick={() => onFilterChange('city', city)} 
                      className={cn(
                        "p-4 rounded-xl border transition-all flex justify-center items-center text-center h-14 font-black uppercase text-[10px] tracking-tight", 
                        isSelected('city', city) 
                          ? "bg-orange-600 text-white border-orange-500 shadow-md shadow-orange-600/20" 
                          : "bg-white border-zinc-100 text-zinc-800 hover:border-zinc-200"
                      )}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </ScrollArea>
              <div className="absolute bottom-0 w-full p-8 bg-white border-t border-zinc-100 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
                <span className="text-xl font-black tracking-tighter">{selectedCitiesCount} Municípios</span>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => onFilterChange('city', 'all')}
                    className="px-8 py-4 bg-zinc-100 text-zinc-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-colors"
                  >
                    Limpar
                  </button>
                  <button 
                    onClick={() => setIsSheetOpen(false)} 
                    className="px-12 py-4 bg-zinc-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-950/20 active:scale-95"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Mesorregião */}
        <div className="space-y-4 pt-2">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.15em] flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-orange-600 rounded-full" />
            Mesorregião
          </label>
          <div className="bg-white rounded-[2rem] p-3 border border-zinc-100 shadow-xl overflow-hidden mb-4">
            <div className="aspect-[4/3] relative rounded-2xl overflow-hidden bg-zinc-50">
              {isLoaded && (
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={{ lat: -5.3, lng: -45.0 }}
                  zoom={5}
                  onLoad={onLoad}
                  options={{ styles: mapStyles, disableDefaultUI: true }}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {Object.entries(MESO_COLORS).map(([region, color]) => {
              const pct = distribution?.region?.[region] || 0;
              const active = isSelected('region', region);
              return (
                <motion.div
                  key={region}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => onFilterChange('region', region)}
                  className={cn(
                    "flex flex-col gap-1.5 p-2.5 rounded-xl transition-all cursor-pointer border",
                    active 
                      ? "border-zinc-950 bg-zinc-50 shadow-sm" 
                      : "border-zinc-100 bg-white hover:border-zinc-200"
                  )}
                >
                  <div className="flex justify-between items-center px-0.5">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      <span className={cn("text-[8px] font-black uppercase tracking-tighter truncate", active ? "text-zinc-950" : "text-zinc-500")}>
                        {region === 'Metrop.' ? 'Metro' : region}
                      </span>
                    </div>
                    <span className="text-[9px] font-black font-mono shrink-0">{pct.toFixed(1).replace('.', ',')}%</span>
                  </div>
                  <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Visão Política - DESIGN FINAL COMPACTO */}
        <div className="pt-6">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] flex items-center gap-2 mb-6">
            <span className="w-1.5 h-6 bg-[#d97743] rounded-full" />
            Visão Política
          </label>
          
          <div className="flex items-center justify-between gap-4">
            {/* Gráfico Donut Compacto */}
            <div className="relative w-36 h-36 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                <g transform="rotate(-90 50 50)">
                  {politicalSlices.map((slice, idx) => {
                    const offset = politicalSlices.slice(0, idx).reduce((acc, s) => acc + s.pct, 0);
                    const isFaded = hoveredPolitic && hoveredPolitic !== slice.id;
                    
                    return (
                      <motion.circle
                        key={slice.id}
                        cx="50" cy="50" r="30"
                        fill="none"
                        stroke={slice.color}
                        strokeWidth={hoveredPolitic === slice.id ? 32 : 30}
                        pathLength="100"
                        strokeDasharray={`${slice.pct} 100`}
                        strokeDashoffset={-offset}
                        className="cursor-pointer transition-all duration-300"
                        initial={{ strokeDasharray: "0 100" }}
                        animate={{ 
                          strokeDasharray: `${slice.pct} 100`,
                          opacity: isFaded ? 0.3 : 1
                        }}
                        transition={{ duration: 1, ease: "circOut" }}
                        onMouseEnter={() => setHoveredPolitic(slice.id)}
                        onMouseLeave={() => setHoveredPolitic(null)}
                        onClick={() => onFilterChange('ideology', slice.key)}
                      />
                    );
                  })}
                </g>

                {/* Porcentagens dentro das fatias - Otimizadas */}
                {politicalSlices.map((slice) => {
                  const isFaded = hoveredPolitic && hoveredPolitic !== slice.id;
                  if (slice.pct < 10) return null; 

                  return (
                    <motion.text
                      key={`text-${slice.id}`}
                      x={slice.textX}
                      y={slice.textY}
                      fill={slice.textColor}
                      className="text-[4.5px] font-black pointer-events-none"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      animate={{ opacity: isFaded ? 0.2 : 1 }}
                    >
                      {slice.pct.toFixed(1).replace('.', ',')}%
                    </motion.text>
                  );
                })}
              </svg>
            </div>

            {/* Legenda Vertical de Impacto - Estilo Print */}
            <div className="flex-1 space-y-3">
              {politicalSlices.map((item) => {
                const active = isSelected('ideology', item.key);
                const isFaded = hoveredPolitic && hoveredPolitic !== item.id;

                return (
                  <div 
                    key={item.id}
                    className={cn(
                      "flex items-center justify-between group cursor-pointer transition-all duration-300",
                      isFaded && "opacity-30"
                    )}
                    onMouseEnter={() => setHoveredPolitic(item.id)}
                    onMouseLeave={() => setHoveredPolitic(null)}
                    onClick={() => onFilterChange('ideology', item.key)}
                  >
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-2.5 h-2.5 rounded-full shrink-0" 
                        style={{ 
                          backgroundColor: item.color,
                          border: item.id === 'nsnr' ? '1px solid #cbd5e1' : 'none'
                        }} 
                      />
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-wider transition-colors",
                        active ? "text-zinc-950" : "text-zinc-500"
                      )}>
                        {item.label}
                      </span>
                    </div>
                    <span 
                      className="text-[13px] font-black tabular-nums tracking-tighter"
                      style={{ color: item.id === 'nsnr' ? '#64748b' : item.color }}
                    >
                      {item.pct.toFixed(1).replace('.', ',')}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Gênero */}
        <div className="pt-4">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] flex items-center gap-2 mb-3">
            <span className="w-1.5 h-3 bg-orange-600 rounded-full" />
            GÊNERO
          </label>
          <div className="bg-white p-5 rounded-[2rem] border border-zinc-100 flex items-center justify-center gap-6 shadow-sm">
            <div 
              className={cn("flex items-center gap-3 cursor-pointer transition-all", isGenderActive('Feminino') ? "opacity-100" : "opacity-30")} 
              onClick={() => onFilterChange('gender', 'Feminino')}
            >
              <div className="text-right">
                <Counter value={femalePct} color="text-zinc-950" symbolColor="text-zinc-400" size="text-lg" symbolSize="text-[10px]" decimals={1} />
                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mt-0.5">FEMININO</p>
              </div>
              <div className="glass-capsule w-8 h-16 p-1.5 relative flex items-center justify-center bg-white shadow-[0_10px_20px_rgba(232,62,140,0.05)] transition-all">
                <div className="w-full h-full mask-female bg-[#831843] relative overflow-hidden">
                  <motion.div 
                    initial={{ height: 0 }} 
                    animate={{ height: `${femalePct}%` }} 
                    transition={{ duration: 1.5, ease: "circOut" }} 
                    className="absolute bottom-0 w-full bg-[#e83e8c]" 
                  />
                </div>
              </div>
            </div>
            
            <div 
              className={cn("flex items-center gap-3 cursor-pointer transition-all", isGenderActive('Masculino') ? "opacity-100" : "opacity-30")} 
              onClick={() => onFilterChange('gender', 'Masculino')}
            >
              <div className="glass-capsule w-8 h-16 p-1.5 relative flex items-center justify-center bg-white shadow-[0_10px_20px_rgba(29,112,184,0.05)] transition-all">
                <div className="w-full h-full mask-male bg-[#1e3a8a] relative overflow-hidden">
                  <motion.div 
                    initial={{ height: 0 }} 
                    animate={{ height: `${malePct}%` }} 
                    transition={{ duration: 1.5, ease: "circOut" }} 
                    className="absolute bottom-0 w-full bg-[#1d70b8]" 
                  />
                </div>
              </div>
              <div className="text-left">
                <Counter value={malePct} color="text-zinc-950" symbolColor="text-zinc-400" size="text-lg" symbolSize="text-[10px]" decimals={1} />
                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mt-0.5">MASCULINO</p>
              </div>
            </div>
          </div>
        </div>

        {/* Faixa Etária */}
        <div className="pt-4">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] flex items-center gap-2 mb-3">
            <span className="w-1.5 h-3 bg-orange-600 rounded-full" />
            FAIXA ETÁRIA
          </label>
          <div className="bg-white p-4 rounded-[2rem] border border-zinc-100 flex items-end justify-between h-[120px] gap-1 shadow-sm">
            {(options.age || []).map((opt) => {
              const pct = distribution?.age?.[opt] || 0;
              const isSelectedAge = isSelected('age', opt);
              const isOrange = opt.includes('25-34') || opt.includes('45-59');
              return (
                <div key={opt} onClick={() => onFilterChange('age', opt)} className="flex flex-col items-center flex-1 h-full cursor-pointer group">
                  <span className="text-[8px] font-black text-zinc-800">{pct.toFixed(1).replace('.', ',')}%</span>
                  <div className="w-full max-w-[28px] bg-zinc-100 rounded-t-lg h-full flex items-end overflow-hidden relative">
                    <motion.div 
                      initial={{ height: 0 }} 
                      animate={{ height: `${(pct / Math.max(maxAgePct, 1)) * 100}%` }} 
                      className={cn("w-full rounded-t-lg transition-all", isSelectedAge ? "bg-orange-500" : (isOrange ? "bg-orange-500/60" : "bg-zinc-800"))} 
                    />
                  </div>
                  <span className="mt-1 text-[6px] font-black uppercase text-zinc-600">{opt.replace(' anos', '')}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Renda Familiar */}
        <div className="pt-4">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] flex items-center gap-2 mb-3">
            <span className="w-1.5 h-3 bg-orange-600 rounded-full" />
            RENDA FAMILIAR
          </label>
          <div className="bg-white p-6 rounded-[2rem] border border-zinc-100 space-y-4 shadow-sm">
            {(options.income || []).map((opt) => {
              const pct = distribution?.income?.[opt] || 0;
              const active = isSelected('income', opt);
              const leaderValue = maxIncomePct || 1;
              const relativeWidth = (pct / leaderValue) * 100;
              return (
                <div key={opt} className="cursor-pointer group flex flex-col gap-1.5" onClick={() => onFilterChange('income', opt)}>
                  <span className={cn("text-[9px] font-black uppercase tracking-widest transition-colors", active ? "text-orange-600" : "text-zinc-400")}>
                    {opt}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2.5 bg-zinc-50 rounded-full overflow-hidden border border-zinc-100">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${relativeWidth}%` }} 
                        className={cn("h-full transition-all rounded-full", active ? "bg-orange-500" : "bg-zinc-800")} 
                      />
                    </div>
                    <span className={cn("text-[9px] font-black transition-colors min-w-[32px] text-right", active ? "text-orange-600" : "text-zinc-950")}>
                      {pct.toFixed(1).replace('.', ',')}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Escolaridade */}
        <div className="pt-4">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] flex items-center gap-2 mb-3">
            <span className="w-1.5 h-3 bg-orange-600 rounded-full" />
            ESCOLARIDADE
          </label>
          <div className="bg-white p-6 rounded-[2rem] border border-zinc-100 space-y-4 shadow-sm">
            {(options.education || []).map((opt) => {
              const pct = distribution?.education?.[opt] || 0;
              const active = isSelected('education', opt);
              const leaderValue = maxEducationPct || 1;
              const relativeWidth = (pct / leaderValue) * 100;
              return (
                <div key={opt} className="cursor-pointer group flex flex-col gap-1.5" onClick={() => onFilterChange('education', opt)}>
                  <span className={cn("text-[9px] font-black uppercase tracking-widest transition-colors", active ? "text-orange-600" : "text-zinc-400")}>
                    {opt}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2.5 bg-zinc-50 rounded-full overflow-hidden border border-zinc-100">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${relativeWidth}%` }} 
                        className={cn("h-full transition-all rounded-full", active ? "bg-orange-500" : "bg-zinc-800")} 
                      />
                    </div>
                    <span className={cn("text-[9px] font-black transition-colors min-w-[32px] text-right", active ? "text-orange-600" : "text-zinc-950")}>
                      {pct.toFixed(1).replace('.', ',')}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      <div className="mt-6 pt-4 border-t border-zinc-100 bg-white z-10">
        <button onClick={onClear} className="w-full py-3 rounded-2xl bg-zinc-50 border border-zinc-100 text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] hover:text-zinc-600 flex items-center justify-center gap-2">
          <X size={12} />
          Resetar Recorte
        </button>
      </div>
    </LuxuryCard>
  );
};
