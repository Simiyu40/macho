import { signup } from '@/app/login/actions'
import styles from '@/app/login/page.module.css'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Shield, Eye } from 'lucide-react'
import Link from 'next/link'
import GoogleAuthButton from '@/components/auth/GoogleAuthButton'

export default function SignupPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className={styles.container}>
      <Card className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <Eye size={32} color="var(--color-primary)" />
          </div>
          <h1 className={styles.title}>Join Macho ya Raia</h1>
          <p className={styles.subtitle}>Sign up to empower your community.</p>
        </div>

        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="citizen@kenya.co.ke"
              required 
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              placeholder="••••••••"
              required 
              minLength={6}
            />
          </div>

          {searchParams?.message && (
            <p className={styles.message}>{searchParams.message}</p>
          )}

          <div className={styles.actions}>
            <Button formAction={signup} className={styles.submitBtn}>
              Create Account
            </Button>
          </div>
        </form>

        <div className={styles.divider}>
          <span>or sign up with</span>
        </div>

        <GoogleAuthButton styles={styles} />
        
        <div className={styles.footerNote}>
          Already have an account? <Link href="/login" style={{ color: 'var(--color-primary)', marginLeft: '4px' }}>Log In</Link>
        </div>
        
        <div className={styles.footerNote} style={{ marginTop: '8px' }}>
          <Shield size={14} /> Securing citizen data
        </div>
      </Card>
    </div>
  )
}
