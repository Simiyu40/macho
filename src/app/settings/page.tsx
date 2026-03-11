import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import styles from "./page.module.css";
import { Card } from "@/components/ui/Card";
import { Shield, CheckCircle, Settings } from "lucide-react";
import RoleToggle from "@/app/settings/RoleToggle";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}><Settings size={28} /> Account Settings</h1>
      </header>

      {/* Account Info */}
      <Card className={styles.card}>
        <h2 className={styles.cardTitle}>Account</h2>
        <div className={styles.infoRow}>
          <span className={styles.label}>Email</span>
          <span className={styles.value}>{user.email}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Username</span>
          <span className={styles.value}>{profile?.username || "—"}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Full Name</span>
          <span className={styles.value}>{profile?.full_name || "—"}</span>
        </div>
      </Card>

      {/* Government & Verification Roles */}
      <Card className={styles.card}>
        <h2 className={styles.cardTitle}>
          <Shield size={20} /> Government & Verification Roles
        </h2>
        <p className={styles.cardDesc}>
          Toggle your account roles. Government officials can submit official responses to reports.
          Trusted verifiers can mark reports as genuine.
        </p>
        
        <RoleToggle
          userId={user.id}
          isGovernment={profile?.is_government || false}
          isTrustedVerifier={profile?.is_trusted_verifier || false}
          governmentRole={profile?.government_role || ""}
        />
      </Card>

      {/* Role Descriptions */}
      <Card className={styles.card}>
        <h2 className={styles.cardTitle}><CheckCircle size={20} /> What these roles do</h2>
        <div className={styles.roleInfo}>
          <div className={styles.roleBlock}>
            <h3>🏛️ Government Official</h3>
            <p>As a verified government account, you can:</p>
            <ul>
              <li>Submit official responses to citizen reports</li>
              <li>Set report status: Fix in Progress, Scheduled, Completed, or Rejected</li>
              <li>Your responses appear publicly on the Government Transparency Portal</li>
            </ul>
          </div>
          <div className={styles.roleBlock}>
            <h3>✅ Trusted Verifier</h3>
            <p>As a community verifier, you can:</p>
            <ul>
              <li>Verify citizen reports as genuine</li>
              <li>Help prevent spam and misinformation</li>
              <li>A verified badge appears on reports you confirm</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
