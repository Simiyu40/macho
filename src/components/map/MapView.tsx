// Leaflet styles must be imported
import "leaflet/dist/leaflet.css";

// This is a dynamic import in the page, so it only runs on the client.
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import L from "leaflet";
import { mockReports } from "@/data/mock";
import styles from "./MapView.module.css";
import { Badge } from "@/components/ui/Badge";
import { formatDistanceToNow } from "date-fns";

// Custom dark marker icon
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Fix for default icons in React Leaflet
L.Marker.prototype.options.icon = customIcon;

export default function MapView() {
  // Center roughly on Nairobi for demo
  const center: [number, number] = [-1.286389, 36.817223];

  const getStatusVariant = (status: string) => {
    switch(status) {
      case "RESOLVED": return "resolved";
      case "PENDING": return "pending";
      default: return "review";
    }
  };

  return (
    <div className={styles.mapWrapper}>
      <MapContainer 
        center={center} 
        zoom={12} 
        zoomControl={false} // We add it manually so we can position it
        className={styles.map}
      >
        {/* Dark theme tile layer via CartoDB Dark Matter */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={20}
        />
        
        <ZoomControl position="bottomright" />

        {mockReports.map(report => (
          <Marker 
            key={report.id} 
            position={[report.location.lat, report.location.lng]}
          >
            <Popup className={styles.customPopup}>
              <div className={styles.popupContent}>
                <div 
                  className={styles.popupImage} 
                  style={{ backgroundImage: `url(${report.image_url})`}} 
                />
                <div className={styles.popupDetails}>
                  <div className={styles.popupHeader}>
                    <Badge variant={getStatusVariant(report.status)}>{report.status}</Badge>
                    <span className={styles.timeLabel}>
                      {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <strong>{report.title}</strong>
                  <p className={styles.agencyTag} style={{ color: report.agency?.color }}>
                    @{report.agency?.slug}
                  </p>
                  <p className={styles.snippet}>{report.description.substring(0, 60)}...</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* HUD Overlay filters could go here */}
      <div className={styles.mapHud}>
        <div className={styles.hudPanel}>
          <h3>Live Map</h3>
          <p>Showing {mockReports.length} reports near you</p>
        </div>
      </div>
    </div>
  );
}
