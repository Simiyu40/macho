"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/Skeleton";

// Dynamically import MapView with SSR disabled because Leaflet uses window/document
const MapView = dynamic(
  () => import("@/components/map/MapView"),
  { 
    ssr: false,
    loading: () => (
      <div style={{ width: "100%", height: "calc(100vh - 72px)", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        <Skeleton style={{ height: 60, width: 250 }} />
        <Skeleton style={{ flex: 1, width: "100%" }} />
      </div>
    )
  }
);

export default function MapPage() {
  return <MapView />;
}
