import styles from "./Avatar.module.css";
import { User } from "lucide-react";

interface AvatarProps {
  src?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
  isOnline?: boolean;
}

export function Avatar({ src, fallback, size = "md", isOnline = false }: AvatarProps) {
  return (
    <div className={`${styles.avatarContainer} ${styles[size]}`}>
      {src ? (
        <img src={src} alt="Avatar" className={styles.image} />
      ) : (
        <div className={styles.fallback}>
          {fallback ? fallback : <User size={size === "sm" ? 14 : size === "md" ? 18 : 24} />}
        </div>
      )}
      
      {isOnline && <div className={styles.onlineIndicator} />}
    </div>
  );
}
