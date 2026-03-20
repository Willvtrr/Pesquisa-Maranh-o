
"use client";

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, InfoWindow } from '@react-google-maps/api';
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
  { "elementType": "geometry", "stylers": [{ "color": "#f8f9fa" }] },
  { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
  { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
  { "featureType": "road", "stylers": [{ "visibility": "off" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e2e8f0" }] }
];

const MESO_COLORS: Record<string, string> = {
  'Metrop.': '#f43f5e',
  'Norte': '#f97316',
  'Oeste': '#22c55e',
  'Centro': '#eab308',
  'Leste': '#3b82f6',
  'Sul': '#a855f7',
};

const mapIBGENameToApp = (ibgeName: any): MesoRegion => {
  if (!ibgeName) return 'Norte';
  const name = String(ibgeName).toLowerCase();
  if (name.includes('metropolitana')) return 'Metrop.';
  if (name.includes('norte')) return 'Norte';
  if (name.includes('sul')) return 'Sul';
  if (name.includes('oeste')) return 'Oeste';
  if (name.includes('leste')) return 'Leste';
  if (name.includes('centro')) return 'Centro';
  return 'Norte';
};

export const InteractiveMap = ({ onRegionSelect, stats, activeRegion }: InteractiveMapProps) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || "",
    libraries: ['maps'],
    language: 'pt-BR',
    region: 'BR'
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [infoWindowData, setInfoWindowData] = useState<{ lat: number, lng: number, name: string } | null>(null);

  const totalSamples = useMemo(() => Object.values(stats).reduce((a, b) => a + b, 0), [stats]);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    mapInstance.data.loadGeoJson(
      'https://servicodados.ibge.gov.br/api/v3/malhas/estados/21?qualidade=minima&formato=application/vnd.geo+json&intrarregiao=mesorregiao'
    );
  }, []);

  useEffect(() => {
    if (!map) return;

    const clickListener = map.data.addListener('click', (event: google.maps.Data.MouseEvent) => {
      const ibgeName = event.feature.getProperty('nm_meso') || event.feature.getProperty('NM_MESO');
      const regionKey = mapIBGENameToApp(ibgeName);
      
      onRegionSelect(regionKey);
      
      map.panTo(event.latLng);
      map.setZoom(7);

      setInfoWindowData({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        name: ibgeName || regionKey
      });
    });

    return () => {
      google.maps.event.removeListener(clickListener);
    };
  }, [map, onRegionSelect]);

  useEffect(() => {
    if (map) {
      map.data.setStyle((feature) => {
        const ibgeName = feature.getProperty('nm_meso') || feature.getProperty('NM_MESO');
        const regionKey = mapIBGENameToApp(ibgeName);
        
        const isSelectionActive = activeRegion !== 'all';
        const isThisRegionActive = activeRegion === regionKey;
        
        let fillColor = MESO_COLORS[regionKey] || '#52525b';
        let fillOpacity = 0.7;
        let strokeWeight = 1.5;
        let strokeColor = '#ffffff';

        if (isSelectionActive) {
          if (isThisRegionActive) {
            fillOpacity = 0.95;
            strokeWeight = 3;
            strokeColor = '#ffffff';
          } else {
            fillColor = '#cbd5e1'; 
            fillOpacity = 0.15;
            strokeWeight = 0.5;
            strokeColor = '#f1f5f9';
          }
        }
        
        return {
          fillColor,
          fillOpacity,
          strokeColor,
          strokeWeight,
          visible: true
        };
      });
    }
  }, [map, activeRegion]);

  if (!apiKey || loadError) {
    return (
      <LuxuryCard title="Geolocalização" subtitle="Engine de Mapas" className="min-h-[500px]">
        <div className="flex flex-col items-center justify-center h-full text-center gap-6">
          <div className="p-6 rounded-[2rem] bg-zinc-50 border border-zinc-100">
            <AlertTriangle className="w-10 h-10 text-rose-500" />
          </div>
          <p className="text-xs text-zinc-500 font-medium">Erro ao carregar mapa. Verifique sua chave API.</p>
        </div>
      </LuxuryCard>
    );
  }

  return (
    <LuxuryCard title="GEOLOCALIZAÇÃO ESTRATÉGICA" subtitle="Densidade por Mesorregião" className="relative p-0 overflow-hidden min-h-[600px]">
      <div className="absolute top-6 left-6 z-20 pointer-events-none">
        <div className="px-4 py-2 rounded-2xl bg-white/95 backdrop-blur-xl border border-zinc-200 shadow-2xl flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
          <span className="text-[10px] font-black text-zinc-950 uppercase tracking-widest">MAPA INTERATIVO: MARANHÃO</span>
        </div>
      </div>

      <div className="w-full h-full relative">
        {isLoaded ? (
          <GoogleMap 
            mapContainerStyle={mapContainerStyle} 
            center={center} 
            zoom={6} 
            onLoad={onLoad}
            options={{
              styles: mapStyles,
              disableDefaultUI: false,
              zoomControl: true,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: true,
              gestureHandling: 'cooperative'
            }}
          >
            {infoWindowData && (
              <InfoWindow
                position={{ lat: infoWindowData.lat, lng: infoWindowData.lng }}
                onCloseClick={() => setInfoWindowData(null)}
              >
                <div className="p-2 min-w-[120px]">
                  <p className="text-[10px] font-black uppercase text-orange-600 mb-1">Mesorregião</p>
                  <p className="text-sm font-bold text-zinc-900">{infoWindowData.name}</p>
                  <div className="mt-2 pt-2 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-[9px] font-bold text-zinc-400">Status</span>
                    <span className="text-[9px] font-black text-emerald-600 uppercase">Selecionada</span>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 gap-6">
            <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Iniciando Cartografia Digital...</p>
          </div>
        )}

        <AnimatePresence>
          {activeRegion !== 'all' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-6 top-6 bottom-6 w-80 p-8 bg-white/95 backdrop-blur-2xl border border-zinc-200 rounded-[2.5rem] shadow-2xl z-30 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: MESO_COLORS[activeRegion] || '#f97316' }}>
                    {activeRegion === 'Metrop.' ? 'Metropolitana' : activeRegion}
                  </span>
                  <button onClick={() => onRegionSelect('all')} className="p-2 rounded-xl bg-zinc-50 border border-zinc-100 hover:bg-zinc-100 transition-colors">
                    <ArrowUpRight size={16} className="text-zinc-400" />
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Amostra Regional</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-zinc-950 tracking-tighter">
                        {(stats[activeRegion as MesoRegion] || 0).toLocaleString('pt-BR')}
                      </span>
                      <span className="text-xs font-bold text-zinc-400">Entrevistas</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[9px] font-black text-zinc-500 uppercase">Representatividade</span>
                      <span className="text-xl font-black font-mono" style={{ color: MESO_COLORS[activeRegion] }}>
                        {totalSamples > 0 ? ((stats[activeRegion as MesoRegion] / totalSamples) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <div className="h-3 w-full bg-zinc-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(stats[activeRegion as MesoRegion] / totalSamples) * 100}%` }}
                        transition={{ duration: 1, ease: "circOut" }}
                        className="h-full"
                        style={{ backgroundColor: MESO_COLORS[activeRegion] }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-center">
                <p className="text-[9px] text-zinc-400 font-black uppercase tracking-widest">Base de Dados: IBGE 2026</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LuxuryCard>
  );
};
