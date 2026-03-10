import { Card } from "./Card";
import styles from "./StatCard.module.css";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: { value: number; isUp: boolean };
  icon: LucideIcon;
  color?: string;
}

export function StatCard({ title, value, trend, icon: Icon, color = "var(--color-primary)" }: StatCardProps) {
  return (
    <Card className={styles.statCard} hoverEffect>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <div className={styles.iconWrapper} style={{ backgroundColor: `${color}15`, color }}>
          <Icon size={20} />
        </div>
      </div>
      <div className={styles.valueRow}>
        <h3 className={styles.value}>{value}</h3>
        {trend && (
          <span className={`${styles.trend} ${trend.isUp ? styles.trendUp : styles.trendDown}`}>
            {trend.isUp ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </Card>
  );
}
