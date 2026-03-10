"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { ReportCard } from "@/components/feed/ReportCard";
import { mockReports } from "@/data/mock";
import { Button } from "@/components/ui/Button";
import { Flame, Clock, MapPin } from "lucide-react";

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState("trending");

  return (
    <div className={styles.feedContainer}>
      {/* Header & Filters */}
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
            <div 
              className={styles.tabIndicator} 
              style={{
                transform: `translateX(${
                  activeTab === "trending" ? "0" : 
                  activeTab === "latest" ? "100%" : "200%"
                })`
              }}
            />
          </div>
        </div>
      </div>

      {/* Feed Stream */}
      <div className={styles.feedStream}>
        {/* We just duplicate the mock reports 3 times to simulate a long feed */}
        {[...mockReports, ...mockReports, ...mockReports].map((report, index) => (
          <div key={`${report.id}-${index}`} className={styles.feedItem}>
            <ReportCard report={report} />
          </div>
        ))}
        
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <span>Loading more voices...</span>
        </div>
      </div>
    </div>
  );
}
