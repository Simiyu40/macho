import styles from "./page.module.css";
import { Flame, Clock, MapPin } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { FeedReportCard } from "@/components/feed/FeedReportCard";

export default async function FeedPage() {
  const supabase = await createClient();

  // Fetch all reports with their profile & agency data
  const { data: reports } = await supabase
    .from("reports")
    .select(`
      *,
      profiles:user_id ( id, full_name, username, avatar_url ),
      agencies:agency_id ( id, name, slug, color, verified )
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className={styles.feedContainer}>
      {/* Header & Filters */}
      <div className={styles.feedHeader}>
        <h1 className={styles.title}>Citizen Reports</h1>
        
        <div className={styles.tabsWrapper}>
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${styles.activeTab}`}>
              <Flame size={18} /> Trending
            </button>
            <button className={styles.tab}>
              <Clock size={18} /> Latest
            </button>
            <button className={styles.tab}>
              <MapPin size={18} /> Near Me
            </button>
          </div>
        </div>
      </div>

      {/* Feed Stream */}
      <div className={styles.feedStream}>
        {reports && reports.length > 0 ? (
          reports.map((report) => (
            <div key={report.id} className={styles.feedItem}>
              <FeedReportCard report={report} />
            </div>
          ))
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '64px 20px', 
            color: 'var(--color-text-muted)',
            fontSize: '1.1rem'
          }}>
            <p>No reports yet. Be the first to report an issue!</p>
          </div>
        )}
      </div>
    </div>
  );
}
