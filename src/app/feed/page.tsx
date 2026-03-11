"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { Flame, Clock, MapPin, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { FeedReportCard } from "@/components/feed/FeedReportCard";
import Link from "next/link";

type FeedTab = "trending" | "latest" | "nearby";

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<FeedTab>("trending");
  const [reports, setReports] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [geoError, setGeoError] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setGeoError("");

      const selectQuery = `*, profiles:user_id ( id, full_name, username, avatar_url ), agencies:agency_id ( id, name, slug, color, verified )`;

      if (activeTab === "trending") {
        const { data } = await supabase
          .from("reports")
          .select(selectQuery)
          .order("heat_score", { ascending: false })
          .limit(50);
        setReports(data || []);
      } else if (activeTab === "latest") {
        const { data } = await supabase
          .from("reports")
          .select(selectQuery)
          .order("created_at", { ascending: false })
          .limit(50);
        setReports(data || []);
      } else if (activeTab === "nearby") {
        // Use browser geolocation
        if (!navigator.geolocation) {
          setGeoError("Geolocation not supported by your browser.");
          setLoading(false);
          return;
        }
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { data } = await supabase.rpc("find_reports_nearby", {
              user_lat: pos.coords.latitude,
              user_lng: pos.coords.longitude,
              radius_km: 10,
            });
            setReports(data || []);
            setLoading(false);
          },
          () => {
            setGeoError("Location access denied. Please enable location to use Near Me.");
            setLoading(false);
          }
        );
        return; // loading state handled in callback
      }
      setLoading(false);
    };

    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <div className={styles.feedContainer}>
      <div className={styles.feedHeader}>
        <h1 className={styles.title}>Citizen Reports</h1>
        <div className={styles.tabsWrapper}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === "trending" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("trending")}
            >
              <Flame size={18} /> Trending
            </button>
            <button
              className={`${styles.tab} ${activeTab === "latest" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("latest")}
            >
              <Clock size={18} /> Latest
            </button>
            <button
              className={`${styles.tab} ${activeTab === "nearby" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("nearby")}
            >
              <MapPin size={18} /> Near Me
            </button>
          </div>
        </div>
      </div>

      <div className={styles.feedStream}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "64px 20px", color: "var(--color-text-muted)" }}>
            <Loader2 size={32} style={{ animation: "spin 1s linear infinite" }} />
            <p style={{ marginTop: 12 }}>Loading reports...</p>
          </div>
        ) : geoError ? (
          <div style={{ textAlign: "center", padding: "64px 20px", color: "var(--color-status-critical)" }}>
            <MapPin size={32} />
            <p style={{ marginTop: 12 }}>{geoError}</p>
          </div>
        ) : reports.length > 0 ? (
          reports.map((report) => (
            <Link key={report.id as string} href={`/report/${report.id}`} style={{ textDecoration: "none" }}>
              <div className={styles.feedItem}>
                <FeedReportCard report={report as Record<string, unknown> & { id: string; title: string; description: string; user_id: string }} />
              </div>
            </Link>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "64px 20px", color: "var(--color-text-muted)", fontSize: "1.1rem" }}>
            <p>{activeTab === "nearby" ? "No reports found nearby. Try increasing the radius." : "No reports yet. Be the first to report an issue!"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
