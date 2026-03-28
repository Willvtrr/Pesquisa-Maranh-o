
"use client";

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { Loader2, AlertTriangle, MapPin, Layers, Box, Users, X } from 'lucide-react';
import { LuxuryCard } from './luxury-card';
import MUNICIP_GEOJSON from '@/data/MA_Municipios_2024 (1).json';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface InteractiveMapProps {
  data: any[];
  onCitySelect: (cityName: string | null) => void;
  activeCity: string;
}

const center = { lat: -5.1, lng: -45.1 };

const mapStyles = [
  { "elementType": "geometry", "stylers": [{ "color": "#f8f9fa" }] },
  { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#94a3b8" }] },
  { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "visibility": "on" }] },
  { "featureType": "administrative.province", "elementType": "geometry.stroke", "stylers": [{ "color": "#94a3b8" }, { "weight": 1 }] },
  { "featureType": "road", "stylers": [{ "visibility": "off" }] },
  { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e2e8f0" }] }
];

// Sub-componente Interno para lógica que usa useMap()
const InteractiveMapContent = ({ data, onCitySelect, activeCity, viewMode, cityStats, maxCount, setHoverInfo }: any) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Carrega GeoJSON se ainda não estiver carregado
    try {
      map.data.addGeoJson(MUNICIP_GEOJSON);
    } catch (e) {
      // Ignora se já estiver carregado
    }

    map.data.setStyle((feature) => {
      const cdMun = feature.getProperty('CD_MUN');
      const nmMun = feature.getProperty('NM_MUN');
      const count = cityStats[cdMun] || 0;
      
      const isSelected = activeCity === String(nmMun).toUpperCase();
      const hasData = count > 0;
      const isInterviews = viewMode === 'interviews';
      
      let fillColor = '#f1f5f9'; 
      let fillOpacity = isInterviews ? 0.05 : 0.2;
      let strokeWeight = 0.5;
      let strokeColor = isInterviews ? '#e2e8f0' : '#cbd5e1';

      if (!isInterviews && hasData) {
        const intensity = 0.3 + (count / maxCount) * 0.7;
        fillColor = '#ea580c'; 
        fillOpacity = intensity;
        strokeWeight = 0.8;
        strokeColor = '#ffffff';
      }

      if (isSelected) {
        fillOpacity = isInterviews ? 0.1 : 0.95;
        strokeWeight = 3;
        strokeColor = '#09090b';
        fillColor = '#f97316';
      }

      return {
        fillColor,
        fillOpacity,
        strokeColor,
        strokeWeight,
        visible: true,
        cursor: 'pointer'
      };
    });

    const clickListener = map.data.addListener('click', (event: any) => {
      const nmMun = event.feature.getProperty('NM_MUN');
      onCitySelect(nmMun ? nmMun.toUpperCase() : null);
    });

    const mouseOverListener = map.data.addListener('mousemove', (event: any) => {
      const nmMun = event.feature.getProperty('NM_MUN');
      const cdMun = event.feature.getProperty('CD_MUN');
      const count = cityStats[cdMun] || 0;
      
      if (event.domEvent) {
        setHoverInfo({
          x: event.domEvent.clientX,
          y: event.domEvent.clientY,
          name: nmMun,
          count: count
        });
      }
    });

    const mouseOutListener = map.data.addListener('mouseout', () => {
      setHoverInfo(null);
    });

    return () => {
      google.maps.event.removeListener(clickListener);
      google.maps.event.removeListener(mouseOverListener);
      google.maps.event.removeListener(mouseOutListener);
    };
  }, [map, cityStats, maxCount, activeCity, viewMode, onCitySelect, setHoverInfo]);

  return null;
};

