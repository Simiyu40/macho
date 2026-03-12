"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListFilter, MapPin, BarChart3, PlusCircle, Settings, User, Info, BookOpen } from "lucide-react";
import styles from "./Sidebar.module.css";
import { User as SupabaseUser } from "@supabase/supabase-js";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/feed", label: "Report Feed", icon: ListFilter },
  { href: "/map", label: "Live Map", icon: MapPin },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
];

export default function Sidebar({ user }: { user: SupabaseUser | null }) {
  const pathname = usePathname();

  const SECONDARY_ITEMS = user ? [
    { href: "/submit", label: "New Report", icon: PlusCircle, isPrimary: true },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/about", label: "About Us", icon: Info },
    { href: "/docs", label: "Documentation", icon: BookOpen },
  ] : [
    { href: "/login", label: "Log In", icon: User, isPrimary: true },
    { href: "/about", label: "About Us", icon: Info },
    { href: "/docs", label: "Documentation", icon: BookOpen },
  ];

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <div className={styles.navSection}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ""}`}
              >
                <Icon size={22} className={styles.icon} />
                <span className={styles.label}>{item.label}</span>
                {isActive && <div className={styles.activeIndicator} />}
              </Link>
            );
          })}
        </div>

        <div className={styles.divider} />

        <div className={styles.navSection}>
          {SECONDARY_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`
                  ${styles.navItem} 
                  ${isActive ? styles.active : ""} 
                  ${item.isPrimary ? styles.primaryAction : ""}
                `}
              >
                <Icon size={22} className={styles.icon} />
                <span className={styles.label}>{item.label}</span>
                {isActive && <div className={styles.activeIndicator} />}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
