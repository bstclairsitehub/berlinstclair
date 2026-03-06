'use server'

import { put } from '@vercel/blob'

export async function uploadImage(
  formData: FormData
): Promise<{ url: string }> {
  const file = formData.get('file') as File
  if (!file) throw new Error('No file provided')

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('File must be an image (JPEG, PNG, WebP, GIF, or AVIF)')
  }

  const maxSize = 10 * 1024 * 1024 // 10 MB
  if (file.size > maxSize) {
    throw new Error('Image must be smaller than 10 MB')
  }

  const ext = file.name.split('.').pop()
  const filename = `articles/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const blob = await put(filename, file, { access: 'public' })
  return { url: blob.url }
}
