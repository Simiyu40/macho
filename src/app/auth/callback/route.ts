import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'

  // Determine the base URL for redirection
  // We use requestUrl.origin to ensure we stay on the same domain/port
  const baseUrl = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${baseUrl}${next}`)
    }
    
    console.error('Auth error during code exchange:', error.message)
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${baseUrl}/login?message=Could not login with provider`)
}
