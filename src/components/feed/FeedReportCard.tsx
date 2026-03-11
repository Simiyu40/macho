"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart, Share2, MessageSquare, MapPin, MoreHorizontal, Edit3, Trash2, X, Check, Navigation, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CommentsSection } from "./CommentsSection";
import styles from "./ReportCard.module.css";
import { formatDistanceToNow } from "date-fns";
import { createClient } from "@/utils/supabase/client";

interface FeedReportCardProps {
  report: Record<string, unknown> & {
    id: string;
    title: string;
    description: string;
    image_url?: string;
    address?: string;
    status?: string;
    user_id: string;
    upvotes_count?: number;
    comments_count?: number;
    shares_count?: number;
    heat_score?: number;
    created_at?: string;
    location?: unknown;
    county?: string;
    profiles?: { full_name?: string; avatar_url?: string; username?: string; id?: string };
    agencies?: { slug?: string; color?: string; name?: string };
  };
}

export function FeedReportCard({ report }: FeedReportCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(report.upvotes_count || 0);
  const [sharesCount, setSharesCount] = useState(report.shares_count || 0);
  const [heatScore, setHeatScore] = useState(report.heat_score || 0);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(report.title);
  const [editDescription, setEditDescription] = useState(report.description);
  const [currentTitle, setCurrentTitle] = useState(report.title);
  const [currentDescription, setCurrentDescription] = useState(report.description);
  const [isDeleted, setIsDeleted] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const commentsCount = report.comments_count || 0;
  const supabase = createClient();

  const getUser = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUserId(user.id);
      const { data } = await supabase
        .from("report_likes")
        .select("id")
        .eq("report_id", report.id)
        .eq("user_id", user.id)
        .single();
      if (data) setIsLiked(true);
    }
  }, [report.id, supabase]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  if (isDeleted) return null;

  const handleLike = async () => {
    if (!currentUserId) { alert("Please log in to like reports"); return; }
    if (isLiked) {
      await supabase.from("report_likes").delete().eq("report_id", report.id).eq("user_id", currentUserId);
      setIsLiked(false);
      setLikes((p: number) => Math.max(p - 1, 0));
      setHeatScore((p: number) => Math.max(p - 1, 0));
    } else {
      const { error } = await supabase.from("report_likes").insert({ report_id: report.id, user_id: currentUserId });
      if (!error) { setIsLiked(true); setLikes((p: number) => p + 1); setHeatScore((p: number) => p + 1); }
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this report?")) return;
    const { error } = await supabase.from("reports").delete().eq("id", report.id);
    if (!error) setIsDeleted(true);
    else alert("Failed to delete: " + error.message);
  };

  const handleSaveEdit = async () => {
    const { error } = await supabase.from("reports").update({ title: editTitle, description: editDescription }).eq("id", report.id);
    if (!error) { setCurrentTitle(editTitle); setCurrentDescription(editDescription); setIsEditing(false); }
    else alert("Failed to update: " + error.message);
  };

  // Share handlers
  const reportUrl = typeof window !== "undefined" ? `${window.location.origin}/feed` : "";
  const shareText = `🚨 ${currentTitle} — reported at ${report.address || report.county || "Unknown"} via Macho ya Raia`;
  const agencyTag = report.agencies?.slug ? `@${report.agencies.slug}` : "";
  const hashtags = "MachoYaRaia,CivicTech,Kenya";

  const handleShare = async (platform: string) => {
    // Record the share in DB
    if (currentUserId) {
      await supabase.from("report_shares").upsert(
        { report_id: report.id, user_id: currentUserId, platform },
        { onConflict: "report_id,user_id,platform" }
      );
      setSharesCount((p: number) => p + 1);
      setHeatScore((p: number) => p + 5);
    }

    if (platform === "whatsapp") {
      const waText = encodeURIComponent(`${shareText} ${agencyTag}\n\n${reportUrl}`);
      window.open(`https://wa.me/?text=${waText}`, "_blank");
    } else if (platform === "twitter") {
      const tweetText = encodeURIComponent(`${shareText} ${agencyTag}`);
      window.open(`https://twitter.com/intent/tweet?text=${tweetText}&hashtags=${hashtags}&url=${encodeURIComponent(reportUrl)}`, "_blank");
    } else {
      navigator.clipboard.writeText(`${shareText}\n${reportUrl}`);
      alert("Link copied to clipboard!");
    }
    setShowShareMenu(false);
  };

  const handleGetDirections = () => {
    // Parse location or fall back to address
    const destination = report.address || report.county || "Kenya";
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
    window.open(url, "_blank");
  };

  const isOwner = currentUserId === report.user_id;
  const timeAgo = report.created_at ? formatDistanceToNow(new Date(report.created_at), { addSuffix: true }) : "just now";

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "RESOLVED": return "resolved";
      case "PENDING": return "pending";
      default: return "review";
    }
  };

  const profile = report.profiles;
  const agency = report.agencies;
  const userName = profile?.full_name || "Anonymous";
  const userInitial = userName.charAt(0);
  const avatarUrl = profile?.avatar_url;

  return (
    <Card className={styles.reportCard} hoverEffect>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: avatarUrl ? `url(${avatarUrl}) center/cover` : 'linear-gradient(135deg, var(--color-primary), var(--color-accent-cyan))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: '1rem', flexShrink: 0,
          }}>
            {!avatarUrl && userInitial}
          </div>
          <div className={styles.userMeta}>
            <span className={styles.userName}>{userName}</span>
            <span className={styles.timeAgo}>{timeAgo}</span>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <button className={styles.moreBtn} onClick={() => setShowMenu(!showMenu)}>
            <MoreHorizontal size={20} />
          </button>
          {showMenu && isOwner && (
            <div className={styles.dropdownMenu}>
              <button className={styles.dropdownItem} onClick={() => { setIsEditing(true); setShowMenu(false); }}>
                <Edit3 size={16} /> Edit
              </button>
              <button className={`${styles.dropdownItem} ${styles.dangerItem}`} onClick={() => { handleDelete(); setShowMenu(false); }}>
                <Trash2 size={16} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.tagsRow}>
          <Badge variant={getStatusVariant(report.status || "PENDING")}>
            {(report.status || "PENDING").replace("_", " ")}
          </Badge>
          {agency && (
            <span className={styles.agencyTag} style={{ color: agency.color }}>@{agency.slug}</span>
          )}
        </div>

        {isEditing ? (
          <div className={styles.editForm}>
            <input className={styles.editInput} value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Title" />
            <textarea className={styles.editTextarea} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={3} placeholder="Description" />
            <div className={styles.editActions}>
              <button className={styles.editSaveBtn} onClick={handleSaveEdit}><Check size={16} /> Save</button>
              <button className={styles.editCancelBtn} onClick={() => { setIsEditing(false); setEditTitle(currentTitle); setEditDescription(currentDescription); }}><X size={16} /> Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <h3 className={styles.title}>{currentTitle}</h3>
            <p className={styles.description}>{currentDescription}</p>
          </>
        )}

        {report.image_url && (
          <div className={styles.imageContainer}>
            <img src={report.image_url} alt={currentTitle} className={styles.image} loading="lazy" />
            {report.address && (
              <div className={styles.locationOverlay}>
                <MapPin size={14} />
                <span>{report.address}</span>
              </div>
            )}
          </div>
        )}

        {/* Get Directions Button */}
        {(report.address || report.county) && (
          <button className={styles.directionsBtn} onClick={handleGetDirections}>
            <Navigation size={16} />
            Get Directions
            <ExternalLink size={14} />
          </button>
        )}
      </div>

      {/* Action Bar */}
      <div className={styles.actionBar}>
        <div className={styles.heatScore}>🔥 {heatScore.toLocaleString()} Heat</div>
        <div className={styles.actionButtons}>
          <button className={`${styles.actionBtn} ${isLiked ? styles.liked : ""}`} onClick={handleLike}>
            <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
            <span>{likes.toLocaleString()}</span>
          </button>
          <button className={styles.actionBtn} onClick={() => setShowComments(!showComments)}>
            <MessageSquare size={20} />
            <span>{commentsCount}</span>
          </button>

          {/* Share Button with Menu */}
          <div style={{ position: 'relative' }}>
            <button className={`${styles.actionBtn} ${styles.shareBtn}`} onClick={() => setShowShareMenu(!showShareMenu)}>
              <Share2 size={20} />
              <span>{sharesCount}</span>
              <div className={styles.multiplierLabel}>5x Heat</div>
            </button>
            {showShareMenu && (
              <div className={styles.shareMenu}>
                <button className={styles.shareOption} onClick={() => handleShare("whatsapp")}>
                  <span className={styles.shareWa}>W</span> WhatsApp
                </button>
                <button className={styles.shareOption} onClick={() => handleShare("twitter")}>
                  <span className={styles.shareX}>𝕏</span> Post on X
                </button>
                <button className={styles.shareOption} onClick={() => handleShare("link")}>
                  <ExternalLink size={16} /> Copy Link
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showComments && <CommentsSection reportId={report.id} commentsCount={commentsCount} />}
    </Card>
  );
}
