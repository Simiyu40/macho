"use client";

import Link from "next/link";
import { Search, Bell, Menu, User } from "lucide-react";
import styles from "./Navbar.module.css";
import { useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";

export default function Navbar({ user }: { user: SupabaseUser | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        {/* Left: Logo & Mobile Menu */}
        <div className={styles.left}>
          <button 
            className={styles.mobileMenuBtn}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={24} />
          </button>
          
          <Link href="/" className={styles.brand}>
            <div className={styles.logoMark}></div>
            <span className={styles.brandText}>Macho ya Raia</span>
          </Link>
        </div>

        {/* Center: Search (Desktop) */}
        <div className={styles.searchContainer}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search reports, agencies..." 
            className={styles.searchInput}
          />
        </div>

        {/* Right: Actions */}
        <div className={styles.actions}>
          <button className={styles.actionBtn}>
            <Bell size={20} />
            {user && <span className={styles.badge}>3</span>}
          </button>
          
          <Link href={user ? "/profile" : "/login"} className={styles.profileBtn}>
            <div className={styles.avatar}>
              <User size={18} />
              {user && <div className={styles.onlineDot}></div>}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
