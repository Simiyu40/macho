"use client";

import Link from "next/link";
import { Search, Bell, Menu, User } from "lucide-react";
import styles from "./Navbar.module.css";
import { useState, useEffect, useRef } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { SearchResults } from "./SearchResults";

export default function Navbar({ user }: { user: SupabaseUser | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ reports: [] as Array<{ id: string; title: string; county: string | null; status: string }>, agencies: [] as Array<{ id: string; name: string; slug: string; color: string }> });
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!searchQuery.trim()) {
      setSearchResults({ reports: [], agencies: [] });
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    setShowResults(true);

    debounceRef.current = setTimeout(async () => {
      const q = searchQuery.trim();
      
      const [reportsRes, agenciesRes] = await Promise.all([
        supabase
          .from("reports")
          .select("id, title, county, status")
          .or(`title.ilike.%${q}%,description.ilike.%${q}%,county.ilike.%${q}%`)
          .limit(5),
        supabase
          .from("agencies")
          .select("id, name, slug, color")
          .or(`name.ilike.%${q}%,slug.ilike.%${q}%`)
          .limit(5),
      ]);

      setSearchResults({
        reports: (reportsRes.data || []) as Array<{ id: string; title: string; county: string | null; status: string }>,
        agencies: (agenciesRes.data || []) as Array<{ id: string; name: string; slug: string; color: string }>,
      });
      setIsSearching(false);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

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
        <div className={styles.searchContainer} style={{ position: 'relative' }}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search reports, agencies..." 
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => { if (searchQuery.trim()) setShowResults(true); }}
          />
          {showResults && (
            <SearchResults
              results={searchResults}
              loading={isSearching}
              query={searchQuery}
              onClose={() => { setShowResults(false); setSearchQuery(""); }}
            />
          )}
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
