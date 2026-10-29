import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { isAdmin } from '@/lib/books-admin';

export const dynamic = 'force-dynamic';

const MAX_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request): Promise<Response> {
  if (!isAdmin()) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'no file' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'too large (max 10MB)' }, { status: 413 });
  }

  const safeName = (file.name || 'image').replace(/[^\w.\-]/g, '_');
  const key = `uploads/${Date.now()}-${safeName}`;

  try {
    const blob = await put(key, file, {
      access: 'public',
      addRandomSuffix: true,
      contentType: file.type || undefined,
    });
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error('blob upload failed:', err);
    return NextResponse.json({ error: 'upload failed' }, { status: 500 });
  }
}
