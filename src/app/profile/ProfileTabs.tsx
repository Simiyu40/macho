"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Settings, FileText, Globe, LogOut, MapPin, Flame } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { createClient } from "@/utils/supabase/client";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface ReportRow {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  status: string;
  severity: string;
  address: string | null;
  county: string | null;
  heat_score: number;
  upvotes_count: number;
  comments_count: number;
  created_at: string;
  agencies: { name: string; slug: string; color: string } | null;
}

export default function ProfileTabs({ userEmail }: { userEmail: string }) {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("tab") === "settings") {
        return "settings";
      }
    }
    return "reports";
  });

  const [reports, setReports] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadUserReports() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("reports")
        .select(`
          id, title, description, image_url, status, severity,
          address, county, heat_score, upvotes_count, comments_count, created_at,
          agencies:agency_id ( name, slug, color )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setReports(data as unknown as ReportRow[]);
      setLoading(false);
    }
    loadUserReports();
  }, []);

  const getStatusVariant = (status: string) => {
    switch(status) {
      case "RESOLVED": return "resolved" as const;
      case "PENDING": return "pending" as const;
      default: return "review" as const;
    }
  };

  return (
    <>
      <div className={styles.tabsWrapper}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === "reports" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("reports")}
          >
            <FileText size={18} /> My Reports
          </button>
          <button 
            className={`${styles.tab} ${activeTab === "settings" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings size={18} /> Settings
          </button>
          <div 
            className={styles.tabIndicator} 
            style={{
              transform: `translateX(${activeTab === "reports" ? "0" : "100%"})`
            }}
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        
        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className={styles.reportsGrid}>
            {loading ? (
              <div className={styles.emptyState}>
                <p>Loading your reports...</p>
              </div>
            ) : reports.length > 0 ? (
              reports.map(report => (
                <Card key={report.id} className={styles.reportItem} hoverEffect>
                  <div className={styles.reportItemHeader}>
                    <div>
                      <h4 className={styles.reportItemTitle}>{report.title}</h4>
                      <p className={styles.reportItemMeta}>
                        {report.address || report.county || "Unknown location"} · {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    <Badge variant={getStatusVariant(report.status || "PENDING")}>
                      {(report.status || "PENDING").replace("_", " ")}
                    </Badge>
                  </div>
                  {report.image_url && (
                    <div className={styles.reportItemImage}>
                      <img src={report.image_url} alt={report.title} />
                    </div>
                  )}
                  <div className={styles.reportItemFooter}>
                    <span className={styles.reportItemHeat}>
                      <Flame size={14} /> {report.heat_score} Heat
                    </span>
                    <span className={styles.reportItemStats}>
                      ❤️ {report.upvotes_count} · 💬 {report.comments_count}
                    </span>
                  </div>
                </Card>
              ))
            ) : (
              <div className={styles.emptyState}>
                <FileText size={48} color="var(--color-text-muted)" />
                <p>You haven&apos;t filed any reports yet.</p>
                <Link href="/submit"><Button>Start Reporting</Button></Link>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className={styles.settingsGrid}>
            
            <Card className={styles.settingsSection}>
              <h3 className={styles.sectionTitle}>Account Setup</h3>
              
              <div className={styles.settingRow}>
                <div className={styles.settingInfo}>
                  <strong>Push Notifications</strong>
                  <span>Get alerts when agencies reply</span>
                </div>
                <div className={styles.switch}>
                  <input type="checkbox" id="push" defaultChecked />
                  <label htmlFor="push"></label>
                </div>
              </div>

              <div className={styles.settingRow}>
                <div className={styles.settingInfo}>
                  <strong>Data Saver Mode</strong>
                  <span>Don&apos;t auto-download images on mobile data</span>
                </div>
                <div className={styles.switch}>
                  <input type="checkbox" id="data" />
                  <label htmlFor="data"></label>
                </div>
              </div>

              <div className={styles.settingRow}>
                <div className={styles.settingInfo}>
                  <strong>Language / Lugha</strong>
                  <span>English</span>
                </div>
                <Globe size={20} color="var(--color-text-muted)" />
              </div>
            </Card>

            <Card className={styles.settingsSection}>
              <h3 className={styles.sectionTitle}>Danger Zone</h3>
              <form action="/auth/signout" method="POST">
                <Button variant="danger" fullWidth className={styles.logoutBtn} type="submit">
                  <LogOut size={18} /> Sign Out
                </Button>
              </form>
            </Card>
          </div>
        )}

      </div>
    </>
  );
}
