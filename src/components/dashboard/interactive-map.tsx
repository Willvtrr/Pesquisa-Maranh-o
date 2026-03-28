
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { Loader2, Layers, Users, Box } from 'lucide-react';
import { LuxuryCard } from './luxury-card';
import MUNICIP_GEOJSON from '@/data/MA_Municipios_2024 (1).json';
import { cn } from '@/lib/utils';

interface InteractiveMapProps {
  data: any[];
  onCitySelect: (cityName: string | null) => void;
  activeCity: string;
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
 * Sub-componente Interno para lógica que usa useMap()
 * Lida com a Data Layer (GeoJSON) e estilização da malha.
 */
const InteractiveMapContent = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Carrega a malha do Maranhão
    try {
      map.data.addGeoJson(MUNICIP_GEOJSON);
    } catch (e) {
      console.warn("GeoJSON já carregado ou erro no carregamento:", e);
    }

    // Estilização inicial da malha solicitada
    map.data.setStyle({
      fillColor: '#ea580c',
      fillOpacity: 0.05,
      strokeColor: '#cbd5e1',
      strokeWeight: 0.5,
      visible: true
    });

    return () => {
      // Limpeza se necessário
    };
  }, [map]);

  return null;
};

/**
 * Função de Extração de Dados GPS conforme prioridades técnicas
 */
const extractLatLng = (item: any) => {
  // Prioridade 1: Campos numéricos _start-geopoint
  const latNum = item['_start-geopoint_latitude'];
  const lngNum = item['_start-geopoint_longitude'];
  if (typeof latNum === 'number' && typeof lngNum === 'number') {
    return { lat: latNum, lng: lngNum };
  }

  // Prioridade 2: Campo string INFO (formato 'lat, lng')
  const info = item['INFO'];
  if (typeof info === 'string') {
    const parts = info.split(',').map(p => parseFloat(p.trim()));
    if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return { lat: parts[0], lng: parts[1] };
    }
  }

  // Fallback para campo 'Coordenadas' se existir
  const coords = item['Coordenadas'];
  if (typeof coords === 'string') {
    const parts = coords.split(',').map(p => parseFloat(p.trim()));
    if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return { lat: parts[0], lng: parts[1] };
    }
  }

  return null;
};

export const InteractiveMap = ({ data, onCitySelect, activeCity }: InteractiveMapProps) => {
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'municipal' | 'interviews'>('municipal');
  const [is3D, setIs3D] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const points = useMemo(() => {
    if (viewMode !== 'interviews') return [];
    return data
      .map(item => {
        const coords = extractLatLng(item);
        return coords ? { ...coords, id: item.id || Math.random().toString() } : null;
      })
      .filter(p => p !== null);
  }, [data, viewMode]);

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
            <InteractiveMapContent />

            {viewMode === 'interviews' && points.map((p: any) => (
              <AdvancedMarker
                key={p.id}
                position={{ lat: p.lat, lng: p.lng }}
              >
                <div className="w-3 h-3 rounded-full bg-orange-600 border-2 border-white shadow-md hover:scale-125 transition-transform cursor-pointer" />
              </AdvancedMarker>
            ))}
          </Map>
        </div>
      </div>
    </LuxuryCard>
  );
};
