
"use client";

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, InfoWindow } from '@react-google-maps/api';
import { Loader2, AlertTriangle, MapPin } from 'lucide-react';
import { LuxuryCard } from './luxury-card';
import MUNICIP_GEOJSON from '@/data/MA_Municipios_2024 (1).json';

interface InteractiveMapProps {
  data: any[];
  onCitySelect: (cityName: string | null) => void;
  activeCity: string;
}

const mapContainerStyle = { 
  width: '100%', 
  height: '100%',
  minHeight: '40rem',
  borderRadius: '2rem'
};

// Centro otimizado para o Maranhão
const center = { lat: -5.1, lng: -45.1 };

const mapStyles = [
  { "elementType": "geometry", "stylers": [{ "color": "#f8f9fa" }] },
  { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#94a3b8" }] },
  { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "visibility": "on" }] },
  { "featureType": "administrative.country", "elementType": "geometry.stroke", "stylers": [{ "color": "#cbd5e1" }] },
  { "featureType": "administrative.province", "elementType": "geometry.stroke", "stylers": [{ "color": "#94a3b8" }, { "weight": 1 }] },
  { "featureType": "administrative.locality", "stylers": [{ "visibility": "off" }] },
  { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
  { "featureType": "road", "stylers": [{ "visibility": "off" }] },
  { "featureType": "transit", "stylers": [{ "visibility": "off" }] },
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
  const [hoverInfo, setHoverInfo] = useState<{ lat: number, lng: number, name: string, count: number } | null>(null);

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
        
        let fillColor = '#f1f5f9'; 
        let fillOpacity = 0.3;
        let strokeWeight = 0.5;
        let strokeColor = '#cbd5e1';

        if (hasData) {
          const intensity = 0.4 + (count / maxCount) * 0.6;
          fillColor = '#ea580c'; 
          fillOpacity = intensity;
          strokeWeight = 0.8;
          strokeColor = '#ffffff';
        }

        if (isSelected) {
          fillOpacity = 0.95;
          strokeWeight = 2.5;
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
  }, [map, cityStats, maxCount, activeCity]);

  useEffect(() => {
    if (!map) return;

    const clickListener = map.data.addListener('click', (event: google.maps.Data.MouseEvent) => {
      const nmMun = event.feature.getProperty('NM_MUN');
      onCitySelect(nmMun ? nmMun.toUpperCase() : null);
    });

    const mouseOverListener = map.data.addListener('mouseover', (event: google.maps.Data.MouseEvent) => {
      const nmMun = event.feature.getProperty('NM_MUN');
      const cdMun = event.feature.getProperty('CD_MUN');
      const count = cityStats[cdMun] || 0;
      
      if (event.latLng) {
        setHoverInfo({
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
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
      <LuxuryCard title="GEOLOCALIZAÇÃO" subtitle="Erro de Configuração" className="min-h-[40rem]">
        <div className="flex flex-col items-center justify-center h-full text-center gap-6">
          <AlertTriangle className="w-12 h-12 text-rose-500" />
          <p className="text-sm text-zinc-500 font-medium max-w-xs">Erro ao carregar o engine de mapas. Verifique sua chave API do Google Cloud.</p>
        </div>
      </LuxuryCard>
    );
  }

  return (
    <LuxuryCard title="MAPA INTERATIVO REAL" subtitle="Contornos Geoespaciais" className="relative p-0 overflow-hidden h-[40rem]">
      <div className="absolute top-6 left-6 z-20 pointer-events-none">
        <div className="px-5 py-2.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-zinc-200 shadow-2xl flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-pulse" />
          <span className="text-[10px] font-black text-zinc-950 uppercase tracking-[0.2em]">Malha IBGE 2024 • Navegação Fluida</span>
        </div>
      </div>

      <div className="w-full h-full relative bg-zinc-50">
        {isLoaded ? (
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
              gestureHandling: 'greedy' // Ativa navegação extremamente fluida (um dedo/scroll)
            }}
          >
            {hoverInfo && (
              <InfoWindow 
                position={{ lat: hoverInfo.lat, lng: hoverInfo.lng }} 
                options={{ pixelOffset: isLoaded ? new window.google.maps.Size(0, -10) : undefined }}
              >
                <div className="p-3 min-w-[10rem]">
                  <p className="text-[9px] font-black uppercase text-orange-600 mb-1 flex items-center gap-1">
                    <MapPin size={10} /> Município
                  </p>
                  <p className="text-sm font-black text-zinc-900 leading-tight">{hoverInfo.name}</p>
                  <div className="mt-2.5 pt-2.5 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-[9px] font-bold text-zinc-400">Amostras</span>
                    <span className="text-[10px] font-black text-zinc-950">{hoverInfo.count.toLocaleString('pt-BR')}</span>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 gap-6">
            <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Iniciando Cartografia Maranhense...</p>
          </div>
        )}
      </div>
    </LuxuryCard>
  );
};
