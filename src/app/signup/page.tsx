import { signup } from '@/app/login/actions'
import styles from '@/app/login/page.module.css'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Shield, Eye } from 'lucide-react'
import Link from 'next/link'
import GoogleAuthButton from '@/components/auth/GoogleAuthButton'

export default async function SignupPage({
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
          <h1 className={styles.title}>Join Macho ya Raia</h1>
          <p className={styles.subtitle}>Create your account to empower your community.</p>
        </div>

        <form className={styles.form}>
          <div className={styles.nameRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="firstName">First Name</label>
              <input 
                id="firstName" 
                name="firstName" 
                type="text" 
                placeholder="Wanjiku"
                required 
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="lastName">Last Name</label>
              <input 
                id="lastName" 
                name="lastName" 
                type="text" 
                placeholder="Kamau"
                required 
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input 
              id="username" 
              name="username" 
              type="text" 
              placeholder="wanjiku_citizen"
              required 
              minLength={3}
              maxLength={20}
            />
          </div>

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
              placeholder="Min 6 characters"
              required 
              minLength={6}
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
