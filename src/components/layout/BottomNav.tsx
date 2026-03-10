"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListFilter, PlusCircle, MapPin, BarChart3, User } from "lucide-react";
import styles from "./BottomNav.module.css";
import { User as SupabaseUser } from "@supabase/supabase-js";

export default function BottomNav({ user }: { user: SupabaseUser | null }) {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { href: "/", label: "Home", icon: Home },
    { href: "/feed", label: "Feed", icon: ListFilter },
    { href: user ? "/submit" : "/login", label: user ? "Submit" : "Log In", icon: user ? PlusCircle : User, isFab: true },
    { href: "/map", label: "Map", icon: MapPin },
    { href: "/dashboard", label: "Dash", icon: BarChart3 },
  ];

  return (
    <nav className={styles.bottomNav}>
      <div className={styles.container}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          if (item.isFab) {
            return (
              <Link key={item.href} href={item.href} className={styles.fabWrapper}>
                <div className={`${styles.fab} ${isActive ? styles.fabActive : ""}`}>
                  <Icon size={28} color="white" />
                </div>
                <span className={styles.label}>{item.label}</span>
              </Link>
            );
          }

          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
            >
              <div className={styles.iconWrapper}>
                <Icon size={24} className={styles.icon} />
                {isActive && <div className={styles.activeDot} />}
              </div>
              <span className={styles.label}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
