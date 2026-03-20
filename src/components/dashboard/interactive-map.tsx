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
  { "elementType": "geometry", "stylers": [{ "color": "#fdfdfd" }] },
  { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
  { "featureType": "administrative.land_parcel", "stylers": [{ "visibility": "off" }] },
  { "featureType": "administrative.neighborhood", "stylers": [{ "visibility": "off" }] },
  { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
  { "featureType": "road", "stylers": [{ "visibility": "off" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e2e8f0" }] }
];

const MESO_COLORS: Record<string, string> = {
  'Metrop.': '#f43f5e',
  'Norte': '#f97316',
  'Oeste': '#eab308',
  'Centro': '#22c55e',
  'Leste': '#3b82f6',
  'Sul': '#a855f7',
};

const mapIBGENameToApp = (ibgeName: string | undefined | null): MesoRegion => {
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
  const [hoverInfo, setHoverInfo] = useState<{ lat: number, lng: number, name: string } | null>(null);

  const totalSamples = useMemo(() => Object.values(stats).reduce((a, b) => a + b, 0), [stats]);
  const currentRegion = activeRegion !== 'all' ? activeRegion : null;

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
      const region = mapIBGENameToApp(ibgeName);
      onRegionSelect(region);
      setHoverInfo({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        name: ibgeName || region
      });
    });

    const overListener = map.data.addListener('mouseover', (event: google.maps.Data.MouseEvent) => {
      map.data.overrideStyle(event.feature, { fillOpacity: 0.9, strokeWeight: 3 });
    });

    const outListener = map.data.addListener('mouseout', (event: google.maps.Data.MouseEvent) => {
      map.data.revertStyle();
    });

    return () => {
      google.maps.event.removeListener(clickListener);
      google.maps.event.removeListener(overListener);
      google.maps.event.removeListener(outListener);
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
        let fillOpacity = 0.6;
        let strokeWeight = 1;
        let strokeColor = '#ffffff';

        if (isSelectionActive) {
          if (isThisRegionActive) {
            fillOpacity = 0.9;
            strokeWeight = 2.5;
            strokeColor = '#ffffff';
          } else {
            fillColor = '#cbd5e1'; 
            fillOpacity = 0.15;
            strokeWeight = 0.5;
            strokeColor = '#e2e8f0';
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
                ? "Erro: Chave de API inválida ou domínio não autorizado."
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
      <div className="absolute top-6 left-6 z-20 flex flex-col gap-2 pointer-events-none">
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
            onLoad={onLoad}
            options={{
              styles: mapStyles,
              disableDefaultUI: true,
              zoomControl: false,
              gestureHandling: 'cooperative'
            }}
          >
            {hoverInfo && (
              <InfoWindow
                position={{ lat: hoverInfo.lat, lng: hoverInfo.lng }}
                onCloseClick={() => setHoverInfo(null)}
              >
                <div className="p-2">
                  <p className="text-[10px] font-black uppercase text-orange-600">{hoverInfo.name}</p>
                </div>
              </InfoWindow>
            )}
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
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: MESO_COLORS[currentRegion] || '#f97316' }}>
                    {currentRegion === 'Metrop.' ? 'Metropolitana' : currentRegion} Maranhense
                  </span>
                  <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100" style={{ color: MESO_COLORS[currentRegion] }}>
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
                      <span className="text-xl font-black font-mono" style={{ color: MESO_COLORS[currentRegion] }}>
                        {totalSamples > 0 ? ((stats[currentRegion as MesoRegion] / totalSamples) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <div className="h-3 w-full bg-zinc-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(stats[currentRegion as MesoRegion] / totalSamples) * 100}%` }}
                        transition={{ duration: 1, ease: "circOut" }}
                        className="h-full shadow-lg"
                        style={{ backgroundColor: MESO_COLORS[currentRegion] }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100">
                <p className="text-[9px] text-zinc-500 font-bold uppercase leading-relaxed text-center">
                  Dados baseados na malha oficial do IBGE. Interface em Português.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LuxuryCard>
  );
};