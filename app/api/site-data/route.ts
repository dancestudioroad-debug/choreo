import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const TABLE_NAME = 'site_content'
const ROW_ID = 'global'

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

export async function GET() {
  try {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('payload')
      .eq('id', ROW_ID)
      .maybeSingle()

    if (error) {
      throw error
    }

    return NextResponse.json({ payload: data?.payload ?? null })
  } catch (error) {
    console.error('Site data fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch site data' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const payload = body?.payload

    if (!payload || typeof payload !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const supabase = getSupabase()

    const { error } = await supabase
      .from(TABLE_NAME)
      .upsert(
        {
          id: ROW_ID,
          payload,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Site data save error:', error)
    return NextResponse.json({ error: 'Failed to save site data' }, { status: 500 })
  }
}
