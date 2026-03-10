import { useState } from "react";
import Image from "next/image";
import { Report } from "@/types";
import { Heart, Share2, MessageSquare, MapPin, MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import styles from "./ReportCard.module.css";
import { formatDistanceToNow } from "date-fns";

interface ReportCardProps {
  report: Report;
}

export function ReportCard({ report }: ReportCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(report.upvotes);
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const timeAgo = formatDistanceToNow(new Date(report.created_at), { addSuffix: true });

  const getStatusVariant = (status: string) => {
    switch(status) {
      case "RESOLVED": return "resolved";
      case "PENDING": return "pending";
      default: return "review";
    }
  };

  return (
    <Card className={styles.reportCard} hoverEffect>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <Avatar src={report.user?.avatar_url} fallback={report.user?.name.charAt(0)} size="md" />
          <div className={styles.userMeta}>
            <span className={styles.userName}>{report.user?.name}</span>
            <span className={styles.timeAgo}>{timeAgo}</span>
          </div>
        </div>
        <button className={styles.moreBtn}><MoreHorizontal size={20} /></button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.tagsRow}>
          <Badge variant={getStatusVariant(report.status)}>
            {report.status.replace("_", " ")}
          </Badge>
          <span 
            className={styles.agencyTag} 
            style={{ color: report.agency?.color }}
          >
            @{report.agency?.slug}
          </span>
        </div>
        
        <h3 className={styles.title}>{report.title}</h3>
        <p className={styles.description}>{report.description}</p>
        
        {/* Image - simplified to regular img tag for external URLs without config */}
        <div className={styles.imageContainer}>
          <img 
            src={report.image_url} 
            alt={report.title} 
            className={styles.image}
            loading="lazy"
          />
          <div className={styles.locationOverlay}>
            <MapPin size={14} />
            <span>{report.location.address}</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className={styles.actionBar}>
        <div className={styles.heatScore}>
           🔥 {report.heat_score.toLocaleString()} Heat
        </div>
        
        <div className={styles.actionButtons}>
          <button 
            className={`${styles.actionBtn} ${isLiked ? styles.liked : ""}`}
            onClick={handleLike}
          >
            <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
            <span>{likes.toLocaleString()}</span>
          </button>
          
          <button className={styles.actionBtn}>
            <MessageSquare size={20} />
            <span>{report.comments_count}</span>
          </button>
          
          <button className={`${styles.actionBtn} ${styles.shareBtn}`}>
            <Share2 size={20} />
            <span>{report.shares}</span>
            <div className={styles.multiplierLabel}>5x Heat</div>
          </button>
        </div>
      </div>
    </Card>
  );
}
