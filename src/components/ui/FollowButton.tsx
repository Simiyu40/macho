"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import styles from "./FollowButton.module.css";

interface FollowButtonProps {
  targetUserId: string;
  size?: "sm" | "md";
}

export function FollowButton({ targetUserId, size = "sm" }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const supabase = createClient();

  const checkFollowStatus = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id === targetUserId) { setLoading(false); return; }
    setCurrentUserId(user.id);

    const { data } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("following_id", targetUserId)
      .single();
    
    setIsFollowing(!!data);
    setLoading(false);
  }, [targetUserId, supabase]);

  useEffect(() => {
    checkFollowStatus();
  }, [checkFollowStatus]);

  const handleToggle = async () => {
    if (!currentUserId) return;
    setLoading(true);

    if (isFollowing) {
      await supabase
        .from("follows")
        .delete()
        .eq("follower_id", currentUserId)
        .eq("following_id", targetUserId);
      setIsFollowing(false);
    } else {
      const { error } = await supabase
        .from("follows")
        .insert({ follower_id: currentUserId, following_id: targetUserId });
      if (!error) setIsFollowing(true);
    }
    setLoading(false);
  };

  // Don't show for own profile or when not logged in
  if (!currentUserId || currentUserId === targetUserId) return null;

  return (
    <button
      className={`${styles.followBtn} ${isFollowing ? styles.following : ""} ${size === "sm" ? styles.sm : styles.md}`}
      onClick={handleToggle}
      disabled={loading}
    >
      {loading ? "..." : isFollowing ? "Following" : "Follow"}
    </button>
  );
}
