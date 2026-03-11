import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MapPin, Calendar, Navigation, ExternalLink, Shield, CheckCircle, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { FollowButton } from "@/components/ui/FollowButton";
import { CommentsSection } from "@/components/feed/CommentsSection";
import GovernmentResponse from "./GovernmentResponse";
import VerifyReport from "./VerifyReport";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReportDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: report } = await supabase
    .from("reports")
    .select(`
      *,
      profiles:user_id ( id, full_name, username, avatar_url ),
      agencies:agency_id ( id, name, slug, color, verified ),
      official_responder:official_responded_by ( full_name, government_role ),
      verifier:verified_by ( full_name )
    `)
    .eq("id", id)
    .single();

  if (!report) notFound();

  const { data: { user } } = await supabase.auth.getUser();

  // Check if current user is government or trusted verifier
  let isGovernment = false;
  let isTrustedVerifier = false;
  let governmentRole = "";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_government, is_trusted_verifier, government_role")
      .eq("id", user.id)
      .single();
    isGovernment = profile?.is_government || false;
    isTrustedVerifier = profile?.is_trusted_verifier || false;
    governmentRole = profile?.government_role || "";
  }

  const profile = report.profiles as Record<string, string> | null;
  const agency = report.agencies as Record<string, string> | null;
  const responder = report.official_responder as Record<string, string> | null;
  const verifier = report.verifier as Record<string, string> | null;
  const userName = profile?.full_name || "Anonymous";
  const userInitial = userName.charAt(0);
  const timeAgo = formatDistanceToNow(new Date(report.created_at), { addSuffix: true });

  const officialStatusLabels: Record<string, { label: string; color: string }> = {
    FIX_IN_PROGRESS: { label: "🔧 Fix in Progress", color: "#ffab00" },
    SCHEDULED: { label: "📅 Scheduled for FY 2026/27", color: "#00e5ff" },
    COMPLETED: { label: "✅ Completed", color: "#00e676" },
    REJECTED: { label: "❌ Rejected", color: "#ff1744" },
  };

  return (
    <div className={styles.container}>
      {/* Report Header */}
      <Card className={styles.mainCard}>
        {report.image_url && (
          <div className={styles.heroImage} style={{ backgroundImage: `url(${report.image_url})` }}>
            <div className={styles.imageOverlay}>
              <Badge variant={report.status === "RESOLVED" ? "resolved" : report.status === "PENDING" ? "pending" : "review"}>
                {report.status?.replace("_", " ")}
              </Badge>
              {report.is_verified && (
                <Badge variant="resolved"><CheckCircle size={14} /> Verified</Badge>
              )}
            </div>
          </div>
        )}

        <div className={styles.body}>
          <h1 className={styles.title}>{report.title}</h1>
          <p className={styles.description}>{report.description}</p>

          {/* Author Row */}
          <div className={styles.authorRow}>
            <div className={styles.authorAvatar} style={{
              background: profile?.avatar_url
                ? `url(${profile.avatar_url}) center/cover`
                : 'linear-gradient(135deg, var(--color-primary), var(--color-accent-cyan))',
            }}>
              {!profile?.avatar_url && userInitial}
            </div>
            <div className={styles.authorMeta}>
              <span className={styles.authorName}>{userName}</span>
              <span className={styles.authorTime}><Calendar size={14} /> {timeAgo}</span>
            </div>
            {profile?.id && <FollowButton targetUserId={profile.id} size="sm" />}
          </div>

          {/* Location + Directions */}
          <div className={styles.locationRow}>
            <div className={styles.locationInfo}>
              <MapPin size={16} />
              <span>{report.address || report.county || "Unknown location"}</span>
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(report.address || report.county || "Kenya")}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.directionsLink}
            >
              <Navigation size={14} /> Get Directions <ExternalLink size={12} />
            </a>
          </div>

          {/* Stats Row */}
          <div className={styles.statsRow}>
            <div className={styles.stat}>🔥 <strong>{report.heat_score || 0}</strong> Heat</div>
            <div className={styles.stat}>❤️ <strong>{report.upvotes_count || 0}</strong> Likes</div>
            <div className={styles.stat}>💬 <strong>{report.comments_count || 0}</strong> Comments</div>
            <div className={styles.stat}>📤 <strong>{report.shares_count || 0}</strong> Shares</div>
          </div>

          {/* Agency */}
          {agency && (
            <div className={styles.agencyRow}>
              <span>Tagged Agency:</span>
              <span className={styles.agencyName} style={{ color: agency.color }}>
                @{agency.slug} — {agency.name}
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* ====== GOVERNMENT TRANSPARENCY PORTAL ====== */}
      <Card className={styles.sectionCard}>
        <div className={styles.portalHeader}>
          <h2 className={styles.sectionTitle}>
            <Shield size={22} /> Government Transparency Portal
          </h2>
          <Badge variant={report.official_status ? "resolved" : "pending"}>
            {report.official_status ? "Responded" : "Awaiting Response"}
          </Badge>
        </div>

        {/* Always show official response status to ALL users */}
        {report.official_response ? (
          <div className={styles.officialResponse}>
            <div className={styles.statusBanner} style={{
              borderColor: officialStatusLabels[report.official_status]?.color || "#ffab00",
              background: `${officialStatusLabels[report.official_status]?.color || "#ffab00"}10`,
            }}>
              <span className={styles.statusLabel} style={{ color: officialStatusLabels[report.official_status]?.color }}>
                {officialStatusLabels[report.official_status]?.label || report.official_status}
              </span>
            </div>
            <p className={styles.responseText}>{report.official_response}</p>
            {responder && (
              <div className={styles.responderInfo}>
                <Shield size={14} />
                <span>
                  {responder.full_name} · {responder.government_role}
                  {report.official_responded_at && ` · ${formatDistanceToNow(new Date(report.official_responded_at), { addSuffix: true })}`}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.noResponseBanner}>
            <AlertTriangle size={20} />
            <div>
              <strong>No official response yet</strong>
              <p>This report is awaiting a response from the responsible government agency or official.</p>
            </div>
          </div>
        )}

        {/* Government Response Form — only for government accounts */}
        {isGovernment && user && (
          <div className={styles.govFormWrapper}>
            <div className={styles.govBadge}>
              <Shield size={14} /> Responding as: <strong>{governmentRole || "Government Official"}</strong>
            </div>
            <GovernmentResponse reportId={report.id} userId={user.id} />
          </div>
        )}
      </Card>

      {/* ====== COMMUNITY VERIFICATION ====== */}
      <Card className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>
          <CheckCircle size={20} /> Report Verification
        </h2>

        {report.is_verified ? (
          <div className={styles.verifiedBanner}>
            <CheckCircle size={20} />
            <div>
              <strong>✅ This report has been verified</strong>
              {verifier && <p>Verified by {verifier.full_name} — a trusted community member.</p>}
            </div>
          </div>
        ) : (
          <div className={styles.unverifiedBanner}>
            <AlertTriangle size={18} />
            <div>
              <strong>Not yet verified</strong>
              <p>This report has not been verified by a trusted community member.</p>
            </div>
          </div>
        )}

        {/* Verify button — only for trusted verifiers */}
        {!report.is_verified && isTrustedVerifier && user && (
          <div style={{ marginTop: 12 }}>
            <VerifyReport reportId={report.id} userId={user.id} />
          </div>
        )}
      </Card>

      {/* Comments */}
      <Card className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>💬 Comments</h2>
        <CommentsSection reportId={report.id} commentsCount={report.comments_count || 0} />
      </Card>
    </div>
  );
}
