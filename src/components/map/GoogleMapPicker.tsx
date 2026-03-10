"use client";

import { useState, useCallback } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import styles from "./GoogleMapPicker.module.css";

interface GoogleMapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

export default function GoogleMapPicker({ onLocationSelect, initialLat, initialLng }: GoogleMapPickerProps) {
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null
  );
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  const handleMapClick = useCallback((e: any) => {
    const lat = e.detail?.latLng?.lat;
    const lng = e.detail?.latLng?.lng;
    if (lat && lng) {
      setMarker({ lat, lng });
      onLocationSelect(lat, lng);
    }
  }, [onLocationSelect]);

  if (!apiKey) {
    return (
      <div className={styles.pickerContainer}>
        <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 20 }}>
          Add <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to use the map picker
        </p>
      </div>
    );
  }

  return (
    <div className={styles.pickerContainer}>
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={{ lat: initialLat || -1.286389, lng: initialLng || 36.817223 }}
          defaultZoom={13}
          mapId="macho-location-picker"
          style={{ width: "100%", height: "100%" }}
          colorScheme="DARK"
          onClick={handleMapClick}
        >
          {marker && (
            <AdvancedMarker position={marker}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'var(--color-primary)',
                border: '4px solid white',
                boxShadow: '0 0 16px rgba(108, 60, 224, 0.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px',
              }}>
                📍
              </div>
            </AdvancedMarker>
          )}
        </Map>
      </APIProvider>
      <p className={styles.hint}>
        {marker ? `📍 ${marker.lat.toFixed(4)}, ${marker.lng.toFixed(4)}` : "Click on the map to place a pin"}
      </p>
    </div>
  );
}
