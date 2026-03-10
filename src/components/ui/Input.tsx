import { InputHTMLAttributes, forwardRef } from "react";
import styles from "./Input.module.css";
import { LucideIcon } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, icon: Icon, ...props }, ref) => {
    return (
      <div className={`${styles.wrapper} ${className}`}>
        {label && <label className={styles.label}>{label}</label>}
        
        <div className={styles.inputContainer}>
          {Icon && (
            <div className={styles.iconWrapper}>
              <Icon size={18} className={styles.icon} />
            </div>
          )}
          
          <input
            ref={ref}
            className={`
              ${styles.input} 
              ${Icon ? styles.withIcon : ""} 
              ${error ? styles.errorInput : ""}
            `}
            {...props}
          />
        </div>
        
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
