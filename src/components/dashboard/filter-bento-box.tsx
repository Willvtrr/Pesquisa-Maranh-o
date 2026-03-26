
"use client";

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { LuxuryCard } from './luxury-card';
import { cn } from '@/lib/utils';
import { motion, useSpring, useTransform } from 'framer-motion';
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

  const pEsq = Math.round(distribution?.ideology?.[esqKey] || 0);
  const pCen = Math.round(distribution?.ideology?.[cenKey] || 0);
  const pDir = Math.round(distribution?.ideology?.[dirKey] || 0);
  const pUndecided = Math.max(0, 100 - (pEsq + pCen + pDir));

  const displayPoliticPct = useMemo(() => {
    if (hoveredPolitic) {
      if (hoveredPolitic === 'direita' || hoveredPolitic === dirKey) return pDir;
      if (hoveredPolitic === 'centro' || hoveredPolitic === cenKey) return pCen;
      if (hoveredPolitic === 'esquerda' || hoveredPolitic === esqKey) return pEsq;
      if (hoveredPolitic === 'nsnr' || hoveredPolitic === nsnrKey) return pUndecided;
    }
    const selectedIdeologies = filters.ideology || [];
    if (selectedIdeologies.length > 0 && !selectedIdeologies.includes('all')) {
      let sum = 0;
      if (selectedIdeologies.includes(dirKey)) sum += pDir;
      if (selectedIdeologies.includes(cenKey)) sum += pCen;
      if (selectedIdeologies.includes(esqKey)) sum += pEsq;
      if (selectedIdeologies.includes(nsnrKey)) sum += pUndecided;
      return sum;
    }
    return 100;
  }, [hoveredPolitic, filters.ideology, pDir, pCen, pEsq, pUndecided, dirKey, cenKey, esqKey, nsnrKey]);

  return (
    <LuxuryCard title="SEGMENTAÇÃO" subtitle="Recorte de Dados" className={cn("flex flex-col h-full", className)}>
      <div className="flex flex-col gap-6 flex-1 overflow-y-auto pr-2 no-scrollbar pb-10">
        
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
                    <span className="text-[9px] font-black font-mono shrink-0">{pct.toFixed(0)}%</span>
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

        {/* Gênero */}
        <div className="pt-4">
          <label className="text-[10px] font-black uppercase text-zinc-900 tracking-[0.2em] flex items-center gap-2 mb-4">
            <span className="w-2 h-4 bg-orange-600 rounded-full" />
            GÊNERO
          </label>
          <div className="bg-white p-6 rounded-[2.5rem] border border-zinc-100 flex items-center justify-center gap-8 shadow-sm">
            {/* Feminino */}
            <div 
              className={cn("flex items-center gap-4 cursor-pointer transition-all", isGenderActive('Feminino') ? "opacity-100" : "opacity-30")} 
              onClick={() => onFilterChange('gender', 'Feminino')}
            >
              <div className="text-right">
                <Counter value={femalePct} color="text-zinc-900" symbolColor="text-zinc-400" size="text-3xl" symbolSize="text-xs" />
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-0.5">FEMININO</p>
              </div>
              <div className="glass-capsule w-12 h-24 p-2 relative flex items-center justify-center bg-white shadow-[0_0_35px_rgba(232,62,140,0.18)] transition-all hover:shadow-[0_0_45px_rgba(232,62,140,0.25)]">
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
            
            {/* Masculino */}
            <div 
              className={cn("flex items-center gap-4 cursor-pointer transition-all", isGenderActive('Masculino') ? "opacity-100" : "opacity-30")} 
              onClick={() => onFilterChange('gender', 'Masculino')}
            >
              <div className="glass-capsule w-12 h-24 p-2 relative flex items-center justify-center bg-white shadow-[0_0_35px_rgba(29,112,184,0.18)] transition-all hover:shadow-[0_0_45px_rgba(29,112,184,0.25)]">
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
                <Counter value={malePct} color="text-zinc-900" symbolColor="text-zinc-400" size="text-3xl" symbolSize="text-xs" />
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-0.5">MASCULINO</p>
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
          <div className="bg-white p-4 rounded-[2rem] border border-zinc-100 flex items-end justify-between h-[120px] gap-1">
            {(options.age || []).map((opt) => {
              const pct = distribution?.age?.[opt] || 0;
              const isSelectedAge = isSelected('age', opt);
              const isOrange = opt.includes('25-34') || opt.includes('45-59');
              return (
                <div key={opt} onClick={() => onFilterChange('age', opt)} className="flex flex-col items-center flex-1 h-full cursor-pointer group">
                  <span className="text-[8px] font-black text-zinc-800">{pct.toFixed(1)}%</span>
                  <div className="w-full max-w-[28px] bg-zinc-100 rounded-t-lg h-full flex items-end overflow-hidden relative">
                    <motion.div 
                      initial={{ height: 0 }} 
                      animate={{ height: `${(pct / maxAgePct) * 100}%` }} 
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
          <div className="bg-white p-6 rounded-[2rem] border border-zinc-100 space-y-4">
            {(options.income || []).map((opt) => {
              const pct = distribution?.income?.[opt] || 0;
              const active = isSelected('income', opt);
              return (
                <div key={opt} className="cursor-pointer group flex flex-col gap-1.5" onClick={() => onFilterChange('income', opt)}>
                  <div className="flex justify-between items-end">
                    <span className={cn("text-[9px] font-bold uppercase tracking-widest transition-colors", active ? "text-orange-600" : "text-zinc-500")}>
                      {opt}
                    </span>
                    <span className={cn("text-xl font-black transition-colors", active ? "text-orange-600" : "text-zinc-800")}>
                      {pct.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-zinc-50 rounded-full overflow-hidden border border-zinc-100">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${pct}%` }} 
                      className={cn("h-full transition-all", active ? "bg-orange-500" : "bg-zinc-800")} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Escolaridade */}
        <div className="space-y-3 pt-4">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] flex items-center gap-2 mb-3">
            <span className="w-1.5 h-3 bg-orange-600 rounded-full" />
            ESCOLARIDADE
          </label>
          <div className="flex flex-col gap-3">
            {(options.education || []).map((opt) => {
              const pct = distribution?.education?.[opt] || 0;
              const active = isSelected('education', opt);
              return (
                <motion.div
                  key={opt}
                  whileHover={{ x: 4, scale: 1.01 }}
                  onClick={() => onFilterChange('education', opt)}
                  className={cn(
                    "flex flex-col gap-3 p-4 rounded-xl transition-all cursor-pointer border",
                    active 
                      ? "border-orange-500 bg-orange-50/30" 
                      : "border-zinc-100 bg-white hover:border-zinc-200"
                  )}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-0.5">
                      <h3 className={cn("text-xs font-bold transition-colors", active ? "text-orange-600" : "text-zinc-800")}>
                        {opt}
                      </h3>
                      <p className="text-[8px] text-zinc-400 uppercase tracking-widest">
                        {pct > 40 ? 'Maioria' : pct > 20 ? 'Base' : 'Segmento'}
                      </p>
                    </div>
                    <div className="flex items-baseline gap-0.5">
                      <span className={cn("text-xl font-black transition-colors", active ? "text-orange-600" : "text-zinc-800")}>
                        {Math.round(pct)}
                      </span>
                      <span className="text-[10px] font-bold text-zinc-400">%</span>
                    </div>
                  </div>
                  <div className="h-4 bg-zinc-100/70 border border-zinc-200/20 rounded-lg p-[3px] relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1.5, ease: [0.2, 0.8, 0.2, 1] }}
                      className={cn(
                        "h-full rounded-[5px] transition-colors",
                        active ? "bg-orange-500" : "bg-zinc-300"
                      )}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Visão Política */}
        <div className="pt-6">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] flex items-center gap-2 mb-3">
            <span className="w-1.5 h-3 bg-orange-600 rounded-full" />
            VISÃO POLÍTICA
          </label>
          <div className="bg-white p-6 rounded-[2rem] border border-zinc-100 flex flex-col items-center gap-6">
            <div className="relative w-32 h-32">
              <svg width="100%" height="100%" viewBox="0 0 42 42" className="transform -rotate-90">
                <circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#f4f4f5" strokeWidth="6" />
                <circle className="cursor-pointer transition-all duration-500" cx="21" cy="21" r="15.9" fill="transparent" stroke="#eab308" strokeWidth="6" strokeDasharray={`${pDir} ${100 - pDir}`} strokeDashoffset={100} onMouseEnter={() => setHoveredPolitic('direita')} onMouseLeave={() => setHoveredPolitic(null)} onClick={() => onFilterChange('ideology', dirKey)} />
                <circle className="cursor-pointer transition-all duration-500" cx="21" cy="21" r="15.9" fill="transparent" stroke="#9ca3af" strokeWidth="6" strokeDasharray={`${pCen} ${100 - pCen}`} strokeDashoffset={100 - pDir} onMouseEnter={() => setHoveredPolitic('centro')} onMouseLeave={() => setHoveredPolitic(null)} onClick={() => onFilterChange('ideology', cenKey)} />
                <circle className="cursor-pointer transition-all duration-500" cx="21" cy="21" r="15.9" fill="transparent" stroke="#ef4444" strokeWidth="6" strokeDasharray={`${pEsq} ${100 - pEsq}`} strokeDashoffset={100 - pDir - pCen} onMouseEnter={() => setHoveredPolitic('esquerda')} onMouseLeave={() => setHoveredPolitic(null)} onClick={() => onFilterChange('ideology', esqKey)} />
                {/* Arco do NS/NR no gráfico */}
                <circle className="cursor-pointer transition-all duration-500" cx="21" cy="21" r="15.9" fill="transparent" stroke="#f4f4f5" strokeWidth="6" strokeDasharray={`${pUndecided} ${100 - pUndecided}`} strokeDashoffset={100 - pDir - pCen - pEsq} onMouseEnter={() => setHoveredPolitic('nsnr')} onMouseLeave={() => setHoveredPolitic(null)} onClick={() => onFilterChange('ideology', nsnrKey)} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-zinc-800 leading-none">{displayPoliticPct}%</span>
                <span className="text-[7px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                  {(filters.ideology?.length > 0 && !filters.ideology?.includes('all')) ? 'Soma' : 'Amostra'}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full">
              {[
                { id: 'direita', label: 'Direita', color: '#eab308', pct: pDir, key: dirKey },
                { id: 'centro', label: 'Centro', color: '#9ca3af', pct: pCen, key: cenKey },
                { id: 'esquerda', label: 'Esquerda', color: '#ef4444', pct: pEsq, key: esqKey },
                { id: 'nsnr', label: 'NS/NR', color: '#f4f4f5', pct: pUndecided, key: nsnrKey }
              ].map((item) => (
                <div 
                  key={item.id} 
                  className={cn(
                    "flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all", 
                    (isSelected('ideology', item.key)) ? "bg-zinc-50" : "hover:bg-zinc-50/50"
                  )} 
                  onClick={() => onFilterChange('ideology', item.key)}
                  onMouseEnter={() => setHoveredPolitic(item.id)}
                  onMouseLeave={() => setHoveredPolitic(null)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shadow-sm border border-zinc-200" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] font-black text-zinc-700 uppercase tracking-wide">{item.label}</span>
                  </div>
                  <span className={cn("text-lg font-black", (isSelected('ideology', item.key)) ? "text-orange-600" : "text-zinc-800")} style={{ color: (isSelected('ideology', item.key)) ? undefined : (item.id === 'nsnr' ? '#a1a1aa' : item.color) }}>
                    {item.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <div className="mt-6 pt-4 border-t border-zinc-100 bg-white sticky bottom-0 z-10">
        <button onClick={onClear} className="w-full py-3 rounded-2xl bg-zinc-50 border border-zinc-100 text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] hover:text-zinc-600 flex items-center justify-center gap-2">
          <X size={12} />
          Resetar Recorte
        </button>
      </div>
    </LuxuryCard>
  );
};
