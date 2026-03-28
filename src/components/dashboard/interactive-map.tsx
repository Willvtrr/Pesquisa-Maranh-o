
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Map, AdvancedMarker, useMap, InfoWindow } from '@vis.gl/react-google-maps';
import { Loader2, Layers, Users, Box, MapPin } from 'lucide-react';
import { LuxuryCard } from './luxury-card';
import MUNICIP_GEOJSON from '@/data/MA_Municipios_2024 (1).json';
import { cn } from '@/lib/utils';

interface InteractiveMapProps {
  data: any[];
  onCitySelect?: (cityName: string | null) => void;
  activeCity?: string;
}

const center = { lat: -5.1, lng: -45.1 };

const mapStyles = [
  { "elementType": "geometry", "stylers": [{ "color": "#f8f9fa" }] },
  { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
  { "featureType": "road", "stylers": [{ "visibility": "off" }] },
  { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e2e8f0" }] }
];

/**
 * Função de Extração de Dados GPS com prioridades técnicas
 */
const extractLatLng = (item: any) => {
  const latNum = item['_start-geopoint_latitude'];
  const lngNum = item['_start-geopoint_longitude'];
  if (typeof latNum === 'number' && typeof lngNum === 'number') {
    return { lat: latNum, lng: lngNum };
  }

  const info = item['INFO'] || item['Coordenadas'];
  if (typeof info === 'string') {
    const parts = info.split(',').map(p => parseFloat(p.trim()));
    if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return { lat: parts[0], lng: parts[1] };
    }
  }
  return null;
};

/**
 * Sub-componente Interno para lógica da Data Layer e Estilização
 */
const InteractiveMapContent = ({ data, setHoveredCity }: any) => {
  const map = useMap();

  const cityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((item: any) => {
      const city = String(item["Cidade:"] || "").toUpperCase();
      if (city) counts[city] = (counts[city] || 0) + 1;
    });
    return counts;
  }, [data]);

  const maxCount = useMemo(() => {
    const values = Object.values(cityCounts);
    return values.length > 0 ? Math.max(...values) : 1;
  }, [cityCounts]);

  useEffect(() => {
    if (!map) return;

    try {
      map.data.addGeoJson(MUNICIP_GEOJSON);
    } catch (e) {}

    const mouseOverListener = map.data.addListener('mouseover', (event: any) => {
      const cityName = event.feature.getProperty('NM_MUN');
      setHoveredCity(cityName);
      map.data.overrideStyle(event.feature, { 
        strokeColor: '#ea580c', 
        strokeWeight: 2,
        fillOpacity: 0.9 
      });
    });

    const mouseOutListener = map.data.addListener('mouseout', (event: any) => {
      setHoveredCity(null);
      map.data.revertStyle();
    });

    return () => {
      google.maps.event.removeListener(mouseOverListener);
      google.maps.event.removeListener(mouseOutListener);
    };
  }, [map, setHoveredCity]);

  useEffect(() => {
    if (!map) return;
    map.data.setStyle((feature) => {
      const cityName = String(feature.getProperty('NM_MUN')).toUpperCase();
      const count = cityCounts[cityName] || 0;
      const opacity = count > 0 ? 0.1 + (count / maxCount) * 0.7 : 0.05;

      return {
        fillColor: '#ea580c',
        fillOpacity: opacity,
        strokeColor: '#cbd5e1',
        strokeWeight: 0.5,
        visible: true
      };
    });
  }, [map, cityCounts, maxCount]);

  return null;
};

export const InteractiveMap = ({ data, onCitySelect, activeCity }: InteractiveMapProps) => {
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'municipal' | 'interviews'>('municipal');
  const [is3D, setIs3D] = useState(false);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<any | null>(null);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const points = useMemo(() => {
    return data
      .map(item => {
        const coords = extractLatLng(item);
        return coords ? { ...coords, id: item.id || Math.random().toString(), originalData: item } : null;
      })
      .filter(p => p !== null);
  }, [data]);

  if (!mounted) {
    return (
      <LuxuryCard className="h-[40rem] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
      </LuxuryCard>
    );
  }

  return (
    <LuxuryCard className="relative p-0 overflow-hidden h-[45rem]">
      <div className="flex flex-col h-full">
        {/* Header Controls */}
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

        {/* Map Area */}
        <div className="flex-1 relative bg-zinc-50">
          <Map
            defaultCenter={center}
            defaultZoom={7}
            mapId={is3D ? "496b3e09ad10e939" : "focco_analytics_dashboard"}
            styles={mapStyles}
            disableDefaultUI={false}
            gestureHandling={'greedy'}
          >
            <InteractiveMapContent data={data} setHoveredCity={setHoveredCity} />

            {/* Individual Markers Mode */}
            {viewMode === 'interviews' && points.map((p: any) => (
              <AdvancedMarker
                key={p.id}
                position={{ lat: p.lat, lng: p.lng }}
                onClick={() => setSelectedPoint(p.originalData)}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-orange-600 border-2 border-white shadow-[0_0_10px_rgba(234,88,12,0.4)] hover:scale-150 transition-transform cursor-pointer" />
              </AdvancedMarker>
            ))}

            {/* InfoWindow for Selected Point */}
            {selectedPoint && (
              <InfoWindow
                position={extractLatLng(selectedPoint)}
                onCloseClick={() => setSelectedPoint(null)}
              >
                <div className="p-3 min-w-[200px] space-y-3 font-sans">
                  <div className="flex items-center gap-2 border-b border-zinc-100 pb-2">
                    <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600">
                      <MapPin size={14} />
                    </div>
                    <h3 className="font-black text-sm uppercase tracking-tight text-zinc-950">
                      {selectedPoint["Cidade:"] || "Município não informado"}
                    </h3>
                  </div>
                  
                  <div className="space-y-2 text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-zinc-400 font-bold uppercase tracking-widest">Perfil:</span>
                      <span className="text-zinc-900 font-black">{selectedPoint["Gênero"]} • {selectedPoint["Faixa Etária"]}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400 font-bold uppercase tracking-widest">Visão Política:</span>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full font-black",
                        String(selectedPoint["Você se considera de esquerda, centro ou direita?"]).toLowerCase().includes('esquerda') ? "bg-rose-50 text-rose-600" : 
                        String(selectedPoint["Você se considera de esquerda, centro ou direita?"]).toLowerCase().includes('direita') ? "bg-blue-50 text-blue-600" : "bg-zinc-100 text-zinc-600"
                      )}>
                        {selectedPoint["Você se considera de esquerda, centro ou direita?"] || "N/A"}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-zinc-50">
                      <p className="text-zinc-400 font-bold uppercase tracking-widest mb-1 text-[8px]">Voto Presidente:</p>
                      <p className="text-zinc-950 font-black text-[11px] leading-tight">
                        {selectedPoint["4. PRESIDENTE: Se as eleições para Presidente da República fossem hoje, em quem você votaria? (Estimulada)"] || "Indeciso"}
                      </p>
                    </div>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Map>

          {/* Hover Tooltip Overlay */}
          {hoveredCity && (
            <div className="absolute bottom-6 left-6 z-30 bg-zinc-950 text-white px-4 py-2 rounded-xl shadow-2xl border border-white/10 backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest">{hoveredCity}</span>
            </div>
          )}
        </div>
      </div>
    </LuxuryCard>
  );
};
