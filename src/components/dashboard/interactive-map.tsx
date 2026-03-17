
"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { MesoRegion } from '@/data/survey-data';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Loader2, MapPin, AlertTriangle } from 'lucide-react';
import { BentoCard } from './bento-card';

interface InteractiveMapProps {
  onRegionSelect: (region: MesoRegion | null) => void;
  stats: Record<MesoRegion, number>;
  activeRegion: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '2.5rem',
};

// Centralizado aproximadamente no Maranhão
const center = {
  lat: -4.5,
  lng: -44.5,
};

const mapOptions = {
  disableDefaultUI: true,
  styles: [
    {
      "elementType": "geometry",
      "stylers": [{ "color": "#f5f5f5" }]
    },
    {
      "elementType": "labels.icon",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#616161" }]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#f5f5f5" }]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#bdbdbd" }]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [{ "color": "#eeeeee" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [{ "color": "#ffffff" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#e9e9e9" }]
    }
  ],
};

const regionMarkers: { id: MesoRegion; position: { lat: number; lng: number }; label: string }[] = [
  { id: 'Norte', label: 'Norte Maranhense', position: { lat: -2.53, lng: -44.30 } },
  { id: 'Oeste', label: 'Oeste Maranhense', position: { lat: -5.52, lng: -47.47 } },
  { id: 'Centro', label: 'Centro Maranhense', position: { lat: -5.29, lng: -44.49 } },
  { id: 'Leste', label: 'Leste Maranhense', position: { lat: -4.86, lng: -43.35 } },
  { id: 'Sul', label: 'Sul Maranhense', position: { lat: -7.53, lng: -46.03 } },
];

export const InteractiveMap = ({ onRegionSelect, stats, activeRegion }: InteractiveMapProps) => {
  const [hoveredRegion, setHoveredRegion] = useState<MesoRegion | null>(null);
  
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || "", 
  });

  const totalSamples = useMemo(() => 
    Object.values(stats).reduce((a, b) => a + b, 0), 
  [stats]);

  const currentRegion = hoveredRegion || (activeRegion !== 'all' ? activeRegion : null);

  const onMarkerClick = useCallback((regionId: MesoRegion) => {
    onRegionSelect(regionId);
  }, [onRegionSelect]);

  if (!apiKey) {
    return (
      <BentoCard title="Geolocalização" subtitle="Engine de Mapas" className="lg:col-span-2 lg:row-span-2">
        <div className="flex flex-col items-center justify-center h-full p-12 text-center gap-4">
          <div className="p-5 rounded-3xl bg-zinc-50 border border-zinc-100 shadow-inner">
            <MapPin className="w-10 h-10 text-zinc-300" />
          </div>
          <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em]">Configuração Necessária</p>
          <p className="text-sm font-medium text-zinc-500 max-w-xs">
            Habilite a API do Google Maps para visualizar a densidade geospacial em tempo real.
          </p>
        </div>
      </BentoCard>
    );
  }

  if (loadError) {
    return (
      <BentoCard title="Geolocalização" subtitle="Engine de Mapas" className="lg:col-span-2 lg:row-span-2">
        <div className="flex flex-col items-center justify-center h-full p-12 text-center gap-4">
          <div className="p-5 rounded-3xl bg-amber-50 border border-amber-100 shadow-inner">
            <AlertTriangle className="w-10 h-10 text-amber-500" />
          </div>
          <p className="text-[10px] font-black uppercase text-amber-600 tracking-[0.2em]">Erro de Conectividade</p>
          <p className="text-sm font-medium text-zinc-500 max-w-xs">
            A API do Google Maps não pôde ser carregada. Verifique as configurações de domínio e faturamento no console.
          </p>
        </div>
      </BentoCard>
    );
  }

  return (
    <BentoCard 
      title="Geolocalização" 
      subtitle="Densidade de Dados" 
      className="lg:col-span-2 lg:row-span-2 relative group p-0 overflow-hidden"
    >
      <div className="absolute top-8 right-8 flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-zinc-200 shadow-xl z-20">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 premium-gradient"></span>
        </span>
        <span className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.2em]">Sinal: Ativo</span>
      </div>

      <div className="w-full h-full min-h-[500px] relative">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={6}
            options={mapOptions}
          >
            {regionMarkers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.position}
                onClick={() => onMarkerClick(marker.id)}
                onMouseOver={() => setHoveredRegion(marker.id)}
                onMouseOut={() => setHoveredRegion(null)}
                icon={{
                  path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
                  fillColor: activeRegion === marker.id ? "#ea580c" : "#71717a",
                  fillOpacity: 1,
                  strokeColor: "#ffffff",
                  strokeWeight: 2,
                  scale: 1.5,
                  anchor: new google.maps.Point(12, 24),
                }}
              />
            ))}
          </GoogleMap>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 gap-4">
            <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Iniciando Engine de Mapas...</p>
          </div>
        )}

        <AnimatePresence>
          {currentRegion && (
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              className="absolute right-8 bottom-8 p-8 bg-white/95 backdrop-blur-xl border border-zinc-200/80 rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.15)] min-w-[300px] z-30"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-5 premium-gradient rounded-full" />
                  <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em]">Nó Regional</span>
                </div>
                <div className="p-2 rounded-xl inner-relief">
                  <ArrowUpRight size={16} className="text-orange-600" />
                </div>
              </div>
              
              <div className="text-3xl font-bold text-zinc-950 tracking-tighter mb-1">{currentRegion}</div>
              <p className="text-[11px] text-zinc-400 font-bold mb-8 uppercase tracking-[0.2em]">Maranhão • Brasil</p>
              
              <div className="space-y-8">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-zinc-400 uppercase block tracking-widest">Amostragem N</span>
                    <span className="text-4xl font-mono font-bold text-zinc-950 leading-none tracking-tighter">
                      {stats[currentRegion as MesoRegion] || 0}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black text-zinc-400 uppercase block tracking-widest">Share</span>
                    <span className="text-xl font-bold text-orange-600 font-mono">
                      {totalSamples > 0 ? ((stats[currentRegion as MesoRegion] / totalSamples) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
                
                <div className="h-2.5 w-full inner-relief rounded-full overflow-hidden p-[2px]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats[currentRegion as MesoRegion] / totalSamples) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full premium-gradient rounded-full shadow-[0_0_10px_rgba(234,88,12,0.4)]"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BentoCard>
  );
};
