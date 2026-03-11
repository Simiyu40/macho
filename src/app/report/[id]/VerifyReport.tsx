"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { CheckCircle } from "lucide-react";
import styles from "./page.module.css";

export default function VerifyReport({ reportId, userId }: { reportId: string; userId: string }) {
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleVerify = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("reports")
      .update({ is_verified: true, verified_by: userId })
      .eq("id", reportId);

    if (!error) setVerified(true);
    else alert("Failed: " + error.message);
    setLoading(false);
  };

  if (verified) return <p style={{ color: "var(--color-status-resolved)", fontWeight: 600 }}>✅ Report verified.</p>;

  return (
    <button className={styles.verifyBtn} onClick={handleVerify} disabled={loading}>
      <CheckCircle size={18} />
      {loading ? "Verifying..." : "Verify This Report"}
    </button>
  );
}
