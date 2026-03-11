import styles from "./page.module.css";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Activity, Users, AlertTriangle, ShieldCheck, Flame } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Real stats from Supabase
  const [
    { count: totalOpen },
    { count: totalResolved },
    { count: totalUsers },
    { data: topCounties },
  ] = await Promise.all([
    supabase.from("reports").select("*", { count: "exact", head: true }).neq("status", "RESOLVED"),
    supabase.from("reports").select("*", { count: "exact", head: true }).eq("status", "RESOLVED"),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("reports")
      .select("county, heat_score, status")
      .order("heat_score", { ascending: false })
      .limit(200),
  ]);

  // Aggregate leaderboard by county
  const countyMap = new Map<string, { unresolved: number; heat: number }>();
  (topCounties || []).forEach((r: { county: string | null; heat_score: number | null; status: string | null }) => {
    const county = r.county || "Unknown";
    const entry = countyMap.get(county) || { unresolved: 0, heat: 0 };
    entry.heat += r.heat_score || 0;
    if (r.status !== "RESOLVED") entry.unresolved++;
    countyMap.set(county, entry);
  });
  const leaderboard = Array.from(countyMap.entries())
    .map(([county, data]) => ({ county, ...data }))
    .sort((a, b) => b.heat - a.heat)
    .slice(0, 10);

  const maxHeat = leaderboard[0]?.heat || 1;

  // Category breakdown
  const severityCounts = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
  (topCounties || []).forEach((r: { county: string | null; heat_score: number | null; status: string | null; severity?: string }) => {
    const sev = (r as Record<string, unknown>).severity as string || "MEDIUM";
    if (sev in severityCounts) severityCounts[sev as keyof typeof severityCounts]++;
  });
  const totalSev = Object.values(severityCounts).reduce((a, b) => a + b, 1);

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Accountability Matrix</h1>
        <p className={styles.subtitle}>Real-time public infrastructure metrics.</p>
      </header>

      {/* Top Stats */}
      <div className={styles.statsGrid}>
        <StatCard 
          title="Total Open Reports" 
          value={(totalOpen || 0).toLocaleString()} 
          icon={AlertTriangle} 
          color="#ff1744"
        />
        <StatCard 
          title="Total Resolved" 
          value={(totalResolved || 0).toLocaleString()} 
          icon={ShieldCheck} 
          color="#00e676"
        />
        <StatCard 
          title="Active Watchdogs" 
          value={(totalUsers || 0).toLocaleString()} 
          icon={Users} 
          color="#00e5ff"
        />
        <StatCard 
          title="Total Heat" 
          value={leaderboard.reduce((s, c) => s + c.heat, 0).toLocaleString()} 
          icon={Activity} 
          color="#ffab00"
        />
      </div>

      <div className={styles.mainGrid}>
        
        {/* Left Column: Leaderboard */}
        <div className={styles.colLarge}>
          <Card className={styles.leaderboardCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <Flame color="var(--color-status-critical)" size={24} />
                <h2>Leaderboard of Neglect</h2>
              </div>
              <Badge variant="critical">Highest Heat</Badge>
            </div>
            
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>County</th>
                    <th className={styles.textRight}>Unresolved</th>
                    <th className={styles.textRight}>Heat Level</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.length > 0 ? leaderboard.map((item, i) => (
                    <tr key={item.county} className={i < 3 ? styles.topRank : ""}>
                      <td className={styles.rankCell}>#{i + 1}</td>
                      <td className={styles.countyCell}>{item.county}</td>
                      <td className={styles.textRight}>{item.unresolved.toLocaleString()}</td>
                      <td className={styles.textRight}>
                        <div className={styles.heatBarContainer}>
                          <div 
                            className={styles.heatBar} 
                            style={{ width: `${(item.heat / maxHeat) * 100}%` }}
                          />
                          <span className={styles.heatText}>{item.heat.toLocaleString()}</span>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} style={{ textAlign: "center", padding: 24, color: "var(--color-text-muted)" }}>No reports yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column: Charts */}
        <div className={styles.colSmall}>
          <Card className={styles.chartCard}>
            <h3>Resolution Rate</h3>
            <div className={styles.donutChartContainer}>
              <div className={styles.donutOuter}>
                <div className={styles.donutInner}>
                  <div className={styles.donutScore}>
                    <span>{totalOpen && totalResolved ? Math.round(((totalResolved) / ((totalOpen || 0) + (totalResolved || 0))) * 100) : 0}%</span>
                    <small>Resolved</small>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.legendWrapper}>
              <div className={styles.legendItem}>
                <span className={styles.dot} style={{ background: "var(--color-primary)" }} />
                <span>Resolved ({totalResolved || 0})</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.dot} style={{ background: "rgba(255,255,255,0.1)" }} />
                <span>Open ({totalOpen || 0})</span>
              </div>
            </div>
          </Card>

          <Card className={styles.chartCard}>
             <h3>Severity Breakdown</h3>
             <ul className={styles.barChartList}>
               <li className={styles.barItem}>
                 <div className={styles.barLabel}>
                   <span>Critical</span>
                   <span>{Math.round((severityCounts.CRITICAL / totalSev) * 100)}%</span>
                 </div>
                 <div className={styles.barTrack}><div className={styles.barFill} style={{ width: `${(severityCounts.CRITICAL / totalSev) * 100}%`, background: '#ff1744' }}/></div>
               </li>
               <li className={styles.barItem}>
                 <div className={styles.barLabel}>
                   <span>High</span>
                   <span>{Math.round((severityCounts.HIGH / totalSev) * 100)}%</span>
                 </div>
                 <div className={styles.barTrack}><div className={styles.barFill} style={{ width: `${(severityCounts.HIGH / totalSev) * 100}%`, background: '#ffab00' }}/></div>
               </li>
               <li className={styles.barItem}>
                 <div className={styles.barLabel}>
                   <span>Medium</span>
                   <span>{Math.round((severityCounts.MEDIUM / totalSev) * 100)}%</span>
                 </div>
                 <div className={styles.barTrack}><div className={styles.barFill} style={{ width: `${(severityCounts.MEDIUM / totalSev) * 100}%`, background: '#00e5ff' }}/></div>
               </li>
               <li className={styles.barItem}>
                 <div className={styles.barLabel}>
                   <span>Low</span>
                   <span>{Math.round((severityCounts.LOW / totalSev) * 100)}%</span>
                 </div>
                 <div className={styles.barTrack}><div className={styles.barFill} style={{ width: `${(severityCounts.LOW / totalSev) * 100}%`, background: '#6c3ce0' }}/></div>
               </li>
             </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
