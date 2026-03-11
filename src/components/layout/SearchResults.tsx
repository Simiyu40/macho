"use client";

import Link from "next/link";
import { FileText, Building2 } from "lucide-react";
import styles from "./SearchResults.module.css";

interface SearchResult {
  reports: Array<{ id: string; title: string; county: string | null; status: string }>;
  agencies: Array<{ id: string; name: string; slug: string; color: string }>;
}

interface SearchResultsProps {
  results: SearchResult;
  loading: boolean;
  query: string;
  onClose: () => void;
}

export function SearchResults({ results, loading, query, onClose }: SearchResultsProps) {
  if (!query.trim()) return null;

  const hasResults = results.reports.length > 0 || results.agencies.length > 0;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.dropdown}>
        {loading ? (
          <div className={styles.loading}>Searching...</div>
        ) : !hasResults ? (
          <div className={styles.noResults}>No results for &ldquo;{query}&rdquo;</div>
        ) : (
          <>
            {results.reports.length > 0 && (
              <>
                <div className={styles.sectionLabel}>Reports</div>
                {results.reports.map((r) => (
                  <Link
                    key={r.id}
                    href={`/feed`}
                    className={styles.resultItem}
                    onClick={onClose}
                  >
                    <div className={`${styles.resultIcon} ${styles.reportIcon}`}>
                      <FileText size={18} />
                    </div>
                    <div className={styles.resultText}>
                      <span className={styles.resultTitle}>{r.title}</span>
                      <span className={styles.resultMeta}>
                        {r.county || "Unknown"} · {r.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </>
            )}

            {results.agencies.length > 0 && (
              <>
                <div className={styles.sectionLabel}>Agencies</div>
                {results.agencies.map((a) => (
                  <Link
                    key={a.id}
                    href={`/feed`}
                    className={styles.resultItem}
                    onClick={onClose}
                  >
                    <div className={`${styles.resultIcon} ${styles.agencyIcon}`} style={{ color: a.color }}>
                      <Building2 size={18} />
                    </div>
                    <div className={styles.resultText}>
                      <span className={styles.resultTitle}>{a.name}</span>
                      <span className={styles.resultMeta}>@{a.slug}</span>
                    </div>
                  </Link>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
