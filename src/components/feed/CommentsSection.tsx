"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { Send, Trash2 } from "lucide-react";
import styles from "./CommentsSection.module.css";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  is_official_response: boolean;
  profiles: { full_name: string; avatar_url: string | null; username: string | null } | null;
}

interface CommentsSectionProps {
  reportId: string;
  commentsCount: number;
}

export function CommentsSection({ reportId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const supabase = createClient();

  const loadComments = useCallback(async () => {
    const { data } = await supabase
      .from("comments")
      .select(`
        id, content, created_at, user_id, is_official_response,
        profiles:user_id ( full_name, avatar_url, username )
      `)
      .eq("report_id", reportId)
      .order("created_at", { ascending: true });

    if (data) setComments(data as unknown as Comment[]);
    setLoading(false);
  }, [reportId, supabase]);

  const getCurrentUser = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setCurrentUserId(user.id);
  }, [supabase]);

  useEffect(() => {
    loadComments();
    getCurrentUser();
  }, [loadComments, getCurrentUser]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || !currentUserId) return;

    setSubmitting(true);
    const { error } = await supabase.from("comments").insert({
      report_id: reportId,
      user_id: currentUserId,
      content: newComment.trim(),
    });

    if (!error) {
      setNewComment("");
      await loadComments();
    }
    setSubmitting(false);
  }

  async function handleDelete(commentId: string) {
    if (!confirm("Delete this comment?")) return;
    await supabase.from("comments").delete().eq("id", commentId);
    await loadComments();
  }

  return (
    <div className={styles.container}>
      <div className={styles.commentsList}>
        {loading ? (
          <p className={styles.loadingText}>Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className={styles.emptyText}>No comments yet. Be the first!</p>
        ) : (
          comments.map((comment) => {
            const name = comment.profiles?.full_name || "Anonymous";
            const initial = name.charAt(0);
            const isOwn = comment.user_id === currentUserId;

            return (
              <div key={comment.id} className={`${styles.comment} ${comment.is_official_response ? styles.official : ""}`}>
                <div className={styles.commentAvatar}>
                  {comment.profiles?.avatar_url ? (
                    <img src={comment.profiles.avatar_url} alt="" className={styles.avatarImg} />
                  ) : (
                    <span>{initial}</span>
                  )}
                </div>
                <div className={styles.commentBody}>
                  <div className={styles.commentHeader}>
                    <span className={styles.commentAuthor}>{name}</span>
                    <span className={styles.commentTime}>
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </span>
                    {isOwn && (
                      <button className={styles.deleteBtn} onClick={() => handleDelete(comment.id)} title="Delete">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <p className={styles.commentContent}>{comment.content}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {currentUserId ? (
        <form className={styles.inputRow} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={submitting}
          />
          <button className={styles.sendBtn} type="submit" disabled={submitting || !newComment.trim()}>
            <Send size={18} />
          </button>
        </form>
      ) : (
        <p className={styles.loginHint}>Log in to comment</p>
      )}
    </div>
  );
}
