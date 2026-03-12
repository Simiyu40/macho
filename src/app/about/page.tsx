import styles from "./page.module.css";
import { Shield, Users, Globe, Target, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  const team = [
    { name: "Hiram Simiyu", role: "CEO & Full Stack Developer", image: "https://api.dicebear.com/7.x/notionists/svg?seed=Hiram", desc: "Architecting the infrastructure and leading the vision for a transparent Kenya." },
    { name: "Miading Wuor", role: "Technical Lead Cyber Security & Systems Analyst", image: "https://api.dicebear.com/7.x/notionists/svg?seed=Miading", desc: "Ensuring ironclad security protocols and bulletproof system integrity." },
    { name: "Edwin", role: "DevOps Engineer", image: "https://api.dicebear.com/7.x/notionists/svg?seed=Edwin", desc: "Orchestrating scalable deployments and zero-downtime infrastructure." },
    { name: "Lilian Atieno", role: "UX/UI Designer", image: "https://api.dicebear.com/7.x/notionists/svg?seed=Lilian", desc: "Crafting intuitive, accessible, and striking user experiences." },
    { name: "Antony Thamaini", role: "Quality Assurance Engineer", image: "https://api.dicebear.com/7.x/notionists/svg?seed=Antony", desc: "Rigorously testing every component for flawless execution." },
  ];

  const advantages = [
    { icon: Shield, title: "Radical Transparency", desc: "A direct, unmediated line to government officials, placing public service delivery under an irrefutable spotlight." },
    { icon: Target, title: "Algorithmic Prioritization", desc: "Our proprietary Heat Score naturally surfaces the most critical, widely-felt issues organically to the top." },
    { icon: Users, title: "Community Guardianship", desc: "A decentralized consensus model where trusted community verifiers eliminate noise and validate truth." },
    { icon: Globe, title: "Geospatial Precision", desc: "Engineered with PostGIS for hyper-accurate spatial querying, turning abstract problems into physical, actionable data points." }
  ];

  return (
    <div className={styles.wrapper}>
      {/* Decorative Background */}
      <div className={styles.ambientBackground}>
        <div className={styles.glowBlob1} />
        <div className={styles.glowBlob2} />
        <div className={styles.gridOverlay} />
      </div>

      <div className={styles.container}>
        {/* Sub-Brand Header */}
        <header className={styles.heroSection}>
          <div className={styles.heroBadge}>
            <span className={styles.badgeDot} />
            ABOUT THE PLATFORM
          </div>
          <h1 className={styles.heroTitle}>
            Engineering <em>Honesty.</em>
            <br />
            Democratizing <span className={styles.cyanGradient}>Action.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Macho ya Raia is not just an application; it is the digital infrastructure for a transparent, accountable, and hyper-responsive Kenya.
          </p>
        </header>

        {/* Motive Split Section */}
        <section className={styles.motiveSplit}>
          <div className={styles.motiveLeft}>
            <h2 className={styles.sectionTitle}>The Core <br /><em>Motive</em></h2>
          </div>
          <div className={styles.motiveRight}>
            <p className={styles.leadText}>
              We recognized a systemic fracture between citizen experience and government response. 
            </p>
            <p className={styles.prose}>
              While citizens frequently highlight critical infrastructural and social issues on disjointed platforms like X or WhatsApp, these reports dissipate into the digital ether. They lack a centralized ledger, tracking mechanisms, and a formal channel for resolution.
            </p>
            <p className={styles.prose}>
              Macho ya Raia (&quot;Eyes of the Citizen&quot;) was forged to eliminate this vacuum. Our mission is to construct a dedicated ecosystem where civic issues are not merely voiced, but mapped, quantified, verified, and publicly resolved by the relevant authorities. We believe that true democracy requires observability.
            </p>
          </div>
        </section>

        {/* Advantages Grid */}
        <section className={styles.advantagesSection}>
          <div className={styles.sectionHeaderCentered}>
            <h2 className={styles.sectionTitleSmall}>The Strategic Advantage</h2>
            <div className={styles.headerLine} />
          </div>
          <div className={styles.advantagesGrid}>
            {advantages.map((adv, idx) => {
              const Icon = adv.icon;
              return (
                <div key={idx} className={styles.advantageCard}>
                  <div className={styles.advIconWrapper}>
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className={styles.advTitle}>{adv.title}</h3>
                  <p className={styles.advDesc}>{adv.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Leadership Roster */}
        <section className={styles.teamSection}>
          <div className={styles.sectionHeaderCentered}>
            <h2 className={styles.sectionTitleSmall}>System Architects</h2>
            <div className={styles.headerLine} />
          </div>
          <div className={styles.teamGrid}>
            {team.map((member, idx) => (
              <div key={idx} className={styles.teamCard}>
                <div className={styles.avatarContainer}>
                  <div className={styles.avatarBorder} />
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    className={styles.avatarImage} 
                    width={120} 
                    height={120} 
                    unoptimized 
                  />
                </div>
                <div className={styles.teamContent}>
                  <h3 className={styles.memberName}>{member.name}</h3>
                  <p className={styles.memberRole}>{member.role}</p>
                  <p className={styles.memberDesc}>{member.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className={styles.closingSection}>
          <div className={styles.closingCard}>
            <h2>Ready to participate?</h2>
            <p>Join the movement towards a data-driven, accountable society.</p>
            <Link href="/submit" className={styles.primaryButton}>
              Report an Issue <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
