import { HTMLAttributes, forwardRef } from "react";
import styles from "./Card.module.css";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", hoverEffect = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.card} ${hoverEffect ? styles.hoverEffect : ""} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
