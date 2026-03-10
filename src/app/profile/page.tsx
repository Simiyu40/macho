"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { mockReports, mockUsers } from "@/data/mock";
import { ReportCard } from "@/components/feed/ReportCard";
import { Award, Shield, Settings, FileText, Globe, LogOut } from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("tab") === "settings") {
        return "settings";
      }
    }
    return "reports";
  });
  
  // Use user id "u2" as the current logged in user (Ochieng O.)
  const currentUser = mockUsers[1];
  const userReports = mockReports.filter(r => r.user_id === currentUser.id);

  // Gamification logic
  const rank = currentUser.citizen_credits > 1000 ? "Senior Watchdog" : "Citizen Check";
  
  return (
    <div className={styles.container}>
      {/* Profile Header Card */}
      <Card className={styles.profileHeader}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarWrapper}>
            <Avatar src={currentUser.avatar_url} fallback={currentUser.name.charAt(0)} size="lg" />
            <div className={styles.onlineBadge} />
          </div>
          <div className={styles.userInfo}>
            <h1 className={styles.name}>{currentUser.name}</h1>
            <Badge variant="resolved" className={styles.rankBadge}>
               <Shield size={14} /> {rank}
            </Badge>
          </div>
        </div>

        <div className={styles.statsDivider} />

        <div className={styles.statsSection}>
          <div className={styles.statBox}>
            <span className={styles.statIcon}><Award color="#ffab00" size={24}/></span>
            <div>
              <h3 className={styles.statValue}>{currentUser.citizen_credits.toLocaleString()}</h3>
              <p className={styles.statLabel}>Citizen Credits</p>
            </div>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statIcon}><FileText color="var(--color-primary)" size={24}/></span>
            <div>
              <h3 className={styles.statValue}>{userReports.length}</h3>
              <p className={styles.statLabel}>Reports Filed</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Profile Tabs */}
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
            {userReports.length > 0 ? (
              userReports.map(report => (
                <div key={report.id} className={styles.feedItem}>
                  <ReportCard report={report} />
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <FileText size={48} color="var(--color-text-muted)" />
                <p>You haven&apos;t filed any reports yet.</p>
                <Button>Start Reporting</Button>
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
              <Button variant="danger" fullWidth className={styles.logoutBtn}>
                <LogOut size={18} /> Sign Out
              </Button>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
