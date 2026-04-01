import { createClient } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'

const BUCKET = 'uploads'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as string || 'other'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Missing Supabase environment variables' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const filename = buildFilename(category, file.name)
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filename, buffer, {
        contentType: file.type || undefined,
        upsert: false,
      })

    if (uploadError) {
      throw uploadError
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(filename)

    const publicUrl = publicUrlData.publicUrl

    return NextResponse.json({ 
      url: publicUrl,
      pathname: filename,
      name: file.name,
      type: getFileType(file.type),
      category
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

function getFileType(mimeType: string): 'image' | 'video' | 'pdf' | 'audio' {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType === 'application/pdf') return 'pdf'
  if (mimeType.startsWith('audio/')) return 'audio'
  return 'image' // default
}

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_')
}

function buildFilename(category: string, originalName: string) {
  const timestamp = Date.now()
  return `${category}/${timestamp}-${sanitizeFileName(originalName)}`
}
