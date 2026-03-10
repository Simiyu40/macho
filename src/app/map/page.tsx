"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/Skeleton";

const GoogleMapView = dynamic(
  () => import("@/components/map/GoogleMapView"),
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
  return <GoogleMapView />;
}