export const InteractiveMap = ({ data, onCitySelect, activeCity }: InteractiveMapProps) => {
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'municipal' | 'interviews'>('municipal');
  const [is3D, setIs3D] = useState(false);
  const [hoverInfo, setHoverInfo] = useState<{ x: number, y: number, name: string, count: number } | null>(null);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const extractLatLng = (item: any) => {
    const coordStr = item.Coordenadas || item.INFO || "";
    if (!coordStr || typeof coordStr !== 'string') return null;
    
    const parts = coordStr.replace(',', ' ').split(/\s+/).map(p => parseFloat(p));
    if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return { lat: parts[0], lng: parts[1] };
    }
    return null;
  };

  const points = useMemo(() => {
    if (viewMode !== 'interviews') return [];
    return data
      .map(item => {
        const coords = extractLatLng(item);
        return coords ? { ...coords, id: item.id || Math.random().toString() } : null;
      })
      .filter(p => p !== null);
  }, [data, viewMode]);

  const cityStats = useMemo(() => {
    const stats: Record<string, number> = {};
    const nameToCode: Record<string, string> = {};

    if (MUNICIP_GEOJSON && MUNICIP_GEOJSON.features) {
      MUNICIP_GEOJSON.features.forEach((f: any) => {
        if (f.properties && f.properties.NM_MUN) {
          nameToCode[f.properties.NM_MUN.toUpperCase()] = f.properties.CD_MUN;
        }
      });
    }

    data.forEach(item => {
      const cityRaw = String(item['Cidade:'] || item['cidade'] || '').toUpperCase().trim();
      const code = item.CD_MUN || item.cd_mun || nameToCode[cityRaw];
      if (code) {
        stats[code] = (stats[code] || 0) + 1;
      }
    });
    return stats;
  }, [data]);

  const maxCount = useMemo(() => {
    const counts = Object.values(cityStats);
    return counts.length > 0 ? Math.max(...counts) : 1;
  }, [cityStats]);

  if (!mounted) {
    return (
      <LuxuryCard className="h-[40rem] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
      </LuxuryCard>
    );
  }

  return (
    <LuxuryCard className="relative p-0 overflow-hidden h-[40rem]">
      <div className="flex flex-col h-full">
        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-100 bg-white z-20">
          <div className="space-y-0.5">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-1 h-3 bg-orange-600 rounded-full" />
              MAPA INTERATIVO
            </h3>
            <p className="text-xl font-black text-zinc-950 tracking-tight leading-tight">
              Análise Geoespacial
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-zinc-100/80 backdrop-blur-md p-1 rounded-xl flex gap-1 border border-zinc-200">
              <button 
                onClick={() => setViewMode('municipal')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                  viewMode === 'municipal' ? "bg-white text-orange-600 shadow-sm" : "text-zinc-500 hover:bg-white/50"
                )}
              >
                <Layers size={14} /> Municípios
              </button>
              <button 
                onClick={() => setViewMode('interviews')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                  viewMode === 'interviews' ? "bg-white text-orange-600 shadow-sm" : "text-zinc-500 hover:bg-white/50"
                )}
              >
                <Users size={14} /> Entrevistas
              </button>
            </div>

            <button 
              onClick={() => setIs3D(!is3D)}
              className={cn(
                "h-10 px-4 rounded-xl flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all border shadow-sm",
                is3D ? "bg-zinc-950 text-white border-zinc-950" : "bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50"
              )}
            >
              <Box size={14} /> 3D
            </button>
          </div>
        </div>

        <div className="flex-1 relative bg-zinc-50">
          <Map
            defaultCenter={center}
            defaultZoom={7}
            mapId={is3D ? "496b3e09ad10e939" : "focco_analytics_dashboard"}
            styles={mapStyles}
            disableDefaultUI={false}
            gestureHandling={'greedy'}
          >
            <InteractiveMapContent 
              data={data}
              onCitySelect={onCitySelect}
              activeCity={activeCity}
              viewMode={viewMode}
              cityStats={cityStats}
              maxCount={maxCount}
              setHoverInfo={setHoverInfo}
            />

            {viewMode === 'interviews' && points.map((p: any) => (
              <AdvancedMarker
                key={p.id}
                position={{ lat: p.lat, lng: p.lng }}
              >
                <div className="w-3 h-3 rounded-full bg-orange-600 border-2 border-white shadow-md" />
              </AdvancedMarker>
            ))}
          </Map>

          <AnimatePresence>
            {hoverInfo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{ 
                  position: 'fixed', 
                  left: hoverInfo.x + 15, 
                  top: hoverInfo.y + 15,
                  pointerEvents: 'none'
                }}
                className="z-[100] glass-capsule p-3 min-w-[12rem] border border-white/40 shadow-2xl"
              >
                <div className="space-y-1">
                  <p className="text-[8px] font-black uppercase text-orange-600 flex items-center gap-1">
                    <MapPin size={10} /> Localização
                  </p>
                  <p className="text-sm font-black text-zinc-900 leading-tight">{hoverInfo.name}</p>
                  <div className="mt-2 pt-2 border-t border-zinc-100 flex items-center justify-between gap-4">
                    <span className="text-[8px] font-bold text-zinc-400 uppercase">Registros</span>
                    <span className="text-[10px] font-black text-zinc-950">{hoverInfo.count.toLocaleString('pt-BR')}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </LuxuryCard>
  );
};
