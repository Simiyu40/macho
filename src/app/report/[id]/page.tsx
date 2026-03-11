import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MapPin, Calendar, Navigation, ExternalLink, Shield, CheckCircle } from "lucide-react";
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
      official_responder:official_responded_by ( full_name, government_role )
    `)
    .eq("id", id)
    .single();

  if (!report) notFound();

  const { data: { user } } = await supabase.auth.getUser();

  // Check if current user is government or trusted verifier
  let isGovernment = false;
  let isTrustedVerifier = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_government, is_trusted_verifier, government_role")
      .eq("id", user.id)
      .single();
    isGovernment = profile?.is_government || false;
    isTrustedVerifier = profile?.is_trusted_verifier || false;
  }

  const profile = report.profiles as Record<string, string> | null;
  const agency = report.agencies as Record<string, string> | null;
  const responder = report.official_responder as Record<string, string> | null;
  const userName = profile?.full_name || "Anonymous";
  const userInitial = userName.charAt(0);
  const timeAgo = formatDistanceToNow(new Date(report.created_at), { addSuffix: true });

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

      {/* Official Response Section */}
      <Card className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>
          <Shield size={20} /> Official Response
        </h2>

        {report.official_response ? (
          <div className={styles.officialResponse}>
            <Badge variant={report.official_status === "COMPLETED" ? "resolved" : "pending"}>
              {report.official_status?.replace("_", " ") || "Pending"}
            </Badge>
            <p className={styles.responseText}>{report.official_response}</p>
            {responder && (
              <span className={styles.respondedBy}>
                — {responder.full_name}, {responder.government_role}
                {report.official_responded_at && ` · ${formatDistanceToNow(new Date(report.official_responded_at), { addSuffix: true })}`}
              </span>
            )}
          </div>
        ) : (
          <p className={styles.noResponse}>No official response yet.</p>
        )}

        {isGovernment && user && (
          <GovernmentResponse reportId={report.id} userId={user.id} />
        )}
      </Card>

      {/* Verification */}
      {!report.is_verified && isTrustedVerifier && user && (
        <Card className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>
            <CheckCircle size={20} /> Community Verification
          </h2>
          <p className={styles.verifyText}>As a trusted verifier, you can confirm this report is genuine.</p>
          <VerifyReport reportId={report.id} userId={user.id} />
        </Card>
      )}

      {/* Comments */}
      <Card className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>💬 Comments</h2>
        <CommentsSection reportId={report.id} commentsCount={report.comments_count || 0} />
      </Card>
    </div>
  );
}
