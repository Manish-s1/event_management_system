import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import crypto from 'crypto'
import { mkdir, writeFile } from 'fs/promises'

export const runtime = 'nodejs'

function sanitizeFolder(input: string | null): string {
  const candidate = (input ?? 'others').trim()
  const safe = candidate.replace(/[^a-zA-Z0-9_-]/g, '')
  return safe.length > 0 ? safe : 'others'
}

function pickExtension(fileName: string, mimeType: string): string {
  const extFromName = path.extname(fileName || '').toLowerCase()
  if (extFromName && extFromName.length <= 10) return extFromName

  // Fallback mapping for common image types
  switch (mimeType) {
    case 'image/jpeg':
      return '.jpg'
    case 'image/png':
      return '.png'
    case 'image/webp':
      return '.webp'
    case 'image/gif':
      return '.gif'
    case 'image/svg+xml':
      return '.svg'
    default:
      return ''
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const folder = sanitizeFolder(searchParams.get('folder'))
    const dateFolder = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

    const formData = await request.formData()
    const candidate =
      formData.get('image') ??
      formData.get('file') ??
      formData.get('qr') ??
      formData.get('paymentQR')

    // In some runtimes the value may not pass `instanceof File` even though it is file-like.
    // We only require `arrayBuffer()` to exist.
    if (!candidate || typeof (candidate as unknown as { arrayBuffer?: unknown }).arrayBuffer !== 'function') {
      return NextResponse.json(
        { error: 'Missing file. Send multipart/form-data with a file field named "image" (also accepts "file", "qr", "paymentQR").' },
        { status: 400 }
      )
    }

    const fileLike = candidate as unknown as { name?: string; type?: string; arrayBuffer: () => Promise<ArrayBuffer> }
    const extension = pickExtension(fileLike.name ?? '', fileLike.type ?? '')
    const fileName = `${crypto.randomUUID()}${extension}`

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder, dateFolder)
    await mkdir(uploadDir, { recursive: true })

    const bytes = await fileLike.arrayBuffer()
    await writeFile(path.join(uploadDir, fileName), Buffer.from(bytes))

    return NextResponse.json({ url: `/uploads/${folder}/${dateFolder}/${fileName}` }, { status: 200 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
