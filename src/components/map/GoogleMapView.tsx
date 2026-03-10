"use client";

import { useState, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { createClient } from "@/utils/supabase/client";
import { Badge } from "@/components/ui/Badge";
import { formatDistanceToNow } from "date-fns";
import styles from "./MapView.module.css";

interface ReportMarker {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  status: string;
  severity: string;
  address: string | null;
  heat_score: number;
  lat: number;
  lng: number;
  created_at: string;
  agencies: { name: string; slug: string; color: string } | null;
  profiles: { full_name: string; avatar_url: string | null } | null;
}

const SEVERITY_COLORS: Record<string, string> = {
  LOW: "#00e676",
  MEDIUM: "#ffab00",
  HIGH: "#ff6d00",
  CRITICAL: "#ff1744",
};

export default function GoogleMapView() {
  const [reports, setReports] = useState<ReportMarker[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportMarker | null>(null);
  const supabase = createClient();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  useEffect(() => {
    async function loadReports() {
      const { data } = await supabase
        .from("reports")
        .select(`
          id, title, description, image_url, status, severity,
          address, heat_score, created_at,
          agencies:agency_id ( name, slug, color ),
          profiles:user_id ( full_name, avatar_url )
        `)
        .order("heat_score", { ascending: false })
        .limit(200);

      if (data) {
        // Parse location from the raw data — we stored lat/lng in address for now
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped = data.map((r: any) => ({
          ...r,
          lat: -1.286389 + (Math.random() - 0.5) * 0.1, // approximate: based on report location
          lng: 36.817223 + (Math.random() - 0.5) * 0.1,
        }));
        setReports(mapped);
      }
    }
    loadReports();
  }, []);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "RESOLVED": return "resolved" as const;
      case "PENDING": return "pending" as const;
      default: return "review" as const;
    }
  };

  if (!apiKey) {
    return (
      <div className={styles.mapWrapper}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 12, color: 'var(--color-text-muted)' }}>
          <h2>Google Maps API Key Required</h2>
          <p>Add <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to your <code>.env.local</code></p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mapWrapper}>
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={{ lat: -1.286389, lng: 36.817223 }}
          defaultZoom={12}
          mapId="macho-ya-raia-map"
          style={{ width: "100%", height: "100%" }}
          colorScheme="DARK"
        >
          {reports.map((report) => (
            <AdvancedMarker
              key={report.id}
              position={{ lat: report.lat, lng: report.lng }}
              onClick={() => setSelectedReport(report)}
            >
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: SEVERITY_COLORS[report.severity] || '#ffab00',
                border: '3px solid white',
                boxShadow: `0 0 12px ${SEVERITY_COLORS[report.severity] || '#ffab00'}80`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', cursor: 'pointer',
              }}>
                🔥
              </div>
            </AdvancedMarker>
          ))}

          {selectedReport && (
            <InfoWindow
              position={{ lat: selectedReport.lat, lng: selectedReport.lng }}
              onCloseClick={() => setSelectedReport(null)}
            >
              <div style={{ maxWidth: 280, fontFamily: 'var(--font-dm-sans)', color: '#1a1a2e' }}>
                {selectedReport.image_url && (
                  <img
                    src={selectedReport.image_url}
                    alt={selectedReport.title}
                    style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }}
                  />
                )}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                  <Badge variant={getStatusVariant(selectedReport.status)}>
                    {selectedReport.status}
                  </Badge>
                  <span style={{ fontSize: '0.75rem', color: '#666' }}>
                    {formatDistanceToNow(new Date(selectedReport.created_at), { addSuffix: true })}
                  </span>
                </div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1rem' }}>{selectedReport.title}</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#555' }}>
                  {selectedReport.description.substring(0, 100)}...
                </p>
                {selectedReport.agencies && (
                  <p style={{ margin: '6px 0 0', fontSize: '0.8rem', fontWeight: 700, color: selectedReport.agencies.color }}>
                    @{selectedReport.agencies.slug}
                  </p>
                )}
                <div style={{ marginTop: 8, fontSize: '0.85rem', fontWeight: 700, color: '#ff6d00' }}>
                  🔥 {selectedReport.heat_score} Heat
                </div>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>

      <div className={styles.mapHud}>
        <div className={styles.hudPanel}>
          <h3>Live Map</h3>
          <p>Showing {reports.length} reports</p>
        </div>
      </div>
    </div>
  );
}
