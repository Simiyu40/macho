import { ButtonHTMLAttributes, forwardRef } from "react";
import styles from "./page.module.css";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { siteStats, mockReports } from "@/data/mock";
import { Camera, Map, Activity, ArrowRight, ShieldCheck, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.pageContainer}>
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <Badge variant="review" className={styles.betaBadge}>Macho ya Raia v1.0 Live</Badge>
          <h1 className={styles.headline}>
            Kenya's Eyes <br/>
            <span className="text-gradient">Are Watching.</span>
          </h1>
          <p className={styles.subhead}>
            Report broken infrastructure. Generate political heat. Force accountability. 
            Join the digital watchdog revolution putting power back in the hands of citizens.
          </p>
          <div className={styles.ctaGroup}>
            <Link href="/submit">
              <Button size="lg" className={styles.ctaPrimary}>
                <Camera size={20} /> Report an Issue
              </Button>
            </Link>
            <Link href="/map">
              <Button size="lg" variant="secondary">
                <Map size={20} /> View Live Map
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Abstract 3D-ish Illustration (CSS) */}
        <div className={styles.heroImageContainer}>
          <div className={styles.abstractShape1} />
          <div className={styles.abstractShape2} />
          <div className={styles.abstractShape3} />
          <div className={styles.floatingCard}>
             <Activity color="var(--color-primary)" size={24} />
             <div>
               <strong>Live Tracking</strong>
               <span>{siteStats.reportsFiled.toLocaleString()} reports processed</span>
             </div>
          </div>
        </div>
      </section>

      {/* Live Stats Strip */}
      <section className={styles.statsStrip}>
        <div className={styles.statItem}>
          <h3 className={styles.statValue}>{siteStats.reportsFiled.toLocaleString()}</h3>
          <p className={styles.statLabel}>Reports Filed</p>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <h3 className={styles.statValue}>{siteStats.issuesResolved.toLocaleString()}</h3>
          <p className={styles.statLabel}>Issues Resolved</p>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <h3 className={styles.statValue}>{siteStats.countiesActive}</h3>
          <p className={styles.statLabel}>Counties Active</p>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <h3 className={styles.statValue}>{(siteStats.citizensEngaged/1000).toFixed(1)}k+</h3>
          <p className={styles.statLabel}>Citizens Engaged</p>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>How It Generates <span className="text-gradient">Heat</span></h2>
        <div className={styles.stepsGrid}>
          <Card className={styles.stepCard} hoverEffect>
            <div className={styles.stepIconWrapper}><Camera size={32} /></div>
            <h3>1. Snap & Report</h3>
            <p>Take a photo of the pothole, leak, or blackout. GPS auto-tags the exact location.</p>
          </Card>
          <Card className={styles.stepCard} hoverEffect>
            <div className={styles.stepIconWrapper}><TrendingUp size={32} /></div>
            <h3>2. Go Viral</h3>
            <p>The community upvotes and shares. A share is worth 5x heat, pushing it to the national dashboard.</p>
          </Card>
          <Card className={styles.stepCard} hoverEffect>
            <div className={styles.stepIconWrapper}><ShieldCheck size={32} /></div>
            <h3>3. Force Action</h3>
            <p>Publicly rank agencies. Government verified accounts respond and resolve issues to lower their heat score.</p>
          </Card>
        </div>
      </section>

      {/* Featured Reports Preview */}
      <section className={styles.featuredSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Featured Reports</h2>
          <Link href="/feed">
            <Button variant="ghost" size="sm">View All <ArrowRight size={16}/></Button>
          </Link>
        </div>
        <div className={styles.reportsGrid}>
          {mockReports.slice(0, 3).map(report => (
            <Card key={report.id} className={styles.miniReportCard} hoverEffect>
              <div 
                className={styles.reportImage} 
                style={{ backgroundImage: `url(${report.image_url})`}} 
              />
              <div className={styles.reportContent}>
                <div className={styles.reportHeader}>
                  <Badge 
                    variant={report.status === "RESOLVED" ? "resolved" : report.status === "PENDING" ? "pending" : "review"}
                  >
                    {report.status.replace("_", " ")}
                  </Badge>
                  <span className={styles.agencyTag} style={{color: report.agency?.color}}>
                    @{report.agency?.slug}
                  </span>
                </div>
                <h4 className={styles.reportTitle}>{report.title}</h4>
                <div className={styles.heatMetrics}>
                  <TrendingUp size={14} color="var(--color-primary)"/>
                  <span>{report.heat_score.toLocaleString()} Heat Score</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <div className={styles.logoMarkBtn} />
          <span>Macho ya Raia</span>
        </div>
        <p className={styles.footerText}>Built for the citizens of Kenya. Open Source Civic Tech.</p>
      </footer>
    </div>
  );
}
