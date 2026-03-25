"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Bell, Menu, User, LogOut, Settings, ChevronDown } from "lucide-react";
import styles from "./Navbar.module.css";
import { useState, useEffect, useRef, useMemo } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { SearchResults } from "./SearchResults";

export default function Navbar({ user }: { user: SupabaseUser | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ reports: [] as Array<{ id: string; title: string; county: string | null; status: string }>, agencies: [] as Array<{ id: string; name: string; slug: string; color: string }> });
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const q = searchQuery.trim();
      
      if (!q) {
        setSearchResults({ reports: [], agencies: [] });
        setShowResults(false);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      setShowResults(true);
      
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
  }, [searchQuery, supabase]);

  const displayName = user?.user_metadata?.full_name
    || user?.user_metadata?.name
    || user?.email?.split("@")[0]
    || "User";

  const avatarUrl = user?.user_metadata?.avatar_url || null;
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  }

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
          {user && (
            <button className={styles.actionBtn}>
              <Bell size={20} />
              <span className={styles.badge}>3</span>
            </button>
          )}
          
          {user ? (
            /* ── Authenticated: Profile Chip + Dropdown ── */
            <div className={styles.profileChipWrapper} ref={profileDropdownRef}>
              <button 
                className={styles.profileChip}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className={styles.chipAvatar}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={displayName} className={styles.chipAvatarImg} />
                  ) : (
                    <span className={styles.chipInitials}>{initials}</span>
                  )}
                  <div className={styles.onlineDot}></div>
                </div>
                <span className={styles.chipName}>{displayName.split(" ")[0]}</span>
                <ChevronDown size={14} className={`${styles.chipChevron} ${isProfileOpen ? styles.chevronOpen : ""}`} />
              </button>

              {isProfileOpen && (
                <div className={styles.profileDropdown}>
                  <div className={styles.dropdownHeader}>
                    <div className={styles.dropdownAvatar}>
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={displayName} className={styles.dropdownAvatarImg} />
                      ) : (
                        <span className={styles.dropdownInitials}>{initials}</span>
                      )}
                    </div>
                    <div className={styles.dropdownInfo}>
                      <span className={styles.dropdownName}>{displayName}</span>
                      <span className={styles.dropdownEmail}>{user.email}</span>
                    </div>
                  </div>
                  <div className={styles.dropdownDivider} />
                  <Link 
                    href="/profile" 
                    className={styles.dropdownItem}
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User size={16} />
                    <span>Profile</span>
                  </Link>
                  <Link 
                    href="/settings" 
                    className={styles.dropdownItem}
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </Link>
                  <div className={styles.dropdownDivider} />
                  <button className={styles.dropdownSignOut} onClick={handleSignOut}>
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ── Unauthenticated: Login Button ── */
            <Link href="/login" className={styles.loginBtn}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
