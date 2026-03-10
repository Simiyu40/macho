'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?message=Could not authenticate user')
  }

  revalidatePath('/', 'layout')
  redirect('/profile')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // Use the origin from the headers to set the email redirect to
  const headersList = await headers();
  const origin = headersList.get('origin') || 'http://localhost:3000';

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    redirect('/login?message=Could not sign up user')
  }

  redirect('/login?message=Check email to continue sign in process')
}

export async function signInWithGoogle() {
  const supabase = await createClient()

  // Use the origin from the headers to set the redirect to
  const headersList = await headers();
  const origin = headersList.get('origin') || 'http://localhost:3000';
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    redirect('/login?message=Could not authenticate via Google')
  }

  if (data.url) {
    redirect(data.url)
  }
}
