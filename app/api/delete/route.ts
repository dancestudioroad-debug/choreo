import { createClient } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

const BUCKET = 'uploads'

export async function DELETE(request: NextRequest) {
  try {
    const { url, pathname } = await request.json()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Missing Supabase environment variables' },
        { status: 500 }
      )
    }

    const objectPath = normalizeObjectPath({ url, pathname, supabaseUrl })

    if (!objectPath) {
      return NextResponse.json({ error: 'No valid file path provided' }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { error } = await supabase.storage.from(BUCKET).remove([objectPath])

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}

function normalizeObjectPath(input: { url?: string; pathname?: string; supabaseUrl: string }) {
  if (input.pathname && typeof input.pathname === 'string') {
    return input.pathname.replace(/^\/+/, '')
  }

  if (!input.url || typeof input.url !== 'string') {
    return null
  }

  const publicPrefix = `${input.supabaseUrl}/storage/v1/object/public/${BUCKET}/`
  if (!input.url.startsWith(publicPrefix)) {
    return null
  }

  return decodeURIComponent(input.url.slice(publicPrefix.length))
}
