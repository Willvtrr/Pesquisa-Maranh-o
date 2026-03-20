
"use client";

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { LuxuryCard } from './luxury-card';
import { cn } from '@/lib/utils';
import { motion, useSpring, useTransform } from 'framer-motion';
import { 
  MapPin, 
  Search, 
  CheckCircle2, 
  X,
  ChevronRight,
  Map as MapIcon,
  Loader2
} from 'lucide-react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MesoRegion } from '@/data/survey-data';

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
  const name = String(ibgeName).toLowerCase();
  if (name.includes('metropol')) return 'Metrop.';
  if (name.includes('norte')) return 'Norte';
  if (name.includes('sul')) return 'Sul';
  if (name.includes('oeste')) return 'Oeste';
  if (name.includes('leste')) return 'Leste';
  if (name.includes('centro')) return 'Centro';
  return 'Norte';
};

const getRegionNameFromFeature = (feature: google.maps.Data.Feature): string | null => {
  const keys = ['NM_MESO', 'nm_meso', 'nome', 'NM_MESOREG', 'NOME_MESO', 'name'];
  for (const key of keys) {
    const val = feature.getProperty(key);
    if (val) return String(val);
  }
  return null;
};

const Counter = ({ value, color, symbolColor, size = "text-[3.5rem]", symbolSize = "text-2xl" }: { value: number, color: string, symbolColor: string, size?: string, symbolSize?: string }) => {
  const springValue = useSpring(0, { stiffness: 40, damping: 20 });
  const displayValue = useTransform(springValue, (latest) => Math.round(latest));

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  
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

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    mapInstance.data.loadGeoJson(
      'https://servicodados.ibge.gov.br/api/v3/malhas/estados/21?qualidade=minima&formato=application/vnd.geo+json&intrarregiao=mesorregiao'
    );
  }, []);

  useEffect(() => {
    if (!map) return;
    const clickListener = map.data.addListener('click', (event: google.maps.Data.MouseEvent) => {
      const rawName = getRegionNameFromFeature(event.feature);
      const region = mapIBGENameToApp(rawName);
      onFilterChange('region', region);
    });
    return () => {
      google.maps.event.removeListener(clickListener);
    };
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

  return (
    <LuxuryCard 
      title="SEGMENTAÇÃO" 
      subtitle="Recorte de Dados" 
      className={cn("flex flex-col h-full", className)}
    >
      <div className="flex flex-col gap-8 flex-1 overflow-y-auto pr-2 no-scrollbar">
        
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-pulse" />
            Recorte por Município
          </label>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button className={cn(
                "w-full group relative flex items-center justify-between p-4 rounded-[1.5rem] border transition-all duration-300",
                selectedCitiesCount > 0 
                  ? "bg-orange-50 border-orange-200 shadow-lg shadow-orange-500/10" 
                  : "bg-white border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50"
              )}>
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-2xl transition-colors duration-300",
                    selectedCitiesCount > 0 ? "bg-orange-600 text-white" : "bg-zinc-50 text-zinc-400 group-hover:text-orange-600"
                  )}>
                    <MapPin size={18} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-black text-zinc-950 uppercase tracking-tighter">Cidades Alvo</h4>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      {selectedCitiesCount > 0 
                        ? `${selectedCitiesCount} Ativa${selectedCitiesCount > 1 ? 's' : ''}` 
                        : "Selecionar Municípios"}
                    </p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-zinc-300 group-hover:text-orange-600 transition-colors" />
              </button>
            </DialogTrigger>
            
            <DialogContent className="max-w-2xl rounded-[2.5rem] border-zinc-200 p-0 overflow-hidden bg-white/95 backdrop-blur-2xl">
              <DialogHeader className="p-8 pb-4 border-b border-zinc-50 bg-white">
                <DialogTitle className="flex items-center gap-3 text-2xl font-black tracking-tighter text-zinc-900">
                  <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
                    <MapIcon size={24} />
                  </div>
                  Base Territorial Maranhense
                </DialogTitle>
                <div className="relative mt-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 size-4" />
                  <Input 
                    placeholder="Buscar cidade..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 rounded-2xl border-zinc-100 bg-zinc-50 focus:ring-orange-500/20 text-sm font-bold"
                  />
                </div>
              </DialogHeader>
              
              <ScrollArea className="h-[400px] p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button 
                    onClick={() => onFilterChange('city', 'all')}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl border transition-all",
                      filters.city?.[0] === 'all' 
                        ? "bg-orange-600 border-orange-600 text-white shadow-xl shadow-orange-600/20" 
                        : "bg-white border-zinc-100 hover:border-zinc-200"
                    )}
                  >
                    <span className="text-xs font-black uppercase tracking-widest">Todos os Municípios</span>
                    {filters.city?.[0] === 'all' && <CheckCircle2 size={16} />}
                  </button>
                  {filteredCities.map((city) => {
                    const active = isSelected('city', city);
                    return (
                      <button 
                        key={city}
                        onClick={() => onFilterChange('city', city)}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-2xl border transition-all group",
                          active ? "bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-600/20" : "bg-white border-zinc-100 hover:border-orange-200 hover:bg-orange-50/50"
                        )}
                      >
                        <span className={cn("text-[10px] font-black uppercase tracking-tight", active ? "text-white" : "text-zinc-700")}>{city}</span>
                        {active && <CheckCircle2 size={14} />}
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{selectedCitiesCount} Municípios no Recorte</p>
                <button onClick={() => setIsDialogOpen(false)} className="px-8 py-3 bg-zinc-950 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-xl">Aplicar Filtros</button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4 pt-2">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.15em] flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-orange-600 rounded-full" />
            Mesorregião
          </label>
          <div className="bg-white rounded-[2rem] p-3 border border-zinc-100 shadow-xl overflow-hidden">
            <div className="aspect-[4/3] relative rounded-2xl overflow-hidden border border-zinc-100 bg-zinc-50">
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={{ lat: -5.3, lng: -45.0 }}
                  zoom={5}
                  onLoad={onLoad}
                  options={{ styles: mapStyles, disableDefaultUI: true, gestureHandling: 'cooperative' }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                  <Loader2 className="animate-spin text-orange-600 size-5" />
                  <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Sincronizando...</span>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {Object.keys(MESO_COLORS).map((id) => {
              const percentage = distribution?.region?.[id] || 0;
              const active = isSelected('region', id);
              return (
                <button 
                  key={id}
                  onClick={() => onFilterChange('region', id)}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-xl transition-all border",
                    active ? "bg-white border-zinc-200 shadow-md ring-1 ring-zinc-100" : "bg-transparent border-transparent hover:bg-zinc-50"
                  )}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: MESO_COLORS[id] }} />
                    <span className={cn("text-[8px] font-black uppercase truncate", active ? "text-zinc-950" : "text-zinc-500")}>{id}</span>
                  </div>
                  <span className="text-[8px] font-bold text-zinc-400">{Math.round(percentage)}%</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* GÊNERO PREMIUM CHART - VERSÃO COMPACTA E LATERALIZADA */}
        <div className="space-y-6 mesh-bg p-6 rounded-[2rem] border border-zinc-100 shadow-sm bg-white relative overflow-hidden">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] flex items-center justify-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full" />
            GÊNERO
          </label>
          
          <div className="flex flex-col gap-8 relative">
            {/* FEMININO - NÚMERO À ESQUERDA, SILHUETA À DIREITA */}
            <div 
              className={cn(
                "flex items-center justify-center gap-6 cursor-pointer transition-all hover:scale-105",
                isSelected('gender', 'Feminino') ? "opacity-100" : "opacity-80"
              )}
              onClick={() => onFilterChange('gender', 'Feminino')}
            >
              <div className="text-right flex flex-col items-end">
                <Counter value={femalePct} color="text-[#e83e8c]" symbolColor="text-[#f472b6]" />
                <p className="text-[9px] font-black tracking-[0.2em] text-zinc-400 uppercase">Feminino</p>
              </div>
              <div className="glass-capsule w-16 h-32 p-3 relative flex items-center justify-center shadow-lg">
                <div className="w-full h-full mask-female bg-[#831843] relative overflow-hidden">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${femalePct}%` }}
                    transition={{ duration: 2, ease: [0.2, 0.8, 0.2, 1] }}
                    className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#e83e8c] to-[#f472b6] shadow-[0_-12px_25px_rgba(232,62,140,0.6)]"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-white/50 blur-[1px]"></div>
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-zinc-50 hidden sm:block"></div>

            {/* MASCULINO - SILHUETA À ESQUERDA, NÚMERO À DIREITA */}
            <div 
              className={cn(
                "flex items-center justify-center gap-6 cursor-pointer transition-all hover:scale-105",
                isSelected('gender', 'Masculino') ? "opacity-100" : "opacity-80"
              )}
              onClick={() => onFilterChange('gender', 'Masculino')}
            >
              <div className="glass-capsule w-16 h-32 p-3 relative flex items-center justify-center shadow-lg">
                <div className="w-full h-full mask-male bg-[#1e3a8a] relative overflow-hidden">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${malePct}%` }}
                    transition={{ duration: 2, ease: [0.2, 0.8, 0.2, 1] }}
                    className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#1d70b8] to-[#60a5fa] shadow-[0_-12px_25px_rgba(29,112,184,0.6)]"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-white/50 blur-[1px]"></div>
                  </motion.div>
                </div>
              </div>
              <div className="text-left flex flex-col items-start">
                <Counter value={malePct} color="text-[#1d70b8]" symbolColor="text-[#60a5fa]" />
                <p className="text-[9px] font-black tracking-[0.2em] text-zinc-400 uppercase">Masculino</p>
              </div>
            </div>
          </div>
        </div>

        {['age', 'income', 'education'].map((key) => (
          <div key={key} className="space-y-4">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full" />
              {key === 'age' ? 'Faixa Etária' : key === 'income' ? 'Renda' : 'Escolaridade'}
            </label>
            <div className="grid grid-cols-1 gap-2">
              <FilterChip label="Todas" active={isSelected(key, 'all')} onClick={() => onFilterChange(key, 'all')} />
              {(options[key] || []).map(opt => (
                <FilterChip key={opt} label={opt} percentage={distribution?.[key]?.[opt]} active={isSelected(key, opt)} onClick={() => onFilterChange(key, opt)} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-zinc-100">
        <button onClick={onClear} className="w-full py-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-100 hover:text-zinc-600 transition-all flex items-center justify-center gap-2 shadow-inner">
          <X size={12} />
          Resetar Recorte
        </button>
      </div>
    </LuxuryCard>
  );
};

export const FilterChip = ({ label, active, percentage, onClick }: { label: string, active: boolean, percentage?: number, onClick: () => void }) => (
  <motion.button 
    whileTap={{ scale: 0.96 }}
    onClick={onClick}
    className={cn(
      "px-4 py-2.5 rounded-full text-[11px] font-bold transition-all border flex items-center justify-between",
      active ? "bg-orange-600 border-orange-600 text-white shadow-xl shadow-orange-600/30" : "bg-white border-zinc-100 text-zinc-600 hover:border-zinc-200 hover:bg-zinc-50 shadow-sm"
    )}
  >
    <span className="truncate max-w-[150px]">{label}</span>
    {percentage !== undefined && (
      <span className={cn("text-[8px] font-black px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[32px] ml-2", active ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-400")}>
        {Math.round(percentage)}%
      </span>
    )}
  </motion.button>
);
