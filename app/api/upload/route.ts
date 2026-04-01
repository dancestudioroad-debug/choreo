import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as string || 'other'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const filename = buildFilename(category, file.name)
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN
    const shouldUseBlob = typeof blobToken === 'string' && blobToken.length > 0

    if (shouldUseBlob) {
      const blob = await put(filename, file, {
        access: 'public',
      })

      return NextResponse.json({ 
        url: blob.url,
        pathname: blob.pathname,
        name: file.name,
        type: getFileType(file.type),
        category
      })
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', category)
    await mkdir(uploadDir, { recursive: true })

    const safeName = `${Date.now()}-${sanitizeFileName(file.name)}-${randomUUID()}`
    const absolutePath = path.join(uploadDir, safeName)
    const arrayBuffer = await file.arrayBuffer()
    await writeFile(absolutePath, Buffer.from(arrayBuffer))

    const localUrl = `/uploads/${category}/${safeName}`

    return NextResponse.json({ 
      url: localUrl,
      pathname: localUrl,
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
