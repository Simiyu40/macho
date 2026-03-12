import styles from "./page.module.css";
import { BookOpen, FileText, Component, Server, Database, Globe } from "lucide-react";

export default function DocsPage() {
  const sections = [
    {
      id: "architecture",
      icon: Server,
      title: "System Architecture",
      content: (
        <>
          <p className={styles.lead}>
            Macho ya Raia is engineered as a highly available, realtime digital infrastructure. We decouple our interface logic from our geospatial database ensuring hyper-performance.
          </p>
          <div className={styles.techStack}>
            <div className={styles.techItem}>
              <strong>Frontend Framework</strong>
              <span>Next.js (App Router), React 18</span>
            </div>
            <div className={styles.techItem}>
              <strong>Database & Auth</strong>
              <span>Supabase (PostgreSQL), JWT</span>
            </div>
            <div className={styles.techItem}>
              <strong>Geospatial Processing</strong>
              <span>PostGIS Extension</span>
            </div>
            <div className={styles.techItem}>
              <strong>Edge Compute</strong>
              <span>Supabase Edge Functions (Deno/Wasm)</span>
            </div>
            <div className={styles.techItem}>
              <strong>Offline Resilience</strong>
              <span>PWA Service Workers & IndexedDB</span>
            </div>
          </div>
        </>
      )
    },
    {
      id: "heat-algorithm",
      icon: Component,
      title: "Proprietary Heat Algorithm",
      content: (
        <>
          <p>
            The national dashboard is not a chronological feed; it is an organic reflection of civic urgency. Our Heat Algorithm aggregates user engagement events to dynamically calculate the severity of an issue in real-time.
          </p>
          <div className={styles.equationCard}>
            <span className={styles.equationLabel}>ALGORITHM 1.0</span>
            <code className={styles.equation}>Heat = (Likes × 1) + (Comments × 2) + (Shares × 5)</code>
            <p className={styles.equationMeta}>
              <em>Note:</em> External sharing (WhatsApp, X) carries a 5x multiplier as it signals a high threshold of external mobilization and virality.
            </p>
          </div>
        </>
      )
    },
    {
      id: "geospatial",
      icon: Globe,
      title: "Geospatial Indexing",
      content: (
        <>
          <p>
            Every report is tagged with absolute GPS coordinates. By leveraging the <strong>PostGIS</strong> extension within our PostgreSQL database, we execute complex spatial queries instantly.
          </p>
          <p>
            The &quot;Near Me&quot; tab utilizes the <code>ST_DWithin</code> function, calculating distance via the earth&apos;s spheroid geometry. This allows citizens to view issues within an exact 10km radius of their browser&apos;s location API coordinates.
          </p>
        </>
      )
    },
    {
      id: "transparency-protocol",
      icon: FileText,
      title: "The Transparency Protocol",
      content: (
        <>
          <p>
            The platform enforces strict Row Level Security (RLS) policies to govern data mutation based on the user&apos;s role:
          </p>
          <ul className={styles.docList}>
            <li>
              <strong>Verified Government Accounts:</strong> Hold mutation rights exclusively over the <code>official_status</code> and <code>official_response</code> fields of a report. They cannot edit citizen text or delete reports.
            </li>
            <li>
              <strong>Trusted Community Verifiers:</strong> Possess the authority to flag a report via the <code>is_verified</code> boolean, injecting a cryptographic timestamp of their approval.
            </li>
            <li>
              <strong>Standard Citizens:</strong> Can create payload data (Reports, Comments) and execute increment functions (Likes, Shares), but cannot alter existing consensus state.
            </li>
          </ul>
        </>
      )
    },
    {
      id: "offline-sync",
      icon: Database,
      title: "Offline Synced Queue",
      content: (
        <>
          <p>
            Civic issues often happen in areas with poor network coverage. The platform implements a sophisticated offline-first mutation queue.
          </p>
          <p>
            Utilizing the modern <strong>IndexedDB</strong> API wrapped in a robust Service Worker, payload submissions are serialized locally. Upon detecting a <code>navigator.onLine</code> event, the background sync engine replays the mutation queue against the Supabase backend automatically.
          </p>
        </>
      )
    }
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <BookOpen size={20} className={styles.sidebarIcon} />
          <span>Documentation</span>
        </div>
        <nav className={styles.navMenu}>
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`} className={styles.navLink}>
              {section.title}
            </a>
          ))}
        </nav>
      </div>

      <main className={styles.mainContent}>
        <div className={styles.docHeader}>
           <h1 className={styles.pageTitle}>System Specification</h1>
           <p className={styles.pageSubtitle}>Technical architectural details, algorithms, and security protocols defining the Macho ya Raia platform environment.</p>
        </div>

        <div className={styles.contentSections}>
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <section key={section.id} id={section.id} className={styles.docSection}>
                <div className={styles.sectionHeader}>
                  <div className={styles.iconBox}>
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <h2 className={styles.sectionTitle}>{section.title}</h2>
                </div>
                <div className={styles.prose}>
                  {section.content}
                </div>
              </section>
            );
          })}
        </div>
        
        <div className={styles.docFooter}>
           <p>End of specifications. For API access or integration concerns, view the GitHub repository.</p>
        </div>
      </main>
    </div>
  );
}
