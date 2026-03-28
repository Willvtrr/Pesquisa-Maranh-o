
"use client";

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Loader2, AlertTriangle, MapPin, Layers, Box, Users } from 'lucide-react';
import { LuxuryCard } from './luxury-card';
import MUNICIP_GEOJSON from '@/data/MA_Municipios_2024 (1).json';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface InteractiveMapProps {
  data: any[];
  onCitySelect: (cityName: string | null) => void;
  activeCity: string;
}

const mapContainerStyle = { 
  width: '100%', 
  height: '100%',
};

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

export const InteractiveMap = ({ data, onCitySelect, activeCity }: InteractiveMapProps) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || "",
    language: 'pt-BR',
    region: 'BR'
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [viewMode, setViewMode] = useState<'municipal' | 'interviews'>('municipal');
  const [is3D, setIs3D] = useState(false);
  const [hoverInfo, setHoverInfo] = useState<{ x: number, y: number, name: string, count: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Aplicação real do efeito 3D (Tilt)
  useEffect(() => {
    if (map) {
      if (is3D) {
        map.setTilt(45);
        map.setHeading(15);
      } else {
        map.setTilt(0);
        map.setHeading(0);
      }
    }
  }, [map, is3D]);

  const extractLatLng = (item: any) => {
    const coordStr = item.Coordenadas || item.INFO || "";
    if (!coordStr || typeof coordStr !== 'string') return null;
    
    const parts = coordStr.replace(',', ' ').split(' ').map(p => parseFloat(p));
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

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    try {
      mapInstance.data.addGeoJson(MUNICIP_GEOJSON);
    } catch (e) {
      console.error("Erro ao carregar GeoJSON:", e);
    }
  }, []);

  useEffect(() => {
    if (map) {
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
    }
  }, [map, cityStats, maxCount, activeCity, viewMode]);

  useEffect(() => {
    if (!map) return;

    const clickListener = map.data.addListener('click', (event: google.maps.Data.MouseEvent) => {
      const nmMun = event.feature.getProperty('NM_MUN');
      onCitySelect(nmMun ? nmMun.toUpperCase() : null);
    });

    const mouseOverListener = map.data.addListener('mousemove', (event: google.maps.Data.MouseEvent) => {
      const nmMun = event.feature.getProperty('NM_MUN');
      const cdMun = event.feature.getProperty('CD_MUN');
      const count = cityStats[cdMun] || 0;
      
      // Captura a posição do pixel na tela para o tooltip customizado
      if (event.domEvent && mapRef.current) {
        const rect = mapRef.current.getBoundingClientRect();
        setHoverInfo({
          x: event.domEvent.clientX - rect.left,
          y: event.domEvent.clientY - rect.top,
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
  }, [map, cityStats, onCitySelect]);

  if (!apiKey || loadError) {
    return (
      <LuxuryCard title="GEOLOCALIZAÇÃO" subtitle="Erro de Configuração" className="h-[40rem]">
        <div className="flex flex-col items-center justify-center h-full text-center gap-6">
          <AlertTriangle className="w-12 h-12 text-rose-500" />
          <p className="text-sm text-zinc-500 font-medium max-w-xs">Erro ao carregar o engine de mapas. Verifique sua chave API do Google Cloud.</p>
        </div>
      </LuxuryCard>
    );
  }

  return (
    <LuxuryCard className="relative p-0 overflow-hidden h-[40rem]">
      <div className="flex flex-col h-full">
        {/* Header integrado com controles */}
        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-100 bg-white z-20">
          <div className="space-y-0.5">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-1 h-3 bg-orange-600 rounded-full" />
              MAPA INTERATIVO REAL
            </h3>
            <p className="text-xl font-black text-zinc-950 tracking-tight leading-tight">
              Contornos Geoespaciais
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

        {/* Área do Mapa */}
        <div className="flex-1 relative bg-zinc-50" ref={mapRef}>
          {isLoaded ? (
            <>
              <GoogleMap 
                mapContainerStyle={mapContainerStyle} 
                center={center} 
                zoom={7} 
                onLoad={onLoad} 
                options={{ 
                  styles: mapStyles, 
                  disableDefaultUI: false, 
                  zoomControl: true, 
                  mapTypeControl: false, 
                  streetViewControl: false, 
                  fullscreenControl: true, 
                  gestureHandling: 'greedy',
                }}
              >
                {/* Pinos Reais de Entrevistas Individuais */}
                {viewMode === 'interviews' && points.map((p: any) => (
                  <Marker
                    key={p.id}
                    position={{ lat: p.lat, lng: p.lng }}
                    icon={{
                      path: google.maps.SymbolPath.CIRCLE,
                      fillColor: '#f97316',
                      fillOpacity: 1,
                      strokeColor: '#ffffff',
                      strokeWeight: 2,
                      scale: 5,
                    }}
                  />
                ))}
              </GoogleMap>

              {/* Tooltip Customizado com Passthrough de Eventos (Pointer Events None) */}
              <AnimatePresence>
                {hoverInfo && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.1 }}
                    style={{ 
                      position: 'absolute', 
                      left: hoverInfo.x + 15, 
                      top: hoverInfo.y + 15,
                      pointerEvents: 'none' // CRÍTICO: Permite zoom através do popup
                    }}
                    className="z-50 glass-capsule p-3 min-w-[12rem] border border-white/40 shadow-2xl"
                  >
                    <div className="space-y-1">
                      <p className="text-[8px] font-black uppercase text-orange-600 flex items-center gap-1">
                        <MapPin size={10} /> Localização
                      </p>
                      <p className="text-sm font-black text-zinc-900 leading-tight">{hoverInfo.name}</p>
                      <div className="mt-2 pt-2 border-t border-zinc-100 flex items-center justify-between gap-4">
                        <span className="text-[8px] font-bold text-zinc-400 uppercase">Amostragem</span>
                        <span className="text-[10px] font-black text-zinc-950">{hoverInfo.count.toLocaleString('pt-BR')} registros</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-6">
              <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">
                Sincronizando Cartografia Maranhense...
              </p>
            </div>
          )}
        </div>
      </div>
    </LuxuryCard>
  );
};
