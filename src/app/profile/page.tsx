import styles from "./page.module.css";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Award, Shield, FileText, Users } from "lucide-react";
import ProfileTabs from "./ProfileTabs";
import AvatarUpload from "./AvatarUpload";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch the profile from the database
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const fullName = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Citizen";
  const username = profile?.username || user.user_metadata?.username || user.email?.split("@")[0] || "citizen";
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url || null;
  const initials = fullName.charAt(0).toUpperCase();
  const citizenCredits = profile?.citizen_credits || 0;
  const followerCount = profile?.follower_count || 0;
  const followingCount = profile?.following_count || 0;

  // Count user's reports
  const { count: reportCount } = await supabase
    .from("reports")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const rank = citizenCredits > 1000 ? "Senior Watchdog" : citizenCredits > 500 ? "Active Reporter" : "Citizen Watch";

  return (
    <div className={styles.container}>
      {/* Profile Header Card */}
      <Card className={styles.profileHeader}>
        <div className={styles.avatarSection}>
          <AvatarUpload 
            currentAvatarUrl={avatarUrl} 
            initials={initials} 
            userId={user.id} 
          />
          <div className={styles.userInfo}>
            <h1 className={styles.name}>{fullName}</h1>
            <p className={styles.username}>@{username}</p>
            <Badge variant="resolved" className={styles.rankBadge}>
               <Shield size={14} /> {rank}
            </Badge>
          </div>
        </div>

        <div className={styles.statsDivider} />

        <div className={styles.statsSection}>
          <div className={styles.statBox}>
            <span className={styles.statIcon}><Award color="#ffab00" size={24}/></span>
            <div>
              <h3 className={styles.statValue}>{citizenCredits.toLocaleString()}</h3>
              <p className={styles.statLabel}>Credits</p>
            </div>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statIcon}><FileText color="var(--color-primary)" size={24}/></span>
            <div>
              <h3 className={styles.statValue}>{reportCount || 0}</h3>
              <p className={styles.statLabel}>Reports</p>
            </div>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statIcon}><Users color="var(--color-accent-cyan)" size={24}/></span>
            <div>
              <h3 className={styles.statValue}>{followerCount.toLocaleString()}</h3>
              <p className={styles.statLabel}>Followers</p>
            </div>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statIcon}><Users color="var(--color-text-muted)" size={24}/></span>
            <div>
              <h3 className={styles.statValue}>{followingCount.toLocaleString()}</h3>
              <p className={styles.statLabel}>Following</p>
            </div>
          </div>
        </div>

        <div className={styles.userDetails}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Email</span>
            <span className={styles.detailValue}>{user.email}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Member Since</span>
            <span className={styles.detailValue}>
              {new Date(user.created_at).toLocaleDateString('en-KE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </Card>

      {/* Profile Tabs */}
      <ProfileTabs userEmail={user.email || ""} />
    </div>
  );
}
