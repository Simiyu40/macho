"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import styles from "./page.module.css";

export default function GovernmentResponse({ reportId, userId }: { reportId: string; userId: string }) {
  const [status, setStatus] = useState("FIX_IN_PROGRESS");
  const [response, setResponse] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const supabase = createClient();

  const handleSubmit = async () => {
    if (!response.trim()) return;
    setSubmitting(true);

    const { error } = await supabase
      .from("reports")
      .update({
        official_response: response.trim(),
        official_status: status,
        official_responded_by: userId,
        official_responded_at: new Date().toISOString(),
      })
      .eq("id", reportId);

    if (!error) setSubmitted(true);
    else alert("Failed: " + error.message);
    setSubmitting(false);
  };

  if (submitted) return <p style={{ color: "var(--color-status-resolved)", fontWeight: 600, marginTop: 12 }}>✅ Response submitted successfully.</p>;

  return (
    <div className={styles.govForm}>
      <select className={styles.govSelect} value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="FIX_IN_PROGRESS">Fix in Progress</option>
        <option value="SCHEDULED">Scheduled for Next FY</option>
        <option value="COMPLETED">Completed</option>
        <option value="REJECTED">Rejected</option>
      </select>
      <textarea
        className={styles.govTextarea}
        rows={3}
        placeholder="Write your official response..."
        value={response}
        onChange={(e) => setResponse(e.target.value)}
      />
      <button className={styles.govSubmitBtn} onClick={handleSubmit} disabled={submitting || !response.trim()}>
        {submitting ? "Submitting..." : "Submit Official Response"}
      </button>
    </div>
  );
}
