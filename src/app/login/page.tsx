import { login } from './actions'
import styles from './page.module.css'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Shield, Eye } from 'lucide-react'
import Link from 'next/link'
import GoogleAuthButton from '@/components/auth/GoogleAuthButton'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const params = await searchParams

  return (
    <div className={styles.container}>
      <Card className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <Eye size={32} color="var(--color-primary)" />
          </div>
          <h1 className={styles.title}>Macho ya Raia</h1>
          <p className={styles.subtitle}>Welcome back! Sign in to continue.</p>
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
            />
          </div>

          {params?.message && (
            <p className={
              params.message.toLowerCase().includes('success') 
                ? styles.successMessage 
                : styles.message
            }>
              {params.message}
            </p>
          )}

          <div className={styles.actions}>
            <Button formAction={login} className={styles.submitBtn}>
              Sign In
            </Button>
          </div>
        </form>

        <div className={styles.divider}>
          <span>or connect with</span>
        </div>

        <GoogleAuthButton styles={styles} />
        
        <div className={styles.footerNote}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" style={{ color: 'var(--color-primary)', marginLeft: '4px' }}>Sign up</Link>
        </div>
        
        <div className={styles.footerNote} style={{ marginTop: '8px' }}>
          <Shield size={14} /> Securing citizen data
        </div>
      </Card>
    </div>
  )
}
