"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import styles from "./page.module.css";
import { Shield, CheckCircle } from "lucide-react";

interface RoleToggleProps {
  userId: string;
  isGovernment: boolean;
  isTrustedVerifier: boolean;
  governmentRole: string;
}

export default function RoleToggle({ userId, isGovernment: initGov, isTrustedVerifier: initVerifier, governmentRole: initRole }: RoleToggleProps) {
  const [isGov, setIsGov] = useState(initGov);
  const [isVerifier, setIsVerifier] = useState(initVerifier);
  const [govRole, setGovRole] = useState(initRole);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    const { error } = await supabase
      .from("profiles")
      .update({
        is_government: isGov,
        is_trusted_verifier: isVerifier,
        government_role: isGov ? govRole : null,
      })
      .eq("id", userId);

    if (!error) setSaved(true);
    else alert("Failed: " + error.message);
    setSaving(false);
  };

  return (
    <div className={styles.roleToggles}>
      {/* Government Toggle */}
      <div className={styles.toggleRow}>
        <div className={styles.toggleInfo}>
          <Shield size={18} className={styles.toggleIcon} />
          <div>
            <strong>Government Official</strong>
            <p>Can submit official responses to reports</p>
          </div>
        </div>
        <label className={styles.switch}>
          <input type="checkbox" checked={isGov} onChange={(e) => setIsGov(e.target.checked)} />
          <span className={styles.slider} />
        </label>
      </div>

      {/* Government Role Field */}
      {isGov && (
        <div className={styles.roleField}>
          <label className={styles.fieldLabel}>Your Government Title / Role</label>
          <input
            type="text"
            className={styles.roleInput}
            placeholder="e.g. County Commissioner, CS Transport, MCA Westlands"
            value={govRole}
            onChange={(e) => setGovRole(e.target.value)}
          />
        </div>
      )}

      {/* Verifier Toggle */}
      <div className={styles.toggleRow}>
        <div className={styles.toggleInfo}>
          <CheckCircle size={18} className={styles.toggleIcon} />
          <div>
            <strong>Trusted Verifier</strong>
            <p>Can verify reports as genuine</p>
          </div>
        </div>
        <label className={styles.switch}>
          <input type="checkbox" checked={isVerifier} onChange={(e) => setIsVerifier(e.target.checked)} />
          <span className={styles.slider} />
        </label>
      </div>

      <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : saved ? "✅ Saved!" : "Save Roles"}
      </button>
    </div>
  );
}
