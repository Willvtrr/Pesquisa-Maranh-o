"use client";

import React, { useState, useMemo } from 'react';
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
};

const center = {
  lat: -4.5,
  lng: -44.5,
};

const mapOptions = {
  disableDefaultUI: true,
  styles: [
    { "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
    { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }] }
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
  const [hoveredRegion] = useState<MesoRegion | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || "", 
  });

  const totalSamples = useMemo(() => Object.values(stats).reduce((a, b) => a + b, 0), [stats]);
  const currentRegion = hoveredRegion || (activeRegion !== 'all' ? activeRegion : null);

  if (!apiKey || loadError) {
    return (
      <BentoCard title="Geolocalização" subtitle="Engine de Mapas" className="lg:col-span-2 lg:row-span-2 min-h-[300px]">
        <div className="flex flex-col items-center justify-center h-full p-8 text-center gap-4">
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 shadow-inner">
            {loadError ? <AlertTriangle className="w-8 h-8 text-amber-500" /> : <MapPin className="w-8 h-8 text-zinc-300" />}
          </div>
          <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em]">
            {loadError ? 'Erro na API' : 'Configuração Necessária'}
          </p>
          <p className="text-xs font-medium text-zinc-500 max-w-[200px]">
            {loadError ? 'A API do Google Maps não pôde ser carregada.' : 'Atualização em breve do mapa'}
          </p>
        </div>
      </BentoCard>
    );
  }

  return (
    <BentoCard 
      title="Geolocalização" 
      subtitle="Densidade Real" 
      className="lg:col-span-2 lg:row-span-2 relative p-0 overflow-hidden min-h-[400px] lg:min-h-0"
    >
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white/90 backdrop-blur-md border border-zinc-200 shadow-lg z-20">
        <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 premium-gradient"></span>
        </span>
        <span className="text-[8px] sm:text-[9px] font-black text-zinc-950 uppercase tracking-widest">Ativo</span>
      </div>

      <div className="w-full h-full relative">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={5.5}
            options={mapOptions}
          >
            {regionMarkers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.position}
                onClick={() => onRegionSelect(marker.id)}
                icon={{
                  path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
                  fillColor: activeRegion === marker.id ? "#ea580c" : "#71717a",
                  fillOpacity: 1,
                  strokeColor: "#ffffff",
                  strokeWeight: 2,
                  scale: 1.1,
                  anchor: new google.maps.Point(12, 24),
                }}
              />
            ))}
          </GoogleMap>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 gap-3 sm:gap-4">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 animate-spin" />
            <p className="text-[8px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-widest">Carregando Mapa...</p>
          </div>
        )}

        <AnimatePresence>
          {currentRegion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute left-3 right-3 bottom-3 sm:left-4 sm:right-4 sm:bottom-4 lg:left-auto lg:right-6 lg:bottom-6 p-5 sm:p-6 lg:p-8 bg-white/95 backdrop-blur-xl border border-zinc-200 rounded-2xl sm:rounded-3xl shadow-2xl lg:min-w-[280px] z-30"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-0.5 h-3 sm:w-1 sm:h-4 premium-gradient rounded-full" />
                  <span className="text-[8px] sm:text-[9px] font-black text-orange-600 uppercase tracking-widest">{currentRegion}</span>
                </div>
                <ArrowUpRight size={12} className="sm:size-[14px] text-orange-600" />
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="flex justify-between items-end">
                  <div className="space-y-0.5 sm:space-y-1">
                    <span className="text-[7px] sm:text-[8px] font-black text-zinc-400 uppercase tracking-widest">Amostras</span>
                    <span className="text-2xl sm:text-3xl font-mono font-bold text-zinc-950 leading-none">
                      {stats[currentRegion as MesoRegion] || 0}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[7px] sm:text-[8px] font-black text-zinc-400 uppercase tracking-widest">Share</span>
                    <span className="text-base sm:text-lg font-bold text-orange-600 font-mono">
                      {totalSamples > 0 ? ((stats[currentRegion as MesoRegion] / totalSamples) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
                
                <div className="h-1.5 sm:h-2 w-full inner-relief rounded-full overflow-hidden p-[1px] sm:p-[1.5px]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats[currentRegion as MesoRegion] / totalSamples) * 100}%` }}
                    className="h-full premium-gradient rounded-full"
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
