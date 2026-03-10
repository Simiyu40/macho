import styles from "./page.module.css";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Activity, Users, AlertTriangle, ShieldCheck, Flame } from "lucide-react";

// Mock Data for Dashboard
const leaderboard = [
  { county: "Nairobi", agency: "Nairobi Water", unresolved: 1245, heat: 45200 },
  { county: "Mombasa", agency: "KeNHA", unresolved: 890, heat: 28400 },
  { county: "Nakuru", agency: "Kenya Power", unresolved: 654, heat: 19500 },
  { county: "Kiambu", agency: "KURA", unresolved: 520, heat: 15300 },
  { county: "Machakos", agency: "KeNHA", unresolved: 410, heat: 9800 },
];

export default function DashboardPage() {
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
          value="14,245" 
          icon={AlertTriangle} 
          color="#ff1744"
          trend={{ value: 12, isUp: true }}
        />
        <StatCard 
          title="Avg. Response Time" 
          value="4.5 Days" 
          icon={Activity} 
          color="#ffab00"
          trend={{ value: 8, isUp: false }}
        />
        <StatCard 
          title="Issues Resolved" 
          value="3,892" 
          icon={ShieldCheck} 
          color="#00e676"
          trend={{ value: 24, isUp: true }}
        />
        <StatCard 
          title="Active Watchdogs" 
          value="45.1k" 
          icon={Users} 
          color="#00e5ff"
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
                    <th>Jurisdiction</th>
                    <th>Agency Focus</th>
                    <th className={styles.textRight}>Unresolved</th>
                    <th className={styles.textRight}>Heat Level</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((item, i) => (
                    <tr key={item.county} className={i < 3 ? styles.topRank : ""}>
                      <td className={styles.rankCell}>#{i + 1}</td>
                      <td className={styles.countyCell}>{item.county}</td>
                      <td className={styles.agencyCell}>{item.agency}</td>
                      <td className={styles.textRight}>{item.unresolved.toLocaleString()}</td>
                      <td className={styles.textRight}>
                        <div className={styles.heatBarContainer}>
                          <div 
                            className={styles.heatBar} 
                            style={{ width: `${(item.heat / leaderboard[0].heat) * 100}%` }}
                          />
                          <span className={styles.heatText}>{item.heat.toLocaleString()}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column: Charts */}
        <div className={styles.colSmall}>
          <Card className={styles.chartCard}>
            <h3>Agency Resolution Rate</h3>
            <div className={styles.donutChartContainer}>
              {/* CSS Only Donut Chart */}
              <div className={styles.donutOuter}>
                <div className={styles.donutInner}>
                  <div className={styles.donutScore}>
                    <span>34%</span>
                    <small>Avg. Resolved</small>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.legendWrapper}>
              <div className={styles.legendItem}>
                <span className={styles.dot} style={{ background: "var(--color-primary)" }} />
                <span>Resolved</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.dot} style={{ background: "rgba(255,255,255,0.1)" }} />
                <span>Pending</span>
              </div>
            </div>
          </Card>

          <Card className={styles.chartCard}>
             <h3>Category Breakdown</h3>
             <ul className={styles.barChartList}>
               <li className={styles.barItem}>
                 <div className={styles.barLabel}>
                   <span>Roads & Potholes</span>
                   <span>45%</span>
                 </div>
                 <div className={styles.barTrack}><div className={styles.barFill} style={{ width: '45%', background: '#ffab00' }}/></div>
               </li>
               <li className={styles.barItem}>
                 <div className={styles.barLabel}>
                   <span>Water & Leaks</span>
                   <span>30%</span>
                 </div>
                 <div className={styles.barTrack}><div className={styles.barFill} style={{ width: '30%', background: '#00e5ff' }}/></div>
               </li>
               <li className={styles.barItem}>
                 <div className={styles.barLabel}>
                   <span>Electricity</span>
                   <span>25%</span>
                 </div>
                 <div className={styles.barTrack}><div className={styles.barFill} style={{ width: '25%', background: '#6c3ce0' }}/></div>
               </li>
             </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
