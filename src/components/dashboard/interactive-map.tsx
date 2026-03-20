
"use client";

import React, { useState, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { MesoRegion } from '@/data/survey-data';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Loader2, MapPin, AlertTriangle } from 'lucide-react';
import { LuxuryCard } from './luxury-card';

interface InteractiveMapProps {
  onRegionSelect: (region: MesoRegion | null) => void;
  stats: Record<MesoRegion, number>;
  activeRegion: string;
}

const mapContainerStyle = { width: '100%', height: '100%' };
const center = { lat: -5.0, lng: -45.0 };

const mapStyles = [
  { "elementType": "geometry", "stylers": [{ "color": "#fdfdfd" }] },
  { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
  { "featureType": "administrative.land_parcel", "stylers": [{ "visibility": "off" }] },
  { "featureType": "administrative.neighborhood", "stylers": [{ "visibility": "off" }] },
  { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
  { "featureType": "road", "stylers": [{ "visibility": "off" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e2e8f0" }] }
];

const regionMarkers: { id: MesoRegion; position: { lat: number; lng: number }; label: string }[] = [
  { id: 'Metrop.', label: 'Metropolitana de São Luís', position: { lat: -2.53, lng: -44.30 } },
  { id: 'Norte', label: 'Norte Maranhense', position: { lat: -3.50, lng: -44.80 } },
  { id: 'Oeste', label: 'Oeste Maranhense', position: { lat: -5.52, lng: -47.47 } },
  { id: 'Centro', label: 'Centro Maranhense', position: { lat: -5.29, lng: -44.49 } },
  { id: 'Leste', label: 'Leste Maranhense', position: { lat: -4.86, lng: -43.35 } },
  { id: 'Sul', label: 'Sul Maranhense', position: { lat: -7.53, lng: -46.03 } },
];

export const InteractiveMap = ({ onRegionSelect, stats, activeRegion }: InteractiveMapProps) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || "", 
  });

  const totalSamples = useMemo(() => Object.values(stats).reduce((a, b) => a + b, 0), [stats]);
  const currentRegion = activeRegion !== 'all' ? activeRegion : null;

  if (!apiKey || loadError) {
    return (
      <LuxuryCard title="Geolocalização" subtitle="Engine de Mapas Profissional" className="lg:col-span-2 lg:row-span-2 min-h-[400px]">
        <div className="flex flex-col items-center justify-center h-full p-12 text-center gap-6">
          <div className="p-6 rounded-[2rem] bg-zinc-50 border border-zinc-100 shadow-inner">
            {loadError ? <AlertTriangle className="w-10 h-10 text-rose-500" /> : <MapPin className="w-10 h-10 text-zinc-300" />}
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.3em]">
              {loadError ? 'Erro de Autenticação' : 'Protocolo de Visualização'}
            </p>
            <p className="text-xs text-zinc-500 font-medium max-w-xs">
              {loadError 
                ? "Este domínio não está autorizado nas configurações da sua Chave de API (RefererNotAllowedMapError). Verifique o Google Cloud Console."
                : "Insira uma chave API do Google Maps para ativar a engine de geolocalização estratégica."
              }
            </p>
          </div>
        </div>
      </LuxuryCard>
    );
  }

  return (
    <LuxuryCard title="Geolocalização" subtitle="Densidade Regional" className="lg:col-span-2 lg:row-span-2 relative p-0 overflow-hidden min-h-[500px]">
      <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
        <div className="px-4 py-2 rounded-2xl bg-white/95 backdrop-blur-xl border border-zinc-200 shadow-2xl flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
          <span className="text-[10px] font-black text-zinc-950 uppercase tracking-widest">Monitoramento Ativo: Maranhão</span>
        </div>
      </div>

      <div className="w-full h-full relative">
        {isLoaded ? (
          <GoogleMap 
            mapContainerStyle={mapContainerStyle} 
            center={center} 
            zoom={6} 
            options={{
              styles: mapStyles,
              disableDefaultUI: true,
              zoomControl: false,
              gestureHandling: 'cooperative'
            }}
          >
            {regionMarkers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.position}
                onClick={() => onRegionSelect(marker.id)}
                icon={{
                  path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
                  fillColor: activeRegion === marker.id ? "#ea580c" : "#18181b",
                  fillOpacity: 1,
                  strokeColor: "#ffffff",
                  strokeWeight: 2,
                  scale: activeRegion === marker.id ? 1.4 : 1.1,
                  anchor: new google.maps.Point(12, 24),
                }}
              />
            ))}
          </GoogleMap>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 gap-6">
            <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Sincronizando Satélites...</p>
          </div>
        )}

        <AnimatePresence>
          {currentRegion && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-6 top-6 bottom-6 w-80 p-8 bg-white/95 backdrop-blur-2xl border border-zinc-200 rounded-[2.5rem] shadow-2xl z-30 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">{currentRegion} Maranhense</span>
                  <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
                    <ArrowUpRight size={16} />
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Amostragem Real</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-zinc-950 tracking-tighter">
                        {(stats[currentRegion as MesoRegion] || 0).toLocaleString('pt-BR')}
                      </span>
                      <span className="text-xs font-bold text-zinc-400">Entrevistas</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[9px] font-black text-zinc-500 uppercase">Representatividade</span>
                      <span className="text-xl font-black text-orange-600 font-mono">
                        {totalSamples > 0 ? ((stats[currentRegion as MesoRegion] / totalSamples) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <div className="h-3 w-full bg-zinc-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(stats[currentRegion as MesoRegion] / totalSamples) * 100}%` }}
                        transition={{ duration: 1, ease: "circOut" }}
                        className="h-full bg-orange-600 shadow-[0_0_15px_rgba(234,88,12,0.4)]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100">
                <p className="text-[9px] text-zinc-500 font-bold uppercase leading-relaxed text-center">
                  Dados segmentados por zona de influência regional de alta precisão.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LuxuryCard>
  );
};
